// Search for specific image ID in database
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db'
});

async function findSpecificImage() {
  const client = await pool.connect();
  const targetImage = 'qo8ibjpe4hjhctdlwfme'; // The problematic image from your error
  
  try {
    console.log(`🔍 Searching for image: ${targetImage}\n`);

    // Search in services table - images array
    const servicesImages = await client.query(`
      SELECT id, name, images 
      FROM services 
      WHERE images::text LIKE $1
    `, [`%${targetImage}%`]);

    console.log(`📊 Services with this image in array: ${servicesImages.rowCount}`);
    servicesImages.rows.forEach(row => {
      console.log(`  - Service: ${row.name} (ID: ${row.id})`);
      console.log(`  - Images: ${JSON.stringify(row.images)}`);
    });

    // Search in services table - featured image
    const servicesFeatured = await client.query(`
      SELECT id, name, "featuredImage" 
      FROM services 
      WHERE "featuredImage" LIKE $1
    `, [`%${targetImage}%`]);

    console.log(`\n📊 Services with this as featured image: ${servicesFeatured.rowCount}`);
    servicesFeatured.rows.forEach(row => {
      console.log(`  - Service: ${row.name} (ID: ${row.id})`);
      console.log(`  - Featured Image: ${row.featuredImage}`);
    });

    // Search in providers table
    const providers = await client.query(`
      SELECT id, "businessName", "logoPublicId", "coverImagePublicId" 
      FROM providers 
      WHERE "logoPublicId" LIKE $1 OR "coverImagePublicId" LIKE $1
    `, [`%${targetImage}%`]);

    console.log(`\n📊 Providers with this image: ${providers.rowCount}`);
    providers.rows.forEach(row => {
      console.log(`  - Provider: ${row.businessName} (ID: ${row.id})`);
      console.log(`  - Logo: ${row.logoPublicId}`);
      console.log(`  - Cover: ${row.coverImagePublicId}`);
    });

    // Search all services to see what image paths exist
    const allServicesImages = await client.query(`
      SELECT id, name, images, "featuredImage" 
      FROM services 
      WHERE images IS NOT NULL OR "featuredImage" IS NOT NULL
      LIMIT 5
    `);

    console.log(`\n📊 Sample of all service images in database:`);
    allServicesImages.rows.forEach(row => {
      console.log(`  - Service: ${row.name}`);
      if (row.images) console.log(`    Images: ${JSON.stringify(row.images)}`);
      if (row.featuredImage) console.log(`    Featured: ${row.featuredImage}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

findSpecificImage();