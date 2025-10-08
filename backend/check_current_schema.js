const { Client } = require('pg');

async function checkCurrentSchema() {
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

    // Check current gift_cards table schema
    console.log('Current gift_cards table columns:');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'gift_cards'
      ORDER BY ordinal_position;
    `);
    
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`);
    });

    // Check what the entity expects vs what we have
    console.log('\n--- Checking key column mismatches ---');
    const expectedColumns = ['original_amount', 'current_balance', 'purchaser_id', 'recipient_id', 'redeemed_at', 'purchased_at'];
    const actualColumns = result.rows.map(row => row.column_name);
    
    expectedColumns.forEach(col => {
      if (!actualColumns.includes(col)) {
        console.log(`❌ MISSING: ${col}`);
      } else {
        console.log(`✅ EXISTS: ${col}`);
      }
    });

    // Check for columns that might need renaming
    console.log('\n--- Checking columns that might need renaming ---');
    const potentialRenames = {
      'amount': 'original_amount',
      'balance': 'current_balance',
      'created_by_user_id': 'purchaser_id',
      'recipient_user_id': 'recipient_id'
    };

    Object.entries(potentialRenames).forEach(([old, new_name]) => {
      if (actualColumns.includes(old) && !actualColumns.includes(new_name)) {
        console.log(`🔄 NEEDS RENAME: ${old} → ${new_name}`);
      }
    });
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

checkCurrentSchema();