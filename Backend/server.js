/**
 * server.js
 * Main entry point of the application. Sets up Express server,
 * WebSocket, cron jobs, and routes.
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const cron = require('node-cron');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const skuRoutes = require('./routes/sku.routes');
const customerRoutes = require('./routes/customer.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const notificationService = require('./services/notification.service');
const cronService = require('./services/cron.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io initialisation 
notificationService.initialize(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skus', skuRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Cron Job

// We can set it to "*/1 * * * *" for a cron job every minute for evaluation of the implementation
// cron.schedule('*/1 * * * *', async () => {
//   await cronService.generateHourlyOrderSummary();
// });

//Currently it runs for every hour as directed in the pdf
cron.schedule('0 * * * **', async () => {
  await cronService.generateHourlyOrderSummary();
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
