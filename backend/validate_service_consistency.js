const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function validateServiceConsistency() {
  try {
    console.log('🔍 Validating Service Status Consistency');
    console.log('='.repeat(50));
    
    // Check for any inconsistent services
    const inconsistentServices = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s."isActive",
        s."isApproved",
        s."approvalStatus",
        s."adminAssignedBadge",
        s."createdAt",
        s."updatedAt",
        c.name as category_name,
        p."businessName" as provider_name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      LEFT JOIN providers p ON s."providerId" = p.id
      WHERE 
        -- Catch inconsistencies
        (s."isApproved" = true AND s."approvalStatus" != 'approved') OR
        (s."isApproved" = false AND s."approvalStatus" = 'approved') OR
        -- Also check if active services are not properly approved
        (s."isActive" = true AND (s."isApproved" = false OR s."approvalStatus" != 'approved'))
      ORDER BY s."updatedAt" DESC
    `);
    
    if (inconsistentServices.rows.length === 0) {
      console.log('✅ All services have consistent status!');
    } else {
      console.log(`❌ Found ${inconsistentServices.rows.length} services with inconsistent status:`);
      
      inconsistentServices.rows.forEach((service, index) => {
        console.log(`\n   ${index + 1}. "${service.name}" (${service.provider_name})`);
        console.log(`      Category: ${service.category_name}`);
        console.log(`      isActive: ${service.isActive}`);
        console.log(`      isApproved: ${service.isApproved}`);
        console.log(`      approvalStatus: ${service.approvalStatus}`);
        console.log(`      Badge: ${service.adminAssignedBadge || 'None'}`);
        
        // Identify specific issues
        const issues = [];
        if (service.isApproved === true && service.approvalStatus !== 'approved') {
          issues.push('isApproved=true but approvalStatus not "approved"');
        }
        if (service.isApproved === false && service.approvalStatus === 'approved') {
          issues.push('isApproved=false but approvalStatus is "approved"');
        }
        if (service.isActive === true && (service.isApproved === false || service.approvalStatus !== 'approved')) {
          issues.push('isActive=true but service not properly approved');
        }
        console.log(`      ❌ Issues: ${issues.join(', ')}`);
      });
    }
    
    // Show current service status summary
    console.log('\n📊 Current Service Status Summary:');
    const statusSummary = await pool.query(`
      SELECT 
        COUNT(*) as total_services,
        COUNT(CASE WHEN "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved' THEN 1 END) as homepage_visible,
        COUNT(CASE WHEN "isApproved" = true AND "approvalStatus" = 'approved' THEN 1 END) as properly_approved,
        COUNT(CASE WHEN "approvalStatus" = 'pending_approval' THEN 1 END) as pending,
        COUNT(CASE WHEN "approvalStatus" = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN "adminAssignedBadge" IS NOT NULL AND "adminAssignedBadge" != '' THEN 1 END) as with_badges,
        COUNT(CASE WHEN ("adminAssignedBadge" IS NULL OR "adminAssignedBadge" = '') AND "isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved' THEN 1 END) as without_badges_but_visible
      FROM services
    `);
    
    const stats = statusSummary.rows[0];
    console.log(`   Total Services: ${stats.total_services}`);
    console.log(`   Homepage Visible: ${stats.homepage_visible}`);
    console.log(`   Properly Approved: ${stats.properly_approved}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Rejected: ${stats.rejected}`);
    console.log(`   With Badges: ${stats.with_badges}`);
    console.log(`   Without Badges but Visible: ${stats.without_badges_but_visible}`);
    
    if (parseInt(stats.without_badges_but_visible) > 0) {
      console.log(`\n💡 ${stats.without_badges_but_visible} service(s) are approved and active but have no badges.`);
      console.log('   These should now be visible in the "Featured Services" section on homepage.');
    }
    
  } catch (error) {
    console.error('❌ Error validating service consistency:', error.message);
  } finally {
    await pool.end();
  }
}

validateServiceConsistency();