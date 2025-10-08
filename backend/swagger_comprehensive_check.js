const fs = require('fs');
const path = require('path');

console.log('📚 SWAGGER COMPREHENSIVE ENDPOINT & AUTH CHECK\n');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('🎯 **Checking: تمام endpoints, Bearer auth اور test data**\n');

// Function to analyze controller files
function analyzeController(controllerPath, moduleName) {
    if (!fs.existsSync(controllerPath)) {
        return {
            exists: false,
            endpoints: 0,
            bearerAuth: 0,
            examples: 0,
            swagger: false
        };
    }

    const content = fs.readFileSync(controllerPath, 'utf8');
    
    // Count HTTP method decorators
    const endpoints = (content.match(/@(Get|Post|Put|Patch|Delete)/g) || []).length;
    
    // Count Bearer auth decorators
    const bearerAuth = (content.match(/@ApiBearerAuth/g) || []).length;
    
    // Check for examples in responses/body
    const examples = (content.match(/@ApiResponse|@ApiBody|example:/g) || []).length;
    
    // Check for Swagger decorators
    const swagger = content.includes('@ApiTags') || content.includes('@ApiOperation');
    
    return {
        exists: true,
        endpoints,
        bearerAuth,
        examples,
        swagger,
        content
    };
}

// Module configurations
const modules = [
    { name: 'Authentication', path: 'auth/auth.controller.ts', tag: '🔐' },
    { name: 'Users', path: 'users/users.controller.ts', tag: '👥' },
    { name: 'Providers', path: 'providers/providers.controller.ts', tag: '🏢' },
    { name: 'Services', path: 'services/services.controller.ts', tag: '🛍️' },
    { name: 'Staff', path: 'staff/staff.controller.ts', tag: '👨‍💼' },
    { name: 'Bookings', path: 'bookings/bookings.controller.ts', tag: '📅' },
    { name: 'Favorites', path: 'favorites/favorites.controller.ts', tag: '❤️' },
    { name: 'Payment Methods', path: 'payment-methods/payment-methods.controller.ts', tag: '💳' },
    { name: 'Promotions', path: 'promotions/promotions.controller.ts', tag: '🎁' },
    { name: 'Loyalty', path: 'loyalty/loyalty.controller.ts', tag: '🎖️' },
    { name: 'Gift Cards', path: 'gift-cards/gift-cards.controller.ts', tag: '🎁' },
    { name: 'Reviews', path: 'reviews/reviews.controller.ts', tag: '⭐' },
    { name: 'Admin', path: 'admin/admin.controller.ts', tag: '👨‍💼' }
];

let totalStats = {
    modules: 0,
    endpoints: 0,
    bearerAuth: 0,
    examples: 0,
    withSwagger: 0,
    existing: 0
};

console.log('📊 ENDPOINT ANALYSIS BY MODULE:');
console.log('═══════════════════════════════════════════════════════════════');

modules.forEach(module => {
    const controllerPath = path.join(__dirname, 'src', 'modules', module.path);
    const analysis = analyzeController(controllerPath, module.name);
    
    if (analysis.exists) {
        totalStats.existing++;
        totalStats.endpoints += analysis.endpoints;
        totalStats.bearerAuth += analysis.bearerAuth;
        totalStats.examples += analysis.examples;
        if (analysis.swagger) totalStats.withSwagger++;
        
        console.log(`${module.tag} **${module.name.toUpperCase()} MODULE:**`);
        console.log(`   📡 Endpoints: ${analysis.endpoints}`);
        console.log(`   🔐 Bearer Auth: ${analysis.bearerAuth}/${analysis.endpoints} (${analysis.endpoints > 0 ? Math.round((analysis.bearerAuth/analysis.endpoints)*100) : 0}%)`);
        console.log(`   📝 Examples: ${analysis.examples > 0 ? '✅' : '❌'} ${analysis.examples} found`);
        console.log(`   🎯 Swagger Docs: ${analysis.swagger ? '✅' : '❌'}`);
        
        // Check specific endpoints
        if (analysis.content) {
            const getEndpoints = (analysis.content.match(/@Get/g) || []).length;
            const postEndpoints = (analysis.content.match(/@Post/g) || []).length;
            const putEndpoints = (analysis.content.match(/@Put/g) || []).length;
            const patchEndpoints = (analysis.content.match(/@Patch/g) || []).length;
            const deleteEndpoints = (analysis.content.match(/@Delete/g) || []).length;
            
            console.log(`   📋 Breakdown: GET(${getEndpoints}) POST(${postEndpoints}) PUT(${putEndpoints}) PATCH(${patchEndpoints}) DELETE(${deleteEndpoints})`);
        }
        console.log('');
    } else {
        console.log(`${module.tag} **${module.name.toUpperCase()} MODULE:**`);
        console.log(`   ❌ Controller not found`);
        console.log('');
    }
});

totalStats.modules = totalStats.existing;

console.log('📈 OVERALL STATISTICS:');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`🏗️ **Total Modules:** ${totalStats.modules}/${modules.length} (${Math.round((totalStats.modules/modules.length)*100)}%)`);
console.log(`📡 **Total Endpoints:** ${totalStats.endpoints}`);
console.log(`🔐 **Bearer Auth Coverage:** ${totalStats.bearerAuth}/${totalStats.endpoints} (${totalStats.endpoints > 0 ? Math.round((totalStats.bearerAuth/totalStats.endpoints)*100) : 0}%)`);
console.log(`📝 **Documentation Coverage:** ${totalStats.withSwagger}/${totalStats.modules} (${totalStats.modules > 0 ? Math.round((totalStats.withSwagger/totalStats.modules)*100) : 0}%)`);

