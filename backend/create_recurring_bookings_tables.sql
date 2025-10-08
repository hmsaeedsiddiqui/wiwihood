-- Create recurring bookings tables
-- Run this script to create the required tables for recurring bookings functionality

-- Create enum types
DO $$ BEGIN
    CREATE TYPE recurrence_frequency AS ENUM ('weekly', 'biweekly', 'monthly', 'quarterly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recurrence_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create recurring_bookings table
CREATE TABLE IF NOT EXISTS recurring_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frequency recurrence_frequency NOT NULL,
    status recurrence_status NOT NULL DEFAULT 'active',
    start_time VARCHAR(5) NOT NULL, -- HH:MM format
    duration_minutes INTEGER NOT NULL,
    next_booking_date DATE NOT NULL,
    end_date DATE,
    max_bookings INTEGER,
    current_booking_count INTEGER DEFAULT 0,
    special_instructions TEXT,
    auto_confirm BOOLEAN DEFAULT false,
    notification_preferences JSONB,
    skip_dates TEXT[], -- Array of dates to skip (YYYY-MM-DD format)
    last_booking_created TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    customer_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL,
    
    -- Foreign key constraints
    CONSTRAINT fk_recurring_bookings_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recurring_bookings_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_recurring_bookings_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Create recurring_booking_exceptions table
CREATE TABLE IF NOT EXISTS recurring_booking_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exception_date DATE NOT NULL,
    reason TEXT,
    is_cancelled BOOLEAN DEFAULT true,
    replacement_date DATE,
    replacement_time VARCHAR(5), -- HH:MM format
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    recurring_booking_id UUID NOT NULL,
    
    -- Foreign key constraint
    CONSTRAINT fk_exceptions_recurring_booking FOREIGN KEY (recurring_booking_id) REFERENCES recurring_bookings(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recurring_bookings_customer_id ON recurring_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_bookings_provider_id ON recurring_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_recurring_bookings_service_id ON recurring_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_recurring_bookings_status ON recurring_bookings(status);
CREATE INDEX IF NOT EXISTS idx_recurring_bookings_next_booking_date ON recurring_bookings(next_booking_date);
CREATE INDEX IF NOT EXISTS idx_recurring_booking_exceptions_recurring_booking_id ON recurring_booking_exceptions(recurring_booking_id);
CREATE INDEX IF NOT EXISTS idx_recurring_booking_exceptions_exception_date ON recurring_booking_exceptions(exception_date);

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_recurring_bookings_updated_at ON recurring_bookings;
CREATE TRIGGER update_recurring_bookings_updated_at
    BEFORE UPDATE ON recurring_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recurring_booking_exceptions_updated_at ON recurring_booking_exceptions;
CREATE TRIGGER update_recurring_booking_exceptions_updated_at
    BEFORE UPDATE ON recurring_booking_exceptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your user)
GRANT ALL PRIVILEGES ON TABLE recurring_bookings TO postgres;
GRANT ALL PRIVILEGES ON TABLE recurring_booking_exceptions TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

COMMENT ON TABLE recurring_bookings IS 'Table to store recurring booking patterns';
COMMENT ON TABLE recurring_booking_exceptions IS 'Table to store exceptions/modifications to recurring bookings';

PRINT 'Recurring bookings tables created successfully!';