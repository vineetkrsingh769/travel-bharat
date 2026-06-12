require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const statesRouter = require('./src/routes/states');
const placesRouter = require('./src/routes/places');
const authRouter  = require('./src/routes/auth');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman)
    if (!origin) return cb(null, true);

    const isAllowed = allowedOrigins.includes(origin) ||
                      origin.startsWith('http://localhost:') ||
                      origin.startsWith('http://127.0.0.1:') ||
                      origin.endsWith('.vercel.app');

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRouter);
app.use('/api/states', statesRouter);
app.use('/api/places', placesRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TravelBharat API running on http://localhost:${PORT}`);
});
