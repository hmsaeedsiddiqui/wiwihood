-- Run this script as the 'umar' user
-- Connect to PostgreSQL as: psql -U umar -d postgres

-- Create the Reservista database
CREATE DATABASE reservista_db;

-- Grant all privileges to your user on the new database
GRANT ALL PRIVILEGES ON DATABASE reservista_db TO umar;

-- Connect to the new database
\c reservista_db;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO umar;
GRANT CREATE ON SCHEMA public TO umar;

-- Display success message
SELECT 'Database reservista_db created successfully!' as status;
