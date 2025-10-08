const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  console.log('✅ Health check called');
  res.json({
    status: 'OK',
    message: 'Reservista API is running!',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Gift cards test endpoint
app.get('/api/v1/gift-cards/active', (req, res) => {
  console.log('✅ Gift cards active endpoint called');
  res.json({
    success: true,
    message: 'Gift Cards API is working!',
    data: [],
    count: 0
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET  http://localhost:${port}/api/v1/health`);
  console.log(`   GET  http://localhost:${port}/api/v1/gift-cards/active`);
  console.log(`\n🧪 Test with:`);
  console.log(`   Invoke-WebRequest -Uri "http://localhost:${port}/api/v1/health" -Method GET`);
});