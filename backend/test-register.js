const http = require('http');

const data = JSON.stringify({
  name: 'Test User Fresh',
  phone: '9123456789',
  password: 'TestPass@123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', err => {
  console.error('Error:', err);
});

req.write(data);
req.end();
