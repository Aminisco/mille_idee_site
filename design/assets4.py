from doodle import *
import cairosvg, math
OUT = '/tmp/gen/svg/'
def save(name, w, h, body, preserve=None):
    x = svg(w, h, body)
    if preserve:
        x = x.replace('<svg ', f'<svg preserveAspectRatio="{preserve}" ', 1)
    open(OUT + name + '.svg', 'w').write(x)

BROWN = '#8A5A3C'
LEAF = '#5DA57A'
def sun(p, cx, cy, r=26):
    o = shape(p.circle_d(cx, cy, r), YEL, (3, 3))
    for i in range(10):
        t = math.radians(i * 36 + 8)
        o += ink(p.line_d((cx + (r + 9) * math.cos(t), cy + (r + 9) * math.sin(t)), (cx + (r + 22) * math.cos(t), cy + (r + 22) * math.sin(t)), 1.5), 3.6)
    return o

def tree(p, x, gy):
    o = shape(p.rr_d(x - 13, gy - 130, 26, 130, 8), BROWN, (3, 3))
    o += ink(f'M{x},{gy-70} l-14,-24', 3) + ink(f'M{x},{gy-84} l14,-22', 3)
    for cx, cy, r in ((x - 26, gy - 150, 34), (x + 26, gy - 152, 34), (x, gy - 182, 40)):
        o += shape(p.circle_d(cx, cy, r, 12), LEAF, (3, 3), 3.4)
    return o

def scene_sport(p, ox):
    o = ''
    o += kid(p, ox + 84, 322, 0.62, SKINS[3], BLUE, '#2B2F3A', WHITE, 'buzz', INK, 'box')
    o += kid(p, ox + 206, 322, 0.62, SKINS[0], YEL, '#D9CBA8', RED, 'cap', RED, 'box', True)
    for a, b in (((146, 150), (140, 138)), ((152, 156), (156, 144)), ((146, 160), (138, 164))):
        o += ink(f'M{ox+a[0]},{a[1]} L{ox+b[0]},{b[1]}', 3.2)
    o += ink(f'M{ox+282},14 L{ox+282},98', 3.6)
    o += shape(p.rr_d(ox + 262, 98, 40, 100, 16), RED, (4, 4))
    o += ink(f'M{ox+263},122 q19,8 38,0', 3) + ink(f'M{ox+263},176 q19,8 38,0', 3)
    return o

def scene_art(p, ox):
    o = ''
    o += shape(p.rr_d(ox + 168, 44, 132, 268, 10), '#EFE6CF', (4, 4))
    o += shape(p.circle_d(ox + 214, 108, 26), YEL, (3, 3), 3.4)
    o += shape(p.cr([(ox + 236, 190), (ox + 286, 190), (ox + 262, 146)], True, 0.6), RED, (3, 3), 3.4)
    o += f'<path d="M{ox+176},250 q22,-24 44,0 t44,0 t30,-6" fill="none" stroke="{GREEN}" stroke-width="9" stroke-linecap="round"/>'
    o += ink(f'M{ox+184},92 q10,30 6,60', 2.8)
    o += kid(p, ox + 84, 322, 0.62, SKINS[1], '#F0A6B8', '#2B2F3A', WHITE, 'long', INK, 'paint', False, RED)
    o += shape(p.rr_d(ox + 128, 292, 30, 30, 5), YEL, (2, 2), 3.2) + ink(f'M{ox+132},292 q11,-16 22,0', 3)
    return o

def scene_maraude(p, ox):
    o = sun(p, ox + 262, 62, 24)
    o += kid(p, ox + 88, 322, 0.62, SKINS[2], ORANGE, '#3A4A7A', WHITE, 'curly', INK, 'carry')
    o += kid(p, ox + 212, 322, 0.62, SKINS[0], RED, '#2B2F3A', WHITE, 'scarf', BLUE, 'wave', True)
    return o

def scene_citoyen(p, ox):
    o = tree(p, ox + 244, 322)
    o += kid(p, ox + 100, 322, 0.62, SKINS[2], WHITE, '#3A4A7A', RED, 'long', '#6B4429', 'picker')
    o += shape(p.rr_d(ox + 160, 306, 12, 18, 3), '#BFE0F0', (1, 1), 3) + shape(p.circle_d(ox + 186, 314, 8), WHITE, (1, 1), 3)
    return o

