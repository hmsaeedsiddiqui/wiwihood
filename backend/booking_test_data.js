// Regular Booking API Test Data
console.log('=== REGULAR BOOKING API TEST DATA ===\n');

// Sample UUIDs that exist in your database
const testData = {
  providerId: "550e8400-e29b-41d4-a716-446655440011",
  serviceId: "19f77203-2904-4e96-bcad-78d5ca984c7c",
  userId: "123e4567-e89b-12d3-a456-426614174000"
};

// Generate booking times
const now = new Date();
const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

console.log('=== BOOKING REQUEST BODY ===\n');

const bookingRequestBody = {
  serviceId: testData.serviceId,
  providerId: testData.providerId,
  startTime: startTime.toISOString(),
  endTime: endTime.toISOString(),
  totalPrice: 50.00,
  platformFee: 5.00,
  notes: "Please call before arrival",
  status: "pending"
};

console.log(JSON.stringify(bookingRequestBody, null, 2));

console.log('\n=== API ENDPOINT INFORMATION ===');
console.log('URL: POST http://localhost:8000/api/v1/bookings');
console.log('\n=== REQUIRED HEADERS ===');
console.log('Content-Type: application/json');
console.log('Authorization: Bearer YOUR_JWT_TOKEN');

console.log('\n=== SWAGGER UI ACCESS ===');
console.log('1. Go to: http://localhost:8000/api/docs');
console.log('2. Find "Bookings" section');
console.log('3. Click on "POST /api/v1/bookings"');
console.log('4. Click "Try it out"');
console.log('5. Add your JWT token in Authorization (click "Authorize" button)');
console.log('6. Paste the above JSON in the request body');
console.log('7. Click "Execute"');

console.log('\n=== ALTERNATIVE TEST DATA ===');
const alternativeData = {
  serviceId: "b47ac10b-58cc-4372-a567-0e02b2c3d479",
  providerId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
  endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hours
  totalPrice: 75.00,
  platformFee: 7.50,
  notes: "Second booking test",
  status: "pending"
};

console.log(JSON.stringify(alternativeData, null, 2));

console.log('\n=== NOTES ===');
console.log('- Make sure your server is running on port 8000');
console.log('- You need a valid JWT token for authentication');
console.log('- The providerId and serviceId must exist in your database');
console.log('- startTime should be in the future');
console.log('- endTime should be after startTime');
console.log('- totalPrice should be a positive number');