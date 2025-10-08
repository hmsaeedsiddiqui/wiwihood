const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function updateJohnDoePassword() {
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

    // Hash the password 'password123'
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('🔐 Generated password hash');

    // Update john.doe@example.com password
    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    await client.query(updateQuery, [hashedPassword, 'john.doe@example.com']);
    console.log('✅ Updated john.doe@example.com password to: password123');

    // Verify the update
    const result = await client.query("SELECT email, role, status FROM users WHERE email = 'john.doe@example.com'");
    console.log('📋 User details after update:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

updateJohnDoePassword();