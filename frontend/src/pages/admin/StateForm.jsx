import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { statesService } from '../../services/states';
import { REGIONS } from '../../constants/tourism';
import { Field, FormSection, ADMIN_INPUT_CLASS } from './components/AdminForm';
import AssetPicker from './components/AssetPicker';
import AdminPreviewPane from './components/AdminPreviewPane';
import ViewOnSiteLink from './components/ViewOnSiteLink';
import { HERO_IMAGE, STATE_COVER_ASSETS } from '../../constants/assets';
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_PAGE_TITLE,
} from './constants';

const EMPTY = {
  slug: '', name: '', region: '', capital: '', blurb: '', cover_url: '',
  highlights: '', best_time: '', status: 'draft', popular_cities: [],
};

export default function StateForm() {
  const { id }   = useParams();
  const isEdit   = !!id;
  const navigate = useNavigate();

  const [form, setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!isEdit) return;
    statesService.getAllAdmin().then(all => {
      const s = all.find(x => String(x.id) === id);
      if (!s) {
        setLoading(false);
        return;
      }
      statesService.getBySlug(s.slug).then(full => {
        setForm({
          ...full,
          highlights: (full.highlights || []).join('\n'),
          popular_cities: full.popular_cities || [],
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, [id, isEdit]);

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    if (field === 'name' && !isEdit) {
      setForm(f => ({ ...f, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    }
  }

  function setCity(idx, field, val) {
    const copy = [...(form.popular_cities || [])];
    copy[idx] = { ...copy[idx], [field]: val };
    set('popular_cities', copy);
  }

  function addCity() {
    set('popular_cities', [...(form.popular_cities || []), { name: '', note: '', map_link: '' }]);
  }

  function removeCity(idx) {
    const copy = [...(form.popular_cities || [])];
    copy.splice(idx, 1);
    set('popular_cities', copy);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {
      ...form,
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      popular_cities: (form.popular_cities || []).filter(c => c.name?.trim()),
    };
    try {
      if (isEdit) await statesService.update(id, payload);
      else        await statesService.create(payload);
      navigate('/admin/states');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
      setSaving(false);
    }
  }

  const previewPath = form.slug ? `/states/${form.slug}` : null;
  const coverAssets = [HERO_IMAGE, ...STATE_COVER_ASSETS];

  if (loading) return <div className="animate-pulse h-96 bg-adm-surface border border-adm-border rounded-2xl" />;

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className={ADMIN_PAGE_TITLE}>{isEdit ? 'Edit state' : 'Add new state'}</h1>
        {form.slug && (
          <ViewOnSiteLink href={previewPath} status={form.status} label="View on public site" />
        )}
      </div>

      {error && <div className="mb-4 bg-adm-danger/10 border border-adm-danger/30 text-adm-danger text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,400px)] items-start">
        <form onSubmit={handleSubmit} className={`${ADMIN_CARD} p-6 sm:p-8 space-y-6`}>
          <FormSection title="State Identity">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name *"><input className={ADMIN_INPUT_CLASS} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Rajasthan" /></Field>
              <Field label="Slug *"><input className={ADMIN_INPUT_CLASS} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="rajasthan" /></Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="Region *">
                <select className={ADMIN_INPUT_CLASS} value={form.region} onChange={e => set('region', e.target.value)} required>
                  <option value="">Select region…</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Capital *"><input className={ADMIN_INPUT_CLASS} value={form.capital} onChange={e => set('capital', e.target.value)} required placeholder="Jaipur" /></Field>
              <Field label="Status *">
                <select className={ADMIN_INPUT_CLASS} value={form.status} onChange={e => set('status', e.target.value)} required>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Media & Branding">
            <Field label="Blurb (one-sentence editorial)">
              <input className={ADMIN_INPUT_CLASS} value={form.blurb} onChange={e => set('blurb', e.target.value)} placeholder="Forts of pink sandstone, golden deserts and royal courtyards." />
            </Field>

            <Field label="Cover image">
              <input className={ADMIN_INPUT_CLASS} value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder={HERO_IMAGE} />
              <AssetPicker
                value={form.cover_url}
                onChange={url => set('cover_url', url)}
                assets={coverAssets}
                subfolder="states"
              />
              {form.cover_url && (
                <div className="flex items-center gap-3 p-3 bg-adm-raised border border-adm-border rounded-xl mt-3">
                  <img src={form.cover_url} alt="preview" className="h-16 w-24 object-cover rounded-xl" onError={e => e.target.style.display = 'none'} />
                  <span className="text-xs text-adm-faint">Cover preview</span>
                </div>
              )}
            </Field>
          </FormSection>

          <FormSection title="Editorial Insights">
            <Field label="Highlights (one per line)">
              <textarea
                className={`${ADMIN_INPUT_CLASS} min-h-[100px] resize-y`}
                value={form.highlights}
                onChange={e => set('highlights', e.target.value)}
                placeholder="Hill forts of Amber and Mehrangarh\nCamel safaris in the Thar desert"
              />
            </Field>

            <Field label="Best time to visit">
              <input className={ADMIN_INPUT_CLASS} value={form.best_time} onChange={e => set('best_time', e.target.value)} placeholder="October to March (avoid the desert summer)" />
            </Field>
          </FormSection>

          <FormSection title="Popular cities">
            <div className="space-y-4">
              {(form.popular_cities || []).map((city, idx) => (
                <div key={idx} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start p-3 rounded-xl border border-adm-border bg-adm-raised/40">
                  <input className={ADMIN_INPUT_CLASS} placeholder="City name" value={city.name} onChange={e => setCity(idx, 'name', e.target.value)} />
                  <input className={ADMIN_INPUT_CLASS} placeholder="Short note" value={city.note || ''} onChange={e => setCity(idx, 'note', e.target.value)} />
                  <input className={ADMIN_INPUT_CLASS} placeholder="Maps URL" value={city.map_link || ''} onChange={e => setCity(idx, 'map_link', e.target.value)} />
                  <button type="button" onClick={() => removeCity(idx)} className="text-xs font-semibold text-adm-danger px-2 py-2 hover:text-red-300 transition-colors">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addCity} className="text-xs font-semibold text-adm-accent hover:text-adm-accent-hover transition-colors">
                + Add city
              </button>
            </div>
          </FormSection>

          <div className="flex gap-3 pt-5 border-t border-adm-border">
            <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
              {saving ? 'Saving…' : isEdit ? 'Update state' : 'Create state'}
            </button>
            <button type="button" onClick={() => navigate('/admin/states')} className={ADMIN_BTN_GHOST}>
              Cancel
            </button>
          </div>
        </form>

        {previewPath && (
          <div className="lg:sticky lg:top-6">
            <AdminPreviewPane path={previewPath} title="Public page preview" />
          </div>
        )}
      </div>
    </div>
  );
}
