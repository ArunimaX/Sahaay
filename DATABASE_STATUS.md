# Database Setup Complete ✅

## Current Status
- **Database Name**: `sahaay_connect`
- **Connection**: Active and working
- **Tables**: All migrations applied successfully
- **Profiles Count**: 8 registered users

## Database Configuration
```env
DATABASE_URL=postgresql://postgres:3155@localhost:5432/sahaay_connect
```

## Available Endpoints

### Database Status
- **GET** `http://localhost:5000/api/test/db-status` - Check database connection
- **GET** `http://localhost:5000/api/test/profiles` - View all registered users

### Registration & Login
- **POST** `http://localhost:5000/api/test/register` - Register new user
- **POST** `http://localhost:5000/api/test/login` - Login user

### Example Registration Request
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "consumer",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Valid Roles
- `admin`
- `consumer`
- `service-provider`
- `donor`
- `ngo`
- `volunteer`
- `educator`
- `community`
- `fieldworker`

## Current Database Contents
The database currently contains 8 profiles:

| Email | Name | Role | Created |
|-------|------|------|---------|
| test@example.com | Test User | consumer | 23/8/2025, 2:35:35 am |
| jane@doe.in | jane doe | donor | 23/8/2025, 2:02:45 am |
| testy@testy.com | testy | donor | 23/8/2025, 1:34:56 am |
| admin@gmail.com | admin@gmail.com | admin | 23/8/2025, 1:15:46 am |
| job@gmail.com | job | service-provider | 23/8/2025, 1:08:28 am |
| ngo2@2gmail.com | ngo1 | ngo | 22/8/2025, 11:44:08 pm |
| ngo1@gmail.com | ngo@gmail.com | ngo | 22/8/2025, 11:39:19 pm |
| ngo@gmail.com | ngo@gmail.com | ngo | 22/8/2025, 11:28:23 pm |

## How to View in pgAdmin

1. **Open pgAdmin**
2. **Navigate to**: Servers → Your Server → Databases → `sahaay_connect` → Schemas → public → Tables → `profiles`
3. **Right-click** on `profiles` table → **View/Edit Data** → **All Rows**

## Server Commands

### Start Server
```bash
npm run dev:server
```

### Check Database
```bash
npm run db:init          # Initialize/verify database
node scripts/check-database.js  # View database contents
```

### Test Registration
```bash
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/test/register" -Method POST -ContentType "application/json" -Body '{"email":"new@user.com","name":"New User","role":"consumer","password":"password123","confirmPassword":"password123"}'
```

## Next Steps

1. **Register a new user** through your website
2. **Check pgAdmin** to see the new registration appear in the `profiles` table
3. **Verify** the data is properly stored with encrypted passwords

The database is fully functional and ready for use! 🎉