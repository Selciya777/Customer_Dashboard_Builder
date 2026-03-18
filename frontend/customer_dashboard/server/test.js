const http = require('http');

const postData = JSON.stringify({
  first_name: "John",
  last_name: "Doe",
  email: "j@d.com",
  phone_number: "123",
  street_address: "1 st",
  city: "NY",
  state_province: "NY",
  postal_code: "123",
  country: "USA",
  product: "Widget",
  quantity: 1,
  unit_price: 10,
  total_amount: 10,
  status: "Pending",
  created_by: "admin"
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/orders',
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
    console.log('POST Response:', data);
    
    // Now GET orders
    http.get('http://localhost:3001/api/orders', (getRes) => {
      let getData = '';
      getRes.on('data', (chunk) => getData += chunk);
      getRes.on('end', () => console.log('GET Response:', getData));
    });
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
