const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  port: 5432,
});

async function checkBadgeDistribution() {
  try {
    // First check the table structure
    const checkColumns = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await pool.query(checkColumns);
    console.log('\n=== SERVICES TABLE COLUMNS ===\n');
    columnsResult.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type}`);
    });

    // Check all services with their badges
    const query = `
      SELECT 
        s.id,
        s.name,
        s."adminAssignedBadge",
        s."isActive",
        s.status,
        COUNT(*) OVER () as total_services
      FROM services s
      WHERE s."isActive" = true 
      AND s.status = 'active'
      ORDER BY s."adminAssignedBadge", s.name;
    `;

    const result = await pool.query(query);
    const services = result.rows;

    console.log('\n=== BADGE DISTRIBUTION ANALYSIS ===\n');
    console.log(`Total Active Services: ${services.length}\n`);

    // Group services by badge
    const badgeGroups = {};
    services.forEach(service => {
      const badge = service.adminAssignedBadge || 'No Badge';
      if (!badgeGroups[badge]) {
        badgeGroups[badge] = [];
      }
      badgeGroups[badge].push(service);
    });

    // Display badge distribution
    Object.entries(badgeGroups).forEach(([badge, services]) => {
      console.log(`📌 ${badge}: ${services.length} services`);
      services.forEach(service => {
        console.log(`   - ${service.name} (ID: ${service.id})`);
      });
      console.log('');
    });

    // Check which exact badges we have
    const expectedBadges = [
      'New on vividhood',
      'Popular',
      'Hot Deal',
      'Best Seller',
      'Limited Time',
      'Premium',
      'Top Rated'
    ];

    console.log('\n=== EXPECTED BADGES STATUS ===\n');
    expectedBadges.forEach(expectedBadge => {
      const count = badgeGroups[expectedBadge]?.length || 0;
      const status = count > 0 ? '✅' : '❌';
      console.log(`${status} ${expectedBadge}: ${count} services`);
    });

    // Show available badges that don't match expected
    console.log('\n=== OTHER BADGES FOUND ===\n');
    Object.keys(badgeGroups).forEach(badge => {
      if (!expectedBadges.includes(badge) && badge !== 'No Badge') {
        console.log(`🔍 "${badge}": ${badgeGroups[badge].length} services`);
      }
    });

  } catch (error) {
    console.error('Error checking badge distribution:', error);
  } finally {
    await pool.end();
  }
}

checkBadgeDistribution();