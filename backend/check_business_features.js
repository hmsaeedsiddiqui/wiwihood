const fs = require('fs');
const path = require('path');

console.log('🏢 BUSINESS/PROVIDER FEATURES - COMPREHENSIVE ANALYSIS\n');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('🎯 **CHECKING: Core Features for Businesses**\n');

// Check provider entity and related files
const entityPath = path.join(__dirname, 'src', 'entities');
const modulesPath = path.join(__dirname, 'src', 'modules');

console.log('📋 1. ONBOARDING & PROFILE SETUP ANALYSIS:');
console.log('───────────────────────────────────────────────────────────────');

// Provider Entity Check
const providerEntityPath = path.join(entityPath, 'provider.entity.ts');
if (fs.existsSync(providerEntityPath)) {
    const providerEntity = fs.readFileSync(providerEntityPath, 'utf8');
    console.log('✅ **PROVIDER ENTITY:** Found and analyzing...');
    
    // Business Information Fields
    console.log('\n🏪 **Business Information Fields:**');
    console.log(`   ${providerEntity.includes('businessName') || providerEntity.includes('business_name') ? '✅' : '❌'} Business Name`);
    console.log(`   ${providerEntity.includes('address') ? '✅' : '❌'} Address`);
    console.log(`   ${providerEntity.includes('phone') ? '✅' : '❌'} Phone`);
    console.log(`   ${providerEntity.includes('email') ? '✅' : '❌'} Email`);
    console.log(`   ${providerEntity.includes('description') ? '✅' : '❌'} Description`);
    console.log(`   ${providerEntity.includes('website') ? '✅' : '❌'} Website`);
    
    // Business Hours & Availability
    console.log('\n🕒 **Business Hours & Availability:**');
    console.log(`   ${providerEntity.includes('businessHours') || providerEntity.includes('business_hours') || providerEntity.includes('hours') ? '✅' : '❌'} Business Hours`);
    console.log(`   ${providerEntity.includes('availability') ? '✅' : '❌'} Availability Calendar`);
    console.log(`   ${providerEntity.includes('timezone') ? '✅' : '❌'} Timezone`);
    
    // Media & Photos
    console.log('\n📸 **Media & Photos:**');
    console.log(`   ${providerEntity.includes('logo') || providerEntity.includes('profileImage') ? '✅' : '❌'} Logo/Profile Image`);
    console.log(`   ${providerEntity.includes('images') || providerEntity.includes('photos') || providerEntity.includes('gallery') ? '✅' : '❌'} Photo Gallery`);
    console.log(`   ${providerEntity.includes('coverImage') || providerEntity.includes('cover_image') ? '✅' : '❌'} Cover Image`);
    
    // Verification & Status
    console.log('\n✅ **Verification & Status:**');
    console.log(`   ${providerEntity.includes('verified') || providerEntity.includes('isVerified') || providerEntity.includes('is_verified') ? '✅' : '❌'} Verification Status`);
    console.log(`   ${providerEntity.includes('status') ? '✅' : '❌'} Provider Status`);
    console.log(`   ${providerEntity.includes('approved') || providerEntity.includes('isApproved') || providerEntity.includes('is_approved') ? '✅' : '❌'} Admin Approval`);
    
    // Staff Management
    console.log('\n👥 **Staff Management:**');
    console.log(`   ${providerEntity.includes('staff') || providerEntity.includes('employees') ? '✅' : '❌'} Staff Relationship`);
    console.log(`   ${providerEntity.includes('owner') || providerEntity.includes('user') ? '✅' : '❌'} Owner Relationship`);
    
    // Services Catalog
    console.log('\n🛍️ **Services Catalog:**');
    console.log(`   ${providerEntity.includes('services') ? '✅' : '❌'} Services Relationship`);
    console.log(`   ${providerEntity.includes('categories') || providerEntity.includes('serviceCategories') ? '✅' : '❌'} Service Categories`);
    
} else {
    console.log('❌ **PROVIDER ENTITY:** Not found!');
}

console.log('\n📋 2. SERVICES CATALOG ANALYSIS:');
console.log('───────────────────────────────────────────────────────────────');

