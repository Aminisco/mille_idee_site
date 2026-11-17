# Mise à jour du contenu de novembre : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** ajouter au site Mille Idées une page don (virement, QR EPC, lien de paiement), une boutique de bics avec commande Netlify Forms, cinq nouveaux contenus, la séparation projets/ateliers et la mention SRG.

**Architecture :** site Angular 20 standalone prérendu en statique (`angular.json:45`, `app.routes.server.ts:5-11`), données en tableaux TS (`src/app/data/projects.ts:27`). Les valeurs de paiement vivent dans un seul fichier de config injecté par `InjectionToken` (les tests peuvent fournir des valeurs valides). La commande part en POST urlencodé vers `/`, détectée par Netlify grâce à un formulaire HTML statique caché (`public/__forms.html`).

**Tech stack :** Angular 20.3, signals, Reactive Forms, Karma + Jasmine, `uqr@0.1.3` (QR code, ESM, aucune dépendance).

**Spec :** `docs/superpowers/specs/2026-11-17-maj-contenu-nov.md`

## Contraintes globales

- Une seule nouvelle dépendance : `uqr`, version exacte `0.1.3` (`npm install uqr@0.1.3 --save-exact`).
- Direction « Club » : uniquement les variables de `src/styles.scss:5-37` (`--paper`, `--ink`, `--accent`, `--red`, `--border`, rayons dessinés) et les classes existantes `.btn` (+ `--alt`, `--accent`, `--small`), `.link-strong`, `.photo` + `.shape-*`, `.marker`, `.sr-only`. Aucun `box-shadow`, aucun dégradé, aucun emoji, aucune carte à fond coloré : les listes se séparent par des filets comme `projets.scss:60-86`.
- Textes d'interface en français, tutoiement, « on » pour parler de l'asbl, pas de formules creuses.
- Identifiants de code et commits en anglais (conventional commits). Routes en français : `/don`, `/boutique`.
- Aucune valeur inventée. Seul le titulaire `ASBL Mille Idées` est donné. IBAN, BIC, liens de paiement, prix, photos, dates et textes : chaînes commençant par `TODO`, ou un commentaire `// TODO` quand le type l'impose (date ISO).
- Aucune clé API. Aucune mention « don déductible ».
- Un commit par tâche, `git add` fichier par fichier, jamais `-A`. Aucun push.
- Tests : `npx ng test --watch=false --browsers=ChromeHeadless` (base sur `main` : 29/29 verts). Build : `npm run build`.

## Points de vigilance

1. Montant tapé à la belge (`12,50`, ` 20 `) → bien lu ; montant invalide → message d'erreur, QR sans montant, et la légende du QR dit « Montant : libre ». (Tâche 2 et Tâche 3)
2. IBAN collé dans la config avec des espaces, en minuscules ou avec une faute de frappe → normalisé ; faute de frappe → le test de config échoue et la page n'affiche pas l'IBAN. (Tâche 2)
3. Nom du donateur avec un retour à la ligne ou très long → le contenu EPC reste valide (nettoyé, tronqué à 140 caractères pour la communication). (Tâche 2)
4. Double clic sur « Envoyer » ou réseau en panne → un seul envoi, message d'erreur, les champs restent remplis. (Tâche 4)
5. Noms de champs différents entre `__forms.html` et le corps envoyé → Netlify perd les champs sans rien dire. (Tâche 4)

---

### Tâche 1 : type projet/atelier, cinq nouveaux contenus, deux sections sur /projets, compteur et mention SRG

**Fichiers :**
- Modifier : `src/app/data/projects.ts:1-125`, `src/app/pages/projets/projets.ts`, `src/app/pages/projets/projets.html`, `src/app/pages/projets/projets.scss`, `src/app/pages/home/home.html:3,73`, `src/app/pages/page-asbl/page-asbl.html:3-7`, `src/styles.scss`, `src/app/app.routes.ts:29-36`
- Tests : `src/app/data/projects.spec.ts`, `src/app/pages/projets/projets.spec.ts`, `src/app/pages/home/home.spec.ts`, `src/app/pages/page-asbl/page-asbl.spec.ts`

