import { DataSource } from 'typeorm';
import { Category } from './src/entities/category.entity';
import { Service } from './src/entities/service.entity';

// Database configuration
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'umar',
  password: 'umar',
  database: 'reservista_clean',
  entities: [Category, Service],
  synchronize: false,
  logging: true,
});

async function createCategories() {
  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established');

    const categoryRepository = dataSource.getRepository(Category);

    // Check if categories already exist
    const existingCategories = await categoryRepository.find();
    console.log(`Found ${existingCategories.length} existing categories`);

    // Create first category: Beauty & Wellness
    const beautyCategory = categoryRepository.create({
      name: 'Beauty & Wellness',
      description: 'Professional beauty and wellness services including hair styling, spa treatments, massage therapy, skincare, and personal grooming services.',
      slug: 'beauty-wellness',
      icon: 'fa-solid fa-spa',
      sortOrder: 1,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Beauty & Wellness Services',
      metaDescription: 'Book professional beauty and wellness services near you. Hair, spa, massage, skincare and more.',
      metaKeywords: 'beauty, wellness, spa, hair, massage, skincare, salon',
    });

    // Create second category: Home Services
    const homeCategory = categoryRepository.create({
      name: 'Home Services',
      description: 'Professional home maintenance and improvement services including cleaning, plumbing, electrical work, landscaping, and general repairs.',
      slug: 'home-services',
      icon: 'fa-solid fa-home',
      sortOrder: 2,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Home Services & Maintenance',
      metaDescription: 'Find reliable home service professionals for cleaning, repairs, maintenance and improvement projects.',
      metaKeywords: 'home services, cleaning, plumbing, electrical, repairs, maintenance',
    });

    // Save categories
    const savedCategories = await categoryRepository.save([beautyCategory, homeCategory]);
    
    console.log('Categories created successfully:');
    savedCategories.forEach(category => {
      console.log(`- ${category.name} (ID: ${category.id}, Slug: ${category.slug})`);
    });

    console.log('\nDatabase operations completed successfully!');
  } catch (error) {
    console.error('Error creating categories:', error);
  } finally {
    // Close the database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the script
createCategories();
