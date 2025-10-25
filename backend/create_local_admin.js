const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createLocalAdmin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root'
  });

  try {
    await client.connect();
    console.log('Connected to local database');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Users table does not exist. The backend needs to run first to create tables.');
      return;
    }

    // Check current admin users
    const existingUsers = await client.query(
      "SELECT id, email, role FROM users WHERE email LIKE '%admin%' OR role = 'admin'"
    );
    
    console.log('Current admin users:', existingUsers.rows);

    // Create admin user with hashed password
    const email = 'admin@wiwihood.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if this admin already exists
    const existingAdmin = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists, updating password...');
      await client.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [hashedPassword, email]
      );
      console.log('Admin password updated');
    } else {
      console.log('Creating new admin user...');
      const result = await client.query(`
        INSERT INTO users (
          email, password, first_name, last_name, phone, 
          role, status, profile_picture, is_email_verified, 
          is_phone_verified
        ) VALUES (
          $1, $2, 'Admin', 'User', '+1234567890',
          'admin', 'active', null, true, 
          true
        ) RETURNING id, email, role
      `, [email, hashedPassword]);
      
      console.log('Admin user created:', result.rows[0]);
    }

    // Test the password
    const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    console.log('Password validation test:', isValid);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

createLocalAdmin();