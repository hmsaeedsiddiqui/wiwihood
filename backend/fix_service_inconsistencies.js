const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function fixServiceInconsistencies() {
  try {
    console.log('🔧 Fixing Service State Inconsistencies');
    console.log('='.repeat(50));
    
    // Find services with inconsistent states
    const inconsistentServices = await pool.query(`
      SELECT 
        id,
        name,
        "isApproved",
        "approvalStatus", 
        "isActive",
        "adminAssignedBadge"
      FROM services 
      WHERE 
        "isApproved" = true AND "approvalStatus" != 'approved'
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`📊 Found ${inconsistentServices.rows.length} services with inconsistent states:`);
    
    if (inconsistentServices.rows.length === 0) {
      console.log('✅ No inconsistencies found! All services have consistent states.');
      return;
    }
    
    for (const service of inconsistentServices.rows) {
      console.log(`\n🔧 Fixing: "${service.name.substring(0, 40)}..."`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Current: isApproved=${service.isApproved}, approvalStatus=${service.approvalStatus}`);
      
      // Fix the inconsistency: if isApproved=true, set approvalStatus to 'approved'
      await pool.query(`
        UPDATE services 
        SET 
          "approvalStatus" = 'approved',
          "status" = 'approved',
          "updatedAt" = NOW()
        WHERE id = $1
      `, [service.id]);
      
      console.log(`   ✅ Fixed: approvalStatus set to 'approved'`);
    }
    
    // Verify the fix
    console.log('\n📊 Verification - Current Service States After Fix:');
    const allServices = await pool.query(`
      SELECT 
        id,
        name,
        "isApproved",
        "approvalStatus", 
        "isActive",
        "adminAssignedBadge"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\nFound ${allServices.rows.length} services after fix:`);
    allServices.rows.forEach((service, index) => {
      const visibility = (service.isApproved && service.isActive && service.approvalStatus === 'approved') ? '🌐 VISIBLE' : '🚫 HIDDEN';
      console.log(`${index + 1}. "${service.name.substring(0, 30)}..."`);
      console.log(`   isApproved: ${service.isApproved}, approvalStatus: ${service.approvalStatus}, isActive: ${service.isActive}`);
      console.log(`   badge: ${service.adminAssignedBadge || 'none'}, ${visibility} on homepage`);
      console.log('');
    });
    
    // Final statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN "approvalStatus" = 'pending_approval' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN "approvalStatus" = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN "approvalStatus" = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved' THEN 1 ELSE 0 END) as visible,
        SUM(CASE WHEN "isApproved" = true AND "approvalStatus" != 'approved' THEN 1 ELSE 0 END) as inconsistent
      FROM services
    `);
    
    const summary = stats.rows[0];
    console.log('📈 Final Database Statistics:');
    console.log(`   Total Services: ${summary.total}`);
    console.log(`   Pending Approval: ${summary.pending}`);
    console.log(`   Approved: ${summary.approved}`);
    console.log(`   Rejected: ${summary.rejected}`);
    console.log(`   Visible on Homepage: ${summary.visible}`);
    console.log(`   Inconsistent States: ${summary.inconsistent}`);
    
    if (summary.inconsistent === '0') {
      console.log('\n✅ SUCCESS: All service states are now consistent!');
      console.log('✅ Admin panel should now work perfectly');
      console.log('✅ Services should appear correctly on frontend');
    } else {
      console.log('\n⚠️  Still some inconsistencies remain. Manual review may be needed.');
    }
    
  } catch (error) {
    console.error('❌ Error fixing service inconsistencies:', error.message);
  } finally {
    await pool.end();
  }
}

fixServiceInconsistencies();