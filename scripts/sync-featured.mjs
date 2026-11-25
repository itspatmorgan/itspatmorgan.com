// Saves pm-studio's live featured list to src/data/featured.json, the copy a build uses when the Studio can't be reached.
//   pnpm sync-featured
import { writeFileSync } from 'node:fs';

const url = 'https://studio.itspatmorgan.com/prototypes/manifest.json';
const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`${url} answered ${response.status}`);
const featured = (await response.json())?.contributions?.featured;
if (!Array.isArray(featured?.entries)) throw new Error(`${url} has no featured list yet. Is the Featured work module deployed?`);
writeFileSync('src/data/featured.json', `${JSON.stringify(featured, null, 2)}\n`);
console.log(`Saved ${featured.entries.length} featured pieces to src/data/featured.json.`);
