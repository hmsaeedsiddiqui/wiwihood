const { Client } = require('pg');
require('dotenv').config();

async function addProviderTimezoneColumn() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'wiwihood_db',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if timezone column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      AND column_name = 'timezone'
      AND table_schema = 'public';
    `;

    const columnExists = await client.query(checkColumnQuery);

    if (columnExists.rows.length === 0) {
      // Add timezone column
      const addColumnQuery = `
        ALTER TABLE providers 
        ADD COLUMN timezone VARCHAR(50);
      `;

      await client.query(addColumnQuery);
      console.log('✅ Successfully added timezone column to providers table');
    } else {
      console.log('✅ Timezone column already exists in providers table');
    }

  } catch (error) {
    console.error('❌ Error adding timezone column:', error);
  } finally {
    await client.end();
  }
}

addProviderTimezoneColumn();