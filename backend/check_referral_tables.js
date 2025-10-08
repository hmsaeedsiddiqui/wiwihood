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

async function checkReferralTables() {
  try {
    console.log('Checking referral tables...');
    
    // Check if referral_codes table exists
    const referralCodesCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'referral_codes'
      );
    `);
    
    console.log('Referral codes table exists:', referralCodesCheck.rows[0].exists);
    
    if (referralCodesCheck.rows[0].exists) {
      // Check table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'referral_codes' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('Referral codes table columns:');
      columns.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check sample data
      const sampleData = await pool.query('SELECT COUNT(*) as count FROM referral_codes');
      console.log(`Total referral codes: ${sampleData.rows[0].count}`);
    }
    
    // Check if referrals table exists
    const referralsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'referrals'
      );
    `);
    
    console.log('Referrals table exists:', referralsCheck.rows[0].exists);
    
    if (referralsCheck.rows[0].exists) {
      // Check table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'referrals' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('Referrals table columns:');
      columns.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check sample data
      const sampleData = await pool.query('SELECT COUNT(*) as count FROM referrals');
      console.log(`Total referrals: ${sampleData.rows[0].count}`);
    }
    
    // Check referral_campaigns table
    const campaignsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'referral_campaigns'
      );
    `);
    
    console.log('Referral campaigns table exists:', campaignsCheck.rows[0].exists);
    
    if (campaignsCheck.rows[0].exists) {
      const sampleData = await pool.query('SELECT COUNT(*) as count FROM referral_campaigns');
      console.log(`Total campaigns: ${sampleData.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('Error checking referral tables:', error.message);
  } finally {
    await pool.end();
  }
}

checkReferralTables();