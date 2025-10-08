const { Client } = require('pg');

async function fixLoyaltyTableName() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Rename loyalty table to loyalty_accounts
    await client.query('ALTER TABLE loyalty RENAME TO loyalty_accounts;');
    console.log('✅ Renamed loyalty table to loyalty_accounts');

    // Update the foreign key reference in loyalty_transactions
    await client.query('ALTER TABLE loyalty_transactions RENAME COLUMN loyalty_id TO loyalty_account_id;');
    console.log('✅ Renamed loyalty_id to loyalty_account_id in transactions table');

    // Update the foreign key constraint
    await client.query(`
      ALTER TABLE loyalty_transactions 
      DROP CONSTRAINT loyalty_transactions_loyalty_id_fkey;
    `);
    
    await client.query(`
      ALTER TABLE loyalty_transactions 
      ADD CONSTRAINT loyalty_transactions_loyalty_account_id_fkey 
      FOREIGN KEY (loyalty_account_id) REFERENCES loyalty_accounts(id) ON DELETE CASCADE;
    `);
    console.log('✅ Updated foreign key constraint');

    // Update index name
    await client.query('DROP INDEX IF EXISTS idx_loyalty_user_id;');
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_user_id ON loyalty_accounts(user_id);');
    console.log('✅ Updated index');

    // Verify the table structure
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_accounts' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Loyalty_accounts table structure:');
    console.table(columns.rows);

    console.log('\n🎉 Database schema fixed for loyalty system!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

fixLoyaltyTableName();