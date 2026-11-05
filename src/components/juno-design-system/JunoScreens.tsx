import type { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, ArrowDown01Icon, ArrowRight01Icon, Book02Icon, CloudIcon, Comment01Icon, Compass01Icon, Copy01Icon, CubeIcon, DashboardSquare01Icon, Diamond01Icon, Download01Icon, FlashIcon, Folder01Icon, GitBranchIcon, GridViewIcon, HashtagIcon, HelpCircleIcon, Home01Icon, Key01Icon, Layout01Icon, Menu01Icon, Notification01Icon, PencilEdit01Icon, PieChartIcon, PlusSignCircleIcon, Rocket01Icon, Search01Icon, Settings02Icon, SmileIcon, SourceCodeIcon, Task01Icon, Tick02Icon, UserAdd01Icon, BookmarkIcon } from '@hugeicons/core-free-icons';
import { Button, Icon, J1Mark } from './JunoUI';

// The four product screens, before and after Juno, rebuilt from Patrick's raw exports at their proportions. Liberties, all for privacy:
// colleagues' names, emails, IDs and internal service names are sample values, and third-party logos are initials on a tile.

const after = ['Home', 'Insights', 'Assets', 'Graph', 'Alerts', 'Policies', 'Compliance', 'Integrations'];

function AfterShell({ active, nav = after, side, children }: { active: string; nav?: string[]; side?: ReactNode; children: ReactNode }) {
  return <div className="ja">
    <header className="ja-top">
      <J1Mark size={36} /><b>JupiterOne, Inc</b><u />
      <nav>{nav.map(n => <span key={n} className={n === active ? 'is-on' : ''}>{n}</span>)}</nav>
      <div className="ja-ask"><Icon icon={Search01Icon} size={17} />Ask J1<kbd>⌘ K</kbd></div>
      <Icon icon={Settings02Icon} size={22} /><span className="ja-bell"><Icon icon={Notification01Icon} size={22} /><em>99+</em></span><Icon icon={HelpCircleIcon} size={22} /><u />
      <i className="ja-avatar">P</i><div className="ja-who"><span>Patrick</span><small>All Permissions</small></div>
    </header>
    <div className="ja-body">{side}<main>{children}</main></div>
  </div>;
}

const SideItem = ({ icon, on, children }: { icon?: Parameters<typeof Icon>[0]['icon']; on?: boolean; children: ReactNode }) => <div className={`ja-item ${on ? 'is-on' : ''}`}>{icon && <Icon icon={icon} size={17} />}{children}</div>;

const donut = (slices: [number, string][], r = 38, w = 12) => {
  const total = slices.reduce((s, [v]) => s + v, 0), c = 2 * Math.PI * r;
  let at = 0;
  return <svg viewBox="0 0 100 100" className="j-donut" aria-hidden="true">{slices.map(([v, color], i) => {
    const el = <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={w} strokeDasharray={`${v / total * c} ${c}`} strokeDashoffset={-at / total * c} transform="rotate(-90 50 50)" />;
    at += v;
    return el;
  })}</svg>;
};

const afterSlices: [string, number, string][] = [['aws_ecs_task_definition', 6310, '#26A69A'], ['device42_device', 5683, '#3F51B5'], ['aws_lambda_function', 1298, '#D81B60'], ['hardware', 1277, '#FB8C00'], ['custom_mapping_rule', 1001, '#9575CD'], ['mapped_entity', 908, '#8BC34A'], ['google_device', 539, '#039BE5']];

