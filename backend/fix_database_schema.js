const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function fixDatabaseSchema() {
  const pool = new Pool({
    user: 'postgres',
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔧 Starting database schema fix...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'fix_database_schema.sql'), 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          const result = await pool.query(statement);
          if (result.rows && result.rows.length > 0) {
            console.log('Result:', result.rows);
          }
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`⚠️ Skipping: ${error.message}`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Database schema fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixDatabaseSchema();