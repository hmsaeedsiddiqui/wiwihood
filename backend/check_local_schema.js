const { Client } = require('pg');

async function checkLocalSchema() {
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

    // Check users table schema
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    console.log('Users table schema:');
    schema.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`);
    });

    // Check if there are any users at all
    const userCount = await client.query("SELECT COUNT(*) FROM users");
    console.log(`\nTotal users in database: ${userCount.rows[0].count}`);

    // List all users
    const allUsers = await client.query("SELECT id, email, role, status FROM users LIMIT 10");
    console.log('\nExisting users:');
    allUsers.rows.forEach(user => {
      console.log(`  ${user.email} - ${user.role} - ${user.status}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkLocalSchema();