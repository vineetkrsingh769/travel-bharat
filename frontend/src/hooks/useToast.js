import { useState, useCallback } from 'react';

export default function useToast(durationMs = 3500) {
  const [toast, setToast] = useState('');
  const [toastHref, setToastHref] = useState(null);

  const showToast = useCallback((msg, href = null) => {
    setToast(msg);
    setToastHref(href);
    setTimeout(() => {
      setToast('');
      setToastHref(null);
    }, durationMs);
  }, [durationMs]);

  return { toast, toastHref, showToast };
}
