@echo off
echo Checking table structures...

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U umar -d reservista_clean -f check_tables.sql

pause
