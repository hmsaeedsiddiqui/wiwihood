const { Client } = require('pg');

async function fixReferenceIdColumn() {
    console.log('🔧 Fixing referenceId column type...\n');
    
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

        // Check current column type
        const columnInfo = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'point_transactions' 
            AND column_name = 'referenceId';
        `);
        
        console.log('📋 Current referenceId column info:');
        console.table(columnInfo.rows);

        // Change the column type from UUID to VARCHAR
        console.log('🔨 Changing referenceId column type from UUID to VARCHAR...');
        
        await client.query(`
            ALTER TABLE point_transactions 
            ALTER COLUMN "referenceId" TYPE VARCHAR(255);
        `);
        
        console.log('✅ Successfully changed referenceId column type');

        // Verify the change
        const verifyChange = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'point_transactions' 
            AND column_name = 'referenceId';
        `);
        
        console.log('\n📋 Updated referenceId column info:');
        console.table(verifyChange.rows);

        // Test inserting a sample transaction with string referenceId
        console.log('\n🧪 Testing with sample data...');
        
        // First, get an existing loyalty account
        const loyaltyAccount = await client.query(`
            SELECT id FROM loyalty_accounts LIMIT 1;
        `);
        
        if (loyaltyAccount.rows.length > 0) {
            const accountId = loyaltyAccount.rows[0].id;
            
            // Insert a test transaction
            await client.query(`
                INSERT INTO point_transactions ("loyaltyAccountId", type, points, "balanceAfter", description, "referenceId", "referenceType")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [accountId, 'earned', 100, 100, 'Test booking completion bonus', 'booking_123', 'booking']);
            
            console.log('✅ Successfully inserted test transaction with string referenceId');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

fixReferenceIdColumn();