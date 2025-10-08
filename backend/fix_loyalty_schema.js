const { Client } = require('pg');

async function fixLoyaltySchema() {
    console.log('🔧 Fixing Loyalty Schema Issues...\n');
    
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

        // First, check the current schema of loyalty tables
        const loyaltyAccountSchema = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'loyalty_accounts' 
            ORDER BY ordinal_position;
        `);
        
        console.log('📋 Current loyalty_accounts schema:');
        console.table(loyaltyAccountSchema.rows);

        const pointTransactionSchema = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'point_transactions' 
            ORDER BY ordinal_position;
        `);
        
        console.log('\n📋 Current point_transactions schema:');
        console.table(pointTransactionSchema.rows);

        // Check foreign key constraints
        const constraints = await client.query(`
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY' 
                AND (tc.table_name='loyalty_accounts' OR tc.table_name='point_transactions');
        `);
        
        console.log('\n🔗 Current foreign key constraints:');
        console.table(constraints.rows);

        // Check if tables exist and create them if they don't
        const loyaltyTableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'loyalty_accounts'
            );
        `);

        if (!loyaltyTableExists.rows[0].exists) {
            console.log('🔨 Creating loyalty_accounts table...');
            await client.query(`
                CREATE TABLE loyalty_accounts (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL UNIQUE,
                    current_points INTEGER NOT NULL DEFAULT 0,
                    total_points_earned INTEGER NOT NULL DEFAULT 0,
                    total_points_redeemed INTEGER NOT NULL DEFAULT 0,
                    tier VARCHAR(20) NOT NULL DEFAULT 'bronze',
                    points_to_next_tier INTEGER NOT NULL DEFAULT 0,
                    last_tier_upgrade TIMESTAMP,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `);
            console.log('✅ Created loyalty_accounts table');
        }

        const transactionTableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'point_transactions'
            );
        `);

        if (!transactionTableExists.rows[0].exists) {
            console.log('🔨 Creating point_transactions table...');
            await client.query(`
                CREATE TABLE point_transactions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    loyalty_account_id UUID NOT NULL,
                    type VARCHAR(20) NOT NULL,
                    points INTEGER NOT NULL,
                    balance_after INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    reference_id VARCHAR(255),
                    reference_type VARCHAR(100),
                    expires_at TIMESTAMP,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    FOREIGN KEY (loyalty_account_id) REFERENCES loyalty_accounts(id) ON DELETE CASCADE
                );
            `);
            console.log('✅ Created point_transactions table');
        }

        // Create or update indexes
        console.log('🔍 Creating indexes...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_user_id ON loyalty_accounts(user_id);');
        await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_tier ON loyalty_accounts(tier);');
        await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_loyalty_account_id ON point_transactions(loyalty_account_id);');
        await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(type);');
        await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);');
        console.log('✅ Indexes created');

        // Create a loyalty account for our test user
        console.log('👤 Creating loyalty account for test user...');
        
        // Get the test user ID
        const userResult = await client.query('SELECT id FROM users WHERE email = $1', ['john.doe@example.com']);
        
        if (userResult.rows.length > 0) {
            const userId = userResult.rows[0].id;
            
            // Check if loyalty account already exists
            const existingAccount = await client.query('SELECT id FROM loyalty_accounts WHERE user_id = $1', [userId]);
            
            if (existingAccount.rows.length === 0) {
                const loyaltyAccount = await client.query(`
                    INSERT INTO loyalty_accounts (user_id, current_points, total_points_earned, tier, points_to_next_tier)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, user_id, current_points, tier
                `, [userId, 100, 100, 'bronze', 900]);
                
                console.log('✅ Created loyalty account:', loyaltyAccount.rows[0]);
                
                // Add a sample transaction
                await client.query(`
                    INSERT INTO point_transactions (loyalty_account_id, type, points, balance_after, description, reference_type)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [loyaltyAccount.rows[0].id, 'earned', 100, 100, 'Welcome bonus for joining', 'signup_bonus']);
                
                console.log('✅ Added welcome bonus transaction');
            } else {
                console.log('ℹ️  Loyalty account already exists for test user');
            }
        } else {
            console.log('❌ Test user not found');
        }

        // Verify the fix by doing a test query similar to what the API does
        console.log('\n🧪 Testing the fixed schema...');
        const testQuery = await client.query(`
            SELECT 
                la.id,
                la.user_id,
                la.current_points,
                la.total_points_earned,
                la.total_points_redeemed,
                la.tier,
                la.points_to_next_tier,
                la.last_tier_upgrade,
                la.created_at,
                la.updated_at,
                u.first_name,
                u.last_name,
                u.email
            FROM loyalty_accounts la
            JOIN users u ON la.user_id = u.id
            WHERE u.email = $1
        `, ['john.doe@example.com']);
        
        if (testQuery.rows.length > 0) {
            console.log('✅ Schema test successful!');
            console.table(testQuery.rows[0]);
        } else {
            console.log('❌ Schema test failed - no data found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

fixLoyaltySchema();