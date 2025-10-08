#!/usr/bin/env node

/**
 * Test script for Notifications and Messaging API
 * This script tests the API endpoints and creates sample data
 */

const API_BASE = 'http://localhost:8000/api/v1';

async function testAPI() {
  console.log('🧪 Testing Notification & Messaging API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing API health...');
    const healthResponse = await fetch(`${API_BASE}/notifications`, {
      headers: {
        'Authorization': 'Bearer test-token', // Replace with real token
        'Content-Type': 'application/json'
      }
    });
    console.log(`Status: ${healthResponse.status}`);

    // Test 2: Create sample notifications
    console.log('\n2️⃣ Creating sample notifications...');
    const sampleNotifications = [
      {
        title: 'New Booking Request',
        message: 'Sarah Johnson has requested a booking for Hair Cut on Dec 15, 2024 at 2:00 PM',
        type: 'booking',
        data: { actionUrl: '/provider/bookings' }
      },
      {
        title: 'Payment Received',
        message: 'Payment of $75.00 received from Michael Davis for Beard Trim service',
        type: 'payment'
      },
      {
        title: 'New Review',
        message: 'Emma Wilson left a 5-star review for your Facial Treatment service',
        type: 'review'
      }
    ];

    for (const notification of sampleNotifications) {
      try {
        const response = await fetch(`${API_BASE}/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });
        console.log(`✅ Created: ${notification.title} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ Failed to create: ${notification.title} - Error: ${error.message}`);
      }
    }

    // Test 3: Create sample messages
    console.log('\n3️⃣ Creating sample messages...');
    const sampleMessages = [
      {
        receiverId: 'customer-id-1',
        message: 'Hi! I would like to book an appointment for a hair cut. Are you available this weekend?',
        type: 'text'
      },
      {
        receiverId: 'provider-id-1',
        message: 'Hello! Yes, I have availability on Saturday at 2 PM and Sunday at 10 AM. Which works better for you?',
        type: 'text'
      }
    ];

    for (const message of sampleMessages) {
      try {
        const response = await fetch(`${API_BASE}/notifications/messages`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });
        console.log(`✅ Sent message - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ Failed to send message - Error: ${error.message}`);
      }
    }

    // Test 4: Create sample reminders
    console.log('\n4️⃣ Creating sample reminders...');
    const sampleReminders = [
      {
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow at 11:00 AM',
        type: 'booking',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        deliveryMethod: 'notification'
      }
    ];

    for (const reminder of sampleReminders) {
      try {
        const response = await fetch(`${API_BASE}/notifications/reminders`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reminder)
        });
        console.log(`✅ Created reminder - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ Failed to create reminder - Error: ${error.message}`);
      }
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the test
testAPI();