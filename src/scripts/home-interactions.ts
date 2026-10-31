import { dissolvePixelWave, enablePixelHover } from "./pixel-wave";

const SESSION_KEY = "pixelWaveSeen";

// Headlines render in their final state; the two pixel dissolves below are the only load and scroll motion.
// The hero dissolves on the first home visit of a session, and the closing line dissolves when it scrolls into view.
// dissolvePixelWave enables hover once it finishes; everything else gets hover straight away.
function initHomeInteractions() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem(SESSION_KEY);
  const isMd = window.matchMedia("(min-width: 768px)").matches;
  const heroWave = document.querySelector<HTMLElement>(isMd ? ".hero-desktop [data-pixel-wave]" : ".hero-mobile [data-pixel-wave]");
  const inactiveWave = document.querySelector<HTMLElement>(isMd ? ".hero-mobile [data-pixel-wave]" : ".hero-desktop [data-pixel-wave]");
  const ctaWave = document.querySelector<HTMLElement>('[data-pixel-wave="cta"]');

  // The head script may have started the hero in pixel type; every branch below sets the final styles inline first.
  const releaseIntro = () => document.documentElement.classList.remove("pw-intro");
  if (inactiveWave) enablePixelHover(inactiveWave);
  if (reducedMotion) {
    [heroWave, ctaWave].forEach((wave) => wave && enablePixelHover(wave));
    releaseIntro();
    return;
  }

  sessionStorage.setItem(SESSION_KEY, "1");
  if (heroWave) {
    if (seen) enablePixelHover(heroWave);
    else dissolvePixelWave(heroWave);
  }
  releaseIntro();

  if (ctaWave) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      dissolvePixelWave(ctaWave);
    }, { threshold: 0.3 });
    observer.observe(ctaWave);
    document.addEventListener("astro:before-swap", () => observer.disconnect(), { once: true });
  }
}

initHomeInteractions();
document.addEventListener("astro:after-swap", initHomeInteractions);
