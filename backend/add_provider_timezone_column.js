const { Pool } = require('pg');

// Database configuration - update with your actual database credentials
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'wiwihood',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function addTimezoneColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding timezone column to providers table...');
    
    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
        AND column_name = 'timezone'
    `;
    
    const columnExists = await client.query(checkColumnQuery);
    
    if (columnExists.rows.length > 0) {
      console.log('✅ Timezone column already exists in providers table');
      return;
    }
    
    // Add the timezone column
    const addColumnQuery = `
      ALTER TABLE providers 
      ADD COLUMN timezone VARCHAR(50);
    `;
    
    await client.query(addColumnQuery);
    
    // Add comment to the column
    const addCommentQuery = `
      COMMENT ON COLUMN providers.timezone IS 'Business timezone (e.g., America/New_York)';
    `;
    
    await client.query(addCommentQuery);
    
    console.log('✅ Successfully added timezone column to providers table');
    
    // Verify the column was added
    const verifyQuery = `
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
        AND column_name = 'timezone'
    `;
    
    const result = await client.query(verifyQuery);
    console.log('📋 Column details:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error adding timezone column:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
addTimezoneColumn()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });