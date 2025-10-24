const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function testHomepageVisibility() {
  try {
    console.log('🏠 Testing Homepage Visibility Rules');
    console.log('='.repeat(50));
    
    // Get current service state
    const currentServices = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s."isActive", 
        s."isApproved", 
        s."approvalStatus",
        s."adminAssignedBadge",
        c.name as category_name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      ORDER BY s."updatedAt" DESC
    `);
    
    console.log(`📊 Current Services (${currentServices.rows.length}):`);
    currentServices.rows.forEach((service, idx) => {
      console.log(`   ${idx + 1}. "${service.name}" (${service.category_name})`);
      console.log(`      Status: Active=${service.isActive}, Approved=${service.isApproved}, Status=${service.approvalStatus}`);
      console.log(`      Badge: ${service.adminAssignedBadge || 'None'}`);
      
      const isVisible = service.isActive && service.isApproved && service.approvalStatus === 'approved';
      const hasValidBadge = service.adminAssignedBadge && service.adminAssignedBadge.trim() !== '';
      
      console.log(`      📋 Category listings: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
      console.log(`      🏠 Homepage sections: ${isVisible && hasValidBadge ? 'VISIBLE' : 'HIDDEN'}`);
    });
    
    // Test each homepage section
    const badgeTypes = [
      { type: 'new-on-vividhood', badge: 'New on vividhood' },
      { type: 'popular', badge: 'Popular' },
      { type: 'hot-deal', badge: 'Hot Deal' },
      { type: 'best-seller', badge: 'Best Seller' },
      { type: 'limited-time', badge: 'Limited Time' },
      { type: 'premium', badge: 'Premium' },
      { type: 'top-rated', badge: 'Top Rated' }
    ];
    
    console.log('\n🏠 Homepage Sections:');
    let totalHomepageServices = 0;
    
    for (const badgeType of badgeTypes) {
      const services = await pool.query(`
        SELECT id, name, "adminAssignedBadge"
        FROM services 
        WHERE 
          "isActive" = true AND 
          "isApproved" = true AND 
          "approvalStatus" = 'approved' AND
          "adminAssignedBadge" = $1
        ORDER BY "createdAt" DESC
        LIMIT 4
      `, [badgeType.badge]);
      
      console.log(`   📋 ${badgeType.type} Section: ${services.rows.length} services`);
      totalHomepageServices += services.rows.length;
      
      services.rows.forEach((service, idx) => {
        console.log(`      ${idx + 1}. ${service.name}`);
      });
    }
    
    console.log(`\n📊 Total Services on Homepage: ${totalHomepageServices}`);
    
    // Test category listings
    console.log('\n📂 Category Listings:');
    const categories = await pool.query(`
      SELECT DISTINCT c.name, c.slug
      FROM categories c
      INNER JOIN services s ON s."categoryId" = c.id
      WHERE s."isActive" = true AND s."isApproved" = true AND s."approvalStatus" = 'approved'
    `);
    
    for (const category of categories.rows) {
      const categoryServices = await pool.query(`
        SELECT s.id, s.name, s."adminAssignedBadge"
        FROM services s
        LEFT JOIN categories c ON s."categoryId" = c.id
        WHERE 
          s."isActive" = true AND 
          s."isApproved" = true AND 
          s."approvalStatus" = 'approved' AND
          (LOWER(c.name) LIKE LOWER($1) OR c.slug = $2)
      `, [`%${category.name}%`, category.slug]);
      
      console.log(`   📂 ${category.name} (/services?category=${category.slug}): ${categoryServices.rows.length} services`);
      categoryServices.rows.forEach((service, idx) => {
        const badgeInfo = service.adminAssignedBadge ? ` (Badge: ${service.adminAssignedBadge})` : ' (No badge)';
        console.log(`      ${idx + 1}. ${service.name}${badgeInfo}`);
      });
    }
    
    // Verify the rules
    console.log('\n✅ Verification:');
    
    const servicesWithoutBadges = await pool.query(`
      SELECT COUNT(*) as count
      FROM services 
      WHERE 
        "isActive" = true AND 
        "isApproved" = true AND 
        "approvalStatus" = 'approved' AND
        ("adminAssignedBadge" IS NULL OR "adminAssignedBadge" = '')
    `);
    
    const servicesWithBadges = await pool.query(`
      SELECT COUNT(*) as count
      FROM services 
      WHERE 
        "isActive" = true AND 
        "isApproved" = true AND 
        "approvalStatus" = 'approved' AND
        "adminAssignedBadge" IS NOT NULL AND "adminAssignedBadge" != ''
    `);
    
    console.log(`   Services without badges: ${servicesWithoutBadges.rows[0].count} (visible in category listings only)`);
    console.log(`   Services with badges: ${servicesWithBadges.rows[0].count} (visible in both category listings and homepage sections)`);
    
    if (parseInt(servicesWithoutBadges.rows[0].count) > 0) {
      console.log(`\n💡 Your nail service currently has no badge, so it:`);
      console.log(`   ✅ WILL appear in category listings (/services?category=nails)`);
      console.log(`   ❌ Will NOT appear on homepage (no badge sections)`);
      console.log(`   💡 To make it appear on homepage, assign it a badge in admin panel`);
    }
    
  } catch (error) {
    console.error('❌ Error testing homepage visibility:', error.message);
  } finally {
    await pool.end();
  }
}

testHomepageVisibility();