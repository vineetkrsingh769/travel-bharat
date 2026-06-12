/**
 * Seed script — populates states, popular_cities, places, and a default admin.
 * Usage: node src/db/seed.js
 *
 * Requires DATABASE_URL in .env
 */
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { states, places } = require('./seedData');
const { getPlaceRanking } = require('./placeMeta');

const dbUrl = process.env.DATABASE_URL || '';
const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data (order matters for FK constraints)
    await client.query('DELETE FROM place_images');
    await client.query('DELETE FROM places');
    await client.query('DELETE FROM popular_cities');
    await client.query('DELETE FROM states');
    await client.query('DELETE FROM admin_users');
    console.log('✓ Cleared existing data');

    // Insert states and their popular_cities
    const stateIdMap = {};
    for (const s of states) {
      const res = await client.query(
        `INSERT INTO states (slug, name, region, capital, blurb, cover_url, highlights, best_time, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [s.slug, s.name, s.region, s.capital, s.blurb, s.cover_url, s.highlights, s.best_time, 'published']
      );
      const stateId = res.rows[0].id;
      stateIdMap[s.slug] = stateId;

      for (const city of s.popular_cities) {
        await client.query(
          `INSERT INTO popular_cities (state_id, name, note, map_link) VALUES ($1,$2,$3,$4)`,
          [stateId, city.name, city.note, city.map_link]
        );
      }
    }
    console.log(`✓ Seeded ${states.length} states`);

    // Insert places
    for (let i = 0; i < places.length; i++) {
      const p = places[i];
      const { featured, sort_order } = getPlaceRanking(p.slug, i);
      const stateId = stateIdMap[p.state_slug];
      const res = await client.query(
        `INSERT INTO places
          (slug, name, state_id, state_name, city, category, image_url, tagline, description,
           best_time, timings, entry_fee, map_link, nearby, status, trivia, travel_tip, featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id`,
        [p.slug, p.name, stateId, p.state_name, p.city, p.category, p.image_url,
         p.tagline, p.description, p.best_time, p.timings, p.entry_fee, p.map_link, p.nearby, 'published', p.trivia, p.travel_tip, featured, sort_order]
      );
      const placeId = res.rows[0].id;

      const gallery = ['/assets/hero-india.jpg'];
      for (const imgUrl of gallery) {
        await client.query(
          `INSERT INTO place_images (place_id, image_url) VALUES ($1, $2)`,
          [placeId, imgUrl]
        );
      }
    }
    console.log(`✓ Seeded ${places.length} places`);

    // Create default admin (admin / admin123)
    const hash = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)`,
      ['admin', hash]
    );
    console.log('✓ Created admin user (username: admin, password: admin123)');

    await client.query('COMMIT');
    console.log('\n🌿 Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
