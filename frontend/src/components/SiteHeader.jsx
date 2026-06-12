import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Track scroll position for header aesthetics
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home', exact: true },
    { to: '/states', label: 'States' },
    { to: '/places', label: 'Destinations' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 h-0 px-3 sm:px-4">
      <div
        className={`container-prose mt-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'bg-cream/75 backdrop-blur-xl border-border shadow-lg shadow-ink/5'
            : 'bg-cream/85 backdrop-blur-md border-border/60 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm transition-transform group-hover:rotate-6 group-hover:scale-105 duration-300">
              <img
                src="/assets/logo.png"
                alt="TravelBharat logo"
                className="h-full w-full object-cover scale-125"
              />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
              Travel<span className="italic text-terracotta">Bharat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/60 rounded-full p-1 border border-border/50">
            {navItems.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full uppercase tracking-widest text-[0.68rem] font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-ink text-cream shadow-sm'
                      : 'text-ink/60 hover:text-ink hover:bg-cream'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/states"
              className="text-xs uppercase tracking-widest font-bold bg-terracotta text-cream hover:bg-ink px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-px"
            >
              Explore Map
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-ink hover:text-terracotta transition-colors focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current rounded transition-all duration-300 origin-left ${
                  menuOpen ? 'rotate-[42deg] translate-y-[1px]' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded transition-all duration-300 origin-left ${
                  menuOpen ? '-rotate-[42deg] -translate-y-[1px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-80 border-t border-border/40' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-5 flex flex-col gap-1.5 sm:px-6">
            {navItems.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-ink text-cream'
                      : 'text-ink/70 hover:text-ink hover:bg-muted/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="h-px bg-border/40 my-2" />
            <Link
              to="/states"
              className="w-full text-center text-xs uppercase tracking-widest font-bold bg-terracotta text-cream py-3 rounded-full hover:bg-ink transition-colors"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
