const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'db_store.json');

const { states: initialStates, places: initialPlaces } = require('./seedData');

// Helper to load/save JSON data
function readData() {
  if (!fs.existsSync(dbPath)) {
    // Generate initial structure
    const states = [];
    const popular_cities = [];
    const places = [];
    
    let stateIdCounter = 1;
    let cityIdCounter = 1;
    let placeIdCounter = 1;

    const stateIdMap = {};

    initialStates.forEach(s => {
      const stateId = stateIdCounter++;
      stateIdMap[s.slug] = stateId;

      states.push({
        id: stateId,
        slug: s.slug,
        name: s.name,
        region: s.region,
        capital: s.capital,
        blurb: s.blurb,
        cover_url: s.cover_url,
        highlights: s.highlights,
        best_time: s.best_time,
        status: 'published',
        created_at: new Date().toISOString()
      });

      if (s.popular_cities) {
        s.popular_cities.forEach(city => {
          popular_cities.push({
            id: cityIdCounter++,
            state_id: stateId,
            name: city.name,
            note: city.note,
            map_link: city.map_link
          });
        });
      }
    });

    initialPlaces.forEach(p => {
      const stateId = stateIdMap[p.state_slug];
      places.push({
        id: placeIdCounter++,
        slug: p.slug,
        name: p.name,
        state_id: stateId,
        state_name: p.state_name,
        city: p.city,
        category: p.category,
        image_url: p.image_url,
        tagline: p.tagline,
        description: p.description,
        best_time: p.best_time,
        timings: p.timings,
        entry_fee: p.entry_fee,
        map_link: p.map_link,
        nearby: p.nearby,
        status: 'published',
        trivia: p.trivia,
        travel_tip: p.travel_tip,
        created_at: new Date().toISOString()
      });
    });

    // Default admin password 'admin123'
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    const admin_users = [
      {
        id: 1,
        username: 'admin',
        password_hash: hash
      }
    ];

    const data = { states, popular_cities, places, place_images: [], admin_users };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return data;
  }
  
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let migrated = false;
  if (data.states && data.states.some(s => !s.status)) {
    data.states = data.states.map(s => s.status ? s : { ...s, status: 'published' });
    migrated = true;
  }
  if (data.places && data.places.some(p => !p.status)) {
    data.places = data.places.map(p => p.status ? p : { ...p, status: 'published' });
    migrated = true;
  }
  if (migrated) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  return data;
}

