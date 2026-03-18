const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const path = require('path');

// Maps display field names (from front-end widget config) to actual mongoose field names
const fieldNameMap = {
  'Customer ID': 'id',
  'Customer name': 'first_name', // Note: full name is a virtual
  'Email id': 'email',
  'Phone number': 'phone_number',
  'Order ID': 'id',
  'Order date': 'order_date',
  'Product': 'product',
  'Quantity': 'quantity',
  'Unit price': 'unit_price',
  'Total amount': 'total_amount',
  'Status': 'status',
  'Created by': 'created_by',
  'Duration': 'order_date',
};

function resolveField(displayName) {
  if (fieldNameMap[displayName]) return fieldNameMap[displayName];
  // Fallback: convert display name to snake_case
  return displayName.toLowerCase().replace(/ /g, '_');
}

const Order = require('./models/Order');
const DashboardConfig = require('./models/DashboardConfig');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_dashboard';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.get('/api/orders', async (req, res) => {
  try {
    const { dateFilter } = req.query;
    let query = {};
    
    if (dateFilter && dateFilter !== 'All time') {
      const now = new Date();
      let startDate;
      switch(dateFilter) {
        case 'Today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'Last 7 Days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'Last 90 Days':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
      }
      if (startDate) {
        query.order_date = { $gte: startDate };
      }
    }
    
    const orders = await Order.find(query).sort({ order_date: -1 });
    const mappedOrders = orders.map(order => {
      const obj = order.toObject();
      return { ...obj, id: obj.id || obj._id.toString() };
    });
    res.json(mappedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const id = uuidv4();
    const newOrder = new Order({
      ...req.body,
      id
    });
    await newOrder.save();
    res.json({ id, message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    
    const updatedOrder = await Order.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    
    const deletedOrder = await Order.findOneAndDelete(query);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard-config', async (req, res) => {
  try {
    const configDoc = await DashboardConfig.findOne().sort({ updated_at: -1 });
    if (configDoc) {
      try {
        res.json(JSON.parse(configDoc.config));
      } catch (e) {
        res.json({ widgets: [] }); // Fallback if config is not valid JSON
      }
    } else {
      res.json({ widgets: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dashboard-config', async (req, res) => {
  try {
    const config = req.body;
    const id = uuidv4();
    const newConfig = new DashboardConfig({
      id,
      name: config.name || 'Default Dashboard',
      config: JSON.stringify(config)
    });
    await newConfig.save();
    res.json({ id, message: 'Dashboard configuration saved successfully' });
  } catch (err) {
    console.error('Error in POST /api/dashboard-config:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/aggregate', async (req, res) => {
  try {
    const { field, aggregation, dateFilter } = req.query;

    // Resolve display field name to actual mongoose field name
    const resolvedField = resolveField(field);

    let matchStage = {};
    if (dateFilter && dateFilter !== 'All time') {
      const now = new Date();
      let startDate;
      switch(dateFilter) {
        case 'Today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'Last 7 Days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'Last 90 Days':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
      }
      if (startDate) {
        matchStage.order_date = { $gte: startDate };
      }
    }

    let groupStage = { _id: null };
    const agg = (aggregation || '').toUpperCase();
    if (agg === 'SUM') {
      groupStage.result = { $sum: `$${resolvedField}` };
    } else if (agg === 'MIN') {
      groupStage.result = { $min: `$${resolvedField}` };
    } else if (agg === 'MAX') {
      groupStage.result = { $max: `$${resolvedField}` };
    } else if (agg === 'AVG') {
      groupStage.result = { $avg: `$${resolvedField}` };
    } else if (agg === 'COUNT') {
      groupStage.result = { $sum: 1 };
    } else {
      groupStage.result = { $sum: `$${resolvedField}` }; // default
    }

    const pipeline = [
      { $match: matchStage },
      { $group: groupStage }
    ];

    const aggregateResult = await Order.aggregate(pipeline);
    const resultValue = aggregateResult.length > 0 ? aggregateResult[0].result : 0;
    
    res.json({ result: resultValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/chart-data', async (req, res) => {
  try {
    const { xField, yField, dateFilter } = req.query;

    // Resolve display field names to actual mongoose field names
    const resolvedXField = resolveField(xField);
    const resolvedYField = resolveField(yField);

    let matchQuery = {};
    if (dateFilter && dateFilter !== 'All time') {
      const now = new Date();
      let startDate;
      switch(dateFilter) {
        case 'Today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'Last 7 Days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'Last 90 Days':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
      }
      if (startDate) {
        matchQuery.order_date = { $gte: startDate };
      }
    }

    const orders = await Order.find(matchQuery).sort({ order_date: -1 });
    
    // Map using resolved snake_case field names
    const chartData = orders.map(order => ({
      x: order[resolvedXField] !== undefined ? order[resolvedXField] : order.get(resolvedXField),
      y: order[resolvedYField] !== undefined ? order[resolvedYField] : order.get(resolvedYField)
    }));
    
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
