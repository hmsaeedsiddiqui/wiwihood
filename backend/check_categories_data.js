const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  ssl: false
});

async function checkCategoriesTable() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if categories table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      );
    `);
    
    console.log('Categories table exists:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Check table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Categories table columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}) default: ${col.column_default}`);
      });

      // Count total categories
      const count = await client.query('SELECT COUNT(*) as count FROM categories');
      console.log(`\n📊 Total categories: ${count.rows[0].count}`);

      // Show all categories
      const categories = await client.query(`
        SELECT id, name, slug, description, "isActive", "isFeatured", "sortOrder"
        FROM categories 
        ORDER BY "sortOrder" ASC, name ASC
      `);
      
      if (categories.rows.length > 0) {
        console.log('\n📋 All categories:');
        categories.rows.forEach((cat, index) => {
          console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`);
          console.log(`     - ID: ${cat.id}`);
          console.log(`     - Active: ${cat.isActive}`);
          console.log(`     - Featured: ${cat.isFeatured}`);
          console.log(`     - Sort Order: ${cat.sortOrder}`);
          console.log(`     - Description: ${cat.description || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('\n❌ No categories found in the table!');
        console.log('🔧 Adding sample categories...');
        
        await client.query(`
          INSERT INTO categories (name, slug, description, "isActive", "isFeatured", "sortOrder") VALUES
          ('Hair Services', 'hair-services', 'Professional hair cutting, styling, and treatments', true, true, 1),
          ('Beauty & Makeup', 'beauty-makeup', 'Makeup application, skincare, and beauty treatments', true, true, 2),
          ('Nail Services', 'nail-services', 'Manicures, pedicures, and nail art services', true, true, 3),
          ('Massage & Wellness', 'massage-wellness', 'Relaxing massages and wellness treatments', true, true, 4),
          ('Facial Treatments', 'facial-treatments', 'Deep cleansing facials and skin treatments', true, false, 5),
          ('Barber Services', 'barber-services', 'Traditional barbering and grooming services', true, false, 6)
        `);
        
        console.log('✅ Sample categories added!');
        
        // Show the newly added categories
        const newCategories = await client.query(`
          SELECT id, name, slug, "isActive", "isFeatured" 
          FROM categories 
          ORDER BY "sortOrder" ASC
        `);
        
        console.log('\n📋 Categories now available:');
        newCategories.rows.forEach((cat, index) => {
          console.log(`  ${index + 1}. ${cat.name} (${cat.slug}) - Active: ${cat.isActive}`);
        });
      }

      // Test the API endpoint query format
      console.log('\n🧪 Testing API query format...');
      const apiTest = await client.query(`
        SELECT id, name, slug, description, "isActive", "isFeatured", "sortOrder", "createdAt", "updatedAt"
        FROM categories 
        WHERE "isActive" = true
        ORDER BY "sortOrder" ASC, name ASC
      `);
      
      console.log(`✅ API query would return ${apiTest.rows.length} active categories`);

    } else {
      console.log('❌ Categories table does not exist!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('👋 Disconnected from database');
  }
}

checkCategoriesTable();