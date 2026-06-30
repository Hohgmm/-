import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'src/main.js', 'src/styles.css'];
await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('index.html', 'utf8');
if (!html.includes('/src/main.js') || !html.includes('<div id="app"></div>')) {
  throw new Error('index.html is not wired to the web app entrypoint.');
}

const js = await readFile('src/main.js', 'utf8');
for (const marker of ['defaultConfig', 'renderConfig', 'navigator.clipboard']) {
  if (!js.includes(marker)) {
    throw new Error(`src/main.js is missing ${marker}.`);
  }
}

console.log('Static web app files are present and wired correctly.');
