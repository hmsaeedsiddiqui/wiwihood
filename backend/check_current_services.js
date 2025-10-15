const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reservista',
  password: 'postgres',
  port: 5432,
});

async function checkCurrentServices() {
  try {
    console.log('🔍 Checking current services with images...\n');
    
    // Check services with images containing problematic paths
    const problematicImages = await pool.query(`
      SELECT 
        id, 
        service_name, 
        images,
        created_at
      FROM services 
      WHERE images IS NOT NULL 
        AND images != '[]' 
        AND (
          images::text LIKE '%reservista/reservista%' 
          OR images::text LIKE '%qo8ibjpe4hjhctdlwfme%'
          OR images::text LIKE '%upcamtqw5ccjhklfxwpr%'
        )
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log(`📊 Found ${problematicImages.rows.length} services with problematic image paths:`);
    problematicImages.rows.forEach(service => {
      console.log(`\n  Service: ${service.service_name} (ID: ${service.id})`);
      console.log(`  Images: ${service.images}`);
      console.log(`  Created: ${service.created_at}`);
    });
    
    // Check recent services
    console.log('\n📅 Recent services (last 5):');
    const recentServices = await pool.query(`
      SELECT 
        id, 
        service_name, 
        images,
        created_at
      FROM services 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    recentServices.rows.forEach(service => {
      console.log(`\n  Service: ${service.service_name} (ID: ${service.id})`);
      console.log(`  Images: ${service.images || 'No images'}`);
      console.log(`  Created: ${service.created_at}`);
    });
    
    // Check if any services have the problematic image IDs
    console.log('\n🔍 Searching for specific problematic image IDs...');
    const specificImages = await pool.query(`
      SELECT 
        id, 
        service_name, 
        images
      FROM services 
      WHERE images::text LIKE '%qo8ibjpe4hjhctdlwfme%' 
         OR images::text LIKE '%upcamtqw5ccjhklfxwpr%'
    `);
    
    if (specificImages.rows.length === 0) {
      console.log('✅ No services found with problematic image IDs in database');
      console.log('❓ This suggests the issue is in frontend cache/state');
    } else {
      console.log(`❌ Found ${specificImages.rows.length} services with problematic image IDs`);
      specificImages.rows.forEach(service => {
        console.log(`  Service: ${service.service_name}`);
        console.log(`  Images: ${service.images}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking services:', error.message);
  } finally {
    await pool.end();
  }
}

checkCurrentServices();