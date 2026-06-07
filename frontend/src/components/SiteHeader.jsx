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
    { to: '/', label: 'Journal', exact: true },
    { to: '/states', label: 'States' },
    { to: '/places', label: 'Destinations' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-cream/80 backdrop-blur-md border-b border-border/80 py-3 shadow-sm' 
          : 'bg-cream/95 border-b border-border/40 py-4'
      }`}
    >
      <div className="container-prose flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-terracotta rounded-full flex items-center justify-center text-cream font-serif font-bold text-sm tracking-widest transition-transform group-hover:rotate-12 duration-300">
            TB
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Travel<span className="italic text-terracotta">Bharat</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-sm">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `relative py-1 transition-all duration-300 uppercase tracking-widest text-[0.7rem] font-bold ${
                  isActive 
                    ? 'text-terracotta font-extrabold after:scale-x-100' 
                    : 'text-ink/60 hover:text-ink after:scale-x-0'
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-terracotta after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`
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
            className="text-xs uppercase tracking-widest font-bold bg-ink text-cream hover:bg-terracotta px-5 py-2.5 rounded-sm transition-all duration-300 hover:shadow-md"
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
          menuOpen ? 'max-h-80 border-t border-border/40 mt-3 bg-cream/95' : 'max-h-0'
        }`}
      >
        <div className="container-prose py-6 flex flex-col gap-4">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest font-semibold py-2 transition-colors ${
                  isActive ? 'text-terracotta' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="h-px bg-border/40 my-2" />
          <Link
            to="/states"
            className="w-full text-center text-xs uppercase tracking-widest font-bold bg-terracotta text-cream py-3 rounded-sm hover:bg-ink transition-colors"
          >
            Explore Map
          </Link>
        </div>
      </div>
    </header>
  );
}
