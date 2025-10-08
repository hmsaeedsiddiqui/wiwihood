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

async function updateReferralsSchema() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // First, let's update the referrals table to match the entity
    console.log('\n=== UPDATING REFERRALS TABLE ===');
    
    // Add missing columns and update existing ones
    const referralsUpdates = [
      // Add referrerReward and refereeReward columns
      `ALTER TABLE referrals ADD COLUMN IF NOT EXISTS "referrerReward" DECIMAL(10,2) DEFAULT NULL`,
      `ALTER TABLE referrals ADD COLUMN IF NOT EXISTS "refereeReward" DECIMAL(10,2) DEFAULT NULL`,
      
      // Add referrerRewardType and refereeRewardType columns  
      `ALTER TABLE referrals ADD COLUMN IF NOT EXISTS "referrerRewardType" VARCHAR(50) DEFAULT NULL`,
      `ALTER TABLE referrals ADD COLUMN IF NOT EXISTS "refereeRewardType" VARCHAR(50) DEFAULT NULL`,
      
      // Add completingBookingId column
      `ALTER TABLE referrals ADD COLUMN IF NOT EXISTS "completingBookingId" UUID DEFAULT NULL`,
      
      // Drop old columns that are not needed
      `ALTER TABLE referrals DROP COLUMN IF EXISTS "rewardAmount"`,
      `ALTER TABLE referrals DROP COLUMN IF EXISTS "rewardType"`,
      `ALTER TABLE referrals DROP COLUMN IF EXISTS "rewardGiven"`
    ];
    
    for (const query of referralsUpdates) {
      try {
        console.log('Executing:', query);
        await client.query(query);
        console.log('✅ Success');
      } catch (error) {
        console.log('❌ Error:', error.message);
      }
    }
    
    // Update referral_codes table
    console.log('\n=== UPDATING REFERRAL_CODES TABLE ===');
    
    const codesUpdates = [
      // Rename user_id to userId  
      `ALTER TABLE referral_codes RENAME COLUMN "user_id" TO "userId"`
    ];
    
    for (const query of codesUpdates) {
      try {
        console.log('Executing:', query);
        await client.query(query);
        console.log('✅ Success');
      } catch (error) {
        console.log('❌ Error:', error.message);
      }
    }
    
    console.log('\n=== SCHEMA UPDATE COMPLETED ===');
    
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await client.end();
  }
}

updateReferralsSchema();