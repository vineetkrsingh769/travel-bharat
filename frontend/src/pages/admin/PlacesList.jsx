import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';
import useToast from '../../hooks/useToast';
import { CATEGORY_BADGE } from './constants';
import AdminToast from './components/AdminToast';
import AdminSearchInput from './components/AdminSearchInput';
import StatusFilterBar from './components/StatusFilterBar';
import StatusBadge from './components/StatusBadge';
import StatusActions from './components/StatusActions';

export default function PlacesList() {
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const { toast, showToast } = useToast();

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    placesService.getAllAdmin()
      .then(setPlaces)
      .catch(() => showToast('Failed to load places.'))
      .finally(() => setLoading(false));
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
      <AdminToast message={toast} />

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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search places, states, categories…"
        />
        <StatusFilterBar value={statusFilter} onChange={setStatusFilter} />
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
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusActions
                      status={p.status}
                      editTo={`/admin/places/${p.id}`}
                      isDeleting={deleting === p.id}
                      onStatusChange={(newStatus) => handleStatusChange(p.id, newStatus)}
                      onDelete={() => handleDelete(p.id, p.name)}
                    />
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
