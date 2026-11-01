import type { ComponentType } from 'react';

// The visual library: every product scene that can be drawn outside its case study, in any format in formats.ts. A scene is the
// source of truth for its screen; the library only names it, says which product it belongs to, and lists its details. A detail is a
// close look at one part of the screen (the `data-frame` regions a scene already marks), drawn natively at a larger size rather than
// cropped from a recording. Scenes on the plain stage (DemoFrame: the Design Studio diagrams) aren't here yet; they lay themselves out.
export type Detail = {
  id: string;
  title: string;
  /** The scene's `data-frame` regions to frame; the detail covers all of them. */
  frames: string[];
  /** Room around the regions, in stage pixels: one value, or [top, right, bottom, left]. */
  pad: number | [number, number, number, number];
  /** How wide the detail is drawn, in the format's pixels. */
  width: number;
};

export type Visual = {
  id: string;
  title: string;
  project: 'sublime-agents' | 'design-studio';
  load: () => Promise<{ default: ComponentType<any> }>;
  props?: Record<string, unknown>;
  /** The step whose frame tells the story on its own, for the still (a thumbnail, a printout, reduced motion): never one caught
   *  mid-change, with the result on screen. Defaults to the last step. */
  poster?: number;
  details?: Detail[];
};

/** Each project's stylesheet namespace, as its case study page sets it. */
export const products: Record<Visual['project'], { name: string; className: string }> = {
  'sublime-agents': { name: 'Sublime agents (ADÉ)', className: 'sb' },
  'design-studio': { name: 'Design Studio', className: 'sc' },
};

export const visuals: Visual[] = [
  { id: 'ade-rule', title: 'ADÉ’s recommended rule', project: 'sublime-agents', load: () => import('@/components/sublime/HeroRule'),
    details: [{ id: 'rule', title: 'The rule and its code', frames: ['rec'], pad: 24, width: 1472 }] },
  { id: 'ade-missed-threat', title: 'A threat no rule caught', project: 'sublime-agents', load: () => import('@/components/sublime/MessageDetail'), props: { variant: 'gap' } },
  { id: 'ade-rule-review', title: 'A person reviews and accepts the rule', project: 'sublime-agents', load: () => import('@/components/sublime/JobReview') },
  { id: 'ade-start-job', title: 'The job starts beside the verdict', project: 'sublime-agents', load: () => import('@/components/sublime/MessageDetail'), props: { variant: 'handoff' } },
  { id: 'ade-auto-accepted', title: 'A rule that meets the threshold goes live', project: 'sublime-agents', load: () => import('@/components/sublime/AutoAccepted') },
  { id: 'ade-automation', title: 'A team sets the limits per verdict', project: 'sublime-agents', load: () => import('@/components/sublime/AutomationConfig'),
    details: [{ id: 'verdicts', title: 'The settings per verdict', frames: ['table'], pad: 24, width: 1664 }] },
  { id: 'ade-page', title: 'ADÉ’s results and jobs', project: 'sublime-agents', load: () => import('@/components/sublime/AdeJobs'),
    details: [{ id: 'performance', title: 'Performance over 30 days', frames: ['tiles'], pad: [72, 32, 32, 32], width: 1472 }] },
  { id: 'studio-workspace', title: 'A prototype’s workspace', project: 'design-studio', load: () => import('@/components/studio-case/Workspace') },
  { id: 'studio-gallery', title: 'The team’s gallery, then and now', project: 'design-studio', load: () => import('@/components/studio-case/GalleryGrowth') },
  { id: 'studio-handoff', title: 'Engineering builds from the prototype', project: 'design-studio', load: () => import('@/components/studio-case/Handoff') },
  { id: 'studio-open', title: 'The open-source Design Studio', project: 'design-studio', load: () => import('@/components/studio-case/OpenStudio') },
];
