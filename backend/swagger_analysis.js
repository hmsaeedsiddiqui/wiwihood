const fs = require('fs');
const path = require('path');

// List of all modules from server logs
const mappedModules = [
  'AppController',
  'PaymentController', 
  'AuthController',
  'UsersController',
  'ProvidersController',
  'BookingsController',
  'ServicesController',
  'CategoriesController',
  'ReviewsController',
  'PayoutsController',
  'NotificationsController',
  'MessagesController',
  'SupportTicketsController',
  'CmsController',
  'AnalyticsController',
  'CalendarController',
  'SystemSettingsController',
  'CartController',
  'FavoritesController',
  'PaymentMethodsController',
  'UploadController',
  'ContactController',
  'AdminController',
  'StripeController',
  'MapsController',
  'SmsController',
  'I18nController',
  'GiftCardsController',
  'LoyaltyController',
  'ReferralsController',
  'ServiceAddonsController',
  'RecurringBookingsController',
  'PromotionsController',
  'StaffController'
];

console.log('📊 SWAGGER API ANALYSIS REPORT');
console.log('================================\n');

console.log('✅ MAPPED MODULES FROM SERVER LOGS:');
console.log('====================================');
mappedModules.forEach((module, index) => {
  console.log(`${index + 1}. ${module}`);
});

console.log(`\n📈 Total Controllers: ${mappedModules.length}`);

// Check for missing Commission module
const missingModules = [];
if (!mappedModules.includes('CommissionController')) {
  missingModules.push('CommissionController');
}

console.log('\n⚠️  ANALYSIS FINDINGS:');
console.log('=======================');

if (missingModules.length > 0) {
  console.log('❌ Missing from routes mapping:');
  missingModules.forEach(module => {
    console.log(`   - ${module}`);
  });
} else {
  console.log('✅ All expected controllers found in route mapping');
}

// Now check each module for Swagger decorators
const modulePaths = [
  'src/modules/auth/auth.controller.ts',
  'src/modules/users/users.controller.ts',
  'src/modules/providers/providers.controller.ts',
  'src/modules/bookings/bookings.controller.ts',
  'src/modules/services/services.controller.ts',
  'src/modules/categories/categories.controller.ts',
  'src/modules/reviews/reviews.controller.ts',
  'src/modules/payouts/payouts.controller.ts',
  'src/modules/notifications/notifications.controller.ts',
  'src/modules/messages/messages.controller.ts',
  'src/modules/support-tickets/support-tickets.controller.ts',
  'src/modules/cms/cms.controller.ts',
  'src/modules/analytics/analytics.controller.ts',
  'src/modules/calendar/calendar.controller.ts',
  'src/modules/system-settings/system-settings.controller.ts',
  'src/modules/cart/cart.controller.ts',
  'src/modules/favorites/favorites.controller.ts',
  'src/modules/payment-methods/payment-methods.controller.ts',
  'src/modules/upload/upload.controller.ts',
  'src/modules/contact/contact.controller.ts',
  'src/modules/admin/admin.controller.ts',
  'src/modules/stripe/stripe.controller.ts',
  'src/modules/maps/maps.controller.ts',
  'src/modules/sms/sms.controller.ts',
  'src/modules/i18n/i18n.controller.ts',
  'src/modules/gift-cards/gift-cards.controller.ts',
  'src/modules/loyalty/loyalty.controller.ts',
  'src/modules/referrals/referrals.controller.ts',
  'src/modules/service-addons/service-addons.controller.ts',
  'src/modules/recurring-bookings/recurring-bookings.controller.ts',
  'src/modules/promotions/promotions.controller.ts',
  'src/modules/staff/staff.controller.ts',
  'src/modules/commission/commission.controller.ts'
];

console.log('\n🔍 CHECKING SWAGGER DECORATORS:');
console.log('=================================');

const checkSwaggerDecorators = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { exists: false };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasApiTags = content.includes('@ApiTags(');
    const hasApiOperation = content.includes('@ApiOperation(');
    const hasApiResponse = content.includes('@ApiResponse(');
    const hasApiBearerAuth = content.includes('@ApiBearerAuth(');
    const hasApiParam = content.includes('@ApiParam(');
    const hasApiQuery = content.includes('@ApiQuery(');
    
    return {
      exists: true,
      hasApiTags,
      hasApiOperation,
      hasApiResponse,
      hasApiBearerAuth,
      hasApiParam,
      hasApiQuery,
      score: [hasApiTags, hasApiOperation, hasApiResponse, hasApiBearerAuth].filter(Boolean).length
    };
  } catch (error) {
    return { exists: false, error: error.message };
  }
};

const results = [];
modulePaths.forEach(modulePath => {
  const moduleName = path.basename(modulePath, '.ts');
  const analysis = checkSwaggerDecorators(modulePath);
  results.push({ moduleName, modulePath, ...analysis });
});

// Sort by score (lowest first - these need attention)
results.sort((a, b) => (a.score || 0) - (b.score || 0));

results.forEach(result => {
  if (!result.exists) {
    console.log(`❌ ${result.moduleName}: FILE NOT FOUND`);
    return;
  }
  
  const status = result.score >= 3 ? '✅' : result.score >= 2 ? '⚠️' : '❌';
  console.log(`${status} ${result.moduleName}: Score ${result.score}/4`);
  
  if (result.score < 4) {
    const missing = [];
    if (!result.hasApiTags) missing.push('@ApiTags');
    if (!result.hasApiOperation) missing.push('@ApiOperation');
    if (!result.hasApiResponse) missing.push('@ApiResponse');
    if (!result.hasApiBearerAuth) missing.push('@ApiBearerAuth');
    
    if (missing.length > 0) {
      console.log(`   Missing: ${missing.join(', ')}`);
    }
  }
});

console.log('\n📋 SUMMARY:');
console.log('============');
const excellent = results.filter(r => r.exists && r.score === 4).length;
const good = results.filter(r => r.exists && r.score === 3).length;
const needsWork = results.filter(r => r.exists && r.score < 3).length;
const missing = results.filter(r => !r.exists).length;

console.log(`✅ Excellent (4/4): ${excellent} modules`);
console.log(`⚠️  Good (3/4): ${good} modules`);
console.log(`❌ Needs Work (<3): ${needsWork} modules`);
console.log(`📁 Missing Files: ${missing} modules`);

console.log('\n🎯 PRIORITY ACTIONS:');
console.log('====================');
const priority = results.filter(r => r.exists && r.score < 3);
if (priority.length > 0) {
  console.log('Fix these controllers first:');
  priority.forEach(result => {
    console.log(`- ${result.moduleName} (${result.modulePath})`);
  });
} else {
  console.log('🎉 All existing controllers have good Swagger documentation!');
}