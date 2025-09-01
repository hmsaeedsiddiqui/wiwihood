@echo off
echo Adding 6 services to the database...

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U umar -d reservista_clean -f add_6_services.sql

pause
