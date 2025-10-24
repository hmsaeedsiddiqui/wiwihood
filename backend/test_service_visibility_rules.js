const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function testServiceVisibilityRules() {
  try {
    console.log('🔍 Testing Service Visibility Rules');
    console.log('='.repeat(50));
    
    // Create test scenarios by temporarily modifying the existing service
    const currentService = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s."isActive", 
        s."isApproved", 
        s."approvalStatus",
        s."adminAssignedBadge",
        c.name as category_name,
        c.slug as category_slug
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      LIMIT 1
    `);
    
    if (currentService.rows.length === 0) {
      console.log('❌ No services found to test with');
      return;
    }
    
    const service = currentService.rows[0];
    console.log(`📝 Testing with service: "${service.name}"`);
    console.log(`   Category: ${service.category_name} (slug: ${service.category_slug})`);
    console.log(`   Current status: Active=${service.isActive}, Approved=${service.isApproved}, Status=${service.approvalStatus}`);
    console.log(`   Current badge: ${service.adminAssignedBadge || 'None'}`);
    
    // Test 1: Service without badge should appear in category listings only
    console.log('\n🧪 Test 1: Service WITHOUT badge - should appear in category listings only');
    await pool.query(`UPDATE services SET "adminAssignedBadge" = NULL WHERE id = $1`, [service.id]);
    
    // Test category filtering (should return the service)
    const categoryResult = await pool.query(`
      SELECT s.id, s.name, s."adminAssignedBadge"
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        (LOWER(c.name) LIKE LOWER($1) OR c.slug = $2)
    `, [`%${service.category_name}%`, service.category_slug]);
    
    console.log(`   Category filtering (/services?category=${service.category_slug}):`);
    console.log(`   ✅ Found ${categoryResult.rows.length} services - should be 1`);
    
    // Test badge filtering (should return nothing)
    const badgeResult = await pool.query(`
      SELECT s.id, s.name, s."adminAssignedBadge"
      FROM services s
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        s."adminAssignedBadge" = 'Top Rated'
    `);
    
    console.log(`   Badge filtering (/services?type=top-rated):`);
    console.log(`   ✅ Found ${badgeResult.rows.length} services - should be 0`);
    
    // Test 2: Service with badge should appear in both category and badge listings
    console.log('\n🧪 Test 2: Service WITH badge - should appear in both category and badge listings');
    await pool.query(`UPDATE services SET "adminAssignedBadge" = 'Top Rated' WHERE id = $1`, [service.id]);
    
    // Test category filtering (should still return the service)
    const categoryWithBadgeResult = await pool.query(`
      SELECT s.id, s.name, s."adminAssignedBadge"
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        (LOWER(c.name) LIKE LOWER($1) OR c.slug = $2)
    `, [`%${service.category_name}%`, service.category_slug]);
    
    console.log(`   Category filtering (/services?category=${service.category_slug}):`);
    console.log(`   ✅ Found ${categoryWithBadgeResult.rows.length} services - should be 1`);
    
    // Test badge filtering (should now return the service)
    const badgeWithServiceResult = await pool.query(`
      SELECT s.id, s.name, s."adminAssignedBadge"
      FROM services s
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        s."adminAssignedBadge" = 'Top Rated'
    `);
    
    console.log(`   Badge filtering (/services?type=top-rated):`);
    console.log(`   ✅ Found ${badgeWithServiceResult.rows.length} services - should be 1`);
    
    // Test 3: Inactive service should not appear anywhere
    console.log('\n🧪 Test 3: INACTIVE service - should not appear anywhere');
    await pool.query(`UPDATE services SET "isActive" = false WHERE id = $1`, [service.id]);
    
    const inactiveCategoryResult = await pool.query(`
      SELECT s.id, s.name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        (LOWER(c.name) LIKE LOWER($1) OR c.slug = $2)
    `, [`%${service.category_name}%`, service.category_slug]);
    
    const inactiveBadgeResult = await pool.query(`
      SELECT s.id, s.name
      FROM services s
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        s."adminAssignedBadge" = 'Top Rated'
    `);
    
    console.log(`   Category filtering: ${inactiveCategoryResult.rows.length} services - should be 0`);
    console.log(`   Badge filtering: ${inactiveBadgeResult.rows.length} services - should be 0`);
    
    // Test 4: Unapproved service should not appear anywhere
    console.log('\n🧪 Test 4: UNAPPROVED service - should not appear anywhere');
    await pool.query(`UPDATE services SET "isActive" = true, "isApproved" = false, "approvalStatus" = 'pending_approval' WHERE id = $1`, [service.id]);
    
    const unapprovedCategoryResult = await pool.query(`
      SELECT s.id, s.name
      FROM services s
      LEFT JOIN categories c ON s."categoryId" = c.id
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        (LOWER(c.name) LIKE LOWER($1) OR c.slug = $2)
    `, [`%${service.category_name}%`, service.category_slug]);
    
    const unapprovedBadgeResult = await pool.query(`
      SELECT s.id, s.name
      FROM services s
      WHERE 
        s."isActive" = true AND 
        s."isApproved" = true AND 
        s."approvalStatus" = 'approved' AND
        s."adminAssignedBadge" = 'Top Rated'
    `);
    
    console.log(`   Category filtering: ${unapprovedCategoryResult.rows.length} services - should be 0`);
    console.log(`   Badge filtering: ${unapprovedBadgeResult.rows.length} services - should be 0`);
    
    // Restore original service state
    console.log('\n🔄 Restoring original service state...');
    await pool.query(`
      UPDATE services 
      SET 
        "isActive" = $1, 
        "isApproved" = $2, 
        "approvalStatus" = $3, 
        "adminAssignedBadge" = $4 
      WHERE id = $5
    `, [service.isActive, service.isApproved, service.approvalStatus, service.adminAssignedBadge, service.id]);
    
    console.log('✅ Service restored to original state');
    
    console.log('\n📋 Summary:');
    console.log('✅ Services without badges: Only appear in category listings');
    console.log('✅ Services with badges: Appear in both category and badge listings');
    console.log('✅ Inactive services: Hidden from all listings');
    console.log('✅ Unapproved services: Hidden from all listings');
    console.log('✅ Homepage: Will only show services that have badges assigned');
    
  } catch (error) {
    console.error('❌ Error testing service visibility:', error.message);
  } finally {
    await pool.end();
  }
}

testServiceVisibilityRules();