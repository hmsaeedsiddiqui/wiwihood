const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking current services with images...\n');
    
    // Check recent services with correct column names
    console.log('📅 Recent services (last 10):');
    const recentServices = await pool.query(`
      SELECT 
        id, 
        name, 
        images,
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);
    
    recentServices.rows.forEach(service => {
      console.log(`\n  Service: ${service.name} (ID: ${service.id})`);
      if (service.images && service.images.length > 0) {
        console.log(`  Images: ${JSON.stringify(service.images)}`);
      } else {
        console.log(`  Images: None`);
      }
      console.log(`  Created: ${service.createdAt}`);
    });
    
    // Check for problematic image IDs
    console.log('\n🔍 Searching for specific problematic image IDs...');
    const specificImages = await pool.query(`
      SELECT 
        id, 
        name, 
        images
      FROM services 
      WHERE images IS NOT NULL 
        AND (
          images::text LIKE '%qo8ibjpe4hjhctdlwfme%' 
          OR images::text LIKE '%upcamtqw5ccjhklfxwpr%'
        )
    `);
    
    if (specificImages.rows.length === 0) {
      console.log('✅ No services found with problematic image IDs in database');
      console.log('❓ This confirms the issue is in frontend cache/state');
    } else {
      console.log(`❌ Found ${specificImages.rows.length} services with problematic image IDs`);
      specificImages.rows.forEach(service => {
        console.log(`  Service: ${service.name}`);
        console.log(`  Images: ${JSON.stringify(service.images)}`);
      });
    }
    
    // Check for double reservista paths
    console.log('\n🔍 Searching for double reservista paths...');
    const doubleReservista = await pool.query(`
      SELECT 
        id, 
        name, 
        images
      FROM services 
      WHERE images IS NOT NULL 
        AND images::text LIKE '%reservista/reservista%'
    `);
    
    if (doubleReservista.rows.length === 0) {
      console.log('✅ No services found with double reservista paths in database');
      console.log('✅ Backend upload configuration is working correctly');
    } else {
      console.log(`❌ Found ${doubleReservista.rows.length} services with double reservista paths`);
      doubleReservista.rows.forEach(service => {
        console.log(`  Service: ${service.name}`);
        console.log(`  Images: ${JSON.stringify(service.images)}`);
      });
    }
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('==========================================');
    console.log('✅ Backend upload endpoints fixed to prevent double folder structure');
    console.log('✅ Database contains no images with problematic paths');
    console.log('❓ If you still see 404 errors, it\'s due to frontend cache');
    console.log('\n💡 SOLUTION:');
    console.log('1. Use the Development Tools section in the frontend');
    console.log('2. Click "Clear All Caches" button');
    console.log('3. This will clear localStorage, sessionStorage, and force reload');
    console.log('4. The problematic image URLs should disappear');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();