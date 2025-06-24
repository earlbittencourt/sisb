import { useRef, useEffect } from 'react';

export const useSpotlight = <T extends HTMLElement>() => {
  const spotlightRef = useRef<T>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--spotlight-x', `${x}px`);
      el.style.setProperty('--spotlight-y', `${y}px`);
    };

    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return spotlightRef;
}; 