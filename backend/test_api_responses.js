const fetch = require('node-fetch');

async function testAPI() {
  console.log('=== TESTING FRONTEND APIs ===\n');
  
  const baseURL = 'http://localhost:8000/api/v1';
  
  try {
    // Test services endpoint
    console.log('1. Testing /services (active services)');
    const servicesResponse = await fetch(`${baseURL}/services?isActive=true`);
    const servicesData = await servicesResponse.json();
    console.log(`Services count: ${servicesData.length}`);
    servicesData.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - Badge: "${service.adminAssignedBadge || 'None'}", Active: ${service.isActive}, Approved: ${service.isApproved}`);
    });
    
    console.log('\n2. Testing /services/popular');
    const popularResponse = await fetch(`${baseURL}/services/popular?limit=12`);
    const popularData = await popularResponse.json();
    console.log(`Popular services count: ${popularData.length}`);
    popularData.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - Badge: "${service.adminAssignedBadge || 'None'}", Active: ${service.isActive}, Approved: ${service.isApproved}`);
    });
    
    console.log('\n3. Testing categories');
    const categoriesResponse = await fetch(`${baseURL}/categories?isActive=true`);
    const categoriesData = await categoriesResponse.json();
    console.log(`Categories count: ${categoriesData.length}`);
    
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAPI();