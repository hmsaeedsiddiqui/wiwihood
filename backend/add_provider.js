const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

async function createProviderForUser() {
  const client = new Client({
    host: 'localhost',
    port: 5432, 
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root',
  });

  try {
    await client.connect();
    console.log('=== CREATING PROVIDER RECORD ===');
    
    const userId = '6307cf24-70ea-4b21-a43d-f6bc2e2a3e26';
    const providerId = uuidv4(); // Generate new provider ID
    
    // Insert provider record
    const insertResult = await client.query(`
      INSERT INTO providers (
        id,
        "businessName",
        "providerType",
        description,
        address,
        city,
        country,
        "postalCode",
        phone,
        status,
        "isVerified",
        "acceptsOnlinePayments",
        "acceptsCashPayments",
        "requiresDeposit",
        "cancellationPolicyHours",
        "commissionRate",
        payout_method,
        "totalReviews",
        "totalBookings",
        "createdAt",
        "updatedAt",
        "userId"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *;
    `, [
      providerId,
      'Renee Ford Services', // businessName
      'individual', // providerType
      'Professional beauty and wellness services', // description
      '123 Service Street', // address
      'Test City', // city
      'USA', // country
      '12345', // postalCode
      '+1 (231) 513-4321', // phone (from user data)
      'active', // status
      true, // isVerified
      true, // acceptsOnlinePayments
      false, // acceptsCashPayments
      false, // requiresDeposit
      24, // cancellationPolicyHours
      '10.00', // commissionRate
      'bank_transfer', // payout_method
      0, // totalReviews
      0, // totalBookings
      new Date(), // createdAt
      new Date(), // updatedAt
      userId // userId
    ]);
    
    console.log('✅ Provider created successfully:', insertResult.rows[0]);
    
    // Verify the creation
    console.log('\n=== VERIFICATION ===');
    const verification = await client.query(
      'SELECT * FROM providers WHERE "userId" = $1;', 
      [userId]
    );
    console.log('✅ Provider record verified:', verification.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creating provider:', error);
  } finally {
    await client.end();
  }
}

createProviderForUser();