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

async function checkUserTableStructure() {
  try {
    console.log('🔍 Checking user table structure...\n');
    
    // Check table structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Get sample users with available columns
    console.log('\n📋 Sample users:');
    const usersResult = await pool.query(`
      SELECT id, email, role, created_at 
      FROM users 
      LIMIT 5
    `);
    
    if (usersResult.rows.length > 0) {
      usersResult.rows.forEach(user => {
        console.log(`  ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      });
      
      // Check if any user has a referral code
      const firstUser = usersResult.rows[0];
      const referralCheck = await pool.query(`
        SELECT code, is_active, uses_count 
        FROM referral_codes 
        WHERE user_id = $1::uuid
      `, [firstUser.id]);
      
      if (referralCheck.rows.length > 0) {
        console.log(`\n✅ User ${firstUser.email} has referral code: ${referralCheck.rows[0].code}`);
      } else {
        console.log(`\n📝 Creating referral code for ${firstUser.email}...`);
        
        // Get default campaign
        const campaignResult = await pool.query(`
          SELECT id FROM referral_campaigns WHERE is_active = true LIMIT 1
        `);
        
        if (campaignResult.rows.length > 0) {
          const campaignId = campaignResult.rows[0].id;
          const referralCode = `REF${firstUser.id.slice(-4)}${Date.now().toString().slice(-4)}`;
          
          await pool.query(`
            INSERT INTO referral_codes (user_id, code, campaign_id, is_active, uses_count, max_uses)
            VALUES ($1::uuid, $2, $3, $4, $5, $6)
          `, [firstUser.id, referralCode, campaignId, true, 0, 100]);
          
          console.log(`✅ Created referral code: ${referralCode}`);
        }
      }
      
      console.log('\n🎯 Test credentials for referral API:');
      console.log(`   Email: ${usersResult.rows[0].email}`);
      console.log('   Password: You\'ll need to check what password this user has');
      console.log('   Server URL: http://localhost:3001/api/v1');
      
    } else {
      console.log('❌ No users found in the database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserTableStructure();