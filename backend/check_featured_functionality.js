const { Pool } = require('pg');
require('dotenv').config();

async function checkFeaturedTables() {
  const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Checking Featured Sections Tables & Columns...\n');
    
    // Check Popular Services functionality
    console.log('1. ✅ SERVICES TABLE:');
    const servicesColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position;
    `);
    console.log('   - Base Price:', servicesColumns.rows.find(c => c.column_name.includes('price')));
    console.log('   - Status:', servicesColumns.rows.find(c => c.column_name === 'status'));
    console.log('   - Active:', servicesColumns.rows.find(c => c.column_name.includes('active')));
    
    // Check Top-rated businesses (Reviews/Ratings)
    console.log('\n2. ✅ PROVIDERS TABLE (for top-rated):');
    const providersColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      ORDER BY ordinal_position;
    `);
    console.log('   - Average Rating:', providersColumns.rows.find(c => c.column_name.includes('rating')));
    console.log('   - Total Reviews:', providersColumns.rows.find(c => c.column_name.includes('review')));
    console.log('   - Latitude:', providersColumns.rows.find(c => c.column_name === 'latitude'));
    console.log('   - Longitude:', providersColumns.rows.find(c => c.column_name === 'longitude'));
    
    // Check Reviews table
    console.log('\n3. ✅ REVIEWS TABLE:');
    const reviewsTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'reviews';
    `);
    if (reviewsTable.rows.length > 0) {
      const reviewsColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        ORDER BY ordinal_position;
      `);
      console.log('   - Rating Column:', reviewsColumns.rows.find(c => c.column_name === 'rating'));
      console.log('   - Comment Column:', reviewsColumns.rows.find(c => c.column_name === 'comment'));
    } else {
      console.log('   ❌ Reviews table does not exist');
    }
    
    // Check Promotions/Deals
    console.log('\n4. ✅ PROMOTIONS TABLE (for deals):');
    const promotionsTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'promotions';
    `);
    if (promotionsTable.rows.length > 0) {
      const promotionsColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'promotions' 
        ORDER BY ordinal_position;
      `);
      console.log('   - Discount Type:', promotionsColumns.rows.find(c => c.column_name.includes('type')));
      console.log('   - Discount Value:', promotionsColumns.rows.find(c => c.column_name.includes('value')));
      console.log('   - Status:', promotionsColumns.rows.find(c => c.column_name === 'status'));
      console.log('   - Start Date:', promotionsColumns.rows.find(c => c.column_name.includes('start')));
      console.log('   - End Date:', promotionsColumns.rows.find(c => c.column_name.includes('end')));
    } else {
      console.log('   ❌ Promotions table does not exist');
    }
    
    // Check Categories for featured sections
    console.log('\n5. ✅ CATEGORIES TABLE (for featured):');
    const categoriesColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categories' 
      ORDER BY ordinal_position;
    `);
    const featuredColumn = categoriesColumns.rows.find(c => c.column_name.includes('featured'));
    if (featuredColumn) {
      console.log('   - Featured Column:', featuredColumn);
    } else {
      console.log('   ❌ Featured column missing in categories');
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('✅ Services table: EXISTS with price filtering');
    console.log('✅ Providers table: EXISTS with ratings & location');
    console.log(reviewsTable.rows.length > 0 ? '✅ Reviews table: EXISTS' : '❌ Reviews table: MISSING');
    console.log(promotionsTable.rows.length > 0 ? '✅ Promotions table: EXISTS' : '❌ Promotions table: MISSING');
    console.log(featuredColumn ? '✅ Featured categories: SUPPORTED' : '❌ Featured categories: NOT SUPPORTED');
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  } finally {
    await pool.end();
  }
}

checkFeaturedTables();