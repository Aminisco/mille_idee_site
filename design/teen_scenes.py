import math, sys
sys.path.insert(0, '/tmp/gen')
from doodle import Pen, ink, shape, tube, ground, bubble, INK, YEL, RED, WHITE, GREEN, ORANGE, SKINS, svg
from teen import teen, MUSTARD, BRICK, CHARCOAL, OLIVE, BLUE
import cairosvg

OUT = '/tmp/gen/svg/'
def save(name, w, h, body):
    open(OUT + name + '.svg', 'w').write(svg(w, h, body))

def spark(cx, cy, s=1.0, col=INK):
    # small asterisk-like mark, replaces the heart as a neutral "beat" accent
    o = ''
    for a in (0, 60, 120):
        t = math.radians(a)
        o += f'<line x1="{cx-12*s*math.cos(t):.1f}" y1="{cy-12*s*math.sin(t):.1f}" x2="{cx+12*s*math.cos(t):.1f}" y2="{cy+12*s*math.sin(t):.1f}" stroke="{col}" stroke-width="{3.2*s:.1f}" stroke-linecap="round"/>'
    return o

def dots(cx, cy):
    return ''.join(f'<circle cx="{cx-16+16*i}" cy="{cy}" r="4.2" fill="{INK}"/>' for i in range(3))

# ---------------------------------------------------------------- HERO group
p = Pen(601)
b = ''
b += teen(p, 112, 452, 1.0, SKINS[1], CHARCOAL, '#1C1B18', '#EDE7D8', 'fade', '#1C1B18', 'cross')
b += teen(p, 245, 452, 1.08, SKINS[2], BLUE, '#1C1B18', '#EDE7D8', 'hood', BLUE, 'ball', True)
b += teen(p, 378, 452, 1.0, SKINS[0], BRICK, '#1C1B18', '#1C1B18', 'curls', '#1C1B18', 'gloves')
b += ground(p, 10, 452, 458)
save('kids_group_v2', 470, 480, b)

# ---------------------------------------------------------------- PANORAMA (4 category scenes)
def scene_sport(p, ox):
    o = teen(p, ox + 92, 322, 0.6, SKINS[3], CHARCOAL, '#1C1B18', WHITE, 'fade', '#1C1B18', 'gloves')
    o += teen(p, ox + 208, 322, 0.6, SKINS[0], BRICK, '#1C1B18', MUSTARD, 'cap', '#1C1B18', 'ball', True)
    return o

def scene_art(p, ox):
    o = ''
    o += shape(p.rr_d(ox + 158, 40, 142, 272, 10), '#E4DAC0', (4, 4))
    # graffiti tag: a few bold flat strokes, not a toddler triangle+circle
    o += f'<path d="M{ox+178},220 C{ox+200},170 {ox+230},260 {ox+256},190" fill="none" stroke="{BRICK}" stroke-width="16" stroke-linecap="round"/>'
    o += f'<path d="M{ox+178},220 C{ox+200},170 {ox+230},260 {ox+256},190" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>'
    o += f'<path d="M{ox+190},120 L{ox+270},108" fill="none" stroke="{MUSTARD}" stroke-width="12" stroke-linecap="round"/>'
    o += f'<path d="M{ox+190},120 L{ox+270},108" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
    for dx, dy in ((214, 250), (238, 258), (196, 96)):
        o += f'<circle cx="{ox+dx}" cy="{dy}" r="4" fill="{OLIVE}" stroke="{INK}" stroke-width="1.6"/>'
    o += teen(p, ox + 84, 322, 0.6, SKINS[1], OLIVE, '#1C1B18', '#EDE7D8', 'bun', '#1C1B18', 'spray')
    return o

def scene_maraude(p, ox):
    o = teen(p, ox + 88, 322, 0.6, SKINS[2], BRICK, '#1C1B18', '#EDE7D8', 'hood', BRICK, 'bag')
    o += teen(p, ox + 210, 322, 0.6, SKINS[0], CHARCOAL, '#1C1B18', MUSTARD, 'curls', '#1C1B18', 'pocket', True)
    return o

def scene_citoyen(p, ox):
    o = shape(p.rr_d(ox + 232, 192, 26, 130, 8), '#8A5A3C', (3, 3))
    for cx, cy, r in ((ox + 218, 168, 30), (ox + 262, 164, 32), (ox + 244, 196, 28)):
        o += shape(p.circle_d(cx, cy, r, 12), OLIVE, (3, 3), 3.2)
    o += teen(p, ox + 96, 322, 0.6, SKINS[2], BLUE, '#1C1B18', '#EDE7D8', 'fade', '#1C1B18', 'bag')
    return o

p = Pen(611)
body = scene_sport(p, 0) + scene_art(p, 312) + scene_maraude(p, 624) + scene_citoyen(p, 936)
body += ground(p, 6, 1242, 326)
save('panorama_v2', 1248, 350, body)

# ---------------------------------------------------------------- PEEK (heads over the band)
p = Pen(621)
spec = [(70, SKINS[2], CHARCOAL, 'fade', False), (190, SKINS[1], BLUE, 'hood', True),
        (310, SKINS[0], OLIVE, 'bun', False), (430, SKINS[3], BRICK, 'cap', False),
        (548, SKINS[2], MUSTARD, 'curls', True)]
b = ''
for x, sk, top, hair, fl in spec:
    b += teen(p, x, 300, 0.72, sk, top, '#1C1B18', WHITE, hair, '#1C1B18', 'pocket', fl)
save('peek_v2', 620, 130, b)

