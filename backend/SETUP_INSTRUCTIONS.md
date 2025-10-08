# 🚀 Ready to Setup Database!

## Quick Steps:

### Option 1: Run Setup Script (Recommended)
1. **Navigate to backend folder:**
   ```
   cd C:\Users\Umer\Documents\GitHub\forge\reservista\backend
   ```

2. **Run the setup script:**
   ```
   setup_db.bat
   ```
   
3. **Enter your postgres password when prompted**
   - This should be the password you set during PostgreSQL installation

### Option 2: Manual Setup via pgAdmin
1. **Open pgAdmin** (should be in Start Menu)
2. **Create Database:**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `reservista_db`
3. **Create User:**
   - Right-click "Login/Group Roles" → "Create" → "Login/Group Role"
   - Name: `umar`
   - Password: `umar` 
   - Check "Can login?" and "Create databases?"

## After Database Setup:
Once the database is created, restart the NestJS server:
```
npm run start:dev
```

You should see:
✅ Database connection successful  
✅ Tables created automatically  
✅ No more connection errors!

## Current Configuration:
- **Database Name:** reservista_db
- **Username:** umar  
- **Password:** umar
- **Host:** localhost
- **Port:** 5432

Ready to proceed? 🎯
