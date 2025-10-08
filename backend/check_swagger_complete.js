const fs = require('fs');
const path = require('path');

console.log('🔍 SWAGGER DOCUMENTATION - COMPREHENSIVE CHECK\n');
console.log('═══════════════════════════════════════════════════════════════\n');

// Check main.ts for Swagger setup
const mainFile = path.join(__dirname, 'src', 'main.ts');
let swaggerConfig = '';
if (fs.existsSync(mainFile)) {
    swaggerConfig = fs.readFileSync(mainFile, 'utf8');
    console.log('✅ **SWAGGER BASIC SETUP:**');
    console.log('───────────────────────────────────────────────────────────────');
    
    if (swaggerConfig.includes('SwaggerModule')) {
        console.log('✅ SwaggerModule imported and configured');
    } else {
        console.log('❌ SwaggerModule not found');
    }
    
    if (swaggerConfig.includes('Bearer')) {
        console.log('✅ Bearer authentication configured');
    } else {
        console.log('⚠️ Bearer auth may not be configured');
    }
    
    if (swaggerConfig.includes('ApiTags')) {
        console.log('✅ API tags support enabled');
    }
    
    console.log('');
}

// Check all controller files for Swagger decorators
const controllersPath = path.join(__dirname, 'src', 'modules');
let controllerStats = {
    total: 0,
    withSwagger: 0,
    withBearerAuth: 0,
    withApiTags: 0,
    withExamples: 0
};

console.log('🎯 **CONTROLLERS SWAGGER ANALYSIS:**');
console.log('───────────────────────────────────────────────────────────────');

function analyzeController(filePath, moduleName) {
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    controllerStats.total++;
    
    let hasSwagger = false;
    let hasBearerAuth = false;
    let hasApiTags = false;
    let hasExamples = false;
    
    // Check for Swagger decorators
    if (content.includes('@Api')) {
        hasSwagger = true;
        controllerStats.withSwagger++;
    }
    
    if (content.includes('@ApiBearerAuth') || content.includes('Bearer')) {
        hasBearerAuth = true;
        controllerStats.withBearerAuth++;
    }
    
    if (content.includes('@ApiTags')) {
        hasApiTags = true;
        controllerStats.withApiTags++;
    }
    
    if (content.includes('@ApiBody') || content.includes('@ApiResponse') || content.includes('example')) {
        hasExamples = true;
        controllerStats.withExamples++;
    }
    
    console.log(`📂 **${moduleName.toUpperCase()} MODULE:**`);
    console.log(`   ${hasSwagger ? '✅' : '❌'} Swagger Decorators: ${hasSwagger ? 'YES' : 'NO'}`);
    console.log(`   ${hasBearerAuth ? '✅' : '❌'} Bearer Auth: ${hasBearerAuth ? 'YES' : 'NO'}`);
    console.log(`   ${hasApiTags ? '✅' : '❌'} API Tags: ${hasApiTags ? 'YES' : 'NO'}`);
    console.log(`   ${hasExamples ? '✅' : '❌'} Examples/Schemas: ${hasExamples ? 'YES' : 'NO'}`);
    console.log('');
}

// Analyze main modules
const modules = [
    'auth',
    'users', 
    'bookings',
    'services',
    'providers',
    'favorites',
    'payment-methods',
    'promotions',
    'loyalty',
    'gift-cards'
];

modules.forEach(module => {
    const controllerPath = path.join(controllersPath, module, `${module}.controller.ts`);
    analyzeController(controllerPath, module);
});

console.log('📊 **SWAGGER COVERAGE STATISTICS:**');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`📈 Total Controllers: ${controllerStats.total}`);
console.log(`🎯 With Swagger Docs: ${controllerStats.withSwagger}/${controllerStats.total} (${Math.round(controllerStats.withSwagger/controllerStats.total*100)}%)`);
console.log(`🔐 With Bearer Auth: ${controllerStats.withBearerAuth}/${controllerStats.total} (${Math.round(controllerStats.withBearerAuth/controllerStats.total*100)}%)`);
console.log(`🏷️ With API Tags: ${controllerStats.withApiTags}/${controllerStats.total} (${Math.round(controllerStats.withApiTags/controllerStats.total*100)}%)`);
console.log(`📝 With Examples: ${controllerStats.withExamples}/${controllerStats.total} (${Math.round(controllerStats.withExamples/controllerStats.total*100)}%)`);

console.log('\n🔧 **TEST DATA & EXAMPLES CHECK:**');
console.log('───────────────────────────────────────────────────────────────');

// Check for DTO files with examples
const dtoFiles = [];
function findDTOs(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findDTOs(filePath);
        } else if (file.includes('.dto.ts')) {
            dtoFiles.push(filePath);
        }
    });
}

findDTOs(path.join(__dirname, 'src'));

let dtosWithExamples = 0;
dtoFiles.forEach(dtoFile => {
    const content = fs.readFileSync(dtoFile, 'utf8');
    if (content.includes('@ApiProperty') && content.includes('example')) {
        dtosWithExamples++;
    }
});

console.log(`📋 Total DTO Files: ${dtoFiles.length}`);
console.log(`💡 DTOs with Examples: ${dtosWithExamples}/${dtoFiles.length} (${Math.round(dtosWithExamples/dtoFiles.length*100)}%)`);

console.log('\n🎯 **FINAL SWAGGER ASSESSMENT:**');
console.log('═══════════════════════════════════════════════════════════════');

const overallScore = Math.round((
    (controllerStats.withSwagger/controllerStats.total) * 0.3 +
    (controllerStats.withBearerAuth/controllerStats.total) * 0.3 +
    (controllerStats.withApiTags/controllerStats.total) * 0.2 +
    (dtosWithExamples/dtoFiles.length) * 0.2
) * 100);

console.log(`🏆 **Overall Swagger Score: ${overallScore}%**`);

if (overallScore >= 90) {
    console.log('🎉 **EXCELLENT** - Production ready Swagger documentation!');
} else if (overallScore >= 70) {
    console.log('✅ **GOOD** - Swagger is well implemented with minor gaps');
} else if (overallScore >= 50) {
    console.log('⚠️ **NEEDS IMPROVEMENT** - Basic Swagger setup exists');
} else {
    console.log('❌ **POOR** - Swagger documentation needs major work');
}

console.log('\n📋 **RECOMMENDATIONS:**');
if (controllerStats.withBearerAuth < controllerStats.total) {
    console.log('🔐 Add @ApiBearerAuth() to all protected endpoints');
}
if (controllerStats.withApiTags < controllerStats.total) {
    console.log('🏷️ Add @ApiTags() to organize endpoints by modules');
}
if (dtosWithExamples < dtoFiles.length) {
    console.log('💡 Add example values to @ApiProperty decorators in DTOs');
}