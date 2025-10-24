const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function checkServices() {
  try {
    console.log('=== SERVICE VISIBILITY ANALYSIS ===');
    
    // Get all services with their approval status
    const allServices = await pool.query(`
      SELECT 
        id, name, "isActive", "isApproved", status, "approvalStatus",
        "createdAt", "adminAssignedBadge", "basePrice", "providerId", "categoryId"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\nTotal services in database: ${allServices.rows.length}`);
    
    // Analyze service states
    const approved = allServices.rows.filter(s => s.isApproved === true);
    const active = allServices.rows.filter(s => s.isActive === true);
    const visible = allServices.rows.filter(s => s.isApproved === true && s.isActive === true && s.status === 'approved');
    
    console.log(`Approved services (isApproved=true): ${approved.length}`);
    console.log(`Active services (isActive=true): ${active.length}`);
    console.log(`Fully visible services (approved + active + status='approved'): ${visible.length}`);
    
    console.log('\n=== ALL SERVICES BREAKDOWN ===');
    allServices.rows.forEach((service, index) => {
      const isVisible = service.isApproved === true && service.isActive === true && service.status === 'approved';
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   - Provider ID: ${service.providerId}`);
      console.log(`   - Category ID: ${service.categoryId}`);
      console.log(`   - Price: $${service.basePrice}`);
      console.log(`   - isApproved: ${service.isApproved}`);
      console.log(`   - isActive: ${service.isActive}`);
      console.log(`   - status: ${service.status}`);
      console.log(`   - approvalStatus: ${service.approvalStatus}`);
      console.log(`   - badge: ${service.adminAssignedBadge || 'none'}`);
      console.log(`   - VISIBLE ON HOMEPAGE: ${isVisible ? 'YES' : 'NO'}`);
      console.log(`   - Created: ${service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}`);
      console.log('');
    });
    
    if (visible.length > 4) {
      console.log(`⚠️  WARNING: Found ${visible.length} visible services, but user expects only 4!`);
      console.log('This suggests there is test data that should be cleaned up.');
      
      console.log('\n=== VISIBLE SERVICES (showing on homepage) ===');
      visible.forEach((service, index) => {
        console.log(`${index + 1}. ${service.name} (Provider ID: ${service.providerId})`);
      });
    }
    
    // Check if there are test services
    const testServices = allServices.rows.filter(s => 
      s.name.toLowerCase().includes('test') || 
      s.name.toLowerCase().includes('sample') ||
      s.name.toLowerCase().includes('demo')
    );
    
    if (testServices.length > 0) {
      console.log(`\n=== POTENTIAL TEST SERVICES (${testServices.length}) ===`);
      testServices.forEach(service => {
        const isVisible = service.isApproved === true && service.isActive === true && service.status === 'approved';
        console.log(`- ${service.name} (ID: ${service.id}) - VISIBLE: ${isVisible ? 'YES' : 'NO'}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking services:', error);
  } finally {
    await pool.end();
  }
}

checkServices();