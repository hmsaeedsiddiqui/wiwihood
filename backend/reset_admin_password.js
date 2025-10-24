// Reset admin password and test login
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function resetAdminPassword() {
    console.log('🔧 Resetting Admin Password...\n');
    
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

        // Reset password for abc@gmail.com
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        console.log('🔑 Updating password for abc@gmail.com...');
        const updateResult = await client.query(`
            UPDATE users 
            SET password = $1, updated_at = NOW()
            WHERE email = 'abc@gmail.com'
            RETURNING id, email, role
        `, [hashedPassword]);
        
        if (updateResult.rows.length > 0) {
            console.log('✅ Password updated successfully');
            console.table(updateResult.rows);
            
            console.log('\n🎉 ADMIN LOGIN CREDENTIALS:');
            console.log('   Email: abc@gmail.com');
            console.log('   Password: admin123');
            console.log('   Role: admin');
            
            // Verify the password was set correctly
            const verifyUser = await client.query(`
                SELECT email, password, role 
                FROM users 
                WHERE email = 'abc@gmail.com'
            `);
            
            const isMatch = await bcrypt.compare(newPassword, verifyUser.rows[0].password);
            console.log('\n🔍 Password verification:', isMatch ? '✅ Correct' : '❌ Failed');
            
        } else {
            console.log('❌ No user found with email abc@gmail.com');
        }

        // Also create a simple admin user if needed
        console.log('\n🔧 Creating/updating admin@admin.com...');
        try {
            const adminPassword = 'admin123';
            const adminHash = await bcrypt.hash(adminPassword, 12);
            
            // First try to update, then insert if not exists
            const updateAdmin = await client.query(`
                UPDATE users 
                SET password = $1, role = 'admin', status = 'active', is_email_verified = true, updated_at = NOW()
                WHERE email = 'admin@admin.com'
                RETURNING id, email, role
            `, [adminHash]);
            
            if (updateAdmin.rows.length === 0) {
                // Insert new admin
                const insertAdmin = await client.query(`
                    INSERT INTO users (email, password, first_name, last_name, role, status, is_email_verified, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                    RETURNING id, email, role
                `, [
                    'admin@admin.com',
                    adminHash,
                    'Admin',
                    'User',
                    'admin',
                    'active',
                    true
                ]);
                console.log('✅ Created new admin user:');
                console.table(insertAdmin.rows);
            } else {
                console.log('✅ Updated existing admin user:');
                console.table(updateAdmin.rows);
            }
            
            console.log('\n🎉 ADDITIONAL ADMIN CREDENTIALS:');
            console.log('   Email: admin@admin.com');
            console.log('   Password: admin123');
            console.log('   Role: admin');
            
        } catch (adminError) {
            console.log('❌ Error with admin@admin.com:', adminError.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

resetAdminPassword();