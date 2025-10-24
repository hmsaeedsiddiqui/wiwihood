const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'wiwihood_db',
    port: 5432,
    ssl: false
});

async function resetAdminPassword() {
    try {
        const email = 'admin@wiwihood.com';
        const newPassword = 'admin123';
        
        console.log('🔧 Resetting admin password...');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 New Password: ${newPassword}`);
        
        // Hash the new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        console.log(`🔐 Password Hash: ${hashedPassword.substring(0, 30)}...`);
        
        // Update the password
        const result = await pool.query(
            'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, email, role',
            [hashedPassword, email]
        );
        
        if (result.rows.length > 0) {
            console.log('✅ Password updated successfully!');
            console.log(`👤 User: ${result.rows[0].email} (${result.rows[0].role})`);
            
            // Verify the password was set correctly
            const verifyResult = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
            const isValid = await bcrypt.compare(newPassword, verifyResult.rows[0].password);
            console.log(`🧪 Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
            
            if (isValid) {
                console.log('\n🎯 CREDENTIALS READY:');
                console.log('=====================');
                console.log(`📧 Email: ${email}`);
                console.log(`🔑 Password: ${newPassword}`);
                console.log('✅ Use these to login to your admin panel');
            }
        } else {
            console.log('❌ No user found with that email');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

resetAdminPassword();