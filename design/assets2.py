from doodle import *
import cairosvg, math
OUT = '/tmp/gen/svg/'

def save(name, w, h, body, preserve=None):
    x = svg(w, h, body)
    if preserve:
        x = x.replace('<svg ', f'<svg preserveAspectRatio="{preserve}" ', 1)
    open(OUT + name + '.svg', 'w').write(x)

# ---- kids group
p = Pen(11)
b = bulb(p, 262, 44, 24) + bulb(p, 386, 84, 15, False)
b += kid(p, 112, 452, 1.0, SKINS[1], YEL, '#2B2F3A', WHITE, 'curly', INK, 'cheer')
b += kid(p, 242, 452, 1.06, SKINS[2], WHITE, '#3A4A7A', RED, 'cap', RED, 'ball', True)
b += kid(p, 372, 452, 1.0, SKINS[0], GREEN, '#D9CBA8', WHITE, 'beanie', YEL, 'box')
b += ground(p, 10, 452, 458)
b += heart(p, 20, 170, 1.0)
save('kids_group', 470, 480, b)

# ---- waffle
p = Pen(21)
b = shape(p.ellipse_d(100, 152, 92, 20), WHITE, (3, 3))
b += '<g transform="rotate(-10 100 100)">'
b += shape(p.rr_d(38, 52, 124, 100, 16), '#E8A93B', (5, 4))
for i in (1, 2):
    b += ink(p.line_d((38 + i * 41, 56), (38 + i * 41, 148), 3), 3)
for i in (1, 2):
    b += ink(p.line_d((42, 52 + i * 33), (158, 52 + i * 33), 3), 3)
b += '</g>'
b += shape(p.cr([(72, 78), (100, 62), (130, 72), (140, 94), (118, 104), (96, 98), (74, 100)], True, 1.2), WHITE, (3, 3), 3.2)
b += shape(p.circle_d(108, 66, 15), RED, (2, 2), 3.2)
b += ink('M104,52 q4,-10 12,-8 q-2,8 -12,8', 2.6, GREEN)
b += ink('M104,66 l0,0 M111,72 l0,0 M100,74 l0,0', 3)
save('waffle', 200, 180, b)

# ---- bowl
p = Pen(31)
b = ''
for x in (72, 104, 136):
    b += ink('M%d,74 q9,-13 0,-25 q-9,-13 0,-25' % x, 3.4)
bowl = p.cr([(28, 92), (172, 92), (166, 128), (140, 156), (100, 162), (60, 156), (34, 128)], True, 1.6)
b += shape(bowl, YEL, (5, 4))
b += shape(p.ellipse_d(100, 92, 74, 12), WHITE, (0, 0), 3.4)
b += ink('M52,124 q48,14 96,0', 3)
b += ink(p.line_d((64, 170), (136, 170), 3), 4)
b += ink('M150,52 L182,20', 5) + shape(p.ellipse_d(190, 14, 13, 8, 8, -0.7), WHITE, (2, 2), 3.2)
b += heart(p, 30, 46, 0.9)
save('bowl', 200, 180, b)

# ---- gloves
p = Pen(41)
def glove(cx, cy, rot, flipx=1):
    g = f'<g transform="translate({cx},{cy}) rotate({rot}) scale({flipx},1)">'
    g += shape(p.rr_d(-8, 24, 50, 34, 8), WHITE, (3, 3))
    g += shape(p.cr([(-40, 10), (-42, -22), (-20, -46), (14, -48), (38, -28), (44, 2), (36, 24), (-10, 28)], True, 1.6), RED, (5, 4))
    g += shape(p.ellipse_d(-34, 8, 17, 12, 8, -0.5), RED, (3, 3), 3.4)
    g += ink('M-14,-30 Q6,-36 26,-26', 3)
    g += ink('M2,34 l26,0', 3.2) + ink('M2,46 l26,0', 3.2)
    g += '</g>'
    return g
b = glove(70, 96, -18, 1) + glove(134, 88, 22, -1)
for a in (-30, 0, 30):
    t = math.radians(a - 90)
    b += ink(p.line_d((100 + 40 * math.cos(t), 30 + 40 * math.sin(t)), (100 + 58 * math.cos(t), 30 + 58 * math.sin(t)), 1.5), 3.4)
save('gloves', 200, 180, b)

