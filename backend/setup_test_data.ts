import { DataSource } from 'typeorm';
import { Service } from './src/entities/service.entity';
import { Provider } from './src/entities/provider.entity';
import { User } from './src/entities/user.entity';
import { Category } from './src/entities/category.entity';

async function addTestData() {
  // Database connection configuration
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'reservista_db',
    entities: [Service, Provider, User, Category],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected successfully');

    const userRepo = dataSource.getRepository(User);
    const providerRepo = dataSource.getRepository(Provider);
    const categoryRepo = dataSource.getRepository(Category);
    const serviceRepo = dataSource.getRepository(Service);

    // Create test user if not exists
    let testUser = await userRepo.findOne({ where: { email: 'test@example.com' } });
    if (!testUser) {
      testUser = userRepo.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });
      await userRepo.save(testUser);
      console.log('✓ Test user created');
    }

    // Create test category if not exists
    let testCategory = await categoryRepo.findOne({ where: { name: 'Hair & Beauty' } });
    if (!testCategory) {
      testCategory = categoryRepo.create({
        name: 'Hair & Beauty',
        slug: 'hair-beauty',
        description: 'Hair styling and beauty services',
        isActive: true,
        isFeatured: true,
      });
      await categoryRepo.save(testCategory);
      console.log('✓ Test category created');
    }

    // Create test provider if not exists
    let testProvider = await providerRepo.findOne({ where: { businessName: 'Test Salon' } });
    if (!testProvider) {
      testProvider = providerRepo.create({
        user: testUser,
        businessName: 'Test Salon',
        businessDescription: 'A premium hair salon',
        businessAddress: '123 Main St',
        businessPhone: '+1234567890',
        businessEmail: 'salon@test.com',
        providerType: 'individual',
        status: 'active',
      });
      await providerRepo.save(testProvider);
      console.log('✓ Test provider created');
    }

    // Create test services
    const services = [
      {
        name: 'Hair Cut & Styling',
        description: 'Professional hair cut and styling service',
        basePrice: 50.00,
        duration: 60,
      },
      {
        name: 'Hair Color Treatment',
        description: 'Complete hair coloring service',
        basePrice: 120.00,
        duration: 120,
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Full nail care service',
        basePrice: 35.00,
        duration: 45,
      }
    ];

    for (const serviceData of services) {
      let existingService = await serviceRepo.findOne({ where: { name: serviceData.name } });
      if (!existingService) {
        const service = serviceRepo.create({
          ...serviceData,
          provider: testProvider,
          category: testCategory,
          serviceType: 'service',
          pricingType: 'fixed',
          status: 'active',
        });
        await serviceRepo.save(service);
        console.log(`✓ Service "${serviceData.name}" created`);
      }
    }

    console.log('\n🎉 Test data setup complete!');
    console.log('You can now test the cart functionality with these services.');

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    await dataSource.destroy();
  }
}

addTestData();
