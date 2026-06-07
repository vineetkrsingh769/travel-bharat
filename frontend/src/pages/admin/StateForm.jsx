import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { statesService } from '../../services/states';

const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast'];
const EMPTY = { slug: '', name: '', region: '', capital: '', blurb: '', cover_url: '', highlights: '', best_time: '', status: 'draft' };
const inp = 'w-full bg-white/5 border border-white/10 text-cream placeholder-cream/20 px-3 py-2.5 text-sm rounded-md focus:outline-none focus:border-saffron';

function Field({ label, children }) {
  return <div><label className="block text-xs uppercase tracking-widest text-cream/40 mb-1.5">{label}</label>{children}</div>;
}

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
      if (s) setForm({ ...s, highlights: (s.highlights || []).join('\n') });
      setLoading(false);
    });
  }, [id]);

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    if (field === 'name' && !isEdit) {
      setForm(f => ({ ...f, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {
      ...form,
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
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

  if (loading) return <div className="animate-pulse h-96 bg-white/5 rounded-lg" />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-cream">{isEdit ? 'Edit state' : 'Add new state'}</h1>
      </div>

      {error && <div className="mb-4 bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name *"><input className={inp} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Rajasthan" /></Field>
          <Field label="Slug *"><input className={inp} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="rajasthan" /></Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Region *">
            <select className={inp} value={form.region} onChange={e => set('region', e.target.value)} required>
              <option value="">Select region…</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Capital *"><input className={inp} value={form.capital} onChange={e => set('capital', e.target.value)} required placeholder="Jaipur" /></Field>
          <Field label="Status *">
            <select className={inp} value={form.status} onChange={e => set('status', e.target.value)} required>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>

        <Field label="Blurb (one-sentence editorial)">
          <input className={inp} value={form.blurb} onChange={e => set('blurb', e.target.value)} placeholder="Forts of pink sandstone, golden deserts and royal courtyards." />
        </Field>

        <Field label="Cover image URL">
          <input className={inp} value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="/assets/place-hawamahal.jpg" />
        </Field>

        {form.cover_url && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-md">
            <img src={form.cover_url} alt="preview" className="h-16 w-24 object-cover rounded" onError={e => e.target.style.display='none'} />
            <span className="text-xs text-cream/40">Cover preview</span>
          </div>
        )}

        <Field label="Highlights (one per line)">
          <textarea
            className={`${inp} min-h-[100px] resize-y`}
            value={form.highlights}
            onChange={e => set('highlights', e.target.value)}
            placeholder={"Hill forts of Amber and Mehrangarh\nCamel safaris in the Thar desert"}
          />
        </Field>

        <Field label="Best time to visit">
          <input className={inp} value={form.best_time} onChange={e => set('best_time', e.target.value)} placeholder="October to March (avoid the desert summer)" />
        </Field>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button type="submit" disabled={saving} className="bg-saffron hover:bg-saffron/90 disabled:opacity-50 text-ink font-semibold px-6 py-2.5 rounded-md text-sm transition-colors">
            {saving ? 'Saving…' : isEdit ? 'Update state' : 'Create state'}
          </button>
          <button type="button" onClick={() => navigate('/admin/states')} className="bg-white/5 hover:bg-white/10 text-cream/60 px-6 py-2.5 rounded-md text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
