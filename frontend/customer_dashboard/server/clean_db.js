const mongoose = require('mongoose');
const DashboardConfig = require('./models/DashboardConfig');

mongoose.connect('mongodb://localhost:27017/customer_dashboard')
  .then(async () => {
    // Delete all corrupted configurations
    await DashboardConfig.deleteMany({});
    console.log('Successfully cleared dashboard configurations.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
