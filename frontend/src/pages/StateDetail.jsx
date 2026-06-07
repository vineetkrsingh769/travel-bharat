import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { statesService } from '../services/states';
import useScrollReveal from '../hooks/useScrollReveal';

export default function StateDetail() {
  const { slug } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    statesService.getBySlug(slug)
      .then(setState)
      .catch(() => setError('State not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useScrollReveal([slug, loading]);

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-96 bg-muted" />
      <div className="container-prose py-16">
        <div className="h-8 bg-muted rounded w-1/2 mb-4" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  );

  if (error) return (
    <div className="container-prose py-32 text-center">
      <h1 className="font-serif text-4xl">State not found</h1>
      <Link to="/states" className="mt-6 inline-block text-terracotta underline">Back to all states</Link>
    </div>
  );

  return (
    <div>
      {/* Hero cover */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={state.cover_url} alt={state.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />
        </div>
        <div className="relative container-prose pt-32 pb-20 md:pt-48 md:pb-28 text-cream">
          <Link to="/states" className="eyebrow text-saffron hover:text-cream transition-colors">
            ← All states
          </Link>
          <h1 className="mt-6 font-serif text-6xl md:text-8xl tracking-tight text-cream">{state.name}</h1>
          <div className="mt-4 text-sm text-cream/80 uppercase tracking-[0.22em]">
            {state.region} India · Capital {state.capital}
          </div>
          <p className="mt-8 max-w-2xl text-lg text-cream/90 leading-relaxed font-serif italic">{state.blurb}</p>
        </div>
      </section>

      {/* At a glance */}
      <section className="container-prose py-12 md:py-16 border-b border-border scroll-reveal">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white border border-border/70 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="eyebrow mb-4">Highlights</div>
              <ul className="space-y-3 font-serif text-lg text-ink leading-snug">
                {(state.highlights || []).map(h => (
                  <li key={h} className="flex gap-2.5 items-start text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-saffron rounded-full" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white border border-border/70 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="eyebrow mb-4">Best time to visit</div>
              <p className="font-serif italic text-xl text-ink leading-relaxed font-medium">{state.best_time}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/30 text-xs font-sans text-muted-foreground">
              <span className="font-bold text-terracotta mr-1">Region:</span> {state.region} India<br />
              <span className="font-bold text-terracotta mr-1">Capital:</span> {state.capital}
            </div>
          </div>

          <div className="bg-white border border-border/70 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="eyebrow mb-4">Key Locations</div>
              <ul className="space-y-4">
                {(state.popular_cities || []).map(c => (
                  <li key={c.name} className="border-b border-border/20 last:border-0 pb-2 last:pb-0">
                    <a href={c.map_link} target="_blank" rel="noopener noreferrer" className="group block">
                      <div className="font-serif text-base text-ink group-hover:text-terracotta transition-colors font-semibold flex items-center justify-between">
                        <span>{c.name}</span>
                        <span className="text-[0.58rem] text-terracotta uppercase tracking-[0.18em] font-sans font-bold">Map ↗</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground font-sans leading-normal">{c.note}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Places */}
      <section className="container-prose py-16 md:py-20 scroll-reveal">
        <div className="mb-10 flex justify-between items-baseline border-b border-border/40 pb-4 flex-wrap gap-4">
          <div>
            <div className="eyebrow">The guide</div>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl text-ink">
              {state.name} Destinations
            </h2>
          </div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
            {(state.places || []).length} cataloged
          </span>
        </div>

        {(state.places || []).length === 0 ? (
          <p className="text-muted-foreground">Destinations for this state are being added soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(state.places || []).map((p) => (
              <Link
                to={`/places/${p.slug}`}
                key={p.slug}
                className="group journal-card bg-white flex flex-col justify-between rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="overflow-hidden rounded-t-xl aspect-[4/3] bg-black/5 relative">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute top-3 left-3 bg-forest text-cream text-[0.58rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-5 font-sans">
                    <div className="text-[0.62rem] uppercase tracking-wider text-terracotta font-bold mb-1">
                      {p.city}
                    </div>
                    <h3 className="font-serif text-xl leading-snug text-ink group-hover:text-terracotta transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[0.7rem] text-ink/80 leading-relaxed italic line-clamp-2">{p.tagline}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-border/20 flex flex-col gap-3 font-sans text-[0.68rem] text-[#4E3E2F]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <svg className="w-3.5 h-3.5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Best Season: {p.best_time}</span>
                  </div>
                  <div className="text-xs font-bold text-terracotta group-hover:text-ink transition-colors flex items-center gap-1">
                    Read guide <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
