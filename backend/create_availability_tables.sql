-- Create missing availability tables for the AvailabilityService

-- Create provider_blocked_time table
CREATE TABLE IF NOT EXISTS provider_blocked_time (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    title VARCHAR(255),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_all_day BOOLEAN DEFAULT false,
    blocked_type VARCHAR(50) DEFAULT 'manual',
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Create provider_time_slot table  
CREATE TABLE IF NOT EXISTS provider_time_slot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    service_id UUID,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER DEFAULT 30,
    status VARCHAR(50) DEFAULT 'available',
    is_booked BOOLEAN DEFAULT false,
    booking_id UUID,
    custom_price DECIMAL(10,2),
    buffer_time INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_provider_id ON provider_blocked_time(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_date_range ON provider_blocked_time(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_active ON provider_blocked_time(is_active);

CREATE INDEX IF NOT EXISTS idx_provider_time_slot_provider_id ON provider_time_slot(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_time_slot_date ON provider_time_slot(date);
CREATE INDEX IF NOT EXISTS idx_provider_time_slot_status ON provider_time_slot(status);
CREATE INDEX IF NOT EXISTS idx_provider_time_slot_booked ON provider_time_slot(is_booked);

-- Insert some sample data for testing
INSERT INTO provider_blocked_time (provider_id, title, description, start_date, end_date, start_time, end_time, blocked_type)
SELECT 
    p.id,
    'Lunch Break',
    'Daily lunch break',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    '12:00:00',
    '13:00:00',
    'recurring'
FROM providers p 
WHERE p.verification_status = 'verified'
LIMIT 1
ON CONFLICT DO NOTHING;

PRINT 'Availability tables created successfully!';