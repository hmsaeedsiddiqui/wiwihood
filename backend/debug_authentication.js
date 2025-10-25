// Test password hashing and authentication logic
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function debugAuthentication() {
    console.log('🔍 Debugging Authentication Issues...\n');
    
    const client = new Client({
        host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
        port: 5432,
        user: 'postgres',
        password: 'eYKpRl8juRsTqeUPp3bg',
        database: 'postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Check all admin users
        console.log('📋 Current admin users in database:');
        const adminUsers = await client.query(`
            SELECT id, email, first_name, last_name, role, status, 
                   is_email_verified, password, created_at
            FROM users 
            WHERE role = 'admin'
            ORDER BY created_at DESC
        `);
        
        console.table(adminUsers.rows.map(row => ({
            email: row.email,
            role: row.role,
            status: row.status,
            verified: row.is_email_verified,
            created: row.created_at
        })));

        // Test password for each admin user
        const testPassword = 'admin123';
        console.log(`\n🔑 Testing password "${testPassword}" for each admin user:`);
        
        for (const user of adminUsers.rows) {
            console.log(`\n   Testing: ${user.email}`);
            
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                console.log(`   Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
                
                if (isMatch) {
                    console.log(`   🎉 Working credentials found!`);
                    console.log(`      Email: ${user.email}`);
                    console.log(`      Password: ${testPassword}`);
                    console.log(`      Role: ${user.role}`);
                    console.log(`      Status: ${user.status}`);
                }
            } catch (error) {
                console.log(`   ❌ Error testing password: ${error.message}`);
            }
        }

        // Test creating a fresh user with known password
        console.log('\n🆕 Creating fresh test admin user...');
        const testEmail = 'test-admin@wiwihood.com';
        const testPass = 'test123';
        
        // Delete if exists
        await client.query('DELETE FROM users WHERE email = $1', [testEmail]);
        
        const freshHash = await bcrypt.hash(testPass, 12);
        const freshUser = await client.query(`
            INSERT INTO users (
                email, password, first_name, last_name, role, status, 
                is_email_verified, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING id, email, role
        `, [testEmail, freshHash, 'Test', 'Admin', 'admin', 'active', true]);
        
        console.log('✅ Created fresh test user:');
        console.table(freshUser.rows);
        
        // Verify fresh user password
        const verifyFresh = await client.query(`
            SELECT password FROM users WHERE email = $1
        `, [testEmail]);
        
        const freshMatch = await bcrypt.compare(testPass, verifyFresh.rows[0].password);
        console.log(`Fresh user password verification: ${freshMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (freshMatch) {
            console.log(`\n🎯 Try these fresh credentials:`);
            console.log(`   Email: ${testEmail}`);
            console.log(`   Password: ${testPass}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

debugAuthentication();