// Service Entity Check
const serviceEntityPath = path.join(entityPath, 'service.entity.ts');
if (fs.existsSync(serviceEntityPath)) {
    const serviceEntity = fs.readFileSync(serviceEntityPath, 'utf8');
    console.log('✅ **SERVICE ENTITY:** Found and analyzing...');
    
    console.log('\n🛍️ **Service Information Fields:**');
    console.log(`   ${serviceEntity.includes('name') || serviceEntity.includes('title') ? '✅' : '❌'} Service Name`);
    console.log(`   ${serviceEntity.includes('description') ? '✅' : '❌'} Description`);
    console.log(`   ${serviceEntity.includes('price') ? '✅' : '❌'} Price`);
    console.log(`   ${serviceEntity.includes('duration') ? '✅' : '❌'} Duration`);
    console.log(`   ${serviceEntity.includes('category') ? '✅' : '❌'} Category`);
    console.log(`   ${serviceEntity.includes('provider') || serviceEntity.includes('providerId') || serviceEntity.includes('provider_id') ? '✅' : '❌'} Provider Relationship`);
    
    console.log('\n📅 **Availability & Booking:**');
    console.log(`   ${serviceEntity.includes('availability') ? '✅' : '❌'} Availability`);
    console.log(`   ${serviceEntity.includes('isActive') || serviceEntity.includes('is_active') || serviceEntity.includes('active') ? '✅' : '❌'} Active Status`);
    console.log(`   ${serviceEntity.includes('maxBookings') || serviceEntity.includes('max_bookings') || serviceEntity.includes('capacity') ? '✅' : '❌'} Booking Capacity`);
    
    console.log('\n📸 **Media & Presentation:**');
    console.log(`   ${serviceEntity.includes('images') || serviceEntity.includes('photos') ? '✅' : '❌'} Service Images`);
    console.log(`   ${serviceEntity.includes('featured') || serviceEntity.includes('isFeatured') || serviceEntity.includes('is_featured') ? '✅' : '❌'} Featured Flag`);
    
} else {
    console.log('❌ **SERVICE ENTITY:** Not found!');
}

console.log('\n📋 3. STAFF MANAGEMENT ANALYSIS:');
console.log('───────────────────────────────────────────────────────────────');

// Staff Entity Check
const staffEntityPath = path.join(entityPath, 'staff.entity.ts');
if (fs.existsSync(staffEntityPath)) {
    const staffEntity = fs.readFileSync(staffEntityPath, 'utf8');
    console.log('✅ **STAFF ENTITY:** Found and analyzing...');
    
    console.log('\n👤 **Staff Information Fields:**');
    console.log(`   ${staffEntity.includes('name') || staffEntity.includes('fullName') || staffEntity.includes('full_name') ? '✅' : '❌'} Staff Name`);
    console.log(`   ${staffEntity.includes('bio') || staffEntity.includes('biography') ? '✅' : '❌'} Bio/Biography`);
    console.log(`   ${staffEntity.includes('email') ? '✅' : '❌'} Email`);
    console.log(`   ${staffEntity.includes('phone') ? '✅' : '❌'} Phone`);
    console.log(`   ${staffEntity.includes('profileImage') || staffEntity.includes('profile_image') || staffEntity.includes('avatar') ? '✅' : '❌'} Profile Image`);
    
    console.log('\n📅 **Individual Calendars:**');
    console.log(`   ${staffEntity.includes('availability') ? '✅' : '❌'} Staff Availability`);
    console.log(`   ${staffEntity.includes('workingHours') || staffEntity.includes('working_hours') ? '✅' : '❌'} Working Hours`);
    console.log(`   ${staffEntity.includes('schedule') ? '✅' : '❌'} Schedule Management`);
    
    console.log('\n🔗 **Relationships:**');
    console.log(`   ${staffEntity.includes('provider') || staffEntity.includes('providerId') || staffEntity.includes('provider_id') ? '✅' : '❌'} Provider Relationship`);
    console.log(`   ${staffEntity.includes('services') ? '✅' : '❌'} Services Relationship`);
    console.log(`   ${staffEntity.includes('bookings') ? '✅' : '❌'} Bookings Relationship`);
    
} else {
    console.log('❌ **STAFF ENTITY:** Not found!');
}

console.log('\n📋 4. CONTROLLER & API ANALYSIS:');
console.log('───────────────────────────────────────────────────────────────');

