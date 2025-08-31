-- Create a simple script to add 6 services
-- We'll create minimal users and providers, then add services

-- First check categories
SELECT id, name, slug FROM categories;

-- Create simple users (with correct column names)
INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    password,
    role,
    is_email_verified,
    status,
    created_at,
    updated_at
) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah@glamour.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Mike', 'Chen', 'mike@zenspa.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Maria', 'Rodriguez', 'maria@cleanpro.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'David', 'Wilson', 'david@fixit.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create providers (with correct column names)
INSERT INTO providers (
    id,
    "businessName",
    description,
    address,
    city,
    country,
    "postalCode",
    phone,
    "providerType",
    status,
    "isVerified",
    "averageRating",
    "totalReviews",
    "totalBookings",
    "userId"
) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'Glamour Beauty Salon', 'Premium beauty salon', '123 Beauty Street', 'City', 'USA', '12345', '+1-555-0101', 'individual', 'active', true, 4.8, 156, 342, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'Zen Spa & Wellness', 'Relaxing spa center', '456 Wellness Ave', 'City', 'USA', '12346', '+1-555-0102', 'business', 'active', true, 4.9, 203, 478, '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440013', 'CleanPro Home Services', 'Professional cleaning', '789 Service Road', 'City', 'USA', '12347', '+1-555-0103', 'business', 'active', true, 4.7, 128, 298, '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440014', 'FixIt Handyman Services', 'Reliable handyman', '321 Repair Street', 'City', 'USA', '12348', '+1-555-0104', 'individual', 'active', true, 4.6, 89, 167, '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Add 6 services
INSERT INTO services (
    id,
    name,
    description,
    "shortDescription",
    "basePrice",
    "durationMinutes",
    "categoryId",
    "providerId",
    "serviceType",
    "pricingType",
    status,
    "isActive",
    "isFeatured"
) VALUES 
(uuid_generate_v4(), 'Professional Hair Styling', 'Transform your look with professional hair styling services.', 'Hair cut and styling', 85.00, 90, (SELECT id FROM categories WHERE slug = 'beauty-wellness'), '550e8400-e29b-41d4-a716-446655440011', 'appointment', 'fixed', 'active', true, true),
(uuid_generate_v4(), 'Relaxing Spa Massage', 'Unwind with our signature 60-minute full body massage.', 'Full body massage', 120.00, 60, (SELECT id FROM categories WHERE slug = 'beauty-wellness'), '550e8400-e29b-41d4-a716-446655440012', 'appointment', 'fixed', 'active', true, false),
(uuid_generate_v4(), 'Facial Treatment', 'Premium facial treatment with deep cleansing and moisturizing.', 'Facial skincare', 95.00, 75, (SELECT id FROM categories WHERE slug = 'beauty-wellness'), '550e8400-e29b-41d4-a716-446655440011', 'appointment', 'fixed', 'active', true, true),
(uuid_generate_v4(), 'House Cleaning Service', 'Professional residential cleaning service for all rooms.', 'Complete house cleaning', 150.00, 180, (SELECT id FROM categories WHERE slug = 'home-services'), '550e8400-e29b-41d4-a716-446655440013', 'appointment', 'hourly', 'active', true, true),
(uuid_generate_v4(), 'Plumbing Repair', 'Expert plumbing services for repairs and maintenance.', 'Plumbing repair services', 95.00, 120, (SELECT id FROM categories WHERE slug = 'home-services'), '550e8400-e29b-41d4-a716-446655440014', 'appointment', 'hourly', 'active', true, false),
(uuid_generate_v4(), 'Electrical Installation', 'Licensed electrician services for home electrical work.', 'Electrical repair/install', 110.00, 90, (SELECT id FROM categories WHERE slug = 'home-services'), '550e8400-e29b-41d4-a716-446655440014', 'appointment', 'hourly', 'active', true, true);

-- Show results
SELECT s.name, s."basePrice", s."durationMinutes", c.name as category, p."businessName" as provider
FROM services s 
JOIN categories c ON s."categoryId" = c.id 
JOIN providers p ON s."providerId" = p.id
ORDER BY c.name, s.name;
