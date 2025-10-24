const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function debugEmptyResponse() {
  try {
    console.log('=== DEBUGGING EMPTY HOMEPAGE RESPONSE ===');
    
    // Check all services in database
    const allServices = await pool.query(`
      SELECT 
        id, name, "isActive", "isApproved", status, "approvalStatus",
        "adminAssignedBadge", "basePrice", "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\n📊 Total services in database: ${allServices.rows.length}`);
    
    if (allServices.rows.length === 0) {
      console.log('❌ NO SERVICES FOUND IN DATABASE - This explains the empty response');
      return;
    }
    
    // Analyze each service
    console.log('\n📋 All services analysis:');
    allServices.rows.forEach((service, index) => {
      const isVisible = service.isApproved === true && service.isActive === true && service.status === 'approved';
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   - isApproved: ${service.isApproved}`);
      console.log(`   - isActive: ${service.isActive}`);
      console.log(`   - status: ${service.status}`);
      console.log(`   - approvalStatus: ${service.approvalStatus}`);
      console.log(`   - badge: ${service.adminAssignedBadge || 'none'}`);
      console.log(`   - VISIBLE: ${isVisible ? '✅ YES' : '❌ NO'}`);
      if (!isVisible) {
        const reasons = [];
        if (service.isApproved !== true) reasons.push('not approved');
        if (service.isActive !== true) reasons.push('not active');
        if (service.status !== 'approved') reasons.push(`status is '${service.status}' not 'approved'`);
        console.log(`   - WHY NOT VISIBLE: ${reasons.join(', ')}`);
      }
      console.log('');
    });
    
    // Count visible services
    const visibleServices = allServices.rows.filter(s => 
      s.isApproved === true && s.isActive === true && s.status === 'approved'
    );
    
    console.log(`\n🎯 SUMMARY:`);
    console.log(`- Total services: ${allServices.rows.length}`);
    console.log(`- Visible services: ${visibleServices.rows.length}`);
    
    if (visibleServices.rows.length === 0) {
      console.log('\n❌ NO VISIBLE SERVICES - This is why homepage shows empty arrays');
      console.log('\n🔧 SOLUTIONS:');
      console.log('1. Check if services need to be approved in admin panel');
      console.log('2. Check if services need to be activated');
      console.log('3. Check if service status needs to be changed to "approved"');
    } else {
      console.log('\n✅ VISIBLE SERVICES FOUND - API should return data');
      visibleServices.rows.forEach((s, i) => {
        console.log(`${i + 1}. ${s.name} (badge: ${s.adminAssignedBadge || 'none'})`);
      });
    }
    
    // Test what the API query would return
    console.log('\n🔍 TESTING API VISIBILITY QUERY...');
    const apiQuery = await pool.query(`
      SELECT COUNT(*) as count
      FROM services s
      WHERE s."isActive" = true 
        AND s."isApproved" = true 
        AND s."approvalStatus" = 'approved'
    `);
    
    console.log(`API query result: ${apiQuery.rows[0].count} services`);
    
    if (apiQuery.rows[0].count === 0) {
      console.log('❌ API query returns 0 services');
      console.log('🔧 The issue might be with approvalStatus vs status field');
      
      // Check the difference
      const statusCheck = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN "approvalStatus" = 'approved' THEN 1 END) as approval_status_approved,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as status_approved,
          COUNT(CASE WHEN "isApproved" = true THEN 1 END) as is_approved_true
        FROM services 
        WHERE "isActive" = true
      `);
      
      console.log('\n📊 Status field analysis:');
      console.log(`- Active services: ${statusCheck.rows[0].total}`);
      console.log(`- approvalStatus = 'approved': ${statusCheck.rows[0].approval_status_approved}`);
      console.log(`- status = 'approved': ${statusCheck.rows[0].status_approved}`);
      console.log(`- isApproved = true: ${statusCheck.rows[0].is_approved_true}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging:', error);
  } finally {
    await pool.end();
  }
}

debugEmptyResponse();