import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import favoriteRouter from "./routes/favorites.route.js";
import BlogRouter from "./routes/blog.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import cors from "cors";
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';
import mailRouter from './routes/mail.route.js';
import messageRoute from './routes/message.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify critical environment variables
const requiredEnvVars = ['MONGO', 'JWT_SECRET', 'GMAIL_USER', 'GMAIL_APP_PASSWORD'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB:");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://aetherium-estates.vercel.app'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO,
      ttl: 15 * 60, // 15 minutes
      autoRemove: 'native',
      touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: { 
      secure: false,
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'lax'
    },
    name: 'session_id'
  })
);

app.use((req, res, next) => {
  if (!req.session) {
    console.error('Session not available');
  }
  next();
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/mail', mailRouter);
app.use('/api/message', messageRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'API endpoint not found'
  });
});

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Intermnal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
