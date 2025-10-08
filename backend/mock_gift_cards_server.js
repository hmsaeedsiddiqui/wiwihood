const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

// Mock gift cards data
const mockGiftCards = [
  {
    id: '1',
    code: 'GIFT001',
    original_amount: 100.00,
    current_balance: 75.50,
    status: 'active',
    expires_at: '2024-12-31T23:59:59.999Z',
    created_at: '2024-01-01T00:00:00.000Z',
    purchased_at: '2024-01-01T00:00:00.000Z',
    purchaser_id: 'user1',
    recipient_id: 'user2'
  },
  {
    id: '2',
    code: 'GIFT002',
    original_amount: 50.00,
    current_balance: 50.00,
    status: 'active',
    expires_at: '2024-12-31T23:59:59.999Z',
    created_at: '2024-01-01T00:00:00.000Z',
    purchased_at: '2024-01-01T00:00:00.000Z',
    purchaser_id: 'user3',
    recipient_id: 'user4'
  }
];

// Gift Cards API endpoints
app.get('/api/v1/gift-cards/active', (req, res) => {
  console.log('✅ GET /api/v1/gift-cards/active called');
  const activeCards = mockGiftCards.filter(card => card.status === 'active');
  res.json({
    success: true,
    data: activeCards,
    count: activeCards.length
  });
});

app.get('/api/v1/gift-cards/my-cards', (req, res) => {
  console.log('✅ GET /api/v1/gift-cards/my-cards called');
  res.json({
    success: true,
    data: mockGiftCards,
    count: mockGiftCards.length
  });
});

app.post('/api/v1/gift-cards/check-balance', (req, res) => {
  console.log('✅ POST /api/v1/gift-cards/check-balance called');
  const { code } = req.body;
  const card = mockGiftCards.find(c => c.code === code);
  
  if (card) {
    res.json({
      success: true,
      data: {
        code: card.code,
        current_balance: card.current_balance,
        status: card.status
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Gift card not found'
    });
  }
});

app.get('/api/v1/gift-cards/:code', (req, res) => {
  console.log(`✅ GET /api/v1/gift-cards/${req.params.code} called`);
  const card = mockGiftCards.find(c => c.code === req.params.code);
  
  if (card) {
    res.json({
      success: true,
      data: card
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Gift card not found'
    });
  }
});

app.listen(port, () => {
  console.log(`🎁 Mock Gift Cards API server running on http://localhost:${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/v1/gift-cards/active`);
  console.log(`   GET  /api/v1/gift-cards/my-cards`);
  console.log(`   POST /api/v1/gift-cards/check-balance`);
  console.log(`   GET  /api/v1/gift-cards/:code`);
  console.log(`\n🧪 Test the API with:`);
  console.log(`   Invoke-WebRequest -Uri "http://localhost:${port}/api/v1/gift-cards/active" -Method GET`);
});