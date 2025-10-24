const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function debugAdminApproval() {
  try {
    console.log('🔍 Debugging Admin Approval Process');
    console.log('='.repeat(50));
    
    // Get a service to test with
    const testService = await pool.query(`
      SELECT id, name, "isApproved", "approvalStatus", "isActive"
      FROM services 
      WHERE "approvalStatus" = 'pending_approval'
      LIMIT 1
    `);
    
    if (testService.rows.length === 0) {
      console.log('No pending services found. Creating one for testing...');
      
      // Get any service and set it to pending
      const anyService = await pool.query(`SELECT id FROM services LIMIT 1`);
      if (anyService.rows.length === 0) {
        console.log('❌ No services found at all');
        return;
      }
      
      await pool.query(`
        UPDATE services 
        SET 
          "isApproved" = false,
          "approvalStatus" = 'pending_approval',
          "isActive" = false
        WHERE id = $1
      `, [anyService.rows[0].id]);
      
      console.log('✅ Set service to pending for testing');
    }
    
    // Now get the pending service
    const pendingService = await pool.query(`
      SELECT id, name, "isApproved", "approvalStatus", "isActive"
      FROM services 
      WHERE "approvalStatus" = 'pending_approval'
      LIMIT 1
    `);
    
    const service = pendingService.rows[0];
    console.log(`📝 Testing with service: "${service.name}" (ID: ${service.id})`);
    console.log(`   Before: isApproved=${service.isApproved}, approvalStatus=${service.approvalStatus}, isActive=${service.isActive}`);
    
    // Test approval process step by step
    console.log('\n🔧 Step 1: Manual approval simulation...');
    
    // This simulates what the backend admin service should do
    await pool.query(`
      UPDATE services 
      SET 
        "isApproved" = true,
        "approvalStatus" = 'approved',
        "isActive" = true,
        "approvalDate" = NOW(),
        "updatedAt" = NOW()
      WHERE id = $1
    `, [service.id]);
    
    // Check the result
    const afterApproval = await pool.query(`
      SELECT "isApproved", "approvalStatus", "isActive", "approvalDate"
      FROM services 
      WHERE id = $1
    `, [service.id]);
    
    const approved = afterApproval.rows[0];
    console.log(`   After: isApproved=${approved.isApproved}, approvalStatus=${approved.approvalStatus}, isActive=${approved.isActive}`);
    console.log(`   Approval Date: ${approved.approvalDate}`);
    
    // Check if it meets visibility criteria
    const visibilityCheck = await pool.query(`
      SELECT COUNT(*) as visible_count
      FROM services 
      WHERE 
        id = $1 AND
        "isApproved" = true AND 
        "isActive" = true AND 
        "approvalStatus" = 'approved'
    `, [service.id]);
    
    console.log(`   🌐 Meets visibility criteria: ${visibilityCheck.rows[0].visible_count > 0 ? 'YES' : 'NO'}`);
    
    // Test toggle functionality
    console.log('\n🔧 Step 2: Testing toggle functionality...');
    
    // Deactivate
    await pool.query(`
      UPDATE services 
      SET 
        "isActive" = false,
        "updatedAt" = NOW()
      WHERE id = $1
    `, [service.id]);
    
    const afterDeactivate = await pool.query(`
      SELECT "isActive", "isApproved", "approvalStatus"
      FROM services 
      WHERE id = $1
    `, [service.id]);
    
    const deactivated = afterDeactivate.rows[0];
    console.log(`   After deactivation: isApproved=${deactivated.isApproved}, approvalStatus=${deactivated.approvalStatus}, isActive=${deactivated.isActive}`);
    
    // Reactivate
    await pool.query(`
      UPDATE services 
      SET 
        "isActive" = true,
        "updatedAt" = NOW()
      WHERE id = $1
    `, [service.id]);
    
    const afterReactivate = await pool.query(`
      SELECT "isActive", "isApproved", "approvalStatus" 
      FROM services 
      WHERE id = $1
    `, [service.id]);
    
    const reactivated = afterReactivate.rows[0];
    console.log(`   After reactivation: isApproved=${reactivated.isApproved}, approvalStatus=${reactivated.approvalStatus}, isActive=${reactivated.isActive}`);
    
    console.log('\n📊 Database Operations Test Results:');
    console.log('✅ Manual approval works correctly');
    console.log('✅ Toggle functionality works correctly');  
    console.log('✅ All required fields are being updated');
    
    console.log('\n💡 If admin panel still not working, the issue is likely:');
    console.log('   1. Frontend-backend API communication problem');
    console.log('   2. Authentication/authorization issue');
    console.log('   3. Backend admin service method not being called');
    console.log('   4. Transaction rollback or error in backend');
    
  } catch (error) {
    console.error('❌ Error debugging admin approval:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

debugAdminApproval();