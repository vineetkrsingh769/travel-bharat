import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-semibold text-ink">404</h1>
        <h2 className="mt-4 font-serif text-xl text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
