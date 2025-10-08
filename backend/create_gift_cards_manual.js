const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function createGiftCardsTables() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'eYKpRl8juRsTqeUPp3bg',
    database: process.env.DATABASE_NAME || 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database successfully!');

    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'create_gift_cards_tables.sql'), 'utf8');
    console.log('Executing SQL script...');
    
    // Execute the SQL script
    await client.query(sqlContent);
    
    console.log('Gift Cards tables created successfully!');
    
    // Verify tables exist
    console.log('Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('gift_cards', 'gift_card_usage')
      ORDER BY table_name;
    `);
    
    console.log('Found tables:', result.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('Error creating gift cards tables:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

createGiftCardsTables();