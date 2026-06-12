import React, { useState } from 'react';

function isGenericAsset(src) {
  if (!src) return true;
  return src.includes('hero-india');
}

export default function AdminThumb({
  src,
  alt = '',
  className = 'w-12 h-9 rounded-lg',
  fallbackLabel,
}) {
  const [failed, setFailed] = useState(false);
  const useFallback = isGenericAsset(src) || failed;
  const letter = (fallbackLabel || alt || '?').charAt(0).toUpperCase();

  if (useFallback) {
    return (
      <div
        className={`${className} shrink-0 flex items-center justify-center bg-gradient-to-br from-adm-raised to-adm-hover border border-adm-border text-[10px] font-bold text-adm-muted uppercase`}
        aria-hidden
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover border border-adm-border shrink-0 bg-adm-raised`}
      onError={() => setFailed(true)}
    />
  );
}
