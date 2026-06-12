import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';
import { PLACE_CATEGORIES } from '../../constants/tourism';
import { Field, FormSection, ADMIN_INPUT_CLASS } from './components/AdminForm';
import AssetPicker from './components/AssetPicker';
import AdminPreviewPane from './components/AdminPreviewPane';
import ViewOnSiteLink from './components/ViewOnSiteLink';
import { PLACE_IMAGE_ASSETS, HERO_IMAGE } from '../../constants/assets';
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_PAGE_TITLE,
} from './constants';

const TABS = [
  { id: 'basic',     label: '1. Basic Info' },
  { id: 'narrative', label: '2. Editorial Narrative' },
  { id: 'logistics', label: '3. Logistics & Media' }
];
const EMPTY = {
  slug: '', name: '', state_id: '', state_name: '', city: '', category: '',
  image_url: '', tagline: '', description: '', best_time: '',
  timings: '', entry_fee: '', map_link: '', nearby: '',
  status: 'draft',
  images: [],
  trivia: '',
  travel_tip: '',
  featured: false,
  sort_order: 0,
};

export default function PlaceForm() {
  const { id }   = useParams();
  const isEdit   = !!id;
  const navigate = useNavigate();

  const [form, setForm]     = useState(EMPTY);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]   = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    statesService.getAllAdmin().then(setStates);
    if (isEdit) {
      // Fetch by id — use list to find slug, then fetch full details with images
      placesService.getAllAdmin().then(all => {
        const p = all.find(x => String(x.id) === id);
        if (p) {
          placesService.getBySlug(p.slug).then(full => {
            setForm({
              ...full,
              nearby: (full.nearby || []).join(', '),
              images: full.images || [],
              trivia: full.trivia || '',
              travel_tip: full.travel_tip || '',
              featured: Boolean(full.featured),
              sort_order: full.sort_order ?? 0,
            });
            setLoading(false);
          }).catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      }).catch(() => setLoading(false));
    }
  }, [id]);

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    // Auto-fill state_name when state_id changes
    if (field === 'state_id') {
      const s = states.find(s => String(s.id) === String(val));
      if (s) setForm(f => ({ ...f, state_id: val, state_name: s.name }));
    }
    // Auto-generate slug from name
    if (field === 'name' && !isEdit) {
      setForm(f => ({ ...f, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, nearby: form.nearby };
    try {
      if (isEdit) await placesService.update(id, payload);
      else          await placesService.create(payload);
      navigate('/admin/places');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse h-96 bg-adm-surface border border-adm-border rounded-2xl" />;

  const previewPath = form.slug ? `/places/${form.slug}` : null;

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE}>{isEdit ? 'Edit place' : 'Add new place'}</h1>
          {form.slug && (
            <ViewOnSiteLink href={previewPath} status={form.status} label="View on public site" />
          )}
        </div>
        <div className="text-xs bg-adm-raised border border-adm-border text-adm-faint px-3 py-1.5 rounded-xl font-semibold">
          {activeTab === 'basic' ? 'Step 1 of 3' : activeTab === 'narrative' ? 'Step 2 of 3' : 'Step 3 of 3'}
        </div>
      </div>

      {error && <div className="mb-4 bg-adm-danger/10 border border-adm-danger/30 text-adm-danger text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Tabs selector */}
      <div className="flex border border-adm-border p-1.5 bg-adm-raised rounded-xl mb-6 gap-1.5">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-center py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === t.id
                ? 'bg-adm-accent text-adm-void shadow-sm'
                : 'text-adm-muted hover:text-adm-ink hover:bg-adm-hover'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,400px)] items-start">
      <form onSubmit={handleSubmit} className={`${ADMIN_CARD} p-6 sm:p-8 space-y-6`}>
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            <FormSection title="Identity & Location">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name *">
                  <input className={ADMIN_INPUT_CLASS} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Taj Mahal" />
                </Field>
                <Field label="Slug *">
                  <input className={ADMIN_INPUT_CLASS} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="taj-mahal" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="State *">
                  <select className={ADMIN_INPUT_CLASS} value={form.state_id} onChange={e => set('state_id', e.target.value)} required>
                    <option value="">Select a state…</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="City *">
                  <input className={ADMIN_INPUT_CLASS} value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Agra" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Category *">
                  <select className={ADMIN_INPUT_CLASS} value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">Select category…</option>
                    {PLACE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Status *">
                  <select className={ADMIN_INPUT_CLASS} value={form.status} onChange={e => set('status', e.target.value)} required>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Review</option>
                    <option value="published">Published</option>
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 pt-2 border-t border-adm-border">
                <Field label="Home spotlight">
                  <label className="flex items-center gap-2 text-sm text-adm-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => set('featured', e.target.checked)}
                      className="rounded border-adm-border text-adm-accent focus:ring-adm-accent"
                    />
                    Featured on home page
                  </label>
                </Field>
                <Field label="Spotlight order (lower = first)">
                  <input
                    type="number"
                    min={0}
                    className={ADMIN_INPUT_CLASS}
                    value={form.sort_order}
                    onChange={e => set('sort_order', Number(e.target.value) || 0)}
                  />
                </Field>
              </div>
            </FormSection>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div className="space-y-6 animate-fadeIn">
            <FormSection title="Editorial Narratives">
              <Field label="Tagline">
                <input className={ADMIN_INPUT_CLASS} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="A study in absolute Mughal symmetry, where white Makrana marble mirrors the sky." />
              </Field>

              <Field label="Description">
                <textarea className={`${ADMIN_INPUT_CLASS} min-h-[120px] resize-y`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full editorial description…" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Editorial Trivia (Fascinating facts)">
                  <textarea
                    className={`${ADMIN_INPUT_CLASS} min-h-[100px] resize-y`}
                    value={form.trivia || ''}
                    onChange={e => set('trivia', e.target.value)}
                    placeholder="The Taj Mahal changes color depending on the time of day, appearing pearly pink in the morning and golden in the moonlight."
                  />
                </Field>

                <Field label="Travel Tip (Practical advice)">
                  <textarea
                    className={`${ADMIN_INPUT_CLASS} min-h-[100px] resize-y`}
                    value={form.travel_tip || ''}
                    onChange={e => set('travel_tip', e.target.value)}
                    placeholder="Arrive by 5:30 AM to catch the sunrise and beat the long security lines at the East Gate."
                  />
                </Field>
              </div>
            </FormSection>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="space-y-6 animate-fadeIn">
            <FormSection title="Logistics & Geography">
              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="Best time to visit">
                  <input className={ADMIN_INPUT_CLASS} value={form.best_time} onChange={e => set('best_time', e.target.value)} placeholder="October to March" />
                </Field>
                <Field label="Timings">
                  <input className={ADMIN_INPUT_CLASS} value={form.timings} onChange={e => set('timings', e.target.value)} placeholder="9:00 AM – 5:00 PM" />
                </Field>
                <Field label="Entry fee">
                  <input className={ADMIN_INPUT_CLASS} value={form.entry_fee} onChange={e => set('entry_fee', e.target.value)} placeholder="₹50 (Indian)" />
                </Field>
              </div>

              <Field label="Google Maps URL">
                <input className={ADMIN_INPUT_CLASS} value={form.map_link} onChange={e => set('map_link', e.target.value)} placeholder="https://maps.google.com/?q=Taj+Mahal" />
              </Field>

              <Field label="Nearby attractions (comma-separated)">
                <input className={ADMIN_INPUT_CLASS} value={form.nearby} onChange={e => set('nearby', e.target.value)} placeholder="Agra Fort, Mehtab Bagh" />
              </Field>
            </FormSection>

            <FormSection title="Media & Photos">
              <div className="grid sm:grid-cols-2 gap-5 items-start">
                <Field label="Main image">
                  <input className={ADMIN_INPUT_CLASS} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder={HERO_IMAGE} />
                  <AssetPicker
                    value={form.image_url}
                    onChange={url => set('image_url', url)}
                    assets={PLACE_IMAGE_ASSETS}
                    subfolder="uploads"
                  />
                  {form.image_url && (
                    <div className="flex items-center gap-3 p-3 bg-adm-raised border border-adm-border rounded-xl mt-3">
                      <img src={form.image_url} alt="preview" className="h-16 w-24 object-cover rounded-xl" onError={e => e.target.style.display='none'} />
                      <span className="text-xs text-adm-faint">Image preview</span>
                    </div>
                  )}
                </Field>

                <Field label="Gallery Images (Slideshow)">
                  <div className="space-y-3">
                    {(form.images || []).map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center animate-fadeIn">
                        <input
                          className={`${ADMIN_INPUT_CLASS} flex-1`}
                          value={img}
                          onChange={e => {
                            const copy = [...form.images];
                            copy[idx] = e.target.value;
                            set('images', copy);
                          }}
                          placeholder="/assets/hero-india.jpg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...form.images];
                            copy.splice(idx, 1);
                            set('images', copy);
                          }}
                          className="bg-adm-danger/10 hover:bg-adm-danger/20 border border-adm-danger/30 text-adm-danger px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        set('images', [...(form.images || []), '']);
                      }}
                      className={`${ADMIN_BTN_GHOST} text-xs px-4 py-2.5`}
                    >
                      + Add Gallery Image
                    </button>
                  </div>

                  {(form.images || []).filter(Boolean).length > 0 && (
                    <div className="grid grid-cols-4 gap-3 p-3 bg-adm-raised border border-adm-border rounded-xl mt-3">
                      {form.images.filter(Boolean).map((img, idx) => (
                        <div key={idx} className="relative aspect-[16/10] bg-adm-void rounded-xl overflow-hidden border border-adm-border">
                          <img
                            src={img}
                            alt="gallery preview"
                            className="w-full h-full object-cover"
                            onError={e => e.target.style.display='none'}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Field>
              </div>
            </FormSection>
          </div>
        )}

        {/* Form Footer Action Row */}
        <div className="flex items-center justify-between pt-5 border-t border-adm-border">
          <div className="flex gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'narrative') setActiveTab('basic');
                  if (activeTab === 'logistics') setActiveTab('narrative');
                }}
                className={ADMIN_BTN_GHOST}
              >
                ← Back
              </button>
            )}
            {activeTab !== 'logistics' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') setActiveTab('narrative');
                  if (activeTab === 'narrative') setActiveTab('logistics');
                }}
                className="bg-adm-accent/10 hover:bg-adm-accent/20 border border-adm-accent/25 text-adm-accent px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Next →
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={ADMIN_BTN_PRIMARY}
            >
              {saving ? 'Saving…' : isEdit ? 'Update place' : 'Create place'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/places')}
              className={ADMIN_BTN_GHOST}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {previewPath && (
        <div className="lg:sticky lg:top-6">
          <AdminPreviewPane path={previewPath} title="Public page preview" />
          <p className="mt-2 text-[0.65rem] text-adm-faint leading-relaxed">
            Drafts are visible here while you are logged in. Visitors only see published content.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
