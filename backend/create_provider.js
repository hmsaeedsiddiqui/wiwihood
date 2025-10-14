const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'wiwihood_db',
  synchronize: false,
  logging: false,
});

async function createProvider() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    const providerId = 'bf5eb227-6a77-499f-845e-4db8954f45a4';
    
    // Check if provider already exists
    const existingProvider = await AppDataSource.query(`
      SELECT id FROM providers WHERE id = $1
    `, [providerId]);

    if (existingProvider.length > 0) {
      console.log('✅ Provider already exists:', providerId);
      return;
    }

    // First, we need a user. Let's check if there's a user we can associate with this provider
    const users = await AppDataSource.query(`
      SELECT id FROM users WHERE role = 'provider' LIMIT 1
    `);

    let userId;
    if (users.length > 0) {
      userId = users[0].id;
      console.log('📝 Using existing user:', userId);
    } else {
      // Create a test user for this provider
      const testUserId = 'bf5eb227-6a77-499f-845e-test-user-123';
      await AppDataSource.query(`
        INSERT INTO users (id, email, "firstName", "lastName", password, role, "isEmailVerified")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING
      `, [
        testUserId,
        'test.provider@wiwihood.com',
        'Test',
        'Provider',
        '$2b$10$hashedPasswordHere', // This would be a properly hashed password
        'provider',
        true
      ]);
      userId = testUserId;
      console.log('📝 Created test user:', userId);
    }

    // Create the provider
    await AppDataSource.query(`
      INSERT INTO providers (
        id, 
        "userId", 
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
        "requiresDeposit"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO NOTHING
    `, [
      providerId,
      userId,
      'Test Beauty Salon',
      'business',
      'A professional beauty salon offering various services',
      '123 Main Street',
      'Test City',
      'USA',
      '12345',
      '+1234567890',
      'active',
      true,
      true,
      false,
      false
    ]);

    console.log('✅ Provider created successfully:', providerId);
    console.log('🎉 You can now use this provider ID in your frontend!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit();
  }
}

createProvider();