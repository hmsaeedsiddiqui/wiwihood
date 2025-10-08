const { Client } = require('pg');

async function fixDuplicateIndex() {
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

    // Check if the problematic index exists
    console.log('Checking for conflicting index...');
    const indexCheck = await client.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE indexname = 'IDX_692a909ee0fa9383e7859f9b40';
    `);
    
    if (indexCheck.rows.length > 0) {
      console.log('Found conflicting index:', indexCheck.rows[0]);
      console.log('Dropping conflicting index...');
      
      // Drop the existing index
      await client.query(`DROP INDEX IF EXISTS "IDX_692a909ee0fa9383e7859f9b40";`);
      console.log('Conflicting index dropped successfully!');
    } else {
      console.log('No conflicting index found.');
    }

    // Also check for any similar indexes on loyalty_accounts table
    console.log('Checking for indexes on loyalty_accounts table...');
    const loyaltyIndexes = await client.query(`
      SELECT indexname, tablename, indexdef
      FROM pg_indexes 
      WHERE tablename = 'loyalty_accounts';
    `);
    
    console.log('Found indexes on loyalty_accounts:', loyaltyIndexes.rows);

  } catch (error) {
    console.error('Error fixing duplicate index:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

fixDuplicateIndex();