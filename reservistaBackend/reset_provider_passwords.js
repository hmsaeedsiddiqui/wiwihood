const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: 'umar',
  host: 'localhost',
  database: 'reservista_clean',
  password: 'umar',
  port: 5432,
});

async function resetProviderPasswords() {
  try {
    // Hash the password "password"
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Update provider accounts with the new hashed password
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE email IN ('sarah@glamour.com', 'mike@zenspa.com') 
      AND role = 'provider'
    `;
    
    const result = await pool.query(query, [hashedPassword]);
    
    console.log(`✓ Updated ${result.rowCount} provider passwords`);
    console.log('Provider login credentials:');
    console.log('Email: sarah@glamour.com, Password: password');
    console.log('Email: mike@zenspa.com, Password: password');
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  } finally {
    await pool.end();
  }
}

resetProviderPasswords();