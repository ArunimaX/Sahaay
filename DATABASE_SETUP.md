# Database Setup Instructions

## Create the sahaay_connect Database

### Method 1: Using pgAdmin (Recommended)

1. **Open pgAdmin 4**
2. **Connect to your PostgreSQL server** with:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `3155`

3. **Create the database**:
   - Right-click on "Databases"
   - Select "Create" → "Database..."
   - **Name**: `sahaay_connect`
   - **Owner**: `postgres`
   - Click "Save"

### Method 2: Using SQL Command

Run this SQL command in pgAdmin Query Tool:

```sql
CREATE DATABASE sahaay_connect
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

## Verify Setup

After creating the database:

1. **Restart your SahaayConnect server**
2. **Check the logs** - you should see:
   ```
   ✅ PostgreSQL connected successfully
   🗄️ Connected to database: sahaay_connect
   ✅ Table users initialized successfully
   ✅ Database tables initialized successfully
   ```

3. **Test registration** - try registering a user
4. **Check in pgAdmin**:
   ```
   Servers → Your Server → Databases → sahaay_connect → Schemas → public → Tables
   ```

## Tables That Will Be Created

The following tables will be automatically created when you start the server:

- `users` - Main user accounts
- `profiles` - User registration data
- `donor_info` - Donor information
- `food_donations` - Food donation records
- `food_items` - Individual food items
- `ngo_info` - NGO information
- `ngo_requests` - NGO requests for donations
- `delivery_proofs` - Delivery proof records
- `service_provider_info` - Service provider profiles
- `consumer_info` - Consumer profiles
- `work_requests` - Service requests

## Check Registration Data

After registering users, check the data with:

```sql
-- View all profiles
SELECT id, email, name, role, created_at FROM profiles ORDER BY created_at DESC;

-- Check specific user
SELECT * FROM profiles WHERE email = 'je@et.in';
```