import React from 'react';
import { Link } from 'react-router-dom';
import { REGION_ACCENT } from '../constants/tourism';

const REGION_GRADIENTS = {
  North: 'from-saffron/10 via-saffron/30 to-terracotta/20',
  South: 'from-forest/15 via-forest/35 to-saffron/10',
  East: 'from-terracotta/15 via-terracotta/35 to-ink/20',
  West: 'from-amber-600/10 via-amber-600/30 to-saffron/20',
  Central: 'from-ink/15 via-ink/30 to-muted/40',
  Northeast: 'from-emerald-700/15 via-emerald-700/35 to-forest/20',
};

export default function StateCard({
  state,
  highlighted = false,
  innerRef,
  onMouseEnter,
  onMouseLeave,
  compact = false,
}) {
  const accent = REGION_ACCENT[state.region] || 'border-l-border';
  const bestTimeShort = state.best_time?.split(' (')[0] ?? state.best_time;
  const hasCustomCover = state.cover_url && state.cover_url !== '/assets/hero-india.jpg';

  return (
    <Link
      ref={innerRef}
      to={`/states/${state.slug}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group journal-card flex flex-col justify-between border-l-4 ${accent} pl-5 pr-5 py-5 transition-all duration-300 ${
        highlighted ? 'border-terracotta shadow-md -translate-y-0.5 ring-1 ring-terracotta/20' : ''
      }`}
    >
      <div>
        {/* State Card Cover Image / Gradient */}
        {!hasCustomCover ? (
          <div className={`overflow-hidden aspect-[16/10] bg-gradient-to-br ${REGION_GRADIENTS[state.region] || 'from-border/30 to-muted'} relative mb-4 rounded-lg flex items-center justify-center border border-border/10`}>
            {/* Subtle background radial dot pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1A1511_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />
            {/* Stylized monogram of region first letter and state name */}
            <div className="relative font-serif italic text-4xl text-ink/25 font-bold select-none">
              {state.name.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden aspect-[16/10] bg-black/5 relative mb-4 rounded-lg">
            <img
              src={state.cover_url}
              alt={state.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div className="flex justify-between items-center text-[0.58rem] uppercase tracking-widest font-bold mb-2">
          <span className="text-terracotta">{state.region}</span>
          <span className="text-muted-foreground font-normal normal-case">Cap: {state.capital}</span>
        </div>
        <h3 className={`font-serif font-bold text-ink group-hover:text-terracotta transition-colors leading-tight mb-2 ${
          compact ? 'text-lg' : 'text-xl md:text-2xl'
        }`}>
          {state.name}
        </h3>
        <p className="text-[0.7rem] text-ink/80 leading-relaxed line-clamp-1 font-sans">{state.blurb}</p>
        {state.highlights?.length > 0 && (
          <p className="mt-3 text-[0.68rem] text-ink/90 font-sans line-clamp-1 flex gap-1.5 items-start">
            <span className="w-1.5 h-1.5 bg-saffron rounded-full shrink-0 mt-1.5" />
            <span>{state.highlights[0]}</span>
          </p>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between gap-2 text-[0.65rem] text-muted-foreground font-sans">
        {bestTimeShort && (
          <span className="flex items-center gap-1.5 truncate">
            <svg className="w-3.5 h-3.5 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{bestTimeShort}</span>
          </span>
        )}
        <span className="uppercase tracking-wider font-bold text-terracotta group-hover:text-ink transition-colors shrink-0">
          Explore →
        </span>
      </div>
    </Link>
  );
}

