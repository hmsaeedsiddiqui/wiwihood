const { Client } = require('pg');

async function checkServices() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'wiwihood',
        user: 'postgres',
        password: 'password',
    });

    try {
        await client.connect();
        console.log('✅ Database connected successfully');

        // Check services table
        console.log('\n🔍 Checking services table...');
        const servicesResult = await client.query(`
            SELECT 
                id, 
                name, 
                "categoryId", 
                "isActive", 
                "isApproved", 
                "approvalStatus",
                "createdAt"
            FROM services 
            ORDER BY "createdAt" DESC 
            LIMIT 10
        `);

        console.log('📊 Services found:', servicesResult.rows.length);
        if (servicesResult.rows.length > 0) {
            console.log('\n📋 Recent services:');
            servicesResult.rows.forEach((service, index) => {
                console.log(`${index + 1}. ${service.name} (Category: ${service.categoryId}) - Active: ${service.isActive}, Approved: ${service.isApproved}, Status: ${service.approvalStatus}`);
            });
        }

        // Check categories table
        console.log('\n🔍 Checking categories table...');
        const categoriesResult = await client.query(`
            SELECT id, name, slug, "isActive" 
            FROM categories 
            WHERE "isActive" = true 
            ORDER BY name
        `);

        console.log('📊 Active categories found:', categoriesResult.rows.length);
        if (categoriesResult.rows.length > 0) {
            console.log('\n📋 Active categories:');
            categoriesResult.rows.forEach((category, index) => {
                console.log(`${index + 1}. ${category.name} (${category.slug}) - ID: ${category.id}`);
            });
        }

        // Check services by category
        if (categoriesResult.rows.length > 0) {
            console.log('\n🔍 Checking services by category...');
            for (const category of categoriesResult.rows) {
                const categoryServicesResult = await client.query(`
                    SELECT COUNT(*) as count 
                    FROM services 
                    WHERE "categoryId" = $1 
                    AND "isActive" = true 
                    AND "isApproved" = true
                `, [category.id]);
                
                console.log(`📊 ${category.name}: ${categoryServicesResult.rows[0].count} active & approved services`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkServices();