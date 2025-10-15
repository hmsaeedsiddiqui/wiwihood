const { Client } = require('pg');

async function verifySetup() {
  const client = new Client({
    host: 'localhost',
    port: 5432, 
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root',
  });

  try {
    await client.connect();
    console.log('=== VERIFICATION COMPLETE ===');
    
    // Check the specific user
    const userId = '6307cf24-70ea-4b21-a43d-f6bc2e2a3e26';
    console.log(`\n✅ Checking user: ${userId}`);
    
    const user = await client.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1;', 
      [userId]
    );
    console.log('User exists:', user.rows.length > 0 ? '✅' : '❌');
    if (user.rows.length > 0) {
      console.log('User details:', user.rows[0]);
    }
    
    // Check if provider exists for this user
    const provider = await client.query(
      'SELECT id, "businessName", status, "isVerified", "userId" FROM providers WHERE "userId" = $1;', 
      [userId]
    );
    console.log('Provider exists:', provider.rows.length > 0 ? '✅' : '❌');
    if (provider.rows.length > 0) {
      console.log('Provider details:', provider.rows[0]);
      
      // Test API endpoints that should work now
      console.log('\n=== API ENDPOINTS THAT SHOULD NOW WORK ===');
      console.log(`✅ GET /api/v1/providers/me (with user ${userId} token)`);
      console.log(`✅ GET /api/v1/services/provider/${provider.rows[0].id}`);
      console.log(`✅ POST /api/v1/services/provider/${provider.rows[0].id}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

verifySetup();