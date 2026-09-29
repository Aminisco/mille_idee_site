from doodle import *
import cairosvg, math
OUT = '/tmp/gen/svg/'
WOOD = '#D9B77E'
def inner(name):
    t = open(OUT + name + '.svg').read()
    return t[t.index('>') + 1:t.rindex('</svg>')]

# ---------------- ATELIER (L'asbl) : on monte des projets autour d'une table
p = Pen(401)
b = shape(p.rr_d(30, 24, 410, 236, 12), '#EFE6CF', (5, 4))
notes = [(58, 48, YEL, -4), (140, 60, '#F0A6B8', 3), (222, 44, '#BFE0F0', -2), (304, 58, '#A8D8B9', 4),
         (70, 150, '#A8D8B9', 3), (330, 150, YEL, -3)]
for x, y, c, r in notes:
    b += f'<g transform="rotate({r} {x+34} {y+30})">' + shape(p.rr_d(x, y, 68, 62, 4), c, (2, 2), 3.2)
    b += ink(f'M{x+10},{y+18} l40,0', 2.6) + ink(f'M{x+10},{y+32} l30,0', 2.6) + ink(f'M{x+10},{y+46} l36,0', 2.6) + '</g>'
b += ink('M126,84 Q136,70 150,86', 3, 'none', 'stroke-dasharray="2 8"') + ink('M212,80 Q222,66 236,80', 3, 'none', 'stroke-dasharray="2 8"')
b += bulb(p, 408, 84, 20, False)
b += kid(p, 110, 424, 0.82, SKINS[0], RED, '#2B2F3A', WHITE, 'bun', INK, 'wave')
b += kid(p, 236, 424, 0.86, SKINS[3], WHITE, '#3A4A7A', RED, 'cap', BLUE, 'hips')
b += kid(p, 362, 424, 0.82, SKINS[2], GREEN, '#D9CBA8', WHITE, 'scarf', BLUE, 'cheer')
# table
b += shape(p.rr_d(14, 318, 442, 112, 10), WOOD, (5, 4))
b += ink('M20,336 q220,-8 430,0', 3)
# items on the table
b += shape(p.rr_d(60, 296, 84, 24, 4), '#FFFDF7', (2, 2), 3.2) + shape(p.cr([(70, 296), (134, 296), (128, 262), (76, 262)], True, 0.4), '#BFE0F0', (2, 2), 3.2)
b += shape(p.rr_d(190, 298, 44, 22, 4), WHITE, (2, 2), 3.2) + shape(p.rr_d(200, 302, 26, 14, 3), YEL, None, 2.8)
b += shape(p.rr_d(300, 300, 34, 20, 4), RED, (2, 2), 3.2)
b += shape(p.rr_d(390, 292, 30, 28, 5), ORANGE, (2, 2), 3.2) + ink('M420,300 q14,4 0,14', 3.2)
b += ground(p, 8, 462, 440)
open(OUT + 'atelier.svg', 'w').write(svg(470, 470, b))

# ---------------- STAND (Projets) : vente de gaufres
p = Pen(411)
b = ''
# bunting
b += ink('M20,40 Q250,88 480,40', 3.4)
cols = [RED, YEL, WHITE, GREEN, RED, YEL, WHITE, GREEN, RED, YEL]
for i, c in enumerate(cols):
    t = (i + 0.5) / len(cols)
    x = 20 + 460 * t
    y = 40 + 2 * (1 - (2 * t - 1) ** 2) * 24 + 0
    y = 40 + 48 * (1 - (2 * t - 1) ** 2) * 0.5 * 2 * 0.5
    b += shape(p.cr([(x - 15, y - 2), (x + 15, y - 2), (x, y + 30)], True, 0.5), c, (2, 2), 3)
# posts
b += ink('M64,116 L64,320', 6) + ink('M440,116 L440,320', 6)
# awning
stripes = 8
sw = (440 - 44) / stripes
for i in range(stripes):
    x0 = 44 + i * sw
    col = YEL if i % 2 == 0 else WHITE
    d = f'M{x0:.1f},96 L{x0+sw:.1f},96 L{x0+sw+4:.1f},150 A{sw/2+2:.1f},16 0 0 1 {x0+2:.1f},150 Z'
    b += f'<path d="{d}" fill="{col}" transform="translate(3,3)"/>' if False else ''
    b += f'<path d="{d}" fill="{col}" stroke="{INK}" stroke-width="3.4" stroke-linejoin="round"/>'
b += ink('M44,96 L440,96', 4)
# kids
b += kid(p, 170, 432, 0.84, SKINS[1], RED, '#2B2F3A', WHITE, 'curly', INK, 'cheer')
b += kid(p, 336, 432, 0.84, SKINS[2], GREEN, '#D9CBA8', WHITE, 'long', '#6B4429', 'wave', True)
# counter
b += shape(p.rr_d(30, 318, 440, 114, 10), '#F7E7BF', (5, 4))
for i in range(7):
    x = 30 + i * 62.9
    b += f'<path d="M{x:.1f},320 L{x+31:.1f},320 L{x+31:.1f},430 L{x:.1f},430 Z" fill="{RED}" opacity="0.9"/>' if i % 2 == 0 else ''
b += ink('M30,318 L470,318', 4) + ink('M30,432 L470,432', 3.4)
for cx in (108, 250, 392):
    b += f'<g transform="translate({cx-50},{318-80}) scale(0.5)">{inner("waffle")}</g>'
b += heart(p, 476, 190, 1.1)
open(OUT + 'stand.svg', 'w').write(svg(500, 470, b))

from PIL import Image
ims = []
for n in ['atelier', 'stand']:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    ims.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
sh = Image.new('RGB', (ims[0].width + ims[1].width + 20, max(i.height for i in ims)), '#F2EEE4')
sh.paste(ims[0], (0, 0)); sh.paste(ims[1], (ims[0].width + 20, 0))
sh.save('/tmp/gen/sheet6.png'); print(sh.size)
