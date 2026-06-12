import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { placesService } from '../../services/places';
import useToast from '../../hooks/useToast';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_PAGE_TITLE,
  ADMIN_PAGE_SUB,
  ADMIN_TABLE_HEAD,
  ADMIN_TABLE_WRAP,
  CATEGORY_BADGE,
} from './constants';
import AdminToast from './components/AdminToast';
import AdminSearchInput from './components/AdminSearchInput';
import StatusFilterBar from './components/StatusFilterBar';
import StatusBadge from './components/StatusBadge';
import StatusActions from './components/StatusActions';
import ViewOnSiteLink from './components/ViewOnSiteLink';
import AdminThumb from './components/AdminThumb';

export default function PlacesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [deleting, setDeleting] = useState(null);
  const { toast, toastHref, showToast } = useToast();

  useEffect(() => { load(); }, []);

  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  function load() {
    setLoading(true);
    placesService.getAllAdmin()
      .then(setPlaces)
      .catch(() => showToast('Failed to load places.'))
      .finally(() => setLoading(false));
  }

  function updateStatusFilter(val) {
    setStatusFilter(val);
    const next = new URLSearchParams(searchParams);
    if (val === 'all') next.delete('status');
    else next.set('status', val);
    setSearchParams(next);
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

  async function handleStatusChange(id, newStatus, slug) {
    try {
      const updated = await placesService.updateStatus(id, newStatus);
      setPlaces(prev => prev.map(p => p.id === id ? { ...p, status: updated.status } : p));
      if (newStatus === 'published' && slug) {
        showToast('Published! Live on the public site.', `/places/${slug}`);
      } else {
        showToast(`Status updated to ${newStatus}.`);
      }
    } catch {
      showToast('Failed to update status.');
    }
  }

  const statusCounts = places.reduce((acc, p) => {
    const s = p.status || 'draft';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const filtered = places.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.state_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <AdminToast message={toast} href={toastHref} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className={ADMIN_PAGE_TITLE}>Places</h1>
          <p className={ADMIN_PAGE_SUB}>
            {places.length} destinations · {statusCounts.published || 0} published · {statusCounts.pending || 0} pending review
          </p>
        </div>
        <Link to="/admin/places/new" className={ADMIN_BTN_PRIMARY}>
          + Add place
        </Link>
      </div>

      {categoryFilter && (
        <div className="mb-4 text-sm text-adm-muted">
          Filtering category: <strong className="text-adm-accent">{categoryFilter}</strong>
          <button type="button" onClick={() => { const n = new URLSearchParams(searchParams); n.delete('category'); setSearchParams(n); }} className="ml-2 text-xs font-semibold text-adm-accent hover:text-adm-accent-hover">Clear</button>
        </div>
      )}

      {statusCounts.pending > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-adm-warning/30 bg-adm-warning/10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-adm-warning font-medium">
            {statusCounts.pending} place{statusCounts.pending !== 1 ? 's' : ''} awaiting review
          </p>
          <button
            type="button"
            onClick={() => updateStatusFilter('pending')}
            className="text-xs font-semibold text-adm-warning hover:text-orange-300 transition-colors"
          >
            Open review queue →
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search places, states, categories…"
        />
        <StatusFilterBar value={statusFilter} onChange={updateStatusFilter} counts={statusCounts} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-adm-surface border border-adm-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={`${ADMIN_TABLE_WRAP} overflow-x-auto`}>
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className={ADMIN_TABLE_HEAD}>
                <th className="text-left px-4 py-3 font-semibold">Image</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">State</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Spotlight</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-adm-hover/50 transition-colors">
                  <td className="px-4 py-3">
                    <AdminThumb src={p.image_url} alt={p.name} className="h-10 w-14 rounded-lg" fallbackLabel={p.name} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-adm-ink font-semibold">{p.name}</div>
                    <div className="text-adm-faint text-xs mt-0.5">{p.city}</div>
                    <ViewOnSiteLink href={`/places/${p.slug}`} status={p.status} label="View on site" />
                  </td>
                  <td className="px-4 py-3 text-adm-muted hidden md:table-cell">{p.state_name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${CATEGORY_BADGE[p.category] || ''}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {p.featured ? (
                      <span className="text-adm-accent font-bold">#{p.sort_order || '—'}</span>
                    ) : (
                      <span className="text-adm-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusActions
                      status={p.status}
                      editTo={`/admin/places/${p.id}`}
                      isDeleting={deleting === p.id}
                      onStatusChange={(newStatus) => handleStatusChange(p.id, newStatus, p.slug)}
                      onDelete={() => handleDelete(p.id, p.name)}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-adm-faint">No places found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
