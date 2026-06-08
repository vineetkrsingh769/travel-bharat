import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard',    icon: '◈' },
  { to: '/admin/places',    label: 'Places',       icon: '◉' },
  { to: '/admin/states',    label: 'States',       icon: '◎' },
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
      <div className="flex flex-col md:flex-row min-h-screen bg-[#FAF8F5] dark:bg-[#0B0C0E] text-ink dark:text-cream font-sans transition-colors duration-200">
        {/* Sidebar / Top Nav Banner */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col bg-[#FAF5EC] dark:bg-ink border-b md:border-b-0 md:border-r border-[#DDD0B8] dark:border-white/10 transition-colors duration-200">
          {/* Header containing Logo & Quick Logout on Mobile */}
          <div className="px-6 py-4 md:py-5 border-b border-[#DDD0B8] dark:border-white/10 flex items-center justify-between md:block">
            <div>
              <div className="font-serif text-xl text-ink dark:text-cream">
                Travel<span className="italic text-saffron">Bharat</span>
              </div>
              <div className="mt-0.5 text-[10px] font-bold text-terracotta dark:text-saffron uppercase tracking-widest">Admin</div>
            </div>

            {/* Quick Controls for Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setTheme(isLight ? 'dark' : 'light')}
                className="p-1.5 rounded-md border border-[#DDD0B8] dark:border-white/10 text-ink/70 dark:text-cream/70 hover:bg-[#EDE5D4] dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
              >
                {isLight ? '🌙' : '☀️'}
              </button>
              <span className="text-xs text-ink/50 dark:text-cream/40 max-w-[80px] truncate">{admin}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 transition-colors font-semibold"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Navigation - horizontal list on mobile, vertical stack on desktop */}
          <nav className="flex md:flex-col overflow-x-auto px-3 py-2 md:py-4 gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 md:gap-3 px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-saffron/10 dark:bg-saffron/20 text-saffron font-semibold'
                      : 'text-ink/70 dark:text-cream/70 hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5 hover:text-ink dark:hover:text-cream'
                  }`
                }
              >
                <span className="text-base">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Footer (hidden on mobile) */}
          <div className="hidden md:block px-6 py-4 border-t border-[#DDD0B8] dark:border-white/10 mt-auto space-y-3.5">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md text-xs border border-[#DDD0B8] dark:border-white/15 text-ink/70 dark:text-cream/70 hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2">
                <span>{isLight ? '🌙' : '☀️'}</span>
                <span>{isLight ? 'Dark Theme' : 'Light Theme'}</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-terracotta dark:text-saffron">Toggle</span>
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-[#DDD0B8]/40 dark:border-white/5">
              <div className="text-xs text-ink/50 dark:text-cream/40 truncate max-w-[110px]">{admin}</div>
              <button
                onClick={handleLogout}
                className="text-xs text-ink/60 dark:text-cream/50 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
              >
                Sign out →
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#FAF8F5] dark:bg-[#0B0C0E] transition-colors duration-200">
          <div className="p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
