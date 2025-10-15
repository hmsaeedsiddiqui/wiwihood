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
    console.log('🔍 Checking database structure and services...\n');
    
    // Check if services table exists
    const tableCheck = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename LIKE '%service%'
    `);
    
    console.log('📊 Service-related tables:');
    tableCheck.rows.forEach(table => {
      console.log(`  - ${table.tablename}`);
    });
    
    // Check services table structure
    if (tableCheck.rows.some(table => table.tablename === 'services')) {
      console.log('\n🏗️ Services table structure:');
      const columnsCheck = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'services'
        ORDER BY ordinal_position
      `);
      
      columnsCheck.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check recent services with correct column names
      console.log('\n📅 Recent services (last 5):');
      const recentServices = await pool.query(`
        SELECT 
          id, 
          name, 
          images,
          created_at
        FROM services 
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      recentServices.rows.forEach(service => {
        console.log(`\n  Service: ${service.name} (ID: ${service.id})`);
        console.log(`  Images: ${service.images || 'No images'}`);
        console.log(`  Created: ${service.created_at}`);
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
          AND images != '[]' 
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
          console.log(`  Images: ${service.images}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();