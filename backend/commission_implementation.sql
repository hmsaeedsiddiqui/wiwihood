-- Commission table creation
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE,
    provider_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    provider_earning DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    payout_status VARCHAR(20) DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'cancelled')),
    payout_id UUID,
    processed_at TIMESTAMP,
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_commission_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_commission_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_commission_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_commissions_provider_id ON commissions(provider_id);
CREATE INDEX idx_commissions_booking_id ON commissions(booking_id);
CREATE INDEX idx_commissions_payout_status ON commissions(payout_status);
CREATE INDEX idx_commissions_processed_at ON commissions(processed_at);

-- Enhanced Payout table
ALTER TABLE payouts 
ADD COLUMN IF NOT EXISTS provider_id UUID,
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS failure_reason TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update payout status to use enum
ALTER TABLE payouts ALTER COLUMN status TYPE VARCHAR(20);
UPDATE payouts SET status = 'pending' WHERE status NOT IN ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Add provider payout method and bank details to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS payout_method VARCHAR(50) DEFAULT 'bank_transfer',
ADD COLUMN IF NOT EXISTS bank_account_details JSONB;

-- Add indexes for commission tracking
CREATE INDEX idx_providers_commission_rate ON providers(commission_rate);
CREATE INDEX idx_bookings_total_price ON bookings(total_price);

-- Update triggers for commission auto-processing
CREATE OR REPLACE FUNCTION process_booking_commission()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process commission when booking is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO commissions (
            booking_id,
            provider_id,
            customer_id,
            total_amount,
            commission_amount,
            provider_earning,
            commission_rate,
            status,
            processed_at
        )
        SELECT 
            NEW.id,
            NEW.provider_id,
            NEW.customer_id,
            NEW.total_price,
            (NEW.total_price * p.commission_rate / 100),
            (NEW.total_price - (NEW.total_price * p.commission_rate / 100)),
            p.commission_rate,
            'processed',
            CURRENT_TIMESTAMP
        FROM providers p
        WHERE p.id = NEW.provider_id
        ON CONFLICT (booking_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic commission processing
DROP TRIGGER IF EXISTS trigger_process_commission ON bookings;
CREATE TRIGGER trigger_process_commission
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION process_booking_commission();

-- Commission analytics views
CREATE OR REPLACE VIEW commission_analytics AS
SELECT 
    DATE_TRUNC('day', processed_at) as date,
    COUNT(*) as commission_count,
    SUM(commission_amount) as total_commission,
    SUM(provider_earning) as total_provider_earnings,
    SUM(total_amount) as total_revenue,
    AVG(commission_rate) as avg_commission_rate
FROM commissions 
WHERE status = 'processed'
GROUP BY DATE_TRUNC('day', processed_at)
ORDER BY date DESC;

-- Provider earnings view
CREATE OR REPLACE VIEW provider_earnings AS
SELECT 
    p.id as provider_id,
    p.business_name,
    COUNT(c.id) as total_bookings,
    SUM(c.total_amount) as total_revenue,
    SUM(c.commission_amount) as total_commission_paid,
    SUM(c.provider_earning) as total_earnings,
    SUM(CASE WHEN c.payout_status = 'pending' THEN c.provider_earning ELSE 0 END) as pending_payout,
    AVG(c.commission_rate) as avg_commission_rate
FROM providers p
LEFT JOIN commissions c ON p.id = c.provider_id AND c.status = 'processed'
GROUP BY p.id, p.business_name
ORDER BY total_earnings DESC;

-- Add comment to track commission implementation
COMMENT ON TABLE commissions IS 'Commission tracking for automatic deduction and payout management';
COMMENT ON TRIGGER trigger_process_commission ON bookings IS 'Automatically processes commission when booking is completed';