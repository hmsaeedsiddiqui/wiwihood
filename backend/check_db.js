const { Client } = require('pg');

async function checkDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432, 
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root',
  });

  try {
    await client.connect();
    console.log('=== DATABASE CONNECTION SUCCESSFUL ===');
    
    // Check provider table structure
    console.log('\n=== PROVIDER TABLE STRUCTURE ===');
    const structure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      ORDER BY ordinal_position;
    `);
    console.log('Provider table columns:', structure.rows);
    
    // Check existing providers
    console.log('\n=== EXISTING PROVIDERS ===');
    const providersCount = await client.query('SELECT COUNT(*) FROM providers;');
    console.log('Total providers:', providersCount.rows[0].count);
    
    const providers = await client.query('SELECT * FROM providers LIMIT 3;');
    console.log('Providers:', providers.rows);
    
    // Check specific user
    console.log('\n=== CHECKING SPECIFIC USER ===');
    const userById = await client.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1;', 
      ['6307cf24-70ea-4b21-a43d-f6bc2e2a3e26']
    );
    console.log('User 6307cf24-70ea-4b21-a43d-f6bc2e2a3e26:', userById.rows);
    
    // Check if user exists as provider
    console.log('\n=== CHECKING IF USER IS PROVIDER ===');
    const userAsProvider = await client.query(
      'SELECT * FROM providers WHERE id = $1;', 
      ['6307cf24-70ea-4b21-a43d-f6bc2e2a3e26']
    );
    console.log('User as provider:', userAsProvider.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkDatabase();