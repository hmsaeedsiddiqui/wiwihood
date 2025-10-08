const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false }
});

async function addTestContactData() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Add test contact messages
    const testMessages = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hello, I would like to inquire about your booking services. Can you provide more information about availability?',
        status: 'new'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'I had an issue with my recent booking. Could someone please help me resolve this?',
        status: 'read'
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        message: 'Great service! I just wanted to leave some positive feedback about my experience.',
        status: 'replied',
        adminResponse: 'Thank you for your positive feedback! We really appreciate it.',
        respondedAt: new Date()
      }
    ];

    // Clear existing test data (optional)
    await client.query('DELETE FROM contact_messages WHERE email LIKE \'%@example.com\'');
    
    for (const msg of testMessages) {
      const query = `
        INSERT INTO contact_messages (name, email, message, status, "adminResponse", "respondedAt", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `;
      
      await client.query(query, [
        msg.name,
        msg.email,
        msg.message,
        msg.status,
        msg.adminResponse || null,
        msg.respondedAt || null
      ]);
      
      console.log(`Added contact message from ${msg.name}`);
    }

    // Check total count
    const countResult = await client.query('SELECT COUNT(*) FROM contact_messages');
    console.log(`Total contact messages in database: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

addTestContactData();