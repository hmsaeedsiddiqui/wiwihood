// Test script for Settings API endpoints

const BASE_URL = 'http://localhost:3001/api/v1';

async function testAPI() {
  try {
    // 1. Register a test user
    console.log('🔧 Testing Settings API...\n');
    
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      }),
    });

    let authData;
    if (registerResponse.ok) {
      authData = await registerResponse.json();
      console.log('✅ User registered successfully');
    } else {
      // User might already exist, try to login
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });
      
      if (loginResponse.ok) {
        authData = await loginResponse.json();
        console.log('✅ User logged in successfully');
      } else {
        throw new Error('Failed to register or login user');
      }
    }

    const token = authData.accessToken;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Test Profile Update
    console.log('\n📝 Testing Profile Update...');
    const profileResponse = await fetch(`${BASE_URL}/users/me/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        firstName: 'Updated',
        lastName: 'Name',
        phoneNumber: '+1234567890',
        address: '123 Test Street',
        city: 'Test City',
        country: 'Test Country',
        postalCode: '12345'
      }),
    });

    if (profileResponse.ok) {
      const updatedProfile = await profileResponse.json();
      console.log('✅ Profile updated successfully');
      console.log('📋 Updated profile:', updatedProfile);
    } else {
      console.log('❌ Profile update failed:', await profileResponse.text());
    }

    // 3. Test Notification Preferences
    console.log('\n🔔 Testing Notification Preferences...');
    
    // Get current preferences
    const getNotificationsResponse = await fetch(`${BASE_URL}/users/me/notifications`, {
      method: 'GET',
      headers,
    });

    if (getNotificationsResponse.ok) {
      const currentPrefs = await getNotificationsResponse.json();
      console.log('✅ Retrieved notification preferences');
      console.log('📋 Current preferences:', currentPrefs);

      // Update preferences
      const updateNotificationsResponse = await fetch(`${BASE_URL}/users/me/notifications`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          marketingEmails: false,
          bookingReminders: true,
          promotionalOffers: false
        }),
      });

      if (updateNotificationsResponse.ok) {
        const updatedPrefs = await updateNotificationsResponse.json();
        console.log('✅ Notification preferences updated');
        console.log('📋 Updated preferences:', updatedPrefs);
      } else {
        console.log('❌ Notification update failed:', await updateNotificationsResponse.text());
      }
    } else {
      console.log('❌ Failed to get notification preferences:', await getNotificationsResponse.text());
    }

    // 4. Test Privacy Settings
    console.log('\n🔒 Testing Privacy Settings...');
    const privacyResponse = await fetch(`${BASE_URL}/users/me/privacy`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        profileVisibility: true,
        dataAnalytics: false
      }),
    });

    if (privacyResponse.ok) {
      console.log('✅ Privacy settings updated successfully');
    } else {
      console.log('❌ Privacy settings update failed:', await privacyResponse.text());
    }

    // 5. Test Two-Factor Authentication
    console.log('\n🔐 Testing Two-Factor Authentication...');
    const enable2FAResponse = await fetch(`${BASE_URL}/users/me/two-factor/enable`, {
      method: 'POST',
      headers,
    });

    if (enable2FAResponse.ok) {
      const twoFactorResult = await enable2FAResponse.json();
      console.log('✅ Two-factor authentication enabled');
      console.log('📋 Result:', twoFactorResult);
    } else {
      console.log('❌ Two-factor authentication failed:', await enable2FAResponse.text());
    }

    console.log('\n🎉 Settings API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
