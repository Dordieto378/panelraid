import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function finalizeStudio(directory) {
  // Sanity 4's default document keeps icon links at /static even with a CLI basePath.
  const indexFile = path.join(directory, 'index.html');
  const html = await readFile(indexFile, 'utf8');
  await writeFile(indexFile, html.replace(/((?:href|src)=")\/static\//g, '$1/studio/static/'));

  const manifestFile = path.join(directory, 'static', 'manifest.webmanifest');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  manifest.start_url = '/studio/';
  manifest.scope = '/studio/';
  if (manifest.icons) {
    manifest.icons = manifest.icons.map(icon => ({ ...icon, src: icon.src.replace(/^\/static\//, '/studio/static/') }));
  }
  await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  console.log('Studio document and icon paths prepared for /studio/.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await finalizeStudio(process.argv[2] || 'dist/studio');
}
