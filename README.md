# TravelBharat — Explore India State by State

**TravelBharat** is a centralized tourism information platform designed to serve as a digital travel encyclopedia of India. It provides structured, state-wise, and city-wise listings of tourist destinations, featuring rich visual galleries, practical guides, historical insights, and an administrative panel for secure content moderation.

This project resolves scattered, inconsistent tourism details across multiple channels by providing a single, highly readable web application showcasing heritage, nature, religious, adventure, and beach destinations.

---

## 🗺️ Interactive Live Demo Preview
The platform features a **Split-Screen Interactive Atlas Hero** directly at the landing section:
- **Interactive Map Exploration**: An inline, high-fidelity SVG map of India that serves as the entry portal. Hovering over any state dynamically updates the viewport with its capital, region, blurb, and travel highlights in real-time.
- **Dynamic Backgrounds**: The hero banner cover image fades and changes dynamically to match the highlighted state.
- **Dense States Directory**: Lists details, capitals, and quick navigation links for all cataloged states in a compact grid structure.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, Vite 5 |
| **Styling** | Tailwind CSS v3, Google Fonts (Cormorant Garamond + Plus Jakarta Sans) |
| **Backend** | Node.js, Express.js 4 |
| **Database** | PostgreSQL (Production/Dev) + Simulated JSON Database Fallback |
| **Security & Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

### 💡 Dual-Database Resiliency Layer
The backend utilizes a unique database fallback router:
- **PostgreSQL**: Used as the primary relational database layer.
- **JSON Fallback**: If `DATABASE_URL` is missing or the PostgreSQL connection drops, the system transparently switches to a simulated SQL query engine (`jsonDb.js`) which parses and writes data locally to a JSON file (`db_store.json`), allowing offline/independent local development.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL instance running locally (optional; falls back to local JSON files if unavailable)

### 1. Database & Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the sample environment template:
   ```bash
   cp .env.example .env
   ```
3. Set your PostgreSQL connection URL and JWT secret inside `.env`:
   ```env
   PORT=4000
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/travelbharat
   JWT_SECRET=your-random-jwt-key
   FRONTEND_URL=http://localhost:5173
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Migrate tables & Seed starting data (11 states + 19 places + default administrator):
   ```bash
   npm run seed
   ```
6. Start the API server:
   ```bash
   npm run dev
   ```
   The backend will run at `http://localhost:4000`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Copy the sample environment template:
   ```bash
   cp .env.example .env
   ```
3. Verify that `VITE_API_URL` points to your backend instance:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
4. Install packages:
   ```bash
   npm install
   ```
5. Launch the local dev server:
   ```bash
   npm run dev
   ```
   The frontend application will launch at `http://localhost:5173`.

---

## 🔑 Administrator Access
To access content management operations (Create, Update, Delete destinations or states):
1. Navigate to `/admin/login`
2. Authenticate using the administrator account seeded during the database setup phase.
3. Upon login, the session token is validated, granting access to the administrative dashboard grids, state registration sheets, and place creation forms.

---

## 📡 API Reference Catalog

### Public Information Routes
- `GET /api/states` — Lists all published states (capital, region, cover, highlights).
- `GET /api/states/:slug` — Gets detailed state records, including child cities and destination grids.
- `GET /api/places` — Lists all published destinations (supports querying: `?q=&category=&state=`).
- `GET /api/places/:slug` — Gets detailed destination descriptions, timelines, tips, and related places.

### Protected Administrative Routes (JWT Bearer Token Required)
- `POST /api/auth/login` — Verifies administrator credentials and returns a session JWT.
- `GET /api/auth/verify` — Validates admin token integrity.
- `POST /api/states` | `PUT /api/states/:id` | `DELETE /api/states/:id` — CRUD operations for states.
- `POST /api/places` | `PUT /api/places/:id` | `DELETE /api/places/:id` — CRUD operations for destinations.
- `PATCH /api/places/:id/status` — Updates status states (`draft`, `pending`, `published`).

