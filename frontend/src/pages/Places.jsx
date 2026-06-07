import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { placesService } from '../services/places';
import useScrollReveal from '../hooks/useScrollReveal';

const CATEGORIES = ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach'];

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const q   = searchParams.get('q') || '';
  const cat = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (cat !== 'All') params.category = cat;
    placesService.getAll(params)
      .then(setPlaces)
      .catch(() => setError('Could not load destinations.'))
      .finally(() => setLoading(false));
  }, [q, cat]);

  useScrollReveal([q, cat, loading]);

  function setQ(val) {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('q', val); else next.delete('q');
    setSearchParams(next);
  }
  function setCat(val) {
    const next = new URLSearchParams(searchParams);
    if (val !== 'All') next.set('category', val); else next.delete('category');
    setSearchParams(next);
  }

  return (
    <div>
      <header className="container-prose pt-20 md:pt-28 pb-10">
        <div className="eyebrow">The index</div>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl text-ink tracking-tight">All destinations</h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Every place currently catalogued, in one place. Search by name, city or state — or narrow by category.
        </p>
      </header>

      {/* Sticky filter bar */}
      <section className="border-y border-border bg-cream sticky top-16 z-30">
        <div className="container-prose py-5 flex flex-wrap items-center gap-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search places, cities, states…"
            className="flex-1 min-w-[14rem] bg-white border border-border px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-terracotta"
          />
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs uppercase tracking-[0.18em] px-3.5 py-2 rounded-sm border transition-colors ${
                  cat === c
                    ? 'bg-terracotta text-cream border-terracotta'
                    : 'border-border text-muted-foreground hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose py-16">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 border border-border/40 p-5 rounded-xl">
                <div className="w-full aspect-[4/3] bg-muted rounded-lg" />
                <div className="mt-4 h-3 bg-muted rounded w-1/3" />
                <div className="mt-2 h-5 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-muted-foreground">{error}</p>
        ) : places.length === 0 ? (
          <p className="text-muted-foreground">No destinations match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {places.map(p => (
              <Link
                to={`/places/${p.slug}`}
                key={p.slug}
                className="group journal-card bg-white flex flex-col justify-between rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal"
              >
                <div>
                  <div className="overflow-hidden aspect-[4/3] bg-black/5 relative rounded-t-xl">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-forest text-cream text-[0.58rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-5 font-sans">
                    <div className="flex justify-between items-center text-[0.62rem] uppercase tracking-wider text-terracotta font-bold mb-1.5">
                      <span>{p.city}</span>
                      <span className="text-muted-foreground font-normal normal-case">{p.state_name}</span>
                    </div>
                    <h3 className="font-serif text-xl leading-tight text-ink group-hover:text-terracotta transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[0.7rem] text-ink/80 line-clamp-2 leading-relaxed italic">{p.tagline}</p>
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-3 border-t border-border/20 flex flex-col gap-2 text-[0.68rem] text-[#4E3E2F] font-sans">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{p.best_time}</span>
                    </div>
                    <span className="bg-[#FAF5EC] px-2 py-0.5 rounded border border-border/40 text-[0.6rem] font-medium font-mono shrink-0">
                      {p.entry_fee.split(' · ')[0]}
                    </span>
                  </div>
                  {p.nearby && p.nearby.length > 0 && (
                    <div className="flex items-center gap-1 text-[0.62rem] text-[#4E3E2F]/80 overflow-hidden text-ellipsis whitespace-nowrap pt-1 border-t border-border/10">
                      <span className="font-bold text-terracotta mr-0.5">Nearby:</span>
                      <span className="truncate">{p.nearby.slice(0, 2).join(" · ")}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
