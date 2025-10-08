// COMPLETE SWAGGER UI TEST DATA
console.log('=== SWAGGER UI COMPLETE TEST GUIDE ===\n');

console.log('🌐 SWAGGER URL: http://localhost:8000/api/docs\n');

console.log('🔐 JWT TOKEN FOR AUTHORIZATION:');
console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NzM1NDU1LCJleHAiOjE3NTk3MzkwNTV9.pjwnR12Y32bQjngoeg3y3D0HU8ed8DS1G049qHyEXWc\n');

console.log('=====================================');
console.log('TEST 1: CHECK AVAILABILITY');
console.log('=====================================');
console.log('API: POST /api/v1/bookings/check-availability');
console.log('\nREQUEST BODY (COPY THIS):');
console.log(JSON.stringify({
  "providerId": "550e8400-e29b-41d4-a716-446655440011",
  "startTime": "2025-10-07T10:00:00Z",
  "endTime": "2025-10-07T11:00:00Z"
}, null, 2));

console.log('\n=====================================');
console.log('TEST 2: CREATE REGULAR BOOKING');
console.log('=====================================');
console.log('API: POST /api/v1/bookings');
console.log('\nREQUEST BODY (COPY THIS):');
console.log(JSON.stringify({
  "serviceId": "19f77203-2904-4e96-bcad-78d5ca984c7c",
  "providerId": "550e8400-e29b-41d4-a716-446655440011",
  "startTime": "2025-10-07T14:00:00Z",
  "endTime": "2025-10-07T15:00:00Z",
  "totalPrice": 50.00,
  "platformFee": 5.00,
  "notes": "Please call before arrival",
  "status": "pending"
}, null, 2));

console.log('\n=====================================');
console.log('TEST 3: CREATE RECURRING BOOKING');
console.log('=====================================');
console.log('API: POST /api/v1/recurring-bookings');
console.log('\nREQUEST BODY (COPY THIS):');
console.log(JSON.stringify({
  "providerId": "550e8400-e29b-41d4-a716-446655440011",
  "serviceId": "19f77203-2904-4e96-bcad-78d5ca984c7c",
  "startTime": "10:00",
  "endTime": "11:00",
  "startDate": "2025-10-07",
  "endDate": "2025-12-31",
  "frequency": "weekly",
  "daysOfWeek": ["monday", "wednesday", "friday"],
  "totalPrice": 50.00,
  "notes": "Weekly recurring appointment"
}, null, 2));

console.log('\n=====================================');
console.log('TEST 4: GET MY BOOKINGS');
console.log('=====================================');
console.log('API: GET /api/v1/bookings/my-bookings');
console.log('REQUEST BODY: None (just click Execute)');

console.log('\n=====================================');
console.log('TEST 5: GET RECURRING BOOKINGS');
console.log('=====================================');
console.log('API: GET /api/v1/recurring-bookings');
console.log('REQUEST BODY: None (just click Execute)');

console.log('\n🔧 SWAGGER UI STEPS:');
console.log('1. Open: http://localhost:8000/api/docs');
console.log('2. Click "Authorize" button (top right)');
console.log('3. Paste JWT token and click "Authorize"');
console.log('4. Find the API section (Bookings/Recurring Bookings)');
console.log('5. Click on the API endpoint');
console.log('6. Click "Try it out"');
console.log('7. Paste request body in the text box');
console.log('8. Click "Execute"');
console.log('9. Check response below');

console.log('\n⚠️  IMPORTANT:');
console.log('- DO NOT leave request body empty for POST requests');
console.log('- Copy the ENTIRE JSON including { } brackets');
console.log('- Make sure JWT token is added in Authorization');
console.log('- Server should be running on port 8000');