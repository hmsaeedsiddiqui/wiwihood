const { createConnection } = require('typeorm');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
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

        // Hash the new password
        const newPassword = '12345678';
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the admin user password
        const result = await connection.query(
            "UPDATE users SET password = $1 WHERE email = 'abc@gmail.com'",
            [hashedPassword]
        );

        console.log('Password updated for abc@gmail.com');
        console.log('New password:', newPassword);
        
        // Verify the update worked
        const verification = await connection.query(
            "SELECT email, password FROM users WHERE email = 'abc@gmail.com'"
        );
        
        if (verification.length > 0) {
            const isMatch = await bcrypt.compare(newPassword, verification[0].password);
            console.log('Verification - password matches:', isMatch);
        }

        await connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

updateAdminPassword();