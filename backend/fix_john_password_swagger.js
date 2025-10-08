const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function updateJohnPassword() {
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
        console.log('✅ Connected to AWS RDS database');

        // Hash the password "Password123!" to match what you're trying in Swagger
        const newPassword = 'Password123!';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update john.doe@example.com password
        const updateResult = await client.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, 'john.doe@example.com']
        );

        if (updateResult.rowCount > 0) {
            console.log(`✅ Successfully updated password for john.doe@example.com to "${newPassword}"`);
            console.log('🔐 You can now login with:');
            console.log('   Email: john.doe@example.com');
            console.log('   Password: Password123!');
        } else {
            console.log('❌ No user found with email john.doe@example.com');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

updateJohnPassword();