const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood_db',
  user: 'postgres',
  password: 'root'
});

async function checkServicesDetailed() {
  console.log('=== DETAILED SERVICES CHECK ===\n');
  
  try {
    const result = await pool.query(`
      SELECT 
        id, name, 
        "isActive", "isApproved", 
        "adminAssignedBadge", "highlightBadge",
        "isPromotional", "discountPercentage", "promoCode",
        "dealTitle", "dealDescription", "dealCategory",
        "isFeatured", "promotionText",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Total services found: ${result.rows.length}\n`);
    
    result.rows.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (ID: ${service.id})`);
      console.log(`   Active: ${service.isActive}, Approved: ${service.isApproved}`);
      console.log(`   Admin Badge: ${service.adminAssignedBadge || 'None'}`);
      console.log(`   Highlight Badge: ${service.highlightBadge || 'None'}`);
      console.log(`   Is Promotional: ${service.isPromotional}`);
      console.log(`   Discount: ${service.discountPercentage || 'None'}`);
      console.log(`   Promo Code: ${service.promoCode || 'None'}`);
      console.log(`   Deal Title: ${service.dealTitle || 'None'}`);
      console.log(`   Deal Description: ${service.dealDescription || 'None'}`);
      console.log(`   Deal Category: ${service.dealCategory || 'None'}`);
      console.log(`   Is Featured: ${service.isFeatured}`);
      console.log(`   Promotion Text: ${service.promotionText || 'None'}`);
      console.log(`   Created: ${new Date(service.createdAt).toLocaleString()}`);
      console.log('');
    });
    
    // Check for active services with badges
    const activeServices = result.rows.filter(s => s.isActive && s.isApproved);
    console.log(`=== ACTIVE APPROVED SERVICES (${activeServices.length}) ===`);
    activeServices.forEach(service => {
      console.log(`- ${service.name}: Badge="${service.adminAssignedBadge || 'None'}", Promotional=${service.isPromotional}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkServicesDetailed();