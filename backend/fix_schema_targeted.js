const { Client } = require('pg');

async function fixGiftCardsSchemaTargeted() {
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

    console.log('Step 1: Renaming columns to match entity expectations...');
    
    // Rename amount to original_amount
    await client.query('ALTER TABLE gift_cards RENAME COLUMN amount TO original_amount;');
    console.log('✅ Renamed amount → original_amount');

    // Rename balance to current_balance
    await client.query('ALTER TABLE gift_cards RENAME COLUMN balance TO current_balance;');
    console.log('✅ Renamed balance → current_balance');

    // Rename current_owner_id to recipient_id
    await client.query('ALTER TABLE gift_cards RENAME COLUMN current_owner_id TO recipient_id;');
    console.log('✅ Renamed current_owner_id → recipient_id');

    console.log('Step 2: Adding missing columns...');
    
    // Add redeemed_at column
    await client.query('ALTER TABLE gift_cards ADD COLUMN redeemed_at TIMESTAMP NULL;');
    console.log('✅ Added redeemed_at column');

    // Add purchased_at column (use created_at value if exists)
    await client.query('ALTER TABLE gift_cards ADD COLUMN purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;');
    await client.query('UPDATE gift_cards SET purchased_at = created_at WHERE purchased_at IS NULL;');
    console.log('✅ Added purchased_at column and copied from created_at');

    console.log('Step 3: Verifying updated schema...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'gift_cards'
      AND column_name IN ('original_amount', 'current_balance', 'recipient_id', 'redeemed_at', 'purchased_at')
      ORDER BY column_name;
    `);
    
    console.log('Updated columns:');
    result.rows.forEach(row => {
      console.log(`✅ ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    console.log('\n🎉 Gift Cards schema successfully updated!');
    
  } catch (error) {
    console.error('Error fixing schema:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

fixGiftCardsSchemaTargeted();