const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'wiwihood_db',
    port: 5432,
    ssl: false
});

async function createTestAdmin() {
    try {
        const email = 'testadmin@wiwihood.com';
        const password = 'admin123';
        
        console.log('🔧 Creating test admin user...');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(`🔐 Password Hash: ${hashedPassword.substring(0, 30)}...`);
        
        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            console.log('👤 User already exists, updating password...');
            await pool.query(
                'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
                [hashedPassword, email]
            );
        } else {
            console.log('👤 Creating new admin user...');
            await pool.query(`
                INSERT INTO users (
                    id, email, password, first_name, last_name, role, status,
                    is_email_verified, is_phone_verified, is_two_factor_enabled,
                    gdpr_consent, marketing_consent, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [
                uuidv4(), email, hashedPassword, 'Test', 'Admin', 'admin', 'active',
                true, false, false, true, false, new Date()
            ]);
        }
        
        console.log('✅ Test admin user created/updated successfully!');
        
        // Test the password
        const user = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
        const isValid = await bcrypt.compare(password, user.rows[0].password);
        console.log(`🧪 Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        
        if (isValid) {
            console.log('\n🚀 Now testing login...');
            await testLogin(email, password);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

async function testLogin(email, password) {
    const { spawn } = require('child_process');
    
    const powershellScript = `
        $body = @{email="${email}"; password="${password}"} | ConvertTo-Json
        $headers = @{"Content-Type"="application/json"}
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $body -Headers $headers -ErrorAction Stop
            $token = $response.access_token
            Write-Output "LOGIN_TOKEN:$token"
            
            # Test admin services
            $adminHeaders = @{
                "Authorization"="Bearer $token"
                "Content-Type"="application/json"
            }
            $adminResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/services?page=1&limit=10" -Method GET -Headers $adminHeaders -ErrorAction Stop
            Write-Output "ADMIN_SUCCESS:Services count: $($adminResponse.data.Count)"
        } catch {
            Write-Output "ERROR:$($_.Exception.Message)"
        }
    `;
    
    const ps = spawn('powershell', ['-Command', powershellScript]);
    
    let output = '';
    ps.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    ps.on('close', (code) => {
        console.log('\n📋 Login Test Results:');
        console.log('=======================');
        
        if (output.includes('LOGIN_TOKEN:')) {
            const token = output.match(/LOGIN_TOKEN:([^\r\n]+)/)?.[1]?.trim();
            console.log('✅ Login successful!');
            console.log(`🔑 JWT Token: ${token ? token.substring(0, 50) + '...' : 'Not found'}`);
            
            if (output.includes('ADMIN_SUCCESS:')) {
                console.log('🎉 Admin services accessible!');
                console.log('✅ 403 Forbidden issue resolved!');
                console.log(output.match(/ADMIN_SUCCESS:([^\r\n]+)/)?.[1]?.trim());
                
                console.log('\n🎯 SOLUTION SUMMARY:');
                console.log('====================');
                console.log(`✅ Use these credentials in your admin panel:`);
                console.log(`   Email: ${email}`);
                console.log(`   Password: ${password}`);
                console.log(`✅ Backend admin authentication is working`);
                console.log(`✅ Admin services endpoint is accessible`);
            } else if (output.includes('ERROR:')) {
                console.log('❌ Admin services failed:', output.match(/ERROR:([^\r\n]+)/)?.[1]?.trim());
            }
        } else if (output.includes('ERROR:')) {
            console.log('❌ Login failed:', output.match(/ERROR:([^\r\n]+)/)?.[1]?.trim());
        } else {
            console.log('❓ Unexpected response:', output.trim());
        }
    });
}