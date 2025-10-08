const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function testLogin() {
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
    console.log('✅ Connected to AWS database');

    // Get john.doe@example.com user details
    const result = await client.query("SELECT id, email, role, status, password FROM users WHERE email = 'john.doe@example.com'");
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('👤 User found:');
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Status: ${user.status}`);
      console.log(`Password hash: ${user.password.substring(0, 30)}...`);
      
      // Test common passwords
      const testPasswords = ['test', 'password123', 'john123', '123456', 'password', 'admin123', 'john.doe', 'customer123', 'user123'];
      
      console.log('\n🔐 Testing passwords:');
      for (const testPassword of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPassword, user.password);
          console.log(`Password '${testPassword}': ${isMatch ? '✅ MATCH' : '❌ No match'}`);
          if (isMatch) {
            console.log(`\n🎉 Found working password: ${testPassword}`);
            break;
          }
        } catch (error) {
          console.log(`Password '${testPassword}': ❌ Error testing`);
        }
      }
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

testLogin();