**Interfaces :**
- Produit : `export type ProjectType = 'projet' | 'atelier';` et le champ obligatoire `type: ProjectType` sur `Project`. `ProjectsComponent` expose `projects` (type `projet`, triés par date décroissante, filtrables) et `workshops` (type `atelier`, triés pareil).
- Produit : classe globale `.speciality` dans `src/styles.scss`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`projects.spec.ts` :
```ts
it('has 12 entries: 10 projects and 2 workshops', () => {
  expect(PROJECTS.length).toBe(12);
  expect(PROJECTS.filter(p => p.type === 'projet').length).toBe(10);
  expect(PROJECTS.filter(p => p.type === 'atelier').map(p => p.slug).sort())
    .toEqual(['atelier-ecriture-canada', 'ateliers-ecriture']);
});
it('keeps slugs unique', () => {
  expect(new Set(PROJECTS.map(p => p.slug)).size).toBe(PROJECTS.length);
});
```
`projets.spec.ts` (remplace les nombres de `:23-33`) : filtre « Tous » = 10, Maraude = 3, Financement = 2, Sport = 3, Citoyen = 2 ; la liste des projets n'affiche aucun atelier ; `#ateliers` existe, contient un `h2` « Nos ateliers » et 2 `li` dont les titres sont « Ateliers d'écriture » et « Atelier d'écriture : projet Canada » ; un clic sur un filtre ne change pas le nombre d'ateliers affichés.
`home.spec.ts` : le texte de `.projects .section-head` contient « Douze projets » ; `expect(PROJECTS.length).toBe(12)` avec le commentaire `// Le compteur est écrit en toutes lettres dans home.html : le mettre à jour si ce nombre change`. Le hero contient un `.speciality` au texte exact « Spécialisation SRG / Aide à la Jeunesse ».
`page-asbl.spec.ts` : `.intro .speciality` a le même texte exact.

- [ ] **Étape 2 : lancer les tests et vérifier qu'ils échouent**

Commande : `npx ng test --watch=false --browsers=ChromeHeadless`
Attendu : ÉCHEC sur les nombres (7 au lieu de 12), sur `#ateliers` absent et sur « Douze projets ».

- [ ] **Étape 3 : implémenter**

- `projects.ts` : ajouter `type: 'projet'` aux 7 entrées existantes, puis 5 projets et ateliers :

| slug | title | type | tag |
|---|---|---|---|
| `basket` | Basket | projet | sport |
| `foot` | Foot | projet | sport |
| `visite-historique-bruxelles` | Visite historique de Bruxelles | projet | citoyen |
| `ateliers-ecriture` | Ateliers d'écriture | atelier | citoyen |
| `atelier-ecriture-canada` | Atelier d'écriture : projet Canada | atelier | citoyen |

  Pour chacun : `date: '2026-11-01', // TODO date réelle`, `summary: 'TODO résumé (1 phrase)'`, `description: 'TODO description (2-3 phrases : quoi, avec qui, quand)'`, pas de `photo`, `doodle` pris parmi les illustrations de `public/illustrations/` qu'aucun projet n'utilise encore (`huddle`, `plane`, `panorama`, `megaphone`, `atelier`, `peek`) ; `plane.svg` pour le projet Canada ; deux contenus n'utilisent jamais le même dessin. Les tags des nouveaux contenus sont à valider par Amin (commentaire `// TODO tag à valider`).

  Ça fait 12 entrées : 7 + 3 projets + 2 ateliers.
- `projets.ts` : `projects` = type `projet` seulement (le filtre et les compteurs ne portent que sur eux), `workshops` = type `atelier`.
- `projets.html` : un seul gabarit d'élément (`ng-template` + `ngTemplateOutlet`) pour les deux listes ; titre `h2` dans la liste des projets (comme aujourd'hui), `h3` dans les ateliers. Nouvelle section après `.project-list`, avant `.more` : `<section id="ateliers" aria-labelledby="ateliers-title">` avec `<h2 id="ateliers-title">Nos <span class="marker">ateliers</span></h2>` et une `ul` qui reprend les styles de `.project-list`. Dans `.intro-text`, après le paragraphe : `<a class="link-strong" routerLink="/projets" fragment="ateliers">Voir les ateliers ↓</a>`.
- `app.routes.ts` route `projets` : title `Projets et ateliers : maraudes, sport, actions citoyennes · Mille Idées`, description `Maraudes, sport, actions citoyennes, ateliers d'écriture : les projets montés par et pour les jeunes de Bruxelles depuis 2024.`
- `home.html:73` : « Sept projets » → « Douze projets ».
- Mention SRG : `<p class="speciality">Spécialisation SRG / Aide à la Jeunesse</p>` juste sous le `h1` de `home.html:3` et sous le `h1` de `page-asbl.html:3`. `.speciality` dans `styles.scss` : ligne courte, bordure `var(--border)`, rayon dessiné existant, texte `--ink` sur `--paper`, pas d'ombre.

