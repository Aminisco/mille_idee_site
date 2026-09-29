from doodle import *
import cairosvg, math
OUT = '/tmp/gen/svg/'
def save(name, w, h, body, preserve=None):
    x = svg(w, h, body)
    if preserve:
        x = x.replace('<svg ', f'<svg preserveAspectRatio="{preserve}" ', 1)
    open(OUT + name + '.svg', 'w').write(x)

# kids group (heart moved, filament simpler)
p = Pen(11)
b = bulb(p, 262, 44, 24) + bulb(p, 392, 80, 15, False)
b += kid(p, 112, 452, 1.0, SKINS[1], YEL, '#2B2F3A', WHITE, 'curly', INK, 'cheer')
b += kid(p, 242, 452, 1.06, SKINS[2], WHITE, '#3A4A7A', RED, 'cap', RED, 'ball', True)
b += kid(p, 372, 452, 1.0, SKINS[0], GREEN, '#D9CBA8', WHITE, 'beanie', YEL, 'box')
b += ground(p, 10, 452, 458)
b += heart(p, 48, 60, 1.2)
save('kids_group', 470, 480, b)

# gloves
p = Pen(41)
def glove(cx, cy, rot, flipx=1):
    g = f'<g transform="translate({cx},{cy}) rotate({rot}) scale({flipx},1)">'
    g += shape(p.rr_d(-14, 22, 46, 30, 8), WHITE, (3, 3))
    g += shape(p.cr([(-38, 8), (-40, -22), (-20, -44), (12, -46), (34, -28), (40, 2), (32, 22), (-10, 26)], True, 1.6), RED, (5, 4))
    g += shape(p.ellipse_d(-32, 8, 15, 11, 8, -0.5), RED, (3, 3), 3.4)
    g += ink('M-12,-28 Q6,-34 24,-24', 3)
    g += ink('M-4,32 l24,0', 3.2) + ink('M-4,43 l24,0', 3.2)
    g += '</g>'
    return g
b = glove(52, 100, -14, 1) + glove(150, 96, 14, -1)
for a in (-30, 0, 30):
    t = math.radians(a - 90)
    b += ink(p.line_d((100 + 30 * math.cos(t), 78 + 30 * math.sin(t)), (100 + 48 * math.cos(t), 78 + 48 * math.sin(t)), 1.5), 3.4)
save('gloves', 200, 180, b)

# megaphone (horizontal cone)
p = Pen(81)
b = '<g transform="rotate(-14 100 90)">'
b += shape(p.rr_d(60, 110, 26, 44, 8), YEL, (3, 3), 3.4)
b += shape(p.cr([(24, 74), (140, 26), (140, 154), (24, 106)], True, 0.8), RED, (5, 4))
b += shape(p.rr_d(14, 70, 22, 40, 8), WHITE, (3, 3), 3.4)
b += shape(p.ellipse_d(142, 90, 16, 64), WHITE, (3, 3), 3.6)
b += ink('M60,64 L60,116', 3)
b += '</g>'
for k, r in enumerate((24, 42, 60)):
    b += ink('M%d,%d q%d,%d 0,%d' % (172 + k * 8, 94 - r, 12 + k * 4, r, 2 * r), 4)
save('megaphone', 240, 200, b)

# plane
p = Pen(101)
b = ink('M16,158 C36,110 76,156 100,112 C122,72 104,36 146,42', 3.6, 'none', 'stroke-dasharray="2 12"')
b += '<g transform="rotate(-8 170 80)">'
b += shape(p.cr([(236, 28), (112, 66), (156, 98)], True, 0.5), WHITE, (4, 4))
b += shape(p.cr([(236, 28), (156, 98), (176, 138)], True, 0.5), '#E8DFC8', (0, 0))
b += ink('M236,28 L112,66 L156,98 L176,138 Z', 3.6)
b += ink('M156,98 L236,28', 3)
b += '</g>'
b += heart(p, 62, 80, 1.1)
save('plane', 250, 180, b)

# samedi scene
p = Pen(111)
b = shape(p.circle_d(96, 96, 62, 12), WHITE, (5, 4))
for i in range(12):
    t = math.radians(i * 30 - 90)
    r0, r1 = (50, 57) if i % 3 == 0 else (54, 57)
    b += ink('M%.1f,%.1f L%.1f,%.1f' % (96 + r0 * math.cos(t), 96 + r0 * math.sin(t), 96 + r1 * math.cos(t), 96 + r1 * math.sin(t)), 3)
b += ink('M96,96 L96,52', 5) + ink('M96,96 L122,112', 6.5)
b += f'<circle cx="96" cy="96" r="5" fill="{INK}"/>'
b += bubble(p, 176, 26, 100, 54, 'left')
b += f'<circle cx="208" cy="53" r="4.5" fill="{INK}"/><circle cx="226" cy="53" r="4.5" fill="{INK}"/><circle cx="244" cy="53" r="4.5" fill="{INK}"/>'
b += shape(p.cr([(330, 196), (370, 196), (364, 246), (336, 246)], True, 1), ORANGE, (3, 3))
for (lx, ly, rx, ry, rot) in [(338, 166, 11, 32, -25), (350, 154, 11, 36, 0), (364, 168, 11, 30, 28)]:
    b += f'<g transform="rotate({rot} {lx} {ly+20})">' + shape(p.ellipse_d(lx, ly, rx, ry), GREEN, (2, 2), 3.2) + '</g>'
b += shape(p.rr_d(16, 216, 104, 58, 26), GREEN, (5, 4)) + ink('M36,234 q28,-8 64,0', 2.8)
b += '<g transform="rotate(-5 172 246)">' + shape(p.rr_d(128, 224, 104, 54, 24), YEL, (5, 4)) + ink('M148,241 q28,-8 62,0', 2.8) + '</g>'
b += shape(p.rr_d(240, 232, 84, 46, 20), RED, (5, 4)) + ink('M256,247 q22,-6 50,0', 2.8)
b += ink(p.line_d((8, 292), (372, 292), 5), 4)
save('samedi', 380, 300, b)

names = ['kids_group', 'gloves', 'megaphone', 'plane', 'samedi']
from PIL import Image
imgs = []
for n in names:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    imgs.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
W = 1400; x = y = 0; rowh = 0
sheet = Image.new('RGB', (W, 1200), '#F2EEE4')
for im in imgs:
    if x + im.width > W:
        x = 0; y += rowh + 20; rowh = 0
    sheet.paste(im, (x, y)); x += im.width + 20; rowh = max(rowh, im.height)
sheet.crop((0, 0, W, y + rowh + 10)).save('/tmp/gen/sheet2.png')
