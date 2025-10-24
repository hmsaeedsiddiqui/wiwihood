const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Database configuration
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  port: 5432,
});

async function addSampleServicesWithBadges() {
  try {
    console.log('🚀 Adding sample services with exact badges...\n');

    // First, let's check if we have any providers and categories
    const providersResult = await pool.query('SELECT id FROM providers LIMIT 1');
    const categoriesResult = await pool.query('SELECT id FROM categories LIMIT 1');

    if (providersResult.rows.length === 0) {
      console.log('❌ No providers found. Creating a sample provider first...');
      
      const providerId = uuidv4();
      await pool.query(`
        INSERT INTO providers (
          id, "businessName", "contactEmail", "contactPhone", 
          city, country, "isActive", "createdAt", "updatedAt"
        ) VALUES (
          $1, 'Sample Provider', 'provider@example.com', '+1234567890',
          'Dubai', 'UAE', true, NOW(), NOW()
        )
      `, [providerId]);
      
      console.log('✅ Sample provider created');
    }

    if (categoriesResult.rows.length === 0) {
      console.log('❌ No categories found. Creating sample categories first...');
      
      const categories = [
        { name: 'Beauty & Wellness', slug: 'beauty-wellness' },
        { name: 'Home Services', slug: 'home-services' },
        { name: 'Health & Fitness', slug: 'health-fitness' },
        { name: 'Education', slug: 'education' }
      ];

      for (const category of categories) {
        const categoryId = uuidv4();
        await pool.query(`
          INSERT INTO categories (
            id, name, slug, description, "isActive", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, true, NOW(), NOW()
          )
        `, [categoryId, category.name, category.slug, `${category.name} services`]);
      }
      
      console.log('✅ Sample categories created');
    }

    // Get provider and category IDs
    const provider = await pool.query('SELECT id FROM providers LIMIT 1');
    const category = await pool.query('SELECT id FROM categories LIMIT 1');
    
    const providerId = provider.rows[0].id;
    const categoryId = category.rows[0].id;

    // Define sample services with exact badges
    const services = [
      // New on vividhood
      {
        name: 'Professional Hair Styling',
        badge: 'New on vividhood',
        basePrice: 150,
        description: 'Expert hair styling for special occasions'
      },
      {
        name: 'Home Deep Cleaning',
        badge: 'New on vividhood', 
        basePrice: 200,
        description: 'Complete deep cleaning service for your home'
      },
      
      // Popular
      {
        name: 'Relaxing Massage Therapy',
        badge: 'Popular',
        basePrice: 180,
        description: 'Therapeutic massage for stress relief'
      },
      {
        name: 'Personal Fitness Training',
        badge: 'Popular',
        basePrice: 120,
        description: 'One-on-one fitness training sessions'
      },
      
      // Hot Deal
      {
        name: 'Manicure & Pedicure Combo',
        badge: 'Hot Deal',
        basePrice: 80,
        originalPrice: 120,
        description: 'Complete nail care package at discounted price'
      },
      {
        name: 'Kitchen Deep Clean Special',
        badge: 'Hot Deal',
        basePrice: 100,
        originalPrice: 150,
        description: 'Special offer on kitchen deep cleaning'
      },
      
      // Best Seller
      {
        name: 'Bridal Makeup Package',
        badge: 'Best Seller',
        basePrice: 300,
        description: 'Complete bridal makeup and styling',
        totalBookings: 45
      },
      {
        name: 'AC Maintenance Service',
        badge: 'Best Seller',
        basePrice: 90,
        description: 'Professional AC cleaning and maintenance',
        totalBookings: 32
      },
      
      // Limited Time
      {
        name: 'Couples Spa Package',
        badge: 'Limited Time',
        basePrice: 400,
        originalPrice: 500,
        description: 'Relaxing spa experience for couples - limited time offer'
      },
      
      // Premium
      {
        name: 'Executive Car Detailing',
        badge: 'Premium',
        basePrice: 250,
        description: 'Premium car detailing service for luxury vehicles'
      },
      {
        name: 'Interior Design Consultation',
        badge: 'Premium',
        basePrice: 350,
        description: 'Professional interior design consultation'
      },
      
      // Top Rated
      {
        name: 'Physiotherapy Session',
        badge: 'Top Rated',
        basePrice: 160,
        description: 'Professional physiotherapy treatment',
        averageRating: 4.8,
        totalReviews: 24
      },
      {
        name: 'Plumbing Repair Service',
        badge: 'Top Rated',
        basePrice: 75,
        description: 'Expert plumbing repair and maintenance',
        averageRating: 4.9,
        totalReviews: 18
      }
    ];

    console.log('📝 Creating services with badges...\n');

    for (const service of services) {
      const serviceId = uuidv4();
      
      await pool.query(`
        INSERT INTO services (
          id, name, description, "shortDescription", "serviceType", "pricingType",
          "basePrice", currency, "durationMinutes", "bufferTimeMinutes",
          "maxAdvanceBookingDays", "minAdvanceBookingHours", "cancellationPolicyHours",
          "requiresDeposit", "depositAmount", images, tags, "isOnline", status,
          "isActive", "isFeatured", "sortOrder", "totalBookings", "averageRating",
          "totalReviews", "createdAt", "updatedAt", "providerId", "categoryId",
          "displayLocation", "providerBusinessName", "featuredImage",
          "adminAssignedBadge", "isApproved", "approvalStatus",
          "originalPrice"
        ) VALUES (
          $1, $2, $3, $4, 'appointment', 'fixed',
          $5, 'AED', 60, 15,
          30, 2, 24,
          false, 0, '[]', '[]', false, 'active',
          true, false, 1, $6, $7,
          $8, NOW(), NOW(), $9, $10,
          'Dubai, UAE', 'Sample Provider', '/service-placeholder.jpg',
          $11, true, 'approved',
          $12
        )
      `, [
        serviceId, service.name, service.description, service.description.substring(0, 100),
        service.basePrice, service.totalBookings || 0, service.averageRating || 4.5,
        service.totalReviews || 5, providerId, categoryId,
        service.badge, service.originalPrice || null
      ]);

      console.log(`✅ Created: ${service.name} (Badge: ${service.badge})`);
    }

    console.log('\n🎉 All sample services created successfully!\n');

    // Show final distribution
    const finalCheck = await pool.query(`
      SELECT 
        "adminAssignedBadge" as badge,
        COUNT(*) as count
      FROM services 
      WHERE "isActive" = true AND status = 'active'
      GROUP BY "adminAssignedBadge"
      ORDER BY "adminAssignedBadge";
    `);

    console.log('=== FINAL BADGE DISTRIBUTION ===\n');
    finalCheck.rows.forEach(row => {
      console.log(`📌 ${row.badge}: ${row.count} services`);
    });

  } catch (error) {
    console.error('Error adding sample services:', error);
  } finally {
    await pool.end();
  }
}

addSampleServicesWithBadges();