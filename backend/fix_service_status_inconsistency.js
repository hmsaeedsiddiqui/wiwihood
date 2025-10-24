const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function fixServiceStatusInconsistency() {
  try {
    console.log('🔧 Fixing Service Status Inconsistency');
    console.log('='.repeat(50));
    
    // Find services with inconsistent status
    const inconsistentServices = await pool.query(`
      SELECT 
        id, 
        name, 
        "isApproved", 
        "approvalStatus", 
        "isActive",
        "createdAt",
        "updatedAt"
      FROM services 
      WHERE 
        ("isApproved" = true AND "approvalStatus" != 'approved') OR
        ("isApproved" = false AND "approvalStatus" = 'approved')
      ORDER BY "updatedAt" DESC
    `);
    
    console.log(`📊 Found ${inconsistentServices.rows.length} services with inconsistent status:`);
    
    inconsistentServices.rows.forEach((service, index) => {
      console.log(`\n   ${index + 1}. "${service.name}" (ID: ${service.id})`);
      console.log(`      isApproved: ${service.isApproved}`);
      console.log(`      approvalStatus: ${service.approvalStatus}`);
      console.log(`      isActive: ${service.isActive}`);
      console.log(`      ❌ INCONSISTENT - isApproved doesn't match approvalStatus`);
    });
    
    if (inconsistentServices.rows.length === 0) {
      console.log('✅ No inconsistent services found');
      return;
    }
    
    // Fix each inconsistent service
    for (const service of inconsistentServices.rows) {
      console.log(`\n🔧 Fixing service "${service.name}"...`);
      
      // If isApproved is true, set approvalStatus to 'approved' and activate
      if (service.isApproved === true) {
        await pool.query(`
          UPDATE services 
          SET 
            "approvalStatus" = 'approved',
            "isActive" = true,
            "approvalDate" = NOW(),
            "updatedAt" = NOW()
          WHERE id = $1
        `, [service.id]);
        
        console.log('   ✅ Set approvalStatus to "approved" and activated service');
      }
      // If isApproved is false but approvalStatus is 'approved', fix by setting both to pending
      else if (service.isApproved === false && service.approvalStatus === 'approved') {
        await pool.query(`
          UPDATE services 
          SET 
            "approvalStatus" = 'pending_approval',
            "isActive" = false,
            "approvalDate" = NULL,
            "updatedAt" = NOW()
          WHERE id = $1
        `, [service.id]);
        
        console.log('   ✅ Set both to pending status and deactivated service');
      }
    }
    
    // Verify fixes
    console.log('\n🔍 Verifying fixes...');
    const verifyResult = await pool.query(`
      SELECT 
        id, 
        name, 
        "isApproved", 
        "approvalStatus", 
        "isActive"
      FROM services 
      WHERE 
        ("isApproved" = true AND "approvalStatus" != 'approved') OR
        ("isApproved" = false AND "approvalStatus" = 'approved')
    `);
    
    if (verifyResult.rows.length === 0) {
      console.log('✅ All services now have consistent status!');
    } else {
      console.log(`❌ Still ${verifyResult.rows.length} services with inconsistent status`);
    }
    
    // Show current status after fixes
    console.log('\n📊 Current Services Status After Fix:');
    const currentStatus = await pool.query(`
      SELECT 
        id,
        name,
        "isActive",
        "isApproved",
        "approvalStatus",
        "adminAssignedBadge"
      FROM services
      ORDER BY "updatedAt" DESC
    `);
    
    currentStatus.rows.forEach((service, index) => {
      console.log(`\n   ${index + 1}. "${service.name}"`);
      console.log(`      isActive: ${service.isActive}`);
      console.log(`      isApproved: ${service.isApproved}`);
      console.log(`      approvalStatus: ${service.approvalStatus}`);
      console.log(`      Badge: ${service.adminAssignedBadge || 'None'}`);
      
      // Check if service meets visibility criteria
      const isVisible = service.isActive && service.isApproved && service.approvalStatus === 'approved';
      console.log(`      🌐 Homepage Visible: ${isVisible ? 'YES' : 'NO'}`);
      
      if (!isVisible) {
        const issues = [];
        if (!service.isActive) issues.push('Not Active');
        if (!service.isApproved) issues.push('Not Approved');
        if (service.approvalStatus !== 'approved') issues.push(`Status: ${service.approvalStatus}`);
        console.log(`      ❌ Issues: ${issues.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error fixing service status:', error.message);
  } finally {
    await pool.end();
  }
}

fixServiceStatusInconsistency();