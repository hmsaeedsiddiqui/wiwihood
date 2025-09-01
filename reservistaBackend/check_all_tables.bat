@echo off
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U umar -d reservista_clean -f check_all_tables.sql
pause
