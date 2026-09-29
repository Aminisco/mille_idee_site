from doodle import *
import cairosvg, re, math
OUT = '/tmp/gen/svg/'
def inner(name):
    t = open(OUT + name + '.svg').read()
    return t[t.index('>') + 1:t.rindex('</svg>')]
p = Pen(301)
items = []
def ball(cx, cy, r):
    o = shape(p.circle_d(cx, cy, r), ORANGE, (3, 3), 3.4)
    o += ink(f'M{cx-r},{cy} Q{cx},{cy-10} {cx+r},{cy}', 3) + ink(f'M{cx},{cy-r} Q{cx-10},{cy} {cx},{cy+r}', 3)
    return o
def palette(cx, cy):
    o = shape(p.cr([(cx - 46, cy), (cx - 30, cy - 28), (cx + 8, cy - 34), (cx + 44, cy - 14), (cx + 40, cy + 16), (cx + 14, cy + 10), (cx + 6, cy + 30), (cx - 26, cy + 26)], True, 1.2), '#FFF0B0', (3, 3), 3.4)
    for dx, dy, c in ((-24, -6, RED), (-8, -20, YEL), (14, -18, GREEN), (28, -2, BLUE)):
        o += shape(p.circle_d(cx + dx, cy + dy, 7), c, None, 2.8)
    return o
def brush(cx, cy):
    return ink(f'M{cx-30},{cy+30} L{cx+22},{cy-22}', 6) + shape(p.ellipse_d(cx + 30, cy - 30, 9, 15, 8, 0.8), RED, (2, 2), 3.2)
def place(name, w, h, sc, cx, base):
    return f'<g transform="translate({cx - w*sc/2:.1f},{base - h*sc:.1f}) scale({sc})">{inner(name)}</g>'
body = ''
seq = [('ball',), ('gloves', 200, 180, .5), ('sunbottle', 200, 180, .5), ('waffle', 200, 180, .5), ('palette',), ('bag', 200, 180, .5),
       ('candy', 200, 180, .5), ('bulb',), ('megaphone', 240, 200, .4), ('bowl', 200, 180, .5), ('plane', 250, 180, .38), ('heart',)]
for i, it in enumerate(seq):
    cx = 62 + i * 104
    base = 92 + (-6 if i % 2 else 0)
    n = it[0]
    if n == 'ball':
        body += ball(cx, base - 30, 27)
    elif n == 'palette':
        body += palette(cx, base - 36)
    elif n == 'bulb':
        body += bulb(p, cx, base - 52, 23, False)
    elif n == 'heart':
        body += heart(p, cx - 8, base - 30, 1.3) + heart(p, cx + 20, base - 50, 0.8, YEL)
    else:
        body += place(*it[:1], *it[1:3], it[3], cx, base + 6)
body += ink(p.line_d((6, 98), (1242, 98), 4), 3.6)
x = svg(1248, 110, body)
open(OUT + 'frieze.svg', 'w').write(x)
for n in ['frieze', 'peek', 'icon_hands']:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
from PIL import Image
a = Image.open('/tmp/gen/frieze.png').convert('RGB'); b = Image.open('/tmp/gen/peek.png').convert('RGB'); c = Image.open('/tmp/gen/icon_hands.png').convert('RGB')
sh = Image.new('RGB', (1260, a.height + b.height + 30), '#F2EEE4')
sh.paste(a, (0, 0)); sh.paste(b, (0, a.height + 10)); sh.paste(c, (700, a.height + 20))
sh.save('/tmp/gen/sheet4.png')
