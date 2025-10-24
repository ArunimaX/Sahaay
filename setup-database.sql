-- Create database if it doesn't exist
-- Run this in PostgreSQL as superuser (postgres)

-- Connect to postgres database first
\c postgres;

-- Create the database
CREATE DATABASE sahaay_connect;

-- Create a user for the application (optional, you can use postgres user)
-- CREATE USER sahaay_user WITH PASSWORD 'your_password';
-- GRANT ALL PRIVILEGES ON DATABASE sahaay_connect TO sahaay_user;

-- Connect to the new database
\c sahaay_connect;

-- The tables will be created automatically by Drizzle migrations
-- when the server starts up