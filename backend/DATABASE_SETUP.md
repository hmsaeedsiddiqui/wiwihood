# Reservista Database Setup Guide

## Option 1: PostgreSQL with Docker (Recommended - Easy & Isolated)

### Prerequisites
- Docker Desktop installed

### Quick Setup
```bash
# Create a PostgreSQL container for Reservista
docker run --name reservista-postgres \
  -e POSTGRES_DB=reservista_db \
  -e POSTGRES_USER=reservista_user \
  -e POSTGRES_PASSWORD=reservista_password \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps

# Connect to database (optional - for testing)
docker exec -it reservista-postgres psql -U reservista_user -d reservista_db
```

## Option 2: Local PostgreSQL Installation

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Create database:
```bash
# Open psql command line
psql -U postgres
CREATE DATABASE reservista_db;
CREATE USER reservista_user WITH PASSWORD 'reservista_password';
GRANT ALL PRIVILEGES ON DATABASE reservista_db TO reservista_user;
\q
```

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb reservista_db
createuser -s reservista_user
```

## Option 3: Cloud Database (Production-like)

### Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Get connection details from Settings > Database
4. Update .env file with cloud credentials

### ElephantSQL (Free Tier)
1. Go to https://www.elephantsql.com
2. Create free account and database instance
3. Get connection URL
4. Update .env file

## Environment Configuration

Update your `.env` file with the database credentials:

```env
# Local PostgreSQL
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=reservista_user
DATABASE_PASSWORD=reservista_password
DATABASE_NAME=reservista_db

# OR Cloud Database (example)
# DATABASE_URL=postgresql://username:password@host:port/database
```

## Testing Connection

Once PostgreSQL is running, test the connection:

```bash
# In the backend directory
npm run start:dev
```

You should see:
- ✅ "Nest application successfully started"
- ✅ No database connection errors
- ✅ "TypeORM successfully connected to database"

## Troubleshooting

### Connection Refused Error
- Ensure PostgreSQL is running
- Check port 5432 is available
- Verify credentials in .env file

### Permission Errors
- Make sure user has proper database permissions
- Try connecting with psql first to verify credentials

### Docker Issues
```bash
# Stop and remove container if needed
docker stop reservista-postgres
docker rm reservista-postgres

# Check if port is in use
netstat -an | findstr :5432
```
