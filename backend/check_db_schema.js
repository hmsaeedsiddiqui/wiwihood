const { createConnection } = require('typeorm');

async function checkDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'reservista-db.clpv2pqjqtv2.us-east-1.rds.amazonaws.com',
      port: 5432,
      username: 'dbadmin',
      password: 'K7!mQ9xR2@pL4uB8',
      database: 'reservista_development',
    });

    console.log('Connected to database, checking schema...');
    
    // Check table structure
    const result = await connection.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'point_transactions' 
      ORDER BY ordinal_position
    `);
    
    console.log('Columns in point_transactions table:');
    result.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check sample data
    console.log('\nSample data:');
    const sampleData = await connection.query('SELECT * FROM point_transactions LIMIT 3');
    console.log(sampleData);
    
    await connection.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();