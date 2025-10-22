const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood_db',
  user: 'postgres',
  password: 'root'
});

async function testBackendLogic() {
  console.log('=== TESTING BACKEND FILTER LOGIC ===\n');
  
  try {
    // Simulate backend findAll with isActive: true filter
    console.log('1. Default query (no status filter, but isActive: true)');
    const result1 = await pool.query(`
      SELECT id, name, "isActive", "isApproved", "adminAssignedBadge", "isPromotional"
      FROM services 
      WHERE "isApproved" = true 
      AND "isActive" = true
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Found ${result1.rows.length} services:`);
    result1.rows.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - Badge: "${service.adminAssignedBadge || 'None'}", Active: ${service.isActive}, Approved: ${service.isApproved}`);
    });
    
    console.log('\n2. Filter by badges for Popular This Week (top rated, popular, premium)');
    const badgeServices = result1.rows.filter(s => {
      const badge = (s.adminAssignedBadge || '').toLowerCase();
      return ['popular', 'premium', 'top rated', 'top-rated'].includes(badge);
    });
    console.log(`Matching services: ${badgeServices.length}`);
    badgeServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));
    
    console.log('\n3. Filter by badges for Deals (deal, hot, limited, offer, discount, sale)');
    const dealServices = result1.rows.filter(s => {
      const badge = (s.adminAssignedBadge || '').toLowerCase();
      return ['deal', 'hot', 'limited', 'offer', 'discount', 'sale'].some(k => badge.includes(k));
    });
    console.log(`Matching services: ${dealServices.length}`);
    dealServices.forEach(s => console.log(`   - ${s.name}: "${s.adminAssignedBadge}"`));
    
    console.log('\n4. Filter by promotional flag');
    const promoServices = result1.rows.filter(s => s.isPromotional === true);
    console.log(`Promotional services: ${promoServices.length}`);
    promoServices.forEach(s => console.log(`   - ${s.name}: Promotional=${s.isPromotional}, Badge="${s.adminAssignedBadge}"`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testBackendLogic();