- [ ] **Étape 4 : lancer les tests et vérifier qu'ils passent**

Commande : `npx ng test --watch=false --browsers=ChromeHeadless`
Attendu : tout vert.

- [ ] **Étape 5 : commit**

```bash
git add src/app/data/projects.ts src/app/data/projects.spec.ts src/app/pages/projets/projets.ts src/app/pages/projets/projets.html src/app/pages/projets/projets.scss src/app/pages/projets/projets.spec.ts src/app/pages/home/home.html src/app/pages/home/home.spec.ts src/app/pages/page-asbl/page-asbl.html src/app/pages/page-asbl/page-asbl.spec.ts src/styles.scss src/app/app.routes.ts
git commit -m "feat(projects): add project type, five entries, workshops section and SRG mention"
```

---

### Tâche 2 : config de don et contenu EPC

**Fichiers :**
- Créer : `src/app/config/values.ts`, `src/app/config/donation.ts`, `src/app/pages/don/epc.ts`
- Tests : `src/app/config/values.spec.ts`, `src/app/config/donation.spec.ts`, `src/app/pages/don/epc.spec.ts`

**Interfaces :**
- `values.ts` : `isPlaceholder(value: string | undefined): boolean` (vrai si vide, blanc, ou commence par `TODO`) ; `isHttpsUrl(value: string): boolean`.
- `donation.ts` :
  ```ts
  export interface DonationConfig { holder: string; iban: string; bic: string; paymentLink: string; reference: string }
  export const DONATION_CONFIG: DonationConfig = {
    holder: 'ASBL Mille Idées',
    iban: 'TODO_IBAN',            // IBAN du compte de l'asbl, espaces acceptés
    bic: 'TODO_BIC',
    paymentLink: 'TODO_PAYMENT_LINK', // lien Mollie ou Stripe Payment Link, en https
    reference: 'Don + ton nom',
  };
  export const DONATION = new InjectionToken<DonationConfig>('DONATION', { factory: () => DONATION_CONFIG });
  ```
- `epc.ts` : `normalizeIban(raw: string): string` (sans espaces, majuscules) ; `isValidIban(raw: string): boolean` (longueur 15-34 et modulo 97 = 1) ; `formatIban(raw: string): string` (groupes de 4) ; `type AmountResult = { kind: 'empty' } | { kind: 'valid'; value: number } | { kind: 'invalid' }` ; `parseAmount(raw: string): AmountResult` ; `donationRemittance(donorName: string): string` ; `interface EpcTransfer { name: string; iban: string; bic?: string; amount?: number; remittance?: string }` ; `buildEpcPayload(t: EpcTransfer): string`.

- [ ] **Étape 1 : écrire les tests qui échouent**

