-- Migration to add admin approval fields to services table

-- Add approval-related columns
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS approved_by_admin_id UUID NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS admin_comments TEXT NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS admin_assigned_badge VARCHAR(100) NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS admin_quality_rating DECIMAL(3,2) NULL;

-- Update existing services status enum to include new values
-- Note: This will depend on your specific database setup
-- For PostgreSQL, you might need to:
-- ALTER TYPE service_status_enum ADD VALUE IF NOT EXISTS 'pending_approval';
-- ALTER TYPE service_status_enum ADD VALUE IF NOT EXISTS 'approved';
-- ALTER TYPE service_status_enum ADD VALUE IF NOT EXISTS 'rejected';

-- Set existing active services as approved for backward compatibility
UPDATE services 
SET is_approved = TRUE, 
    approval_date = NOW(),
    status = 'approved'
WHERE status = 'active' AND is_approved = FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_is_approved ON services (is_approved);
CREATE INDEX IF NOT EXISTS idx_services_approved_by_admin_id ON services (approved_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_services_approval_date ON services (approval_date);

-- Add foreign key constraint if admin users table exists
-- ALTER TABLE services ADD CONSTRAINT fk_services_approved_by_admin 
-- FOREIGN KEY (approved_by_admin_id) REFERENCES users(id) ON DELETE SET NULL;