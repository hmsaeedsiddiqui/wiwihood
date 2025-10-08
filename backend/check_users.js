const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'reservista_clean',
    user: 'umar',
    password: 'umar',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if users table exists and has data
    const usersCount = await client.query('SELECT COUNT(*) FROM users;');
    console.log('Total users in database:', usersCount.rows[0].count);

    // Show all users
    const users = await client.query('SELECT id, email, first_name, last_name, role, status FROM users LIMIT 5;');
    console.log('Users:', users.rows);

    // Check if there's a test user
    const testUser = await client.query("SELECT * FROM users WHERE email = 'test@example.com';");
    console.log('Test user exists:', testUser.rows.length > 0);
    if (testUser.rows.length > 0) {
      console.log('Test user details:', testUser.rows[0]);
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

checkUsers();