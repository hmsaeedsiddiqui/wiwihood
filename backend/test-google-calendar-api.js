// Google Calendar API Test Script
// This script tests the Google Calendar integration functionality

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port as needed

// Test configuration
const testConfig = {
  // You'll need to get these from a logged-in user
  authToken: 'YOUR_JWT_TOKEN_HERE', // Replace with actual JWT token
  userId: 1, // Replace with actual user ID
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${testConfig.authToken}`,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  console.log(`\n📡 ${options.method || 'GET'} ${endpoint}`);
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return data;
}

// Test functions
async function testGoogleCalendarStatus() {
  console.log('\n🔍 Testing Google Calendar Status...');
  return await apiCall('/calendar/google/status');
}

async function testGoogleAuthUrl() {
  console.log('\n🔗 Testing Google Auth URL Generation...');
  return await apiCall('/calendar/google/auth-url');
}

async function testCalendarEvents() {
  console.log('\n📅 Testing Calendar Events...');
  return await apiCall('/calendar');
}

async function testICSExport() {
  console.log('\n📄 Testing ICS Export...');
  return await apiCall('/calendar/bookings/ics');
}

async function testCreateLocalEvent() {
  console.log('\n➕ Testing Local Calendar Event Creation...');
  
  const eventData = {
    title: 'Test Event from Google Calendar Integration',
    description: 'This is a test event created via the new Google Calendar API',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
    location: 'Test Location',
    isAllDay: false,
  };

  return await apiCall('/calendar', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

// Configuration check
function checkGoogleCalendarConfig() {
  console.log('\n⚙️ Google Calendar Configuration Check:');
  console.log('----------------------------------------');
  
  // These would be loaded from your .env file on the server
  const requiredEnvVars = [
    'GOOGLE_CALENDAR_ENABLED',
    'GOOGLE_CALENDAR_CLIENT_ID',
    'GOOGLE_CALENDAR_CLIENT_SECRET',
    'GOOGLE_CALENDAR_REDIRECT_URI',
  ];

  console.log('\nRequired Environment Variables:');
  requiredEnvVars.forEach(varName => {
    console.log(`- ${varName}: ${varName.includes('SECRET') ? '[HIDDEN]' : 'Check your .env file'}`);
  });

  console.log('\n📋 Setup Checklist:');
  console.log('□ Google Cloud Console project created');
  console.log('□ Google Calendar API enabled');
  console.log('□ OAuth 2.0 credentials created');
  console.log('□ Redirect URI configured');
  console.log('□ Environment variables set');
  console.log('□ Database migration run');
  console.log('□ Server restarted after config changes');
}

// Google Calendar OAuth Flow Instructions
function showOAuthInstructions() {
  console.log('\n🔐 Google Calendar OAuth Setup Instructions:');
  console.log('=============================================');
  console.log('\n1. Go to Google Cloud Console (https://console.cloud.google.com/)');
  console.log('2. Create a new project or select existing project');
  console.log('3. Enable Google Calendar API:');
  console.log('   - Go to "APIs & Services" > "Library"');
  console.log('   - Search for "Google Calendar API"');
  console.log('   - Click "Enable"');
  console.log('\n4. Create OAuth 2.0 Credentials:');
  console.log('   - Go to "APIs & Services" > "Credentials"');
  console.log('   - Click "Create Credentials" > "OAuth 2.0 Client ID"');
  console.log('   - Choose "Web application"');
  console.log('   - Add authorized redirect URI: http://localhost:3001/api/calendar/google/callback');
  console.log('   - Save Client ID and Client Secret');
  console.log('\n5. Update .env file with your credentials:');
  console.log('   GOOGLE_CALENDAR_ENABLED=true');
  console.log('   GOOGLE_CALENDAR_CLIENT_ID=your_client_id_here');
  console.log('   GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret_here');
  console.log('   GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3001/api/calendar/google/callback');
  console.log('\n6. Run database migration:');
  console.log('   npm run migration:run');
  console.log('\n7. Restart your server');
}

// User authorization flow instructions
function showUserAuthFlow() {
  console.log('\n👤 User Authorization Flow:');
  console.log('===========================');
  console.log('\n1. User calls /calendar/google/auth-url');
  console.log('2. Frontend redirects user to the returned authUrl');
  console.log('3. User grants calendar permissions on Google');
  console.log('4. Google redirects to /calendar/google/callback with code');
  console.log('5. Server exchanges code for tokens and stores them');
  console.log('6. User can now sync events to Google Calendar');
}

// API endpoints documentation
function showAPIEndpoints() {
  console.log('\n🚀 Available API Endpoints:');
  console.log('===========================');
  console.log('\nGoogle Calendar Integration:');
  console.log('GET  /calendar/google/status      - Check connection status');
  console.log('GET  /calendar/google/auth-url    - Get OAuth authorization URL');
  console.log('GET  /calendar/google/callback    - Handle OAuth callback');
  console.log('GET  /calendar/google/calendars   - Get user\'s Google calendars');
  console.log('\nLocal Calendar Events:');
  console.log('GET  /calendar                    - Get all calendar events');
  console.log('POST /calendar                    - Create calendar event');
  console.log('GET  /calendar/:id                - Get specific event');
  console.log('\nExport Features:');
  console.log('GET  /calendar/bookings/ics       - Export user bookings as ICS');
  console.log('GET  /calendar/provider/bookings/ics - Export provider bookings as ICS');
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Google Calendar API Integration Test Suite');
  console.log('==============================================');

  // Show setup information first
  checkGoogleCalendarConfig();
  showOAuthInstructions();
  showUserAuthFlow();
  showAPIEndpoints();

  if (!testConfig.authToken || testConfig.authToken === 'YOUR_JWT_TOKEN_HERE') {
    console.log('\n⚠️  To run API tests, please:');
    console.log('1. Login to get a valid JWT token');
    console.log('2. Update testConfig.authToken in this script');
    console.log('3. Run the script again');
    return;
  }

  console.log('\n🚀 Running API Tests...');
  console.log('========================');

  try {
    // Test Google Calendar configuration
    await testGoogleCalendarStatus();
    
    // Test auth URL generation
    await testGoogleAuthUrl();
    
    // Test local calendar functionality
    await testCalendarEvents();
    await testCreateLocalEvent();
    await testICSExport();

    console.log('\n✅ All tests completed!');
    console.log('\n📝 Next Steps:');
    console.log('1. Set up Google Calendar OAuth if not configured');
    console.log('2. Test user authorization flow in browser');
    console.log('3. Test Google Calendar event creation after user authorization');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testGoogleCalendarStatus,
    testGoogleAuthUrl,
    testCalendarEvents,
    testICSExport,
    testCreateLocalEvent,
    showOAuthInstructions,
    showAPIEndpoints,
  };
}

// Run tests if script is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runAllTests();
}