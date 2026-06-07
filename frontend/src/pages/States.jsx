import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statesService } from '../services/states';
import IndiaMap from '../components/IndiaMap';
import useScrollReveal from '../hooks/useScrollReveal';

export default function States() {
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hoveredStateSlug, setHoveredStateSlug] = useState(null);

  useEffect(() => {
    statesService.getAll()
      .then(setStates)
      .catch(() => setError('Could not load states.'))
      .finally(() => setLoading(false));
  }, []);

  useScrollReveal([loading]);

  return (
    <div>
      <header className="container-prose pt-20 md:pt-28 pb-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <div className="eyebrow">The atlas</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-ink tracking-tight">
            States &amp; Regions
          </h1>
          <p className="mt-6 text-ink/90 leading-relaxed font-sans text-base">
            An exploration of India's diverse regions, cataloged by regional terrain, historical architecture, and seasonal highlights. Hover over the interactive map to begin charting your journey through the states, or browse the editorial indexes below.
          </p>
        </div>
        <div className="w-full">
          <IndiaMap hoveredStateSlug={hoveredStateSlug} onHoverState={setHoveredStateSlug} />
        </div>
      </header>

      <section className="container-prose pb-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 border border-border/40 p-5 rounded-xl">
                <div className="w-full aspect-[4/5] bg-muted rounded-lg" />
                <div className="mt-5 h-3 bg-muted rounded w-1/3" />
                <div className="mt-2 h-6 bg-muted rounded w-2/3" />
                <div className="mt-2 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-muted-foreground">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {states.map(s => (
              <Link 
                to={`/states/${s.slug}`} 
                key={s.slug} 
                className={`group journal-card p-5 bg-white flex flex-col justify-between rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal ${
                  hoveredStateSlug === s.slug ? 'border-terracotta bg-white shadow-xl -translate-y-1' : ''
                }`}
                onMouseEnter={() => setHoveredStateSlug(s.slug)}
                onMouseLeave={() => setHoveredStateSlug(null)}
              >
                <div>
                  <div className="overflow-hidden rounded-lg shadow-sm aspect-[4/5]">
                    <img
                      src={s.cover_url}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[0.62rem] font-bold uppercase tracking-widest text-terracotta">
                        {s.region} India
                      </span>
                      <span className="text-[0.62rem] font-semibold text-muted-foreground bg-[#FAF5EC] border border-border/40 px-2 py-0.5 rounded">
                        Cap: {s.capital}
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-2xl text-ink group-hover:text-terracotta transition-colors leading-tight">
                      {s.name}
                    </h2>
                    <p className="mt-2 text-xs text-ink/80 leading-relaxed line-clamp-3 font-sans">{s.blurb}</p>
                    
                    {s.highlights && s.highlights.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-border/40">
                        <div className="text-[0.58rem] font-bold uppercase tracking-wider text-[#4E3E2F] mb-1.5">Highlights</div>
                        <ul className="space-y-1.5 text-[0.68rem] text-ink/90 font-sans">
                          {s.highlights.slice(0, 2).map((h, idx) => (
                            <li key={idx} className="flex gap-1.5 items-start">
                              <span className="w-1.5 h-1.5 bg-saffron rounded-full shrink-0 mt-1" />
                              <span className="truncate" title={h}>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-border/20 flex items-center gap-1.5 text-[0.68rem] text-[#4E3E2F] font-sans font-medium">
                  <svg className="w-3.5 h-3.5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">Best time: {s.best_time.split(' (')[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
