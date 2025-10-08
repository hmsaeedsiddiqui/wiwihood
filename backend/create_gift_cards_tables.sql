-- Create Gift Cards Tables
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'active',
    expires_at TIMESTAMP NULL,
    is_transferable BOOLEAN DEFAULT true,
    recipient_name VARCHAR(255) NULL,
    recipient_email VARCHAR(255) NULL,
    message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purchaser_id UUID NULL,
    current_owner_id UUID NULL,
    CONSTRAINT fk_gift_cards_purchaser FOREIGN KEY (purchaser_id) REFERENCES users(id),
    CONSTRAINT fk_gift_cards_owner FOREIGN KEY (current_owner_id) REFERENCES users(id)
);

-- Create Gift Card Usage Table
CREATE TABLE IF NOT EXISTS gift_card_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount_used DECIMAL(10, 2) NOT NULL,
    booking_id UUID NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gift_card_id UUID NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_gift_card_usage_gift_card FOREIGN KEY (gift_card_id) REFERENCES gift_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_gift_card_usage_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_gift_card_usage_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser ON gift_cards(purchaser_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_owner ON gift_cards(current_owner_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_usage_gift_card ON gift_card_usage(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_usage_user ON gift_card_usage(user_id);

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