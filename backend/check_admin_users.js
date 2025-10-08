const { Client } = require('pg');

async function checkAdminUsers() {
    console.log('🔍 Checking Admin Users in Database...\n');
    
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
        const adminUsers = await client.query(`
            SELECT id, email, first_name, last_name, role, status, is_email_verified
            FROM users 
            WHERE role = 'admin' 
            ORDER BY created_at;
        `);
        
        console.log('📋 Admin users found:');
        if (adminUsers.rows.length > 0) {
            console.table(adminUsers.rows);
        } else {
            console.log('❌ No admin users found in database');
        }

        // Check if abc@gmail.com exists (from previous scripts)
        const abcUser = await client.query(`
            SELECT id, email, first_name, last_name, role, status, password
            FROM users 
            WHERE email = 'abc@gmail.com';
        `);
        
        if (abcUser.rows.length > 0) {
            console.log('\n🔍 Found abc@gmail.com:');
            console.table([{
                id: abcUser.rows[0].id,
                email: abcUser.rows[0].email,
                name: `${abcUser.rows[0].first_name} ${abcUser.rows[0].last_name}`,
                role: abcUser.rows[0].role,
                status: abcUser.rows[0].status,
                password_set: abcUser.rows[0].password ? 'Yes' : 'No'
            }]);
            
            // Test password for abc@gmail.com
            const bcrypt = require('bcrypt');
            const testPasswords = ['12345678', 'admin123', 'password', 'admin', 'abc123'];
            
            console.log('\n🔑 Testing passwords for abc@gmail.com:');
            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, abcUser.rows[0].password);
                console.log(`  Password '${testPassword}': ${isMatch ? '✅' : '❌'}`);
                if (isMatch) {
                    console.log(`\n🎉 ADMIN LOGIN CREDENTIALS FOUND:`);
                    console.log(`   Email: abc@gmail.com`);
                    console.log(`   Password: ${testPassword}`);
                    console.log(`   Role: ${abcUser.rows[0].role}`);
                    break;
                }
            }
        }

        // If no admin found, create one
        if (adminUsers.rows.length === 0) {
            console.log('\n🔨 Creating admin user...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            const newAdmin = await client.query(`
                INSERT INTO users (email, password, first_name, last_name, role, status, is_email_verified, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING id, email, first_name, last_name, role
            `, [
                'admin@reservista.com',
                hashedPassword,
                'Admin',
                'User',
                'admin',
                'active',
                true
            ]);
            
            console.log('✅ Created new admin user:');
            console.table(newAdmin.rows);
            
            console.log('\n🎉 NEW ADMIN LOGIN CREDENTIALS:');
            console.log('   Email: admin@reservista.com');
            console.log('   Password: admin123');
            console.log('   Role: admin');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

checkAdminUsers();