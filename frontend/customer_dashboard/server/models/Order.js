const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  state_province: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, required: true, default: 'Pending' },
  created_by: { type: String, required: true },
  order_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
