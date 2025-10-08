const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false }
});

async function checkContactTable() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check if contact_messages table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'contact_messages'
    `);
    
    console.log('Contact table exists:', tableCheck.rows.length > 0);
    
    if (tableCheck.rows.length > 0) {
      // Check table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'contact_messages'
        ORDER BY ordinal_position
      `);
      
      console.log('\nTable structure:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check if there's any data
      const countResult = await client.query('SELECT COUNT(*) FROM contact_messages');
      console.log(`\nNumber of records: ${countResult.rows[0].count}`);
    } else {
      console.log('\nTable does not exist. Creating contact_messages table...');
      
      await client.query(`
        CREATE TABLE contact_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'new',
          admin_response TEXT,
          responded_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('contact_messages table created successfully!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkContactTable();