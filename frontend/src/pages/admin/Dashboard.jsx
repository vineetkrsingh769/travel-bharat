import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';

function StatCard({ label, value, to, color }) {
  return (
    <Link to={to} className="block bg-white dark:bg-white/5 hover:bg-[#FAF5EC]/30 dark:hover:bg-white/8 border border-[#DDD0B8] dark:border-white/10 rounded-lg p-6 transition-all duration-200 shadow-sm hover:shadow group">
      <div className={`text-3xl font-serif font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-ink/60 dark:text-cream/50 uppercase tracking-widest font-semibold">{label}</div>
      <div className="mt-3 text-xs text-ink/40 dark:text-cream/30 group-hover:text-ink/75 group-hover:dark:text-cream/65 transition-colors">View all →</div>
    </Link>
  );
}

const CATEGORY_COLORS = {
  Heritage: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/20 dark:border-transparent',
  Nature:   'bg-green-500/10 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-500/20 dark:border-transparent',
  Religious:'bg-purple-500/10 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/20 dark:border-transparent',
  Adventure:'bg-blue-500/10 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/20 dark:border-transparent',
  Beach:    'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 dark:border-transparent',
};

export default function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([placesService.getAllAdmin(), statesService.getAllAdmin()])
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
        <h1 className="font-serif text-3xl text-ink dark:text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/50 dark:text-cream/40">Overview of your TravelBharat content</p>
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
            <StatCard label="Total States" value={states.length}  to="/admin/states" color="text-emerald-600 dark:text-green-400" />
            <StatCard label="Categories"   value={Object.keys(byCat).length} to="/admin/places" color="text-sky-600 dark:text-blue-400" />
            <StatCard label="Regions"      value={[...new Set(states.map(s => s.region))].length} to="/admin/states" color="text-purple-600 dark:text-purple-400" />
          </div>

          {/* Category breakdown */}
          <div className="bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="font-serif text-lg text-ink dark:text-cream mb-4">Places by category</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(byCat).map(([cat, count]) => (
                <Link
                  key={cat}
                  to={`/admin/places?category=${cat}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[cat] || 'bg-white/10 text-cream/70'}`}
                >
                  {cat} ({count})
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-lg text-ink dark:text-cream mb-4">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/places/new" className="bg-saffron hover:bg-saffron/90 text-white dark:text-ink text-sm font-semibold px-4 py-2 rounded-md transition-colors shadow-sm">
                + Add new place
              </Link>
              <Link to="/admin/states/new" className="bg-[#FAF5EC] hover:bg-[#EDE5D4] dark:bg-white/10 dark:hover:bg-white/15 text-ink dark:text-cream text-sm font-medium px-4 py-2 rounded-md border border-[#DDD0B8] dark:border-white/10 transition-colors shadow-sm">
                + Add new state
              </Link>
              <Link to="/" target="_blank" className="bg-[#FAF5EC]/50 hover:bg-[#EDE5D4]/50 dark:bg-white/5 dark:hover:bg-white/10 text-ink/60 dark:text-cream/60 text-sm px-4 py-2 rounded-md border border-[#DDD0B8]/60 dark:border-white/10 transition-colors">
                View site ↗
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
