console.log('🔍 Testing Calendar View API...\n');

const fetch = require('node-fetch');

async function testCalendarView() {
  try {
    const baseUrl = 'http://localhost:3000/api/v1';
    const testDate = '2025-10-07';
    
    console.log(`📅 Testing Calendar View for date: ${testDate}`);
    console.log('🔗 URL:', `${baseUrl}/bookings/calendar/${testDate}`);
    
    // Test without authentication first (should work due to fallback in controller)
    const response = await fetch(`${baseUrl}/bookings/calendar/${testDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Adding a sample JWT token for testing
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2OTcwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.test'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Calendar View Response:');
      console.log(JSON.stringify(data, null, 2));
      
      console.log('\n📈 Summary:');
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   📆 Day: ${data.dayOfWeek}`);
      console.log(`   📋 Total Bookings: ${data.totalBookings}`);
      console.log(`   ⏰ Available Slots: ${data.availableSlots?.length || 0}`);
      console.log(`   🕐 Booked Hours: ${data.bookedHours}`);
      
      if (data.availableSlots && data.availableSlots.length > 0) {
        console.log('   🆓 Available Times:', data.availableSlots.join(', '));
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 3000');
  }
}

// Run the test
testCalendarView();