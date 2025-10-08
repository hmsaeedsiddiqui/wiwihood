const { Client } = require('pg');

async function checkLoyaltyTables() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if loyalty tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%loyalty%'
      ORDER BY table_name;
    `;
    
    const tables = await client.query(tablesQuery);
    console.log('🏆 Loyalty-related tables:');
    if (tables.rows.length > 0) {
      console.table(tables.rows);
    } else {
      console.log('❌ No loyalty tables found!');
    }

    // Check loyalty table structure if it exists
    try {
      const loyaltyStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'loyalty' 
        ORDER BY ordinal_position;
      `);
      
      if (loyaltyStructure.rows.length > 0) {
        console.log('\n📋 Loyalty table structure:');
        console.table(loyaltyStructure.rows);
      } else {
        console.log('\n❌ Loyalty table does not exist!');
      }
    } catch (error) {
      console.log('\n❌ Error checking loyalty table structure:', error.message);
    }

    // Check if user has loyalty account
    try {
      const userLoyalty = await client.query(`
        SELECT * FROM loyalty 
        WHERE user_id = '474a5df3-60cf-446a-b446-a9763b26a81e' 
        LIMIT 1;
      `);
      
      console.log('\n👤 User loyalty account:');
      if (userLoyalty.rows.length > 0) {
        console.table(userLoyalty.rows);
      } else {
        console.log('❌ No loyalty account found for user john.doe@example.com');
      }
    } catch (error) {
      console.log('\n❌ Error checking user loyalty:', error.message);
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

checkLoyaltyTables();