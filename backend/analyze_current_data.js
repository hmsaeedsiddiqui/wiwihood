console.log('📋 Current Services Status Report');
console.log('='.repeat(50));

const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function analyzeCurrentData() {
  try {
    // Check services
    console.log('🔍 Current Services in Admin Panel:');
    const services = await pool.query(`
      SELECT id, name, "basePrice", "adminAssignedBadge", "providerBusinessName"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    services.rows.forEach((service, i) => {
      console.log(`${i+1}. ${service.name} - $${service.basePrice} (Badge: ${service.adminAssignedBadge || 'None'})`);
    });
    
    // Check providers
    console.log('\n👥 Available Providers:');
    const providers = await pool.query(`
      SELECT id, "businessName", city, phone 
      FROM providers 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);
    
    if (providers.rows.length > 0) {
      providers.rows.forEach((provider, i) => {
        console.log(`${i+1}. ${provider.businessName} - ${provider.city || 'No city'} (${provider.phone || 'No phone'})`);
      });
    } else {
      console.log('   No providers found.');
    }
    
    console.log('\n💭 Analysis:');
    console.log(`   Current services: ${services.rows.length} (these appear to be test data)`);
    console.log(`   Available providers: ${providers.rows.length}`);
    
    console.log('\n🎯 Options for you:');
    console.log('   1. CLEAN SLATE: Delete all test services and start fresh');
    console.log('   2. REAL DATA: Replace test services with actual business services');
    console.log('   3. PROVIDERS FIRST: Create real provider accounts, then their services');
    console.log('   4. KEEP & ADD: Keep current services but add real ones alongside');
    
    console.log('\n❓ What would you like to do?');
    console.log('   Reply with your preference and I can help implement it.');
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

analyzeCurrentData();
