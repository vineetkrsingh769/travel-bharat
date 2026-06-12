import React from 'react';

export default function AdminToast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-emerald-50 text-sm px-4 py-3 rounded-xl shadow-lg border border-emerald-600">
      {message}
    </div>
  );
}