// Provider Controller Check
const providerControllerPath = path.join(modulesPath, 'providers', 'providers.controller.ts');
if (fs.existsSync(providerControllerPath)) {
    const providerController = fs.readFileSync(providerControllerPath, 'utf8');
    console.log('✅ **PROVIDER CONTROLLER:** Found and analyzing...');
    
    console.log('\n🔧 **API Endpoints:**');
    console.log(`   ${providerController.includes('@Post') && providerController.includes('register') ? '✅' : '❌'} Business Registration/Signup`);
    console.log(`   ${providerController.includes('@Get') && providerController.includes('profile') ? '✅' : '❌'} Get Provider Profile`);
    console.log(`   ${providerController.includes('@Put') || providerController.includes('@Patch') ? '✅' : '❌'} Update Provider Profile`);
    console.log(`   ${providerController.includes('upload') || providerController.includes('photo') || providerController.includes('image') ? '✅' : '❌'} Photo Upload`);
    console.log(`   ${providerController.includes('verify') || providerController.includes('approve') ? '✅' : '❌'} Verification Endpoints`);
    
} else {
    console.log('❌ **PROVIDER CONTROLLER:** Not found!');
}

// Service Controller Check
const serviceControllerPath = path.join(modulesPath, 'services', 'services.controller.ts');
if (fs.existsSync(serviceControllerPath)) {
    const serviceController = fs.readFileSync(serviceControllerPath, 'utf8');
    console.log('\n✅ **SERVICE CONTROLLER:** Found and analyzing...');
    
    console.log('\n🛍️ **Service Management APIs:**');
    console.log(`   ${serviceController.includes('@Post') && !serviceController.includes('@Get') ? '✅' : serviceController.includes('@Post') ? '✅' : '❌'} Create Service`);
    console.log(`   ${serviceController.includes('@Get') ? '✅' : '❌'} List Services`);
    console.log(`   ${serviceController.includes('@Put') || serviceController.includes('@Patch') ? '✅' : '❌'} Update Service`);
    console.log(`   ${serviceController.includes('@Delete') ? '✅' : '❌'} Delete Service`);
    
} else {
    console.log('❌ **SERVICE CONTROLLER:** Not found!');
}

// Staff Controller Check
const staffControllerPath = path.join(modulesPath, 'staff', 'staff.controller.ts');
if (fs.existsSync(staffControllerPath)) {
    const staffController = fs.readFileSync(staffControllerPath, 'utf8');
    console.log('\n✅ **STAFF CONTROLLER:** Found and analyzing...');
    
    console.log('\n👥 **Staff Management APIs:**');
    console.log(`   ${staffController.includes('@Post') && !staffController.includes('@Get') ? '✅' : staffController.includes('@Post') ? '✅' : '❌'} Add Staff Member`);
    console.log(`   ${staffController.includes('@Get') ? '✅' : '❌'} List Staff`);
    console.log(`   ${staffController.includes('@Put') || staffController.includes('@Patch') ? '✅' : '❌'} Update Staff`);
    console.log(`   ${staffController.includes('@Delete') ? '✅' : '❌'} Remove Staff`);
    
} else {
    console.log('❌ **STAFF CONTROLLER:** Not found!');
}

console.log('\n📋 5. DATABASE NAMING CONVENTIONS CHECK:');
console.log('───────────────────────────────────────────────────────────────');
console.log('🔍 Analyzing naming patterns...');

// Check for common naming convention issues
const entitiesToCheck = ['provider.entity.ts', 'service.entity.ts', 'staff.entity.ts'];
let namingIssues = [];
let namingScore = 0;
let totalChecks = 0;

entitiesToCheck.forEach(entityFile => {
    const entityPath = path.join(__dirname, 'src', 'entities', entityFile);
    if (fs.existsSync(entityPath)) {
        const content = fs.readFileSync(entityPath, 'utf8');
        
        // Check for proper column naming (snake_case in database, camelCase in TypeScript)
        const snakeCaseColumns = content.match(/@Column\(\s*{\s*name:\s*['"`]([^'"`]+)['"`]/g);
        if (snakeCaseColumns) {
            snakeCaseColumns.forEach(match => {
                const columnName = match.match(/['"`]([^'"`]+)['"`]/)[1];
                totalChecks++;
                if (columnName.includes('_')) {
                    namingScore++;
                } else {
                    namingIssues.push(`${entityFile}: Column "${columnName}" should use snake_case`);
                }
            });
        }
    }
});

console.log(`\n📊 **Naming Convention Score:** ${totalChecks > 0 ? Math.round((namingScore/totalChecks)*100) : 'N/A'}%`);
if (namingIssues.length > 0) {
    console.log('\n⚠️ **Naming Issues Found:**');
    namingIssues.forEach(issue => console.log(`   • ${issue}`));
} else {
    console.log('\n✅ **No naming convention issues found!**');
}

console.log('\n🎯 **BUSINESS FEATURES IMPLEMENTATION SUMMARY:**');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Analysis completed. Detailed findings above. ⬆️');