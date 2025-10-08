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

async function testReferralQuery() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Test a query that would mimic what the service is trying to do
    const testQuery = `
      SELECT 
        r.id,
        r.status,
        r."completedAt",
        r."referrerReward",
        r."refereeReward",
        r."referrerRewardType",
        r."refereeRewardType",
        r."completingBookingId",
        r."createdAt",
        r."updatedAt",
        r."referrerId",
        r."refereeId",
        r."referralCodeId"
      FROM referrals r
      LIMIT 1
    `;
    
    console.log('\n=== TESTING REFERRAL QUERY ===');
    console.log('Query:', testQuery);
    
    const result = await client.query(testQuery);
    console.log('✅ Query executed successfully!');
    console.log('Columns in result:', Object.keys(result.fields || {}));
    
    if (result.rows.length > 0) {
      console.log('Sample row:', result.rows[0]);
    } else {
      console.log('No referral records found (which is expected)');
    }
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
  } finally {
    await client.end();
  }
}

testReferralQuery();