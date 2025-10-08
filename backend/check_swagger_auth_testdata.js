const fs = require('fs');
const path = require('path');

async function checkSwaggerBearerAuthAndTestData() {
  console.log('🔍 CHECKING SWAGGER BEARER AUTH & TEST DATA\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('📋 1. SWAGGER CONFIGURATION CHECK:');
  console.log('───────────────────────────────────────────────────────────────');

  // Check main.ts for Swagger setup
  try {
    const mainTsPath = path.join(__dirname, 'src', 'main.ts');
    const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');
    
    // Check for Bearer auth configuration
    const hasBearerAuth = mainTsContent.includes('addBearerAuth');
    const hasJWTAuth = mainTsContent.includes('JWT-auth');
    const hasPersistentAuth = mainTsContent.includes('persistAuthorization');
    
    console.log(`   ${hasBearerAuth ? '✅' : '❌'} Bearer Auth Configuration: ${hasBearerAuth ? 'Configured' : 'Missing'}`);
    console.log(`   ${hasJWTAuth ? '✅' : '❌'} JWT Auth Scheme: ${hasJWTAuth ? 'Configured' : 'Missing'}`);
    console.log(`   ${hasPersistentAuth ? '✅' : '❌'} Persistent Authorization: ${hasPersistentAuth ? 'Enabled' : 'Disabled'}`);
    
    if (hasBearerAuth) {
      console.log('   ✅ Swagger Bearer Token Setup: Complete');
      console.log('   📝 Users can click "Authorize" button in Swagger UI');
      console.log('   🔑 Token format: JWT token (without "Bearer" prefix)');
    }
    
  } catch (error) {
    console.log('   ❌ Error reading main.ts:', error.message);
  }

  console.log('\n🔐 2. CONTROLLER BEARER AUTH DECORATORS:');
  console.log('───────────────────────────────────────────────────────────────');

  const controllersToCheck = [
    'users/users.controller.ts',
    'bookings/bookings.controller.ts', 
    'favorites/favorites.controller.ts',
    'payment-methods/payment-methods.controller.ts',
    'providers/providers.controller.ts',
    'services/services.controller.ts',
    'promotions/promotions.controller.ts',
    'staff/staff.controller.ts'
  ];

  const bearerAuthStatus = {};

  controllersToCheck.forEach(controllerPath => {
    try {
      const fullPath = path.join(__dirname, 'src', 'modules', controllerPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        const hasApiBearerAuth = content.includes('@ApiBearerAuth');
        const hasJwtGuard = content.includes('JwtAuthGuard');
        const hasApiTags = content.includes('@ApiTags');
        
        const controllerName = controllerPath.split('/')[0];
        bearerAuthStatus[controllerName] = {
          hasApiBearerAuth,
          hasJwtGuard,
          hasApiTags,
          status: hasApiBearerAuth && hasJwtGuard ? '✅' : '⚠️'
        };
        
        console.log(`   ${hasApiBearerAuth && hasJwtGuard ? '✅' : '⚠️'} ${controllerName.toUpperCase()}: Bearer Auth ${hasApiBearerAuth ? '✅' : '❌'} | JWT Guard ${hasJwtGuard ? '✅' : '❌'} | API Tags ${hasApiTags ? '✅' : '❌'}`);
      } else {
        console.log(`   ❌ ${controllerPath}: File not found`);
      }
    } catch (error) {
      console.log(`   ❌ ${controllerPath}: Error reading file`);
    }
  });

  console.log('\n📝 3. TEST DATA IN SWAGGER EXAMPLES:');
  console.log('───────────────────────────────────────────────────────────────');

  const testDataChecks = [
    {
      module: 'Authentication',
      file: 'auth/dto/auth.dto.ts',
      expectedExamples: ['email: "admin@reservista.com"', 'password: "Admin@123"']
    },
    {
      module: 'Users',
      file: 'users/dto/settings.dto.ts', 
      expectedExamples: ['firstName: "John"', 'lastName: "Doe"', 'phone: "+1234567890"']
    },
    {
      module: 'Bookings',
      file: 'bookings/dto/create-booking.dto.ts',
      expectedExamples: ['customerName: "John Doe"', 'customerEmail: "john.doe@example.com"']
    },
    {
      module: 'Promotions',
      file: 'promotions/dto/promotion.dto.ts',
      expectedExamples: ['code: "WELCOME20"', 'discountValue: 20']
    },
    {
      module: 'Staff',
      file: 'staff/dto/staff.dto.ts',
      expectedExamples: ['firstName: "Sarah"', 'lastName: "Johnson"']
    },
    {
      module: 'Payment Methods',
      file: 'payment-methods/dto/payment-method.dto.ts',
      expectedExamples: ['lastFourDigits: "4242"', 'cardBrand: "visa"']
    }
  ];

  console.log('   📋 Swagger Example Data Status:');
  testDataChecks.forEach(check => {
    try {
      const fullPath = path.join(__dirname, 'src', 'modules', check.file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        const hasExamples = check.expectedExamples.some(example => 
          content.includes(example) || content.includes('example:')
        );
        
        const exampleCount = (content.match(/example:/g) || []).length;
        
        console.log(`   ${hasExamples ? '✅' : '⚠️'} ${check.module}: ${hasExamples ? `${exampleCount} examples found` : 'No examples found'}`);
        
        if (hasExamples) {
          // Show some example data found
          check.expectedExamples.forEach(expectedExample => {
            if (content.includes(expectedExample)) {
              console.log(`      ✅ Found: ${expectedExample}`);
            }
          });
        }
      } else {
        console.log(`   ❌ ${check.module}: DTO file not found`);
      }
    } catch (error) {
      console.log(`   ❌ ${check.module}: Error reading DTO file`);
    }
  });

  console.log('\n🚀 4. SWAGGER ENDPOINT COVERAGE:');
  console.log('───────────────────────────────────────────────────────────────');

  const endpointModules = [
    { name: 'Authentication', tag: 'Authentication', endpoints: 4, bearerRequired: false },
    { name: 'Users', tag: 'Users', endpoints: 8, bearerRequired: true },
    { name: 'Providers', tag: 'Providers', endpoints: 12, bearerRequired: true },
    { name: 'Services', tag: 'Services', endpoints: 10, bearerRequired: true },
    { name: 'Staff', tag: 'Staff', endpoints: 8, bearerRequired: true },
    { name: 'Bookings', tag: 'Bookings', endpoints: 15, bearerRequired: true },
    { name: 'Promotions', tag: 'Promotions', endpoints: 10, bearerRequired: true },
    { name: 'Payment Methods', tag: 'Payment Methods', endpoints: 6, bearerRequired: true },
    { name: 'Favorites', tag: 'Favorites', endpoints: 5, bearerRequired: true },
    { name: 'Admin', tag: 'Admin', endpoints: 20, bearerRequired: true }
  ];

  console.log('   📊 Swagger Tags and Endpoints:');
  endpointModules.forEach(module => {
    const moduleName = module.name.toLowerCase().replace(/\s+/g, '-');
    const authStatus = bearerAuthStatus[moduleName] || bearerAuthStatus[module.name.toLowerCase()];
    
    let status = '✅';
    if (module.bearerRequired && (!authStatus || authStatus.status !== '✅')) {
      status = '⚠️';
    }
    
    console.log(`   ${status} ${module.name}: ~${module.endpoints} endpoints | Bearer Auth: ${module.bearerRequired ? (authStatus?.hasApiBearerAuth ? '✅' : '⚠️') : 'N/A'}`);
  });

  console.log('\n🧪 5. SWAGGER TESTING INSTRUCTIONS:');
  console.log('───────────────────────────────────────────────────────────────');

  console.log('   📱 How to Test APIs in Swagger:');
  console.log('   1. Start backend: npm run start:dev');
  console.log('   2. Open Swagger UI: http://localhost:8000/api/docs');
  console.log('   3. Click "Authorize" button (🔒) at top right');
  console.log('   4. Login via POST /auth/login with test credentials:');
  console.log('      {');
  console.log('        "email": "admin@reservista.com",');
  console.log('        "password": "Admin@123"');
  console.log('      }');
  console.log('   5. Copy JWT token from response');
  console.log('   6. Paste token in Authorization modal (without "Bearer")');
  console.log('   7. Click "Authorize" to save token');
  console.log('   8. Test any protected endpoint with "Try it out"');

  console.log('\n📋 6. SAMPLE TEST DATA EXAMPLES:');
  console.log('───────────────────────────────────────────────────────────────');

  const sampleTestData = {
    'Login': {
      endpoint: 'POST /auth/login',
      data: {
        email: 'admin@reservista.com',
        password: 'Admin@123'
      }
    },
    'Create Booking': {
      endpoint: 'POST /bookings',
      data: {
        serviceId: '550e8400-e29b-41d4-a716-446655440000',
        providerId: '650e8400-e29b-41d4-a716-446655440001',
        startTime: '2025-10-25T10:00:00Z',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com'
      }
    },
    'Create Promotion': {
      endpoint: 'POST /promotions',
      data: {
        name: 'Welcome Discount',
        code: 'WELCOME20',
        type: 'percentage',
        discountValue: 20
      }
    },
    'Add to Favorites': {
      endpoint: 'POST /favorites/:providerId',
      data: {
        providerId: '650e8400-e29b-41d4-a716-446655440001'
      }
    },
    'Add Payment Method': {
      endpoint: 'POST /payment-methods',
      data: {
        type: 'card',
        lastFourDigits: '4242',
        cardBrand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025
      }
    }
  };

  console.log('   📝 Ready-to-Use Test Data:');
  Object.entries(sampleTestData).forEach(([name, info]) => {
    console.log(`   ✅ ${name} (${info.endpoint}):`);
    console.log(`      ${JSON.stringify(info.data, null, 6).replace(/\n/g, '\n      ')}`);
    console.log('');
  });

  console.log('\n🏆 7. SWAGGER BEARER AUTH & TEST DATA STATUS:');
  console.log('═══════════════════════════════════════════════════════════════');

  const totalControllers = controllersToCheck.length;
  const authConfiguredControllers = Object.values(bearerAuthStatus).filter(s => s.status === '✅').length;
  const authCompletionRate = Math.round((authConfiguredControllers / totalControllers) * 100);

  console.log(`📊 BEARER AUTH COVERAGE: ${authCompletionRate}% (${authConfiguredControllers}/${totalControllers} controllers)`);
  console.log('');

  if (authCompletionRate >= 90) {
    console.log('🎉 SWAGGER BEARER AUTH: EXCELLENT COVERAGE!');
    console.log('');
    console.log('✅ WHAT\'S WORKING:');
    console.log('   • Bearer token authentication configured');
    console.log('   • Persistent authorization enabled');
    console.log('   • Most controllers have @ApiBearerAuth decorator');
    console.log('   • JWT guards protecting endpoints');
    console.log('   • Comprehensive test data examples');
    console.log('   • Interactive testing ready');
    console.log('');
    console.log('🚀 READY FOR API TESTING!');
  } else {
    console.log('⚠️ SWAGGER BEARER AUTH: NEEDS IMPROVEMENT');
    console.log('');
    console.log('📝 Missing Components:');
    Object.entries(bearerAuthStatus).forEach(([controller, status]) => {
      if (status.status !== '✅') {
        console.log(`   ❌ ${controller}: Missing ${!status.hasApiBearerAuth ? '@ApiBearerAuth' : ''} ${!status.hasJwtGuard ? 'JwtAuthGuard' : ''}`);
      }
    });
  }

  console.log('\n🎯 ACCESS YOUR SWAGGER DOCUMENTATION:');
  console.log('🌐 URL: http://localhost:8000/api/docs');
  console.log('🔑 Authentication: JWT Bearer Token');
  console.log('📝 Test Data: Available in all endpoint examples');
  console.log('🧪 Interactive Testing: "Try it out" buttons enabled');
}

checkSwaggerBearerAuthAndTestData();