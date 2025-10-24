const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function checkCurrentServices() {
  try {
    console.log('🔍 Checking current services with images...\n');
    
    // Check all services in database
    const allServices = await pool.query(`
      SELECT 
        id, 
        name, 
        description,
        "isActive",
        "isApproved", 
        "approvalStatus",
        "adminAssignedBadge",
        "basePrice",
        "providerBusinessName",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`📊 Found ${allServices.rows.length} services in database:`);
    allServices.rows.forEach((service, i) => {
      console.log(`\n${i+1}. "${service.name}"`);
      console.log(`   Provider: ${service.providerBusinessName || 'Unknown'}`);
      console.log(`   Price: ${service.basePrice || 'N/A'}`);
      console.log(`   Status: isActive=${service.isActive}, isApproved=${service.isApproved}, approvalStatus=${service.approvalStatus}`);
      console.log(`   Badge: ${service.adminAssignedBadge || 'None'}`);
      console.log(`   Created: ${service.createdAt}`);
    });
    
    console.log('\n� What would you like to do?');
    console.log('   1. Delete these test services and start fresh');
    console.log('   2. Keep these services but modify them to be more realistic');
    console.log('   3. Add new real services alongside these');
    console.log('   4. Just check what providers exist to create services for them');
    
    // Check providers
    console.log('\n� Available providers:');
    const providers = await pool.query(`
      SELECT id, "businessName", email, city 
      FROM providers 
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);
    
    if (providers.rows.length > 0) {
      providers.rows.forEach((provider, i) => {
        console.log(`${i+1}. ${provider.businessName} (${provider.city || 'No city'}) - ${provider.email}`);
      });
    } else {
      console.log('   No providers found. You may need to create providers first.');
    }
    
  } catch (error) {
    console.error('❌ Error checking services:', error.message);
  } finally {
    await pool.end();
  }
}

checkCurrentServices();