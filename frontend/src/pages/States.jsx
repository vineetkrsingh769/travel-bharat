import React, { useEffect, useState, useRef } from 'react';
import { statesService } from '../services/states';
import IndiaMap from '../components/IndiaMap';
import StateCard from '../components/StateCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { REGIONS } from '../constants/tourism';

export default function States() {
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hoveredStateSlug, setHoveredStateSlug] = useState(null);
  const cardRefs = useRef({});
  const hoverFromMap = useRef(false);

  useEffect(() => {
    statesService.getAll()
      .then(setStates)
      .catch(() => setError('Could not load states.'))
      .finally(() => setLoading(false));
  }, []);

  useScrollReveal([loading]);

  useEffect(() => {
    if (!hoverFromMap.current || !hoveredStateSlug) return;
    const el = cardRefs.current[hoveredStateSlug];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [hoveredStateSlug]);

  const handleMapHover = (slug) => {
    hoverFromMap.current = true;
    setHoveredStateSlug(slug);
  };

  const handleCardHover = (slug) => {
    hoverFromMap.current = false;
    setHoveredStateSlug(slug);
  };

  const grouped = REGIONS.reduce((acc, region) => {
    const list = states.filter(s => s.region === region);
    if (list.length) acc[region] = list;
    return acc;
  }, {});

  return (
    <div>
      <header className="container-prose pt-8 md:pt-12 pb-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <div className="eyebrow">The atlas</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl text-ink tracking-tight">
            States &amp; Regions
          </h1>
          <p className="mt-5 text-ink/90 leading-relaxed font-sans text-base max-w-xl">
            Explore India by region. Hover the map to jump to a state card, or browse the grouped index below.
          </p>
        </div>
        <div className="w-full">
          <IndiaMap hoveredStateSlug={hoveredStateSlug} onHoverState={handleMapHover} />
        </div>
      </header>

      <section className="container-prose pb-20 md:pb-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 border border-border/40 p-5 rounded-xl h-40" />
            ))}
          </div>
        ) : error ? (
          <p className="text-muted-foreground">{error}</p>
        ) : (
          <div className="space-y-14">
            {REGIONS.map(region => {
              const regionStates = grouped[region];
              if (!regionStates) return null;
              return (
                <div key={region} className="scroll-reveal">
                  <div className="flex items-baseline gap-4 mb-6 border-b border-border/40 pb-3">
                    <h2 className="font-serif text-2xl md:text-3xl text-ink tracking-tight">{region}</h2>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {regionStates.length} {regionStates.length === 1 ? 'state' : 'states'}
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {regionStates.map(s => (
                      <StateCard
                        key={s.slug}
                        state={s}
                        highlighted={hoveredStateSlug === s.slug}
                        innerRef={(el) => { cardRefs.current[s.slug] = el; }}
                        onMouseEnter={() => handleCardHover(s.slug)}
                        onMouseLeave={() => setHoveredStateSlug(null)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
