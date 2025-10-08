const { createConnection } = require('typeorm');

async function checkUsers() {
    try {
        const connection = await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'umar',
            password: 'umar',
            database: 'reservista_clean',
            entities: [],
            synchronize: false,
        });

        const result = await connection.query("SELECT id, email, role, status, password FROM users WHERE email = 'abc@gmail.com'");
        console.log('User abc@gmail.com details:');
        console.table(result);
        
            // Test password verification
        const bcrypt = require('bcrypt');
        if (result.length > 0) {
            const user = result[0];
            const testPasswords = ['12345678', 'admin123', 'password', 'admin', 'abc123', 'password123'];
            
            console.log('\nTesting different passwords:');
            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                console.log(`Password '${testPassword}':`, isMatch);
                if (isMatch) {
                    console.log(`✅ FOUND CORRECT PASSWORD: ${testPassword}`);
                    break;
                }
            }
            
            // Also check first few characters of hash
            console.log('\nPassword hash (first 30 chars):', user.password.substring(0, 30));
        }        await connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkUsers();