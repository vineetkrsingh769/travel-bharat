import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';

function StatCard({ label, value, to, color, icon, detail, borderAccent }) {
  return (
    <Link to={to} className={`relative overflow-hidden block bg-white dark:bg-[#121316] hover:bg-gradient-to-br hover:from-white hover:to-[#FAF0E1]/40 dark:hover:from-[#121316] dark:hover:to-white/2 border border-[#DDD0B8]/80 dark:border-white/10 ${borderAccent} rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-100 group`}>
      {/* Decorative background glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-saffron/5 dark:bg-saffron/10 filter blur-xl transition-all group-hover:scale-125" />
      
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-4xl font-serif font-black tracking-tight ${color}`}>{value}</div>
          <div className="mt-1.5 text-[11px] text-ink/50 dark:text-cream/50 uppercase tracking-widest font-bold">{label}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF5EC] dark:bg-white/5 border border-[#DDD0B8]/40 dark:border-white/5 transition-all group-hover:border-saffron/20 shadow-inner shrink-0">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-[#DDD0B8]/40 dark:border-white/5 pt-3">
        <span className="text-[10px] text-ink/40 dark:text-cream/40 font-medium group-hover:text-ink/60 group-hover:dark:text-cream/60 transition-colors">{detail}</span>
        <span className="text-xs text-saffron opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0 font-bold">➔</span>
      </div>
    </Link>
  );
}

const CATEGORY_COLORS = {
  Heritage:  { bar: 'bg-gradient-to-r from-amber-500 to-saffron',         bg: 'bg-amber-500/10' },
  Nature:    { bar: 'bg-gradient-to-r from-green-400 to-forest',          bg: 'bg-green-500/10' },
  Religious: { bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',     bg: 'bg-purple-500/10' },
  Adventure: { bar: 'bg-gradient-to-r from-blue-400 to-blue-600',         bg: 'bg-blue-500/10' },
  Beach:     { bar: 'bg-gradient-to-r from-cyan-400 to-teal-500',         bg: 'bg-cyan-500/10' },
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
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[#FAF5EC] dark:bg-white/5 border border-[#DDD0B8]/40 dark:border-white/10 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              label="Total Places" 
              value={places.length}  
              to="/admin/places" 
              color="text-saffron"
              icon={(
                <svg className="w-6 h-6 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              detail="Exploration places listed"
              borderAccent="border-l-4 border-l-saffron"
            />
            <StatCard 
              label="Total States" 
              value={states.length}  
              to="/admin/states" 
              color="text-forest dark:text-green-400"
              icon={(
                <svg className="w-6 h-6 text-forest dark:text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
              detail="States & UT territories"
              borderAccent="border-l-4 border-l-forest dark:border-l-green-400"
            />
            <StatCard 
              label="Categories"   
              value={Object.keys(byCat).length} 
              to="/admin/places" 
              color="text-sky-600 dark:text-blue-400"
              icon={(
                <svg className="w-6 h-6 text-sky-600 dark:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              detail="Unique travel categories"
              borderAccent="border-l-4 border-l-terracotta"
            />
            <StatCard 
              label="Regions"      
              value={[...new Set(states.map(s => s.region))].length} 
              to="/admin/states" 
              color="text-purple-650 dark:text-purple-400"
              icon={(
                <svg className="w-6 h-6 text-purple-650 dark:text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1v2.5M4 7l2-1M4 7l2 1M4 7v2.5M10 21l2-1 2 1v-2.5M6 18l2-1v-2.5M18 18l-2-1v-2.5" />
                </svg>
              )}
              detail="Indian regions represented"
              borderAccent="border-l-4 border-l-saffron"
            />
          </div>

          {/* Category breakdown progress bars */}
          <div className="bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl p-6 mb-8 shadow-sm">
            <h2 className="font-serif text-xl text-ink dark:text-cream mb-5">Destinations by category</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {Object.entries(byCat).map(([cat, count]) => {
                const percentage = places.length ? Math.round((count / places.length) * 100) : 0;
                const colors = CATEGORY_COLORS[cat] || { bar: 'bg-gradient-to-r from-saffron to-terracotta' };
                return (
                  <Link
                    key={cat}
                    to={`/admin/places?category=${cat}`}
                    className="block p-4 rounded-xl bg-[#FAF5EC]/30 dark:bg-white/2 hover:bg-[#FAF5EC]/60 dark:hover:bg-white/4 border border-[#DDD0B8]/40 dark:border-white/5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-bold text-ink/80 dark:text-cream/80 group-hover:text-saffron transition-colors">{cat}</span>
                      <span className="text-xs font-bold text-ink/55 dark:text-cream/50">{count} places ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-ink/5 dark:bg-white/10 rounded-full shadow-inner ring-1 ring-black/5 dark:ring-white/5 overflow-hidden">
                      <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <Link to="/admin/places/new" className="relative overflow-hidden flex flex-col p-5 bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-100 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-saffron/10 rounded-bl-full shrink-0" />
              <div className="w-10 h-10 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center mb-4 font-bold text-lg shrink-0">
                +
              </div>
              <h3 className="font-serif text-lg text-ink dark:text-cream font-bold mb-1">Add Place</h3>
              <p className="text-xs text-ink/50 dark:text-cream/40 leading-relaxed mb-4 flex-grow">Create a new destination page with slideshow images, tagline, maps location, custom tips & trivia.</p>
              <div className="text-xs font-bold text-saffron flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Get started <span className="text-sm">➔</span>
              </div>
            </Link>

            <Link to="/admin/states/new" className="relative overflow-hidden flex flex-col p-5 bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-100 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full shrink-0" />
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-605 dark:text-green-400 flex items-center justify-center mb-4 font-bold text-lg shrink-0">
                +
              </div>
              <h3 className="font-serif text-lg text-ink dark:text-cream font-bold mb-1">Add State</h3>
              <p className="text-xs text-ink/50 dark:text-cream/40 leading-relaxed mb-4 flex-grow">Register a state or UT, specify region boundaries, capital info, highlights checklist, and best visiting months.</p>
              <div className="text-xs font-bold text-emerald-600 dark:text-green-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Get started <span className="text-sm">➔</span>
              </div>
            </Link>

            <a href="/" target="_blank" rel="noreferrer" className="relative overflow-hidden flex flex-col p-5 bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-100 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/10 rounded-bl-full shrink-0" />
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 font-bold text-lg shrink-0">
                ↗
              </div>
              <h3 className="font-serif text-lg text-ink dark:text-cream font-bold mb-1">Guest Site</h3>
              <p className="text-xs text-ink/50 dark:text-cream/40 leading-relaxed mb-4 flex-grow">Open the public exploration dashboard in a new tab to see dynamic state maps and destination directory pages.</p>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open guest view <span className="text-sm">➔</span>
              </div>
            </a>
          </div>

          {/* Recent additions & activity log */}
          <div className="bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-ink dark:text-cream">Recent Additions</h2>
              <Link to="/admin/places" className="text-xs font-semibold text-saffron hover:underline">Manage all places →</Link>
            </div>
            
            <div className="divide-y divide-[#DDD0B8]/40 dark:divide-white/5">
              {[...places].reverse().slice(0, 3).map(p => (
                <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-14 h-10 object-cover rounded-lg border border-[#DDD0B8]/50 dark:border-white/5 shrink-0 shadow-sm" />
                    <div>
                      <div className="font-bold text-sm text-ink dark:text-cream">{p.name}</div>
                      <div className="text-xs text-ink/40 dark:text-cream/40 mt-0.5">{p.city}, {p.state_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider border uppercase ${
                      p.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20' 
                        : p.status === 'pending'
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                        : 'bg-zinc-500/10 text-zinc-650 dark:text-zinc-400 border-zinc-500/20'
                    }`}>
                      {p.status || 'draft'}
                    </span>
                    <Link to={`/admin/places/${p.id}`} className="text-xs font-bold text-saffron hover:underline">Edit</Link>
                  </div>
                </div>
              ))}
              {places.length === 0 && (
                <div className="py-6 text-center text-xs text-ink/30 dark:text-cream/30">No destinations registered yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
