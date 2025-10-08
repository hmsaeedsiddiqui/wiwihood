const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function setupAllUsers() {
    console.log('🔧 Setting up all required users for the application...\n');
    
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

    const users = [
        {
            email: 'john.doe@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            role: 'customer',
            description: 'Main test customer'
        },
        {
            email: 'admin@example.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1234567891',
            role: 'admin',
            description: 'Admin user'
        },
        {
            email: 'provider@example.com',
            password: 'provider123',
            firstName: 'Provider',
            lastName: 'User',
            phone: '+1234567892',
            role: 'provider',
            description: 'Service provider'
        },
        {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567893',
            role: 'customer',
            description: 'Alternative test user'
        }
    ];

    try {
        await client.connect();
        console.log('✅ Connected to database');

        for (const userData of users) {
            console.log(`\n👤 Processing ${userData.description}: ${userData.email}`);
            
            // Check if user exists
            const checkQuery = 'SELECT id, email, role, status FROM users WHERE email = $1';
            const existing = await client.query(checkQuery, [userData.email]);
            
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            
            if (existing.rows.length > 0) {
                // Update existing user
                const updateQuery = `
                    UPDATE users 
                    SET password = $1, status = $2, is_email_verified = $3, role = $4,
                        first_name = $5, last_name = $6, phone = $7
                    WHERE email = $8
                `;
                await client.query(updateQuery, [
                    hashedPassword, 'active', true, userData.role,
                    userData.firstName, userData.lastName, userData.phone,
                    userData.email
                ]);
                console.log('✅ Updated existing user');
            } else {
                // Create new user
                const insertQuery = `
                    INSERT INTO users (
                        id, email, password, first_name, last_name, phone, role, 
                        status, is_email_verified, is_phone_verified, gdpr_consent,
                        language, created_at, updated_at
                    ) VALUES (
                        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
                    )
                `;
                
                await client.query(insertQuery, [
                    userData.email,
                    hashedPassword,
                    userData.firstName,
                    userData.lastName,
                    userData.phone,
                    userData.role,
                    'active',
                    true,
                    false,
                    true,
                    'en'
                ]);
                console.log('✅ Created new user');
            }
            
            // Verify password
            const verifyQuery = 'SELECT password FROM users WHERE email = $1';
            const userForVerify = await client.query(verifyQuery, [userData.email]);
            const isCorrect = await bcrypt.compare(userData.password, userForVerify.rows[0].password);
            console.log(`🔑 Password verification: ${isCorrect ? '✅' : '❌'}`);
            console.log(`📧 Email: ${userData.email}`);
            console.log(`🔐 Password: ${userData.password}`);
        }

        // Show summary of all users
        console.log('\n📋 Summary of all users:');
        const allUsersQuery = 'SELECT email, role, status, first_name, last_name FROM users ORDER BY role, email';
        const allUsers = await client.query(allUsersQuery);
        console.table(allUsers.rows);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

setupAllUsers();