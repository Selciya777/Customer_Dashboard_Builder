const mongoose = require('mongoose');

const dashboardConfigSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  config: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema);
