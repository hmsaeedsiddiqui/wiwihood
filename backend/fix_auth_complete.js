const { Client } = require('pg');
const bcrypt = require('bcrypt');
const axios = require('axios');

async function fixAuthenticationAndTest() {
    console.log('🔧 Fixing Authentication Issues...\n');
    
    // Database connection using environment variables from .env
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

        // First, check if john.doe@example.com exists
        const checkUserQuery = 'SELECT id, email, role, status FROM users WHERE email = $1';
        const existingUser = await client.query(checkUserQuery, ['john.doe@example.com']);
        
        if (existingUser.rows.length > 0) {
            console.log('📋 User already exists:', existingUser.rows[0]);
            
            // Update the existing user with proper password and status
            const hashedPassword = await bcrypt.hash('Password123!', 12);
            const updateQuery = `
                UPDATE users 
                SET password = $1, status = $2, is_email_verified = $3
                WHERE email = $4
            `;
            await client.query(updateQuery, [hashedPassword, 'active', true, 'john.doe@example.com']);
            console.log('✅ Updated user with correct password and active status');
        } else {
            // Create new user
            console.log('🆕 Creating new user...');
            const hashedPassword = await bcrypt.hash('Password123!', 12);
            
            const insertQuery = `
                INSERT INTO users (
                    id, email, password, first_name, last_name, phone, role, 
                    status, is_email_verified, is_phone_verified, gdpr_consent,
                    language, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
                ) RETURNING id, email, role, status
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
                false,
                true,
                'en'
            ]);
            
            console.log('✅ Created new user:', newUser.rows[0]);
        }

        // Verify the password works
        const verifyQuery = 'SELECT password FROM users WHERE email = $1';
        const userForVerify = await client.query(verifyQuery, ['john.doe@example.com']);
        
        if (userForVerify.rows.length > 0) {
            const isPasswordCorrect = await bcrypt.compare('Password123!', userForVerify.rows[0].password);
            console.log('🔑 Password verification:', isPasswordCorrect ? '✅ Correct' : '❌ Incorrect');
        }

        console.log('\n🧪 Testing API Login...');
        
        // Test the API login
        const API_URL = 'http://localhost:3001/api/v1/auth/login';
        const loginData = {
            email: 'john.doe@example.com',
            password: 'Password123!'
        };
        
        try {
            const response = await axios.post(API_URL, loginData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            console.log('🎉 LOGIN SUCCESSFUL!');
            console.log('✅ Access Token received:', response.data.accessToken ? 'Yes' : 'No');
            console.log('👤 User Data:', {
                id: response.data.user.id,
                email: response.data.user.email,
                role: response.data.user.role,
                status: response.data.user.status
            });
            
        } catch (apiError) {
            console.log('❌ API Login failed:');
            console.log('Status:', apiError.response?.status);
            console.log('Error:', apiError.response?.data);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

fixAuthenticationAndTest();