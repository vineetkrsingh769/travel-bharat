import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { placesService } from '../services/places';
import useScrollReveal from '../hooks/useScrollReveal';

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 font-serif text-base text-ink">{value}</dd>
    </div>
  );
}

export default function PlaceDetail() {
  const { slug } = useParams();
  const [place, setPlace]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    placesService.getBySlug(slug)
      .then(p => {
        setPlace(p);
        setActiveImgIdx(0);
      })
      .catch(() => setError('Destination not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useScrollReveal([slug, loading]);

  if (loading) return (
    <div className="animate-pulse container-prose py-20">
      <div className="h-6 bg-muted rounded w-1/3 mb-8" />
      <div className="h-14 bg-muted rounded w-2/3 mb-4" />
      <div className="w-full aspect-[16/10] bg-muted rounded-sm mt-10" />
    </div>
  );

  if (error) return (
    <div className="container-prose py-32 text-center">
      <h1 className="font-serif text-4xl">Destination not found</h1>
      <Link to="/places" className="mt-6 inline-block text-terracotta underline">Back to all destinations</Link>
    </div>
  );

  return (
    <article>
      {/* Masthead */}
      <header className="container-prose pt-16 md:pt-20 pb-10">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground flex flex-wrap gap-3 items-center">
          <Link to="/states" className="hover:text-terracotta">States</Link>
          <span>/</span>
          <Link to={`/states/${place.state_slug}`} className="hover:text-terracotta">{place.state_name}</Link>
          <span>/</span>
          <span>{place.name}</span>
        </div>

        <div className="mt-8 eyebrow">
          {place.category}<span className="rule" />{place.city}, {place.state_name}
        </div>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl text-ink tracking-tight leading-[1.02]">
          {place.name}
        </h1>
        <p className="mt-6 font-serif italic text-2xl text-muted-foreground max-w-3xl">{place.tagline}</p>
      </header>

      {/* Cover image / Slideshow */}
      <div className="container-prose">
        {(() => {
          const gallery = (place.images && place.images.length > 0) ? place.images : [place.image_url];
          return (
            <div className="flex flex-col gap-4">
              <div className="relative group overflow-hidden bg-black/5 rounded-sm">
                <img
                  src={gallery[activeImgIdx]}
                  alt={`${place.name} - view ${activeImgIdx + 1}`}
                  className="w-full aspect-[16/10] object-cover transition-all duration-300"
                />
                
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx(i => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-ink/40 hover:bg-terracotta text-cream px-3.5 py-2.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-200 font-sans font-bold"
                      aria-label="Previous image"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => setActiveImgIdx(i => (i + 1) % gallery.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-ink/40 hover:bg-terracotta text-cream px-3.5 py-2.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-200 font-sans font-bold"
                      aria-label="Next image"
                    >
                      &rarr;
                    </button>
                    <div className="absolute bottom-4 right-4 bg-ink/60 backdrop-blur-sm text-cream px-3 py-1 text-xs uppercase tracking-wider rounded-full font-mono">
                      {activeImgIdx + 1} / {gallery.length}
                    </div>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative flex-shrink-0 w-24 aspect-[16/10] overflow-hidden border-2 transition-all rounded-sm ${
                        idx === activeImgIdx 
                          ? 'border-terracotta scale-[1.02] shadow-sm' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Body + sidebar */}
      <section className="container-prose mt-12 md:mt-16 grid gap-12 lg:grid-cols-[2fr_1fr] scroll-reveal">
        <div>
          <span className="float-left font-serif text-7xl leading-[0.85] mr-3 mt-1.5 text-terracotta font-bold">
            {place.description.charAt(0)}
          </span>
          <p className="text-lg md:text-xl leading-[1.8] text-ink/90 font-serif font-medium">{place.description.slice(1)}</p>

          {/* Did You Know? callout card */}
          {place.trivia && (
            <div className="mt-10 bg-saffron/10 border border-saffron/30 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute right-4 bottom-0 text-9xl font-serif text-saffron/10 leading-none select-none pointer-events-none">
                ?
              </div>
              <div className="flex gap-4 items-start relative z-10">
                <span className="text-3xl text-saffron shrink-0">💡</span>
                <div>
                  <h4 className="font-serif text-lg font-bold text-ink mb-1.5">Did You Know?</h4>
                  <p className="text-sm text-ink/80 leading-relaxed font-sans">{place.trivia}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-14 border-t border-border/40 pt-10">
            <h2 className="font-serif text-3xl text-ink mb-2">Nearby Attractions</h2>
            <p className="text-sm text-muted-foreground mb-6 font-sans">Other local treasures and historic landmarks within traveling reach of this destination.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {(place.nearby || []).map(n => (
                <div key={n} className="bg-white border border-border/70 p-5 rounded-xl shadow-sm font-sans flex flex-col justify-between hover:border-terracotta transition-colors duration-200">
                  <span className="font-serif text-base text-ink font-semibold leading-tight">{n}</span>
                  <span className="text-[0.62rem] uppercase tracking-wider text-terracotta font-bold mt-3 border-t border-border/10 pt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-saffron rounded-full" /> Local Guide
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:pl-8 lg:border-l lg:border-border">
          <div className="bg-white border border-border/70 p-6 rounded-xl shadow-sm">
            <div className="eyebrow pb-3 border-b border-border/30">Practical Info</div>
            <dl className="mt-5 space-y-5 text-sm">
              <Detail label="Best time to visit" value={place.best_time} />
              <Detail label="Timings"            value={place.timings} />
              <Detail label="Entry fee"          value={place.entry_fee} />
              <Detail label="Category"           value={place.category} />
              <Detail label="Location"           value={`${place.city}, ${place.state_name}`} />
            </dl>
            <a
              href={place.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full justify-center inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-3 text-sm font-semibold rounded-md hover:bg-terracotta/90 transition-colors shadow-sm"
            >
              Open in Google Maps →
            </a>
          </div>

          {/* Traveler's Tip card */}
          {place.travel_tip && (
            <div className="mt-6 bg-forest text-cream rounded-xl p-6 shadow-md border border-forest/10 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 font-serif text-8xl leading-none select-none pointer-events-none transform translate-x-3 -translate-y-4">
                ✍️
              </div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <svg className="w-5 h-5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-serif text-base font-bold text-cream uppercase tracking-wider">Traveler's Tip</h4>
              </div>
              <p className="text-xs text-cream/90 leading-relaxed font-sans relative z-10">{place.travel_tip}</p>
            </div>
          )}
        </aside>
      </section>

      {/* Related */}
      {(place.related || []).length > 0 && (
        <section className="container-prose mt-20 pt-12 border-t border-border scroll-reveal">
          <div className="eyebrow">More in {place.state_name}</div>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink mb-10">Continue the Journey</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {place.related.map(r => (
              <Link to={`/places/${r.slug}`} key={r.slug} className="group journal-card bg-white rounded-xl shadow-sm flex flex-col justify-between overflow-hidden border border-border/60 hover:border-terracotta transition-all duration-300">
                <div>
                  <div className="overflow-hidden aspect-[16/10] bg-black/5">
                    <img
                      src={r.image_url}
                      alt={r.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5 font-sans">
                    <div className="text-[0.62rem] uppercase tracking-widest text-terracotta font-bold mb-1.5">{r.category}</div>
                    <h3 className="font-serif text-lg leading-snug group-hover:text-terracotta transition-colors">{r.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">{r.tagline}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-border/20 text-xs font-bold text-terracotta group-hover:text-ink transition-colors flex items-center gap-1">
                  View guide <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
