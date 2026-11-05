// The hooks every interactive piece shares: the page's theme, the visitor's motion setting and the phone breakpoint. Use these
// rather than reading the DOM or a media query in a component, so every demo answers the same way on the site and in Studio.
import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

/** useLayoutEffect in the browser, useEffect on the server (where layout effects warn and never run). */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** The element that sets this piece's color mode: the nearest `data-color-mode` boundary, then Studio's Website system boundary,
 *  then <html>, where the site's theme switch toggles `.dark`. */
function themeRoot(node?: Element | null): HTMLElement {
  return (
    node?.closest<HTMLElement>('[data-color-mode]') ??
    document.querySelector<HTMLElement>('.website-theme[data-color-mode]') ??
    document.documentElement
  );
}

/** Whether the page is in dark mode, following the theme switch. Pass a ref when several themed areas share a page. */
export function useDark(ref?: RefObject<Element | null>) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = themeRoot(ref?.current);
    const read = () => setDark(root.dataset.colorMode ? root.dataset.colorMode === 'dark' : root.classList.contains('dark'));
    read();
    const watch = new MutationObserver(read);
    watch.observe(root, { attributes: true, attributeFilter: ['class', 'data-color-mode'] });
    return () => watch.disconnect();
  }, [ref]);
  return dark;
}

/** Whether the visitor asked for less motion. */
export function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const on = () => setReduced(query.matches);
    query.addEventListener('change', on);
    return () => query.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Whether the page is phone-sized (640px or narrower). Case study demos keep their desktop layout there, shown whole, and zoom in a
 *  little on the steps that need a closer look; product pages design each phone visual on its own. */
export function usePhone() {
  const [phone, setPhone] = useState(false);
  // Set before the first paint after hydration, so a phone never sees the desktop frame.
  useIsomorphicLayoutEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setPhone(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return phone;
}
