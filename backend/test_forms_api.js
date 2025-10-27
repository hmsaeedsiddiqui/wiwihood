/**
 * Forms API Testing Script
 * Use this script to test the Forms API endpoints
 * 
 * Requirements:
 * 1. Backend server running on http://localhost:3000
 * 2. Valid JWT token for authentication
 * 
 * Usage:
 * 1. Start backend server: npm run start:dev
 * 2. Get auth token from login endpoint
 * 3. Run: node test_forms_api.js
 */

const BASE_URL = 'http://localhost:3000/api';
const FORMS_URL = `${BASE_URL}/forms`;

// Replace with your actual JWT token after login
const AUTH_TOKEN = 'your-jwt-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`
};

// Test data for form template
const sampleFormTemplate = {
  title: "Hair Consultation Form",
  description: "Pre-appointment consultation for hair services",
  type: "CONSULTATION",
  fields: [
    {
      name: "hair_type",
      label: "Hair Type",
      type: "select",
      required: true,
      options: ["Straight", "Wavy", "Curly", "Coily"],
      orderIndex: 0
    },
    {
      name: "previous_treatments",
      label: "Previous Hair Treatments",
      type: "textarea",
      required: false,
      placeholder: "Please describe any previous treatments...",
      validation: {
        maxLength: 500
      },
      orderIndex: 1
    },
    {
      name: "allergies",
      label: "Known Allergies",
      type: "textarea",
      required: true,
      placeholder: "List any known allergies...",
      orderIndex: 2
    },
    {
      name: "customer_email",
      label: "Email Address",
      type: "email",
      required: true,
      validation: {
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
      },
      orderIndex: 3
    }
  ],
  isActive: true
};

// Test data for form submission
const sampleFormSubmission = {
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "+971501234567",
  responses: [
    {
      fieldName: "hair_type",
      value: "Curly"
    },
    {
      fieldName: "previous_treatments",
      value: "Hair coloring 6 months ago, no chemical treatments recently"
    },
    {
      fieldName: "allergies",
      value: "No known allergies"
    },
    {
      fieldName: "customer_email",
      value: "john.doe@example.com"
    }
  ],
  notes: "Customer prefers morning appointments"
};

async function makeRequest(url, method = 'GET', body = null, useAuth = true) {
  const config = {
    method,
    headers: useAuth ? headers : { 'Content-Type': 'application/json' }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`\n--- ${method} ${url} ---`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error.message);
    return { error: error.message };
  }
}

