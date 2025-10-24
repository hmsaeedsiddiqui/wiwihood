console.log('🚀 Creating Sample Services for Homepage Testing');
console.log('='.repeat(60));

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function createSampleServices() {
  try {
    console.log('🔍 Step 1: Check if categories exist...');
    
    // Get existing categories
    const categoriesResult = await pool.query('SELECT id, name FROM categories LIMIT 5');
    
    if (categoriesResult.rows.length === 0) {
      console.log('❌ No categories found. Creating a sample category first...');
      
      const categoryId = uuidv4();
      await pool.query(`
        INSERT INTO categories (id, name, description, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [categoryId, 'Beauty & Wellness', 'Beauty and wellness services', true]);
      
      console.log('✅ Created sample category: Beauty & Wellness');
      categoriesResult.rows.push({ id: categoryId, name: 'Beauty & Wellness' });
    }
    
    console.log(`📂 Found ${categoriesResult.rows.length} categories`);
    
    console.log('\n🔍 Step 2: Check if providers exist...');
    
    // Get existing providers
    const providersResult = await pool.query('SELECT id, "businessName" FROM providers LIMIT 5');
    
    if (providersResult.rows.length === 0) {
      console.log('❌ No providers found. Creating sample providers first...');
      
      const providers = [
        { name: 'Elite Beauty Salon', city: 'Dubai' },
        { name: 'Premium Spa Services', city: 'Abu Dhabi' },
        { name: 'Top Hair Studio', city: 'Sharjah' },
        { name: 'Luxury Wellness Center', city: 'Dubai' }
      ];
      
      for (const provider of providers) {
        const providerId = uuidv4();
        await pool.query(`
          INSERT INTO providers (
            id, "businessName", city, phone, "isActive", 
            "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [providerId, provider.name, provider.city, '+971501234567', true]);
        
        providersResult.rows.push({ id: providerId, businessName: provider.name });
      }
      
      console.log('✅ Created sample providers');
    }
    
    console.log(`👥 Found ${providersResult.rows.length} providers`);
    
    console.log('\n🎯 Step 3: Creating sample services with badges...');
    
    const services = [
      {
        name: 'Premium Hair Styling & Cut',
        description: 'Professional hair styling and cutting service by experienced stylists',
        shortDescription: 'Expert hair styling and cutting',
        basePrice: 150.00,
        badge: 'Top Rated',
        providerId: providersResult.rows[0].id,
        providerName: providersResult.rows[0].businessName
      },
      {
        name: 'Relaxing Full Body Massage',
        description: 'Therapeutic full body massage for relaxation and stress relief',
        shortDescription: 'Full body relaxation massage',
        basePrice: 200.00,
        badge: 'New on vividhood',
        providerId: providersResult.rows[1].id,
        providerName: providersResult.rows[1].businessName
      },
      {
        name: 'Complete Facial Treatment',
        description: 'Deep cleansing facial treatment with premium skincare products',
        shortDescription: 'Professional facial treatment',
        basePrice: 120.00,
        badge: 'Best Seller',
        providerId: providersResult.rows[2].id,
        providerName: providersResult.rows[2].businessName
      },
      {
        name: 'Manicure & Pedicure Special',
        description: 'Complete nail care service with gel polish and design options',
        shortDescription: 'Professional nail care service',
        basePrice: 80.00,
        badge: 'Hot Deal',
        providerId: providersResult.rows[3].id || providersResult.rows[0].id,
        providerName: providersResult.rows[3]?.businessName || providersResult.rows[0].businessName
      }
    ];
    
    for (const service of services) {
      const serviceId = uuidv4();
      
      await pool.query(`
        INSERT INTO services (
          id, name, description, "shortDescription",
          "basePrice", "categoryId", "providerId", "providerBusinessName",
          "isActive", "isApproved", "approvalStatus", "adminAssignedBadge",
          "durationMinutes", "serviceType", "pricingType",
          "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      `, [
        serviceId,
        service.name,
        service.description,
        service.shortDescription,
        service.basePrice,
        categoriesResult.rows[0].id,
        service.providerId,
        service.providerName,
        true,  // isActive
        true,  // isApproved  
        'approved',  // approvalStatus
        service.badge,  // adminAssignedBadge
        60,  // durationMinutes
        'appointment',  // serviceType
        'fixed'  // pricingType
      ]);
      
      console.log(`✅ Created: "${service.name}" with badge "${service.badge}"`);
    }
    
    console.log('\n🎉 Step 4: Verification...');
    
    const verifyResult = await pool.query(`
      SELECT name, "adminAssignedBadge", "isActive", "isApproved", "approvalStatus"
      FROM services 
      WHERE "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved'
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`✅ Created ${verifyResult.rows.length} visible services:`);
    verifyResult.rows.forEach((s, i) => {
      console.log(`${i+1}. "${s.name}" - Badge: "${s.adminAssignedBadge}"`);
    });
    
    console.log('\n🏠 Homepage will now show these services in badge sections:');
    console.log('   - Top Rated section: Premium Hair Styling & Cut');
    console.log('   - New on Wiwihood section: Relaxing Full Body Massage');
    console.log('   - Best Sellers section: Complete Facial Treatment');
    console.log('   - Hot Deals section: Manicure & Pedicure Special');
    
    console.log('\n🚀 SUCCESS! Homepage should now display services in badge sections!');
    console.log('💡 Refresh your homepage to see the services appear.');
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error creating services:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createSampleServices();