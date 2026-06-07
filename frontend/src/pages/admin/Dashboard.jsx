import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';

function StatCard({ label, value, to, color }) {
  return (
    <Link to={to} className="block bg-white/5 hover:bg-white/8 border border-white/10 rounded-lg p-6 transition-colors group">
      <div className={`text-3xl font-serif font-semibold ${color}`}>{value}</div>
      <div className="mt-1 text-sm text-cream/50 uppercase tracking-widest">{label}</div>
      <div className="mt-3 text-xs text-cream/30 group-hover:text-cream/60 transition-colors">View all →</div>
    </Link>
  );
}

const CATEGORY_COLORS = {
  Heritage: 'bg-amber-500/20 text-amber-300',
  Nature:   'bg-green-500/20 text-green-300',
  Religious:'bg-purple-500/20 text-purple-300',
  Adventure:'bg-blue-500/20 text-blue-300',
  Beach:    'bg-cyan-500/20 text-cyan-300',
};

export default function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([placesService.getAll(), statesService.getAll()])
      .then(([p, s]) => { setPlaces(p); setStates(s); })
      .finally(() => setLoading(false));
  }, []);

  // Category breakdown
  const byCat = places.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-cream/40">Overview of your TravelBharat content</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Places" value={places.length}  to="/admin/places" color="text-saffron" />
            <StatCard label="Total States" value={states.length}  to="/admin/states" color="text-green-400" />
            <StatCard label="Categories"   value={Object.keys(byCat).length} to="/admin/places" color="text-blue-400" />
            <StatCard label="Regions"      value={[...new Set(states.map(s => s.region))].length} to="/admin/states" color="text-purple-400" />
          </div>

          {/* Category breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h2 className="font-serif text-lg text-cream mb-4">Places by category</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(byCat).map(([cat, count]) => (
                <Link
                  key={cat}
                  to={`/admin/places?category=${cat}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${CATEGORY_COLORS[cat] || 'bg-white/10 text-cream/70'}`}
                >
                  {cat} ({count})
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="font-serif text-lg text-cream mb-4">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/places/new" className="bg-saffron/90 hover:bg-saffron text-ink text-sm font-medium px-4 py-2 rounded-md transition-colors">
                + Add new place
              </Link>
              <Link to="/admin/states/new" className="bg-white/10 hover:bg-white/15 text-cream text-sm font-medium px-4 py-2 rounded-md transition-colors">
                + Add new state
              </Link>
              <Link to="/" target="_blank" className="bg-white/5 hover:bg-white/10 text-cream/60 text-sm px-4 py-2 rounded-md transition-colors">
                View site ↗
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
