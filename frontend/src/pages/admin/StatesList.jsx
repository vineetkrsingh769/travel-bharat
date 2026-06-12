import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { statesService } from '../../services/states';
import useToast from '../../hooks/useToast';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_PAGE_TITLE,
  ADMIN_PAGE_SUB,
  ADMIN_TABLE_HEAD,
  ADMIN_TABLE_WRAP,
  REGION_BADGE,
} from './constants';
import AdminToast from './components/AdminToast';
import AdminSearchInput from './components/AdminSearchInput';
import StatusFilterBar from './components/StatusFilterBar';
import StatusBadge from './components/StatusBadge';
import StatusActions from './components/StatusActions';
import ViewOnSiteLink from './components/ViewOnSiteLink';
import AdminThumb from './components/AdminThumb';

export default function StatesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [deleting, setDeleting] = useState(null);
  const { toast, toastHref, showToast } = useToast();

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  function load() {
    setLoading(true);
    statesService.getAllAdmin()
      .then(setStates)
      .catch(() => showToast('Failed to load states.'))
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
    if (!window.confirm(`Delete "${name}"? All linked places will be unlinked.`)) return;
    setDeleting(id);
    try {
      await statesService.remove(id);
      setStates(prev => prev.filter(s => s.id !== id));
      showToast('State deleted.');
    } catch {
      showToast('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  }

  async function handleStatusChange(id, newStatus, slug) {
    try {
      const updated = await statesService.updateStatus(id, newStatus);
      setStates(prev => prev.map(s => s.id === id ? { ...s, status: updated.status } : s));
      if (newStatus === 'published' && slug) {
        showToast('Published! Live on the public site.', `/states/${slug}`);
      } else {
        showToast(`Status updated to ${newStatus}.`);
      }
    } catch {
      showToast('Failed to update status.');
    }
  }

  const statusCounts = states.reduce((acc, s) => {
    const st = s.status || 'draft';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const filtered = states.filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.capital.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <AdminToast message={toast} href={toastHref} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className={ADMIN_PAGE_TITLE}>States</h1>
          <p className={ADMIN_PAGE_SUB}>
            {states.length} states &amp; UTs · {statusCounts.published || 0} published
          </p>
        </div>
        <Link to="/admin/states/new" className={ADMIN_BTN_PRIMARY}>
          + Add state
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search states, capitals…"
        />
        <StatusFilterBar value={statusFilter} onChange={updateStatusFilter} counts={statusCounts} />
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-adm-surface border border-adm-border rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className={`${ADMIN_TABLE_WRAP} overflow-x-auto`}>
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className={ADMIN_TABLE_HEAD}>
                <th className="text-left px-4 py-3 font-semibold">Cover</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Capital</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Region</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-adm-hover/50 transition-colors">
                  <td className="px-4 py-3">
                    <AdminThumb src={s.cover_url} alt={s.name} className="h-10 w-14 rounded-lg" fallbackLabel={s.name} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-adm-ink font-semibold">{s.name}</div>
                    <ViewOnSiteLink href={`/states/${s.slug}`} status={s.status} label="View on site" />
                  </td>
                  <td className="px-4 py-3 text-adm-muted hidden md:table-cell">{s.capital}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${REGION_BADGE[s.region] || ''}`}>{s.region}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusActions
                      status={s.status}
                      editTo={`/admin/states/${s.id}`}
                      isDeleting={deleting === s.id}
                      onStatusChange={(newStatus) => handleStatusChange(s.id, newStatus, s.slug)}
                      onDelete={() => handleDelete(s.id, s.name)}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-adm-faint">No states found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
