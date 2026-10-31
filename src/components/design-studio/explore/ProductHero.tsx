import { StudioWindow, artifacts, useAutoplay } from './StudioWindow';

// Exploration 3, after Linear and Raycast: a left-aligned headline over the product at full size, running off the page's right edge.
// A row of tabs names the five kinds of artifact and steps through them, filling as each one plays, until the visitor picks one.

const lines: Record<string, string> = {
  inbox: 'A working prototype, built by your agent with your design system',
  lofi: 'The same screen in lo-fi, to settle the layout first',
  flow: 'A diagram of the flow, written in Mermaid',
  handoff: 'A canvas that walks engineering through every state',
  context: 'A Markdown brief your team and your agent both read',
};

export default function ProductHero() {
  const play = useAutoplay(artifacts.length, 3600);
  const shown = artifacts[play.index].key;
  return <div className="dx-product" ref={play.ref}>
    <div className="dx-tabs" role="tablist" aria-label="What Design Studio makes">
      {artifacts.map((a, i) => <button key={a.key} type="button" role="tab" aria-selected={i === play.index} className={i === play.index ? 'is-on' : ''} onClick={() => play.pick(i)}>
        <span>{a.label}</span><i>{i === play.index && play.playing && <b key={play.index} />}</i>
      </button>)}
    </div>
    <p className="dx-tab-line" aria-live="polite">{lines[shown]}</p>
    <div className="dx-bleed">
      <StudioWindow shown={shown} onPick={k => play.pick(artifacts.findIndex(a => a.key === k))} min={0.66} max={1280 / 1120} crop="pane" className="dx-product-window" />
    </div>
  </div>;
}
