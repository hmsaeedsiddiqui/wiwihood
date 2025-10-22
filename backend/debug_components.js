console.log('=== DEBUGGING HOME PAGE COMPONENTS ===');

// Simulate the exact logic used in each component
function simulateComponents() {
  // Mock the database data we know exists
  const activeServices = [
    {
      id: "96bb19ce-92a2-4a46-825c-0caad96472dd",
      name: "Ea quia dolore dolor",
      adminAssignedBadge: "Top Rated",
      isPromotional: true,
      isActive: true,
      isApproved: true,
      provider: { businessName: "Test Provider 1" },
      category: { name: "Test Category" }
    },
    {
      id: "6f17dd4f-e87d-4e2f-804c-89587bec8b5c", 
      name: "Provident velit exp",
      adminAssignedBadge: "Hot Deal",
      isPromotional: false,
      isActive: true,
      isApproved: true,
      provider: { businessName: "Test Provider 2" },
      category: { name: "Test Category" }
    }
  ];

  console.log('\n1. POPULAR THIS WEEK (hot-product.tsx)');
  const badgeSet = ['popular', 'premium', 'top rated', 'top-rated', 'top rated'];
  const popularServices = activeServices.filter(s => 
    badgeSet.includes((s?.adminAssignedBadge || '').toString().toLowerCase())
  );
  console.log(`Expected: ${popularServices.length} services`);
  popularServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));

  console.log('\n2. PROMOTIONS/DEALS (PromotionsDeals.tsx)');
  const badgeKeywords = ['deal', 'hot', 'limited', 'offer', 'discount', 'sale'];
  const dealServices = activeServices.filter(s => {
    const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
    return badgeKeywords.some(k => badge.includes(k));
  });
  console.log(`Expected: ${dealServices.length} services`);
  dealServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));

  console.log('\n3. OUR CHOICE (our-choice.tsx)');
  const choiceServices = activeServices.filter(s => {
    const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
    return badge.includes('choice') || badge.includes('featured') || badge.includes('recommended');
  });
  console.log(`Expected: ${choiceServices.length} services`);
  choiceServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));

  console.log('\n4. NEW ON VIVIDHOOD (hot-product.tsx)');
  const newServices = activeServices.filter(s => {
    const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
    return badge.includes('new on wiwihood') || badge.includes('new on vividhood') || badge.includes('new on');
  });
  console.log(`Expected: ${newServices.length} services`);
  newServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));

  console.log('\n5. TOP RATED BUSINESSES (TopRatedBusinesses.tsx)');
  const topRatedServices = activeServices.filter(s => 
    (s?.adminAssignedBadge || '').toString().toLowerCase().includes('top')
  );
  console.log(`Expected: ${topRatedServices.length} services`);
  topRatedServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));

  console.log('\n=== SUMMARY ===');
  console.log(`Total unique services should show: ${activeServices.length}`);
  console.log('Each service should appear in max 1-2 sections based on badges');
}


simulateComponents();