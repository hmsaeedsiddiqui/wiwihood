const axios = require('axios');

async function getCategories() {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/categories');
    const categories = response.data;
    
    console.log('\n📂 Available Categories:');
    console.log('=======================');
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
      console.log(`   ID: ${cat.id}`);
      console.log(`   Slug: ${cat.slug}`);
      console.log(`   ---`);
    });

  } catch (error) {
    console.error('Error fetching categories:', error.message);
  }
}

getCategories();