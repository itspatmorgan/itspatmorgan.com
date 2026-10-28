import { useEffect, useRef, useState } from 'react';

/** Deterministic, visible-only playback; manual interaction pauses the script. With `once`, it plays through a single time and holds the last step. */
export function useDemoLoop(durations: readonly number[], initial = 0, resetFade = true, once = false) {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(initial);
  const [playing, setPlaying] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [generation, setGeneration] = useState(0);
  const version = useRef(0);
  const elapsed = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 });
    if (ref.current) observer.observe(ref.current);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => { setReduced(media.matches); if (media.matches) { setPlaying(false); if (once) setStep(durations.length - 1); } };
    const visibility = () => setForeground(!document.hidden);
    motion(); visibility();
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    if (!playing || !visible || !foreground || (once && step === durations.length - 1)) return;
    const start = performance.now();
    const current = version.current;
    let finished = false;
    let resetTimer: number | undefined;
    const advance = () => {
      finished = true; elapsed.current = 0;
      setStep(s => (s + 1) % durations.length);
      setResetting(false);
    };
    const timer = window.setTimeout(() => {
      if (resetFade && step === durations.length - 1 && !reduced) {
        setResetting(true);
        resetTimer = window.setTimeout(advance, 180);
      } else advance();
    }, Math.max(0, durations[step] - elapsed.current));
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(resetTimer);
      if (resetTimer !== undefined) setResetting(false);
      if (!finished && current === version.current) elapsed.current += performance.now() - start;
    };
  }, [step, playing, visible, foreground, generation, durations, reduced, resetFade, once]);

  const choose = (next: number) => { version.current++; elapsed.current = 0; setPlaying(false); setResetting(false); setStep(Math.max(0, Math.min(durations.length - 1, next))); setGeneration(g => g + 1); };
  const replay = () => { version.current++; elapsed.current = 0; setStep(0); setResetting(false); setPlaying(true); setGeneration(g => g + 1); };
  return { ref, step, playing, reduced, resetting, count: durations.length, choose, replay, toggle: () => setPlaying(p => !p), pause: () => setPlaying(false) };
}
export type DemoLoop = ReturnType<typeof useDemoLoop>;
