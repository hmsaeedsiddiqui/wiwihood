const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createReferralTables() {
  try {
    console.log('Creating referral tables...');
    
    // Read and execute the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('./create_referral_tables.sql', 'utf8');
    
    await pool.query(sql);
    console.log('✅ Referral tables created successfully!');
    
    // Verify tables were created
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('referral_codes', 'referrals', 'referral_campaigns')
      ORDER BY table_name;
    `);
    
    console.log('Created tables:', tablesCheck.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('❌ Error creating referral tables:', error.message);
  } finally {
    await pool.end();
  }
}

createReferralTables();