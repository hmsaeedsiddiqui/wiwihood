-- Enhanced Gift Cards Database Schema
-- Created for dynamic gift card system with full lifecycle management

-- Main gift cards table with enhanced features
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL, -- Unique gift card code (e.g., GC-ABC123XYZ)
    amount DECIMAL(10,2) NOT NULL, -- Original gift card amount
    current_balance DECIMAL(10,2) NOT NULL, -- Remaining balance (renamed from balance)
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Purchase Information
    purchaser_email VARCHAR(255) NOT NULL,
    purchaser_name VARCHAR(255),
    purchaser_phone VARCHAR(20),
    purchaser_id UUID NULL,
    
    -- Recipient Information
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    personal_message TEXT, -- renamed from message
    
    -- Status and Lifecycle
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, redeemed, partially_redeemed, canceled, expired
    is_physical BOOLEAN DEFAULT FALSE, -- Digital vs Physical gift card
    is_transferable BOOLEAN DEFAULT true,
    
    -- Dates
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP, -- When gift card was delivered/sent
    first_redemption_date TIMESTAMP, -- First time it was used
    last_redemption_date TIMESTAMP, -- Last time it was used
    expiry_date TIMESTAMP NOT NULL, -- Expiration date (renamed from expires_at)
    
    -- Business Logic
    provider_id UUID, -- If gift card is for specific provider
    service_id UUID, -- If gift card is for specific service
    minimum_spend DECIMAL(10,2) DEFAULT 0, -- Minimum order amount to use gift card
    maximum_discount DECIMAL(10,2), -- Maximum discount this gift card can provide
    
    -- Payment Information
    payment_intent_id VARCHAR(255), -- Stripe/Payment gateway intent ID
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID, -- Admin/System user who created it
    current_owner_id UUID NULL,
    
    -- Constraints
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_balance_valid CHECK (current_balance >= 0 AND current_balance <= amount),
    CONSTRAINT chk_expiry_future CHECK (expiry_date > purchase_date),
    CONSTRAINT chk_status_valid CHECK (status IN ('active', 'redeemed', 'partially_redeemed', 'canceled', 'expired')),
    CONSTRAINT fk_gift_cards_purchaser FOREIGN KEY (purchaser_id) REFERENCES users(id),
    CONSTRAINT fk_gift_cards_owner FOREIGN KEY (current_owner_id) REFERENCES users(id)
);

-- Enhanced gift card transactions/redemptions table
CREATE TABLE IF NOT EXISTS gift_card_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gift_card_id UUID NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type VARCHAR(20) NOT NULL, -- redemption, refund, adjustment
    amount DECIMAL(10,2) NOT NULL, -- Amount used/refunded (renamed from amount_used)
    balance_before DECIMAL(10,2) NOT NULL, -- Balance before transaction
    balance_after DECIMAL(10,2) NOT NULL, -- Balance after transaction
    
    -- Order/Service Information
    booking_id UUID, -- Reference to booking if used for service
    order_id UUID, -- Reference to order if used for product
    provider_id UUID, -- Provider where gift card was redeemed
    
    -- User Information
    redeemed_by_email VARCHAR(255), -- Email of person who redeemed
    user_id UUID NOT NULL, -- User ID who performed transaction
    
    -- Location and Context
    redemption_location VARCHAR(255), -- Store/location where redeemed
    ip_address INET, -- IP address for security
    user_agent TEXT, -- Browser/device info
    
    -- Metadata
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- renamed from used_at
    notes TEXT, -- Admin notes or transaction description
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_transaction_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_balance_sequence CHECK (balance_after = balance_before - amount OR transaction_type = 'refund'),
    CONSTRAINT chk_transaction_type_valid CHECK (transaction_type IN ('redemption', 'refund', 'adjustment')),
    CONSTRAINT fk_gift_card_transactions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_gift_card_transactions_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Rename old table to new structure
DROP TABLE IF EXISTS gift_card_usage;

-- Gift card promotions/campaigns table
CREATE TABLE IF NOT EXISTS gift_card_promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Promotion Rules
    promotion_type VARCHAR(20) NOT NULL, -- bonus, discount, bulk
    bonus_percentage DECIMAL(5,2) DEFAULT 0, -- Extra % value (e.g., 10% bonus)
    bonus_amount DECIMAL(10,2) DEFAULT 0, -- Fixed bonus amount
    minimum_purchase DECIMAL(10,2) DEFAULT 0, -- Minimum purchase to qualify
    
    -- Validity
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Usage Limits
    usage_limit INTEGER, -- Total times this promotion can be used
    usage_count INTEGER DEFAULT 0, -- Times it has been used
    per_customer_limit INTEGER DEFAULT 1, -- Times each customer can use
    
    -- Targeting
    customer_email_pattern VARCHAR(255), -- Email pattern for targeting
    provider_id UUID, -- Specific provider promotion
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    -- Constraints
    CONSTRAINT chk_promotion_dates CHECK (end_date > start_date),
    CONSTRAINT chk_bonus_valid CHECK (bonus_percentage >= 0 AND bonus_percentage <= 100),
    CONSTRAINT chk_promotion_type_valid CHECK (promotion_type IN ('bonus', 'discount', 'bulk'))
);

-- Gift card settings/configuration table
CREATE TABLE IF NOT EXISTS gift_card_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by frontend
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser_email ON gift_cards(purchaser_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_expiry_date ON gift_cards(expiry_date);
CREATE INDEX IF NOT EXISTS idx_gift_cards_provider_id ON gift_cards(provider_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchase_date ON gift_cards(purchase_date);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser ON gift_cards(purchaser_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_owner ON gift_cards(current_owner_id);

CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_transaction_date ON gift_card_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_booking_id ON gift_card_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_provider_id ON gift_card_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_user ON gift_card_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_gift_card_promotions_active ON gift_card_promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_gift_card_promotions_dates ON gift_card_promotions(start_date, end_date);

-- Insert default settings
INSERT INTO gift_card_settings (setting_key, setting_value, data_type, description, is_public) VALUES
('default_expiry_months', '12', 'number', 'Default expiry period in months', TRUE),
('minimum_amount', '10', 'number', 'Minimum gift card purchase amount', TRUE),
('maximum_amount', '1000', 'number', 'Maximum gift card purchase amount', TRUE),
('allowed_amounts', '[25, 50, 100, 250, 500]', 'json', 'Predefined gift card amounts', TRUE),
('email_delivery_enabled', 'true', 'boolean', 'Enable automatic email delivery', FALSE),
('physical_cards_enabled', 'false', 'boolean', 'Enable physical gift cards', TRUE),
('bulk_purchase_enabled', 'true', 'boolean', 'Enable bulk gift card purchases', TRUE),
('refund_policy_days', '7', 'number', 'Days within which refund is allowed', TRUE),
('transaction_fee_percentage', '2.9', 'number', 'Transaction fee percentage', FALSE),
('code_prefix', 'GC-', 'string', 'Prefix for gift card codes', FALSE),
('code_length', '10', 'number', 'Length of gift card code (excluding prefix)', FALSE)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gift_cards_updated_at BEFORE UPDATE ON gift_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gift_card_usage_updated_at BEFORE UPDATE ON gift_card_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();