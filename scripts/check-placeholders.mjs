// Lancé en dernier par `npm run build`.
// Sur Netlify (CONTEXT=production), le build échoue si une page prérendue contient encore « TODO » :
// on ne publie pas de texte, de produit ou de valeur de paiement provisoire.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = 'dist/mille-idees-site/browser';

if (process.env.CONTEXT !== 'production') {
  console.log('check-placeholders : ignoré hors production (CONTEXT != production).');
  process.exit(0);
}

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const hits = [];
for (const file of htmlFiles(out)) {
  const line = readFileSync(file, 'utf8').split('\n').find((l) => l.includes('TODO'));
  if (line !== undefined) {
    // Le prérendu tient sur peu de lignes : on montre seulement l'entourage du premier TODO
    const i = line.indexOf('TODO');
    hits.push({ file, line: line.slice(Math.max(0, i - 60), i + 100).trim() });
  }
}

if (hits.length > 0) {
  console.error('check-placeholders : des pages contiennent encore « TODO », publication bloquée.');
  for (const { file, line } of hits) console.error(`  ${file}\n    ${line}`);
  process.exit(1);
}
console.log('check-placeholders : aucun TODO dans les pages prérendues.');
