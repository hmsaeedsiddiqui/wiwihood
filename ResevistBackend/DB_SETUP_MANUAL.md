# PostgreSQL Database Setup for Reservista

## Quick Setup Commands

If you have PostgreSQL installed locally, run these commands in PostgreSQL command line or pgAdmin:

```sql
-- Connect to PostgreSQL as superuser (postgres)
-- Then create database and user:

CREATE DATABASE reservista_db;
CREATE USER reservista_user WITH PASSWORD 'reservista_password';
GRANT ALL PRIVILEGES ON DATABASE reservista_db TO reservista_user;

-- Additional permissions for schema creation
ALTER USER reservista_user CREATEDB;
```

## Alternative: Using Command Line

If you can access psql from command line:

```bash
# Connect to PostgreSQL (you'll be prompted for postgres user password)
psql -U postgres -h localhost

# Then run the SQL commands above
```

## Alternative: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
   - Name: `reservista_db`
4. Right-click "Login/Group Roles" → Create → Login/Group Role
   - Name: `reservista_user`
   - Password: `reservista_password`
   - Privileges: Can login, Create databases

## Test Connection

After creating the database, we'll test the connection with our NestJS app.
