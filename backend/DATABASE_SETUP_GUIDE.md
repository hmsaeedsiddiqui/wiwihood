# 🗄️ PostgreSQL Database Setup Guide

## Current Issue
✅ PostgreSQL is installed and running  
❌ Database user "reservista_user" doesn't exist  
❌ Database "reservista_db" doesn't exist  

## Solution Options

### Option 1: Use pgAdmin (Recommended - Visual Interface)

1. **Open pgAdmin** (should be installed with PostgreSQL)
2. **Connect to PostgreSQL server** (usually localhost)
3. **Create Database:**
   - Right-click "Databases" → "Create" → "Database..."
   - Name: `reservista_db`
   - Click "Save"
4. **Create User:**
   - Right-click "Login/Group Roles" → "Create" → "Login/Group Role..."
   - General tab: Name = `reservista_user`
   - Definition tab: Password = `reservista_password`
   - Privileges tab: Check "Can login?" and "Create databases?"
   - Click "Save"

### Option 2: Use SQL Commands (Command Line)

If you can find the PostgreSQL installation directory, usually:
- `C:\Program Files\PostgreSQL\[version]\bin\`

1. **Open Command Prompt as Administrator**
2. **Navigate to PostgreSQL bin directory:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
3. **Connect to PostgreSQL:**
   ```cmd
   psql -U postgres
   ```
4. **Run the setup script:**
   ```sql
   CREATE DATABASE reservista_db;
   CREATE USER reservista_user WITH PASSWORD 'reservista_password';
   GRANT ALL PRIVILEGES ON DATABASE reservista_db TO reservista_user;
   ALTER USER reservista_user CREATEDB;
   \c reservista_db;
   GRANT ALL ON SCHEMA public TO reservista_user;
   ```

### Option 3: Test with Default postgres User (Quick Test)

If you want to test immediately, you can:
1. Change the .env file to use the default postgres user temporarily
2. Test the connection
3. Set up the proper user later

## After Setup

Once the database and user are created, restart the NestJS server:
```bash
npm run start:dev
```

You should see:
✅ Database connection successful  
✅ Tables created automatically  
✅ Server running without errors  

## Need Help?

If you're having trouble finding pgAdmin or psql, let me know and I can help you locate them or try a different approach!