# ---- candy + lollipop
p = Pen(51)
b = '<g transform="rotate(-14 90 100)">'
b += shape(p.cr([(36, 100), (50, 84), (76, 90), (76, 110), (50, 116)], True, 1), YEL, (3, 3), 3.4)
b += shape(p.cr([(144, 100), (130, 84), (104, 90), (104, 110), (130, 116)], True, 1), YEL, (3, 3), 3.4)
b += shape(p.ellipse_d(90, 100, 44, 30), RED, (4, 4))
for x in (68, 88, 108):
    b += '<path d="%s" fill="none" stroke="%s" stroke-width="6" stroke-linecap="round"/>' % (p.line_d((x, 76), (x - 14, 124), 2), WHITE)
b += ink(p.ellipse_d(90, 100, 44, 30), 3.6)
b += '</g>'
b += ink('M160,76 L152,168', 5)
b += shape(p.circle_d(162, 60, 30), '#F0A6B8', (4, 3))
b += ink('M162,60 q10,-6 10,4 q0,10 -14,8 q-16,-4 -12,-22', 3)
save('candy', 200, 180, b)

# ---- bag + picker
p = Pen(61)
b = shape(p.cr([(50, 150), (34, 108), (52, 78), (84, 70), (116, 78), (134, 108), (120, 150), (86, 158)], True, 1.6), GREEN, (5, 4))
b += shape(p.cr([(70, 72), (78, 52), (94, 52), (102, 72)], True, 1), GREEN, (3, 3), 3.4)
b += ink('M62,66 q24,-16 46,0', 3.4)
b += ink('M60,110 q8,-14 22,-16', 3)
b += ink('M170,20 L130,160', 5.5)
b += ink('M170,20 q14,-6 20,6', 4.5) + ink('M172,26 q6,-4 10,4', 3.4)
b += shape(p.cr([(156, 110), (178, 96), (186, 118), (166, 130)], True, 0.8), '#7CB98D', (2, 2), 3.2)
save('bag', 200, 180, b)

# ---- sun + bottle
p = Pen(71)
b = shape(p.circle_d(136, 56, 30), YEL, (4, 3))
for i in range(10):
    t = math.radians(i * 36 + 8)
    b += ink(p.line_d((136 + 40 * math.cos(t), 56 + 40 * math.sin(t)), (136 + 56 * math.cos(t), 56 + 56 * math.sin(t)), 1.5), 4)
b += shape(p.rr_d(40, 62, 46, 100, 14), '#BFE0F0', (4, 4))
b += shape(p.rr_d(52, 40, 22, 26, 5), RED, (3, 3), 3.4)
b += ink('M44,104 q20,10 38,0', 3)
b += ink('M54,84 l0,26', 2.8)
save('sunbottle', 200, 180, b)

# ---- megaphone
p = Pen(81)
b = '<g transform="rotate(-12 100 90)">'
b += shape(p.rr_d(108, 34, 34, 112, 12), WHITE, (3, 3))
b += shape(p.cr([(30, 70), (112, 26), (112, 152), (30, 108)], True, 1), RED, (5, 4))
b += shape(p.rr_d(22, 66, 24, 46, 8), YEL, (3, 3), 3.4)
b += shape(p.rr_d(50, 118, 22, 50, 8), WHITE, (3, 3), 3.4)
b += '</g>'
for k, r in enumerate((26, 44, 62)):
    b += ink('M%d,%d q%d,%d 0,%d' % (162 + k * 6, 90 - r, 14 + k * 4, r, 2 * r), 4)
save('megaphone', 240, 200, b)

# ---- huddle
p = Pen(91)
cols = [YEL, RED, WHITE, GREEN, '#3A4A7A']
skin = [SKINS[1], SKINS[2], SKINS[0], SKINS[3], SKINS[1]]
b = ''
for i in range(5):
    a = math.radians(-90 + i * 72 + 8)
    ox, oy = 150 + 138 * math.cos(a), 150 + 138 * math.sin(a)
    ix, iy = 150 + 40 * math.cos(a + 0.12), 150 + 40 * math.sin(a + 0.12)
    mx, my = 150 + 90 * math.cos(a - 0.06), 150 + 90 * math.sin(a - 0.06)
    d = 'M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f' % (ox, oy, mx, my, ix, iy)
    b += tube(d, cols[i], 22, 30)
    b += shape(p.circle_d(ix, iy, 19), skin[i], (2, 2), 3.4)
    ca = math.radians(-90 + i * 72 + 8)
    cx1, cy1 = 150 + 112 * math.cos(ca - 0.05), 150 + 112 * math.sin(ca - 0.05)
    b += ink('M%.1f,%.1f l%.1f,%.1f' % (cx1 - 12 * math.sin(ca), cy1 + 12 * math.cos(ca), 24 * math.sin(ca), -24 * math.cos(ca)), 3.2)
save('huddle', 300, 300, b)

