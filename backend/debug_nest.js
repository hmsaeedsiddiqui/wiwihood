const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function debugServices() {
  console.log('🔍 Starting NestJS app for debugging...');
  const app = await NestFactory.create(AppModule, { logger: false });
  
  try {
    const servicesService = app.get('ServicesService');
    const serviceRepository = servicesService.serviceRepository;
    
    console.log('🔍 Testing repository queries...');
    
    // Test 1: Get all services
    const allServices = await serviceRepository.find();
    console.log('✅ All services count:', allServices.length);
    
    if (allServices.length > 0) {
      const first = allServices[0];
      console.log('✅ First service:', {
        id: first.id,
        name: first.name,
        isActive: first.isActive,
        isActiveType: typeof first.isActive,
        isApproved: first.isApproved,
        isApprovedType: typeof first.isApproved
      });
      
      // Test 2: Filter services
      const activeServices = allServices.filter(s => s.isActive === true);
      console.log('✅ Active services (JS filter):', activeServices.length);
      
      const approvedServices = allServices.filter(s => s.isApproved === true);
      console.log('✅ Approved services (JS filter):', approvedServices.length);
      
      const bothServices = allServices.filter(s => s.isActive === true && s.isApproved === true);
      console.log('✅ Both active AND approved (JS filter):', bothServices.length);
      
      // Test 3: TypeORM find with where
      const typeormActive = await serviceRepository.find({ where: { isActive: true } });
      console.log('✅ TypeORM find active:', typeormActive.length);
      
      const typeormApproved = await serviceRepository.find({ where: { isApproved: true } });
      console.log('✅ TypeORM find approved:', typeormApproved.length);
      
      const typeormBoth = await serviceRepository.find({ 
        where: { isActive: true, isApproved: true } 
      });
      console.log('✅ TypeORM find both:', typeormBoth.length);
      
      if (typeormBoth.length > 0) {
        console.log('✅ SUCCESS! TypeORM find works. Sample service:');
        console.log({
          id: typeormBoth[0].id,
          name: typeormBoth[0].name,
          isActive: typeormBoth[0].isActive,
          isApproved: typeormBoth[0].isApproved,
          adminAssignedBadge: typeormBoth[0].adminAssignedBadge
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await app.close();
  }
}

debugServices().catch(console.error);