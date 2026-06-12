const db = require('../db');
const { isAdminRequest } = require('../utils/requestAuth');

// GET /api/states
async function listStates(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, slug, name, region, capital, blurb, cover_url, highlights, best_time, status, created_at
       FROM states WHERE status = 'published' ORDER BY name ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// GET /api/states/admin  (admin)
async function listAllStates(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, slug, name, region, capital, blurb, cover_url, highlights, best_time, status, created_at
       FROM states ORDER BY name ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// GET /api/states/:slug
async function getState(req, res, next) {
  try {
    const { slug } = req.params;
    const stateRes = await db.query(
      `SELECT * FROM states WHERE slug = $1`, [slug]
    );
    if (!stateRes.rows.length) return res.status(404).json({ error: 'State not found' });

    const state = stateRes.rows[0];
    if (state.status !== 'published' && !isAdminRequest(req)) {
      return res.status(404).json({ error: 'State not found' });
    }
    const citiesRes = await db.query(
      `SELECT name, note, map_link FROM popular_cities WHERE state_id = $1 ORDER BY id`, [state.id]
    );
    state.popular_cities = citiesRes.rows;

    const placesRes = await db.query(
      `SELECT id, slug, name, city, category, image_url, tagline, best_time
       FROM places WHERE state_id = $1 AND status = 'published' ORDER BY id`, [state.id]
    );
    state.places = placesRes.rows;

    res.json(state);
  } catch (err) { next(err); }
}

// POST /api/states  (admin)
async function createState(req, res, next) {
  try {
    const { slug, name, region, capital, blurb, cover_url, highlights, best_time, status = 'draft', popular_cities } = req.body;
    const stateRes = await db.query(
      `INSERT INTO states (slug, name, region, capital, blurb, cover_url, highlights, best_time, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [slug, name, region, capital, blurb, cover_url, highlights, best_time, status]
    );
    const state = stateRes.rows[0];

    if (Array.isArray(popular_cities)) {
      for (const c of popular_cities) {
        await db.query(
          `INSERT INTO popular_cities (state_id, name, note, map_link) VALUES ($1,$2,$3,$4)`,
          [state.id, c.name, c.note, c.map_link]
        );
      }
    }
    res.status(201).json(state);
  } catch (err) { next(err); }
}

// PUT /api/states/:id  (admin)
async function updateState(req, res, next) {
  try {
    const { id } = req.params;
    const { slug, name, region, capital, blurb, cover_url, highlights, best_time, status, popular_cities } = req.body;

    const { rows } = await db.query(
      `UPDATE states SET slug=$1, name=$2, region=$3, capital=$4, blurb=$5,
        cover_url=$6, highlights=$7, best_time=$8, status=$9 WHERE id=$10 RETURNING *`,
      [slug, name, region, capital, blurb, cover_url, highlights, best_time, status, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'State not found' });

    // Replace popular_cities
    await db.query(`DELETE FROM popular_cities WHERE state_id = $1`, [id]);
    if (Array.isArray(popular_cities)) {
      for (const c of popular_cities) {
        await db.query(
          `INSERT INTO popular_cities (state_id, name, note, map_link) VALUES ($1,$2,$3,$4)`,
          [id, c.name, c.note, c.map_link]
        );
      }
    }
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// PATCH /api/states/:id/status  (admin)
async function updateStateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['draft', 'pending', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { rows } = await db.query(
      `UPDATE states SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'State not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// DELETE /api/states/:id  (admin)
async function deleteState(req, res, next) {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM states WHERE id = $1`, [id]);
    res.json({ message: 'State deleted' });
  } catch (err) { next(err); }
}

module.exports = { listStates, listAllStates, getState, createState, updateState, updateStateStatus, deleteState };