# ---- plane
p = Pen(101)
b = ink('M14,150 C34,110 70,150 96,110 C120,74 100,40 138,44', 3.6, 'none', 'stroke-dasharray="2 12"')
b += '<g transform="rotate(-24 172 60)">'
b += shape(p.cr([(120, 62), (232, 40), (150, 92)], True, 0.6), WHITE, (4, 4))
b += shape(p.cr([(150, 92), (232, 40), (162, 118)], True, 0.6), '#E8DFC8', (0, 0))
b += ink('M120,62 L232,40 L162,118 L150,92 Z', 3.6)
b += ink('M150,92 L232,40', 3)
b += '</g>'
b += heart(p, 60, 78, 1.0)
save('plane', 250, 180, b)

# ---- samedi scene (clock, cushions, plant)
p = Pen(111)
b = shape(p.circle_d(96, 96, 62, 12), WHITE, (5, 4))
for i in range(12):
    t = math.radians(i * 30 - 90)
    r0, r1 = (50, 57) if i % 3 == 0 else (54, 57)
    b += ink('M%.1f,%.1f L%.1f,%.1f' % (96 + r0 * math.cos(t), 96 + r0 * math.sin(t), 96 + r1 * math.cos(t), 96 + r1 * math.sin(t)), 3)
b += ink('M96,96 L96,52', 5) + ink('M96,96 L122,112', 6.5)
b += f'<circle cx="96" cy="96" r="5" fill="{INK}"/>'
b += bubble(p, 178, 30, 96, 52, 'left')
b += f'<circle cx="208" cy="56" r="4.5" fill="{INK}"/><circle cx="226" cy="56" r="4.5" fill="{INK}"/><circle cx="244" cy="56" r="4.5" fill="{INK}"/>'
# plant
b += shape(p.cr([(306, 190), (350, 190), (344, 240), (312, 240)], True, 1), ORANGE, (3, 3))
for (lx, ly, rx, ry, rot) in [(316, 160, 12, 34, -25), (330, 150, 12, 38, 0), (346, 162, 12, 32, 28)]:
    b += f'<g transform="rotate({rot} {lx} {ly+20})">' + shape(p.ellipse_d(lx, ly, rx, ry), GREEN, (2, 2), 3.2) + '</g>'
# cushions
b += shape(p.rr_d(26, 214, 120, 60, 26), GREEN, (5, 4))
b += ink('M46,232 q30,-8 70,0', 2.8)
b += '<g transform="rotate(-6 210 246)">' + shape(p.rr_d(150, 222, 120, 56, 24), YEL, (5, 4)) + ink('M172,240 q30,-8 68,0', 2.8) + '</g>'
b += shape(p.rr_d(226, 240, 108, 50, 22), RED, (5, 4))
b += ink(p.line_d((10, 292), (370, 292), 5), 4)
save('samedi', 380, 300, b)

# ---- ring yellow / red
for name, col in (('ring_yel', YEL), ('ring_red', RED), ('ring_ink', INK)):
    p = Pen(121 + len(name))
    b = f'<path d="{p.circle_d(120, 120, 108, 14, 2.5)}" fill="none" stroke="{col}" stroke-width="6" stroke-linecap="round"/>'
    b += f'<path d="{p.circle_d(120, 120, 104, 12, 3)}" fill="none" stroke="{col}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>'
    save(name, 240, 240, b)

# ---- underline squiggle
p = Pen(131)
b = f'<path d="M6,14 C50,6 90,16 140,9 S230,15 294,8" fill="none" stroke="{YEL}" stroke-width="9" stroke-linecap="round"/>'
b += f'<path d="M20,20 C70,15 120,22 170,17 S250,20 282,16" fill="none" stroke="{YEL}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>'
save('underline', 300, 28, b, 'none')

# ---- arrow
p = Pen(141)
b = ink('M10,70 C30,20 90,10 140,42', 4.2) + ink('M118,26 L142,44 L114,56', 4.2)
save('arrow', 160, 90, b)

# ---- contact sheet
import glob
names = ['kids_group', 'waffle', 'bowl', 'gloves', 'candy', 'bag', 'sunbottle', 'megaphone', 'huddle', 'plane', 'samedi', 'ring_yel', 'underline', 'arrow']
from PIL import Image
imgs = []
for n in names:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    imgs.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
W = 1500
x = y = 0; rowh = 0
sheet = Image.new('RGB', (W, 1500), '#F2EEE4')
for im in imgs:
    if x + im.width > W:
        x = 0; y += rowh + 20; rowh = 0
    sheet.paste(im, (x, y)); x += im.width + 20; rowh = max(rowh, im.height)
sheet = sheet.crop((0, 0, W, y + rowh + 10))
sheet.save('/tmp/gen/sheet.png')
print(sheet.size)
