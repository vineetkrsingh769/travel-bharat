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
    <div className="flex min-h-screen bg-gray-950 font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-ink border-r border-white/10">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="font-serif text-xl text-cream">
            Travel<span className="italic text-saffron">Bharat</span>
          </div>
          <div className="mt-0.5 text-xs text-cream/40 uppercase tracking-widest">Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
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
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
