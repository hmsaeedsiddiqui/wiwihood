const { Client } = require('pg');

async function debugFiltering() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root'
  });

  try {
    await client.connect();
    console.log('=== DEBUGGING SERVICE FILTERING STEP BY STEP ===\n');

    // Get all services
    const result = await client.query(`
      SELECT 
        id, 
        name, 
        "isActive", 
        "isApproved", 
        "approvalStatus",
        status,
        "adminAssignedBadge",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);

    const allServices = result.rows;
    console.log(`📊 TOTAL SERVICES: ${allServices.length}`);
    allServices.forEach((service, index) => {
      console.log(`${index + 1}. "${service.name}" - Badge: "${service.adminAssignedBadge}" - Active: ${service.isActive} - Approved: ${service.isApproved} - ApprovalStatus: ${service.approvalStatus}`);
    });

    console.log('\n=== STEP 1: API QUERY FILTER ===');
    console.log('API Query: isActive=true AND isApproved=true AND approvalStatus="approved"');
    
    const activeServices = allServices.filter(s => 
      s.isActive === true && 
      s.isApproved === true && 
      s.approvalStatus === 'approved'
    );
    
    console.log(`✅ Services matching API query: ${activeServices.length}`);
    activeServices.forEach((service, index) => {
      console.log(`   ${index + 1}. "${service.name}" - Badge: "${service.adminAssignedBadge}"`);
    });

    console.log('\n=== STEP 2: HOT-PRODUCT.TSX FILTERING ===');
    
    // Popular This Week filtering
    console.log('\n📍 Popular This Week Filter:');
    console.log('Badges: [\'popular\', \'premium\', \'top rated\', \'top-rated\', \'trending\', \'most popular\']');
    
    const popularBadges = ['popular', 'premium', 'top rated', 'top-rated', 'trending', 'most popular'];
    const popularMatches = activeServices.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
      const matches = popularBadges.some(b => badge === b || badge.includes(b));
      if (matches) {
        console.log(`   ✅ MATCH: "${s.name}" - Badge: "${s.adminAssignedBadge}" - Badge toLowerCase: "${badge}"`);
      }
      return matches;
    });
    console.log(`Result: ${popularMatches.length} services (showing first 1)`);

    // Best Sellers filtering  
    console.log('\n📍 Best Sellers Filter:');
    console.log('Badges: [\'best seller\', \'best-seller\', \'bestseller\', \'top seller\']');
    
    const bestSellerBadges = ['best seller', 'best-seller', 'bestseller', 'top seller'];
    const bestSellerMatches = activeServices.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
      const matches = bestSellerBadges.some(b => badge === b || badge.includes(b));
      if (matches) {
        console.log(`   ✅ MATCH: "${s.name}" - Badge: "${s.adminAssignedBadge}" - Badge toLowerCase: "${badge}"`);
      }
      return matches;
    });
    console.log(`Result: ${bestSellerMatches.length} services`);

    // New on Vividhood filtering
    console.log('\n📍 New on Vividhood Filter:');
    console.log('Badges: [\'new\', \'new on vividhood\', \'new on wiwihood\', \'new on\', \'recently added\', \'latest\']');
    
    const newBadges = ['new', 'new on vividhood', 'new on wiwihood', 'new on', 'recently added', 'latest'];
    const newMatches = activeServices.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
      const matches = newBadges.some(b => badge === b || badge.includes(b));
      if (matches) {
        console.log(`   ✅ MATCH: "${s.name}" - Badge: "${s.adminAssignedBadge}" - Badge toLowerCase: "${badge}"`);
      }
      return matches;
    });
    console.log(`Result: ${newMatches.length} services`);

    console.log('\n=== STEP 3: PROMOTIONSDEALS.TSX FILTERING ===');
    console.log('\n📍 Deals/Promotions Filter:');
    console.log('Badges: [\'hot deal\', \'hot-deal\', \'discount\', \'sale\', \'promotion\', \'offer\', \'special offer\', \'limited time\', \'deal\']');
    
    const dealBadges = ['hot deal', 'hot-deal', 'discount', 'sale', 'promotion', 'offer', 'special offer', 'limited time', 'deal'];
    const dealMatches = activeServices.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
      const matches = dealBadges.some(b => badge === b || badge.includes(b));
      if (matches) {
        console.log(`   ✅ MATCH: "${s.name}" - Badge: "${s.adminAssignedBadge}" - Badge toLowerCase: "${badge}"`);
      }
      return matches;
    });
    console.log(`Result: ${dealMatches.length} services`);

    console.log('\n=== SUMMARY ===');
    console.log(`Total Services: ${allServices.length}`);
    console.log(`Active & Approved: ${activeServices.length}`);
    console.log(`Popular This Week: ${popularMatches.length} (showing 1)`);
    console.log(`Best Sellers: ${bestSellerMatches.length}`);
    console.log(`New on Vividhood: ${newMatches.length}`);
    console.log(`Deals/Promotions: ${dealMatches.length}`);

    console.log('\n=== ISSUE ANALYSIS ===');
    if (popularMatches.length > 1) {
      console.log('❌ ISSUE: Popular This Week has more than 1 service but should show only 1');
      console.log('Services in Popular This Week:');
      popularMatches.forEach((s, i) => {
        console.log(`   ${i+1}. "${s.name}" - Badge: "${s.adminAssignedBadge}"`);
      });
    }

    if (dealMatches.length > 0 && popularMatches.length > 0) {
      console.log('❌ POTENTIAL ISSUE: Both Popular and Deals sections may be showing services');
      console.log('Check if services appear in multiple sections');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

debugFiltering();