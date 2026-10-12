import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const source = path.resolve(process.argv[2] || '../design-studio/dist');
const destination = path.resolve('dist/design-studio-demo');
if (!existsSync('dist/index.html') || !existsSync('dist/404.html')) {
  throw new Error('Build the Astro website, including its root 404 page, before including the demo.');
}
const entry = readFileSync(path.join(source, 'index.html'), 'utf8');
if (!entry.includes('/design-studio-demo/assets/')) {
  throw new Error('Build Design Studio with STUDIO_BASE_PATH=/design-studio-demo/ first.');
}
if (existsSync(destination)) {
  throw new Error('The demo destination already exists. Start with a fresh Astro build.');
}
mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
console.log(`Included Design Studio at ${destination}`);
