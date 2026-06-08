import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';

const CATEGORIES = ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach'];
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
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest font-semibold text-ink/50 dark:text-cream/45 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="space-y-4 pt-6 border-t border-[#DDD0B8]/50 dark:border-white/10 first:border-t-0 first:pt-0">
      <h3 className="font-serif text-base font-bold text-saffron tracking-wide">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const inp = 'w-full bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink dark:text-cream placeholder-ink/20 dark:placeholder-cream/20 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/15 shadow-sm dark:shadow-none hover:border-[#C4B79F] dark:hover:border-white/20 transition-all duration-150';

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

  if (loading) return <div className="animate-pulse h-96 bg-[#FAF5EC] dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 rounded-xl" />;

  return (
    <div className="max-w-3xl animate-fadeIn">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-ink dark:text-cream">{isEdit ? 'Edit place' : 'Add new place'}</h1>
        </div>
        <div className="text-xs bg-[#FAF5EC] dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink/50 dark:text-cream/50 px-3 py-1.5 rounded-xl font-bold">
          {activeTab === 'basic' ? 'Step 1 of 3' : activeTab === 'narrative' ? 'Step 2 of 3' : 'Step 3 of 3'}
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-650 dark:text-red-350 text-sm px-4 py-3 rounded-md">{error}</div>}

      {/* Tabs selector */}
      <div className="flex border border-[#DDD0B8]/80 dark:border-white/10 p-1.5 bg-white/50 dark:bg-[#121316] rounded-xl mb-6 shadow-sm gap-1.5">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-center py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${
              activeTab === t.id
                ? 'bg-saffron text-white dark:text-ink shadow-md shadow-saffron/10'
                : 'text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121316] border border-[#DDD0B8]/80 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            <FormSection title="Identity & Location">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name *">
                  <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Taj Mahal" />
                </Field>
                <Field label="Slug *">
                  <input className={inp} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="taj-mahal" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="State *">
                  <select className={inp} value={form.state_id} onChange={e => set('state_id', e.target.value)} required>
                    <option value="" className="text-ink/50 dark:text-cream/50 bg-white dark:bg-[#0B0C0E]">Select a state…</option>
                    {states.map(s => <option key={s.id} value={s.id} className="text-ink dark:text-cream bg-white dark:bg-[#0B0C0E]">{s.name}</option>)}
                  </select>
                </Field>
                <Field label="City *">
                  <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Agra" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Category *">
                  <select className={inp} value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="" className="text-ink/50 dark:text-cream/50 bg-white dark:bg-[#0B0C0E]">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="text-ink dark:text-cream bg-white dark:bg-[#0B0C0E]">{c}</option>)}
                  </select>
                </Field>
                <Field label="Status *">
                  <select className={inp} value={form.status} onChange={e => set('status', e.target.value)} required>
                    <option value="draft" className="text-ink dark:text-cream bg-white dark:bg-[#0B0C0E]">Draft</option>
                    <option value="pending" className="text-ink dark:text-cream bg-white dark:bg-[#0B0C0E]">Pending Review</option>
                    <option value="published" className="text-ink dark:text-cream bg-white dark:bg-[#0B0C0E]">Published</option>
                  </select>
                </Field>
              </div>
            </FormSection>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div className="space-y-6 animate-fadeIn">
            <FormSection title="Editorial Narratives">
              <Field label="Tagline">
                <input className={inp} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="A study in absolute Mughal symmetry, where white Makrana marble mirrors the sky." />
              </Field>

              <Field label="Description">
                <textarea className={`${inp} min-h-[120px] resize-y`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full editorial description…" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Editorial Trivia (Fascinating facts)">
                  <textarea
                    className={`${inp} min-h-[100px] resize-y`}
                    value={form.trivia || ''}
                    onChange={e => set('trivia', e.target.value)}
                    placeholder="The Taj Mahal changes color depending on the time of day, appearing pearly pink in the morning and golden in the moonlight."
                  />
                </Field>

                <Field label="Travel Tip (Practical advice)">
                  <textarea
                    className={`${inp} min-h-[100px] resize-y`}
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
                  <input className={inp} value={form.best_time} onChange={e => set('best_time', e.target.value)} placeholder="October to March" />
                </Field>
                <Field label="Timings">
                  <input className={inp} value={form.timings} onChange={e => set('timings', e.target.value)} placeholder="9:00 AM – 5:00 PM" />
                </Field>
                <Field label="Entry fee">
                  <input className={inp} value={form.entry_fee} onChange={e => set('entry_fee', e.target.value)} placeholder="₹50 (Indian)" />
                </Field>
              </div>

              <Field label="Google Maps URL">
                <input className={inp} value={form.map_link} onChange={e => set('map_link', e.target.value)} placeholder="https://maps.google.com/?q=Taj+Mahal" />
              </Field>

              <Field label="Nearby attractions (comma-separated)">
                <input className={inp} value={form.nearby} onChange={e => set('nearby', e.target.value)} placeholder="Agra Fort, Mehtab Bagh" />
              </Field>
            </FormSection>

            <FormSection title="Media & Photos">
              <div className="grid sm:grid-cols-2 gap-5 items-start">
                <Field label="Main Image URL">
                  <input className={inp} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="/assets/place-taj.jpg" />
                  {form.image_url && (
                    <div className="flex items-center gap-3 p-3 bg-[#FAF5EC]/50 dark:bg-white/2 border border-[#DDD0B8]/40 dark:border-white/5 rounded-xl mt-3 animate-fadeIn">
                      <img src={form.image_url} alt="preview" className="h-16 w-24 object-cover rounded-xl shadow-sm" onError={e => e.target.style.display='none'} />
                      <span className="text-xs text-ink/50 dark:text-cream/45">Image preview</span>
                    </div>
                  )}
                </Field>

                <Field label="Gallery Images (Slideshow)">
                  <div className="space-y-3">
                    {(form.images || []).map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center animate-fadeIn">
                        <input
                          className={`${inp} flex-1`}
                          value={img}
                          onChange={e => {
                            const copy = [...form.images];
                            copy[idx] = e.target.value;
                            set('images', copy);
                          }}
                          placeholder="/assets/place-taj.jpg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...form.images];
                            copy.splice(idx, 1);
                            set('images', copy);
                          }}
                          className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-500/30 text-red-655 dark:text-red-350 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:scale-[1.01] active:scale-[0.98] transition-all duration-100"
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
                      className="bg-[#FAF5EC] dark:bg-white/5 hover:bg-[#EDE5D4]/60 dark:hover:bg-white/10 text-ink/75 dark:text-cream/75 border border-[#DDD0B8] dark:border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold hover:scale-[1.01] active:scale-[0.98] transition-all duration-100 animate-fade-in"
                    >
                      + Add Gallery Image
                    </button>
                  </div>

                  {(form.images || []).filter(Boolean).length > 0 && (
                    <div className="grid grid-cols-4 gap-3 p-3 bg-[#FAF5EC]/50 dark:bg-white/2 border border-[#DDD0B8]/40 dark:border-white/5 rounded-xl mt-3">
                      {form.images.filter(Boolean).map((img, idx) => (
                        <div key={idx} className="relative aspect-[16/10] bg-black/10 rounded-xl overflow-hidden shadow-sm border border-[#DDD0B8]/30 dark:border-white/5">
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
        <div className="flex items-center justify-between pt-5 border-t border-[#DDD0B8]/60 dark:border-white/10">
          <div className="flex gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'narrative') setActiveTab('basic');
                  if (activeTab === 'logistics') setActiveTab('narrative');
                }}
                className="bg-[#FAF8F5] dark:bg-white/5 hover:bg-[#EDE5D4]/60 dark:hover:bg-white/10 border border-[#DDD0B8] dark:border-white/10 text-ink/70 dark:text-cream/75 px-4 py-2.5 rounded-xl text-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-100 font-bold"
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
                className="bg-saffron/10 hover:bg-saffron/20 border border-saffron/20 text-saffron px-5 py-2.5 rounded-xl text-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-100 font-bold"
              >
                Next →
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-saffron hover:bg-saffron/90 disabled:opacity-50 text-white dark:text-ink font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-100"
            >
              {saving ? 'Saving…' : isEdit ? 'Update place' : 'Create place'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/places')}
              className="bg-[#FAF5EC] dark:bg-white/5 hover:bg-[#EDE5D4]/60 dark:hover:bg-white/10 border border-[#DDD0B8] dark:border-white/10 text-ink/70 dark:text-cream/75 px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.01] active:scale-[0.98] transition-all duration-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
