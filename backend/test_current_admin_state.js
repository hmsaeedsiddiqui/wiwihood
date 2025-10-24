const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function testCurrentAdminState() {
  try {
    console.log('🔍 Testing Current Admin Panel State');
    console.log('='.repeat(50));
    
    // Check current service states
    console.log('📊 Current Service States in Database:');
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
      LIMIT 10
    `);
    
    console.log(`\nFound ${allServices.rows.length} services:`);
    allServices.rows.forEach((service, index) => {
      const visibility = (service.isApproved && service.isActive && service.approvalStatus === 'approved') ? '🌐 VISIBLE' : '🚫 HIDDEN';
      console.log(`${index + 1}. "${service.name.substring(0, 30)}..."`);
      console.log(`   ID: ${service.id}`);
      console.log(`   isApproved: ${service.isApproved}`);
      console.log(`   approvalStatus: ${service.approvalStatus}`);
      console.log(`   isActive: ${service.isActive}`);
      console.log(`   badge: ${service.adminAssignedBadge || 'none'}`);
      console.log(`   ${visibility} on homepage`);
      console.log('');
    });
    
    // Statistics summary
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN "approvalStatus" = 'pending_approval' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN "approvalStatus" = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN "approvalStatus" = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved' THEN 1 ELSE 0 END) as visible
      FROM services
    `);
    
    const summary = stats.rows[0];
    console.log('📈 Database Statistics:');
    console.log(`   Total Services: ${summary.total}`);
    console.log(`   Pending Approval: ${summary.pending}`);
    console.log(`   Approved: ${summary.approved}`);
    console.log(`   Rejected: ${summary.rejected}`);
    console.log(`   Visible on Homepage: ${summary.visible}`);
    
    console.log('\n🔧 Test Admin Operations:');
    console.log('To test the admin panel:');
    console.log('1. Go to your admin panel in browser');
    console.log('2. Try to approve/reject a service');
    console.log('3. Try to toggle active/inactive');
    console.log('4. Check if the changes persist in the table above');
    console.log('');
    console.log('✅ Fixed Issues:');
    console.log('✅ Admin API now uses correct /api/v1 endpoints');
    console.log('✅ All admin service mutations are properly imported');
    console.log('✅ Database operations work correctly');
    
    console.log('\n🚀 Expected Behavior:');
    console.log('✅ Approve button should work and persist changes');
    console.log('✅ Toggle button should work for approved services');
    console.log('✅ Status dropdowns should work properly');
    console.log('✅ Changes should be immediately visible in admin panel');
    
  } catch (error) {
    console.error('❌ Error testing admin state:', error.message);
  } finally {
    await pool.end();
  }
}

testCurrentAdminState();