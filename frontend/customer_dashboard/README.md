# Customer Dashboard Builder

A full-stack web application for creating personalized dashboards with drag-and-drop widgets, built for the Halleyx Full Stack Engineer Challenge II - 2026.

## Features

### 🎯 Core Functionality
- **Dashboard Builder**: Drag-and-drop interface for creating custom dashboards
- **Widget Library**: Charts, Tables, and KPI widgets
- **Customer Order Management**: Complete CRUD operations
- **Real-time Data**: Widgets update based on date filters
- **Responsive Design**: Works on Desktop, Tablet, and Mobile

### 📊 Widget Types
- **KPI Cards**: Display aggregated metrics with customizable formatting
- **Charts**: Bar, Line, Area, Scatter, and Pie charts
- **Tables**: Configurable data tables with sorting and pagination

### 🔧 Technical Stack
- **Frontend**: React 19, TypeScript, Material-UI, Recharts
- **Backend**: Node.js, Express, SQLite
- **Layout**: react-grid-layout for drag-and-drop functionality
- **Styling**: Material-UI with custom responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000

## 📱 Responsive Grid System

The application uses a responsive grid system:

- **Desktop (12+ columns)**: Full 12-column grid layout
- **Tablet (8-12 columns)**: 8-column grid with automatic repositioning
- **Mobile (0-7 columns)**: 4-column grid with vertical stacking

## 🗄️ Database Schema

### Customer Orders Table
```sql
CREATE TABLE customer_orders (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_by TEXT NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Dashboard Configurations Table
```sql
CREATE TABLE dashboard_configs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  config TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Widget Configuration

### KPI Widget
- Metric selection from order fields
- Aggregation: Sum, Average, Count
- Data formatting: Number, Currency
- Decimal precision control

### Chart Widgets
- X-axis and Y-axis field selection
- Color customization
- Data label options
- Legend controls (for pie charts)

### Table Widget
- Multi-column selection
- Sorting options
- Pagination (5, 10, 15 rows)
- Font size customization
- Header background color

## 📅 Date Filtering

All widgets support date filtering:
- All time
- Today
- Last 7 Days
- Last 30 Days
- Last 90 Days

## 🏗️ Project Structure

```
customer-dashboard/
├── server/
│   └── index.js                 # Express API server
├── client/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main application
│   └── package.json
└── package.json                # Root package.json
```

## 📋 API Endpoints

### Customer Orders
- `GET /api/orders` - Get all orders (with optional date filter)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update existing order
- `DELETE /api/orders/:id` - Delete order

### Dashboard Configuration
- `GET /api/dashboard-config` - Get dashboard configuration
- `POST /api/dashboard-config` - Save dashboard configuration

### Data Aggregation
- `GET /api/orders/aggregate` - Get aggregated data for KPIs
- `GET /api/orders/chart-data` - Get chart data for visualizations

## 🎯 Challenge Requirements Met

✅ **Dashboard Builder with drag-and-drop**
✅ **Widget Library with all required types**
✅ **Customer Order CRUD operations**
✅ **Date filtering functionality**
✅ **Responsive design for all screen sizes**
✅ **Real-time widget updates**
✅ **Widget configuration panels**
✅ **Save/Load dashboard configurations**

Built with ❤️ for the Halleyx Full Stack Engineer Challenge II - 2026
