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

async function checkProviders() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Check if providers table exists and get some sample providers
    const providers = await AppDataSource.query(`
      SELECT id, "businessName", "status", "isVerified", "createdAt" 
      FROM providers 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);

    console.log('\n📋 Existing Providers:');
    console.log('===================');
    
    if (providers.length === 0) {
      console.log('❌ No providers found in database');
    } else {
      providers.forEach((provider, index) => {
        console.log(`${index + 1}. Provider ID: ${provider.id}`);
        console.log(`   Business Name: ${provider.businessName || 'N/A'}`);
        console.log(`   Status: ${provider.status || 'N/A'}`);
        console.log(`   Verified: ${provider.isVerified ? 'Yes' : 'No'}`);
        console.log(`   Created: ${provider.createdAt}`);
        console.log('   ---');
      });
    }

    // Also check users table to see if there are any users with provider role
    const users = await AppDataSource.query(`
      SELECT id, email, "firstName", "lastName", role, "isEmailVerified" 
      FROM users 
      WHERE role = 'provider' 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);

    console.log('\n👥 Provider Users:');
    console.log('================');
    
    if (users.length === 0) {
      console.log('❌ No users with provider role found');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Verified: ${user.isEmailVerified ? 'Yes' : 'No'}`);
        console.log('   ---');
      });
    }

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

checkProviders();