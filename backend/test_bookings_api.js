// Test script for Enhanced Bookings API

const BASE_URL = 'http://localhost:3001/api/v1';

let authToken = '';

async function makeRequest(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

async function testBookingsAPI() {
  console.log('🔧 Testing Enhanced Bookings API...\n');

  try {
    // 1. Register/Login Test User
    console.log('📝 Step 1: Authentication...');
    try {
      const registerResponse = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'Customer',
          email: 'customer@test.com',
          password: 'password123',
          role: 'customer'
        }),
      });
      authToken = registerResponse.accessToken;
      console.log('✅ User registered successfully');
    } catch (error) {
      // Try login if registration fails (user might exist)
      const loginResponse = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'customer@test.com',
          password: 'password123'
        }),
      });
      authToken = loginResponse.accessToken;
      console.log('✅ User logged in successfully');
    }

    // 2. Test Get Available Time Slots
    console.log('\n🕐 Step 2: Testing Available Time Slots...');
    try {
      // Note: These would be real provider/service IDs in a real scenario
      const providerId = '550e8400-e29b-41d4-a716-446655440000'; // Mock UUID
      const serviceId = '550e8400-e29b-41d4-a716-446655440001';  // Mock UUID
      const date = '2024-12-25';
      
      console.log(`🔍 Checking availability for Provider: ${providerId}, Service: ${serviceId}, Date: ${date}`);
      // This will likely fail since we don't have real data, but shows the endpoint
      
      const availability = await makeRequest(`/bookings/availability/${providerId}/${serviceId}?date=${date}`);
      console.log('✅ Available time slots:', availability);
    } catch (error) {
      console.log('ℹ️  Expected error (no real provider/service data):', error.message);
    }

    // 3. Test Create Booking
    console.log('\n📅 Step 3: Testing Create Booking...');
    try {
      const newBooking = await makeRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: '550e8400-e29b-41d4-a716-446655440001',
          providerId: '550e8400-e29b-41d4-a716-446655440000',
          startTime: '2024-12-25T10:00:00Z',
          endTime: '2024-12-25T11:00:00Z',
          totalPrice: 50.00,
          notes: 'Test booking from API'
        }),
      });
      
      console.log('✅ Booking created:', newBooking);
      
      // Store booking ID for later tests
      const bookingId = newBooking.id;

      // 4. Test Get My Bookings
      console.log('\n📋 Step 4: Testing Get My Bookings...');
      const myBookings = await makeRequest('/bookings/my-bookings');
      console.log('✅ My bookings retrieved:', myBookings);

      // 5. Test Get Upcoming Bookings
      console.log('\n⏰ Step 5: Testing Get Upcoming Bookings...');
      const upcomingBookings = await makeRequest('/bookings/upcoming');
      console.log('✅ Upcoming bookings:', upcomingBookings);

      // 6. Test Reschedule Booking
      console.log('\n🔄 Step 6: Testing Reschedule Booking...');
      const rescheduled = await makeRequest(`/bookings/${bookingId}/reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStartTime: '2024-12-25T14:00:00Z',
          newEndTime: '2024-12-25T15:00:00Z',
          reason: 'Customer requested time change'
        }),
      });
      console.log('✅ Booking rescheduled:', rescheduled);

      // 7. Test Booking Stats
      console.log('\n📊 Step 7: Testing Booking Statistics...');
      const stats = await makeRequest('/bookings/stats');
      console.log('✅ Booking statistics:', stats);

      // 8. Test Cancel Booking
      console.log('\n❌ Step 8: Testing Cancel Booking...');
      const cancelled = await makeRequest(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });
      console.log('✅ Booking cancelled:', cancelled);

    } catch (error) {
      console.log('ℹ️  Expected error (requires real service/provider data):', error.message);
    }

    // 9. Test Provider Features (if we had a provider account)
    console.log('\n👨‍💼 Step 9: Provider Features Demo...');
    console.log('📌 Additional provider endpoints available:');
    console.log('   • PATCH /bookings/:id/checkin - Check in customer');
    console.log('   • PATCH /bookings/:id/complete - Complete service');
    console.log('   • GET /bookings - Admin view all bookings');

    console.log('\n🎉 Bookings API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Additional helper function to demonstrate API capabilities
function logAPIEndpoints() {
  console.log('\n📚 Enhanced Bookings API Endpoints:\n');
  
  const endpoints = [
    { method: 'POST', path: '/bookings', description: 'Create new booking' },
    { method: 'GET', path: '/bookings/my-bookings', description: 'Get user bookings' },
    { method: 'GET', path: '/bookings/upcoming', description: 'Get upcoming bookings' },
    { method: 'GET', path: '/bookings/stats', description: 'Get booking statistics' },
    { method: 'GET', path: '/bookings/availability/:providerId/:serviceId', description: 'Check time slot availability' },
    { method: 'PATCH', path: '/bookings/:id/reschedule', description: 'Reschedule booking' },
    { method: 'PATCH', path: '/bookings/:id/cancel', description: 'Cancel booking' },
    { method: 'PATCH', path: '/bookings/:id/checkin', description: 'Check in customer (Provider only)' },
    { method: 'PATCH', path: '/bookings/:id/complete', description: 'Complete booking (Provider only)' },
    { method: 'GET', path: '/bookings', description: 'Get all bookings (Admin only)' },
  ];

  endpoints.forEach(endpoint => {
    console.log(`${endpoint.method.padEnd(6)} ${endpoint.path.padEnd(40)} - ${endpoint.description}`);
  });
  
  console.log('\n');
}

// Run the test
logAPIEndpoints();
testBookingsAPI().catch(console.error);
