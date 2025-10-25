const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function debugAuth() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get the admin user
    const result = await client.query(
      "SELECT id, email, password, status, role FROM users WHERE email = 'admin@wiwihood.com'"
    );

    if (result.rows.length === 0) {
      console.log('No admin user found');
      return;
    }

    const user = result.rows[0];
    console.log('User found:', {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role,
      passwordHash: user.password.substring(0, 20) + '...'
    });

    // Test password comparison
    const password = 'admin123';
    console.log('\nTesting password comparison...');
    console.log('Plain password:', password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    // Also test with a fresh hash to verify bcrypt is working
    console.log('\nTesting fresh hash...');
    const freshHash = await bcrypt.hash(password, 12);
    console.log('Fresh hash:', freshHash.substring(0, 20) + '...');
    const freshMatch = await bcrypt.compare(password, freshHash);
    console.log('Fresh hash match:', freshMatch);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

debugAuth();