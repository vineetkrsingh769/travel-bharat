import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placesService } from '../services/places';
import { statesService } from '../services/states';
import IndiaMap from '../components/IndiaMap';
import { PLACE_CATEGORIES } from '../constants/tourism';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  const [places, setPlaces]   = useState([]);
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredStateSlug, setHoveredStateSlug] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([placesService.getAll(), statesService.getAll()])
      .then(([p, s]) => { setPlaces(p); setStates(s); })
      .finally(() => setLoading(false));
  }, []);

  useScrollReveal([loading]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/places?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featured  = places[0];
  const secondary = places.slice(1, 4);
  const more      = places.slice(4, 8);

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-forest text-cream py-16 md:py-24 border-b border-border/20">
        {/* Background visual texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF5EC_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Hovered State Cover image fade-in background */}
        {(() => {
          const activeState = hoveredStateSlug ? states.find(s => s.slug === hoveredStateSlug) : null;
          return (
            <div className="absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none z-0">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
                style={{ 
                  backgroundImage: `url(${activeState ? activeState.cover_url : '/assets/hero-india.jpg'})`,
                  opacity: activeState ? 0.65 : 0.4 
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/75" />
            </div>
          );
        })()}

        <div className="relative container-prose w-full z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left Column: Interactive Editorial content */}
          <div className="flex flex-col justify-center min-h-[400px]">
            {(() => {
              const activeState = hoveredStateSlug ? states.find(s => s.slug === hoveredStateSlug) : null;
              if (activeState) {
                return (
                  <div className="animate-fadeIn space-y-6">
                    <div className="eyebrow text-saffron">
                      <span className="rule bg-saffron" /> Live Atlas Focus
                    </div>
                    <div className="text-xs uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded border border-white/20 inline-block font-sans font-bold">
                      {activeState.region} India · Capital: {activeState.capital}
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl leading-none text-cream tracking-tight">
                      {activeState.name}
                    </h1>
                    <p className="text-base md:text-lg text-cream/90 font-serif italic max-w-xl leading-relaxed">
                      "{activeState.blurb}"
                    </p>
                    
                    {activeState.highlights && activeState.highlights.length > 0 && (
                      <div className="bg-white/5 border border-white/10 p-5 rounded-xl max-w-xl">
                        <div className="text-[0.62rem] font-bold uppercase tracking-wider text-saffron mb-3">Highlights Preview</div>
                        <ul className="space-y-2 text-xs md:text-sm text-cream/90 font-sans">
                          {activeState.highlights.slice(0, 3).map((h, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 bg-saffron rounded-full shrink-0 mt-2" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Link 
                        to={`/states/${activeState.slug}`}
                        className="bg-saffron hover:bg-saffron/90 text-ink font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-2"
                      >
                        Explore {activeState.name} →
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  <div className="eyebrow text-saffron">
                    <span className="rule bg-saffron" /> Volume 01 · TravelBharat
                  </div>
                  <h1 className="font-serif text-5xl md:text-8xl leading-tight text-cream tracking-tight">
                    Explore India,<br />
                    <span className="italic font-serif text-saffron">state by state.</span>
                  </h1>
                  <p className="max-w-xl text-base md:text-lg text-cream/90 leading-relaxed font-sans">
                    A digital chronicle of Indian tourism. Discover verified travel guides, historical sites, and regional highlights by hovering over the interactive map index.
                  </p>
                  
                  {/* Search Console */}
                  <form onSubmit={handleSearch} className="w-full max-w-xl pt-2">
                    <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20 rounded-full transition-all duration-300 shadow-lg p-1.5">
                      <input
                        type="text"
                        placeholder="Search destinations, states, or cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-cream placeholder-cream/60 px-5 py-3 focus:outline-none text-base rounded-full"
                      />
                      <button
                        type="submit"
                        className="bg-saffron hover:bg-saffron/90 text-ink font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-colors duration-300 shadow-md whitespace-nowrap"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Categories */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <span className="text-[0.62rem] uppercase tracking-widest text-cream/60 mr-1.5">Quick Filters:</span>
                    {PLACE_CATEGORIES.map(cat => (
                      <Link
                        key={cat}
                        to={`/places?category=${cat}`}
                        className="text-[0.62rem] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-cream px-3.5 py-1.5 rounded-full transition-all duration-300"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Column: Live Map framed block */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[500px] bg-white border border-border/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden transition-all duration-500 hover:border-saffron/30">
              {/* Background card texture overlay */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1A1511_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 text-[0.62rem] uppercase tracking-widest text-[#4E3E2F] font-bold font-sans">
                  <span>Interactive Map Index</span>
                  <span className="text-saffron">Hover to inspect</span>
                </div>
                <IndiaMap hoveredStateSlug={hoveredStateSlug} onHoverState={setHoveredStateSlug} />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── MASTHEAD STRIP ── */}
      <section className="border-y border-border bg-cream/50 shadow-inner backdrop-blur-sm">
        <div className="container-prose py-6 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-semibold">
          <span>{states.length} States &amp; UTs</span>
          <span className="hidden md:inline">{places.length} Destinations</span>
          <span className="hidden md:inline">5 Categories</span>
          <span>Updated · 2026</span>
        </div>
      </section>

      {/* ── FEATURED GRID ── */}
      {!loading && featured && (
        <section className="container-prose py-24 md:py-32 scroll-reveal">
          <div className="flex items-baseline justify-between mb-16 flex-wrap gap-4 border-b border-border/40 pb-6">
            <div>
              <div className="eyebrow">Spotlight</div>
              <h2 className="mt-3 font-serif text-4xl md:text-6xl text-ink tracking-tight">Featured Collections</h2>
            </div>
            <Link 
              to="/places" 
              className="text-sm font-bold text-terracotta hover:text-terracotta/80 border-b-2 border-terracotta/20 hover:border-terracotta pb-1 transition-all duration-300"
            >
              See all {places.length} destinations →
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Lead story card */}
            <Link 
              to={`/places/${featured.slug}`} 
              className="group lg:col-span-3 flex flex-col bg-white border border-border/40 hover:border-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="overflow-hidden aspect-[16/10] bg-black/5 relative">
                <img
                  src={featured.image_url}
                  alt={featured.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-terracotta text-cream text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-sm font-bold shadow-md">
                  Featured
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="eyebrow text-terracotta mb-3">
                    {featured.category}<span className="rule" />{featured.state_name}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-ink leading-tight group-hover:text-terracotta transition-colors">
                    {featured.name}
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed font-sans text-base">
                    {featured.tagline}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-border/30 text-xs uppercase tracking-widest font-bold text-terracotta group-hover:text-ink transition-colors flex items-center gap-1">
                  Read Editorial Guide <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                </div>
              </div>
            </Link>

            {/* 3 sidebar cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {secondary.map(p => (
                <Link
                  to={`/places/${p.slug}`}
                  key={p.slug}
                  className="group bg-white hover:bg-white/80 border border-border/40 hover:border-terracotta rounded-xl overflow-hidden shadow-sm hover:shadow-md p-4 transition-all duration-300 grid grid-cols-[6.5rem_1fr] gap-5 items-center"
                >
                  <div className="overflow-hidden aspect-square rounded-lg bg-black/5 shadow-inner">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-widest text-terracotta font-bold mb-1">{p.category}</div>
                    <h4 className="font-serif text-lg md:text-xl font-semibold leading-snug text-ink group-hover:text-terracotta transition-colors">{p.name}</h4>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground font-sans">
                      <span>{p.city}, {p.state_name}</span>
                      <div className="flex items-center gap-1.5 text-[0.68rem] text-saffron">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{p.best_time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PULL QUOTE ── */}
      <section className="bg-forest text-cream border-y border-border/20 relative overflow-hidden scroll-reveal">
        {/* Background visual texture */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF5EC_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container-prose py-24 md:py-32 text-center relative z-10">
          <span className="text-6xl font-serif text-saffron leading-none block mb-6">“</span>
          <p className="font-serif italic text-2xl md:text-4xl text-cream/95 max-w-4xl mx-auto leading-relaxed px-4">
            India is not, as people keep calling it, an underdeveloped country, but rather, in the context of its history and cultural heritage, a highly developed one in an advanced state of decay.
          </p>
          <div className="mt-8 eyebrow justify-center text-saffron font-bold text-xs uppercase tracking-widest">
            — Shashi Tharoor
          </div>
        </div>
      </section>

      {/* ── MORE TO DISCOVER ── */}
      {!loading && more.length > 0 && (
        <section className="container-prose py-24 md:py-32 scroll-reveal">
          <div className="mb-14 flex items-baseline justify-between flex-wrap gap-4 border-b border-border/40 pb-6">
            <div>
              <div className="eyebrow">Explore Further</div>
              <h2 className="mt-3 font-serif text-4xl md:text-6xl text-ink tracking-tight">Destinations Checklist</h2>
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Volume 01 · curated list</span>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {more.map(p => (
              <Link 
                to={`/places/${p.slug}`} 
                key={p.slug} 
                className="group flex flex-col bg-white border border-border/40 hover:border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="overflow-hidden aspect-[4/3] bg-black/5 relative">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-forest text-cream text-[0.6rem] uppercase tracking-widest px-2.5 py-1 rounded-sm font-bold shadow-md">
                    {p.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-widest text-terracotta font-bold mb-1.5">{p.city}, {p.state_name}</div>
                    <h4 className="font-serif text-xl font-bold leading-snug text-ink group-hover:text-terracotta transition-colors">{p.name}</h4>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">{p.tagline}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/20 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                      <svg className="w-3.5 h-3.5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Season: {p.best_time}</span>
                    </div>
                    {p.nearby && p.nearby.length > 0 && (
                      <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="font-semibold text-terracotta mr-1">Nearby:</span>
                        <span>{p.nearby.slice(0, 2).join(" · ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── BROWSE STATES INDEX ── */}
      {!loading && states.length > 0 && (
        <section className="bg-cream/40 border-t border-border py-20 md:py-24 scroll-reveal">
          <div className="container-prose">
            <div className="flex items-baseline justify-between mb-12 flex-wrap gap-4 border-b border-border/40 pb-4">
              <div>
                <div className="eyebrow">Directory</div>
                <h2 className="mt-2 font-serif text-3xl md:text-5xl text-ink tracking-tight">Browse States Index</h2>
              </div>
              <Link 
                to="/states" 
                className="text-sm font-bold text-terracotta hover:text-terracotta/80 border-b-2 border-terracotta/20 hover:border-terracotta pb-1 transition-all duration-300 font-sans"
              >
                View full atlas list →
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {states.map(s => (
                <Link
                  to={`/states/${s.slug}`}
                  key={s.slug}
                  className="group bg-white border border-border/70 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-terracotta transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center text-[0.58rem] uppercase tracking-widest text-terracotta font-bold mb-2">
                      <span>{s.region}</span>
                      <span className="text-muted-foreground font-normal normal-case">Cap: {s.capital}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-terracotta transition-colors leading-tight mb-2">
                      {s.name}
                    </h3>
                    <p className="text-[0.7rem] text-ink/80 leading-relaxed line-clamp-2 font-sans">{s.blurb}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/10 text-[0.62rem] uppercase tracking-wider font-bold text-terracotta group-hover:text-ink transition-colors flex items-center gap-1">
                    Explore Region <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
