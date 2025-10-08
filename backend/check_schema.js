const { Pool } = require('pg');

const pool = new Pool({
  host: 'reservista-db.clpv2pqjqtv2.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'reservista_development',
  user: 'dbadmin',
  password: 'K7!mQ9xR2@pL4uB8',
});

async function checkSchema() {
  try {
    console.log('Checking point_transactions table schema...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'point_transactions' 
      ORDER BY ordinal_position
    `);
    
    console.log('Columns in point_transactions:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check constraints
    console.log('\nConstraints:');
    const constraints = await pool.query(`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'point_transactions'::regclass
    `);
    
    constraints.rows.forEach(row => {
      console.log(`- ${row.conname}: ${row.contype}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();