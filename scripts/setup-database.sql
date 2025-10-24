-- Database Setup Script for SahaayConnect
-- Run this in pgAdmin to create the sahaay_connect database

-- Create the database
CREATE DATABASE sahaay_connect
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the new database and create tables
-- (Tables will be created automatically by Drizzle when the server starts)

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE sahaay_connect TO postgres;