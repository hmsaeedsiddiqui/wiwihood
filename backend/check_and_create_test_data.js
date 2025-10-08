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

async function checkUsersAndCreateTestData() {
  try {
    console.log('🔍 Checking users in the database...\n');
    
    // Check if users table exists and get some sample users
    const usersResult = await pool.query(`
      SELECT id, email, role, is_verified, created_at 
      FROM users 
      LIMIT 5
    `);
    
    console.log('Sample users:');
    usersResult.rows.forEach(user => {
      console.log(`  ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Verified: ${user.is_verified}`);
    });
    
    // If no users exist, let's create a test user
    if (usersResult.rows.length === 0) {
      console.log('\n📝 No users found. Creating a test user...');
      
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await pool.query(`
        INSERT INTO users (email, password, role, is_verified, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['test@example.com', hashedPassword, 'customer', true, 'Test', 'User']);
      
      console.log('✅ Test user created: test@example.com / password123');
    }
    
    // Create a sample referral code for the first user
    const firstUser = usersResult.rows[0];
    if (firstUser) {
      console.log(`\n📝 Creating referral code for user ${firstUser.email}...`);
      
      // Check if referral code already exists
      const existingCode = await pool.query(`
        SELECT * FROM referral_codes WHERE user_id = $1
      `, [firstUser.id]);
      
      if (existingCode.rows.length === 0) {
        // Get the default campaign
        const campaignResult = await pool.query(`
          SELECT id FROM referral_campaigns WHERE is_active = true LIMIT 1
        `);
        
        if (campaignResult.rows.length > 0) {
          const campaignId = campaignResult.rows[0].id;
          const referralCode = `REF${firstUser.id}${Date.now().toString().slice(-4)}`;
          
          await pool.query(`
            INSERT INTO referral_codes (user_id, code, campaign_id, is_active, uses_count, max_uses)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [firstUser.id, referralCode, campaignId, true, 0, 100]);
          
          console.log(`✅ Created referral code: ${referralCode} for user ${firstUser.email}`);
        }
      } else {
        console.log(`✅ Referral code already exists: ${existingCode.rows[0].code}`);
      }
    }
    
    console.log('\n🎯 You can now test the referral endpoints with these credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   OR use any of the existing user emails shown above');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsersAndCreateTestData();