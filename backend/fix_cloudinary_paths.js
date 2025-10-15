const { Client } = require('pg');

// Database connection
const dbConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'yourpassword',
  database: 'wiwihood_db'
};

async function fixCloudinaryPaths() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Fix service images
    console.log('🔧 Fixing service images...');
    const serviceResult = await client.query(`
      UPDATE services 
      SET images = array(
        SELECT regexp_replace(unnest(images), '^reservista/', '', 'g')
        WHERE images IS NOT NULL
      )
      WHERE images IS NOT NULL AND array_to_string(images, ',') LIKE '%reservista/%'
    `);
    console.log(`✅ Updated ${serviceResult.rowCount} services with image path fixes`);

    // Fix featured images
    console.log('🔧 Fixing featured images...');
    const featuredResult = await client.query(`
      UPDATE services 
      SET "featuredImage" = regexp_replace("featuredImage", '^reservista/', '', 'g')
      WHERE "featuredImage" IS NOT NULL AND "featuredImage" LIKE 'reservista/%'
    `);
    console.log(`✅ Updated ${featuredResult.rowCount} services with featured image fixes`);

    // Fix provider logos
    console.log('🔧 Fixing provider logos...');
    const logoResult = await client.query(`
      UPDATE providers 
      SET "logoPublicId" = regexp_replace("logoPublicId", '^reservista/', '', 'g')
      WHERE "logoPublicId" IS NOT NULL AND "logoPublicId" LIKE 'reservista/%'
    `);
    console.log(`✅ Updated ${logoResult.rowCount} providers with logo fixes`);

    // Fix provider cover images
    console.log('🔧 Fixing provider cover images...');
    const coverResult = await client.query(`
      UPDATE providers 
      SET "coverImagePublicId" = regexp_replace("coverImagePublicId", '^reservista/', '', 'g')
      WHERE "coverImagePublicId" IS NOT NULL AND "coverImagePublicId" LIKE 'reservista/%'
    `);
    console.log(`✅ Updated ${coverResult.rowCount} providers with cover image fixes`);

    console.log('🎉 All Cloudinary paths have been fixed!');

  } catch (error) {
    console.error('❌ Error fixing Cloudinary paths:', error);
  } finally {
    await client.end();
    console.log('🔒 Database connection closed');
  }
}

// Run the fix
fixCloudinaryPaths();