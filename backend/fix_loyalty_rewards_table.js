const { Client } = require('pg');

const client = new Client({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  username: 'postgres', 
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkLoyaltyRewardsSchema() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check if loyalty_rewards table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'loyalty_rewards'
      );
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Check columns in loyalty_rewards table
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'loyalty_rewards' 
        ORDER BY ordinal_position
      `);
      
      console.log('Loyalty Rewards columns:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('Table does not exist, creating it...');
      
      // Create loyalty_rewards table
      await client.query(`
        CREATE TABLE loyalty_rewards (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          "pointsRequired" INTEGER NOT NULL,
          "discountPercentage" DECIMAL(5,2),
          "discountAmount" DECIMAL(10,2),
          "minimumTier" VARCHAR(20) DEFAULT 'bronze',
          "isActive" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Table created successfully');
      
      // Insert sample rewards
      await client.query(`
        INSERT INTO loyalty_rewards (name, description, "pointsRequired", "discountPercentage", "minimumTier") VALUES
        ('5% Discount', '5% off your next booking', 100, 5.00, 'bronze'),
        ('10% Discount', '10% off your next booking', 250, 10.00, 'silver'),
        ('15% Discount', '15% off your next booking', 500, 15.00, 'gold'),
        ('Free Service Add-on', 'Free add-on service worth $20', 300, NULL, 'silver'),
        ('Priority Booking', 'Skip the queue with priority booking', 750, NULL, 'gold');
      `);
      
      console.log('Sample rewards inserted');
    }
    
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await client.end();
  }
}

checkLoyaltyRewardsSchema();