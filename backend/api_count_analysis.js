const fs = require('fs');
const path = require('path');

console.log('🔢 RESERVISTA API COUNT ANALYSIS');
console.log('=================================\n');

// Based on server logs - counting all mapped routes
const apiEndpoints = {
  'AppController': [
    'GET /api/v1',
    'GET /api/v1/health'
  ],
  'PaymentController': [
    'POST /api/v1/api/payment/create-checkout-session'
  ],
  'AuthController': [
    'POST /api/v1/auth/register',
    'POST /api/v1/auth/login',
    'GET /api/v1/auth/profile',
    'POST /api/v1/auth/refresh',
    'POST /api/v1/auth/logout'
  ],
  'UsersController': [
    'POST /api/v1/users',
    'GET /api/v1/users',
    'GET /api/v1/users/me',
    'GET /api/v1/users/:id',
    'PATCH /api/v1/users/me',
    'PATCH /api/v1/users/:id',
    'DELETE /api/v1/users/:id',
    'PUT /api/v1/users/me/password',
    'PUT /api/v1/users/me/profile',
    'GET /api/v1/users/me/notifications',
    'PUT /api/v1/users/me/notifications',
    'PUT /api/v1/users/me/privacy',
    'POST /api/v1/users/me/two-factor/enable',
    'POST /api/v1/users/me/two-factor/disable',
    'DELETE /api/v1/users/me/account'
  ],
  'ProvidersController': [
    'POST /api/v1/providers',
    'GET /api/v1/providers',
    'GET /api/v1/providers/me',
    'GET /api/v1/providers/:id',
    'PATCH /api/v1/providers/me',
    'PATCH /api/v1/providers/:id',
    'DELETE /api/v1/providers/:id',
    'GET /api/v1/providers/me/availability',
    'POST /api/v1/providers/me/availability'
  ],
  'BookingsController': [
    'POST /api/v1/bookings',
    'POST /api/v1/bookings/check-availability',
    'GET /api/v1/bookings',
    'GET /api/v1/bookings/my-bookings',
    'GET /api/v1/bookings/upcoming',
    'GET /api/v1/bookings/:id',
    'PATCH /api/v1/bookings/:id',
    'PATCH /api/v1/bookings/:id/cancel',
    'DELETE /api/v1/bookings/:id',
    'PATCH /api/v1/bookings/:id/reschedule',
    'PATCH /api/v1/bookings/:id/checkin',
    'PATCH /api/v1/bookings/:id/complete',
    'GET /api/v1/bookings/availability/:providerId/:serviceId',
    'GET /api/v1/bookings/stats',
    'GET /api/v1/bookings/calendar/:date'
  ],
  'ServicesController': [
    'POST /api/v1/services/provider/:providerId',
    'GET /api/v1/services',
    'GET /api/v1/services/search',
    'GET /api/v1/services/popular',
    'GET /api/v1/services/provider/:providerId',
    'GET /api/v1/services/category/:categoryId',
    'GET /api/v1/services/:id',
    'PATCH /api/v1/services/:id',
    'PATCH /api/v1/services/:id/toggle-active',
    'DELETE /api/v1/services/:id'
  ],
  'CategoriesController': [
    'POST /api/v1/categories',
    'GET /api/v1/categories',
    'GET /api/v1/categories/featured',
    'GET /api/v1/categories/search',
    'GET /api/v1/categories/slug/:slug',
    'GET /api/v1/categories/:id',
    'PATCH /api/v1/categories/:id',
    'PATCH /api/v1/categories/:id/toggle-active',
    'PATCH /api/v1/categories/:id/toggle-featured',
    'PATCH /api/v1/categories/sort-order',
    'DELETE /api/v1/categories/:id'
  ],
  'ReviewsController': [
    'POST /api/v1/reviews',
    'GET /api/v1/reviews',
    'GET /api/v1/reviews/provider/:providerId',
    'GET /api/v1/reviews/provider/:providerId/stats',
    'GET /api/v1/reviews/my-reviews',
    'GET /api/v1/reviews/:id',
    'PATCH /api/v1/reviews/:id',
    'PATCH /api/v1/reviews/:id/response',
    'PATCH /api/v1/reviews/:id/toggle-published',
    'PATCH /api/v1/reviews/:id/toggle-verified',
    'POST /api/v1/reviews/fix-orphan-reviews',
    'DELETE /api/v1/reviews/:id'
  ],
  'PayoutsController': [
    'GET /api/v1/payouts',
    'GET /api/v1/payouts/:id',
    'POST /api/v1/payouts',
    'PUT /api/v1/payouts/:id',
    'DELETE /api/v1/payouts/:id'
  ],
  'NotificationsController': [
    'GET /api/v1/notifications/test',
    'GET /api/v1/notifications/messages/conversations',
    'GET /api/v1/notifications/messages/:conversationId',
    'POST /api/v1/notifications/messages',
    'GET /api/v1/notifications',
    'GET /api/v1/notifications/unread-count',
    'PATCH /api/v1/notifications/:id/read',
    'PATCH /api/v1/notifications/mark-all-read',
    'POST /api/v1/notifications'
  ],
  'MessagesController': [
    'GET /api/v1/messages/conversations',
    'GET /api/v1/messages/conversations/:conversationId/messages',
    'POST /api/v1/messages/conversations/:conversationId/messages',
    'POST /api/v1/messages/conversations',
    'GET /api/v1/messages/conversations/:conversationId/mark-read'
  ],
  'SupportTicketsController': [
    'GET /api/v1/support-tickets',
    'GET /api/v1/support-tickets/:id',
    'POST /api/v1/support-tickets',
    'PUT /api/v1/support-tickets/:id',
    'DELETE /api/v1/support-tickets/:id'
  ],
  'CmsController': [
    'GET /api/v1/cms',
    'GET /api/v1/cms/:id',
    'GET /api/v1/cms/slug/:slug',
    'POST /api/v1/cms',
    'PUT /api/v1/cms/:id',
    'DELETE /api/v1/cms/:id'
  ],
  'AnalyticsController': [
    'POST /api/v1/analytics',
    'GET /api/v1/analytics',
    'GET /api/v1/analytics/:id'
  ],
  'CalendarController': [
    'POST /api/v1/calendar',
    'GET /api/v1/calendar',
    'GET /api/v1/calendar/:id',
    'GET /api/v1/calendar/bookings/ics',
    'GET /api/v1/calendar/provider/bookings/ics',
    'GET /api/v1/calendar/google/auth-url',
    'GET /api/v1/calendar/google/callback',
    'GET /api/v1/calendar/google/status',
    'GET /api/v1/calendar/google/calendars'
  ],
  'SystemSettingsController': [
    'POST /api/v1/system-settings',
    'GET /api/v1/system-settings',
    'GET /api/v1/system-settings/:id',
    'GET /api/v1/system-settings/key/:key'
  ],
  'CartController': [
    'GET /api/v1/cart',
    'POST /api/v1/cart',
    'PATCH /api/v1/cart/:id',
    'DELETE /api/v1/cart/:id',
    'DELETE /api/v1/cart'
  ],
  'FavoritesController': [
    'GET /api/v1/favorites',
    'GET /api/v1/favorites/services',
    'POST /api/v1/favorites/:providerId',
    'DELETE /api/v1/favorites/:providerId',
    'GET /api/v1/favorites/check/:providerId',
    'DELETE /api/v1/favorites'
  ],
  'PaymentMethodsController': [
    'POST /api/v1/payment-methods',
    'GET /api/v1/payment-methods',
    'GET /api/v1/payment-methods/default',
    'GET /api/v1/payment-methods/:id',
    'PATCH /api/v1/payment-methods/:id',
    'PATCH /api/v1/payment-methods/:id/set-default',
    'DELETE /api/v1/payment-methods/:id'
  ],
  'UploadController': [
    'POST /api/v1/upload/profile-image',
    'POST /api/v1/upload/service-image',
    'POST /api/v1/upload/service',
    'POST /api/v1/upload/shop-logo',
    'POST /api/v1/upload/shop-cover',
    'POST /api/v1/upload/shop',
    'POST /api/v1/upload/upload-from-url',
    'DELETE /api/v1/upload/image/:publicId'
  ],
  'ContactController': [
    'GET /api/v1/contact',
    'GET /api/v1/contact/:id',
    'POST /api/v1/contact',
    'PUT /api/v1/contact/:id/mark-read',
    'PUT /api/v1/contact/:id/reply',
    'DELETE /api/v1/contact/:id'
  ],
  'AdminController': [
    'GET /api/v1/admin/dashboard/stats',
    'GET /api/v1/admin/dashboard/charts',
    'GET /api/v1/admin/dashboard/recent-activity',
    'GET /api/v1/admin/users',
    'GET /api/v1/admin/users/:id',
    'PATCH /api/v1/admin/users/:id/status',
    'DELETE /api/v1/admin/users/:id',
    'GET /api/v1/admin/providers',
    'GET /api/v1/admin/providers/:id',
    'PATCH /api/v1/admin/providers/:id/status',
    'PATCH /api/v1/admin/providers/:id/verify',
    'GET /api/v1/admin/providers/:id/documents',
    'GET /api/v1/admin/bookings',
    'GET /api/v1/admin/bookings/:id',
    'PATCH /api/v1/admin/bookings/:id/status',
    'POST /api/v1/admin/bookings/:id/refund',
    'GET /api/v1/admin/analytics',
    'GET /api/v1/admin/analytics/revenue',
    'GET /api/v1/admin/analytics/categories',
    'GET /api/v1/admin/analytics/top-providers',
    'GET /api/v1/admin/categories',
    'GET /api/v1/admin/categories/:id',
    'POST /api/v1/admin/categories',
    'PUT /api/v1/admin/categories/:id',
    'DELETE /api/v1/admin/categories/:id',
    'PATCH /api/v1/admin/categories/:id/status',
    'GET /api/v1/admin/support-tickets',
    'GET /api/v1/admin/support-tickets/:id',
    'PATCH /api/v1/admin/support-tickets/:id/status',
    'PATCH /api/v1/admin/support-tickets/:id/assign',
    'POST /api/v1/admin/support-tickets/:id/messages',
    'GET /api/v1/admin/settings',
    'PUT /api/v1/admin/settings',
    'GET /api/v1/admin/system/status',
    'POST /api/v1/admin/system/maintenance',
    'POST /api/v1/admin/reports/generate',
    'GET /api/v1/admin/reports',
    'GET /api/v1/admin/reports/:id/download'
  ],
  'StripeController': [
    'POST /api/v1/stripe/payment-intent',
    'POST /api/v1/stripe/customer',
    'POST /api/v1/stripe/subscription',
    'POST /api/v1/stripe/webhook'
  ],
  'MapsController': [
    'POST /api/v1/maps/geocode',
    'GET /api/v1/maps/reverse-geocode',
    'POST /api/v1/maps/search-nearby',
    'POST /api/v1/maps/calculate-distance',
    'GET /api/v1/maps/place/:placeId'
  ],
  'SmsController': [
    'POST /api/v1/sms/send',
    'POST /api/v1/sms/send-bulk',
    'POST /api/v1/sms/booking-confirmation',
    'POST /api/v1/sms/verification-code',
    'GET /api/v1/sms/status/:messageId'
  ],
  'I18nController': [
    'GET /api/v1/i18n/languages',
    'GET /api/v1/i18n/translations',
    'GET /api/v1/i18n/translate',
    'POST /api/v1/i18n/translate'
  ],
  'GiftCardsController': [
    'POST /api/v1/gift-cards',
    'GET /api/v1/gift-cards/my-cards',
    'GET /api/v1/gift-cards/active',
    'POST /api/v1/gift-cards/check-balance',
    'POST /api/v1/gift-cards/redeem',
    'GET /api/v1/gift-cards/:code',
    'GET /api/v1/gift-cards/:code/usage-history',
    'PUT /api/v1/gift-cards/:code/transfer',
    'DELETE /api/v1/gift-cards/:code'
  ],
  'LoyaltyController': [
    'GET /api/v1/loyalty/account',
    'POST /api/v1/loyalty/add-points',
    'POST /api/v1/loyalty/redeem-points',
    'GET /api/v1/loyalty/history',
    'GET /api/v1/loyalty/rewards',
    'GET /api/v1/loyalty/rewards/eligible',
    'POST /api/v1/loyalty/rewards',
    'GET /api/v1/loyalty/rewards/all',
    'PATCH /api/v1/loyalty/rewards/:id',
    'DELETE /api/v1/loyalty/rewards/:id',
    'POST /api/v1/loyalty/review-bonus',
    'POST /api/v1/loyalty/birthday-bonus'
  ],
  'ReferralsController': [
    'GET /api/v1/referrals/my-code',
    'POST /api/v1/referrals',
    'POST /api/v1/referrals/complete',
    'GET /api/v1/referrals/my-referrals',
    'GET /api/v1/referrals/stats',
    'POST /api/v1/referrals/validate/:code',
    'POST /api/v1/referrals/campaigns',
    'GET /api/v1/referrals/campaigns',
    'GET /api/v1/referrals/campaigns/active',
    'PATCH /api/v1/referrals/campaigns/:id',
    'DELETE /api/v1/referrals/campaigns/:id'
  ],
  'ServiceAddonsController': [
    'POST /api/v1/service-addons',
    'GET /api/v1/service-addons/my-addons',
    'PATCH /api/v1/service-addons/:id',
    'DELETE /api/v1/service-addons/:id',
    'GET /api/v1/service-addons/service/:serviceId',
    'GET /api/v1/service-addons/recommendations/:serviceId',
    'GET /api/v1/service-addons/:id',
    'POST /api/v1/service-addons/booking/:bookingId/addons',
    'GET /api/v1/service-addons/booking/:bookingId/addons',
    'DELETE /api/v1/service-addons/booking/:bookingId/addons/:addonId',
    'GET /api/v1/service-addons/booking/:bookingId/total',
    'POST /api/v1/service-addons/packages',
    'GET /api/v1/service-addons/packages/my-packages',
    'GET /api/v1/service-addons/packages/provider/:providerId'
  ],
  'RecurringBookingsController': [
    'POST /api/v1/recurring-bookings',
    'GET /api/v1/recurring-bookings',
    'GET /api/v1/recurring-bookings/:id',
    'PATCH /api/v1/recurring-bookings/:id',
    'PATCH /api/v1/recurring-bookings/:id/pause',
    'PATCH /api/v1/recurring-bookings/:id/resume',
    'DELETE /api/v1/recurring-bookings/:id',
    'POST /api/v1/recurring-bookings/:id/exceptions',
    'GET /api/v1/recurring-bookings/:id/exceptions',
    'GET /api/v1/recurring-bookings/:id/upcoming',
    'GET /api/v1/recurring-bookings/:id/stats'
  ],
  'PromotionsController': [
    'POST /api/v1/promotions',
    'GET /api/v1/promotions',
    'GET /api/v1/promotions/active',
    'GET /api/v1/promotions/featured',
    'POST /api/v1/promotions/validate',
    'GET /api/v1/promotions/code/:code',
    'GET /api/v1/promotions/me',
    'GET /api/v1/promotions/:id',
    'GET /api/v1/promotions/:id/usage',
    'PATCH /api/v1/promotions/:id',
    'DELETE /api/v1/promotions/:id'
  ],
  'StaffController': [
    'POST /api/v1/staff',
    'GET /api/v1/staff',
    'GET /api/v1/staff/provider/:providerId',
    'GET /api/v1/staff/provider/:providerId/available',
    'GET /api/v1/staff/me',
    'GET /api/v1/staff/:id',
    'GET /api/v1/staff/:id/bookings',
    'GET /api/v1/staff/:id/availability',
    'PATCH /api/v1/staff/:id',
    'DELETE /api/v1/staff/:id'
  ]
};

