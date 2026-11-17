# Mise à jour du contenu, novembre 2026

Source : carte Trello « Mettre à jour site web » (Mille Idées — Tâches) et demande d'Amin du 17/11/2026.
Branche : `maj-contenu-nov`, depuis `main`.

## Demande

1. Accueil : le compteur de projets passe à 12.
2. Page « Faire un don » :
   - Virement : titulaire « ASBL Mille Idées », IBAN, BIC, communication suggérée « Don + nom », bouton pour copier l'IBAN.
   - QR code de virement EPC/SEPA généré côté front à partir de l'IBAN, montant facultatif.
   - Bouton Bancontact/carte vers un lien de paiement externe (Mollie ou Stripe Payment Link), sans clé API.
   - IBAN, BIC et lien de paiement dans un seul fichier de config, en placeholders TODO.
   - Lien « Faire un don » dans la nav et le footer.
3. Boutique de bics : grille de produits (photo, nom, prix, « Commander »), formulaire de commande (nom, email, quantité, remarque) envoyé par Netlify Forms, lien de paiement par produit en option. Produits dans un fichier de données ; photos et prix en TODO.
4. Nouveaux contenus au format des projets existants, textes courts en placeholder.
5. Champ `type: 'projet' | 'atelier'` ; projets et ateliers séparés.
6. Mention « Spécialisation SRG / Aide à la Jeunesse » sur l'accueil et dans À propos.

Contraintes : direction artistique actuelle (pas de dégradés, emojis ni cartes « template »), mobile et accessibilité soignés, pas de dépendance lourde, sitemap et meta à jour, `ng build` sans erreur, liste finale des TODO.

## Décisions d'Amin (17/11/2026)

| Sujet | Décision |
|---|---|
| Projets / ateliers | Une seule page `/projets`, deux sections, ancre `#ateliers`. Pas de page `/ateliers` tant qu'il y a moins de 3 ateliers. |
| Nouveaux contenus | Projets : basket, foot, visite historique de Bruxelles. Ateliers : ateliers d'écriture, atelier d'écriture du projet Canada. Les 7 existants restent des projets. |
| Compteur | « Douze projets » = 10 projets + 2 ateliers. |
| Nav | « Faire un don » devient le bouton de la nav (à la place de Contact, qui devient un lien). Boutique ajoutée. |
| Mention SRG | Une ligne sous le titre du hero de l'accueil, une ligne dans l'intro de `/asbl`. Sigle non développé. |
| RGPD | Une ligne d'info sous le formulaire de commande. La page confidentialité est un chantier séparé. |

## Garde-fous

- Tant que l'IBAN ou le lien de paiement est un placeholder (ou invalide), le QR, le bouton copier et le bouton payer ne s'affichent pas.
- Aucune mention « don déductible » (exige l'agrément du SPF Finances).
- Aucune valeur inventée : IBAN, BIC, liens, prix, photos, dates et textes en TODO.
