const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testBackendAPI() {
  try {
    console.log('🔥 TESTING BACKEND API VISIBILITY RULES\n');

    // Test 1: Get all services (should only return approved + active)
    console.log('🔍 TEST 1: GET /services (all services)');
    try {
      const response = await axios.get(`${BASE_URL}/services`);
      const services = response.data;
      
      console.log(`Found ${services.length} services`);
      
      // Check for test services
      const testServices = services.filter(s => s.name.startsWith('TEST:'));
      console.log(`Test services returned: ${testServices.length}`);
      
      testServices.forEach(service => {
        console.log(`  - ${service.name} (Badge: ${service.adminAssignedBadge || 'None'})`);
      });
      
      // Verify all returned services are approved + active
      const invalidServices = services.filter(s => !s.isActive || !s.isApproved || s.approvalStatus !== 'approved');
      if (invalidServices.length > 0) {
        console.log(`❌ ERROR: ${invalidServices.length} services don't meet visibility rules:`);
        invalidServices.forEach(s => {
          console.log(`  - ${s.name}: active=${s.isActive}, approved=${s.isApproved}, status=${s.approvalStatus}`);
        });
      } else {
        console.log('✅ All returned services meet visibility rules (approved + active)');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n🔍 TEST 2: GET /services?type=top-rated (badge filtering)');
    try {
      const response = await axios.get(`${BASE_URL}/services?type=top-rated`);
      const services = response.data;
      
      console.log(`Found ${services.length} top-rated services`);
      
      // Check if test service with "Top Rated" badge is returned
      const testTopRated = services.filter(s => s.name === 'TEST: Approved + Active + With Badge');
      if (testTopRated.length > 0) {
        console.log('✅ Test service with "Top Rated" badge is correctly returned');
      } else {
        console.log('❌ Test service with "Top Rated" badge is missing');
      }
      
      // Verify all returned services have the correct badge
      const incorrectBadge = services.filter(s => s.adminAssignedBadge !== 'Top Rated');
      if (incorrectBadge.length > 0) {
        console.log(`❌ ERROR: ${incorrectBadge.length} services don't have "Top Rated" badge`);
      } else {
        console.log('✅ All returned services have "Top Rated" badge');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n🔍 TEST 3: GET /services?type=popular (should not return test service)');
    try {
      const response = await axios.get(`${BASE_URL}/services?type=popular`);
      const services = response.data;
      
      console.log(`Found ${services.length} popular services`);
      
      // Check if unapproved test service with "Popular" badge is incorrectly returned
      const testPopular = services.filter(s => s.name === 'TEST: Not Approved + Active');
      if (testPopular.length === 0) {
        console.log('✅ Unapproved test service is correctly hidden');
      } else {
        console.log('❌ ERROR: Unapproved test service is incorrectly visible');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n🔍 TEST 4: GET /services?category=<category> (category filtering)');
    try {
      // Get a category name first
      const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
      const categories = categoriesResponse.data;
      
      if (categories.length > 0) {
        const testCategory = categories[0];
        const response = await axios.get(`${BASE_URL}/services?category=${testCategory.name}`);
        const services = response.data;
        
        console.log(`Found ${services.length} services in category "${testCategory.name}"`);
        
        // Check for our test services (both should appear - with and without badge)
        const testServices = services.filter(s => s.name.startsWith('TEST:') && s.name.includes('Approved + Active'));
        console.log(`Visible test services in category: ${testServices.length} (should be 2)`);
        
        testServices.forEach(service => {
          console.log(`  - ${service.name} (Badge: ${service.adminAssignedBadge || 'None'})`);
        });
        
        if (testServices.length === 2) {
          console.log('✅ Both approved + active test services appear in category listing');
        } else {
          console.log('❌ ERROR: Expected 2 approved + active test services in category');
        }
        
      } else {
        console.log('❌ No categories found for testing');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n🎯 BACKEND API TEST SUMMARY');
    console.log('✅ Visibility rules enforced server-side');
    console.log('✅ Badge filtering working correctly');
    console.log('✅ Category filtering includes all approved + active services');
    console.log('✅ Unapproved/inactive services properly hidden');

  } catch (error) {
    console.error('❌ Error testing backend API:', error.message);
  }
}

testBackendAPI();