p = Pen(201)
body = ''
body += scene_sport(p, 0) + scene_art(p, 312) + scene_maraude(p, 624) + scene_citoyen(p, 936)
body += ground(p, 6, 1242, 326)
save('panorama', 1248, 350, body)

# ---- contact scene
p = Pen(211)
b = bubble(p, 40, 30, 120, 62, 'left')
b += heart(p, 100, 62, 1.25)
b += kid(p, 96, 436, 0.92, SKINS[1], YEL, '#2B2F3A', WHITE, 'curly', INK, 'wave')
b += kid(p, 236, 436, 0.92, SKINS[2], GREEN, '#D9CBA8', RED, 'scarf', RED, 'wave', True)
b += ground(p, 8, 330, 442)
save('scene_contact', 340, 460, b)

# ---- peek strip (heads over the top edge of the dark band)
p = Pen(221)
b = ''
spec = [
 (70, SKINS[2], RED, 'cap', INK, 'wave', False, 0.86),
 (190, SKINS[1], YEL, 'curly', INK, 'wave', True, 0.9),
 (310, SKINS[0], GREEN, 'scarf', '#3A4A7A', 'cheer', False, 0.84),
 (430, SKINS[3], WHITE, 'beanie', RED, 'wave', False, 0.9),
 (548, SKINS[2], BLUE, 'long', '#6B4429', 'cheer', True, 0.86),
]
for x, sk, top, hair, hc, pose, fl, sc in spec:
    b += kid(p, x, 354 * sc + 14, sc, sk, top, '#2B2F3A', WHITE, hair, hc, pose, fl)
save('peek', 620, 150, b)

# ---- icons
p = Pen(231)
b = shape(p.cr([(36, 78), (64, 78), (60, 100), (40, 100)], True, 0.8), ORANGE, (2, 2), 3.4)
b += ink('M50,78 L50,44', 4)
b += shape(p.cr([(50, 56), (26, 50), (24, 30), (46, 36)], True, 0.8), LEAF, (2, 2), 3.4)
b += shape(p.cr([(50, 46), (74, 38), (78, 18), (54, 24)], True, 0.8), LEAF, (2, 2), 3.4)
save('icon_sprout', 100, 110, b)
p = Pen(232)
b = shape(p.rr_d(18, 14, 64, 88, 6), '#FFF0B0', (3, 3), 3.6)
b += shape(p.cr([(34, 20), (76, 14), (76, 96), (34, 100)], True, 0.5), RED, (3, 3), 3.4)
b += f'<circle cx="68" cy="58" r="4" fill="{INK}"/>'
save('icon_door', 100, 110, b)
p = Pen(233)
b = bulb(p, 50, 44, 26, False)
b += ink('M30,90 q20,14 40,0', 3.6)
save('icon_bulb', 100, 110, b)
p = Pen(234)
b = shape(p.cr([(8, 104), (10, 78), (30, 66), (52, 78), (54, 104)], True, 1.2), YEL, (3, 3), 3.4)
b += shape(p.circle_d(30, 46, 17, 10), SKINS[1], (2, 2), 3.4)
b += shape(p.cr([(50, 104), (54, 84), (70, 76), (88, 84), (92, 104)], True, 1.2), RED, (3, 3), 3.4)
b += shape(p.circle_d(70, 60, 14, 10), SKINS[2], (2, 2), 3.4)
b += ink('M52,90 q6,-8 12,-2', 3)
save('icon_hands', 100, 110, b)

from PIL import Image
names = ['panorama', 'scene_contact', 'peek']
imgs = []
for n in names:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    imgs.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
ic = []
for n in ['icon_sprout', 'icon_door', 'icon_bulb', 'icon_hands']:
    cairosvg.svg2png(url=OUT + n + '.svg', write_to=f'/tmp/gen/{n}.png', scale=1.0, background_color='#F2EEE4')
    ic.append(Image.open(f'/tmp/gen/{n}.png').convert('RGB'))
W = 1260
H = imgs[0].height + max(imgs[1].height, 200) + 20
sheet = Image.new('RGB', (W, H), '#F2EEE4')
sheet.paste(imgs[0], (0, 0))
sheet.paste(imgs[1], (0, imgs[0].height + 10))
sheet.paste(imgs[2], (360, imgs[0].height + 10))
x = 360
for i in ic:
    sheet.paste(i, (x, imgs[0].height + 210)) if imgs[0].height + 210 + 110 <= H else None
    x += 110
sheet.save('/tmp/gen/sheet3.png')
print(sheet.size)
