@echo off
echo Adding more shops (providers) to the database...

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U umar -d reservista_clean -f add_shops.sql

pause