# ---------------------------------------------------------------- CONTACT scene
p = Pen(631)
b = bubble(p, 40, 20, 116, 56, 'left')
b += dots(98, 48)
b += teen(p, 96, 436, 0.9, SKINS[1], CHARCOAL, '#1C1B18', '#EDE7D8', 'fade', '#1C1B18', 'pocket')
b += teen(p, 236, 436, 0.9, SKINS[2], BRICK, '#1C1B18', MUSTARD, 'hood', BRICK, 'cross', True)
b += ground(p, 8, 330, 442)
save('scene_contact_v2', 340, 460, b)

# ---------------------------------------------------------------- ATELIER (L'asbl hero)
WOOD = '#B98F52'
p = Pen(641)
b = shape(p.rr_d(30, 24, 410, 236, 12), '#E4DAC0', (5, 4))
notes = [(58, 48, MUSTARD, -4), (140, 60, BRICK, 3), (222, 44, OLIVE, -2), (304, 58, BLUE, 4)]
for x, y, c, r in notes:
    b += f'<g transform="rotate({r} {x+34} {y+30})">' + shape(p.rr_d(x, y, 68, 62, 4), c, (2, 2), 3.2)
    b += ink(f'M{x+10},{y+18} l40,0', 2.4, WHITE) + ink(f'M{x+10},{y+32} l30,0', 2.4, WHITE) + '</g>'
b += ink('M126,84 Q136,70 150,86', 2.6, 'none', 'stroke-dasharray="2 8"')
b += spark(240, 156, 1.0, INK)
b += teen(p, 108, 424, 0.78, SKINS[0], BRICK, '#1C1B18', '#EDE7D8', 'bun', '#1C1B18', 'pocket')
b += teen(p, 236, 424, 0.82, SKINS[3], CHARCOAL, '#1C1B18', MUSTARD, 'cap', '#1C1B18', 'cross')
b += teen(p, 362, 424, 0.78, SKINS[2], OLIVE, '#1C1B18', '#EDE7D8', 'hood', OLIVE, 'bag', True)
b += shape(p.rr_d(14, 318, 442, 112, 10), WOOD, (5, 4))
b += ink('M20,336 q220,-8 430,0', 2.6)
b += shape(p.rr_d(60, 296, 84, 24, 4), '#FFFDF7', (2, 2), 3.2)
b += shape(p.rr_d(190, 298, 44, 22, 4), WHITE, (2, 2), 3.2) + shape(p.rr_d(200, 302, 26, 14, 3), MUSTARD, None, 2.6)
b += shape(p.rr_d(300, 300, 34, 20, 4), BRICK, (2, 2), 3.2)
b += ground(p, 8, 462, 440)
save('atelier_v2', 470, 470, b)

# ---------------------------------------------------------------- STAND (Projets hero)
p = Pen(651)
b = ''
b += ink('M20,40 Q250,88 480,40', 3)
cols = [BRICK, MUSTARD, CHARCOAL, OLIVE] * 3
for i, c in enumerate(cols[:10]):
    t = (i + 0.5) / 10
    x = 20 + 460 * t
    y = 40 + 24 * (1 - (2 * t - 1) ** 2)
    b += shape(p.cr([(x - 15, y - 2), (x + 15, y - 2), (x, y + 30)], True, 0.5), c, (2, 2), 2.8)
b += ink('M64,116 L64,320', 5.4) + ink('M440,116 L440,320', 5.4)
stripes = 8; sw = (440 - 44) / stripes
for i in range(stripes):
    x0 = 44 + i * sw
    col = MUSTARD if i % 2 == 0 else CHARCOAL
    d = f'M{x0:.1f},96 L{x0+sw:.1f},96 L{x0+sw+4:.1f},150 A{sw/2+2:.1f},16 0 0 1 {x0+2:.1f},150 Z'
    b += f'<path d="{d}" fill="{col}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
b += ink('M44,96 L440,96', 3.4)
b += teen(p, 168, 432, 0.8, SKINS[1], BRICK, '#1C1B18', '#EDE7D8', 'fade', '#1C1B18', 'pocket')
b += teen(p, 338, 432, 0.8, SKINS[2], OLIVE, '#1C1B18', MUSTARD, 'bun', '#1C1B18', 'cross', True)
b += shape(p.rr_d(30, 318, 440, 114, 10), '#EDE0BE', (5, 4))
for i in range(7):
    x = 30 + i * 62.9
    if i % 2 == 0:
        b += f'<path d="M{x:.1f},320 L{x+31:.1f},320 L{x+31:.1f},430 L{x:.1f},430 Z" fill="{BRICK}" opacity="0.85"/>'
b += ink('M30,318 L470,318', 3.4) + ink('M30,432 L470,432', 3)
for cx in (108, 250, 392):
    b += f'<g transform="translate({cx-50},{318-80}) scale(0.5)">' + open(OUT + 'waffle.svg').read().split('>',1)[1].rsplit('</svg>',1)[0] + '</g>'
b += spark(476, 190, 0.9, INK)
save('stand_v2', 500, 470, b)

names = ['kids_group_v2', 'panorama_v2', 'peek_v2', 'scene_contact_v2', 'atelier_v2', 'stand_v2']
from PIL import Image
imgs = []
for n in names:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    imgs.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
W = 1300
x = y = 0; rowh = 0
sheet = Image.new('RGB', (W, 1400), '#F2EEE4')
for im in imgs:
    if x + im.width > W:
        x = 0; y += rowh + 20; rowh = 0
    sheet.paste(im, (x, y)); x += im.width + 20; rowh = max(rowh, im.height)
sheet = sheet.crop((0, 0, W, y + rowh + 10))
sheet.save('/tmp/gen/sheet_v2.png')
print(sheet.size)
