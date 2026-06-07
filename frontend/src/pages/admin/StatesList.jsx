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
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-800 text-green-100 text-sm px-4 py-3 rounded-lg shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-cream">States</h1>
          <p className="text-sm text-cream/40 mt-1">{states.length} states &amp; UTs</p>
        </div>
        <Link to="/admin/states/new" className="bg-saffron hover:bg-saffron/90 text-ink text-sm font-medium px-4 py-2 rounded-md transition-colors">
          + Add state
        </Link>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search states, capitals…"
          className="w-full max-w-sm bg-white/5 border border-white/10 text-cream placeholder-cream/30 px-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-saffron"
        />

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 self-start md:self-auto">
          {['all', 'draft', 'pending', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-saffron text-ink'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-cream/40 text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3 font-normal">Cover</th>
                <th className="text-left px-4 py-3 font-normal">Name</th>
                <th className="text-left px-4 py-3 font-normal hidden md:table-cell">Capital</th>
                <th className="text-left px-4 py-3 font-normal hidden lg:table-cell">Region</th>
                <th className="text-left px-4 py-3 font-normal">Status</th>
                <th className="text-right px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <img src={s.cover_url} alt={s.name} className="h-10 w-14 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-cream font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-cream/60 hidden md:table-cell">{s.capital}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${REGION_COLOR[s.region] || ''}`}>{s.region}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_BADGE[s.status] || STATUS_BADGE.draft}`}>
                      {(s.status || 'draft').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      {s.status !== 'published' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'published')}
                          className="text-xs text-emerald-400 hover:text-emerald-350 font-medium"
                        >
                          Publish
                        </button>
                      )}
                      {s.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'draft')}
                          className="text-xs text-cream/60 hover:text-cream font-medium"
                        >
                          Unpublish
                        </button>
                      )}
                      {s.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'pending')}
                          className="text-xs text-orange-400 hover:text-orange-355 font-medium"
                        >
                          Submit
                        </button>
                      )}
                      <Link to={`/admin/states/${s.id}`} className="text-xs text-saffron hover:text-saffron/80 font-medium">Edit</Link>
                      <button onClick={() => handleDelete(s.id, s.name)} disabled={deleting === s.id} className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-cream/30">No states found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
