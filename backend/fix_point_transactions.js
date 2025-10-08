const { Client } = require('pg');

async function fixPointTransactionsSchema() {
    console.log('🔧 Fixing Point Transactions Schema...\n');
    
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

        // Check if balanceAfter column exists
        const balanceAfterExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'point_transactions' 
                AND column_name = 'balanceAfter'
            );
        `);

        if (!balanceAfterExists.rows[0].exists) {
            console.log('🔨 Adding balanceAfter column...');
            await client.query(`
                ALTER TABLE point_transactions 
                ADD COLUMN "balanceAfter" INTEGER NOT NULL DEFAULT 0;
            `);
            console.log('✅ Added balanceAfter column');
        }

        // Check if expiresAt column exists
        const expiresAtExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'point_transactions' 
                AND column_name = 'expiresAt'
            );
        `);

        if (!expiresAtExists.rows[0].exists) {
            console.log('🔨 Adding expiresAt column...');
            await client.query(`
                ALTER TABLE point_transactions 
                ADD COLUMN "expiresAt" TIMESTAMP;
            `);
            console.log('✅ Added expiresAt column');
        }

        // Create a loyalty account for our test user if it doesn't exist
        console.log('👤 Ensuring loyalty account exists for test user...');
        
        // Get the test user ID
        const userResult = await client.query('SELECT id FROM users WHERE email = $1', ['john.doe@example.com']);
        
        if (userResult.rows.length > 0) {
            const userId = userResult.rows[0].id;
            
            // Check if loyalty account already exists
            const existingAccount = await client.query('SELECT id FROM loyalty_accounts WHERE "userId" = $1', [userId]);
            
            if (existingAccount.rows.length === 0) {
                const loyaltyAccount = await client.query(`
                    INSERT INTO loyalty_accounts ("userId", "currentPoints", "totalPointsEarned", tier, "pointsToNextTier")
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, "userId", "currentPoints", tier
                `, [userId, 100, 100, 'bronze', 900]);
                
                console.log('✅ Created loyalty account:', loyaltyAccount.rows[0]);
                
                // Add a sample transaction
                await client.query(`
                    INSERT INTO point_transactions ("loyaltyAccountId", type, points, "balanceAfter", description, "referenceType")
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [loyaltyAccount.rows[0].id, 'earned', 100, 100, 'Welcome bonus for joining', 'signup_bonus']);
                
                console.log('✅ Added welcome bonus transaction');
            } else {
                console.log('ℹ️  Loyalty account already exists for test user');
                
                // Make sure there's at least one transaction
                const transactionCount = await client.query('SELECT COUNT(*) FROM point_transactions WHERE "loyaltyAccountId" = $1', [existingAccount.rows[0].id]);
                
                if (parseInt(transactionCount.rows[0].count) === 0) {
                    await client.query(`
                        INSERT INTO point_transactions ("loyaltyAccountId", type, points, "balanceAfter", description, "referenceType")
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [existingAccount.rows[0].id, 'earned', 100, 100, 'Welcome bonus for joining', 'signup_bonus']);
                    
                    console.log('✅ Added welcome bonus transaction');
                }
            }
        } else {
            console.log('❌ Test user not found');
        }

        // Test the final schema
        console.log('\n📋 Final point_transactions schema:');
        const finalSchema = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'point_transactions' 
            ORDER BY ordinal_position;
        `);
        console.table(finalSchema.rows);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

fixPointTransactionsSchema();