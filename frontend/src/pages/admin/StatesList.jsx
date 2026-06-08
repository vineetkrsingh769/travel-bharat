import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statesService } from '../../services/states';

const STATUS_BADGE = {
  draft: 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30',
  pending: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  published: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
};

export default function StatesList() {
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast]     = useState('');

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    statesService.getAllAdmin()
      .then(setStates)
      .catch(() => showToast('Failed to load states.'))
      .finally(() => setLoading(false));
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? All linked places will be unlinked.`)) return;
    setDeleting(id);
    try {
      await statesService.remove(id);
      setStates(prev => prev.filter(s => s.id !== id));
      showToast('State deleted.');
    } catch { showToast('Failed to delete.'); }
    finally { setDeleting(null); }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const updated = await statesService.updateStatus(id, newStatus);
      setStates(prev => prev.map(s => s.id === id ? { ...s, status: updated.status } : s));
      showToast(`Status updated to ${newStatus}.`);
    } catch {
      showToast('Failed to update status.');
    }
  }

  const REGION_COLOR = {
    North: 'bg-blue-500/20 text-blue-300',
    South: 'bg-green-500/20 text-green-300',
    East: 'bg-amber-500/20 text-amber-300',
    West: 'bg-orange-500/20 text-orange-300',
    Central: 'bg-purple-500/20 text-purple-300',
    Northeast: 'bg-pink-500/20 text-pink-300'
  };

  const filtered = states.filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.capital.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-emerald-50 text-sm px-4 py-3 rounded-lg shadow-lg border border-emerald-600">{toast}</div>}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink dark:text-cream">States</h1>
          <p className="text-sm text-ink/40 dark:text-cream/40 mt-1">{states.length} states &amp; UTs</p>
        </div>
        <Link to="/admin/states/new" className="bg-saffron hover:bg-saffron/90 text-white dark:text-ink text-sm font-semibold px-4 py-2 rounded-md transition-colors shadow-sm">
          + Add state
        </Link>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search states, capitals…"
          className="w-full max-w-sm bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink dark:text-cream placeholder-ink/30 dark:placeholder-cream/30 px-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-saffron shadow-sm dark:shadow-none"
        />

        <div className="flex bg-[#FAF5EC] dark:bg-white/5 p-1 rounded-lg border border-[#DDD0B8] dark:border-white/10 self-start md:self-auto shadow-inner">
          {['all', 'draft', 'pending', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
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
        <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-white dark:bg-white/5 border border-[#DDD0B8]/40 dark:border-white/10 rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[#DDD0B8] dark:border-white/10 bg-[#FAF5EC]/50 dark:bg-white/3 text-ink/70 dark:text-cream/45 text-xs uppercase tracking-widest font-semibold">
                <th className="text-left px-4 py-3 font-semibold">Cover</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Capital</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Region</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD0B8]/50 dark:divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-[#FAF5EC]/20 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <img src={s.cover_url} alt={s.name} className="h-10 w-14 object-cover rounded shadow-sm" />
                  </td>
                  <td className="px-4 py-3 text-ink dark:text-cream font-semibold">{s.name}</td>
                  <td className="px-4 py-3 text-ink/60 dark:text-cream/60 hidden md:table-cell">{s.capital}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${REGION_COLOR[s.region] || ''}`}>{s.region}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${STATUS_BADGE[s.status] || STATUS_BADGE.draft}`}>
                      {(s.status || 'draft').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      {s.status !== 'published' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'published')}
                          className="text-xs text-emerald-600 dark:text-emerald-450 hover:text-emerald-500 font-semibold"
                        >
                          Publish
                        </button>
                      )}
                      {s.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'draft')}
                          className="text-xs text-ink/50 dark:text-cream/60 hover:text-ink dark:hover:text-cream font-medium"
                        >
                          Unpublish
                        </button>
                      )}
                      {s.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'pending')}
                          className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-semibold"
                        >
                          Submit
                        </button>
                      )}
                      <Link to={`/admin/states/${s.id}`} className="text-xs text-saffron hover:text-saffron/80 font-semibold">Edit</Link>
                      <button onClick={() => handleDelete(s.id, s.name)} disabled={deleting === s.id} className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 disabled:opacity-50 font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/30 dark:text-cream/30">No states found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
