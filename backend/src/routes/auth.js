const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { rows } = await db.query(
      `SELECT id, username, password_hash FROM admin_users WHERE username = $1`, [username]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, username: admin.username });
  } catch (err) { next(err); }
});

// GET /api/auth/verify  — lightweight token check for frontend
router.get('/verify', (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ valid: false });
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    res.json({ valid: true, username: payload.username });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
