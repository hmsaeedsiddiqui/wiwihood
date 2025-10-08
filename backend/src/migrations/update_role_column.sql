-- Migration to update the 'role' column type in the 'users' table
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50) USING role::VARCHAR(50);
-- Ensure the default value is set correctly
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer';
