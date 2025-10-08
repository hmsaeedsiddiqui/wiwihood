import { DataSource } from 'typeorm';
import { RecurringBooking, RecurringBookingException } from './src/entities/recurring-booking.entity';

// Create a simple database sync script
async function syncRecurringTables() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    entities: [RecurringBooking, RecurringBookingException],
    synchronize: true, // This will create tables automatically
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected and tables synchronized');
    
    // Check if tables exist
    const queryRunner = dataSource.createQueryRunner();
    
    const recurringTable = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'recurring_bookings'
    `);
    
    const exceptionsTable = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'recurring_booking_exceptions'
    `);
    
    console.log('Recurring bookings table exists:', recurringTable.length > 0);
    console.log('Exceptions table exists:', exceptionsTable.length > 0);
    
    await queryRunner.release();
    await dataSource.destroy();
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

syncRecurringTables();