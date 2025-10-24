console.log('🔍 Checking current service data and visibility rules...');

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
        "isActive", "isApproved", 
        status, "approvalStatus",
        "adminAssignedBadge",
        "categoryId"
      FROM services 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);
    
    console.log('📊 Current service data:');
    result.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.name}:`);
      console.log(`   isActive: ${row.isActive}`);
      console.log(`   isApproved: ${row.isApproved}`);
      console.log(`   status: ${row.status}`);
      console.log(`   approvalStatus: ${row.approvalStatus}`);
      console.log(`   adminAssignedBadge: ${row.adminAssignedBadge}`);
      console.log('');
    });

    // Check visibility rules compliance
    const activeAndApproved = result.rows.filter(r => r.isActive && r.isApproved && r.approvalStatus === 'approved');
    const withBadges = activeAndApproved.filter(r => r.adminAssignedBadge);
    const withoutBadges = activeAndApproved.filter(r => !r.adminAssignedBadge);
    
    console.log('📈 Visibility Analysis:');
    console.log(`   Total services: ${result.rows.length}`);
    console.log(`   Active + Approved + Status=approved: ${activeAndApproved.length}`);
    console.log(`   With badges: ${withBadges.length}`);
    console.log(`   Without badges: ${withoutBadges.length}`);
    
    if (withBadges.length > 0) {
      console.log('🏷️ Services with badges:');
      withBadges.forEach(s => {
        console.log(`   - ${s.name}: ${s.adminAssignedBadge}`);
      });
    }

    console.log('\n🔍 Testing visibility rules:');
    console.log('   Rule 1: Service must be both isActive=true AND approvalStatus=approved');
    console.log('   Rule 2: Services with badges appear in category + badge sections');
    console.log('   Rule 3: Services without badges appear only in category sections');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkServices();