-- STEP 1: Reset Database Script
-- Run this in pgAdmin Query Tool connected to postgres database (NOT wiwihood_db)

-- First, disconnect all active connections to the database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'wiwihood_db' AND pid <> pg_backend_pid();

-- Drop the database if it exists
DROP DATABASE IF EXISTS wiwihood_db;

-- Create a fresh database
CREATE DATABASE wiwihood_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Grant all privileges to postgres user
GRANT ALL ON DATABASE wiwihood_db TO postgres;

-- STEP 2: After running above, connect to wiwihood_db and run below:
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";