export function DashAfter() {
  return <AfterShell active="Home" side={<aside className="ja-side"><h3>Home</h3>
    <SideItem icon={Compass01Icon}>Overview</SideItem><SideItem icon={SourceCodeIcon}>Query Builder</SideItem><SideItem icon={Comment01Icon}>Questions</SideItem><SideItem icon={HelpCircleIcon}>J1QL Docs</SideItem>
    <h4>Dashboards</h4><SideItem on>Toxic Combinations</SideItem><SideItem>User Endpoints</SideItem><hr /><small>How to add dashboards</small><small>View all</small></aside>}>
    <div className="jd">
      <h1>Unscanned Workloads with Access to Data or Ingress from 0.0.0.0/0</h1>
      <div className="jd-row">
        <section className="j-card jd-chart"><h5>Total unscanned workloads (by type)</h5><div>
          <div className="jd-donut">{donut([...afterSlices.map(([, v, c]) => [v, c] as [number, string]), [1777, '#9E9E9E']])}<span>18,793</span></div>
          <div className="jd-legend"><ul>{afterSlices.map(([n, v, c]) => <li key={n}><i style={{ background: c }} /><span>{n}</span><b>{v}</b></li>)}</ul><footer><span className="jd-expand">Expand Other</span><span className="jd-seg"><i className="is-on">#</i><i>%</i></span></footer></div>
        </div></section>
        {[['8', 'critical cloud data', '#F44336'], ['1,010', 'non-public cloud data', '#FBC02D']].map(([v, t, c]) => <section key={v} className="j-card jd-kpi"><strong style={{ color: c }}>{v}</strong><p>Unscanned workloads with access to {t}</p></section>)}
        <section className="j-card jd-kpi"><strong>16</strong><p>Unscanned workloads with ingress allowed from the internet</p></section>
      </div>
      <div className="jd-row is-two">
        <section className="j-card jd-table"><h5>Unscanned workloads with access to critical cloud data</h5>
          <div className="jd-th"><span>workload.displayName</span><span>workload.webLink</span></div>
          {['report-service-usage', 'report-service-dynamo', 'report-service-deleter', 'report-service-listener', 'report-service-export'].map(n => <div className="jd-tr" key={n}><Icon icon={CubeIcon} size={18} /><a>{n}</a><span>https://console.aws.amazon.com/lambda/home…</span></div>)}
        </section>
        <section className="j-card jd-graph"><h5>Unscanned workloads with access to critical cloud data</h5>
          <div className="jd-canvas"><div className="jd-find"><span>Search the graph</span><Icon icon={Search01Icon} size={15} /></div><svg viewBox="0 0 500 300" aria-hidden="true"><g fill="none" stroke="#80CBC4" strokeWidth="1.5">{[[170, 60], [260, 60], [350, 60], [170, 110], [260, 110], [350, 110]].map(([x, y], i) => <path key={i} d={`M${x} ${y} C ${x} 190, 260 150, 260 230`} />)}<path d="M260 230 V300" /></g>{[[170, 60], [260, 60], [350, 60], [170, 110], [260, 110], [350, 110]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill="#3F51B5" /><circle cx={x + 14} cy={y} r="4" fill="#D81B60" /></g>)}<circle cx="260" cy="230" r="9" fill="#039BE5" /></svg></div>
        </section>
      </div>
    </div>
  </AfterShell>;
}

const assetGroups = [['Applications & Services', '#26A69A'], ['Compute & Devices', '#3949AB'], ['Data & Storage', '#FB8C00'], ['Identities & Access', '#039BE5'], ['Network', '#AB47BC'], ['People & Organization', '#2E7D32'], ['Policy & Documentation', '#8D6E63'], ['Risks & Alerts', '#D81B60'], ['Other', '#9E9E9E'], ['Custom', '#546E7A']];
const assetTiles = [['Application', '1,175', CubeIcon], ['ApplicationEndpoint', '3,570', CubeIcon], ['Channel', '2,518', HashtagIcon], ['CodeCommit', '1', GitBranchIcon], ['CodeDeploy', '174', Rocket01Icon], ['CodeModule', '4,190', CubeIcon], ['CodeRepo', '2,548', SourceCodeIcon], ['CodeReview', '2,098', Comment01Icon], ['Deployment', '528', CubeIcon], ['Group', '733', Layout01Icon], ['PR', '58,057', GitBranchIcon], ['Project', '759', Folder01Icon], ['Repository', '338', Folder01Icon], ['Service', '4,518', CloudIcon], ['Subscription', '105', FlashIcon], ['Workflow', '71', CubeIcon]] as const;

export function AssetsAfter() {
  return <AfterShell active="Assets"><div className="jas">
    <div className="jas-head"><h2>Assets</h2><Button>Device Matrix</Button><span className="jas-gen"><Icon icon={PlusSignCircleIcon} size={20} />Generate SBOM</span></div>
    <div className="jas-grid">
      <div className="jas-groups">{assetGroups.map(([n, c]) => <div key={n}><i style={{ background: c }}><Icon icon={CubeIcon} size={14} /></i>{n}</div>)}</div>
      <div className="jas-main">
        <div className="jas-bar"><div className="j-search"><span>Search</span><Icon icon={Search01Icon} size={18} /></div><span>1,771,981 assets</span><div className="j-seg"><i className="is-on"><Icon icon={GridViewIcon} size={18} /></i><i><Icon icon={Menu01Icon} size={18} /></i></div></div>
        <h3><i style={{ background: '#26A69A' }}><Icon icon={CubeIcon} size={14} /></i>Applications & Services</h3>
        <div className="jas-tiles">{assetTiles.map(([n, v, ic]) => <div className="j-card" key={n}><Icon icon={ic} size={24} /><span>{n}<b>{v}</b></span></div>)}</div>
      </div>
      <aside className="jas-side"><h3><Icon icon={Diamond01Icon} size={22} />Critical Assets<Icon icon={ArrowRight01Icon} size={16} /></h3><div className="j-card"><Icon icon={Rocket01Icon} size={64} /><p>Monitor high priority asset Classes and Properties across your inventory.</p><Button>Define Critical Assets</Button></div></aside>
    </div>
  </div></AfterShell>;
}

const integrationNames = ['Airwatch', 'Alibaba Cloud', 'Artifactory', 'atSpoke', 'Auth0', 'Automox', 'Aquasec', 'Asana', 'AWS', 'Azure'];
export function IntegrationsAfter() {
  return <AfterShell active="Integrations" side={<aside className="ja-side"><h3>Data Sources</h3><h4>Sources</h4><SideItem on>Integrations</SideItem><SideItem>Integration Jobs</SideItem><SideItem>Static Data</SideItem><SideItem>Data Explorer</SideItem><h4>On Premise</h4><SideItem>Connectors</SideItem></aside>}>
    <div className="jas-head is-page"><span>Integrations</span><Button>Connect new integration</Button></div>
    <div className="jin"><div className="jas-bar"><div className="j-search"><span>Search</span><Icon icon={Search01Icon} size={18} /></div><b>Class<Icon icon={ArrowDown01Icon} size={14} /></b><span>10 integrations</span><div className="j-seg"><i className="is-on"><Icon icon={GridViewIcon} size={18} /></i><i><Icon icon={Menu01Icon} size={18} /></i></div></div>
      <div className="jin-grid">{integrationNames.map(n => <div className="j-card" key={n}><img src={`/images/projects/juno/a-${n.toLowerCase().replace(' cloud', '')}.webp`} alt="" /><span>{n}<small>Instances: 1</small></span></div>)}</div></div>
  </AfterShell>;
}

export function SettingsAfter() {
  return <AfterShell active="Settings" side={<aside className="ja-side"><h3>Settings</h3><SideItem icon={Compass01Icon}>Overview</SideItem><h4>My Account</h4><SideItem on>Profile</SideItem><SideItem>Notifications</SideItem><SideItem>API Tokens</SideItem><h4>Admin</h4><SideItem>Account Management</SideItem><SideItem>Users</SideItem><SideItem>User Groups</SideItem><SideItem>Security & Access</SideItem><SideItem>Account API Tokens</SideItem><SideItem>Account Parameters</SideItem></aside>}>
    <div className="jas-head is-page"><span>Profile</span><em>Reset</em><i className="j-btn is-off">Save</i></div>
    <div className="jse">
      <i className="jse-avatar">P</i><Button style={{ width: 'fit-content' }}><Icon icon={SmileIcon} size={16} />Select Avatar</Button>
      {[['Email', 'name@example.com', true], ['Name', 'Patrick', false], ['User ID', '00000000-0000-4000-8000-000000000000', true]].map(([l, v, d]) => <div className={`jse-field ${d ? 'is-off' : ''}`} key={l as string}><label>{l}</label>{v}{d && <Icon icon={Copy01Icon} size={20} />}</div>)}
      <h4>Your App Permissions</h4>
      <div className="jse-table"><div className="is-head"><span>Permissions</span><span>Write/Read</span><span>Read</span></div>
        <div><span>All Apps And Resources</span><i><Icon icon={Tick02Icon} size={14} /></i><i><Icon icon={Tick02Icon} size={14} /></i></div><div><span>API Key Management</span><i><Icon icon={Tick02Icon} size={14} /></i><u /></div></div>
    </div>
  </AfterShell>;
}

function BeforeShell({ icon, crumb, center, tools, children }: { icon: Parameters<typeof Icon>[0]['icon']; crumb: ReactNode; center?: ReactNode; tools?: ReactNode; children: ReactNode }) {
  return <div className="jb">
    <header className="jb-top"><J1Mark size={36} color="linear-gradient(180deg, #1DE9B6, #1C6EED 55%, #7E57C2)" /><b>JupiterOne</b><span /><Icon icon={DashboardSquare01Icon} size={26} style={{ color: '#7E8CF5' }} /><Icon icon={Settings02Icon} size={26} /><Icon icon={Notification01Icon} size={26} /><Icon icon={HelpCircleIcon} size={26} /><i>P</i></header>
    <div className="jb-bar"><Icon icon={icon} size={24} /><b>{crumb}</b><div>{center}</div>{tools}</div>
    {children}
  </div>;
}

const old = ['#00E07F', '#F57C00', '#01579B', '#00C8E6', '#1A3A6B', '#7FD8F5', '#A89A00'];
const OldDonut = ({ title, value, rows }: { title: string; value: string; rows: [string, number][] }) => <section className="jb-card"><h5>{title}</h5><div className="jb-donut-row"><ul>{rows.map(([n, v], i) => <li key={n}><i style={{ background: old[i] }} /><span>{n}</span><b>{v}</b></li>)}</ul><div className="jb-donut">{donut([...rows.map(([, v], i) => [v, old[i]] as [number, string]), [rows[0][1], '#C7A23A'], [rows[1][1] / 2, '#D84C6F']], 38, 9)}<strong>{value}</strong></div></div></section>;

export function DashBefore() {
  const rows1: [string, number][] = [['jira_issue', 5030], ['aws_eni', 283], ['npm_package', 210], ['aws_cloudwatch_metric', 171], ['aws_ecr_image_scan', 124], ['github_pullrequest', 97]];
  const rows2: [string, number][] = [['github_pullrequest', 5607], ['jira_issue', 5030], ['cbdefense_alert', 4686], ['compliance_control', 2680], ['aws_ecr_image_scan', 2124]];
  const bars = [5600, 3900, 1000, 450, 370, 280, 260, 220, 190, 160];
  return <BeforeShell icon={PieChartIcon} crumb={<>Insights <em>›</em> Home Dashboard</>} tools={<div className="jb-tools"><Icon icon={Layout01Icon} size={24} /><Icon icon={PieChartIcon} size={24} /><Icon icon={PencilEdit01Icon} size={24} /><Icon icon={Download01Icon} size={24} /><Icon icon={UserAdd01Icon} size={24} /></div>}>
    <div className="jb-dash"><aside><Icon icon={Home01Icon} size={26} />{Array.from({ length: 12 }, (_, i) => <span key={i}>T{i + 1}</span>)}</aside>
      <div className="jb-dash-grid">
        <OldDonut title="WHAT WAS ADDED IN THE LAST 48 HOURS?" value="6,365" rows={rows1} /><OldDonut title="RESOURCE COUNT BY TYPE" value="32,057" rows={rows2} /><OldDonut title="MAPPED RESOURCES BY TYPE" value="32,057" rows={rows2} />
        <section className="jb-card jb-big"><strong>16,790</strong><h5>BILLABLE ENTITIES</h5></section>
        <section className="jb-card jb-bars"><h5>BILLABLE ENTITIES BY ACCOUNT/INTEGRATION (TOP 10)</h5><div>{bars.map((b, i) => <i key={i} style={{ height: `${b / 60}%` }} />)}</div></section>
      </div></div>
  </BeforeShell>;
}

const oldAssets = [['819', 'AccessKey', Key01Icon], ['1109', 'AccessPolicy', Task01Icon], ['504', 'AccessRole', BookmarkIcon], ['21', 'Account', Diamond01Icon], ['1', 'Application', CubeIcon], ['7', 'ApplicationEndpoint', CubeIcon], ['85', 'Assessment', Compass01Icon], ['77', 'Backup', Download01Icon], ['5', 'Certificate', Book02Icon], ['282', 'Channel', HashtagIcon], ['12', 'Cluster', Layout01Icon], ['1079', 'CodeModule', CubeIcon], ['483', 'CodeRepo', SourceCodeIcon], ['172', 'Configuration', Layout01Icon], ['3', 'Container', Folder01Icon], ['4', 'ControlPolicy', Task01Icon]] as const;
export function AssetsBefore() {
  return <BeforeShell icon={Task01Icon} crumb="Assets" center={<span className="jb-search">Search</span>} tools={<Icon icon={Download01Icon} size={24} />}>
    <div className="jb-space"><strong>34,048</strong><small>TOTAL ASSETS</small><p>Search or select a class below to begin</p></div>
    <div className="jb-tiles">{oldAssets.map(([v, n, ic]) => <div key={n}><b>{v}</b><span>{n}</span><i /><Icon icon={ic} size={30} /></div>)}</div>
  </BeforeShell>;
}

export function IntegrationsBefore() {
  const names = ['AirWatch', 'Artifactory', 'atSpoke', 'Auth0', 'AWS', 'Azure', 'Azure DevOps', 'BambooHR', 'Bitbucket', 'Bugcrowd', 'Carbon Black', 'Checkmarx', 'Cisco AMP', 'Cisco Meraki', 'Cloudflare'];
  return <BeforeShell icon={FlashIcon} crumb="Integrations" center={<span className="jb-tabs"><i>All</i><span>Configured</span><span>Unconfigured</span><span className="jb-class">All Classes ▾</span></span>}>
    <div className="jb-ints">{names.map(n => <div key={n}><header>{n}</header><img src={`/images/projects/juno/b-${n.toLowerCase().replace(' ', '-')}.webp`} alt="" /><footer><span>0</span><b><HugeiconsIcon icon={Add01Icon} size={16} /></b></footer></div>)}</div>
  </BeforeShell>;
}

export function SettingsBefore() {
  return <div className="jb-profile"><div><aside><i className="jb-p-icon"><Icon icon={UserAdd01Icon} size={42} /></i><b>MY PROFILE</b></aside><main><i>P</i>{[['Email', 'name@example.com'], ['Name', 'Patrick'], ['Default App', '']].map(([l, v]) => <label key={l}><small>{l}</small><span>{v}</span></label>)}</main></div></div>;
}
