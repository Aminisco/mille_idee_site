"""Convertit une image en WebP pour src/assets (photos, portraits, logos).

    python design/webp.py SOURCE DESTINATION.webp [--size 675x900] [--lossless]

Partir de l'original de `originaux/` quand on l'a : recompresser un JPEG déjà
compressé garde ses artefacts, et le fichier ne maigrit presque pas.
--size redimensionne sans recadrer : garder le format (ratio) de la source.
--lossless pour les logos à aplats et transparence.
"""
import argparse

from PIL import Image, ImageOps

QUALITY = 75  # 80 n'apporte rien de visible ; à 70, le feuillage commence à baver

parser = argparse.ArgumentParser()
parser.add_argument('source')
parser.add_argument('destination')
parser.add_argument('--size', help='largeur x hauteur, ex. 675x900')
parser.add_argument('--lossless', action='store_true')
args = parser.parse_args()

im = ImageOps.exif_transpose(Image.open(args.source))
transparent = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
im = im.convert('RGBA' if transparent else 'RGB')

if args.size:
    width, height = (int(n) for n in args.size.lower().split('x'))
    im = im.resize((width, height), Image.LANCZOS)

if args.lossless:
    im.save(args.destination, 'WEBP', lossless=True, method=6)
else:
    im.save(args.destination, 'WEBP', quality=QUALITY, method=6)
