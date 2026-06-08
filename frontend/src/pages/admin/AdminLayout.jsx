import React from 'react';
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

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 font-sans">
      {/* Sidebar / Top Nav Banner */}
      <aside className="w-full md:w-60 shrink-0 flex flex-col bg-ink border-b md:border-b-0 md:border-r border-white/10">
        {/* Header containing Logo & Quick Logout on Mobile */}
        <div className="px-6 py-4 md:py-5 border-b border-white/10 flex items-center justify-between md:block">
          <div>
            <div className="font-serif text-xl text-cream">
              Travel<span className="italic text-saffron">Bharat</span>
            </div>
            <div className="mt-0.5 text-xs text-cream/40 uppercase tracking-widest">Admin</div>
          </div>

          {/* Quick Sign Out for Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <span className="text-xs text-cream/40 max-w-[100px] truncate">{admin}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-350 transition-colors font-medium"
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
                    ? 'bg-saffron/20 text-saffron'
                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Footer (hidden on mobile) */}
        <div className="hidden md:block px-6 py-4 border-t border-white/10 mt-auto">
          <div className="text-xs text-cream/40 mb-2 truncate">{admin}</div>
          <button
            onClick={handleLogout}
            className="text-xs text-cream/50 hover:text-red-400 transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-950 text-cream">
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
