import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { 
    to: '/admin/dashboard', 
    label: 'Dashboard',    
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  { 
    to: '/admin/places',    
    label: 'Places',       
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    to: '/admin/states',    
    label: 'States',       
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tb_admin_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('tb_admin_theme', theme);
  }, [theme]);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const isLight = theme === 'light';

  return (
    <div className={theme}>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#FAF8F5] dark:bg-[#0B0C0E] text-ink dark:text-cream font-sans transition-colors duration-300">
        {/* Sidebar / Top Nav Banner */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col bg-[#FAF5EC] dark:bg-[#121316] border-b md:border-b-0 md:border-r border-[#DDD0B8] dark:border-white/10 transition-colors duration-300">
          {/* Header containing Logo & Quick Logout on Mobile */}
          <div className="px-6 py-4 md:py-6 border-b border-[#DDD0B8] dark:border-white/10 flex items-center justify-between md:block">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-cream">
                Travel<span className="italic text-saffron bg-gradient-to-r from-saffron to-terracotta bg-clip-text text-transparent">Bharat</span>
              </span>
              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-saffron/10 dark:bg-saffron/20 text-terracotta dark:text-saffron uppercase tracking-widest w-fit">
                Admin Panel
              </span>
            </div>

            {/* Quick Controls for Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setTheme(isLight ? 'dark' : 'light')}
                className="p-2 rounded-md border border-[#DDD0B8] dark:border-white/10 text-ink/70 dark:text-cream/70 hover:bg-[#EDE5D4] dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
              >
                {isLight ? '🌙' : '☀️'}
              </button>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-saffron to-terracotta text-white flex items-center justify-center text-[10px] font-bold">
                {admin ? admin.charAt(0).toUpperCase() : 'A'}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 transition-colors font-semibold"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Navigation - horizontal list on mobile, vertical stack on desktop */}
          <nav className="flex md:flex-col overflow-x-auto px-4 py-3 md:py-6 gap-1.5">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2.5 md:gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 whitespace-nowrap overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-saffron/12 to-saffron/2 dark:from-saffron/20 dark:to-saffron/5 text-saffron font-bold border-l-2 border-saffron shadow-sm'
                      : 'text-ink/75 dark:text-cream/75 border-l-2 border-transparent hover:bg-[#EDE5D4]/45 dark:hover:bg-white/3 hover:text-ink dark:hover:text-cream hover:border-saffron/30'
                  }`
                }
              >
                <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Footer (hidden on mobile) */}
          <div className="hidden md:block px-6 py-5 border-t border-[#DDD0B8] dark:border-white/10 mt-auto space-y-4">
            {/* Theme Toggle Switch */}
            <button
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-xs border border-[#DDD0B8]/80 dark:border-white/10 text-ink/75 dark:text-cream/75 bg-white/40 dark:bg-white/2 hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm transition-transform duration-300 group-hover:rotate-12">{isLight ? '🌙' : '☀️'}</span>
                <span className="font-semibold">{isLight ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${isLight ? 'bg-ink/10' : 'bg-saffron/30'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-saffron transition-transform duration-200 transform ${isLight ? 'translate-x-0' : 'translate-x-3.5'}`} />
              </div>
            </button>

            <div className="flex items-center justify-between pt-3.5 border-t border-[#DDD0B8]/50 dark:border-white/10">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-saffron to-terracotta text-white font-serif flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                  {admin ? admin.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-xs text-ink/70 dark:text-cream/70 font-semibold truncate">{admin}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-[11px] font-bold text-terracotta dark:text-saffron hover:text-red-650 dark:hover:text-red-400 transition-colors"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#FAF8F5] dark:bg-[#0B0C0E] transition-colors duration-300">
          <div className="p-5 sm:p-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
