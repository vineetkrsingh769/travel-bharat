import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
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
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-serif text-3xl text-cream">
            Travel<span className="italic text-saffron">Bharat</span>
          </div>
          <p className="mt-2 text-sm text-cream/50 uppercase tracking-widest">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-5">
          <h1 className="text-center font-serif text-xl text-cream">Sign in</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoFocus
              className="w-full bg-white/10 border border-white/15 text-cream placeholder-cream/30 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-saffron"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              className="w-full bg-white/10 border border-white/15 text-cream placeholder-cream/30 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-saffron"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron hover:bg-saffron/90 disabled:opacity-50 text-ink font-semibold py-3 rounded-md text-sm transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cream/30">
          TravelBharat Admin · Authorised personnel only
        </p>
      </div>
    </div>
  );
}
