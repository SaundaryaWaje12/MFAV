import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config(); // Load environment variables from .env

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('MFA OTP Server running'));

// API routes
app.use('/api/auth', authRoutes);

// Port
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB then start server
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
