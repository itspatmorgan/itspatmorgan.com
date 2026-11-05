import { Folder01Icon, Rocket01Icon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { Icon, J1Mark } from './JunoUI';

// The team's working tools, rebuilt from Patrick's exports. Liberties for privacy: names and avatars are removed, and internal squad
// names are dropped from the design board.
const status = { Done: '#52BE80', 'Ready for dev': '#7CC7F2', 'In progress': '#F4D03F', Paused: '#E59A9A', Healthy: '#52BE80', 'Ready to review': '#F0A04B' } as const;
type Status = keyof typeof status;
const Pill = ({ s }: { s: Status }) => <span className="jo-pill" style={{ background: status[s] }}>{s}</span>;

const projects: [string, string, string, Status][] = [['KPIs On Landing Page', 'NEW FEATURE', 'Adding high level KPIs to the landing page. Also integrating Problems.', 'Done'], ['Insights: Structure', 'APP REFRESH', 'Refreshed structural pieces of insights dashboards. (everything but the charts)', 'Ready for dev'], ['Insights: Colors & Charting', 'APP REFRESH', 'Focus on data viz colors and chart specifics.', 'In progress'], ['Search: Improvements', 'FEATURE', 'Enhancing and clarifying search.', 'Paused'], ['KPIs On Landing Page (Second Iteration)', 'NEW FEATURE', 'Adding top 5 problems widget and re-orienting the existing landing page pieces to accommodate.', 'In progress'], ['Landing Page/Search Anywhere', 'WORKFLOWS', '', 'Done']];
const teams = ['Search, Insights & Graph', 'Assets & Integrations', 'Compliance & Policies', 'Rules & Alerts', 'Account & Settings', 'Libraries & Templates'];
export function FigmaProjects() {
  return <div className="jo-figma"><aside><b>Teams</b>{teams.map((t, i) => <span key={t} className={i === 0 ? 'is-on' : ''}>P - {t}</span>)}</aside><div className="jo-covers">{projects.map(([t, k, d, s]) => <div key={t} className="jo-cover"><i /><h4>{t}</h4><small>{k}</small><p>{d}</p><Pill s={s} /></div>)}</div></div>;
}

const board: [string, [string, number][]][] = [['Up next', [['Refresh: alerts', 126], ['Refresh: global settings', 103], ['Create an Alert from a Question', 27]]], ['In progress', [['Insights refresh: charts!', 269], ['Asset detail - introduce specific asset graph view in context', 266], ['Insights - Use insights to power the landing page', 267]]], ['Ready to review', [['Asset inventory - advanced filters', 264], ['Search app - visual refresh', 101]]], ['Ready for dev', [['Insights - navigation & layout', 102], ['Navigation refresh - global nav & query anywhere', 250], ['Navigation refresh - Compliance and Policies', 268]]]];
/** The product design board. `marked` picks out the module refreshes, in among the feature work. */
export function DesignBoard({ marked = false }: { marked?: boolean }) {
  return <div className={`jo-board ${marked ? 'is-marked' : ''}`}><h1>Design Board</h1><div>{board.map(([col, cards]) => <section key={col}><h5>{col} <span>{cards.length} issues</span></h5>{cards.map(([c, k]) => <article key={c} className={/refresh/i.test(c) ? 'is-refresh' : ''}><p>{c}</p><small><i><Icon icon={Tick02Icon} size={11} /></i>DESIGN-{k}</small></article>)}</section>)}</div></div>;
}

const libraries: [string, string, Status][] = [['Logos', 'JupiterOne logos and 3rd party vendor logos', 'In progress'], ['Iconography', 'Full icon sets from Material design and Feather-UI', 'Healthy'], ['Juno: Custom', 'Shared, custom components (not coming from Material-UI)', 'Ready to review'], ['Juno: Material', 'JupiterOne’s foundational layer built on Material-UI.', 'Healthy'], ['Figma Helpers', 'Helpers to make designing in Figma easier.', 'Healthy']];
export function Libraries() {
  return <div className="jo-libs">{libraries.map(([t, d, s]) => <div key={t} className="jo-lib"><div><i /><h4>{t}</h4><small>LIBRARY</small><p>{d}</p><footer><Pill s={s} /><J1Mark size={32} color="#fff" /></footer></div><span>{t.replace(': ', ' ')}</span></div>)}</div>;
}

export function Storybook() {
  return <div className="jo-story"><aside><h3><Icon icon={Rocket01Icon} size={28} />Juno</h3><div className="jo-find"><Icon icon={Search01Icon} size={15} />Find components</div><b className="is-on">Resources</b><small>Theme</small><span>Base Colors</span><span>Theme Viewer</span><small>Components</small><span><Icon icon={Folder01Icon} size={14} />Custom</span><span><Icon icon={Folder01Icon} size={14} />Material</span></aside><main><h1>@jupiterone/web-juno</h1><p>Documentation and resources for Juno are split across several areas depending on their context and core audience.</p><h2>Resources</h2><ul><li><a>Juno Storybook</a> - Showcase of items exported from Juno</li><li><a>Component Resources</a> - All Juno components, guidelines, docs, and resources</li><li><a>Style Best Practices</a> - Styling best practices</li><li><a>Component Guidelines</a> - Guiding principles for Juno components</li></ul><div className="jo-contrib"><h2>Contributing</h2><ul><li><a>Submit a Proposal</a></li><li><a>Proposal Criteria</a></li></ul></div></main></div>;
}
