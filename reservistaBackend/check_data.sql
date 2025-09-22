-- Check if there are services and providers in the database
SELECT 'Services' as table_name, id, 'name:', name, 'provider_id:', provider_id FROM services LIMIT 5;
SELECT 'Providers' as table_name, id, 'business_name:', business_name FROM providers LIMIT 5;
SELECT 'Users' as table_name, id, 'email:', email FROM users LIMIT 5;