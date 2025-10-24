const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  port: 5432,
});

async function testServiceVisibilityRules() {
  try {
    console.log('🧪 TESTING SERVICE VISIBILITY RULES\n');

    // Test 1: Create services with different approval/active combinations
    console.log('📝 STEP 1: Creating test services with different states...\n');

    // Get existing provider and category for test services
    const providerResult = await pool.query('SELECT id FROM providers LIMIT 1');
    const categoryResult = await pool.query('SELECT id FROM categories LIMIT 1');
    
    if (providerResult.rows.length === 0 || categoryResult.rows.length === 0) {
      console.log('❌ No providers or categories found. Please run the sample data script first.');
      return;
    }

    const providerId = providerResult.rows[0].id;
    const categoryId = categoryResult.rows[0].id;

    // Create test services with different visibility states
    const testServices = [
      {
        name: 'TEST: Approved + Active + No Badge',
        isActive: true,
        isApproved: true,
        approvalStatus: 'approved',
        adminAssignedBadge: null,
        description: 'Should appear ONLY in category listings'
      },
      {
        name: 'TEST: Approved + Active + With Badge',
        isActive: true,
        isApproved: true,
        approvalStatus: 'approved',
        adminAssignedBadge: 'Top Rated',
        description: 'Should appear in BOTH category AND badge sections'
      },
      {
        name: 'TEST: Not Approved + Active',
        isActive: true,
        isApproved: false,
        approvalStatus: 'pending_approval',
        adminAssignedBadge: 'Popular',
        description: 'Should NOT appear anywhere (not approved)'
      },
      {
        name: 'TEST: Approved + Not Active',
        isActive: false,
        isApproved: true,
        approvalStatus: 'approved',
        adminAssignedBadge: 'Best Seller',
        description: 'Should NOT appear anywhere (not active)'
      },
      {
        name: 'TEST: Not Approved + Not Active',
        isActive: false,
        isApproved: false,
        approvalStatus: 'rejected',
        adminAssignedBadge: 'Hot Deal',
        description: 'Should NOT appear anywhere (neither approved nor active)'
      }
    ];

    // Clean up any existing test services
    await pool.query(`DELETE FROM services WHERE name LIKE 'TEST:%'`);

    // Insert test services
    for (const service of testServices) {
      await pool.query(`
        INSERT INTO services (
          id, name, description, "shortDescription", "serviceType", "pricingType",
          "basePrice", currency, "durationMinutes", "bufferTimeMinutes",
          "maxAdvanceBookingDays", "minAdvanceBookingHours", "cancellationPolicyHours",
          "requiresDeposit", "depositAmount", images, tags, "isOnline", status,
          "isActive", "isFeatured", "sortOrder", "totalBookings", "averageRating",
          "totalReviews", "createdAt", "updatedAt", "providerId", "categoryId",
          "displayLocation", "providerBusinessName", "featuredImage",
          "adminAssignedBadge", "isApproved", "approvalStatus"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, 'appointment', 'fixed',
          100, 'AED', 60, 15,
          30, 2, 24,
          false, 0, '[]', '[]', false, 'active',
          $4, false, 1, 0, 4.5,
          0, NOW(), NOW(), $5, $6,
          'Dubai, UAE', 'Test Provider', '/test.jpg',
          $7, $8, $9
        )
      `, [
        service.name, service.description, service.description.substring(0, 100),
        service.isActive, providerId, categoryId,
        service.adminAssignedBadge, service.isApproved, service.approvalStatus
      ]);
      
      console.log(`✅ Created: ${service.name}`);
    }

    console.log('\n📊 STEP 2: Testing visibility rules...\n');

    // Test 2: Check what services appear with different queries

    // Test 2a: All services (should only show approved + active)
    console.log('🔍 TEST 2A: All services (no filters)');
    const allServicesQuery = `
      SELECT name, "isActive", "isApproved", "approvalStatus", "adminAssignedBadge"
      FROM services 
      WHERE name LIKE 'TEST:%'
      ORDER BY name;
    `;
    const allServicesResult = await pool.query(allServicesQuery);
    console.log('Raw data (all test services):');
    allServicesResult.rows.forEach(service => {
      console.log(`  - ${service.name}: Active=${service.isActive}, Approved=${service.isApproved}, Status=${service.approvalStatus}, Badge=${service.adminAssignedBadge || 'None'}`);
    });

    // Test 2b: Services that should be visible (approved + active)
    console.log('\n🔍 TEST 2B: Visible services (approved + active only)');
    const visibleServicesQuery = `
      SELECT name, "adminAssignedBadge"
      FROM services 
      WHERE name LIKE 'TEST:%'
        AND "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
      ORDER BY name;
    `;
    const visibleServicesResult = await pool.query(visibleServicesQuery);
    console.log(`Found ${visibleServicesResult.rows.length} visible services:`);
    visibleServicesResult.rows.forEach(service => {
      const badgeStatus = service.adminAssignedBadge ? `With badge: ${service.adminAssignedBadge}` : 'No badge (category only)';
      console.log(`  ✅ ${service.name} - ${badgeStatus}`);
    });

    // Test 2c: Services with badges (should appear in badge sections)
    console.log('\n🔍 TEST 2C: Services for badge sections (approved + active + has badge)');
    const badgeServicesQuery = `
      SELECT name, "adminAssignedBadge"
      FROM services 
      WHERE name LIKE 'TEST:%'
        AND "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
        AND "adminAssignedBadge" IS NOT NULL
        AND "adminAssignedBadge" != ''
      ORDER BY name;
    `;
    const badgeServicesResult = await pool.query(badgeServicesQuery);
    console.log(`Found ${badgeServicesResult.rows.length} services for badge sections:`);
    badgeServicesResult.rows.forEach(service => {
      console.log(`  🏷️ ${service.name} - Badge: ${service.adminAssignedBadge}`);
    });

    // Test 2d: Services for category only (approved + active + no badge)
    console.log('\n🔍 TEST 2D: Services for category sections only (approved + active + no badge)');
    const categoryOnlyQuery = `
      SELECT name
      FROM services 
      WHERE name LIKE 'TEST:%'
        AND "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
        AND ("adminAssignedBadge" IS NULL OR "adminAssignedBadge" = '')
      ORDER BY name;
    `;
    const categoryOnlyResult = await pool.query(categoryOnlyQuery);
    console.log(`Found ${categoryOnlyResult.rows.length} services for category sections only:`);
    categoryOnlyResult.rows.forEach(service => {
      console.log(`  📂 ${service.name} - Category only`);
    });

    // Test 2e: Hidden services (not approved or not active)
    console.log('\n🔍 TEST 2E: Hidden services (not approved OR not active)');
    const hiddenServicesQuery = `
      SELECT name, "isActive", "isApproved", "approvalStatus"
      FROM services 
      WHERE name LIKE 'TEST:%'
        AND NOT ("isActive" = true AND "isApproved" = true AND "approvalStatus" = 'approved')
      ORDER BY name;
    `;
    const hiddenServicesResult = await pool.query(hiddenServicesQuery);
    console.log(`Found ${hiddenServicesResult.rows.length} hidden services:`);
    hiddenServicesResult.rows.forEach(service => {
      const reason = [];
      if (!service.isActive) reason.push('not active');
      if (!service.isApproved) reason.push('not approved');
      if (service.approvalStatus !== 'approved') reason.push(`status: ${service.approvalStatus}`);
      console.log(`  ❌ ${service.name} - Hidden because: ${reason.join(', ')}`);
    });

    console.log('\n🎯 STEP 3: Verification Summary\n');

    const expectedVisible = visibleServicesResult.rows.length;
    const expectedBadged = badgeServicesResult.rows.length;
    const expectedCategoryOnly = categoryOnlyResult.rows.length;
    const expectedHidden = hiddenServicesResult.rows.length;

    console.log('📋 Expected Results:');
    console.log(`  ✅ Visible services: ${expectedVisible} (approved + active)`);
    console.log(`  🏷️ Badge section services: ${expectedBadged} (visible + has badge)`);
    console.log(`  📂 Category only services: ${expectedCategoryOnly} (visible + no badge)`);
    console.log(`  ❌ Hidden services: ${expectedHidden} (not approved OR not active)`);

    console.log('\n✅ VISIBILITY RULES TEST COMPLETED');
    console.log('\nTo test frontend:');
    console.log('1. Visit homepage - should only see badge sections with services that have badges');
    console.log('2. Visit /services?category=<category> - should see all visible services from that category');
    console.log('3. Visit /services?type=top-rated - should only see services with "Top Rated" badge');

  } catch (error) {
    console.error('❌ Error testing visibility rules:', error);
  } finally {
    await pool.end();
  }
}

testServiceVisibilityRules();