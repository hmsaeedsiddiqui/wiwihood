const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: 'database-1.clu7ue5qlbfn.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'reservista',
  password: 'Reservista12345',
  ssl: {
    rejectUnauthorized: false
  }
};

async function getBookingTestData() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database successfully\n');

    // Get sample provider
    const providersResult = await client.query(`
      SELECT id, first_name, last_name 
      FROM providers 
      WHERE active = true 
      LIMIT 1
    `);

    // Get sample service
    const servicesResult = await client.query(`
      SELECT s.id, s.name, s.price, s.provider_id 
      FROM services s
      JOIN providers p ON s.provider_id = p.id
      WHERE s.active = true AND p.active = true
      LIMIT 1
    `);

    // Get sample user
    const usersResult = await client.query(`
      SELECT id, first_name, last_name 
      FROM users 
      WHERE active = true AND role = 'customer'
      LIMIT 1
    `);

    console.log('=== BOOKING API TEST DATA ===\n');

    if (providersResult.rows.length > 0) {
      const provider = providersResult.rows[0];
      console.log('Provider ID:', provider.id);
      console.log('Provider Name:', `${provider.first_name} ${provider.last_name}\n`);
    }

    if (servicesResult.rows.length > 0) {
      const service = servicesResult.rows[0];
      console.log('Service ID:', service.id);
      console.log('Service Name:', service.name);
      console.log('Service Price:', service.price);
      console.log('Service Provider ID:', service.provider_id, '\n');
    }

    if (usersResult.rows.length > 0) {
      const user = usersResult.rows[0];
      console.log('User ID:', user.id);
      console.log('User Name:', `${user.first_name} ${user.last_name}\n`);
    }

    // Generate sample test data for regular booking
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

    console.log('=== SAMPLE BOOKING REQUEST BODY ===\n');
    
    const bookingData = {
      serviceId: servicesResult.rows[0]?.id || "19f77203-2904-4e96-bcad-78d5ca984c7c",
      providerId: providersResult.rows[0]?.id || "550e8400-e29b-41d4-a716-446655440011", 
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalPrice: servicesResult.rows[0]?.price || 50.00,
      platformFee: 5.00,
      notes: "Please call before arrival",
      status: "pending"
    };

    console.log(JSON.stringify(bookingData, null, 2));

    console.log('\n=== API ENDPOINT ===');
    console.log('POST http://localhost:8000/api/v1/bookings');
    console.log('\n=== HEADERS ===');
    console.log('Content-Type: application/json');
    console.log('Authorization: Bearer YOUR_JWT_TOKEN');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

getBookingTestData();