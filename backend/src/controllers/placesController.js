const db = require('../db');
const { isAdminRequest } = require('../utils/requestAuth');

// GET /api/places  — supports ?q=&category=&state=&limit=&offset=
async function listPlaces(req, res, next) {
  try {
    const { q, category, state, limit = 100, offset = 0 } = req.query;
    const conditions = ["p.status = 'published'"];
    const params = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      conditions.push(`(LOWER(p.name) LIKE $${params.length} OR LOWER(p.city) LIKE $${params.length} OR LOWER(p.state_name) LIKE $${params.length})`);
    }
    if (category) {
      params.push(category);
      conditions.push(`p.category = $${params.length}`);
    }
    if (state) {
      params.push(state);
      conditions.push(`s.slug = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(Number(limit), Number(offset));

    const { rows } = await db.query(
      `SELECT p.id, p.slug, p.name, p.state_name, p.city, p.category,
              p.image_url, p.tagline, p.best_time, p.entry_fee, p.featured, p.sort_order,
              s.slug AS state_slug
       FROM places p
       LEFT JOIN states s ON p.state_id = s.id
       ${where}
       ORDER BY p.featured DESC, p.sort_order ASC, p.id ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// GET /api/places/admin  (admin)
async function listAllPlaces(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT p.id, p.slug, p.name, p.state_name, p.city, p.category,
              p.image_url, p.tagline, p.best_time, p.entry_fee, p.status, p.featured, p.sort_order,
              s.slug AS state_slug
       FROM places p
       LEFT JOIN states s ON p.state_id = s.id
       ORDER BY p.featured DESC, p.sort_order ASC, p.id ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// GET /api/places/:slug
async function getPlace(req, res, next) {
  try {
    const { slug } = req.params;
    const { rows } = await db.query(
      `SELECT p.*, s.slug AS state_slug
       FROM places p LEFT JOIN states s ON p.state_id = s.id
       WHERE p.slug = $1`, [slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Place not found' });

    const place = rows[0];
    if (place.status !== 'published' && !isAdminRequest(req)) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Fetch gallery images
    const imagesRes = await db.query(
      `SELECT image_url FROM place_images WHERE place_id = $1`, [place.id]
    );
    place.images = imagesRes.rows.map(img => img.image_url);

    // Related places in same state
    const relRes = await db.query(
      `SELECT id, slug, name, category, image_url, tagline
       FROM places WHERE state_id = $1 AND slug != $2 AND status = 'published' LIMIT 3`,
      [place.state_id, slug]
    );
    place.related = relRes.rows;

    res.json(place);
  } catch (err) { next(err); }
}

// POST /api/places  (admin)
async function createPlace(req, res, next) {
  try {
    const { slug, name, state_id, state_name, city, category, image_url, tagline,
            description, best_time, timings, entry_fee, map_link, nearby, status = 'draft',
            images, trivia, travel_tip, featured = false, sort_order = 0 } = req.body;
    const { rows } = await db.query(
      `INSERT INTO places (slug, name, state_id, state_name, city, category, image_url,
        tagline, description, best_time, timings, entry_fee, map_link, nearby, status, trivia, travel_tip, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
      [slug, name, state_id, state_name, city, category, image_url,
       tagline, description, best_time, timings, entry_fee, map_link,
       Array.isArray(nearby) ? nearby : (nearby || '').split(',').map(n => n.trim()).filter(Boolean),
       status, trivia, travel_tip, Boolean(featured), Number(sort_order) || 0]
    );
    const place = rows[0];

    if (Array.isArray(images) && images.length > 0) {
      for (const imgUrl of images) {
        await db.query(
          `INSERT INTO place_images (place_id, image_url) VALUES ($1, $2)`,
          [place.id, imgUrl]
        );
      }
      place.images = images;
    } else {
      place.images = [];
    }

    res.status(201).json(place);
  } catch (err) { next(err); }
}

// PUT /api/places/:id  (admin)
async function updatePlace(req, res, next) {
  try {
    const { id } = req.params;
    const { slug, name, state_id, state_name, city, category, image_url, tagline,
            description, best_time, timings, entry_fee, map_link, nearby, status, images,
            trivia, travel_tip, featured = false, sort_order = 0 } = req.body;
    const { rows } = await db.query(
      `UPDATE places SET slug=$1, name=$2, state_id=$3, state_name=$4, city=$5,
        category=$6, image_url=$7, tagline=$8, description=$9, best_time=$10,
        timings=$11, entry_fee=$12, map_link=$13, nearby=$14, status=$15, trivia=$16, travel_tip=$17,
        featured=$18, sort_order=$19
       WHERE id=$20 RETURNING *`,
      [slug, name, state_id, state_name, city, category, image_url, tagline,
       description, best_time, timings, entry_fee, map_link,
       Array.isArray(nearby) ? nearby : (nearby || '').split(',').map(n => n.trim()).filter(Boolean),
       status, trivia, travel_tip, Boolean(featured), Number(sort_order) || 0, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Place not found' });
    const place = rows[0];

    // Reset gallery images
    await db.query(`DELETE FROM place_images WHERE place_id = $1`, [id]);
    if (Array.isArray(images) && images.length > 0) {
      for (const imgUrl of images) {
        await db.query(
          `INSERT INTO place_images (place_id, image_url) VALUES ($1, $2)`,
          [id, imgUrl]
        );
      }
      place.images = images;
    } else {
      place.images = [];
    }

    res.json(place);
  } catch (err) { next(err); }
}

// PATCH /api/places/:id/status  (admin)
async function updatePlaceStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['draft', 'pending', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { rows } = await db.query(
      `UPDATE places SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Place not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// DELETE /api/places/:id  (admin)
async function deletePlace(req, res, next) {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM places WHERE id = $1`, [id]);
    res.json({ message: 'Place deleted' });
  } catch (err) { next(err); }
}

module.exports = { listPlaces, listAllPlaces, getPlace, createPlace, updatePlace, updatePlaceStatus, deletePlace };
