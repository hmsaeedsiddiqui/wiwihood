const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function fixUserAuth() {
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

    // First, let's check for active users
    const activeUsersQuery = 'SELECT id, email, password, status FROM users WHERE status = $1';
    const activeUsers = await client.query(activeUsersQuery, ['active']);
    console.log('Active users found:', activeUsers.rows.length);
    
    if (activeUsers.rows.length > 0) {
      console.log('Active users:', activeUsers.rows.map(u => ({email: u.email, status: u.status})));
    }

    // Check if we have the test user
    const testUserQuery = 'SELECT * FROM users WHERE email = $1';
    const testUser = await client.query(testUserQuery, ['test@example.com']);
    
    if (testUser.rows.length > 0) {
      console.log('Found test user:', testUser.rows[0]);
      
      // Update the test user to be active with properly hashed password
      const hashedPassword = await bcrypt.hash('test', 12);
      const updateQuery = `
        UPDATE users 
        SET password = $1, status = $2 
        WHERE email = $3
      `;
      await client.query(updateQuery, [hashedPassword, 'active', 'test@example.com']);
      console.log('Updated test user with hashed password and active status');
    } else {
      // Create a new test user
      const hashedPassword = await bcrypt.hash('test', 12);
      const insertQuery = `
        INSERT INTO users (email, password, first_name, last_name, phone, role, status, is_email_verified, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `;
      await client.query(insertQuery, [
        'test@example.com',
        hashedPassword,
        'Test',
        'User',
        '+1234567890',
        'customer',
        'active',
        true
      ]);
      console.log('Created new test user with proper credentials');
    }

    // Verify the fix
    const verifyQuery = 'SELECT email, status, is_email_verified FROM users WHERE email = $1';
    const verifyResult = await client.query(verifyQuery, ['test@example.com']);
    console.log('Test user after fix:', verifyResult.rows[0]);

  } catch (error) {
    console.error('Error fixing user auth:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

fixUserAuth();