async function testFormsAPI() {
  console.log('🚀 Starting Forms API Tests...\n');
  
  // Check if token is set
  if (AUTH_TOKEN === 'your-jwt-token-here') {
    console.log('❌ Please set your AUTH_TOKEN first!');
    console.log('1. Login to get JWT token');
    console.log('2. Replace AUTH_TOKEN in this script');
    return;
  }

  let templateId = null;
  let submissionId = null;

  try {
    // Test 1: Create Form Template
    console.log('\n📝 Test 1: Creating Form Template...');
    const createResult = await makeRequest(`${FORMS_URL}/templates`, 'POST', sampleFormTemplate);
    
    if (createResult.status === 201) {
      templateId = createResult.data.id;
      console.log('✅ Form template created successfully!');
      console.log(`Template ID: ${templateId}`);
    } else {
      console.log('❌ Failed to create form template');
      return;
    }

    // Test 2: Get Form Templates
    console.log('\n📋 Test 2: Getting Form Templates...');
    await makeRequest(`${FORMS_URL}/templates`);

    // Test 3: Get Specific Template
    console.log('\n🔍 Test 3: Getting Specific Template...');
    await makeRequest(`${FORMS_URL}/templates/${templateId}`);

    // Test 4: Get Public Template (no auth)
    console.log('\n🌐 Test 4: Getting Public Template...');
    await makeRequest(`${FORMS_URL}/public/${templateId}`, 'GET', null, false);

    // Test 5: Submit Form (public endpoint)
    console.log('\n📤 Test 5: Submitting Form...');
    const submitResult = await makeRequest(
      `${FORMS_URL}/templates/${templateId}/submit`, 
      'POST', 
      sampleFormSubmission, 
      false
    );

    if (submitResult.status === 201) {
      submissionId = submitResult.data.id;
      console.log('✅ Form submitted successfully!');
      console.log(`Submission ID: ${submissionId}`);
    }

    // Test 6: Get Form Submissions
    console.log('\n📥 Test 6: Getting Form Submissions...');
    await makeRequest(`${FORMS_URL}/submissions`);

    // Test 7: Get Specific Submission
    if (submissionId) {
      console.log('\n🔍 Test 7: Getting Specific Submission...');
      await makeRequest(`${FORMS_URL}/submissions/${submissionId}`);
    }

    // Test 8: Update Submission Status
    if (submissionId) {
      console.log('\n✏️ Test 8: Updating Submission Status...');
      await makeRequest(
        `${FORMS_URL}/submissions/${submissionId}`, 
        'PUT', 
        { status: 'COMPLETED', notes: 'Reviewed and approved' }
      );
    }

    // Test 9: Get Form Statistics
    console.log('\n📊 Test 9: Getting Form Statistics...');
    await makeRequest(`${FORMS_URL}/statistics`);

    // Test 10: Update Form Template
    console.log('\n✏️ Test 10: Updating Form Template...');
    const updateData = {
      title: "Updated Hair Consultation Form",
      description: "Updated description for hair consultation",
      isActive: true
    };
    await makeRequest(`${FORMS_URL}/templates/${templateId}`, 'PUT', updateData);

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`- Template ID: ${templateId}`);
    console.log(`- Submission ID: ${submissionId}`);
    console.log('\n💡 You can now test these endpoints in your frontend or Postman!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Function to get auth token (you need to implement login first)
async function getAuthToken() {
  console.log('\n🔐 Getting Auth Token...');
  
  const loginData = {
    email: 'provider@example.com', // Replace with actual provider email
    password: 'password123'        // Replace with actual password
  };

  const result = await makeRequest(`${BASE_URL}/auth/login`, 'POST', loginData, false);
  
  if (result.status === 200 && result.data.access_token) {
    console.log('✅ Login successful!');
    console.log('🔑 Access Token:', result.data.access_token);
    console.log('\n📝 Copy this token and paste it in AUTH_TOKEN variable above');
    return result.data.access_token;
  } else {
    console.log('❌ Login failed');
    return null;
  }
}

// Instructions
function showInstructions() {
  console.log(`
🔧 FORMS API TESTING INSTRUCTIONS

1. Start Backend Server:
   cd backend
   npm run start:dev

2. Get Authentication Token:
   - Uncomment the line below to get auth token
   - Or use Postman to login and get JWT token
   
3. Update AUTH_TOKEN:
   - Replace 'your-jwt-token-here' with actual JWT token
   
4. Run Tests:
   node test_forms_api.js

📋 Available Endpoints:
┌─────────────────────────────────────────────────────────────┐
│ FORM TEMPLATES                                              │
├─────────────────────────────────────────────────────────────┤
│ POST   /api/forms/templates          Create template        │
│ GET    /api/forms/templates          Get templates          │
│ GET    /api/forms/templates/:id      Get specific template  │
│ PUT    /api/forms/templates/:id      Update template        │
│ DELETE /api/forms/templates/:id      Delete template        │
│ GET    /api/forms/public/:id         Get public template    │
├─────────────────────────────────────────────────────────────┤
│ FORM SUBMISSIONS                                            │
├─────────────────────────────────────────────────────────────┤
│ POST   /api/forms/templates/:id/submit  Submit form         │
│ GET    /api/forms/submissions          Get submissions      │
│ GET    /api/forms/submissions/:id      Get specific submiss │
│ PUT    /api/forms/submissions/:id      Update submission    │
│ DELETE /api/forms/submissions/:id      Delete submission    │
├─────────────────────────────────────────────────────────────┤
│ STATISTICS                                                  │
├─────────────────────────────────────────────────────────────┤
│ GET    /api/forms/statistics           Get form stats       │
└─────────────────────────────────────────────────────────────┘

🌐 CURL Examples:

# Get auth token
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"provider@example.com","password":"password123"}'

# Create form template
curl -X POST http://localhost:3000/api/forms/templates \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '${JSON.stringify(sampleFormTemplate)}'

# Submit form (public)
curl -X POST http://localhost:3000/api/forms/templates/TEMPLATE_ID/submit \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleFormSubmission)}'
`);
}

// Main execution
if (require.main === module) {
  // Uncomment to get auth token first
  // getAuthToken();
  
  // Uncomment to run tests
  // testFormsAPI();
  
  // Show instructions
  showInstructions();
}

module.exports = {
  testFormsAPI,
  getAuthToken,
  sampleFormTemplate,
  sampleFormSubmission
};