// Snapshot clips play while they're on screen, so each card shows its piece being used without a hover. Under reduced
// motion they keep their poster.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

function initSnapshots() {
  const clips = document.querySelectorAll<HTMLVideoElement>("[data-snapshot-clip]");
  if (!clips.length || reduce.matches) return;
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const clip = target as HTMLVideoElement;
      if (isIntersecting) clip.play().catch(() => {});
      else clip.pause();
    }
  }, { threshold: 0.4 });
  clips.forEach((clip) => observer.observe(clip));
  document.addEventListener("astro:before-swap", () => observer.disconnect(), { once: true });
}

initSnapshots();
document.addEventListener("astro:after-swap", initSnapshots);