Valeurs de test (exemple de documentation, jamais dans la config) : IBAN `BE68 5390 0754 7034`, BIC `GEBABEBB`.
```ts
// values.spec.ts
expect(isPlaceholder('TODO_IBAN')).toBeTrue(); expect(isPlaceholder('  ')).toBeTrue(); expect(isPlaceholder('BE68…')).toBeFalse();
expect(isHttpsUrl('https://buy.stripe.com/abc')).toBeTrue(); expect(isHttpsUrl('http://x.be')).toBeFalse(); expect(isHttpsUrl('TODO_PAYMENT_LINK')).toBeFalse();
// epc.spec.ts
expect(normalizeIban(' be68 5390 0754 7034 ')).toBe('BE68539007547034');
expect(isValidIban('BE68 5390 0754 7034')).toBeTrue();
expect(isValidIban('BE68 5390 0754 7035')).toBeFalse();
expect(formatIban('BE68539007547034')).toBe('BE68 5390 0754 7034');
expect(parseAmount('')).toEqual({ kind: 'empty' });
expect(parseAmount('12,50')).toEqual({ kind: 'valid', value: 12.5 });
expect(parseAmount(' 20 ')).toEqual({ kind: 'valid', value: 20 });
for (const bad of ['0', '-5', 'abc', '12,345', '1000000000']) expect(parseAmount(bad)).toEqual({ kind: 'invalid' });
expect(donationRemittance('')).toBe('Don');
expect(donationRemittance('  Sarah\nB. ')).toBe('Don Sarah B.');
expect(buildEpcPayload({ name: 'ASBL Mille Idées', iban: 'BE68 5390 0754 7034', bic: 'GEBABEBB', amount: 20, remittance: 'Don Sarah' }))
  .toBe('BCD\n002\n1\nSCT\nGEBABEBB\nASBL Mille Idées\nBE68539007547034\nEUR20.00\n\n\nDon Sarah');
expect(buildEpcPayload({ name: 'ASBL Mille Idées', iban: 'BE68539007547034', remittance: 'Don' }))
  .toBe('BCD\n002\n1\nSCT\n\nASBL Mille Idées\nBE68539007547034\n\n\n\nDon');
expect(buildEpcPayload({ name: 'ASBL Mille Idées', iban: 'BE68539007547034', remittance: 'D'.repeat(200) }).split('\n')[10].length).toBe(140);
// donation.spec.ts : la config est soit un placeholder, soit une valeur valide (attrape une faute de frappe le jour où on la remplit)
expect(isPlaceholder(DONATION_CONFIG.iban) || isValidIban(DONATION_CONFIG.iban)).toBeTrue();
expect(isPlaceholder(DONATION_CONFIG.bic) || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(DONATION_CONFIG.bic)).toBeTrue();
expect(isPlaceholder(DONATION_CONFIG.paymentLink) || isHttpsUrl(DONATION_CONFIG.paymentLink)).toBeTrue();
expect(DONATION_CONFIG.holder).toBe('ASBL Mille Idées');
```

- [ ] **Étape 2 : lancer les tests et vérifier qu'ils échouent**

Attendu : ÉCHEC à la compilation (modules introuvables).

- [ ] **Étape 3 : implémenter**

Format EPC069-12 version 002 : lignes `BCD`, `002`, `1` (UTF-8), `SCT`, BIC (vide autorisé), nom (70 caractères max, tronqué), IBAN normalisé, montant `EUR` + `toFixed(2)` ou vide, motif vide, référence structurée vide, communication libre (retours à la ligne remplacés par une espace, espaces en trop retirés, 140 caractères max). Lignes séparées par `\n`. `parseAmount` : retirer les espaces, virgule → point, `^\d+(\.\d{1,2})?$`, entre 0,01 et 999 999 999,99. `donationRemittance` : `Don` + espace + nom nettoyé, ou `Don` seul.

- [ ] **Étape 4 : lancer les tests et vérifier qu'ils passent**

- [ ] **Étape 5 : commit**

```bash
git add src/app/config/values.ts src/app/config/values.spec.ts src/app/config/donation.ts src/app/config/donation.spec.ts src/app/pages/don/epc.ts src/app/pages/don/epc.spec.ts
git commit -m "feat(donation): add donation config and EPC transfer payload"
```

---

### Tâche 3 : page /don avec QR code et lien de paiement

**Fichiers :**
- Créer : `src/app/pages/don/epc-qr.ts`, `src/app/pages/don/don.ts`, `src/app/pages/don/don.html`, `src/app/pages/don/don.scss`
- Modifier : `package.json` (uqr), `src/app/app.routes.ts`, `public/sitemap.xml`
- Tests : `src/app/pages/don/epc-qr.spec.ts`, `src/app/pages/don/don.spec.ts`, `src/app/app.routes.spec.ts` (créer)

