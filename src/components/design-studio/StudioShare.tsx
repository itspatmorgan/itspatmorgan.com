// Publishing, drawn plainly: the Studio on your computer, your agent publishing it as a static website, and the same pages open in
// your team's browsers at one link. The screens are wireframes, since the point is where the work goes, not what it shows. The
// browsers are separate copies of a read-only site: nothing connects them to each other or back to your computer.
const Page = () => <div className="pb-page">
  <i className="pb-side" />
  <div className="pb-main"><b /><i /><i /><span><i /><i /><i /></span><i /><i /></div>
</div>;

export default function StudioShare() {
  return <figure className="sh" aria-label="Your agent publishes the Studio from your computer as a static website. Your team opens the same pages in any browser at your own link, to read, not edit">
      <div className="pb" aria-hidden="true">
        <div className="pb-local">
          <div className="pb-frame"><div className="pb-bar"><span><i /><i /><i /></span><em>localhost</em></div><Page /></div>
          <p><b>On your computer</b><span>You and your agent edit the Studio</span></p>
        </div>
        <div className="pb-link">
          <svg viewBox="0 0 200 40" className="pb-wire"><path d="M0 20 H192" /><path d="M184 13 L192 20 L184 27" /></svg>
          <span className="pb-chip">Publish</span>
          <span className="pb-url">design.yourteam.com</span>
        </div>
        <div className="pb-team">
          <div className="pb-stack">
            {[0, 1, 2].map(i => <div key={i} className="pb-frame" style={{ left: `${i * 6}%`, top: i * 26 }}>
              <div className="pb-bar"><span><i /><i /><i /></span><em>design.yourteam.com</em></div><Page />
            </div>)}
          </div>
          <p><b>In your team’s browsers</b><span>A static site to read, with nothing to install</span></p>
        </div>
      </div>
  </figure>;
}
