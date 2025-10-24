const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'wiwihood_db',
    port: 5432,
    ssl: false
});

async function checkTable() {
    try {
        const result = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' ORDER BY ordinal_position');
        console.log('Users table columns:');
        result.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));
        
        // Get admin users
        const adminUsers = await pool.query('SELECT * FROM users WHERE email LIKE \'%admin%\' OR email = \'abc@gmail.com\' LIMIT 5');
        console.log('\nAdmin users found:');
        adminUsers.rows.forEach(user => {
            console.log(`- Email: ${user.email}, ID: ${user.id}, Role: ${user.role || 'N/A'}`);
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkTable();