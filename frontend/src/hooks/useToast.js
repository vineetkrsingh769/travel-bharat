import { useState, useCallback } from 'react';

export default function useToast(durationMs = 3000) {
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), durationMs);
  }, [durationMs]);

  return { toast, showToast };
}
