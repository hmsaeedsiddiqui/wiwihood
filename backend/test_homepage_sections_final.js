const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function testHomepageSections() {
  try {
    console.log('🏠 Testing Homepage Sections');
    console.log('='.repeat(50));
    
    // Test each badge type section
    const badgeTypes = [
      { type: 'new-on-vividhood', badge: 'New on vividhood' },
      { type: 'popular', badge: 'Popular' },
      { type: 'hot-deal', badge: 'Hot Deal' },
      { type: 'best-seller', badge: 'Best Seller' },
      { type: 'limited-time', badge: 'Limited Time' },
      { type: 'premium', badge: 'Premium' },
      { type: 'top-rated', badge: 'Top Rated' }
    ];
    
    for (const badgeType of badgeTypes) {
      const services = await pool.query(`
        SELECT id, name, "adminAssignedBadge", "isActive", "isApproved", "approvalStatus"
        FROM services 
        WHERE 
          "isActive" = true AND 
          "isApproved" = true AND 
          "approvalStatus" = 'approved' AND
          "adminAssignedBadge" = $1
        ORDER BY "createdAt" DESC
        LIMIT 4
      `, [badgeType.badge]);
      
      console.log(`📋 ${badgeType.type} Section (Badge: "${badgeType.badge}"): ${services.rows.length} services`);
      services.rows.forEach((service, idx) => {
        console.log(`   ${idx + 1}. ${service.name}`);
      });
    }
    
    // Test "Featured Services" section (services without badges)
    console.log('\n🌟 Featured Services Section (No specific badge):');
    const featuredServices = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s."adminAssignedBadge", 
        s."isActive", 
        s."isApproved", 
        s."approvalStatus",
        c.name as category_name,
        p."businessName" as provider_name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      LEFT JOIN providers p ON s."providerId" = p.id
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        (s."adminAssignedBadge" IS NULL OR s."adminAssignedBadge" = '')
      ORDER BY s."createdAt" DESC
      LIMIT 4
    `);
    
    console.log(`Found ${featuredServices.rows.length} services for Featured Services section:`);
    featuredServices.rows.forEach((service, idx) => {
      console.log(`   ${idx + 1}. "${service.name}" (${service.provider_name})`);
      console.log(`      Category: ${service.category_name}`);
      console.log(`      Badge: ${service.adminAssignedBadge || 'None'}`);
      console.log(`      Status: Active=${service.isActive}, Approved=${service.isApproved}, Status=${service.approvalStatus}`);
    });
    
    if (featuredServices.rows.length > 0) {
      console.log('\n✅ Your nail service should now be visible in the "Featured Services" section on the homepage!');
    } else {
      console.log('\n❌ No services found for Featured Services section');
    }
    
    // Total visible services on homepage
    const totalVisible = await pool.query(`
      SELECT COUNT(*) as total
      FROM services 
      WHERE 
        "isActive" = true AND 
        "isApproved" = true AND 
        "approvalStatus" = 'approved'
    `);
    
    console.log(`\n🌐 Total Services Visible on Homepage: ${totalVisible.rows[0].total}`);
    
    // Check specifically for nail category services
    const nailServices = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s."adminAssignedBadge", 
        s."isActive", 
        s."isApproved", 
        s."approvalStatus",
        c.name as category_name,
        p."businessName" as provider_name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      LEFT JOIN providers p ON s."providerId" = p.id
      WHERE 
        LOWER(c.name) LIKE '%nail%' AND
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved'
    `);
    
    if (nailServices.rows.length > 0) {
      console.log(`\n💅 Nail Services Visible on Homepage: ${nailServices.rows.length}`);
      nailServices.rows.forEach((service, idx) => {
        console.log(`   ${idx + 1}. "${service.name}" by ${service.provider_name}`);
        console.log(`      Will appear in: ${service.adminAssignedBadge ? service.adminAssignedBadge + ' section' : 'Featured Services section'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing homepage sections:', error.message);
  } finally {
    await pool.end();
  }
}

testHomepageSections();