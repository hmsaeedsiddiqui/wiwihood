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

async function testAdminLogin() {
    try {
        // Get admin users
        const result = await pool.query(`
            SELECT id, email, password, role, status
            FROM users 
            WHERE role = 'admin'
            ORDER BY email
        `);
        
        console.log('🔍 Found admin users:');
        console.log('=====================');
        
        for (const user of result.rows) {
            console.log(`\n📧 Email: ${user.email}`);
            console.log(`🔐 Role: ${user.role}`);
            console.log(`✅ Status: ${user.status}`);
            console.log(`🔑 Password Hash: ${user.password.substring(0, 30)}...`);
            
            // Test common passwords
            const testPasswords = ['admin123', 'admin', 'password', '123456', 'wiwihood'];
            for (const testPwd of testPasswords) {
                try {
                    const isValid = await bcrypt.compare(testPwd, user.password);
                    if (isValid) {
                        console.log(`🎯 Password '${testPwd}' works! ✅`);
                        
                        // Test login with this credential
                        console.log(`\n🧪 Testing login for ${user.email} with password '${testPwd}'...`);
                        await testLoginAPI(user.email, testPwd);
                        break;
                    }
                } catch (error) {
                    console.log(`❌ Error testing password '${testPwd}':`, error.message);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        await pool.end();
    }
}

async function testLoginAPI(email, password) {
    try {
        const { spawn } = require('child_process');
        
        // Use PowerShell to make the API call
        const powershellScript = `
            $body = @{email="${email}"; password="${password}"} | ConvertTo-Json
            $headers = @{"Content-Type"="application/json"}
            try {
                $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $body -Headers $headers -ErrorAction Stop
                Write-Output "LOGIN_SUCCESS: $($response | ConvertTo-Json -Compress)"
            } catch {
                Write-Output "LOGIN_FAILED: $($_.Exception.Message)"
            }
        `;
        
        const ps = spawn('powershell', ['-Command', powershellScript]);
        
        let output = '';
        ps.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        ps.stderr.on('data', (data) => {
            console.log(`PowerShell Error: ${data}`);
        });
        
        ps.on('close', (code) => {
            if (output.includes('LOGIN_SUCCESS:')) {
                console.log('✅ Login successful!');
                const responseData = output.replace('LOGIN_SUCCESS: ', '').trim();
                try {
                    const loginData = JSON.parse(responseData);
                    console.log('📝 JWT Token:', loginData.access_token ? 'Generated' : 'Missing');
                    console.log('👤 User:', loginData.user ? loginData.user.email : 'Not provided');
                    
                    // Test admin services
                    if (loginData.access_token) {
                        testAdminServices(loginData.access_token);
                    }
                } catch (parseError) {
                    console.log('📄 Raw response:', responseData);
                }
            } else {
                console.log('❌ Login failed:', output.replace('LOGIN_FAILED: ', '').trim());
            }
        });
        
    } catch (error) {
        console.error('❌ API Test Error:', error.message);
    }
}

async function testAdminServices(token) {
    try {
        const { spawn } = require('child_process');
        
        const powershellScript = `
            $headers = @{
                "Authorization"="Bearer ${token}"
                "Content-Type"="application/json"
            }
            try {
                $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/services?page=1&limit=10" -Method GET -Headers $headers -ErrorAction Stop
                Write-Output "ADMIN_SUCCESS: $($response | ConvertTo-Json -Compress)"
            } catch {
                Write-Output "ADMIN_FAILED: $($_.Exception.Message)"
            }
        `;
        
        const ps = spawn('powershell', ['-Command', powershellScript]);
        
        let output = '';
        ps.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        ps.on('close', (code) => {
            if (output.includes('ADMIN_SUCCESS:')) {
                console.log('🎉 Admin services accessible!');
                console.log('✅ 403 Forbidden issue resolved!');
            } else {
                console.log('❌ Admin services failed:', output.replace('ADMIN_FAILED: ', '').trim());
            }
        });
        
    } catch (error) {
        console.error('❌ Admin Test Error:', error.message);
    }
}

testAdminLogin();