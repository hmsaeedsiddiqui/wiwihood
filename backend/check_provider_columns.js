const { Client } = require('pg');
require('dotenv').config();

async function checkProviderColumns() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check what columns exist in providers table
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Providers table columns:');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    // Get sample provider data
    const providerResult = await client.query('SELECT * FROM providers LIMIT 1');
    console.log('\n📋 Sample provider data:');
    if (providerResult.rows.length > 0) {
      console.log(JSON.stringify(providerResult.rows[0], null, 2));
    } else {
      console.log('No providers found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkProviderColumns();