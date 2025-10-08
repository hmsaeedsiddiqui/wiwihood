const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  ssl: {
    rejectUnauthorized: false
  }
};

async function checkRewardsTable() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if table exists and get column info
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_rewards'
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('loyalty_rewards table columns:');
      result.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('loyalty_rewards table does not exist');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRewardsTable();