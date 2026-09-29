# Illustrations dessinées

Scripts Python qui génèrent les SVG de `public/illustrations/`. Le tracé « à la main » vient de `doodle.py` (classe `Pen`, tirage aléatoire à graine fixe : un même script redonne le même dessin).

| Script | Produit |
|---|---|
| `doodle.py` | Bibliothèque commune : couleurs, `Pen`, `shape`, `ink`, `kid`, `bulb`, `heart`, `bubble`, `ground` |
| `assets1.py` | Première version de `kids_group` (remplacée par celle d'`assets2.py`) |
| `assets2.py` | `kids_group`, `waffle`, `bowl`, `gloves`, `candy`, `bag`, `sunbottle`, `megaphone`, `huddle`, `plane`, `samedi`, `ring_yel`, `ring_red`, `ring_ink`, `underline`, `arrow` |
| `assets3.py` | Nouvelles versions de `kids_group`, `gloves`, `megaphone`, `plane`, `samedi` (écrasent celles d'`assets2.py`) |
| `assets4.py` | `panorama`, `scene_contact`, `peek`, `icon_sprout`, `icon_door`, `icon_bulb`, `icon_hands` |
| `assets5.py` | `frieze` (réassemble des SVG déjà générés) |
| `assets6.py` | `atelier`, `stand` (réutilisent `waffle`) |
| `assets7.py` | `thermos` (Première maraude) |

## Lancer

Dépendances : `pip install cairosvg pillow` (cairosvg sert aux planches de contrôle en PNG).

Les scripts 1 à 6 écrivent dans `/tmp/gen/svg/` et doivent tourner dans l'ordre, car 5 et 6 relisent les SVG produits avant :

```sh
mkdir -p /tmp/gen/svg
cd design
for n in 1 2 3 4 5 6; do python assets$n.py; done
python assets7.py /tmp/gen/svg/
```

`assets7.py` prend le dossier de sortie en argument. Pour mettre à jour directement le site :
`python assets7.py ../public/illustrations/`.

Les SVG publiés dans `public/illustrations/` restent la référence : les fichiers d'origine contiennent en plus un bloc de métadonnées que les scripts ne régénèrent pas.
