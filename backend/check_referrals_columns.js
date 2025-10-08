const { Client } = require('pg');

const client = new Client({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkReferralsColumns() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check referrals table columns
    const referralsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'referrals' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n=== REFERRALS TABLE COLUMNS ===');
    const referralsResult = await client.query(referralsQuery);
    referralsResult.rows.forEach(row => {
      console.log(`${row.column_name} | ${row.data_type} | nullable: ${row.is_nullable} | default: ${row.column_default}`);
    });
    
    // Check referral_codes table columns
    const codesQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'referral_codes' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n=== REFERRAL_CODES TABLE COLUMNS ===');
    const codesResult = await client.query(codesQuery);
    codesResult.rows.forEach(row => {
      console.log(`${row.column_name} | ${row.data_type} | nullable: ${row.is_nullable} | default: ${row.column_default}`);
    });
    
  } catch (error) {
    console.error('Error checking columns:', error);
  } finally {
    await client.end();
  }
}

checkReferralsColumns();