console.log('🧪 Testing Homepage Badge Sections with New Services');
console.log('='.repeat(60));

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
    console.log('🔍 Testing each badge section that should appear on homepage...\n');
    
    // Test each badge type that DynamicHomepageSections.tsx queries
    const badgeTests = [
      { type: 'top-rated', badge: 'Top Rated', sectionName: 'Top Rated' },
      { type: 'new-on-vividhood', badge: 'New on vividhood', sectionName: 'New on Wiwihood' },
      { type: 'best-seller', badge: 'Best Seller', sectionName: 'Best Sellers' },
      { type: 'hot-deal', badge: 'Hot Deal', sectionName: 'Hot Deals' },
      { type: 'popular', badge: 'Popular', sectionName: 'Popular This Week' },
      { type: 'premium', badge: 'Premium', sectionName: 'Premium' },
      { type: 'limited-time', badge: 'Limited Time', sectionName: 'Limited Time' }
    ];
    
    let totalVisibleSections = 0;
    
    for (const test of badgeTests) {
      // This simulates what the backend API does when frontend calls /services?type=xxx
      const result = await pool.query(`
        SELECT id, name, "basePrice", "adminAssignedBadge", "providerBusinessName"
        FROM services 
        WHERE "isActive" = true 
          AND "isApproved" = true 
          AND "approvalStatus" = 'approved'
          AND "adminAssignedBadge" = $1
        ORDER BY "createdAt" DESC
      `, [test.badge]);
      
      if (result.rows.length > 0) {
        totalVisibleSections++;
        console.log(`✅ ${test.sectionName} Section (type: ${test.type})`);
        console.log(`   API Query: GET /services?type=${test.type}`);
        console.log(`   Badge Filter: "${test.badge}"`);
        console.log(`   Services Found: ${result.rows.length}`);
        
        result.rows.forEach((service, i) => {
          console.log(`   ${i+1}. "${service.name}" - $${service.basePrice} by ${service.providerBusinessName}`);
        });
        console.log('');
      } else {
        console.log(`❌ ${test.sectionName} Section - No services (section will be hidden)`);
      }
    }
    
    console.log(`📊 HOMEPAGE SUMMARY:`);
    console.log(`   Visible sections: ${totalVisibleSections} out of ${badgeTests.length}`);
    console.log(`   Hidden sections: ${badgeTests.length - totalVisibleSections}`);
    
    if (totalVisibleSections > 0) {
      console.log('\n🎉 SUCCESS! Homepage will show these badge sections:');
      
      // Re-run the queries to show what will actually appear
      for (const test of badgeTests) {
        const result = await pool.query(`
          SELECT name FROM services 
          WHERE "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved'
            AND "adminAssignedBadge" = $1
        `, [test.badge]);
        
        if (result.rows.length > 0) {
          console.log(`   📋 ${test.sectionName}: ${result.rows.map(s => s.name).join(', ')}`);
        }
      }
      
      console.log('\n🚀 Your homepage should now display services in badge sections!');
      console.log('💡 Go to your frontend homepage and refresh to see the services.');
    } else {
      console.log('\n❌ No badge sections will appear on homepage.');
      console.log('💡 This means no services have badges that match the expected values.');
    }
    
    // Also check category sections
    console.log('\n🔍 Category sections will also show these services:');
    const categoryServices = await pool.query(`
      SELECT s.name, c.name as category_name
      FROM services s
      JOIN categories c ON s."categoryId" = c.id
      WHERE s."isActive" = true AND s."isApproved" = true AND s."approvalStatus" = 'approved'
      ORDER BY c.name, s.name
    `);
    
    if (categoryServices.rows.length > 0) {
      const categoryGroups = {};
      categoryServices.rows.forEach(s => {
        if (!categoryGroups[s.category_name]) {
          categoryGroups[s.category_name] = [];
        }
        categoryGroups[s.category_name].push(s.name);
      });
      
      Object.entries(categoryGroups).forEach(([category, services]) => {
        console.log(`   📂 ${category}: ${services.join(', ')}`);
      });
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

testHomepageSections();