@echo off
echo Creating recurring bookings tables...
echo.

REM Load environment variables
for /f "delims=" %%a in ('type .env ^| findstr DB_') do set %%a

REM Run the SQL script
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_DATABASE% -f create_recurring_bookings_tables.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Recurring bookings tables created successfully!
    echo You can now test the recurring booking APIs.
) else (
    echo.
    echo ❌ Error creating tables. Please check your database connection.
    echo Make sure PostgreSQL is running and credentials are correct.
)

echo.
pause