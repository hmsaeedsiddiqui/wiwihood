@echo off
echo Adding sample services to the database (fixed version)...

echo.
echo Running SQL script to add users, providers and services...
echo.

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U umar -d reservista_clean -f add_services_fixed.sql

if %ERRORLEVEL% EQU 0 (
    echo Services added successfully!
) else (
    echo Failed to add services. Please check the error messages above.
)

pause
