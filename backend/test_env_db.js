require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Using connection details:');
    console.log('Host:', process.env.DATABASE_HOST);
    console.log('Port:', process.env.DATABASE_PORT);
    console.log('Username:', process.env.DATABASE_USERNAME);
    console.log('Database:', process.env.DATABASE_NAME);
    console.log('SSL:', process.env.DATABASE_SSL);
    
    console.log('\nConnecting to database...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test if gift_cards table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gift_cards'
      );
    `);
    console.log(`✅ Gift cards table exists: ${tableCheck.rows[0].exists}`);
    
    if (tableCheck.rows[0].exists) {
      // Test the schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'gift_cards' 
        ORDER BY ordinal_position
      `);
      console.log('✅ Gift cards table schema:');
      schemaResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
      
      // Test a simple query
      const result = await client.query('SELECT COUNT(*) FROM gift_cards');
      console.log(`✅ Gift cards count: ${result.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

testConnection();