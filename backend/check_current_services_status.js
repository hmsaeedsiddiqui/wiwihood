console.log('🔍 Checking Current Services Status');
console.log('='.repeat(50));

const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function checkServices() {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, 
        "isActive", "isApproved", "approvalStatus",
        "adminAssignedBadge", "basePrice",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`📊 Found ${result.rows.length} services in database:`);
    
    if (result.rows.length === 0) {
      console.log('❌ No services found in database!');
      console.log('💡 This explains why homepage is empty.');
      console.log('   You need to create services first through provider panel or admin.');
      return;
    }
    
    result.rows.forEach((service, i) => {
      const visible = service.isActive && service.isApproved && service.approvalStatus === 'approved';
      console.log(`\n${i+1}. "${service.name}"`);
      console.log(`   Visibility: ${visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
      console.log(`   Status Details:`);
      console.log(`     isActive: ${service.isActive}`);
      console.log(`     isApproved: ${service.isApproved}`);
      console.log(`     approvalStatus: ${service.approvalStatus}`);
      console.log(`   Badge: ${service.adminAssignedBadge || 'None'}`);
      console.log(`   Price: $${service.basePrice || 'N/A'}`);
      console.log(`   Created: ${service.createdAt}`);
    });
    
    // Count visible services by badge
    const visibleServices = result.rows.filter(s => 
      s.isActive && s.isApproved && s.approvalStatus === 'approved'
    );
    
    console.log(`\n📈 Visibility Analysis:`);
    console.log(`   Total services: ${result.rows.length}`);
    console.log(`   Visible services: ${visibleServices.length}`);
    
    if (visibleServices.length > 0) {
      console.log('\n🏷️ Badge Distribution (Visible Services):');
      const badgeCount = {};
      visibleServices.forEach(s => {
        const badge = s.adminAssignedBadge || 'No Badge';
        badgeCount[badge] = (badgeCount[badge] || 0) + 1;
      });
      
      Object.entries(badgeCount).forEach(([badge, count]) => {
        console.log(`   ${badge}: ${count} service(s)`);
      });
      
      console.log('\n🎯 Homepage Section Mapping:');
      const badgeMapping = {
        'Top Rated': 'top-rated',
        'New on vividhood': 'new-on-vividhood', 
        'New on Wiwihood': 'new-on-vividhood',
        'Best Seller': 'best-seller',
        'Hot Deal': 'hot-deal',
        'Popular': 'popular',
        'Premium': 'premium',
        'Limited Time': 'limited-time'
      };
      
      Object.entries(badgeCount).forEach(([badge, count]) => {
        const urlType = badgeMapping[badge];
        if (urlType) {
          console.log(`   ${badge} → /services?type=${urlType} → Shows in "${badge}" section`);
        } else {
          console.log(`   ${badge} → ❌ NO MAPPING FOUND (won't show on homepage)`);
        }
      });
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkServices();