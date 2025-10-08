const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkUserTableSchema() {
  try {
    console.log('Checking users table schema...\n');
    
    // Check users table structure
    const usersStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('👥 Users table structure:');
    if (usersStructure.rows.length > 0) {
      usersStructure.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
      });
    } else {
      console.log('  No users table found');
    }
    
    // Check referrals table structure
    const referralsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'referrals' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n🔗 Referrals table structure:');
    if (referralsStructure.rows.length > 0) {
      referralsStructure.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
      });
    } else {
      console.log('  No referrals table found');
    }
    
    // Check sample data
    const sampleUsers = await pool.query('SELECT id, email FROM users LIMIT 3;');
    console.log('\n📋 Sample users:');
    sampleUsers.rows.forEach(user => {
      console.log(`  ${user.id} | ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserTableSchema();