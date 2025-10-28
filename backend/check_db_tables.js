const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

dataSource.initialize().then(async () => {
  console.log('🔗 Database connected');
  
  const tables = await dataSource.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'provider_%'
    ORDER BY table_name;
  `);
  
  console.log('📋 Provider tables:', tables.map(t => t.table_name));
  
  // Check if the key availability tables exist
  const availabilityTables = ['provider_working_hours', 'provider_blocked_times', 'provider_time_slots'];
  
  for (const table of availabilityTables) {
    try {
      const result = await dataSource.query(`SELECT COUNT(*) as count FROM ${table} LIMIT 1;`);
      console.log(`✅ Table ${table} exists and is accessible`);
    } catch (error) {
      console.log(`❌ Table ${table} error:`, error.message);
    }
  }
  
  await dataSource.destroy();
}).catch(error => {
  console.error('❌ Database error:', error.message);
});