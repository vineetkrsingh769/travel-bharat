import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../admin/admin-theme.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell min-h-screen bg-adm-void font-admin-sans flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden border-r border-adm-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/assets/hero-india.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-adm-void via-adm-void/95 to-adm-canvas" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-adm-border mb-8">
              <img src="/assets/logo.png" alt="" className="w-full h-full object-cover scale-110" />
            </div>
            <h1 className="adm-brand text-4xl text-adm-ink leading-tight">
              Travel<span className="text-adm-accent italic">Bharat</span>
            </h1>
            <p className="mt-4 text-adm-muted text-base max-w-sm leading-relaxed">
              Curate India&apos;s destinations, states, and spotlight content for the public exploration site.
            </p>
          </div>
          <p className="text-xs text-adm-faint uppercase tracking-[0.2em]">Authorised personnel only</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 adm-canvas-bg">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-xl overflow-hidden ring-1 ring-adm-border mb-4">
              <img src="/assets/logo.png" alt="" className="w-full h-full object-cover scale-110" />
            </div>
            <h1 className="adm-brand text-2xl text-adm-ink">
              Travel<span className="text-adm-accent italic">Bharat</span>
            </h1>
            <p className="mt-1 text-xs text-adm-faint uppercase tracking-[0.18em]">Admin</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-adm-surface border border-adm-border rounded-2xl p-8 shadow-adm-card space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold text-adm-ink tracking-normal">Sign in</h2>
              <p className="mt-1 text-sm text-adm-muted">Enter your admin credentials</p>
            </div>

            {error && (
              <div className="bg-adm-danger/10 border border-adm-danger/30 text-adm-danger text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-adm-faint mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoFocus
                className="w-full bg-adm-raised border border-adm-border text-adm-ink placeholder-adm-faint px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 hover:border-adm-muted/60 transition-all"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-adm-faint mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="w-full bg-adm-raised border border-adm-border text-adm-ink placeholder-adm-faint px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 hover:border-adm-muted/60 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-adm-accent hover:bg-adm-accent-hover disabled:opacity-50 text-adm-void font-semibold py-3 rounded-xl text-sm shadow-lg shadow-adm-accent/20 transition-all hover:-translate-y-px active:translate-y-0"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
