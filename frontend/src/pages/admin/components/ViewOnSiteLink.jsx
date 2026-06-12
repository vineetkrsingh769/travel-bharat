import React from 'react';

export default function ViewOnSiteLink({ href, status, label = 'View on site' }) {
  const isLive = status === 'published';

  if (!href) return null;

  if (!isLive) {
    return (
      <span
        className="text-xs text-adm-faint cursor-not-allowed"
        title="Publish first to view on the public site"
      >
        {label} (draft)
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-semibold text-adm-info hover:text-sky-300 transition-colors"
    >
      {label} ↗
    </a>
  );
}
