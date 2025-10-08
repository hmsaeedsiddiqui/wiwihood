const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function fixGiftCardsSchema() {
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
    const sqlContent = fs.readFileSync(path.join(__dirname, 'fix_gift_cards_schema.sql'), 'utf8');
    console.log('Executing schema fix SQL script...');
    
    // Execute the SQL script
    await client.query(sqlContent);
    
    console.log('Gift Cards schema updated successfully!');
    
    // Verify the updated schema
    console.log('Verifying updated schema...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'gift_cards'
      ORDER BY ordinal_position;
    `);
    
    console.log('Gift Cards table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
  } catch (error) {
    console.error('Error fixing gift cards schema:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

fixGiftCardsSchema();