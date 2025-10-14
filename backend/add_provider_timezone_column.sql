-- Add timezone column to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);

-- Add comment to the new column
COMMENT ON COLUMN providers.timezone IS 'Business timezone (e.g., America/New_York)';

-- Optional: Update existing providers with a default timezone if needed
-- UPDATE providers SET timezone = 'UTC' WHERE timezone IS NULL;

-- Verify the column was added
SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
  AND column_name = 'timezone';