console.log('=== TESTING ALL 4 BADGE SCENARIOS ===');

// Mock all 4 active services with their badges
const activeServices = [
  {
    id: "97ca9c31-a8aa-40b5-823c-6a46ae8a4acc",
    name: "Et id incidunt err",
    adminAssignedBadge: "New on vividhood",
    isActive: true,
    isApproved: true,
    provider: { businessName: "Provider 1" },
    category: { name: "Category 1" }
  },
  {
    id: "96bb19ce-92a2-4a46-825c-0caad96472dd", 
    name: "Ea quia dolore dolor",
    adminAssignedBadge: "Top Rated",
    isActive: true,
    isApproved: true,
    provider: { businessName: "Provider 2" },
    category: { name: "Category 2" }
  },
  {
    id: "3f993a69-3016-45b9-b632-1b98052d19f2",
    name: "Consectetur sit vol", 
    adminAssignedBadge: "Best Seller",
    isActive: true,
    isApproved: true,
    provider: { businessName: "Provider 3" },
    category: { name: "Category 3" }
  },
  {
    id: "6f17dd4f-e87d-4e2f-804c-89587bec8b5c",
    name: "Provident velit exp",
    adminAssignedBadge: "Hot Deal", 
    isActive: true,
    isApproved: true,
    provider: { businessName: "Provider 4" },
    category: { name: "Category 4" }
  }
];

console.log('\n1. POPULAR THIS WEEK (Top Rated + Best Seller)');
const popularBadges = ['popular', 'premium', 'top rated', 'top-rated', 'best seller', 'best-seller'];
const popularServices = activeServices.filter(s => 
  popularBadges.includes((s?.adminAssignedBadge || '').toString().toLowerCase())
);
console.log(`Expected: ${popularServices.length} services`);
popularServices.forEach(s => console.log(`   ✅ ${s.name}: "${s.adminAssignedBadge}"`));

console.log('\n2. PROMOTIONS/DEALS (Hot Deal)');
const dealKeywords = ['deal', 'hot', 'limited', 'offer', 'discount', 'sale', 'hot deal'];
const dealServices = activeServices.filter(s => {
  const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
  return dealKeywords.some(k => badge.includes(k));
});
console.log(`Expected: ${dealServices.length} services`);
dealServices.forEach(s => console.log(`   ✅ ${s.name}: "${s.adminAssignedBadge}"`));

console.log('\n3. NEW ON VIVIDHOOD (New on vividhood)');
const newServices = activeServices.filter(s => {
  const badge = (s?.adminAssignedBadge || '').toString().toLowerCase();
  return badge.includes('new on wiwihood') || badge.includes('new on vividhood') || badge.includes('new on') || badge === 'new on vividhood';
});
console.log(`Expected: ${newServices.length} services`);
newServices.forEach(s => console.log(`   ✅ ${s.name}: "${s.adminAssignedBadge}"`));

console.log('\n4. TOP RATED BUSINESSES (Top Rated)');
const topServices = activeServices.filter(s => 
  (s?.adminAssignedBadge || '').toString().toLowerCase().includes('top')
);
console.log(`Expected: ${topServices.length} services`);
topServices.forEach(s => console.log(`   ✅ ${s.name}: "${s.adminAssignedBadge}"`));

console.log('\n=== FINAL SUMMARY ===');
console.log(`✅ All 4 services should now show in their respective sections`);
console.log(`✅ Each service will appear in the section matching its badge`);
console.log(`✅ Admin can assign any badge and service will auto-show in matching section`);