import { DemoFrame, useScene } from '../case-study/scene';
import { Alert, Board, Button, Chip, Field, FilterMenu } from './JunoUI';

// Liberty: the "defaults" state is drawn from Material UI's public v4 defaults (Roboto, indigo primary, capitalized buttons), not a
// screen from JupiterOne, to show what the library gives you before any decisions are made. Patrick to confirm the version. The labels
// are sample values in the product's own terms, in place of the placeholder words in the Figma library.
const timings = [2400, 3200];
const captions = ['Material UI’s defaults', 'The same parts in Juno'];

export default function MaterialToJuno() {
  const scene = useScene(timings, captions);
  const juno = scene.reduced || scene.step === 1;
  return <DemoFrame scene={scene} stage="cs-frame" title="Material UI and Juno" label="The same buttons, chips, alert, text field and filter menu, switching between Material UI's defaults and Juno">
    <Board><div className={`jg ${juno ? '' : 'is-mui'}`}>
      <div className="jg-left">
        <div className="jg-row"><Button>Save</Button><Button add>Add</Button><Button menu>Export</Button></div>
        <div className="jg-row"><Chip tone="navy">Open</Chip><Chip tone="teal">Mapped</Chip><Chip tone="red">Critical</Chip><Chip tone="yellow">Review</Chip></div>
        <Alert tone="warning" title="Integration needs attention">The last job did not finish</Alert>
        <Field label="Name" value="AWS production" />
      </div>
      <FilterMenu />
    </div></Board>
  </DemoFrame>;
}
