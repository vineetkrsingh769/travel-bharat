import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';
import { useAuth } from '../../context/AuthContext';
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_INTERACTIVE,
  ADMIN_SECTION_TITLE,
  CATEGORY_BAR_COLORS,
} from './constants';
import { HERO_IMAGE } from '../../constants/assets';
import { pickFeaturedStates } from '../../constants/tourism';
import StatusBadge from './components/StatusBadge';
import AdminThumb from './components/AdminThumb';
import AdminEditButton from './components/AdminEditButton';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

function StatCard({ label, value, to, badge, badgeTone = 'warning' }) {
  const badgeClass =
    badgeTone === 'warning'
      ? 'bg-adm-warning/15 text-adm-warning border-adm-warning/25'
      : badgeTone === 'muted'
      ? 'bg-adm-raised text-adm-muted border-adm-border'
      : 'bg-adm-success/15 text-adm-success border-adm-success/25';

  return (
    <Link to={to} className={`${ADMIN_CARD_INTERACTIVE} block p-4 group`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] text-adm-faint uppercase tracking-wider font-semibold">{label}</span>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${badgeClass}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight text-adm-ink">{value}</div>
    </Link>
  );
}

function PipelineColumn({ title, count, items, tone }) {
  const toneBorder =
    tone === 'draft' ? 'border-adm-border' : tone === 'pending' ? 'border-adm-warning/30' : 'border-adm-success/30';
  const toneBg =
    tone === 'draft' ? 'bg-adm-raised/40' : tone === 'pending' ? 'bg-adm-warning/5' : 'bg-adm-success/5';

  return (
    <div className={`rounded-xl border ${toneBorder} ${toneBg} p-4 min-h-[140px]`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-adm-faint">{title}</h3>
        <span className="text-sm font-bold text-adm-ink">{count}</span>
      </div>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-xs text-adm-faint">None</li>
        ) : (
          items.map(p => (
            <li key={p.id} className="flex items-center justify-between gap-2">
              <span className="text-sm text-adm-muted truncate">{p.name}</span>
              <AdminEditButton to={`/admin/places/${p.id}`} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function AttentionItem({ label, detail, to, urgent }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all hover:bg-adm-hover ${
        urgent ? 'border-adm-warning/35 bg-adm-warning/8' : 'border-adm-border bg-adm-raised/30'
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-adm-ink">{label}</p>
        {detail && <p className="text-xs text-adm-faint mt-0.5">{detail}</p>}
      </div>
      <span className="text-adm-accent text-sm shrink-0">→</span>
    </Link>
  );
}

export default function Dashboard() {
  const { admin } = useAuth();
  const [places, setPlaces] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [reordering, setReordering] = useState(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [p, s] = await Promise.all([placesService.getAllAdmin(), statesService.getAllAdmin()]);
      setPlaces(p);
      setStates(s);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const byCat = places.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const placeStatusCounts = places.reduce((acc, p) => {
    const s = p.status || 'draft';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const stateStatusCounts = states.reduce((acc, s) => {
    const st = s.status || 'draft';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const statesMissingCover = states.filter(
    s => !s.cover_url || s.cover_url === HERO_IMAGE || s.cover_url.includes('hero-india')
  );

  const placesMissingMeta = places.filter(p => !p.tagline?.trim() || !p.best_time?.trim());

  const spotlightPlaces = places
    .filter(p => p.featured)
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  const homeStatePicks = pickFeaturedStates(states.filter(s => s.status === 'published'), 6);

  const draftPlaces = places.filter(p => (p.status || 'draft') === 'draft');
  const pendingPlaces = places.filter(p => p.status === 'pending');
  const publishedPlaces = places.filter(p => p.status === 'published');

  const attentionItems = [];
  if (placeStatusCounts.pending) {
    attentionItems.push({
      label: `${placeStatusCounts.pending} place${placeStatusCounts.pending !== 1 ? 's' : ''} awaiting review`,
      detail: 'Publish or send back to draft',
      to: '/admin/places?status=pending',
      urgent: true,
    });
  }
  if (stateStatusCounts.pending) {
    attentionItems.push({
      label: `${stateStatusCounts.pending} state${stateStatusCounts.pending !== 1 ? 's' : ''} awaiting review`,
      detail: 'Review before they go live',
      to: '/admin/states?status=pending',
      urgent: true,
    });
  }
  if (statesMissingCover.length) {
    attentionItems.push({
      label: `${statesMissingCover.length} states using default cover`,
      detail: 'Upload regional cover images',
      to: '/admin/states',
      urgent: false,
    });
  }
  if (placesMissingMeta.length) {
    attentionItems.push({
      label: `${placesMissingMeta.length} places missing tagline or best time`,
      detail: 'Improves public destination cards',
      to: '/admin/places',
      urgent: false,
    });
  }
  if (spotlightPlaces.length === 0 && places.length > 0) {
    attentionItems.push({
      label: 'No home spotlight destinations',
      detail: 'Mark featured places for the home page',
      to: '/admin/places',
      urgent: false,
    });
  }

  const categoryEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const visibleCategories = showCategories ? categoryEntries : categoryEntries.slice(0, 3);

  async function reorderSpotlight(id, direction) {
    const list = spotlightPlaces;
    const idx = list.findIndex(p => p.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;

    const a = list[idx];
    const b = list[swapIdx];
    setReordering(id);

    try {
      const fullA = await placesService.getBySlug(a.slug);
      const fullB = await placesService.getBySlug(b.slug);
      const orderA = fullA.sort_order ?? idx;
      const orderB = fullB.sort_order ?? swapIdx;

      const payloadA = {
        ...fullA,
        nearby: Array.isArray(fullA.nearby) ? fullA.nearby.join(', ') : fullA.nearby,
        sort_order: orderB,
      };
      const payloadB = {
        ...fullB,
        nearby: Array.isArray(fullB.nearby) ? fullB.nearby.join(', ') : fullB.nearby,
        sort_order: orderA,
      };

      await placesService.update(a.id, payloadA);
      await placesService.update(b.id, payloadB);
      await loadData(true);
    } catch {
      /* keep current order on failure */
    } finally {
      setReordering(null);
    }
  }

  const isEmpty = !loading && places.length === 0 && states.length === 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-adm-faint">{formatToday()}</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-adm-ink tracking-normal mt-1">
            {getGreeting()}
            {admin && (
              <>
                <span className="text-adm-muted">, </span>
                <span>{admin}</span>
              </>
            )}
          </h1>
          <p className="mt-1 text-sm text-adm-muted">Here&apos;s what needs attention on TravelBharat today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className={ADMIN_BTN_GHOST}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <Link to="/admin/places/new" className={ADMIN_BTN_PRIMARY}>+ Add place</Link>
          {(placeStatusCounts.pending || 0) > 0 && (
            <Link
              to="/admin/places?status=pending"
              className="bg-adm-warning/15 hover:bg-adm-warning/25 border border-adm-warning/30 text-adm-warning font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              Review pending
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 bg-adm-surface border border-adm-border rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-adm-surface border border-adm-border rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {isEmpty && (
            <div className={`${ADMIN_CARD} p-6 mb-8 border-adm-accent/20`}>
              <h2 className={`${ADMIN_SECTION_TITLE} mb-2`}>Get started</h2>
              <ol className="text-sm text-adm-muted space-y-2 mb-5">
                <li>1. Add states and union territories with covers</li>
                <li>2. Create destinations linked to each state</li>
                <li>3. Mark a few places as featured for the home spotlight</li>
                <li>4. Publish when ready — visitors only see published content</li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/states/new" className={ADMIN_BTN_PRIMARY}>Add first state</Link>
                <Link to="/admin/places/new" className={ADMIN_BTN_GHOST}>Add first place</Link>
              </div>
            </div>
          )}

          {/* Needs attention */}
          {attentionItems.length > 0 && (
            <div className={`${ADMIN_CARD} p-5 mb-8`}>
              <h2 className={`${ADMIN_SECTION_TITLE} mb-4`}>Needs your attention</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {attentionItems.map(item => (
                  <AttentionItem key={item.to + item.label} {...item} />
                ))}
              </div>
            </div>
          )}

          {attentionItems.length === 0 && !isEmpty && (
            <div className={`${ADMIN_CARD} p-4 mb-8 border-adm-success/25 bg-adm-success/5`}>
              <p className="text-sm text-adm-success font-medium">All clear — no urgent content gaps right now.</p>
            </div>
          )}

          {/* Health stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="Places"
              value={places.length}
              to="/admin/places"
              badge={
                placeStatusCounts.pending
                  ? `${placeStatusCounts.pending} pending`
                  : `${placeStatusCounts.published || 0} live`
              }
              badgeTone={placeStatusCounts.pending ? 'warning' : 'success'}
            />
            <StatCard
              label="States"
              value={states.length}
              to="/admin/states"
              badge={
                statesMissingCover.length
                  ? `${statesMissingCover.length} need cover`
                  : `${stateStatusCounts.published || 0} live`
              }
              badgeTone={statesMissingCover.length ? 'muted' : 'success'}
            />
            <StatCard
              label="Spotlight"
              value={spotlightPlaces.length}
              to="/admin/places"
              badge={spotlightPlaces.length ? 'On home page' : 'None set'}
              badgeTone={spotlightPlaces.length ? 'success' : 'muted'}
            />
            <StatCard
              label="Published"
              value={placeStatusCounts.published || 0}
              to="/admin/places?status=published"
              badge={`${placeStatusCounts.draft || 0} still draft`}
              badgeTone="muted"
            />
          </div>

          {/* Pipeline + Spotlight */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className={`${ADMIN_CARD} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={ADMIN_SECTION_TITLE}>Publishing pipeline</h2>
                <Link to="/admin/places" className="text-xs font-semibold text-adm-accent hover:text-adm-accent-hover">
                  All places →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <PipelineColumn title="Draft" count={draftPlaces.length} items={draftPlaces.slice(0, 3)} tone="draft" />
                <PipelineColumn title="Pending" count={pendingPlaces.length} items={pendingPlaces.slice(0, 3)} tone="pending" />
                <PipelineColumn title="Live" count={publishedPlaces.length} items={publishedPlaces.slice(0, 3)} tone="published" />
              </div>
            </div>

            <div className={`${ADMIN_CARD} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={ADMIN_SECTION_TITLE}>Home spotlight order</h2>
              </div>
              {spotlightPlaces.length === 0 ? (
                <p className="text-sm text-adm-faint mb-3">No featured places yet.</p>
              ) : (
                <ol className="space-y-1">
                  {spotlightPlaces.map((p, i) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-adm-raised/60 transition-colors"
                    >
                      <span className="text-xs font-bold text-adm-faint w-5 shrink-0">{i + 1}</span>
                      <AdminThumb src={p.image_url} alt={p.name} className="w-9 h-7 rounded" fallbackLabel={p.name} />
                      <span className="text-sm text-adm-muted truncate flex-1 min-w-0">{p.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={i === 0 || reordering === p.id}
                          onClick={() => reorderSpotlight(p.id, 'up')}
                          className="p-1.5 rounded-md text-adm-faint hover:text-adm-ink hover:bg-adm-hover disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={i === spotlightPlaces.length - 1 || reordering === p.id}
                          onClick={() => reorderSpotlight(p.id, 'down')}
                          className="p-1.5 rounded-md text-adm-faint hover:text-adm-ink hover:bg-adm-hover disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <AdminEditButton to={`/admin/places/${p.id}`} />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-4 text-xs text-adm-faint">
                Home also highlights {homeStatePicks.length} states (one per region). Use ↑↓ to reorder spotlight destinations.
              </p>
            </div>
          </div>

          {/* Categories — collapsed by default */}
          {categoryEntries.length > 0 && (
            <div className={`${ADMIN_CARD} p-5 mb-8`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={ADMIN_SECTION_TITLE}>By category</h2>
                {categoryEntries.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowCategories(v => !v)}
                    className="text-xs font-semibold text-adm-accent hover:text-adm-accent-hover"
                  >
                    {showCategories ? 'Show less' : `Show all (${categoryEntries.length})`}
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {visibleCategories.map(([cat, count]) => {
                  const percentage = places.length ? Math.round((count / places.length) * 100) : 0;
                  const colors = CATEGORY_BAR_COLORS[cat] || { bar: 'bg-gradient-to-r from-adm-accent to-amber-500' };
                  return (
                    <Link
                      key={cat}
                      to={`/admin/places?category=${cat}`}
                      className="block p-3 rounded-xl bg-adm-raised/40 hover:bg-adm-hover border border-adm-border transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-adm-muted group-hover:text-adm-accent transition-colors">{cat}</span>
                        <span className="text-xs text-adm-faint">{count} · {percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-adm-void rounded-full overflow-hidden">
                        <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${percentage}%` }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent — slim footer row */}
          <div className={`${ADMIN_CARD} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={ADMIN_SECTION_TITLE}>Recently added</h2>
              <Link to="/admin/states/new" className="text-xs font-semibold text-adm-faint hover:text-adm-accent">
                + Add state
              </Link>
            </div>
            <div className="divide-y divide-adm-border">
              {[...places].reverse().slice(0, 3).map(p => (
                <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <AdminThumb src={p.image_url} alt={p.name} fallbackLabel={p.name} />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-adm-ink truncate">{p.name}</div>
                      <div className="text-xs text-adm-faint">{p.city}, {p.state_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={p.status} />
                    <AdminEditButton to={`/admin/places/${p.id}`} />
                  </div>
                </div>
              ))}
              {places.length === 0 && (
                <p className="text-xs text-adm-faint py-2">No destinations yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
