const { Pool } = require('pg');
require('dotenv').config();
const jsonDb = require('./jsonDb');

const dbUrl = process.env.DATABASE_URL;
const isPlaceholder = !dbUrl || 
                      dbUrl.includes('user:password') || 
                      dbUrl.includes('@host:5432') || 
                      dbUrl.includes('placeholder') ||
                      dbUrl === '';

let pool = null;
let useJsonDb = false;

if (isPlaceholder) {
  console.log('⚠️ [Database] DATABASE_URL is empty or placeholder. Using local JSON database (backend/src/db/db_store.json)');
  useJsonDb = true;
} else {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      connectionTimeoutMillis: 3000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL client error, switching to JSON fallback', err.message);
      useJsonDb = true;
    });
  } catch (err) {
    console.warn('⚠️ [Database] Failed to initialize PostgreSQL pool. Falling back to local JSON database.', err.message);
    useJsonDb = true;
  }
}

async function query(text, params) {
  if (useJsonDb) {
    return jsonDb.query(text, params);
  }
  try {
    return await pool.query(text, params);
  } catch (err) {
    const isConnError = err.code === 'ECONNREFUSED' || 
                        err.message.includes('connect') || 
                        err.message.includes('connection') ||
                        err.message.includes('timeout') ||
                        err.message.includes('no password');
    if (isConnError) {
      console.warn('⚠️ [Database] PostgreSQL connection error occurred. Falling back to local JSON database for this session.', err.message);
      useJsonDb = true;
      return jsonDb.query(text, params);
    }
    throw err;
  }
}

module.exports = {
  query,
  pool,
};