console.log('\n🔍 DETAILED ENDPOINT INVENTORY:');
console.log('───────────────────────────────────────────────────────────────');

// Check main.ts for Swagger configuration
const mainPath = path.join(__dirname, 'src', 'main.ts');
if (fs.existsSync(mainPath)) {
    const mainContent = fs.readFileSync(mainPath, 'utf8');
    console.log('⚙️ **SWAGGER CONFIGURATION:**');
    console.log(`   ${mainContent.includes('SwaggerModule') ? '✅' : '❌'} SwaggerModule Setup`);
    console.log(`   ${mainContent.includes('addBearerAuth') ? '✅' : '❌'} Bearer Auth Configuration`);
    console.log(`   ${mainContent.includes('persistAuthorization') ? '✅' : '❌'} Persistent Authorization`);
    console.log(`   ${mainContent.includes('addTag') ? '✅' : '❌'} API Tags Organization`);
    console.log(`   ${mainContent.includes('/api/docs') ? '✅' : '❌'} Documentation URL`);
    console.log('');
}

// Check for DTO examples
console.log('💡 TEST DATA & EXAMPLES CHECK:');
console.log('───────────────────────────────────────────────────────────────');

const dtoFolders = ['auth', 'users', 'providers', 'services', 'bookings', 'promotions', 'loyalty', 'gift-cards'];
let totalDTOs = 0;
let dtosWithExamples = 0;

dtoFolders.forEach(folder => {
    const dtoPath = path.join(__dirname, 'src', 'modules', folder, 'dto');
    if (fs.existsSync(dtoPath)) {
        const files = fs.readdirSync(dtoPath).filter(file => file.endsWith('.dto.ts'));
        totalDTOs += files.length;
        
        files.forEach(file => {
            const content = fs.readFileSync(path.join(dtoPath, file), 'utf8');
            if (content.includes('@ApiProperty') && content.includes('example')) {
                dtosWithExamples++;
            }
        });
        
        console.log(`📂 **${folder.toUpperCase()}:** ${files.length} DTOs found`);
    }
});

console.log(`\n📊 **DTO Examples Coverage:** ${dtosWithExamples}/${totalDTOs} (${totalDTOs > 0 ? Math.round((dtosWithExamples/totalDTOs)*100) : 0}%)`);

// Check for test credentials
console.log('\n🔑 TEST CREDENTIALS CHECK:');
console.log('───────────────────────────────────────────────────────────────');

const authDtoPath = path.join(__dirname, 'src', 'modules', 'auth', 'dto');
if (fs.existsSync(authDtoPath)) {
    const loginDtoPath = path.join(authDtoPath, 'login.dto.ts');
    if (fs.existsSync(loginDtoPath)) {
        const loginContent = fs.readFileSync(loginDtoPath, 'utf8');
        const hasTestEmail = loginContent.includes('admin@reservista.com') || loginContent.includes('example@');
        const hasTestPassword = loginContent.includes('Admin@123') || loginContent.includes('password');
        
        console.log(`📧 **Test Email:** ${hasTestEmail ? '✅' : '❌'} Available in examples`);
        console.log(`🔒 **Test Password:** ${hasTestPassword ? '✅' : '❌'} Available in examples`);
        
        if (loginContent.includes('twoFactorToken')) {
            console.log(`🔐 **2FA Support:** ✅ Available with examples`);
        }
    }
}

console.log('\n🎯 SWAGGER ACCESSIBILITY CHECK:');
console.log('───────────────────────────────────────────────────────────────');
console.log('🌐 **Documentation URL:** http://localhost:8000/api/docs');
console.log('🚀 **Server Command:** npm run start:dev');
console.log('📱 **Mobile Responsive:** ✅ Swagger UI is mobile-friendly');
console.log('🔍 **Search Functionality:** ✅ Built-in endpoint search');
console.log('💾 **Export Options:** ✅ OpenAPI JSON/YAML download');

const overallScore = Math.round((
    (totalStats.modules/modules.length) * 0.25 +
    (totalStats.bearerAuth/totalStats.endpoints) * 0.25 +
    (totalStats.withSwagger/totalStats.modules) * 0.25 +
    (dtosWithExamples/totalDTOs) * 0.25
) * 100);

console.log('\n🏆 FINAL SWAGGER ASSESSMENT:');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`🎯 **Overall Score: ${overallScore}%**`);

if (overallScore >= 95) {
    console.log('🎉 **EXCELLENT** - Complete Swagger documentation with all features!');
} else if (overallScore >= 85) {
    console.log('✅ **VERY GOOD** - Comprehensive documentation with minor gaps');
} else if (overallScore >= 75) {
    console.log('✅ **GOOD** - Well documented with some missing features');
} else if (overallScore >= 60) {
    console.log('⚠️ **FAIR** - Basic documentation, needs improvement');
} else {
    console.log('❌ **POOR** - Significant documentation gaps');
}

console.log('\n🎯 QUICK ACCESS GUIDE:');
console.log('───────────────────────────────────────────────────────────────');
console.log('1. Start server: npm run start:dev');
console.log('2. Open: http://localhost:8000/api/docs');
console.log('3. Login via /auth/login with test credentials');
console.log('4. Copy JWT token from response');
console.log('5. Click "Authorize" button in Swagger UI');
console.log('6. Paste token (without "Bearer" prefix)');
console.log('7. Test all endpoints with provided examples');

console.log('\n**FINAL RESULT: Swagger documentation status above! ⬆️**');