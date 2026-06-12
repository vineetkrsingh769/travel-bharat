import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placesService } from '../services/places';
import { statesService } from '../services/states';
import IndiaMap from '../components/IndiaMap';
import StateCard from '../components/StateCard';
import { PLACE_CATEGORIES, pickFeaturedStates } from '../constants/tourism';
import useScrollReveal from '../hooks/useScrollReveal';

const HIGHLIGHT_ICONS = [
  'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316zM16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z',
];

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

  const spotlightLead = places.find(p => p.featured) ?? places[0];
  const spotlightSide = places.filter(p => p.slug !== spotlightLead?.slug).slice(0, 3);
  const featuredStates = pickFeaturedStates(states, 6);

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-forest text-cream -mt-24 md:-mt-28 pt-36 pb-16 md:pt-44 md:pb-20 border-b border-border/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF5EC_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {(() => {
          const activeState = hoveredStateSlug ? states.find(s => s.slug === hoveredStateSlug) : null;
          return (
            <div className="absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none z-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
                style={{
                  backgroundImage: `url(${activeState ? activeState.cover_url : '/assets/hero-india.jpg'})`,
                  opacity: activeState ? 0.65 : 0.4,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/20" />
            </div>
          );
        })()}

        <div className="relative container-prose w-full z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="flex flex-col justify-center min-h-0 lg:min-h-[400px]">
            {(() => {
              const activeState = hoveredStateSlug ? states.find(s => s.slug === hoveredStateSlug) : null;
              if (activeState) {
                return (
                  <div className="animate-fadeIn space-y-6">
                    <div className="eyebrow text-saffron">
                      <span className="rule bg-saffron" /> Volume 01 · TravelBharat
                    </div>
                    <div className="text-xs uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded border border-white/20 inline-block font-sans font-bold">
                      {activeState.region} India · Capital: {activeState.capital}
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl leading-none text-cream tracking-tight">
                      {activeState.name}
                    </h1>
                    <p className="text-base md:text-lg text-cream/90 font-serif italic max-w-xl leading-relaxed">
                      &ldquo;{activeState.blurb}&rdquo;
                    </p>

                    {activeState.highlights?.length > 0 && (
                      <div className="bg-ink/40 backdrop-blur-sm border border-white/10 p-5 rounded-xl max-w-xl shadow-lg">
                        <div className="text-[0.62rem] font-bold uppercase tracking-wider text-saffron mb-3.5">Highlights Preview</div>
                        <ul className="space-y-3 text-xs md:text-sm text-cream/90 font-sans">
                          {activeState.highlights.slice(0, 3).map((h, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                              <span className="w-6 h-6 rounded-full bg-saffron/15 border border-saffron/30 text-saffron flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length]} />
                                </svg>
                              </span>
                              <span className="leading-relaxed pt-0.5">{h}</span>
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
                    {!loading && (
                      <span className="block mt-3 text-sm text-cream/70">
                        {states.length} states &amp; UTs · {places.length} destinations · {PLACE_CATEGORIES.length} categories
                      </span>
                    )}
                  </p>

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

          <div className="flex justify-center items-center order-first lg:order-none">
            <div className="w-full max-w-[500px] bg-white border border-border/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden transition-all duration-500 hover:border-saffron/30">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1A1511_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
              <div className="relative z-10">
                <IndiaMap hoveredStateSlug={hoveredStateSlug} onHoverState={setHoveredStateSlug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SPOTLIGHT ── */}
      {!loading && spotlightLead && (
        <section className="container-prose py-16 md:py-20 scroll-reveal">
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4 border-b border-border/40 pb-5">
            <div>
              <div className="eyebrow">Spotlight</div>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl text-ink tracking-tight">Featured Collections</h2>
            </div>
            <Link
              to="/places"
              className="text-sm font-bold text-terracotta hover:text-terracotta/80 border-b-2 border-terracotta/20 hover:border-terracotta pb-1 transition-all duration-300"
            >
              See all {places.length} destinations →
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <Link
              to={`/places/${spotlightLead.slug}`}
              className="group lg:col-span-3 flex flex-col bg-white border border-border/40 hover:border-terracotta/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-terracotta"
            >
              <div className="overflow-hidden aspect-[16/9] bg-black/5 relative">
                <img
                  src={spotlightLead.image_url}
                  alt={spotlightLead.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-terracotta text-cream text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-sm font-bold shadow-md">
                  Featured
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="eyebrow text-terracotta mb-2">
                  {spotlightLead.category}<span className="rule" />{spotlightLead.state_name}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink leading-tight group-hover:text-terracotta transition-colors">
                  {spotlightLead.name}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed font-sans text-sm line-clamp-2">
                  {spotlightLead.tagline}
                </p>
                <div className="mt-5 text-xs uppercase tracking-widest font-bold text-terracotta group-hover:text-ink transition-colors">
                  Read Editorial Guide →
                </div>
              </div>
            </Link>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {spotlightSide.map(p => (
                <Link
                  to={`/places/${p.slug}`}
                  key={p.slug}
                  className="group journal-card p-5 border-l-4 border-l-saffron flex flex-col gap-2"
                >
                  <div className="text-[0.62rem] uppercase tracking-widest text-terracotta font-bold">{p.category}</div>
                  <h4 className="font-serif text-lg font-semibold text-ink group-hover:text-terracotta transition-colors">{p.name}</h4>
                  <p className="text-xs text-muted-foreground font-sans">{p.city}, {p.state_name}</p>
                  <p className="text-xs text-ink/80 line-clamp-2 leading-relaxed">{p.tagline}</p>
                  {p.best_time && (
                    <p className="text-[0.68rem] text-saffron font-medium mt-1">{p.best_time.split(' (')[0]}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BY CATEGORY ── */}
      {!loading && places.length > 0 && (
        <section className="bg-cream/40 border-y border-border/40 py-16 md:py-20 scroll-reveal">
          <div className="container-prose">
            <div className="mb-10 border-b border-border/40 pb-5">
              <div className="eyebrow">Explore Further</div>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl text-ink tracking-tight">Browse by Category</h2>
            </div>

            <div className="space-y-12">
              {PLACE_CATEGORIES.map(cat => {
                const catPlaces = places.filter(p => p.category === cat).slice(0, 4);
                if (!catPlaces.length) return null;
                return (
                  <div key={cat}>
                    <div className="flex items-baseline justify-between gap-4 mb-5">
                      <h3 className="font-serif text-xl md:text-2xl text-ink">{cat}</h3>
                      <Link
                        to={`/places?category=${cat}`}
                        className="text-xs uppercase tracking-widest font-bold text-terracotta hover:text-ink transition-colors"
                      >
                        View all {cat} →
                      </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {catPlaces.map(p => (
                        <Link
                          to={`/places/${p.slug}`}
                          key={p.slug}
                          className="group bg-white border border-border/50 rounded-xl p-5 hover:border-terracotta/60 hover:shadow-md transition-all duration-300 border-l-4 border-l-forest"
                        >
                          <div className="text-[0.62rem] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                            {p.city}, {p.state_name}
                          </div>
                          <h4 className="font-serif text-lg font-bold text-ink group-hover:text-terracotta transition-colors leading-snug">
                            {p.name}
                          </h4>
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.tagline}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── PULL QUOTE ── */}
      <section className="bg-forest text-cream border-y border-border/20 relative overflow-hidden scroll-reveal">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF5EC_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container-prose py-16 md:py-20 text-center relative z-10">
          <span className="text-5xl font-serif text-saffron leading-none block mb-4">&ldquo;</span>
          <p className="font-serif italic text-xl md:text-3xl text-cream/95 max-w-3xl mx-auto leading-relaxed px-4">
            India is not, as people keep calling it, an underdeveloped country, but rather, in the context of its history and cultural heritage, a highly developed one in an advanced state of decay.
          </p>
          <div className="mt-6 eyebrow justify-center text-saffron font-bold text-xs uppercase tracking-widest">
            — Shashi Tharoor
          </div>
        </div>
      </section>

      {/* ── FEATURED STATES ── */}
      {!loading && featuredStates.length > 0 && (
        <section className="container-prose py-16 md:py-20 scroll-reveal">
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4 border-b border-border/40 pb-5">
            <div>
              <div className="eyebrow">Directory</div>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl text-ink tracking-tight">States to Start With</h2>
            </div>
            <Link
              to="/states"
              className="text-sm font-bold text-terracotta hover:text-terracotta/80 border-b-2 border-terracotta/20 hover:border-terracotta pb-1 transition-all duration-300 font-sans"
            >
              View full atlas →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStates.map(s => (
              <StateCard key={s.slug} state={s} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
