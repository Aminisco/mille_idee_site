// Lancé après `ng build` (npm run build).
// Le prérendu écrit chaque page dans un dossier : projets/index.html. Netlify redirige alors
// /projets vers /projets/ (301), ce qui ne colle plus aux liens ni aux adresses canoniques.
// Avec projets.html, Netlify sert /projets directement. 404/index.html devient 404.html,
// la page que Netlify renvoie avec un vrai statut 404.
import { readdirSync, renameSync, rmSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

const out = 'dist/mille-idees-site/browser';

// /home est redirigé en 301 par netlify.toml : la page de redirection d'Angular ne sert pas.
// index.csr.html n'est utile qu'avec un serveur de rendu, qu'on n'a pas.
rmSync(join(out, 'home'), { recursive: true, force: true });
rmSync(join(out, 'index.csr.html'), { force: true });

for (const entry of readdirSync(out, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = join(out, entry.name);
  const files = readdirSync(dir);
  // Seuls les dossiers de pages ne contiennent qu'un index.html (pas assets/, media/…)
  if (files.length === 1 && files[0] === 'index.html') {
    renameSync(join(dir, 'index.html'), `${dir}.html`);
    rmdirSync(dir);
    console.log(`${entry.name}/index.html -> ${entry.name}.html`);
  }
}
