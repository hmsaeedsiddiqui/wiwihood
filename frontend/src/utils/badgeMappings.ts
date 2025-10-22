// Central badge configuration for all components
export const BADGE_MAPPINGS = {
  // Popular This Week section - shows popular/trending services
  POPULAR_THIS_WEEK: [
    'popular',
    'premium', 
    'top rated',
    'top-rated',
    'best seller',
    'best-seller',
    'trending',
    'most popular'
  ],
  
  // Promotions/Deals section - shows discounted/deal services  
  DEALS_PROMOTIONS: [
    'deal',
    'hot deal',
    'hot',
    'limited',
    'limited time',
    'offer',
    'discount',
    'sale',
    'special offer',
    'promo',
    'promotion'
  ],
  
  // New on Platform section - shows newly added services
  NEW_ON_PLATFORM: [
    'new',
    'new on vividhood', 
    'new on wiwihood',
    'new on',
    'recently added',
    'latest',
    'fresh'
  ],
  
  // Top Rated section - shows highest rated services
  TOP_RATED: [
    'top',
    'top rated',
    'top-rated',
    'highest rated',
    'best rated',
    '5 star',
    'excellent'
  ],
  
  // Our Choice section - shows curated/recommended services
  OUR_CHOICE: [
    'choice',
    'our choice',
    'featured',
    'recommended',
    'curated',
    'handpicked',
    'staff pick',
    'editor choice'
  ]
};

// Helper function to check if a badge matches a category
export const matchesBadgeCategory = (adminBadge: string, category: keyof typeof BADGE_MAPPINGS): boolean => {
  if (!adminBadge) return false;
  
  const normalizedBadge = adminBadge.toString().toLowerCase().trim();
  const categoryBadges = BADGE_MAPPINGS[category];
  
  return categoryBadges.some(badge => 
    normalizedBadge === badge || normalizedBadge.includes(badge)
  );
};

// Get display name for badge category
export const getBadgeCategoryDisplayName = (category: keyof typeof BADGE_MAPPINGS): string => {
  const displayNames = {
    POPULAR_THIS_WEEK: 'Popular This Week',
    DEALS_PROMOTIONS: 'Special Deals & Promotions', 
    NEW_ON_PLATFORM: 'New on Wiwihood',
    TOP_RATED: 'Top-rated Businesses',
    OUR_CHOICE: 'Our Choice for you'
  };
  
  return displayNames[category] || category;
};