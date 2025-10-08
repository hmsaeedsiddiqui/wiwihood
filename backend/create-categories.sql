-- Create two categories in the database
-- Category 1: Beauty & Wellness
INSERT INTO categories (
    id,
    name,
    description,
    slug,
    icon,
    "sortOrder",
    "isActive",
    "isFeatured",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'Beauty & Wellness',
    'Professional beauty and wellness services including hair styling, spa treatments, massage therapy, skincare, and personal grooming services.',
    'beauty-wellness',
    'fa-solid fa-spa',
    1,
    true,
    true,
    'Beauty & Wellness Services',
    'Book professional beauty and wellness services near you. Hair, spa, massage, skincare and more.',
    'beauty, wellness, spa, hair, massage, skincare, salon',
    NOW(),
    NOW()
);

-- Category 2: Home Services  
INSERT INTO categories (
    id,
    name,
    description,
    slug,
    icon,
    "sortOrder",
    "isActive",
    "isFeatured",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'Home Services',
    'Professional home maintenance and improvement services including cleaning, plumbing, electrical work, landscaping, and general repairs.',
    'home-services',
    'fa-solid fa-home',
    2,
    true,
    true,
    'Home Services & Maintenance',
    'Find reliable home service professionals for cleaning, repairs, maintenance and improvement projects.',
    'home services, cleaning, plumbing, electrical, repairs, maintenance',
    NOW(),
    NOW()
);

-- Check if the categories were created successfully
SELECT id, name, slug, "isActive", "isFeatured", "createdAt" FROM categories ORDER BY "sortOrder";