**Interfaces :**
- Consomme : Tâche 2 (`DONATION`, `buildEpcPayload`, `parseAmount`, `donationRemittance`, `formatIban`, `normalizeIban`, `isValidIban`, `isPlaceholder`, `isHttpsUrl`).
- Produit : composant `EpcQr`, sélecteur `app-epc-qr`, entrées `payload = input.required<string>()` et `label = input.required<string>()` ; composant de page `Don` ; route `don`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`epc-qr.spec.ts` : rend un `svg[role="img"]` avec `aria-label` = label, un `viewBox` carré, un `rect` blanc de fond et un `path` non vide ; deux payloads différents donnent deux `d` différents.
`don.spec.ts`, avec `{ provide: DONATION, useValue: … }` :
- config valide (IBAN et BIC de test, `paymentLink: 'https://example.com/pay'`) : affiche « ASBL Mille Idées », `BE68 5390 0754 7034`, `GEBABEBB`, « Don + ton nom », un `app-epc-qr`, et un lien « Payer par Bancontact ou carte » avec `href` = le lien ;
- taper `12,50` dans « Montant (facultatif) » → la légende du QR dit « Montant : 12,50 € » ; taper `abc` → message « Montant invalide : écris par exemple 20 ou 12,50 » relié par `aria-describedby`, et la légende dit « Montant : libre » ;
- taper « Sarah » dans « Ton nom (facultatif) » → la légende dit « Communication : Don Sarah » ;
- « Copier l'IBAN » appelle `navigator.clipboard.writeText('BE68539007547034')` ; si la promesse aboutit, la zone `aria-live="polite"` dit « IBAN copié » ; si elle échoue, elle dit « Copie impossible : sélectionne l'IBAN à la main » ;
- config par défaut (placeholders) : ni IBAN, ni `app-epc-qr`, ni bouton copier, ni lien de paiement ; le texte « Les coordonnées bancaires arrivent bientôt. En attendant, écris-nous depuis la page Contact. » est affiché avec un lien vers `/contact` ;
- IBAN valide mais `paymentLink` placeholder : la partie virement s'affiche, la partie Bancontact non.
- aucun texte de la page ne contient « déductible ».

`app.routes.spec.ts` : chaque route qui a un `component` et pas `data.noindex` a un `title` et une `data.description` de 160 caractères max ; `fetch('/sitemap.xml')` contient `https://mille-idees.be/` + chaque `path` indexable. Si Karma ne sert pas `public/` à la racine, adapter le chemin et le signaler dans le rapport.

- [ ] **Étape 2 : lancer les tests et vérifier qu'ils échouent**

Attendu : ÉCHEC (composants et route `don` absents, `/don` absent du sitemap).

- [ ] **Étape 3 : implémenter**

- `npm install uqr@0.1.3 --save-exact`.
- `EpcQr` : `encode(payload, { ecc: 'M', border: 4 })` de `uqr` (niveau M imposé par la norme EPC), un seul `path` construit à partir de `data` (un `M{x} {y}h1v1h-1z` par module noir), modules `--ink` sur un fond blanc pur, largeur affichée 220 px environ, `shape-rendering="crispEdges"`.
- Page `Don`, structure :
  - intro : `<h1>Faire un <span class="marker">don</span></h1>` + `Ton don finance nos prochains projets, montés par et pour les jeunes de Bruxelles.`
  - `h2` « Par virement » : liste de définitions Titulaire / IBAN (`formatIban`) + bouton « Copier l'IBAN » (`.btn .btn--small`) / BIC / Communication. Puis `h3` « Ou scanne ce QR code avec ton appli bancaire », champs « Montant (facultatif) » (`inputmode="decimal"`) et « Ton nom (facultatif) » (`maxlength="100"`), le QR (payload = `buildEpcPayload` avec holder, iban, bic, montant valide ou aucun, `donationRemittance(nom)`), légende « Montant : … » / « Communication : … ».
  - `h2` « Par Bancontact ou carte » : `Tu passes par la page de paiement sécurisée de notre prestataire.` + `<a class="btn" [href]="paymentLink">Payer par Bancontact ou carte</a>` (même onglet).
  - Affichage conditionnel : `ibanReady = !isPlaceholder(iban) && isValidIban(iban)`, `paymentReady = !isPlaceholder(paymentLink) && isHttpsUrl(paymentLink)`. Si aucun des deux n'est prêt, seul le message « Les coordonnées bancaires arrivent bientôt… » s'affiche.
  - Le presse-papiers n'est touché qu'au clic (prérendu sans `navigator`).
