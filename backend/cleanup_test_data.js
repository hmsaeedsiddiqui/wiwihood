console.log('🧹 Cleaning Test Data - Removing Test Services');
console.log('='.repeat(60));

const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function cleanTestData() {
  try {
    console.log('🔍 Step 1: Identifying test services to remove...');
    
    // Get current test services (these appear to be test data)
    const testServices = await pool.query(`
      SELECT id, name, "providerBusinessName", "createdAt"
      FROM services 
      WHERE name IN (
        'Personal Fitness Training',
        'Deep Cleaning Service', 
        'Relaxing Massage Therapy',
        'Professional Hair Styling'
      )
      OR "providerBusinessName" IS NULL
      OR "providerBusinessName" = 'Unknown'
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Found ${testServices.rows.length} test services to remove:`);
    testServices.rows.forEach((service, i) => {
      console.log(`${i+1}. "${service.name}" - ${service.providerBusinessName || 'Unknown Provider'}`);
    });
    
    if (testServices.rows.length === 0) {
      console.log('✅ No test services found to remove.');
      return;
    }
    
    console.log('\n🗑️ Step 2: Removing test services...');
    
    // Delete test services
    const deleteResult = await pool.query(`
      DELETE FROM services 
      WHERE name IN (
        'Personal Fitness Training',
        'Deep Cleaning Service', 
        'Relaxing Massage Therapy',
        'Professional Hair Styling'
      )
      OR "providerBusinessName" IS NULL
      OR "providerBusinessName" = 'Unknown'
    `);
    
    console.log(`✅ Removed ${deleteResult.rowCount} test services from database`);
    
    console.log('\n🔍 Step 3: Checking remaining services...');
    
    // Check what's left
    const remainingServices = await pool.query(`
      SELECT id, name, "providerBusinessName", "isActive", "isApproved", "approvalStatus"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    if (remainingServices.rows.length === 0) {
      console.log('📭 Database is now clean - no services remain');
      console.log('   Providers can now create real services through their panel');
      console.log('   Admin can approve them, and only then will they appear on frontend');
    } else {
      console.log(`📊 ${remainingServices.rows.length} real services remain:`);
      remainingServices.rows.forEach((service, i) => {
        const status = service.isActive && service.isApproved && service.approvalStatus === 'approved' 
          ? '✅ VISIBLE' : '❌ HIDDEN';
        console.log(`${i+1}. "${service.name}" by ${service.providerBusinessName} - ${status}`);
      });
    }
    
    console.log('\n✅ CLEANUP COMPLETE!');
    console.log('🎯 Next Steps:');
    console.log('   1. Providers create services through their dashboard');
    console.log('   2. Admin reviews and approves services in admin panel');
    console.log('   3. Only approved + active services appear on homepage/frontend');
    console.log('   4. Test your visibility rules implementation!');
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    await pool.end();
    process.exit(1);
  }
}

cleanTestData();