const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const ASSETS_ROOT = path.join(__dirname, '../../../frontend/public/assets');
const MAX_BYTES = 5 * 1024 * 1024;

// POST /api/upload  { filename, base64, subfolder? }
router.post('/', auth, (req, res, next) => {
  try {
    const { filename, base64, subfolder = 'uploads' } = req.body;
    if (!filename || !base64) {
      return res.status(400).json({ error: 'filename and base64 are required' });
    }

    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 120);
    if (!safeName) return res.status(400).json({ error: 'Invalid filename' });

    const safeFolder = String(subfolder).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'uploads';
    const data = base64.includes(',') ? base64.split(',').pop() : base64;
    const buffer = Buffer.from(data, 'base64');

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }

    const dir = path.join(ASSETS_ROOT, safeFolder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, safeName), buffer);

    res.json({ url: `/assets/${safeFolder}/${safeName}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
