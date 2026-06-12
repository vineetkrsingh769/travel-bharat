import React from 'react';
import { Link } from 'react-router-dom';

const actionBtn = 'text-xs font-semibold transition-all duration-100 hover:scale-[1.05] active:scale-[0.95]';

export default function StatusActions({ status, editTo, isDeleting, onStatusChange, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {status !== 'published' && (
        <button
          type="button"
          onClick={() => onStatusChange('published')}
          className={`${actionBtn} text-emerald-600 dark:text-emerald-450 hover:text-emerald-500`}
        >
          Publish
        </button>
      )}
      {status === 'published' && (
        <button
          type="button"
          onClick={() => onStatusChange('draft')}
          className={`${actionBtn} text-ink/50 dark:text-cream/60 hover:text-ink dark:hover:text-cream font-medium`}
        >
          Unpublish
        </button>
      )}
      {status === 'draft' && (
        <button
          type="button"
          onClick={() => onStatusChange('pending')}
          className={`${actionBtn} text-orange-600 dark:text-orange-400 hover:text-orange-500`}
        >
          Submit
        </button>
      )}
      <Link to={editTo} className={`${actionBtn} text-saffron hover:text-saffron/80`}>Edit</Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className={`${actionBtn} text-red-600 dark:text-red-400 hover:text-red-500 disabled:opacity-50`}
      >
        Delete
      </button>
    </div>
  );
}
