const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function addSampleServices() {
  try {
    console.log('=== ADDING SAMPLE SERVICES FOR TESTING ===');
    
    // First check if we have providers and categories
    const providers = await pool.query('SELECT id, "businessName" FROM providers LIMIT 1');
    const categories = await pool.query('SELECT id, name FROM categories LIMIT 5');
    
    if (providers.rows.length === 0) {
      console.log('❌ No providers found. Cannot create services without providers.');
      return;
    }
    
    if (categories.rows.length === 0) {
      console.log('❌ No categories found. Cannot create services without categories.');
      return;
    }
    
    console.log(`✅ Found ${providers.rows.length} provider(s) and ${categories.rows.length} category(ies)`);
    
    const providerId = providers.rows[0].id;
    const providerName = providers.rows[0].businessName;
    console.log(`Using provider: ${providerName} (${providerId})`);
    
    // Create 4 sample services with different badges
    const services = [
      {
        name: 'Professional Hair Styling',
        description: 'Expert hair styling and treatment services',
        shortDescription: 'Professional hair styling service',
        basePrice: 150.00,
        durationMinutes: 90,
        badge: 'New on vividhood',
        categoryId: categories.rows[0].id
      },
      {
        name: 'Relaxing Massage Therapy',
        description: 'Full body relaxing massage therapy session',
        shortDescription: 'Relaxing massage therapy',
        basePrice: 180.00,
        durationMinutes: 60,
        badge: 'Popular',
        categoryId: categories.rows[1]?.id || categories.rows[0].id
      },
      {
        name: 'Deep Cleaning Service',
        description: 'Complete home deep cleaning service',
        shortDescription: 'Professional deep cleaning',
        basePrice: 200.00,
        durationMinutes: 120,
        badge: 'Hot Deal',
        categoryId: categories.rows[2]?.id || categories.rows[0].id
      },
      {
        name: 'Personal Fitness Training',
        description: 'One-on-one personal fitness training session',
        shortDescription: 'Personal fitness training',
        basePrice: 120.00,
        durationMinutes: 60,
        badge: 'Best Seller',
        categoryId: categories.rows[3]?.id || categories.rows[0].id
      }
    ];
    
    console.log('\n📝 Creating services...');
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      
      const result = await pool.query(`
        INSERT INTO services (
          name, description, "shortDescription", "basePrice", "durationMinutes",
          "providerId", "categoryId", "isActive", "isApproved", status, "approvalStatus",
          "adminAssignedBadge", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, true, true, 'approved', 'approved', $8, NOW(), NOW()
        ) RETURNING id, name
      `, [
        service.name,
        service.description, 
        service.shortDescription,
        service.basePrice,
        service.durationMinutes,
        providerId,
        service.categoryId,
        service.badge
      ]);
      
      console.log(`✅ Created: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }
    
    // Verify the services
    const verification = await pool.query(`
      SELECT 
        id, name, "isActive", "isApproved", status, "approvalStatus", "adminAssignedBadge"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\n✅ SUCCESS: Created ${verification.rows.length} services`);
    console.log('\n📋 Services created:');
    verification.rows.forEach((s, i) => {
      const isVisible = s.isApproved === true && s.isActive === true && s.status === 'approved';
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   - Badge: ${s.adminAssignedBadge}`);
      console.log(`   - Visible on homepage: ${isVisible ? '✅ YES' : '❌ NO'}`);
    });
    
    console.log('\n🎉 Homepage should now show services in different badge sections!');
    
  } catch (error) {
    console.error('❌ Error creating services:', error);
  } finally {
    await pool.end();
  }
}

addSampleServices();