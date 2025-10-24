const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'wiwihood_db',
    port: 5432,
    ssl: false
});

async function verifyPasswordInDB() {
    console.log('🔍 Verifying Password in Database');
    console.log('===================================');
    
    try {
        // Get admin users
        const result = await pool.query(`
            SELECT id, email, password, role, user_type, is_active
            FROM users 
            WHERE role = 'admin' OR user_type = 'admin'
            ORDER BY email
        `);
        
        console.log(`Found ${result.rows.length} admin users:\n`);
        
        for (const user of result.rows) {
            console.log(`📧 Email: ${user.email}`);
            console.log(`🔐 Role: ${user.role} | UserType: ${user.user_type}`);
            console.log(`✅ Active: ${user.is_active}`);
            console.log(`🔑 Password Hash: ${user.password.substring(0, 30)}...`);
            
            // Test password verification
            const isValid = await bcrypt.compare('admin123', user.password);
            console.log(`🧪 Password 'admin123' valid: ${isValid ? '✅ YES' : '❌ NO'}`);
            
            // Test other possible passwords
            const testPasswords = ['12345678', 'password', 'admin'];
            for (const testPwd of testPasswords) {
                const isTestValid = await bcrypt.compare(testPwd, user.password);
                if (isTestValid) {
                    console.log(`🎯 Found working password '${testPwd}': ✅ YES`);
                }
            }
            
            console.log('-----------------------------------\n');
        }
        
        // Test manual login
        console.log('🧪 Testing manual login process...');
        const testUser = result.rows.find(u => u.email === 'abc@gmail.com');
        if (testUser) {
            console.log(`Found user: ${testUser.email}`);
            console.log(`Password hash: ${testUser.password}`);
            
            // Try to manually verify the password
            const manualCheck = await bcrypt.compare('admin123', testUser.password);
            console.log(`Manual bcrypt check: ${manualCheck}`);
            
            // Check bcrypt settings
            console.log(`Bcrypt version info:`, bcrypt.getRounds(testUser.password));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verifyPasswordInDB();