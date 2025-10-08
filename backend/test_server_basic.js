const http = require('http');

console.log('Testing basic server connectivity...');

const req = http.get('http://localhost:3001', (res) => {
  console.log(`✅ Server is responding! Status: ${res.statusCode}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received, server is working!');
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log('❌ Connection error:', err.message);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('❌ Request timeout');
  req.destroy();
  process.exit(1);
});