// Commission Controller (will be added after restart)
const commissionEndpoints = [
  'GET /api/v1/commission',
  'GET /api/v1/commission/:id',
  'POST /api/v1/commission',
  'PATCH /api/v1/commission/:id',
  'DELETE /api/v1/commission/:id',
  'GET /api/v1/commission/provider/:providerId',
  'GET /api/v1/commission/analytics',
  'POST /api/v1/commission/payout/:id'
];

// Calculate totals
let totalApis = 0;
let moduleCount = 0;

console.log('📊 API BREAKDOWN BY MODULE:');
console.log('============================\n');

for (const [controller, endpoints] of Object.entries(apiEndpoints)) {
  moduleCount++;
  const count = endpoints.length;
  totalApis += count;
  
  console.log(`${moduleCount.toString().padStart(2, '0')}. ${controller.padEnd(30)} | ${count.toString().padStart(3)} APIs`);
  
  // Show first few endpoints as examples
  if (count > 3) {
    console.log(`    Examples: ${endpoints.slice(0, 3).join(', ')}...`);
  } else {
    console.log(`    All APIs: ${endpoints.join(', ')}`);
  }
  console.log('');
}

console.log('🔢 COMMISSION CONTROLLER (Missing from current server):');
console.log('======================================================');
console.log(`${(moduleCount + 1).toString().padStart(2, '0')}. CommissionController             | ${commissionEndpoints.length.toString().padStart(3)} APIs`);
console.log(`    APIs: ${commissionEndpoints.slice(0, 3).join(', ')}...`);
console.log('');

