SELECT 
    id, 
    name, 
    slug, 
    description, 
    "isActive", 
    "isFeatured",
    "sortOrder"
FROM categories 
ORDER BY "sortOrder";
