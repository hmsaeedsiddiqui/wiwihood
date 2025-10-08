@echo off
echo Creating Gift Cards database tables...

:: Replace these with your actual database connection details
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=reservista
set DB_USER=postgres
set DB_PASSWORD=123456

echo Connecting to database %DB_NAME% on %DB_HOST%:%DB_PORT%
psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -f create_gift_cards_tables.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Gift Cards tables created successfully!
) else (
    echo ❌ Error creating tables. Please check your database connection.
)

pause