const totalWithCommission = totalApis + commissionEndpoints.length;

console.log('📈 FINAL COUNT SUMMARY:');
console.log('========================');
console.log(`🎯 Total Active Modules: ${moduleCount}`);
console.log(`🚀 Currently Running APIs: ${totalApis}`);
console.log(`⚠️  Missing Commission APIs: ${commissionEndpoints.length}`);
console.log(`🔥 TOTAL PROJECT APIs: ${totalWithCommission}`);
console.log('');

console.log('📋 API CATEGORIES:');
console.log('===================');
const categories = {
  'Core Business': ['BookingsController', 'ServicesController', 'ProvidersController', 'CategoriesController'],
  'User Management': ['AuthController', 'UsersController', 'AdminController'],
  'Commerce': ['PaymentController', 'StripeController', 'PaymentMethodsController', 'CartController', 'PayoutsController'],
  'Customer Features': ['ReviewsController', 'FavoritesController', 'LoyaltyController', 'GiftCardsController', 'ReferralsController'],
  'Communication': ['NotificationsController', 'MessagesController', 'SmsController'],
  'Content & Support': ['CmsController', 'ContactController', 'SupportTicketsController'],
  'Advanced Features': ['ServiceAddonsController', 'RecurringBookingsController', 'PromotionsController', 'StaffController'],
  'Integrations': ['CalendarController', 'MapsController', 'UploadController', 'I18nController'],
  'System': ['AnalyticsController', 'SystemSettingsController', 'AppController']
};

for (const [category, controllers] of Object.entries(categories)) {
  const categoryApis = controllers.reduce((sum, controller) => {
    return sum + (apiEndpoints[controller]?.length || 0);
  }, 0);
  
  console.log(`${category.padEnd(20)} | ${categoryApis.toString().padStart(3)} APIs`);
}

console.log('');
console.log('🎉 CONCLUSION:');
console.log('===============');
console.log(`This is a MASSIVE enterprise-level API project with ${totalWithCommission} endpoints!`);
console.log(`The project covers all major business requirements for a comprehensive`);
console.log(`service booking and marketplace platform.`);
console.log('');
console.log('🔧 NEXT STEPS:');
console.log('===============');
console.log('1. Fix Commission Controller registration');
console.log('2. Complete Swagger documentation for all endpoints');
console.log('3. Add comprehensive API testing');
console.log('4. Performance optimization for high-load scenarios');