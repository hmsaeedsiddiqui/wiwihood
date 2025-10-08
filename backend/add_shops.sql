-- Add more diverse shops (providers) to the database
-- We already have 4 providers, let's add 8 more for a total of 12 shops

-- First, add more users for the new providers
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
('550e8400-e29b-41d4-a716-446655440005', 'Lisa', 'Parker', 'lisa@nailstudio.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'James', 'Thompson', 'james@fitnessstudio.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Anna', 'Martinez', 'anna@yogacenter.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Robert', 'Davis', 'robert@gardencare.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'Emma', 'Wilson', 'emma@petgrooming.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Carlos', 'Garcia', 'carlos@autorepair.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Sophie', 'Brown', 'sophie@bakery.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'Michael', 'Lee', 'michael@techrepair.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'Olivia', 'King', 'olivia@florist.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440018', 'David', 'Nguyen', 'david@musicstudio.com', '$2b$10$hash', 'provider', true, 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Add the new provider shops

INSERT INTO providers (
    id,
    "businessName",
    description,
    address,
    city,
    country,
    "postalCode",
    phone,
    website,
    "providerType",
    status,
    "isVerified",
    "averageRating",
    "totalReviews",
    "totalBookings",
    logo,
    "userId"
) VALUES 
('550e8400-e29b-41d4-a716-446655440021', 'Elite Nail Studio', 'Professional nail salon offering manicures, pedicures, and nail art services', '234 Beauty Boulevard', 'City', 'USA', '12349', '+1-555-0105', 'https://elitenailstudio.com', 'business', 'active', true, 4.7, 89, 234, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655440022', 'PowerFit Gym & Training', 'Modern fitness center with personal training and group classes', '567 Fitness Street', 'City', 'USA', '12350', '+1-555-0106', 'https://powerfitgym.com', 'business', 'active', true, 4.5, 156, 445, 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440006'),
('550e8400-e29b-41d4-a716-446655440023', 'Serenity Yoga Center', 'Peaceful yoga studio offering various yoga styles and meditation classes', '890 Wellness Way', 'City', 'USA', '12351', '+1-555-0107', 'https://serenityyoga.com', 'business', 'active', true, 4.9, 203, 567, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440007'),
('550e8400-e29b-41d4-a716-446655440024', 'GreenThumb Garden Services', 'Professional landscaping and garden maintenance services', '123 Garden Lane', 'City', 'USA', '12352', '+1-555-0108', 'https://greenthumb.com', 'business', 'active', true, 4.6, 78, 189, 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440008'),
('550e8400-e29b-41d4-a716-446655440025', 'Pampered Paws Pet Grooming', 'Complete pet grooming and care services for dogs and cats', '456 Pet Paradise', 'City', 'USA', '12353', '+1-555-0109', 'https://pamperedpaws.com', 'business', 'active', true, 4.8, 134, 323, 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440009'),
('550e8400-e29b-41d4-a716-446655440026', 'QuickFix Auto Repair', 'Reliable automotive repair and maintenance services', '789 Auto Avenue', 'City', 'USA', '12354', '+1-555-0110', 'https://quickfixauto.com', 'business', 'active', true, 4.4, 95, 278, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440027', 'Sweet Dreams Bakery', 'Artisan bakery specializing in custom cakes and fresh pastries', '321 Baker Street', 'City', 'USA', '12355', '+1-555-0111', 'https://sweetdreamsbakery.com', 'business', 'active', true, 4.9, 245, 678, 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440015'),
('550e8400-e29b-41d4-a716-446655440028', 'TechFix Solutions', 'Computer and smartphone repair services with quick turnaround', '654 Tech Plaza', 'City', 'USA', '12356', '+1-555-0112', 'https://techfixsolutions.com', 'individual', 'active', true, 4.7, 167, 445, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440016'),
('550e8400-e29b-41d4-a716-446655440029', 'Bloom Florist', 'Fresh flowers, bouquets, and floral arrangements for all occasions', '789 Flower Road', 'City', 'USA', '12357', '+1-555-0113', 'https://bloomflorist.com', 'business', 'active', true, 4.8, 112, 301, 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440017'),
('550e8400-e29b-41d4-a716-446655440030', 'Harmony Music Studio', 'Music lessons and instrument rentals for all ages', '456 Harmony Ave', 'City', 'USA', '12358', '+1-555-0114', 'https://harmonymusic.com', 'business', 'active', true, 4.6, 98, 210, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400', '550e8400-e29b-41d4-a716-446655440018')
ON CONFLICT (id) DO NOTHING;

-- Show all providers/shops
SELECT 
    "businessName",
    description,
    city,
    phone,
    "providerType",
    "averageRating",
    "totalReviews",
    "totalBookings"
FROM providers 
ORDER BY "businessName";

-- Show count
SELECT COUNT(*) as total_shops FROM providers;
