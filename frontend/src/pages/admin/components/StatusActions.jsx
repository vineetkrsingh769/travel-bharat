import React from 'react';
import { Link } from 'react-router-dom';

const actionBtn = 'text-xs font-semibold transition-colors';

export default function StatusActions({
  status,
  editTo,
  isDeleting,
  onStatusChange,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {status !== 'published' && (
        <button
          type="button"
          onClick={() => onStatusChange('published')}
          className={`${actionBtn} text-adm-success hover:text-emerald-300`}
        >
          Publish
        </button>
      )}
      {status === 'published' && (
        <button
          type="button"
          onClick={() => onStatusChange('draft')}
          className={`${actionBtn} text-adm-muted hover:text-adm-ink`}
        >
          Unpublish
        </button>
      )}
      {status === 'draft' && (
        <button
          type="button"
          onClick={() => onStatusChange('pending')}
          className={`${actionBtn} text-adm-warning hover:text-orange-300`}
        >
          Submit
        </button>
      )}
      <Link to={editTo} className={`${actionBtn} text-adm-accent hover:text-adm-accent-hover`}>Edit</Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className={`${actionBtn} text-adm-danger hover:text-red-300 disabled:opacity-50`}
      >
        Delete
      </button>
    </div>
  );
}