- Route `don` : title `Faire un don · Mille Idées, asbl de jeunes à Bruxelles`, description `Soutiens les projets des jeunes de Bruxelles : don par virement, QR code à scanner avec ton appli bancaire, ou paiement par Bancontact et carte.`
- `public/sitemap.xml` : ajouter `<url><loc>https://mille-idees.be/don</loc></url>`.

- [ ] **Étape 4 : lancer les tests et vérifier qu'ils passent**

- [ ] **Étape 5 : commit**

```bash
git add package.json package-lock.json src/app/pages/don/epc-qr.ts src/app/pages/don/epc-qr.spec.ts src/app/pages/don/don.ts src/app/pages/don/don.html src/app/pages/don/don.scss src/app/pages/don/don.spec.ts src/app/app.routes.ts src/app/app.routes.spec.ts public/sitemap.xml
git commit -m "feat(donation): add /don page with EPC QR code and payment link"
```

---

### Tâche 4 : boutique et commande Netlify Forms

**Fichiers :**
- Créer : `src/app/data/products.ts`, `src/app/pages/boutique/order.ts`, `src/app/pages/boutique/boutique.ts`, `src/app/pages/boutique/boutique.html`, `src/app/pages/boutique/boutique.scss`, `public/__forms.html`
- Modifier : `src/app/app.routes.ts`, `public/sitemap.xml`, et `src/app/pages/contact/contact.scss` seulement pour déplacer les styles de champ partagés dans `src/styles.scss` (le rendu de `/contact` ne doit pas changer)
- Tests : `src/app/data/products.spec.ts`, `src/app/pages/boutique/order.spec.ts`, `src/app/pages/boutique/boutique.spec.ts`

**Interfaces :**
- Consomme : `isPlaceholder`, `isHttpsUrl` (Tâche 2).
- Produit :
  ```ts
  // products.ts
  export interface Product { slug: string; name: string; price: number | null; photo: { src: string; alt: string } | null; paymentLink?: string }
  export const PRODUCTS: Product[]; // 3 entrées : slug 'bic-1'..'bic-3', name 'TODO nom du bic 1'.., price null, photo null, paymentLink en commentaire // TODO
  export function formatPrice(price: number | null): string; // null → 'Prix à venir', 2.5 → '2,50 €' (Intl fr-BE)
  // order.ts
  export const ORDER_FORM_NAME = 'commande';
  export const ORDER_FIELDS = ['produit', 'nom', 'email', 'quantite', 'remarque', 'bot-field'] as const;
  export interface OrderPayload { produit: string; nom: string; email: string; quantite: number; remarque: string; 'bot-field': string }
  export function encodeOrder(order: OrderPayload): string;
  export function submitOrder(order: OrderPayload, fetchFn: typeof fetch = fetch): Promise<void>; // POST '/', rejette si !res.ok
  ```

- [ ] **Étape 1 : écrire les tests qui échouent**

`products.spec.ts` : slugs uniques ; chaque produit avec `photo` a un `alt` non vide ; chaque `paymentLink` présent passe `isHttpsUrl` ; `formatPrice(null)` = « Prix à venir » ; `formatPrice(2.5).replace(/\s/g, ' ')` = « 2,50 € ».
`order.spec.ts` :
```ts
const order = { produit: 'TODO nom du bic 1', nom: 'Sarah', email: 'sarah@example.com', quantite: 2, remarque: 'Bleu & rouge', 'bot-field': '' };
expect(encodeOrder(order)).toBe('form-name=commande&produit=TODO+nom+du+bic+1&nom=Sarah&email=sarah%40example.com&quantite=2&remarque=Bleu+%26+rouge&bot-field=');
// submitOrder appelle fetchFn('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodeOrder(order) })
// submitOrder rejette quand fetchFn renvoie { ok: false, status: 500 }
// __forms.html et le corps envoyé ont les mêmes champs :
const html = await (await fetch('/__forms.html')).text();
const doc = new DOMParser().parseFromString(html, 'text/html');
const form = doc.querySelector('form[name="commande"]')!;
expect(form.hasAttribute('netlify')).toBeTrue();
expect(form.getAttribute('netlify-honeypot')).toBe('bot-field');
expect([...form.querySelectorAll('[name]')].map(e => e.getAttribute('name')).sort()).toEqual([...ORDER_FIELDS].sort());
```
`boutique.spec.ts` : la grille affiche 3 produits avec nom, « Prix à venir » et un bouton « Commander » ; un clic ouvre le `dialog` dont le titre contient le nom du produit et dont chaque champ a un `label` ; envoyer vide → messages d'erreur reliés par `aria-describedby`, `aria-invalid="true"`, aucun appel réseau ; envoyer rempli (soumission simulée) → un seul appel même après deux clics rapides, bouton désactivé pendant l'envoi, puis « Merci ! On a bien reçu ta commande, on te répond par mail. » ; si le produit a un `paymentLink` valide, un lien « Payer en ligne » apparaît après le succès, sinon non ; envoi en échec → « L'envoi n'a pas marché. Réessaie, ou écris-nous depuis la page Contact. » et les champs gardent leurs valeurs ; la ligne RGPD est présente sous le formulaire.

