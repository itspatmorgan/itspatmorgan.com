// Switches the site between light and dark. Every color on the page changes in the same frame: CSS transitions are held off while the
// class flips, so nothing with a color transition (rows, buttons, cards) lags behind the rest and fades over on its own afterward.
export function switchTheme(next: "light" | "dark", onApply?: () => void) {
  const root = document.documentElement;
  const apply = () => {
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next; // scrollbars and form controls follow too, even inside a viewer that set its own
    try { localStorage.setItem("theme", next); } catch { /* storage can be unavailable, e.g. in an embedded preview */ }
    onApply?.();
    // Commit the new colors before transitions come back, so none of them animate from the old theme.
    void getComputedStyle(root).color;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "startViewTransition" in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
  } else {
    apply();
  }
}