function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Emulate a standard SQL query interface
async function query(sql, params = []) {
  const data = readData();

  // Normalize SQL whitespace
  const normalized = sql.replace(/\s+/g, ' ').trim();

  // 1. SELECT id, username, password_hash FROM admin_users WHERE username = $1
  if (/select.*from\s+admin_users\s+where\s+username\s*=\s*\$1/i.test(normalized)) {
    const username = params[0];
    const rows = data.admin_users.filter(u => u.username === username);
    return { rows };
  }

  // 2. SELECT id, slug, name, ... FROM states WHERE status = 'published' ORDER BY name ASC
  if (/select.*from\s+states\s+where\s+status\s*=\s*'published'\s+order\s+by\s+name\s+asc/i.test(normalized)) {
    const rows = data.states
      .filter(s => s.status === 'published')
      .sort((a, b) => a.name.localeCompare(b.name));
    return { rows };
  }

  // 2b. SELECT id, slug, name, ... FROM states ORDER BY name ASC (admin/all states)
  if (/select.*from\s+states\s+order\s+by\s+name\s+asc/i.test(normalized) && !/where/i.test(normalized)) {
    const rows = [...data.states].sort((a, b) => a.name.localeCompare(b.name));
    return { rows };
  }

  // 3. SELECT * FROM states WHERE slug = $1
  if (/select\s+\*\s+from\s+states\s+where\s+slug\s*=\s*\$1/i.test(normalized)) {
    const slug = params[0];
    const rows = data.states.filter(s => s.slug === slug);
    return { rows };
  }

  // 4. SELECT name, note, map_link FROM popular_cities WHERE state_id = $1 ORDER BY id
  if (/select.*from\s+popular_cities\s+where\s+state_id\s*=\s*\$1/i.test(normalized)) {
    const state_id = Number(params[0]);
    const rows = data.popular_cities.filter(c => c.state_id === state_id);
    return { rows };
  }

  // 5. SELECT id, slug, name, city, category, image_url, tagline, best_time FROM places WHERE state_id = $1 ORDER BY id
  if (/select.*from\s+places\s+where\s+state_id\s*=\s*\$1/i.test(normalized) && !/slug\s*!=\s*\$2/i.test(normalized)) {
    const state_id = Number(params[0]);
    const hasPublishedFilter = /status\s*=\s*'published'/i.test(normalized);
    const rows = data.places.filter(p => p.state_id === state_id && (!hasPublishedFilter || p.status === 'published'));
    return { rows };
  }

  // 6. INSERT INTO states (slug, name, region, capital, blurb, cover_url, highlights, best_time, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
  if (/insert\s+into\s+states/i.test(normalized)) {
    const hasStatusCol = /status/i.test(normalized);
    let slug, name, region, capital, blurb, cover_url, highlights, best_time, status;
    if (hasStatusCol) {
      [slug, name, region, capital, blurb, cover_url, highlights, best_time, status] = params;
    } else {
      [slug, name, region, capital, blurb, cover_url, highlights, best_time] = params;
    }
    const newId = data.states.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const newState = {
      id: newId,
      slug,
      name,
      region,
      capital,
      blurb,
      cover_url,
      highlights: Array.isArray(highlights) ? highlights : [],
      best_time,
      status: status || 'draft',
      created_at: new Date().toISOString()
    };
    data.states.push(newState);
    writeData(data);
    return { rows: [newState] };
  }

  // 7. INSERT INTO popular_cities (state_id, name, note, map_link) VALUES ($1,$2,$3,$4)
  if (/insert\s+into\s+popular_cities/i.test(normalized)) {
    const [state_id, name, note, map_link] = params;
    const newId = data.popular_cities.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const newCity = {
      id: newId,
      state_id: Number(state_id),
      name,
      note,
      map_link
    };
    data.popular_cities.push(newCity);
    writeData(data);
    return { rows: [newCity] };
  }

  // 8. UPDATE states SET ... WHERE id=$9 RETURNING * / UPDATE states SET status=$1 WHERE id=$2
  if (/update\s+states\s+set/i.test(normalized)) {
    const isStatusUpdate = /status\s*=\s*\$1/i.test(normalized) && !/slug/i.test(normalized);
    if (isStatusUpdate) {
      const [status, id] = params;
      const stateId = Number(id);
      const index = data.states.findIndex(s => s.id === stateId);
      if (index === -1) return { rows: [] };
      data.states[index].status = status;
      writeData(data);
      return { rows: [data.states[index]] };
    }

    const hasStatusCol = /status\s*=\s*\$/i.test(normalized);
    const id = params[params.length - 1];
    const stateId = Number(id);
    const index = data.states.findIndex(s => s.id === stateId);
    if (index === -1) return { rows: [] };

    if (hasStatusCol) {
      const [slug, name, region, capital, blurb, cover_url, highlights, best_time, status] = params;
      data.states[index] = {
        ...data.states[index],
        slug,
        name,
        region,
        capital,
        blurb,
        cover_url,
        highlights: Array.isArray(highlights) ? highlights : [],
        best_time,
        status: status || 'draft'
      };
    } else {
      const [slug, name, region, capital, blurb, cover_url, highlights, best_time] = params;
      data.states[index] = {
        ...data.states[index],
        slug,
        name,
        region,
        capital,
        blurb,
        cover_url,
        highlights: Array.isArray(highlights) ? highlights : [],
        best_time
      };
    }
    writeData(data);
    return { rows: [data.states[index]] };
  }

  // 9. DELETE FROM popular_cities WHERE state_id = $1
  if (/delete\s+from\s+popular_cities\s+where\s+state_id\s*=\s*\$1/i.test(normalized)) {
    const state_id = Number(params[0]);
    data.popular_cities = data.popular_cities.filter(c => c.state_id !== state_id);
    writeData(data);
    return { rows: [] };
  }

  // 10. DELETE FROM states WHERE id = $1
  if (/delete\s+from\s+states\s+where\s+id\s*=\s*\$1/i.test(normalized)) {
    const id = Number(params[0]);
    data.states = data.states.filter(s => s.id !== id);
    // Cascade delete popular_cities and places
    data.popular_cities = data.popular_cities.filter(c => c.state_id !== id);
    data.places = data.places.filter(p => p.state_id !== id);
    writeData(data);
    return { rows: [] };
  }

  // 11. SELECT p.id, p.slug, p.name, p.state_name, p.city, p.category, p.image_url, p.tagline, p.best_time, p.entry_fee, s.slug AS state_slug FROM places p LEFT JOIN states s ON p.state_id = s.id ... ORDER BY p.id ASC LIMIT ... OFFSET ...
  if (/select.*from\s+places\s+p\s+left\s+join\s+states\s+s/i.test(normalized)) {
    const hasPublishedFilter = /p\.status\s*=\s*'published'/i.test(normalized);
    // Process parameter-driven dynamic filters
    let filtered = data.places
      .filter(p => !hasPublishedFilter || p.status === 'published')
      .map(p => {
        const stateObj = data.states.find(s => s.id === p.state_id);
        return {
          ...p,
          state_slug: stateObj ? stateObj.slug : ''
        };
      });

    // Detect conditions from query text
    // E.g., "(LOWER(p.name) LIKE $1 OR LOWER(p.city) LIKE $1 OR LOWER(p.state_name) LIKE $1)"
    let qParamIdx = -1;
    let catParamIdx = -1;
    let stateParamIdx = -1;

    // We can deduce parameter roles from where they are referenced in SQL
    const qMatch = normalized.match(/like\s+\$(\d+)/i);
    if (qMatch) qParamIdx = Number(qMatch[1]) - 1;

    const catMatch = normalized.match(/p\.category\s*=\s*\$(\d+)/i);
    if (catMatch) catParamIdx = Number(catMatch[1]) - 1;

    const stateMatch = normalized.match(/s\.slug\s*=\s*\$(\d+)/i);
    if (stateMatch) stateParamIdx = Number(stateMatch[1]) - 1;

    if (qParamIdx !== -1 && params[qParamIdx]) {
      const searchVal = params[qParamIdx].replace(/%/g, '').toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchVal)) || 
        (p.city && p.city.toLowerCase().includes(searchVal)) || 
        (p.state_name && p.state_name.toLowerCase().includes(searchVal))
      );
    }

    if (catParamIdx !== -1 && params[catParamIdx]) {
      const catVal = params[catParamIdx];
      filtered = filtered.filter(p => p.category === catVal);
    }

    if (stateParamIdx !== -1 && params[stateParamIdx]) {
      const stateVal = params[stateParamIdx];
      filtered = filtered.filter(p => p.state_slug === stateVal);
    }

    // Sort by id ASC
    filtered.sort((a, b) => a.id - b.id);

    const hasLimit = /limit\s+\$/i.test(normalized);
    if (hasLimit) {
      // Limit & Offset are always the last two params
      const limit = Number(params[params.length - 2]);
      const offset = Number(params[params.length - 1]);
      filtered = filtered.slice(offset, offset + limit);
    }
    return { rows: filtered };
  }

  // 12. SELECT p.*, s.slug AS state_slug FROM places p LEFT JOIN states s ON p.state_id = s.id WHERE p.slug = $1
  if (/select\s+p\.\*\s*,\s*s\.slug\s+as\s+state_slug\s+from\s+places\s+p/i.test(normalized)) {
    const slug = params[0];
    const rows = data.places
      .filter(p => p.slug === slug)
      .map(p => {
        const stateObj = data.states.find(s => s.id === p.state_id);
        return {
          ...p,
          state_slug: stateObj ? stateObj.slug : ''
        };
      });
    return { rows };
  }

  // 13. SELECT id, slug, name, category, image_url, tagline FROM places WHERE state_id = $1 AND slug != $2 LIMIT 3
  if (/select.*from\s+places\s+where\s+state_id\s*=\s*\$1\s+and\s+slug\s*!=\s*\$2/i.test(normalized)) {
    const state_id = Number(params[0]);
    const slug = params[1];
    const hasPublishedFilter = /status\s*=\s*'published'/i.test(normalized);
    const rows = data.places
      .filter(p => p.state_id === state_id && p.slug !== slug && (!hasPublishedFilter || p.status === 'published'))
      .slice(0, 3);
    return { rows };
  }

  // 14. INSERT INTO places (slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby, status, trivia, travel_tip) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *
  if (/insert\s+into\s+places/i.test(normalized)) {
    const hasStatusCol = /status/i.test(normalized);
    const hasTriviaCol = /trivia/i.test(normalized);
    const newId = data.places.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    let newPlace;
    if (hasTriviaCol) {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby, status, trivia, travel_tip] = params;
      newPlace = {
        id: newId,
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : [],
        status: status || 'draft',
        trivia,
        travel_tip,
        created_at: new Date().toISOString()
      };
    } else if (hasStatusCol) {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby, status] = params;
      newPlace = {
        id: newId,
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : [],
        status: status || 'draft',
        created_at: new Date().toISOString()
      };
    } else {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby] = params;
      newPlace = {
        id: newId,
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : [],
        status: 'draft',
        created_at: new Date().toISOString()
      };
    }
    data.places.push(newPlace);
    writeData(data);
    return { rows: [newPlace] };
  }

  // 15. UPDATE places SET ... WHERE id=$15 RETURNING * / UPDATE places SET status=$1 WHERE id=$2
  if (/update\s+places\s+set/i.test(normalized)) {
    const isStatusUpdate = /status\s*=\s*\$1/i.test(normalized) && !/slug/i.test(normalized);
    if (isStatusUpdate) {
      const [status, id] = params;
      const placeId = Number(id);
      const index = data.places.findIndex(p => p.id === placeId);
      if (index === -1) return { rows: [] };
      data.places[index].status = status;
      writeData(data);
      return { rows: [data.places[index]] };
    }

    const hasTriviaCol = /trivia\s*=\s*\$/i.test(normalized);
    const hasStatusCol = /status\s*=\s*\$/i.test(normalized);
    const id = params[params.length - 1];
    const placeId = Number(id);
    const index = data.places.findIndex(p => p.id === placeId);
    if (index === -1) return { rows: [] };

    if (hasTriviaCol) {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby, status, trivia, travel_tip] = params;
      data.places[index] = {
        ...data.places[index],
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : [],
        status: status || 'draft',
        trivia,
        travel_tip
      };
    } else if (hasStatusCol) {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby, status] = params;
      data.places[index] = {
        ...data.places[index],
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : [],
        status: status || 'draft'
      };
    } else {
      const [slug, name, state_id, state_name, city, category, image_url, tagline, description, best_time, timings, entry_fee, map_link, nearby] = params;
      data.places[index] = {
        ...data.places[index],
        slug,
        name,
        state_id: Number(state_id),
        state_name,
        city,
        category,
        image_url,
        tagline,
        description,
        best_time,
        timings,
        entry_fee,
        map_link,
        nearby: Array.isArray(nearby) ? nearby : []
      };
    }
    writeData(data);
    return { rows: [data.places[index]] };
  }

  // 16. DELETE FROM places WHERE id = $1
  if (/delete\s+from\s+places\s+where\s+id\s*=\s*\$1/i.test(normalized)) {
    const id = Number(params[0]);
    data.places = data.places.filter(p => p.id !== id);
    writeData(data);
    return { rows: [] };
  }

  // 18. SELECT image_url FROM place_images WHERE place_id = $1
  if (/select\s+image_url\s+from\s+place_images\s+where\s+place_id\s*=\s*\$1/i.test(normalized)) {
    const place_id = Number(params[0]);
    const rows = (data.place_images || []).filter(img => img.place_id === place_id);
    return { rows };
  }

  // 19. INSERT INTO place_images (place_id, image_url) VALUES ($1, $2)
  if (/insert\s+into\s+place_images/i.test(normalized)) {
    const [place_id, image_url] = params;
    if (!data.place_images) data.place_images = [];
    const newId = data.place_images.reduce((max, img) => Math.max(max, img.id), 0) + 1;
    const newImg = {
      id: newId,
      place_id: Number(place_id),
      image_url
    };
    data.place_images.push(newImg);
    writeData(data);
    return { rows: [newImg] };
  }

  // 20. DELETE FROM place_images WHERE place_id = $1
  if (/delete\s+from\s+place_images\s+where\s+place_id\s*=\s*\$1/i.test(normalized)) {
    const place_id = Number(params[0]);
    data.place_images = (data.place_images || []).filter(img => img.place_id !== place_id);
    writeData(data);
    return { rows: [] };
  }

  // 17. Transactions/DUMMY support
  if (/begin|commit|rollback/i.test(normalized)) {
    return { rows: [] };
  }

  console.warn(`[JSON DB] Query not matched, returning empty array: "${normalized}"`, params);
  return { rows: [] };
}

module.exports = {
  query,
  readData,
  writeData
};
