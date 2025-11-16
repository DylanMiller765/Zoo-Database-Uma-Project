import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import animalRoutes from './routes/animal.routes';
import employeeRoutes from './routes/employee.routes';
import customerRoutes from './routes/customer.routes';
import attractionRoutes from './routes/attraction.routes';
import habitatRoutes from './routes/habitat.routes';
import ticketRoutes from './routes/ticket.routes';
import giftShopRoutes from './routes/giftShop.routes';
import giftShopItemRoutes from './routes/giftShopItem.routes';
import giftShopSaleRoutes from './routes/giftShopSale.routes';
import cafeRoutes from './routes/cafe.routes';
import cafeItemRoutes from './routes/cafeItem.routes';
import cafeSaleRoutes from './routes/cafeSale.routes';
import eventRegistrationRoutes from './routes/eventRegistration.routes';
import dashboardRoutes from './routes/dashboard.routes';
import queryRoutes from './routes/query.routes';
import meRoutes from './routes/me.routes';
import notificationRoutes from './routes/notification.routes';
import feedingScheduleRoutes from './routes/feedingSchedule.routes';
import feedingLogRoutes from './routes/feedingLog.routes';
import zookeeperAssignmentRoutes from './routes/zookeeperAssignment.routes';
import checkoutRoutes from './routes/checkout.routes';
import donationRoutes from './routes/donation.routes';
import transactionRoutes from './routes/transaction.routes';
import eventCancellationLogRoutes from './routes/event-cancellation-log.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zoo Management API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/habitats', habitatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/gift-shops', giftShopRoutes);
app.use('/api/gift-shop-items', giftShopItemRoutes);
app.use('/api/gift-shop-sales', giftShopSaleRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/cafe-items', cafeItemRoutes);
app.use('/api/cafe-sales', cafeSaleRoutes);
app.use('/api/event-registrations', eventRegistrationRoutes);
app.use('/api/me', meRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feeding-schedules', feedingScheduleRoutes);
app.use('/api/feeding-logs', feedingLogRoutes);
app.use('/api/zookeeper-assignments', zookeeperAssignmentRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/event-cancellations', eventCancellationLogRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 API Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;