import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-muted/40">
      <div className="container-prose py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-serif text-2xl text-ink">
            Travel<span className="italic text-terracotta">Bharat</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            A digital encyclopedia of Indian travel — state by state, story by story.
          </p>
        </div>

        <div className="text-sm">
          <div className="eyebrow mb-3">Explore</div>
          <ul className="space-y-2 text-ink/80">
            <li><Link to="/places?category=Heritage" className="hover:text-terracotta transition-colors">Heritage Sites</Link></li>
            <li><Link to="/places?category=Nature"   className="hover:text-terracotta transition-colors">Nature &amp; Wildlife</Link></li>
            <li><Link to="/places?category=Religious" className="hover:text-terracotta transition-colors">Sacred Journeys</Link></li>
            <li><Link to="/places?category=Adventure" className="hover:text-terracotta transition-colors">Adventure</Link></li>
            <li><Link to="/states"                   className="hover:text-terracotta transition-colors">States &amp; Union Territories</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="eyebrow mb-3">About</div>
          <p className="text-muted-foreground leading-relaxed">
            TravelBharat is an independent, non-commercial guide. All listings are verified for
            cultural and historical accuracy.
          </p>
          <Link to="/about" className="mt-3 inline-block text-terracotta hover:text-terracotta/80 transition-colors">
            Learn more →
          </Link>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-prose py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} TravelBharat</span>
          <span>Made with love for Incredible India</span>
        </div>
      </div>
    </footer>
  );
}
