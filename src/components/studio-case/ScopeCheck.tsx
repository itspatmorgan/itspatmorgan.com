import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, File01Icon, Folder01Icon, GitPullRequestIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// Why a dozen people can push to one codebase without breaking each other's work (archive: agent/rules/contributor-scope.md, and the
// Maven talk). Each contributor owns a folder under src/prototypes; the agent knows who you are from your Git identity and keeps
// your work there. A check on every pull request auto-approves one whose files all sit in its author's scope; a change to shared
// code (the product components, the Studio itself) waits for a review. The approval text is the bot's own, from Joe's pull request
// (Drive: sublime-pull-request-joe.jpg); the review text is the same check's out-of-scope message (archive: .github/workflows/scope-approval.yml). button.tsx stands for any shared file; the folder list is trimmed to four people. Drawn as a diagram rather than a copy of GitHub, which is not Patrick's UI.
const timings = [2200, 3000, 3200];
const captions = ['Each contributor works in a folder of their own', 'Changes inside it are approved on their own', 'Changes to shared code wait for a review'];

const tree: { name: string; depth: number; kind: 'folder' | 'file'; who?: string; shared?: boolean }[] = [
  { name: 'src/prototypes/', depth: 0, kind: 'folder' },
  { name: 'patrick/', depth: 1, kind: 'folder', who: 'patrick' },
  { name: 'joe/', depth: 1, kind: 'folder', who: 'joe' },
  { name: 'ahry/', depth: 1, kind: 'folder', who: 'ahry' },
  { name: 'samantha/', depth: 1, kind: 'folder', who: 'samantha' },
  { name: 'src/product/components/', depth: 0, kind: 'folder', shared: true },
  { name: 'button.tsx', depth: 1, kind: 'file', shared: true },
  { name: 'src/studio/', depth: 0, kind: 'folder', shared: true },
];

/** Contributor folders, and the check that approves a pull request inside its author's folder. */
export default function ScopeCheck() {
  const scene = useScene(timings, captions);
  const step = scene.step;
  const lit = (row: typeof tree[number]) => step === 1 ? row.who === 'joe' : step === 2 ? !!row.shared && row.depth === 1 : false;
  return <DemoFrame scene={scene} stage="sc-plain" title="the scope check"
    label="Each contributor owns a folder under src/prototypes. A pull request from Joe that only changes files in his folder is auto-approved by a check: all changed files are within Joe's owned scope. A change to shared product components waits for a review">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia">
          {/* The two pull requests stand beside the tree, top edge to top edge and bottom edge to bottom edge, the pair centered on the stage. */}
          <div style={{ position: 'absolute', left: 72, right: 72, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ display: 'flex', gap: 56 }}>
          <div className="sc-node" style={{ position: 'relative', width: 380, justifyContent: 'flex-start', gap: 0, padding: '22px 24px' }}>
            {tree.map(row => <div key={row.name + row.depth} className={`sc-file ${lit(row) ? 'is-lit' : ''} ${row.shared ? 'is-shared' : ''}`} style={{ paddingLeft: row.depth * 22, height: 42, marginTop: row.depth === 0 && row.name !== 'src/prototypes/' ? 14 : 0 }}>
              <HugeiconsIcon icon={row.kind === 'folder' ? Folder01Icon : File01Icon} size={17} strokeWidth={1.6} />{row.name}
              {row.shared && row.depth === 0 && <span className="sc-owner"><HugeiconsIcon icon={UserGroupIcon} size={12} strokeWidth={1.8} />shared</span>}
            </div>)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 380 }}>
          <div className={`sc-node ${step >= 1 ? '' : 'is-off'}`} style={{ position: 'relative', padding: '20px 22px' }}>
            <p className="sc-pr"><HugeiconsIcon icon={GitPullRequestIcon} size={17} strokeWidth={1.6} />Joe’s pull request</p>
            <span className="sc-check"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />Auto-approved</span>
            <p style={{ fontSize: 15, lineHeight: '22px' }}>All changed files are within joe’s owned scope (prototypes + owned tools). Auto-approved — you can merge when status checks pass.</p>
          </div>
          <div className={`sc-node ${step >= 2 ? '' : 'is-off'}`} style={{ position: 'relative', padding: '20px 22px' }}>
            <p className="sc-pr"><HugeiconsIcon icon={GitPullRequestIcon} size={17} strokeWidth={1.6} />A change to a shared component</p>
            <span className="sc-check is-review">Waiting for review</span>
            <p style={{ fontSize: 15, lineHeight: '22px' }}>This PR includes files outside the author’s owned scope. A maintainer review is required before merging.</p>
          </div>
          </div>
          </div></div>
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
