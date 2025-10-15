// Search for the new problematic image
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db'
});

async function findNewImage() {
  const client = await pool.connect();
  const targetImage = 'upcamtqw5ccjhklfxwpr'; // New problematic image
  
  try {
    console.log(`🔍 Searching for NEW image: ${targetImage}\n`);

    // Search in services table - images array
    const servicesImages = await client.query(`
      SELECT id, name, images, "featuredImage", "createdAt"
      FROM services 
      WHERE images::text LIKE $1 OR "featuredImage" LIKE $1
      ORDER BY "createdAt" DESC
    `, [`%${targetImage}%`]);

    console.log(`📊 Services with this NEW image: ${servicesImages.rowCount}`);
    servicesImages.rows.forEach(row => {
      console.log(`  - Service: ${row.name} (ID: ${row.id})`);
      console.log(`  - Created: ${row.createdAt}`);
      if (row.images) {
        console.log(`  - Images: ${JSON.stringify(row.images)}`);
      }
      if (row.featuredImage) {
        console.log(`  - Featured Image: ${row.featuredImage}`);
      }
      console.log(`  ---`);
    });

    // Check the most recent service uploads
    const recentServices = await client.query(`
      SELECT id, name, images, "featuredImage", "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
      LIMIT 3
    `);

    console.log(`\n📊 Most recent services in database:`);
    recentServices.rows.forEach(row => {
      console.log(`  - Service: ${row.name} (${row.createdAt})`);
      if (row.images && row.images.length > 0) {
        console.log(`    Images: ${JSON.stringify(row.images)}`);
      }
      if (row.featuredImage) {
        console.log(`    Featured: ${row.featuredImage}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

findNewImage();