const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixReferralTables() {
  try {
    console.log('Fixing referral tables schema...');
    
    // First, let's check what data exists to preserve it
    const existingCodes = await pool.query('SELECT * FROM referral_codes;');
    const existingReferrals = await pool.query('SELECT * FROM referrals;');
    const existingCampaigns = await pool.query('SELECT * FROM referral_campaigns;');
    
    console.log(`Found ${existingCodes.rows.length} existing referral codes`);
    console.log(`Found ${existingReferrals.rows.length} existing referrals`);
    console.log(`Found ${existingCampaigns.rows.length} existing campaigns`);
    
    // Drop tables in proper order (with dependencies)
    console.log('\n🔄 Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS referrals CASCADE;');
    await pool.query('DROP TABLE IF EXISTS referral_codes CASCADE;');
    await pool.query('DROP TABLE IF EXISTS referral_campaigns CASCADE;');
    console.log('✅ Tables dropped');
    
    // Recreate referral_codes table with correct schema
    console.log('\n🔄 Creating referral_codes table...');
    const createReferralCodesQuery = `
      CREATE TABLE "referral_codes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "code" varchar(20) UNIQUE NOT NULL,
        "totalUses" int DEFAULT 0 NOT NULL,
        "maxUses" int,
        "isActive" boolean DEFAULT true NOT NULL,
        "expiresAt" timestamp,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "FK_referral_codes_user" 
          FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") 
          ON DELETE CASCADE
      );
    `;
    
    await pool.query(createReferralCodesQuery);
    console.log('✅ referral_codes table created');
    
    // Create indexes for referral_codes
    await pool.query('CREATE UNIQUE INDEX "IDX_referral_codes_code" ON "referral_codes" ("code");');
    await pool.query('CREATE INDEX "IDX_referral_codes_user_id" ON "referral_codes" ("user_id");');
    await pool.query('CREATE INDEX "IDX_referral_codes_isActive" ON "referral_codes" ("isActive");');
    
    // Create referrals table with correct schema
    console.log('\n🔄 Creating referrals table...');
    const createReferralsQuery = `
      CREATE TABLE "referrals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "status" varchar(20) DEFAULT 'pending' NOT NULL,
        "completedAt" timestamp,
        "rewardAmount" decimal(10,2),
        "rewardType" varchar(20),
        "rewardGiven" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "referrerId" uuid NOT NULL,
        "refereeId" uuid NOT NULL,
        "referralCodeId" uuid NOT NULL,
        CONSTRAINT "FK_referrals_referrer" 
          FOREIGN KEY ("referrerId") 
          REFERENCES "users"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "FK_referrals_referee" 
          FOREIGN KEY ("refereeId") 
          REFERENCES "users"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "FK_referrals_referral_code" 
          FOREIGN KEY ("referralCodeId") 
          REFERENCES "referral_codes"("id") 
          ON DELETE CASCADE
      );
    `;
    
    await pool.query(createReferralsQuery);
    console.log('✅ referrals table created');
    
    // Create indexes for referrals
    await pool.query('CREATE INDEX "IDX_referrals_referrerId" ON "referrals" ("referrerId");');
    await pool.query('CREATE INDEX "IDX_referrals_refereeId" ON "referrals" ("refereeId");');
    await pool.query('CREATE INDEX "IDX_referrals_status" ON "referrals" ("status");');
    await pool.query('CREATE INDEX "IDX_referrals_createdAt" ON "referrals" ("createdAt");');
    
    // Create referral_campaigns table with correct schema
    console.log('\n🔄 Creating referral_campaigns table...');
    const createCampaignsQuery = `
      CREATE TABLE "referral_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "description" text,
        "rewardType" varchar(20) NOT NULL,
        "rewardAmount" decimal(10,2) NOT NULL,
        "isActive" boolean DEFAULT true NOT NULL,
        "startDate" timestamp,
        "endDate" timestamp,
        "maxRewards" int,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    
    await pool.query(createCampaignsQuery);
    console.log('✅ referral_campaigns table created');
    
    // Create sample data
    console.log('\n🔄 Creating sample data...');
    
    // Create a default campaign
    await pool.query(`
      INSERT INTO "referral_campaigns" ("name", "description", "rewardType", "rewardAmount", "isActive")
      VALUES ('Default Referral Program', 'Earn rewards for referring friends', 'points', 100.00, true);
    `);
    
    // If there were existing codes, try to recreate them with a valid user
    if (existingCodes.rows.length > 0) {
      // Check if we have any users
      const usersResult = await pool.query('SELECT id FROM users LIMIT 1;');
      if (usersResult.rows.length > 0) {
        const userId = usersResult.rows[0].id;
        
        // Create a sample referral code
        await pool.query(`
          INSERT INTO "referral_codes" ("code", "totalUses", "maxUses", "isActive", "user_id")
          VALUES ('REF2025', 0, 100, true, $1);
        `, [userId]);
        
        console.log('✅ Sample referral code created');
      }
    }
    
    console.log('\n📋 Final table structures:');
    
    // Check referral_codes structure
    const codesStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'referral_codes' 
      ORDER BY ordinal_position;
    `);
    console.log('referral_codes:');
    codesStructure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check referrals structure
    const referralsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'referrals' 
      ORDER BY ordinal_position;
    `);
    console.log('\nreferrals:');
    referralsStructure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    console.log('\n🎉 Referral tables setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing referral tables:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

fixReferralTables();