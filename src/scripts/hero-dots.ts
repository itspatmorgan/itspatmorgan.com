// The dot halo behind the home hero's photo, drawn on a canvas so it can respond. At rest it matches the CSS halo it replaces
// (`.hero-desktop::before` in index.astro, which phones, reduced motion and no-JS keep). Near the pointer the dots bloom and lean
// away, and the bloom can reach a little past the halo. `ripple()` sends one soft ring out from the photo: with the hero's first
// dissolve and with builder mode. It draws at 30fps only while something moves, and stops when the field settles.

const PAD = 160;     // how far the canvas overhangs the hero, so the bloom can reach past the halo
const STEP = 14;     // the CSS halo's grid
const RADIUS = 130;  // the pointer's reach
const RIPPLE_SPEED = 0.3;  // px per ms
const RIPPLE_END = 480;    // px from the photo's center
const RIPPLE_BAND = 56;    // the ring's width
const RIPPLE_LIFT = 0.35;  // the ring's peak, as a share of the pointer's bloom

type Dot = { x: number; y: number; base: number; reach: number };

export function initHeroDots(): { ripple: () => void } | null {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>(".hero-desktop");
  if (!hero || hero.querySelector(".hero-dots") || getComputedStyle(hero).display === "none") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.className = "hero-dots";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);

  let dots: Dot[] = [], width = 0, height = 0, ink = "", baseAlpha = 0.105;
  let origin = { x: 0, y: 0 };

  // The CSS halo: a 14px grid in a box min(34rem, 40vw) by 26rem, centered at 80% / 53% of the hero and turned 1deg, masked by an
  // ellipse at 55% / 54% that is solid to 52% and gone by 82%. Dots outside it are kept at zero, so the pointer can reveal them.
  const layout = () => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width + PAD * 2; height = rect.height + PAD * 2;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rem = parseFloat(getComputedStyle(root).fontSize);
    const boxW = Math.min(34 * rem, window.innerWidth * 0.4), boxH = 26 * rem;
    const cx = PAD + rect.width * 0.8, cy = PAD + rect.height * 0.53;
    const angle = Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
    // An ellipse at farthest-corner keeps the farthest-side proportions, scaled by √2 to reach the corner.
    const rx = 0.55 * boxW * Math.SQRT2, ry = 0.54 * boxH * Math.SQRT2;
    origin = { x: cx, y: cy };
    dots = [];
    const span = Math.hypot(width, height) / 2;
    for (let gy = -span; gy < span; gy += STEP) {
      for (let gx = -span; gx < span; gx += STEP) {
        const x = cx + gx * cos - gy * sin, y = cy + gx * sin + gy * cos;
        if (x < -4 || y < -4 || x > width + 4 || y > height + 4) continue;
        const lx = gx + boxW / 2, ly = gy + boxH / 2;
        let base = 0;
        if (lx >= 0 && lx <= boxW && ly >= 0 && ly <= boxH) {
          const d = Math.hypot((lx - 0.55 * boxW) / rx, (ly - 0.54 * boxH) / ry);
          base = d <= 0.52 ? 1 : d >= 0.82 ? 0 : 1 - (d - 0.52) / 0.3;
        }
        // The reveal fades toward the canvas edge, so the field never shows a hard border.
        const edge = Math.min(x, y, width - x, height - y);
        dots.push({ x, y, base, reach: Math.max(0, Math.min(1, edge / PAD)) });
      }
    }
    ink = getComputedStyle(root).getPropertyValue("--foreground").trim();
    baseAlpha = root.classList.contains("dark") ? 0.11 : 0.105;
    draw();
  };

  let pointer = { x: 0, y: 0 }, shown = { x: 0, y: 0 }, strength = 0, target = 0;
  let ripple = -1; // ms since the ripple started, or -1
  let last = 0, frame = 0;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = ink;
    const ringR = ripple < 0 ? -1 : ripple * RIPPLE_SPEED;
    const ringFade = ringR < 0 ? 0 : Math.sin(Math.PI * Math.min(1, ringR / RIPPLE_END)); // eases in and out
    for (const dot of dots) {
      const dx = dot.x - shown.x, dy = dot.y - shown.y;
      const dist = Math.hypot(dx, dy);
      const lift = dist < RADIUS ? (1 - dist / RADIUS) ** 2 * strength * dot.reach : 0;
      let ring = 0;
      if (ringR >= 0 && dot.base > 0) {
        const band = Math.abs(Math.hypot(dot.x - origin.x, dot.y - origin.y) - ringR);
        if (band < RIPPLE_BAND) ring = (1 - band / RIPPLE_BAND) * ringFade * RIPPLE_LIFT * dot.base;
      }
      const glow = Math.max(lift, ring);
      const alpha = baseAlpha * dot.base + glow * 0.28;
      if (alpha < 0.004) continue;
      const push = dist < RADIUS ? (lift * 5) / Math.max(dist, 1) : 0;
      ctx.globalAlpha = Math.min(alpha, 0.5);
      ctx.beginPath();
      ctx.arc(dot.x + dx * push, dot.y + dy * push, 1.25 + lift * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (last && now - last < 32) return;
    const dt = last ? Math.min(now - last, 64) : 32;
    last = now;
    shown.x += (pointer.x - shown.x) * 0.22; shown.y += (pointer.y - shown.y) * 0.22;
    strength += (target - strength) * 0.14;
    if (ripple >= 0) ripple = ripple * RIPPLE_SPEED > RIPPLE_END ? -1 : ripple + dt;
    draw();
    const settled = Math.abs(target - strength) < 0.005 && Math.hypot(pointer.x - shown.x, pointer.y - shown.y) < 0.5 && ripple < 0;
    if (settled) { cancelAnimationFrame(frame); frame = 0; last = 0; }
  };
  const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const section = hero.closest("section") ?? hero;
    section.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (strength < 0.01) shown = { ...pointer };
      target = 1; wake();
    }, { passive: true });
    section.addEventListener("pointerleave", () => { target = 0; wake(); });
  }

  new ResizeObserver(layout).observe(hero);
  // The theme changes the ink.
  new MutationObserver(layout).observe(root, { attributes: true, attributeFilter: ["class"] });
  root.dataset.heroDots = "";
  layout();
  return { ripple: () => { ripple = 0; wake(); } };
}
