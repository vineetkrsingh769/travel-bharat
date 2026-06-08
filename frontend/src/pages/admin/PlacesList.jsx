import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';

const CATEGORY_BADGE = {
  Heritage:  'bg-amber-500/20  text-amber-300',
  Nature:    'bg-green-500/20   text-green-300',
  Religious: 'bg-purple-500/20  text-purple-300',
  Adventure: 'bg-blue-500/20    text-blue-300',
  Beach:     'bg-cyan-500/20    text-cyan-300',
};

const STATUS_BADGE = {
  draft: 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30',
  pending: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  published: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
};

export default function PlacesList() {
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast]     = useState('');

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    placesService.getAllAdmin()
      .then(setPlaces)
      .catch(() => showToast('Failed to load places.'))
      .finally(() => setLoading(false));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await placesService.remove(id);
      setPlaces(prev => prev.filter(p => p.id !== id));
      showToast('Place deleted.');
    } catch {
      showToast('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const updated = await placesService.updateStatus(id, newStatus);
      setPlaces(prev => prev.map(p => p.id === id ? { ...p, status: updated.status } : p));
      showToast(`Status updated to ${newStatus}.`);
    } catch {
      showToast('Failed to update status.');
    }
  }

  const filtered = places.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.state_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-emerald-50 text-sm px-4 py-3 rounded-xl shadow-lg border border-emerald-600">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink dark:text-cream">Places</h1>
          <p className="text-sm text-ink/40 dark:text-cream/40 mt-1">{places.length} destinations</p>
        </div>
        <Link
          to="/admin/places/new"
          className="bg-saffron hover:bg-saffron/90 hover:scale-[1.02] active:scale-[0.98] text-white dark:text-ink text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          + Add place
        </Link>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-sm shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-ink/40 dark:text-cream/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search places, states, categories…"
            className="w-full bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink dark:text-cream placeholder-ink/30 dark:placeholder-cream/30 pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 shadow-sm dark:shadow-none hover:border-[#C4B79F] dark:hover:border-white/20 transition-all duration-200"
          />
        </div>

        <div className="flex bg-[#FAF5EC] dark:bg-white/5 p-1 rounded-xl border border-[#DDD0B8] dark:border-white/10 self-start md:self-auto shadow-inner">
          {['all', 'draft', 'pending', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize hover:scale-[1.01] active:scale-[0.98] ${
                statusFilter === status
                  ? 'bg-saffron text-white dark:text-ink shadow-sm'
                  : 'text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-white dark:bg-white/5 border border-[#DDD0B8]/40 dark:border-white/10 rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[#DDD0B8] dark:border-white/10 bg-[#FAF5EC]/50 dark:bg-white/3 text-ink/70 dark:text-cream/45 text-xs uppercase tracking-widest font-semibold">
                <th className="text-left px-4 py-3 font-semibold">Image</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">State</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD0B8]/50 dark:divide-white/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF5EC]/20 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <img src={p.image_url} alt={p.name} className="h-10 w-14 object-cover rounded-lg border border-[#DDD0B8]/50 dark:border-white/5 shadow-sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ink dark:text-cream font-semibold">{p.name}</div>
                    <div className="text-ink/40 dark:text-cream/40 text-xs mt-0.5">{p.city}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/60 dark:text-cream/60 hidden md:table-cell">{p.state_name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${CATEGORY_BADGE[p.category] || ''}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider border ${STATUS_BADGE[p.status] || STATUS_BADGE.draft}`}>
                      {(p.status || 'draft').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      {p.status !== 'published' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'published')}
                          className="text-xs text-emerald-600 dark:text-emerald-450 hover:text-emerald-500 font-semibold transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]"
                        >
                          Publish
                        </button>
                      )}
                      {p.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'draft')}
                          className="text-xs text-ink/50 dark:text-cream/60 hover:text-ink dark:hover:text-cream font-medium transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]"
                        >
                          Unpublish
                        </button>
                      )}
                      {p.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'pending')}
                          className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-semibold transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]"
                        >
                          Submit
                        </button>
                      )}
                      <Link to={`/admin/places/${p.id}`} className="text-xs text-saffron hover:text-saffron/80 font-semibold transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]">Edit</Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 disabled:opacity-50 font-semibold transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/30 dark:text-cream/30">No places found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
