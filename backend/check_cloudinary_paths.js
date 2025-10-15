// Quick database check and fix for Cloudinary paths
const { Pool } = require('pg');

// Update these with your actual database credentials
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root', // From .env file  
  database: 'wiwihood_db' // From .env file
});

async function checkAndFixCloudinaryPaths() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking for images with old paths...\n');

    // Check services table for images with 'reservista/' prefix
    const servicesCheck = await client.query(`
      SELECT id, name, images, "featuredImage" 
      FROM services 
      WHERE 
        (images IS NOT NULL AND images::text LIKE '%reservista/%') 
        OR ("featuredImage" IS NOT NULL AND "featuredImage" LIKE 'reservista/%')
      LIMIT 10
    `);

    console.log(`📊 Found ${servicesCheck.rowCount} services with old image paths:`);
    servicesCheck.rows.forEach(row => {
      console.log(`  - Service: ${row.name}`);
      if (row.images) {
        row.images.forEach(img => {
          if (img.includes('reservista/')) {
            console.log(`    ❌ Old image path: ${img}`);
            console.log(`    ✅ Should be: ${img.replace(/^reservista\//, '')}`);
          }
        });
      }
      if (row.featuredImage && row.featuredImage.includes('reservista/')) {
        console.log(`    ❌ Old featured image: ${row.featuredImage}`);
        console.log(`    ✅ Should be: ${row.featuredImage.replace(/^reservista\//, '')}`);
      }
    });

    console.log('\n🔧 Do you want to fix these paths? This will update the database.');
    console.log('💡 Run this script with FIX=true to apply changes:');
    console.log('   node check_cloudinary_paths.js FIX=true\n');

    // Only fix if FIX=true is passed as argument
    if (process.argv.includes('FIX=true')) {
      console.log('🚀 Applying fixes...\n');

      // Fix service images array
      const fixImagesResult = await client.query(`
        UPDATE services 
        SET images = (
          SELECT array_agg(regexp_replace(img, '^reservista/', '', 'g'))
          FROM unnest(images) AS img
        )
        WHERE images IS NOT NULL 
        AND images::text LIKE '%reservista/%'
      `);
      console.log(`✅ Fixed ${fixImagesResult.rowCount} services with image arrays`);

      // Fix featured images
      const fixFeaturedResult = await client.query(`
        UPDATE services 
        SET "featuredImage" = regexp_replace("featuredImage", '^reservista/', '', 'g')
        WHERE "featuredImage" IS NOT NULL 
        AND "featuredImage" LIKE 'reservista/%'
      `);
      console.log(`✅ Fixed ${fixFeaturedResult.rowCount} services with featured images`);

      // Fix provider images
      const fixProvidersResult = await client.query(`
        UPDATE providers 
        SET 
          "logoPublicId" = CASE 
            WHEN "logoPublicId" LIKE 'reservista/%' 
            THEN regexp_replace("logoPublicId", '^reservista/', '', 'g')
            ELSE "logoPublicId" 
          END,
          "coverImagePublicId" = CASE 
            WHEN "coverImagePublicId" LIKE 'reservista/%' 
            THEN regexp_replace("coverImagePublicId", '^reservista/', '', 'g')
            ELSE "coverImagePublicId" 
          END
        WHERE "logoPublicId" LIKE 'reservista/%' 
        OR "coverImagePublicId" LIKE 'reservista/%'
      `);
      console.log(`✅ Fixed ${fixProvidersResult.rowCount} provider images`);

      console.log('\n🎉 All fixes applied! Your Cloudinary URLs should now work correctly.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAndFixCloudinaryPaths();