const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function cleanupTestData() {
  try {
    console.log('=== CLEANING UP TEST DATA ===');
    
    // First, let's see what we have
    const allServices = await pool.query(`
      SELECT id, name, "isActive", "isApproved", status, "approvalStatus", "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\nTotal services: ${allServices.rows.length}`);
    
    // Identify test services (services that are not your real 4 services)
    const realServices = allServices.rows.filter(s => 
      s.isApproved === true && s.isActive === true && s.status === 'approved'
    );
    
    const testServices = allServices.rows.filter(s => 
      s.name.toLowerCase().includes('test') ||
      s.name.toLowerCase().includes('sample') ||
      s.name.toLowerCase().includes('demo') ||
      (s.isApproved === true && s.isActive === true && s.status === 'active') // has wrong status
    );
    
    console.log(`\nReal services (correct status): ${realServices.length}`);
    console.log('Real services:');
    realServices.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} (${s.status})`);
    });
    
    console.log(`\nTest/Sample services to clean up: ${testServices.length}`);
    testServices.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} (status: ${s.status}, isApproved: ${s.isApproved}, isActive: ${s.isActive})`);
    });
    
    if (testServices.length > 0) {
      console.log('\n⚠️  CLEANING UP TEST DATA...');
      
      // Delete test services
      const testServiceIds = testServices.map(s => s.id);
      const deleteResult = await pool.query(
        'DELETE FROM services WHERE id = ANY($1::uuid[])',
        [testServiceIds]
      );
      
      console.log(`✅ Deleted ${deleteResult.rowCount} test services`);
      
      // Verify the cleanup
      const remainingServices = await pool.query(`
        SELECT id, name, "isActive", "isApproved", status
        FROM services 
        ORDER BY "createdAt" DESC
      `);
      
      console.log(`\n✅ After cleanup: ${remainingServices.rows.length} services remaining`);
      remainingServices.rows.forEach((s, i) => {
        const isVisible = s.isApproved === true && s.isActive === true && s.status === 'approved';
        console.log(`${i + 1}. ${s.name} - VISIBLE: ${isVisible ? 'YES' : 'NO'}`);
      });
    } else {
      console.log('\n✅ No test services found to clean up');
    }
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  } finally {
    await pool.end();
  }
}

cleanupTestData();