// Create admin user with the exact credentials user needs
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createWiwihoodAdmin() {
    console.log('🔧 Creating admin@wiwihood.com with admin123 password...\n');
    
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

        // Create/update admin@wiwihood.com with admin123 password
        const email = 'admin@wiwihood.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 12);
        
        console.log(`🔑 Creating/updating user: ${email}`);
        
        // First try to update existing user
        const updateResult = await client.query(`
            UPDATE users 
            SET password = $1, role = 'admin', status = 'active', 
                is_email_verified = true, updated_at = NOW()
            WHERE email = $2
            RETURNING id, email, role
        `, [hashedPassword, email]);
        
        if (updateResult.rows.length > 0) {
            console.log('✅ Updated existing user');
            console.table(updateResult.rows);
        } else {
            // Insert new user if doesn't exist
            console.log('🆕 Creating new admin user...');
            const insertResult = await client.query(`
                INSERT INTO users (
                    email, password, first_name, last_name, role, status, 
                    is_email_verified, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING id, email, role
            `, [
                email,
                hashedPassword,
                'Admin',
                'User',
                'admin',
                'active',
                true
            ]);
            console.log('✅ Created new admin user');
            console.table(insertResult.rows);
        }
        
        // Verify the password
        const verifyUser = await client.query(`
            SELECT email, password, role, status 
            FROM users 
            WHERE email = $1
        `, [email]);
        
        if (verifyUser.rows.length > 0) {
            const user = verifyUser.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            console.log('\n🔍 Verification Results:');
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Status: ${user.status}`);
            console.log(`   Password Match: ${isMatch ? '✅ Correct' : '❌ Failed'}`);
            
            if (isMatch && user.role === 'admin' && user.status === 'active') {
                console.log('\n🎉 SUCCESS! Admin credentials are ready:');
                console.log(`   Email: ${email}`);
                console.log(`   Password: ${password}`);
                console.log('   These should work for admin login!');
            } else {
                console.log('\n❌ Issue with admin setup:');
                if (!isMatch) console.log('   - Password verification failed');
                if (user.role !== 'admin') console.log('   - Role is not admin');
                if (user.status !== 'active') console.log('   - Account is not active');
            }
        }
        
        // Also ensure the abc@gmail.com user works
        console.log('\n🔧 Also updating abc@gmail.com...');
        const updateAbc = await client.query(`
            UPDATE users 
            SET password = $1, role = 'admin', status = 'active', 
                is_email_verified = true, updated_at = NOW()
            WHERE email = 'abc@gmail.com'
            RETURNING id, email, role
        `, [hashedPassword]);
        
        if (updateAbc.rows.length > 0) {
            console.log('✅ Updated abc@gmail.com');
            console.table(updateAbc.rows);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

createWiwihoodAdmin();