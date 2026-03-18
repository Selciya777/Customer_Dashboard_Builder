const http = require('http');

const postData = JSON.stringify({
  widgets: [
    { i: '1', x: 0, y: 0, w: 6, h: 4, component: 'OrderVolumeChart' }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/dashboard-config',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('POST Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request:`, e);
});

req.write(postData);
req.end();
