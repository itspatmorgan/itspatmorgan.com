import { useEffect, useRef, useState, type ComponentType } from 'react';
import { FormatContext, type Format } from '@/components/case-study/scene';
import { formats, type FormatId } from './formats';
import { products, type Detail, type Visual } from './library';

/** One visual drawn in one format at the format's own pixel size, or one of its details: the scene laid out for the format, then
 *  cropped to the detail's regions once they are on screen. */
export function VisualFrame({ visual, format, detail }: { visual: Visual; format: FormatId; detail?: Detail }) {
  const [Scene, setScene] = useState<ComponentType<any> | null>(null);
  const [crop, setCrop] = useState<Format['crop']>();
  const ref = useRef<HTMLDivElement>(null);
  const base = formats[format];
  useEffect(() => { visual.load().then(m => setScene(() => m.default)); }, [visual]);
  // A detail measures its regions on the laid-out stage, in stage pixels, then crops to them with its padding.
  useEffect(() => {
    setCrop(undefined);
    if (!detail || !Scene) return;
    const timer = window.setInterval(() => {
      const root = ref.current, native = root?.querySelector<HTMLElement>('.cs-native');
      const regions = detail.frames.map(f => root?.querySelector<HTMLElement>(`[data-frame="${f}"]`));
      if (!native || regions.some(r => !r)) return;
      window.clearInterval(timer);
      const n = native.getBoundingClientRect(), k = n.width / base.width;
      // A region is often a full-width row (the Performance tiles), so frame what's in it: the union of its children.
      const rects = regions.flatMap(r => r!.children.length ? [...r!.children] : [r!]).map(el => el.getBoundingClientRect());
      const [top, right, bottom, left] = typeof detail.pad === 'number' ? [detail.pad, detail.pad, detail.pad, detail.pad] : detail.pad;
      const x = (Math.min(...rects.map(r => r.left)) - n.left) / k - left;
      const y = (Math.min(...rects.map(r => r.top)) - n.top) / k - top;
      const x2 = (Math.max(...rects.map(r => r.right)) - n.left) / k + right;
      const y2 = (Math.max(...rects.map(r => r.bottom)) - n.top) / k + bottom;
      setCrop({ x: Math.round(x), y: Math.round(y), width: Math.round(x2 - x), height: Math.round(y2 - y) });
    }, 250);
    return () => window.clearInterval(timer);
  }, [detail, Scene, base.width]);
  return <div ref={ref} className={`vl-visual ${products[visual.project].className}`} style={{ width: detail ? detail.width : base.width }} data-ready={!!Scene && (!detail || !!crop)} data-poster={visual.poster}>
    {/* A detail is cropped anyway, so its stage runs twice as tall: a region low on the screen isn't cut off at the format's edge. */}
    <FormatContext.Provider value={{ ...base, height: detail ? base.height * 2 : base.height, crop }}>
      {Scene && <Scene {...visual.props} />}
    </FormatContext.Provider>
  </div>;
}
