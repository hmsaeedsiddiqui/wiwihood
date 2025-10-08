-- First, let's check the categories
SELECT id, name, slug FROM categories;

-- Create some sample providers first (since services need providers)
INSERT INTO providers (
    id,
    businessName,
    businessDescription,
    businessAddress,
    businessPhone,
    businessEmail,
    website,
    providerType,
    status,
    isVerified,
    averageRating,
    totalReviews,
    totalBookings,
    createdAt,
    updatedAt
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Glamour Beauty Salon',
    'Premium beauty salon offering hair, nail, and skincare services with experienced professionals.',
    '123 Beauty Street, Downtown, City',
    '+1-555-0101',
    'info@glamourbeauty.com',
    'https://glamourbeauty.com',
    'INDIVIDUAL',
    'ACTIVE',
    true,
    4.8,
    156,
    342,
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Zen Spa & Wellness',
    'Relaxing spa and wellness center specializing in therapeutic massages and holistic treatments.',
    '456 Wellness Ave, Spa District, City',
    '+1-555-0102',
    'contact@zenspa.com',
    'https://zenspa.com',
    'BUSINESS',
    'ACTIVE',
    true,
    4.9,
    203,
    478,
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'CleanPro Home Services',
    'Professional home cleaning services with eco-friendly products and reliable staff.',
    '789 Service Road, Residential Area, City',
    '+1-555-0103',
    'hello@cleanpro.com',
    'https://cleanpro.com',
    'BUSINESS',
    'ACTIVE',
    true,
    4.7,
    128,
    298,
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'FixIt Handyman Services',
    'Reliable handyman services for plumbing, electrical, and general home repairs.',
    '321 Repair Street, Service Center, City',
    '+1-555-0104',
    'support@fixit.com',
    'https://fixit.com',
    'INDIVIDUAL',
    'ACTIVE',
    true,
    4.6,
    89,
    167,
    NOW(),
    NOW()
);

-- Insert 6 sample services
INSERT INTO services (
    id,
    name,
    description,
    basePrice,
    duration,
    categoryId,
    providerId,
    serviceType,
    pricingType,
    status,
    isActive,
    isFeatured,
    createdAt,
    updatedAt
) VALUES 
-- Beauty & Wellness Services
(
    gen_random_uuid(),
    'Professional Hair Styling',
    'Transform your look with our professional hair styling services. Includes consultation, wash, cut, style, and finishing touches.',
    85.00,
    90,
    (SELECT id FROM categories WHERE slug = 'beauty-wellness'),
    '550e8400-e29b-41d4-a716-446655440001', -- Glamour Beauty Salon
    'IN_PERSON',
    'FIXED',
    'ACTIVE',
    true,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Relaxing Spa Massage',
    'Unwind with our signature 60-minute full body massage. Perfect for stress relief and muscle tension.',
    120.00,
    60,
    (SELECT id FROM categories WHERE slug = 'beauty-wellness'),
    '550e8400-e29b-41d4-a716-446655440002', -- Zen Spa & Wellness
    'IN_PERSON',
    'FIXED',
    'ACTIVE',
    true,
    false,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Facial Treatment & Skincare',
    'Rejuvenate your skin with our premium facial treatment including deep cleansing, exfoliation, and moisturizing.',
    95.00,
    75,
    (SELECT id FROM categories WHERE slug = 'beauty-wellness'),
    '550e8400-e29b-41d4-a716-446655440001', -- Glamour Beauty Salon
    'IN_PERSON',
    'FIXED',
    'ACTIVE',
    true,
    true,
    NOW(),
    NOW()
),
-- Home Services
(
    gen_random_uuid(),
    'House Cleaning Service',
    'Professional residential cleaning service including all rooms, kitchen, bathrooms, and common areas.',
    150.00,
    180,
    (SELECT id FROM categories WHERE slug = 'home-services'),
    '550e8400-e29b-41d4-a716-446655440003', -- CleanPro Home Services
    'IN_PERSON',
    'HOURLY',
    'ACTIVE',
    true,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Plumbing Repair & Maintenance',
    'Expert plumbing services for repairs, installations, and maintenance. Available for emergency calls.',
    95.00,
    120,
    (SELECT id FROM categories WHERE slug = 'home-services'),
    '550e8400-e29b-41d4-a716-446655440004', -- FixIt Handyman Services
    'IN_PERSON',
    'HOURLY',
    'ACTIVE',
    true,
    false,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Electrical Installation & Repair',
    'Licensed electrician services for home electrical work, installations, troubleshooting, and safety inspections.',
    110.00,
    90,
    (SELECT id FROM categories WHERE slug = 'home-services'),
    '550e8400-e29b-41d4-a716-446655440004', -- FixIt Handyman Services
    'IN_PERSON',
    'HOURLY',
    'ACTIVE',
    true,
    true,
    NOW(),
    NOW()
);

-- Verify the services were created
SELECT s.name, s.basePrice, s.duration, c.name as category_name 
FROM services s 
JOIN categories c ON s.categoryId = c.id 
ORDER BY c.name, s.name;
