const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('user:password') || dbUrl.includes('@host:5432') || dbUrl === '') {
    console.error('❌ Error: DATABASE_URL in backend/.env is not configured. Please configure it first!');
    process.exit(1);
  }

  console.log('⏳ Connecting to PostgreSQL database...');
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⏳ Running schema migration...');
    await pool.query(sql);

    // Apply status column migrations for existing PostgreSQL databases
    console.log('⏳ Checking status column migrations...');
    await pool.query(`
      ALTER TABLE states ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','pending','published'));
      ALTER TABLE places ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','pending','published'));
      ALTER TABLE places ADD COLUMN IF NOT EXISTS trivia TEXT;
      ALTER TABLE places ADD COLUMN IF NOT EXISTS travel_tip TEXT;
    `);

    console.log('✅ Schema migration completed successfully! All tables created and migrated.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
