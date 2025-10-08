-- Fix Gift Cards table structure to match Entity
-- First, check if we need to rename columns or add missing ones

-- Rename 'amount' to 'original_amount' if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_cards' AND column_name = 'amount') THEN
        ALTER TABLE gift_cards RENAME COLUMN amount TO original_amount;
    END IF;
END $$;

-- Rename 'balance' to 'current_balance' if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_cards' AND column_name = 'balance') THEN
        ALTER TABLE gift_cards RENAME COLUMN balance TO current_balance;
    END IF;
END $$;

-- Add missing columns that the entity expects
ALTER TABLE gift_cards 
ADD COLUMN IF NOT EXISTS redeemed_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS purchaser_id UUID,
ADD COLUMN IF NOT EXISTS recipient_id UUID;

-- Rename existing columns to match entity expectations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_cards' AND column_name = 'created_by_user_id') THEN
        ALTER TABLE gift_cards RENAME COLUMN created_by_user_id TO purchaser_id;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_cards' AND column_name = 'recipient_user_id') THEN
        ALTER TABLE gift_cards RENAME COLUMN recipient_user_id TO recipient_id;
    END IF;
END $$;

-- Update foreign key constraints
ALTER TABLE gift_cards DROP CONSTRAINT IF EXISTS fk_gift_cards_created_by_user;
ALTER TABLE gift_cards DROP CONSTRAINT IF EXISTS fk_gift_cards_recipient_user;

ALTER TABLE gift_cards 
ADD CONSTRAINT fk_gift_cards_purchaser FOREIGN KEY (purchaser_id) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_gift_cards_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL;

-- Fix gift_card_usage table to match GiftCardUsage entity
ALTER TABLE gift_card_usage 
ADD COLUMN IF NOT EXISTS remaining_balance DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS used_in_booking_id UUID;

-- Rename columns in gift_card_usage table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_card_usage' AND column_name = 'booking_id') THEN
        ALTER TABLE gift_card_usage RENAME COLUMN booking_id TO used_in_booking_id;
    END IF;
END $$;

-- Update foreign key constraints for gift_card_usage
ALTER TABLE gift_card_usage DROP CONSTRAINT IF EXISTS fk_gift_card_usage_booking;
ALTER TABLE gift_card_usage 
ADD CONSTRAINT fk_gift_card_usage_booking FOREIGN KEY (used_in_booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- Create proper indexes
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser_id ON gift_cards(purchaser_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_id ON gift_cards(recipient_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_usage_gift_card_id ON gift_card_usage(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_usage_booking_id ON gift_card_usage(used_in_booking_id);

COMMIT;