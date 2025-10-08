const { Pool } = require('pg');
require('dotenv').config();

async function checkStaffAndPromotions() {
  const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 CHECKING STAFF TABLE & PROMOTIONS IMPLEMENTATION\n');
    
    // Check for staff-related tables
    const staffTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%staff%' OR table_name LIKE '%employee%'
    `);
    
    console.log('👥 STAFF TABLES:');
    if (staffTables.rows.length > 0) {
      staffTables.rows.forEach(t => console.log(`   ✅ ${t.table_name}`));
    } else {
      console.log('   ❌ No staff tables found');
    }
    
    // Check for promotions tables
    const promotionTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%promotion%' OR table_name LIKE '%deal%' OR table_name LIKE '%discount%'
    `);
    
    console.log('\n🎁 PROMOTION TABLES:');
    if (promotionTables.rows.length > 0) {
      promotionTables.rows.forEach(t => console.log(`   ✅ ${t.table_name}`));
    } else {
      console.log('   ❌ No promotion tables found');
    }
    
    // Check if promotions table exists and has data
    if (promotionTables.rows.find(t => t.table_name === 'promotions')) {
      const promotionCount = await pool.query('SELECT COUNT(*) FROM promotions');
      console.log(`   📊 Promotions count: ${promotionCount.rows[0].count}`);
      
      // Check promotion columns
      const promotionColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'promotions'
        ORDER BY ordinal_position;
      `);
      
      console.log('   📋 Promotion table structure:');
      promotionColumns.rows.forEach(col => {
        console.log(`      ${col.column_name}: ${col.data_type}`);
      });
    }
    
    // Check if promotions controller/module exists
    console.log('\n🚀 CHECKING PROMOTIONS API IMPLEMENTATION:');
    
    // Check src/modules directory structure
    const fs = require('fs');
    const path = require('path');
    
    const modulesPath = path.join(__dirname, 'src', 'modules');
    const directories = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    const promotionModuleExists = directories.includes('promotions');
    console.log(`   📁 Promotions module: ${promotionModuleExists ? 'EXISTS' : 'MISSING'}`);
    
    if (promotionModuleExists) {
      const promotionsPath = path.join(modulesPath, 'promotions');
      const files = fs.readdirSync(promotionsPath);
      console.log('   📄 Promotion files:');
      files.forEach(file => console.log(`      ${file}`));
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`   👥 Staff Table: ${staffTables.rows.length > 0 ? 'IMPLEMENTED ✅' : 'NOT IMPLEMENTED ❌'}`);
    console.log(`   🎁 Promotions Table: ${promotionTables.rows.length > 0 ? 'IMPLEMENTED ✅' : 'NOT IMPLEMENTED ❌'}`);
    console.log(`   🚀 Promotions Module: ${promotionModuleExists ? 'IMPLEMENTED ✅' : 'NOT IMPLEMENTED ❌'}`);
    
    const staffStatus = staffTables.rows.length > 0 ? '100%' : '0%';
    const promotionsStatus = (promotionTables.rows.length > 0 && promotionModuleExists) ? '100%' : 
                            (promotionTables.rows.length > 0 || promotionModuleExists) ? '50%' : '0%';
    
    console.log('\n🎯 IMPLEMENTATION STATUS:');
    console.log(`   Staff functionality: ${staffStatus}`);
    console.log(`   Promotions functionality: ${promotionsStatus}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStaffAndPromotions();