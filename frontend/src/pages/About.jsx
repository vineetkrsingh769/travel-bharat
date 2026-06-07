import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

export default function About() {
  useScrollReveal();

  return (
    <div className="container-prose py-20 md:py-28 max-w-3xl scroll-reveal">
      <div className="eyebrow">Colophon</div>
      <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-tight text-ink">About TravelBharat</h1>
      <div className="mt-10 space-y-6 text-lg leading-[1.8] text-ink/90">
        <p>
          <span className="font-serif italic">TravelBharat</span> is a centralised, editorial guide to
          Indian tourism — built to replace the scattered and inconsistent information travellers,
          students and researchers face today.
        </p>
        <p>
          Every entry is organised state by state and city by city, verified for cultural and historical
          accuracy, and written without the noise of advertising or booking funnels. It is, in spirit,
          a digital encyclopedia of the country.
        </p>
        <p>
          Future editions will add map-based exploration, multilingual content, itinerary planning
          and community contributions. For now, we keep it slow — and accurate.
        </p>
      </div>
      <div className="mt-12">
        <Link
          to="/states"
          className="inline-flex items-center gap-2 bg-terracotta text-cream px-6 py-3 text-sm font-medium rounded-sm hover:bg-terracotta/90 transition-colors"
        >
          Start exploring →
        </Link>
      </div>
    </div>
  );
}
