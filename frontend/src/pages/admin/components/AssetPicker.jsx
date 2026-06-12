import React, { useRef, useState } from 'react';
import api from '../../../services/api';

export default function AssetPicker({
  value,
  onChange,
  assets = [],
  allowUpload = true,
  subfolder = 'uploads',
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await api.post('/upload', {
            filename: file.name,
            base64: reader.result,
            subfolder,
          });
          onChange(res.data.url);
        } catch (err) {
          setError(err.response?.data?.error || 'Upload failed');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      setError('Could not read file');
    }
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {assets.map(url => (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            className={`relative w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
              value === url ? 'border-adm-accent ring-2 ring-adm-accent/25' : 'border-adm-border hover:border-adm-accent/40'
            }`}
          >
            <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          </button>
        ))}
      </div>
      {allowUpload && (
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-adm-border text-adm-muted hover:text-adm-ink hover:bg-adm-hover disabled:opacity-50 transition-all"
          >
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-adm-danger">{error}</p>}
    </div>
  );
}
