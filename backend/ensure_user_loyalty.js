const { Client } = require('pg');

async function ensureUserLoyaltyAccount() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // First, let's check if the user exists
    const userCheck = await client.query(`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE id = '474a5df3-60cf-446a-b446-a9763b26a81e';
    `);
    
    if (userCheck.rows.length === 0) {
      console.log('❌ User not found in database!');
      return;
    }
    
    console.log('👤 User found:', userCheck.rows[0]);

    // Check if loyalty account exists for this user
    const loyaltyCheck = await client.query(`
      SELECT * FROM loyalty_accounts 
      WHERE "userId" = '474a5df3-60cf-446a-b446-a9763b26a81e';
    `);
    
    if (loyaltyCheck.rows.length === 0) {
      console.log('❌ No loyalty account found. Creating one...');
      
      // Create loyalty account
      await client.query(`
        INSERT INTO loyalty_accounts ("userId", "currentPoints", "totalPointsEarned", "totalPointsRedeemed", tier, "pointsToNextTier")
        VALUES ('474a5df3-60cf-446a-b446-a9763b26a81e', 100, 100, 0, 'bronze'::loyalty_tier_enum, 400);
      `);
      console.log('✅ Created loyalty account for user');
    } else {
      console.log('✅ Loyalty account exists');
      console.table(loyaltyCheck.rows);
    }

    // Final verification
    const finalCheck = await client.query(`
      SELECT la.id, la."currentPoints", la.tier, la."totalPointsEarned", 
             u.email, u.first_name, u.last_name
      FROM loyalty_accounts la
      JOIN users u ON la."userId" = u.id
      WHERE la."userId" = '474a5df3-60cf-446a-b446-a9763b26a81e';
    `);
    
    console.log('\n📊 Final verification - User with loyalty account:');
    console.table(finalCheck.rows);

    console.log('\n🎉 User loyalty account is ready!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

ensureUserLoyaltyAccount();