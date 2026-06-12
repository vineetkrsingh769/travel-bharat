import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../admin/admin-theme.css';

const NAV_ITEMS = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    to: '/admin/places',
    label: 'Places',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/states',
    label: 'States',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell h-screen overflow-hidden bg-adm-void text-adm-ink font-admin-sans">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full md:w-[260px] shrink-0 flex flex-col bg-adm-void border-b md:border-b-0 md:border-r border-adm-border md:h-full md:overflow-y-auto">
          <div className="px-5 py-5 md:py-6 border-b border-adm-border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-adm-border shrink-0">
                  <img src="/assets/logo.png" alt="" className="w-full h-full object-cover scale-110" />
                </div>
                <div className="min-w-0">
                  <div className="adm-brand text-xl text-adm-ink leading-tight truncate">
                    Travel<span className="text-adm-accent italic">Bharat</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-adm-faint">
                    Admin
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="md:hidden text-xs font-semibold text-adm-muted hover:text-adm-accent transition-colors shrink-0"
              >
                Sign out
              </button>
            </div>
          </div>

          <nav className="flex md:flex-col overflow-x-auto px-3 py-4 gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-adm-accent/12 text-adm-accent border border-adm-accent/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                      : 'text-adm-muted hover:text-adm-ink hover:bg-adm-raised border border-transparent'
                  }`
                }
              >
                <span className="shrink-0 opacity-90">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-adm-border mt-auto space-y-3">
            <p className="text-xs text-adm-faint leading-relaxed hidden md:block">
              Manage destinations, states, and published content
            </p>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-adm-raised hover:bg-adm-hover border border-adm-border text-adm-muted hover:text-adm-ink px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View guest site
            </a>

            <div className="hidden md:flex items-center justify-between pt-3 border-t border-adm-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-adm-accent/15 text-adm-accent flex items-center justify-center text-xs font-bold shrink-0">
                  {admin ? admin.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-sm text-adm-muted truncate">{admin}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-adm-faint hover:text-adm-danger transition-colors shrink-0"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-h-0 overflow-y-auto adm-canvas-bg">
          <div className="p-5 sm:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
