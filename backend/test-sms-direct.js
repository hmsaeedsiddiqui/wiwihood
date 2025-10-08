// Direct SMS Test Script
const twilio = require('twilio');
require('dotenv').config();

console.log('🚀 Starting Direct SMS Test...');

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('📱 Twilio Config:');
console.log('Account SID:', accountSid);
console.log('From Number:', fromNumber);
console.log('SMS Enabled:', process.env.SMS_ENABLED);

// Initialize Twilio client
const client = twilio(accountSid, authToken);

async function sendTestSMS() {
  try {
    console.log('\n📤 Sending SMS...');
    
    // Now using different numbers:
    // FROM: +923062807746 (new Twilio number)
    // TO: +923175547406 (your original number)
    
    const message = await client.messages.create({
      body: '🎉 SUCCESS! SMS API working perfectly! Reservista backend connected to Twilio! ✅ Test completed at ' + new Date().toLocaleString(),
      from: fromNumber, // +923062807746
      to: '+923175547406' // Your original number as recipient
    });

    console.log('✅ SMS SENT SUCCESSFULLY!');
    console.log('� Message SID:', message.sid);
    console.log('📱 To:', message.to);
    console.log('📤 From:', message.from);
    console.log('📊 Status:', message.status);
    console.log('\n� CHECK YOUR PHONE (+923175547406)! SMS should arrive within 1-2 minutes!');
    
    return {
      status: 'success',
      messageId: message.sid
    };
    
  } catch (error) {
    console.error('❌ SMS Failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('More Info:', error.moreInfo);
    
    return {
      status: 'error',
      error: error.message
    };
  }
}

// Run the test
sendTestSMS();