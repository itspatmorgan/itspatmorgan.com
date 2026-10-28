import { useEffect, useRef, useState } from 'react';

/** Plays an intro once, the first time the element scrolls into view, and then holds. */
export function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShown(true); observer.disconnect(); } }, { threshold: .25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, shown };
}
