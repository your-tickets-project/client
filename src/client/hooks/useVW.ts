import { useState, useCallback, useEffect } from 'react';

export default function useVW(): number | null {
  const [viewportWidth, setInnerWidth] = useState<number | null>(null);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, []);

  const setSize = useCallback(() => {
    setInnerWidth(window.innerWidth || 0);
  }, []);

  typeof window !== 'undefined' &&
    window.addEventListener('resize', setSize, { passive: true });
  typeof window !== 'undefined' &&
    window.addEventListener('orientationchange', setSize, { passive: true });

  return viewportWidth;
}