- [ ] **Étape 2 : lancer les tests et vérifier qu'ils échouent**

- [ ] **Étape 3 : implémenter**

- Page : intro `<h1>La <span class="marker">boutique</span></h1>` + `On vend des bics pour financer nos projets. Tu choisis, tu commandes, on te recontacte par mail pour la suite.` Grille `ul` : 1 colonne sur mobile, 2 puis 3 colonnes, éléments séparés par des filets (pas de fond, pas d'ombre). Photo via `.photo` + une classe `.shape-*` existante ; sans photo, un cadre `var(--border)` avec « Photo à venir » (cadre décoratif, texte lisible). Nom en `h2`, prix, bouton `.btn` « Commander ».
- Commande : `<dialog>` natif ouvert par `showModal()`, `aria-labelledby` sur son `h2` « Commander : {nom} ». Reactive Form : « Ton nom » (obligatoire, `maxlength` 100, `autocomplete="name"`), « Ton email » (obligatoire, `type="email"`, `autocomplete="email"`), « Quantité » (obligatoire, entier de 1 à 99, 1 par défaut), « Remarque (facultatif) » (`textarea`, `maxlength` 500), champ piège `bot-field` masqué (`aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`). Boutons « Envoyer la commande » et « Annuler ». Échap ferme (natif), le focus revient au bouton « Commander » qui a ouvert, et le formulaire est réinitialisé à chaque ouverture.
- Ligne RGPD sous le formulaire : `Ton nom et ton email servent uniquement à traiter ta commande. Ils passent par Netlify, notre hébergeur.` (`// TODO durée de conservation à décider`).
- `public/__forms.html` : page HTML minimale, `<meta name="robots" content="noindex">`, `<form name="commande" netlify netlify-honeypot="bot-field" hidden>` avec un champ par entrée de `ORDER_FIELDS` (`remarque` en `textarea`).
- Route `boutique` : title `Boutique : des bics pour financer nos projets · Mille Idées`, description `Commande des bics Mille Idées et finance les projets des jeunes de Bruxelles : choisis ton modèle, indique la quantité, on te recontacte par mail.`
- `public/sitemap.xml` : ajouter `https://mille-idees.be/boutique` (le test de sitemap de la Tâche 3 l'exige).

- [ ] **Étape 4 : lancer les tests et vérifier qu'ils passent**

- [ ] **Étape 5 : commit**

```bash
git add src/app/data/products.ts src/app/data/products.spec.ts src/app/pages/boutique/order.ts src/app/pages/boutique/order.spec.ts src/app/pages/boutique/boutique.ts src/app/pages/boutique/boutique.html src/app/pages/boutique/boutique.scss src/app/pages/boutique/boutique.spec.ts public/__forms.html src/app/app.routes.ts public/sitemap.xml src/styles.scss src/app/pages/contact/contact.scss
git commit -m "feat(shop): add /boutique page with Netlify order form"
```

---

### Tâche 5 : nav, footer et ancres

**Fichiers :**
- Modifier : `src/app/components/header/header.html:7-11,34-38`, `src/app/components/header/header.scss`, `src/app/components/footer/footer.html:5-58`, `src/app/components/footer/footer.scss`, `src/app/app.config.ts:12`
- Tests : `src/app/components/header/header.spec.ts`, `src/app/components/footer/footer.spec.ts`

**Interfaces :**
- Consomme : routes `don` (Tâche 3), `boutique` (Tâche 4), ancre `#ateliers` (Tâche 1).

- [ ] **Étape 1 : écrire les tests qui échouent**

`header.spec.ts` : la nav principale contient, dans l'ordre, Projets `/projets`, L'asbl `/asbl`, Boutique `/boutique`, Contact `/contact` (liens simples, sans `.btn`), puis « Faire un don » `/don` avec la classe `btn` ; le tiroir mobile contient, dans l'ordre, Accueil, Projets, L'asbl, Boutique, Contact, Faire un don.
`footer.spec.ts` : une colonne `h2` « Le site » avec les liens Projets `/projets`, Ateliers `/projets#ateliers`, L'asbl `/asbl`, Boutique `/boutique`, Faire un don `/don`, Contact `/contact`.

- [ ] **Étape 2 : lancer les tests et vérifier qu'ils échouent**

- [ ] **Étape 3 : implémenter**

- Header : Contact perd `btn btn--alt btn--small` ; « Faire un don » les prend (renommer `nav-contact` en `nav-cta` dans le HTML et le SCSS). Tiroir : ajouter Boutique et Faire un don.
- Footer : nouvelle `div.footer-col` « Le site » entre `.footer-id` et Partenaires, mêmes styles que la colonne Partenaires.
- `app.config.ts` : `provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' }))`, rien d'autre (ne pas activer `scrollPositionRestoration`).

- [ ] **Étape 4 : lancer les tests et vérifier qu'ils passent**

- [ ] **Étape 5 : commit**

```bash
git add src/app/components/header/header.html src/app/components/header/header.scss src/app/components/header/header.spec.ts src/app/components/footer/footer.html src/app/components/footer/footer.scss src/app/components/footer/footer.spec.ts src/app/app.config.ts
git commit -m "feat(nav): make donate the nav button, add shop and footer site links"
```

---

### Tâche 6 : vérification du lot

- [ ] **Étape 1 : build de prod**

Commande : `npm run build`
Attendu : aucune erreur, et `dist/mille-idees-site/browser/` contient `don.html`, `boutique.html`, `projets.html` et `__forms.html`.

- [ ] **Étape 2 : pas de placeholder de paiement en ligne**

Commande : `grep -c "TODO_" dist/mille-idees-site/browser/don.html`
Attendu : `0` (la page affiche « Les coordonnées bancaires arrivent bientôt… »).

- [ ] **Étape 3 : relecture critique** par reviewer, sur tout le diff `main...maj-contenu-nov` (le lot touche au paiement et aux données perso).

- [ ] **Étape 4 : testeur-qa** : build de prod servi en local, de 320 à 1440 px, clavier seul (dialog, copie, filtres, ancre `#ateliers` depuis le footer d'une autre page), contrastes, QR lisible avec une config de test valide injectée localement (jamais commitée).

## Actions hors code (chacune cochée avec sa preuve)

- [ ] IBAN et BIC reçus (ouverture du compte ING encore « À faire » dans le backlog) et saisis dans `src/app/config/donation.ts` → `npx ng test` vert (le test de config valide l'IBAN).
- [ ] Lien de paiement Mollie ou Stripe créé au nom de l'asbl, Bancontact activé → lien saisi, test vert, paiement test de 1 € visible dans le tableau de bord du prestataire (capture).
- [ ] QR scanné avec une appli bancaire belge (ING, KBC, Belfius ou BNP) après saisie de l'IBAN → capture de l'écran de virement prérempli.
- [ ] Netlify : détection des formulaires activée et notification par e-mail vers l'adresse de l'asbl → le formulaire « commande » apparaît dans l'onglet Forms (vérif par le connecteur Netlify), une commande test reçue.
- [ ] Photos, noms et prix des bics → `src/app/data/products.ts`.
- [ ] Textes, dates, tags et illustrations des 5 nouveaux contenus → `src/app/data/projects.ts`.
- [ ] Textes et balises meta validés par le comité.
- [ ] PR ouverte puis fusionnée par Amin → `gh pr view --json state` = `MERGED`.
- [ ] Sitemap renvoyé dans Search Console après la mise en ligne (capture).
