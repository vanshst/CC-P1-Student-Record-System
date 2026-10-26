const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const studentRoutes = require('./routes/studentRoutes');
const requireDatabase = require('./middleware/requireDatabase');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Render (and most cloud hosts) sit behind a reverse proxy.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ---- Security headers ----
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ---- CORS Configuration ----
const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '');

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  
  
];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (e.g. Render health checks, Postman, curl)
    if (!origin) return callback(null, true);

    const cleanOrigin = normalizeOrigin(origin);

    // If wildcard is enabled on Render
    if (process.env.FRONTEND_URL === '*') {
      return callback(null, true);
    }

    // Check explicitly configured origins or default list
    if (
      configuredOrigins.includes(cleanOrigin) ||
      defaultAllowedOrigins.includes(cleanOrigin)
    ) {
      return callback(null, true);
    }

    // Allow any preview/production deployments on Vercel and Netlify
    if (/\.vercel\.app$/.test(cleanOrigin) || /\.netlify\.app$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    logger.warn(`Blocked request from origin: ${origin}`);
    const error = new Error('Origin not allowed by CORS');
    error.isCorsError = true;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ---- Body parsing ----
app.use(express.json({ limit: '10kb' }));

// ---- Logging ----
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// ---- Routes ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Information Management System API is running.',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const database = states[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1;
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? 'ok' : 'degraded',
    database,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/students', requireDatabase, studentRoutes);

// ---- Errors ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;