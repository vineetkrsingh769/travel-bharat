import { useEffect } from 'react';

/**
 * Hook to apply premium fade-in-up animations when elements scroll into view.
 * Accepts a dependency array (e.g., [loading]) so it re-binds after async data renders.
 */
export default function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // Check if IntersectionObserver is supported (almost all modern browsers)
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve so the animation only fires once (standard premium design)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before entering fully
      }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => {
        try {
          observer.unobserve(el);
        } catch (e) {
          // Element might have been unmounted
        }
      });
    };
  }, dependencies);
}
