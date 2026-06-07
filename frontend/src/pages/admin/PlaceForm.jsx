import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { placesService } from '../../services/places';
import { statesService } from '../../services/states';

const CATEGORIES = ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach'];
const EMPTY = {
  slug: '', name: '', state_id: '', state_name: '', city: '', category: '',
  image_url: '', tagline: '', description: '', best_time: '',
  timings: '', entry_fee: '', map_link: '', nearby: '',
  status: 'draft',
  images: [],
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-cream/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full bg-white/5 border border-white/10 text-cream placeholder-cream/20 px-3 py-2.5 text-sm rounded-md focus:outline-none focus:border-saffron';

export default function PlaceForm() {
  const { id }   = useParams();
  const isEdit   = !!id;
  const navigate = useNavigate();

  const [form, setForm]     = useState(EMPTY);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]   = useState('');

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
              images: full.images || []
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

  if (loading) return <div className="animate-pulse h-96 bg-white/5 rounded-lg" />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-cream">{isEdit ? 'Edit place' : 'Add new place'}</h1>
      </div>

      {error && <div className="mb-4 bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              <option value="">Select a state…</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="City *">
            <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Agra" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Category *">
            <select className={inp} value={form.category} onChange={e => set('category', e.target.value)} required>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status *">
            <select className={inp} value={form.status} onChange={e => set('status', e.target.value)} required>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Image URL">
            <input className={inp} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="/assets/place-taj.jpg" />
          </Field>
        </div>

        {form.image_url && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-md">
            <img src={form.image_url} alt="preview" className="h-16 w-24 object-cover rounded" onError={e => e.target.style.display='none'} />
            <span className="text-xs text-cream/40">Image preview</span>
          </div>
        )}

        <Field label="Tagline">
          <input className={inp} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="A study in absolute Mughal symmetry, where white Makrana marble mirrors the sky." />
        </Field>

        <Field label="Description">
          <textarea className={`${inp} min-h-[120px] resize-y`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full editorial description…" />
        </Field>

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

        <Field label="Gallery Images (Additional Slideshow Images)">
          <div className="space-y-3">
            {(form.images || []).map((img, idx) => (
              <div key={idx} className="flex gap-2 items-center">
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
                  className="bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 px-3 py-2.5 rounded-md text-xs transition-colors"
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
              className="bg-white/5 hover:bg-white/10 text-cream/70 border border-white/10 px-4 py-2 rounded-md text-xs transition-colors"
            >
              + Add Gallery Image
            </button>
          </div>

          {(form.images || []).filter(Boolean).length > 0 && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-white/5 rounded-md mt-3">
              {form.images.filter(Boolean).map((img, idx) => (
                <div key={idx} className="relative aspect-[16/10] bg-black/20 rounded overflow-hidden">
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

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button type="submit" disabled={saving} className="bg-saffron hover:bg-saffron/90 disabled:opacity-50 text-ink font-semibold px-6 py-2.5 rounded-md text-sm transition-colors">
            {saving ? 'Saving…' : isEdit ? 'Update place' : 'Create place'}
          </button>
          <button type="button" onClick={() => navigate('/admin/places')} className="bg-white/5 hover:bg-white/10 text-cream/60 px-6 py-2.5 rounded-md text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
