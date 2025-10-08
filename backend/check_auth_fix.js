const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function checkDatabaseUsers() {
    const client = new Client({
        host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
        port: 5432,
        username: 'postgres',
        password: 'eYKpRl8juRsTqeUPp3bg',
        database: 'postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to AWS RDS database successfully!');

        // Check all users
        const allUsersQuery = 'SELECT id, email, role, status, first_name, last_name FROM users LIMIT 10';
        const allUsers = await client.query(allUsersQuery);
        console.log('\n📋 All users in database:');
        console.table(allUsers.rows);

        // Check specific test user
        const testUserQuery = 'SELECT id, email, role, status, password FROM users WHERE email = $1';
        const testUser = await client.query(testUserQuery, ['john.doe@example.com']);
        
        if (testUser.rows.length > 0) {
            console.log('\n🔍 Found john.doe@example.com:');
            console.table(testUser.rows[0]);
            
            // Test password verification
            const user = testUser.rows[0];
            const testPasswords = ['Password123!', 'password123', 'admin123', '12345678', 'password'];
            
            console.log('\n🔑 Testing different passwords:');
            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                console.log(`Password '${testPassword}':`, isMatch ? '✅' : '❌');
                if (isMatch) {
                    console.log(`\n🎉 CORRECT PASSWORD FOUND: ${testPassword}`);
                    break;
                }
            }
        } else {
            console.log('\n❌ john.doe@example.com not found. Creating user...');
            
            // Create the test user with proper credentials
            const hashedPassword = await bcrypt.hash('Password123!', 12);
            const insertQuery = `
                INSERT INTO users (email, password, first_name, last_name, phone, role, status, is_email_verified, user_role, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
                RETURNING id, email, role
            `;
            
            const newUser = await client.query(insertQuery, [
                'john.doe@example.com',
                hashedPassword,
                'John',
                'Doe',
                '+1234567890',
                'customer',
                'active',
                true,
                'customer'
            ]);
            
            console.log('✅ Created new user:', newUser.rows[0]);
            console.log('📧 Email: john.doe@example.com');
            console.log('🔑 Password: Password123!');
        }

    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

checkDatabaseUsers();