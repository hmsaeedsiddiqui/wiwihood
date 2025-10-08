const { Client } = require('pg');

async function checkAWSUsers() {
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

    // Check if users table exists and has data
    const usersCount = await client.query('SELECT COUNT(*) FROM users;');
    console.log('📊 Total users in database:', usersCount.rows[0].count);

    // Show sample users
    const users = await client.query('SELECT id, email, first_name, last_name, role, status FROM users LIMIT 10;');
    console.log('👥 Users:');
    console.table(users.rows);

    // Check for common test emails
    const testEmails = [
      'admin@reservista.com',
      'test@example.com', 
      'john.doe@example.com',
      'user@example.com',
      'provider@example.com'
    ];

    console.log('\n🔍 Checking for test users:');
    for (const email of testEmails) {
      const result = await client.query('SELECT id, email, role, status FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        console.log(`✅ Found: ${email} - Role: ${result.rows[0].role}, Status: ${result.rows[0].status}`);
      } else {
        console.log(`❌ Not found: ${email}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

checkAWSUsers();