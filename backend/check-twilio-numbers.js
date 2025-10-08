// Check Twilio Numbers and Send Test SMS
const twilio = require('twilio');
require('dotenv').config();

console.log('🚀 Checking Twilio Account Numbers...');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('📱 Account SID:', accountSid);

const client = twilio(accountSid, authToken);

async function checkTwilioNumbers() {
  try {
    console.log('\n📋 Fetching your Twilio phone numbers...');
    
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (phoneNumbers.length === 0) {
      console.log('❌ No phone numbers found in your Twilio account!');
      console.log('\n💡 Solutions:');
      console.log('1. Buy a phone number from Twilio Console');
      console.log('2. Or use your original number +923175547406 as FROM');
      console.log('3. And add different number as verified recipient');
      return null;
    }
    
    console.log('✅ Found Twilio phone numbers:');
    phoneNumbers.forEach((number, index) => {
      console.log(`${index + 1}. ${number.phoneNumber} (${number.friendlyName})`);
    });
    
    return phoneNumbers[0].phoneNumber; // Return first valid number
    
  } catch (error) {
    console.error('❌ Error fetching numbers:', error.message);
    return null;
  }
}

async function sendTestSMS() {
  const validFromNumber = await checkTwilioNumbers();
  
  if (!validFromNumber) {
    console.log('\n🔄 Using fallback method...');
    console.log('Using original number as FROM: +923175547406');
    console.log('Need to verify a different number as TO recipient');
    return;
  }
  
  try {
    console.log(`\n📤 Sending SMS from ${validFromNumber} to +923175547406...`);
    
    const message = await client.messages.create({
      body: '🎉 SUCCESS! SMS API Test from Reservista! Your Twilio integration is working perfectly! ✅',
      from: validFromNumber,
      to: '+923175547406'
    });

    console.log('✅ SMS SENT SUCCESSFULLY!');
    console.log('📝 Message SID:', message.sid);
    console.log('📱 To:', message.to);
    console.log('📤 From:', message.from);
    console.log('📊 Status:', message.status);
    console.log('\n🎉 CHECK YOUR PHONE! SMS should arrive within 1-2 minutes!');
    
  } catch (error) {
    console.error('❌ SMS Failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.code === 21614) {
      console.log('\n💡 This is a trial account limitation.');
      console.log('To send to unverified numbers, you need to:');
      console.log('1. Verify +923175547406 in Twilio Console');
      console.log('2. Or upgrade to paid account');
    }
  }
}

sendTestSMS();