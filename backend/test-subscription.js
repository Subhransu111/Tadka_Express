const http = require('http');

// First login to get token
const loginData = JSON.stringify({
  phone: '9876543212',
  password: 'TestPass@123'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
}, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    const result = JSON.parse(responseData);
    const token = result.token;
    
    // Now create subscription
    const startDate = new Date().toISOString().split('T')[0];
    const subData = JSON.stringify({
      planType: 'basic',
      totalDays: 30,
      startDate: startDate
    });
    
    const subReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/subscriptions/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': subData.length,
        'Authorization': 'Bearer ' + token
      }
    }, (subRes) => {
      let subResData = '';
      subRes.on('data', chunk => subResData += chunk);
      subRes.on('end', () => {
        console.log('Status Code:', subRes.statusCode);
        console.log('Response:', subResData);
      });
    });
    
    subReq.write(subData);
    subReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();
