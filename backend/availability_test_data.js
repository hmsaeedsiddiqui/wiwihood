// Check Availability API Test Data
console.log('=== CHECK AVAILABILITY API TEST DATA ===\n');

// Generate test times
const now = new Date();
const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

console.log('=== OPTION 1: Simple Availability Check ===\n');

const availabilityRequest1 = {
  providerId: "550e8400-e29b-41d4-a716-446655440011",
  startTime: startTime.toISOString(),
  endTime: endTime.toISOString()
};

console.log('Request Body:');
console.log(JSON.stringify(availabilityRequest1, null, 2));

console.log('\n=== OPTION 2: Service-Based Availability Check ===\n');

const availabilityRequest2 = {
  providerId: "550e8400-e29b-41d4-a716-446655440011",
  serviceId: "19f77203-2904-4e96-bcad-78d5ca984c7c",
  date: "2025-10-07"
};

console.log('Request Body:');
console.log(JSON.stringify(availabilityRequest2, null, 2));

console.log('\n=== API ENDPOINT INFORMATION ===');
console.log('URL: POST http://localhost:8000/api/v1/bookings/check-availability');
console.log('\n=== REQUIRED HEADERS ===');
console.log('Content-Type: application/json');
console.log('Authorization: Bearer YOUR_JWT_TOKEN');

console.log('\n=== SWAGGER UI TEST STEPS ===');
console.log('1. Go to: http://localhost:8000/api/docs');
console.log('2. Find "Bookings" section');
console.log('3. Click on "POST /api/v1/bookings/check-availability"');
console.log('4. Click "Try it out"');
console.log('5. Make sure you have JWT token in Authorization');
console.log('6. Paste ONE of the above JSON request bodies');
console.log('7. Click "Execute"');

console.log('\n=== EXPECTED SUCCESSFUL RESPONSE ===');
console.log(JSON.stringify({
  "available": true,
  "message": "Time slot is available"
}, null, 2));

console.log('\n=== EXPECTED ERROR RESPONSE ===');
console.log(JSON.stringify({
  "available": false,
  "message": "Time slot is not available"
}, null, 2));

console.log('\n=== COMMON ISSUES ===');
console.log('❌ Empty request body - yeh galat hai');
console.log('❌ Missing required fields (providerId, startTime, endTime)');
console.log('❌ Invalid UUID format');
console.log('❌ Invalid date/time format');
console.log('✅ Use ISO 8601 date format: "2025-10-07T10:00:00Z"');
console.log('✅ Provide all required fields');
console.log('✅ Use valid UUIDs that exist in database');