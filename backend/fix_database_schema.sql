-- Fix Database Schema Issues
-- This script adds missing columns that are causing 500 errors

-- First, let's check what columns exist in the bookings table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in the providers table  
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add staffId column to bookings table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'staffId' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE bookings ADD COLUMN "staffId" UUID NULL;
        COMMENT ON COLUMN bookings."staffId" IS 'Staff member assigned to this booking';
    END IF;
END $$;

-- Add payout_method column to providers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' 
        AND column_name = 'payout_method' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE providers ADD COLUMN payout_method VARCHAR(50) DEFAULT 'bank_transfer';
        COMMENT ON COLUMN providers.payout_method IS 'Preferred payout method for the provider';
    END IF;
END $$;

-- Add bank_account_details column to providers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' 
        AND column_name = 'bank_account_details' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE providers ADD COLUMN bank_account_details JSONB NULL;
        COMMENT ON COLUMN providers.bank_account_details IS 'Bank account details for payouts in JSON format';
    END IF;
END $$;

-- Create foreign key constraint for staffId if it doesn't exist and staff table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'staff' AND table_schema = 'public')
    AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_bookings_staff' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE bookings 
        ADD CONSTRAINT "FK_bookings_staff" 
        FOREIGN KEY ("staffId") 
        REFERENCES staff(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_bookings_staffId" ON bookings("staffId");
CREATE INDEX IF NOT EXISTS "IDX_providers_payout_method" ON providers(payout_method);

-- Display success message
SELECT 'Database schema fixes applied successfully!' as status;

-- Show the updated column structure
SELECT 'Bookings table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND table_schema = 'public'
AND column_name IN ('staffId', 'customerId', 'providerId', 'serviceId')
ORDER BY ordinal_position;

SELECT 'Providers table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND table_schema = 'public'
AND column_name IN ('payout_method', 'bank_account_details', 'userId')
ORDER BY ordinal_position;