-- TravelBharat Database Schema
-- Run this once against your PostgreSQL database before seeding.

-- ── States ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  region     VARCHAR(50)  NOT NULL CHECK (region IN ('North','South','East','West','Central','Northeast')),
  capital    VARCHAR(100) NOT NULL,
  blurb      TEXT,
  cover_url  TEXT,
  highlights TEXT[],
  best_time  VARCHAR(255),
  status     VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','pending','published')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ── Popular cities (1-to-many off states) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS popular_cities (
  id       SERIAL PRIMARY KEY,
  state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
  name     VARCHAR(100) NOT NULL,
  note     TEXT,
  map_link TEXT
);

-- ── Places ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  state_id    INTEGER REFERENCES states(id) ON DELETE SET NULL,
  state_name  VARCHAR(100),
  city        VARCHAR(100),
  category    VARCHAR(50) CHECK (category IN ('Heritage','Nature','Religious','Adventure','Beach')),
  image_url   TEXT,
  tagline     TEXT,
  description TEXT,
  best_time   VARCHAR(255),
  timings     VARCHAR(255),
  entry_fee   VARCHAR(255),
  map_link    TEXT,
  nearby      TEXT[],
  status      VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','pending','published')),
  trivia      TEXT,
  travel_tip  TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ── Admin users ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER states_updated_at
  BEFORE UPDATE ON states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Place Images (1-to-many off places for gallery) ───────────────────────────
CREATE TABLE IF NOT EXISTS place_images (
  id        SERIAL PRIMARY KEY,
  place_id  INTEGER REFERENCES places(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);
