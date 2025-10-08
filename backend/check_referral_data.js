const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkReferralData() {
  try {
    console.log('Checking referral system data...\n');
    
    // Check referral codes
    const codes = await pool.query('SELECT * FROM referral_codes ORDER BY "createdAt" DESC LIMIT 5;');
    console.log('📋 Recent Referral Codes:');
    if (codes.rows.length > 0) {
      codes.rows.forEach(code => {
        console.log(`  Code: ${code.code} | Active: ${code.isActive} | Uses: ${code.totalUses}/${code.maxUses} | User: ${code.userId}`);
      });
    } else {
      console.log('  No referral codes found');
    }
    
    // Check users
    const users = await pool.query('SELECT id, email, "firstName", "lastName" FROM users ORDER BY "createdAt" DESC LIMIT 5;');
    console.log('\n👥 Recent Users:');
    if (users.rows.length > 0) {
      users.rows.forEach(user => {
        console.log(`  ${user.id} | ${user.email} | ${user.firstName} ${user.lastName}`);
      });
    } else {
      console.log('  No users found');
    }
    
    // Check referrals
    const referrals = await pool.query('SELECT * FROM referrals ORDER BY "createdAt" DESC LIMIT 5;');
    console.log('\n🔗 Recent Referrals:');
    if (referrals.rows.length > 0) {
      referrals.rows.forEach(ref => {
        console.log(`  ID: ${ref.id} | Status: ${ref.status} | Referrer: ${ref.referrerId} | Referee: ${ref.refereeId}`);
      });
    } else {
      console.log('  No referrals found');
    }
    
    // Decode the JWT to see which user is making the request
    console.log('\n🔑 JWT Token Analysis:');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NzQzNDM3LCJleHAiOjE3NTk3NDcwMzd9.TbtJU1vp2-ut59-ECQZZnIb9votXI600kp5SDSddp34';
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log(`  Current user: ${payload.email} (ID: ${payload.sub})`);
    
  } catch (error) {
    console.error('❌ Error checking referral data:', error.message);
  } finally {
    await pool.end();
  }
}

checkReferralData();