const { Client } = require('pg');

const client = new Client({
  host: 'reservista-db.clpv2pqjqtv2.us-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'reservista_admin', 
  password: 'Reservista123!',
  database: 'reservista_db'
});

async function checkColumns() {
  try {
    await client.connect();
    
    // Check point_transactions columns
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'point_transactions' 
      ORDER BY ordinal_position
    `);
    
    console.log('Point Transactions columns:', result.rows.map(r => r.column_name));
    
    // Check loyalty_accounts columns too
    const loyaltyResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_accounts' 
      ORDER BY ordinal_position
    `);
    
    console.log('Loyalty Accounts columns:', loyaltyResult.rows.map(r => r.column_name));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkColumns();