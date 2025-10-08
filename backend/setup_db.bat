@echo off
echo Creating PostgreSQL database and user for Reservista...

echo.
echo Method 1: Try with postgres user (default superuser)
echo You'll be prompted for the postgres user password
echo.

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -c "CREATE DATABASE reservista_db;"
if %ERRORLEVEL% EQU 0 (
    echo Database created successfully!
    
    echo Creating user 'umar' with password 'umar'...
    "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -c "CREATE USER umar WITH PASSWORD 'umar';"
    "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE reservista_db TO umar;"
    "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -c "ALTER USER umar CREATEDB;"
    
    echo Granting schema permissions...
    "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d reservista_db -c "GRANT ALL ON SCHEMA public TO umar;"
    
    echo.
    echo Setup completed successfully!
    echo Database: reservista_db
    echo User: umar
    echo Password: umar
) else (
    echo Failed to create database. Please check your postgres user password.
    echo.
    echo Alternative: Open pgAdmin and create manually:
    echo 1. Database: reservista_db
    echo 2. User: umar with password: umar
)

pause
