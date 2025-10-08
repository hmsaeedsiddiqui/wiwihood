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

async function checkExistingReferrals() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check for existing referral codes
    console.log('\n=== EXISTING REFERRAL CODES ===');
    const codesResult = await client.query(`
      SELECT id, code, "totalUses", "maxUses", "isActive", "userId"
      FROM referral_codes 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);
    
    if (codesResult.rows.length > 0) {
      console.log('Found referral codes:');
      codesResult.rows.forEach(row => {
        console.log(`- ID: ${row.id}, Code: ${row.code}, Active: ${row.isActive}, Uses: ${row.totalUses}`);
      });
    } else {
      console.log('No referral codes found');
    }
    
    // Check for existing referrals
    console.log('\n=== EXISTING REFERRALS ===');
    const referralsResult = await client.query(`
      SELECT id, status, "referrerId", "refereeId", "referralCodeId", "createdAt"
      FROM referrals 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);
    
    if (referralsResult.rows.length > 0) {
      console.log('Found referrals:');
      referralsResult.rows.forEach(row => {
        console.log(`- ID: ${row.id}, Status: ${row.status}, Created: ${row.createdAt}`);
      });
    } else {
      console.log('No referrals found');
    }
    
    // Check for bookings that could be used
    console.log('\n=== RECENT BOOKINGS ===');
    const bookingsResult = await client.query(`
      SELECT id, "customerId", status, "createdAt"
      FROM bookings 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);
    
    if (bookingsResult.rows.length > 0) {
      console.log('Found bookings:');
      bookingsResult.rows.forEach(row => {
        console.log(`- ID: ${row.id}, Customer: ${row.customerId}, Status: ${row.status}`);
      });
    } else {
      console.log('No bookings found');
    }
    
  } catch (error) {
    console.error('Error checking data:', error.message);
  } finally {
    await client.end();
  }
}

checkExistingReferrals();