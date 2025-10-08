import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecurringBookingTables1759742706855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create recurring_bookings table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS recurring_bookings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
                status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
                start_time VARCHAR(5) NOT NULL,
                duration_minutes INTEGER NOT NULL,
                next_booking_date DATE NOT NULL,
                end_date DATE,
                max_bookings INTEGER,
                current_booking_count INTEGER DEFAULT 0,
                special_instructions TEXT,
                auto_confirm BOOLEAN DEFAULT true,
                notification_preferences JSONB,
                skip_dates JSON,
                last_booking_created TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                customer_id UUID NOT NULL,
                provider_id UUID NOT NULL,
                service_id UUID NOT NULL
            );
        `);

        // Create recurring_booking_exceptions table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS recurring_booking_exceptions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                recurring_booking_id UUID NOT NULL,
                exception_date DATE NOT NULL,
                exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
                new_date DATE,
                new_time VARCHAR(5),
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_bookings_customer ON recurring_bookings(customer_id);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_bookings_provider ON recurring_bookings(provider_id);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_bookings_service ON recurring_bookings(service_id);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_bookings_next_date ON recurring_bookings(next_booking_date);
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_exceptions_booking_id ON recurring_booking_exceptions(recurring_booking_id);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_recurring_exceptions_date ON recurring_booking_exceptions(exception_date);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_exceptions_date;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_exceptions_booking_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_bookings_next_date;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_bookings_service;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_bookings_provider;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_recurring_bookings_customer;`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS recurring_booking_exceptions;`);
        await queryRunner.query(`DROP TABLE IF EXISTS recurring_bookings;`);
    }

}
