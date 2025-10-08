const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query to gift_cards table
    const result = await client.query('SELECT COUNT(*) FROM gift_cards');
    console.log(`✅ Gift cards count: ${result.rows[0].count}`);
    
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
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();