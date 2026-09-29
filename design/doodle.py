import math, random

INK = '#14130F'
YEL = '#F2C200'
RED = '#D8261C'
WHITE = '#FFFDF7'
GREEN = '#3E8E6A'
ORANGE = '#E8590C'
BLUE = '#3A4A7A'
SKINS = ['#C98B5B', '#8A5A3C', '#E9BC94', '#6B4429']

class Pen:
    def __init__(self, seed=3):
        self.r = random.Random(seed)

    def j(self, a):
        return self.r.uniform(-a, a)

    def wob(self, pts, a=1.6):
        return [(x + self.j(a), y + self.j(a)) for x, y in pts]

    def cr(self, pts, closed=True, a=1.4):
        pts = self.wob(pts, a)
        n = len(pts)
        d = 'M%.1f,%.1f' % pts[0]
        rng = range(n) if closed else range(n - 1)
        for i in rng:
            p0 = pts[(i - 1) % n] if (closed or i > 0) else pts[i]
            p1 = pts[i]
            p2 = pts[(i + 1) % n]
            p3 = pts[(i + 2) % n] if (closed or i + 2 < n) else p2
            c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
            c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
            d += ' C%.1f,%.1f %.1f,%.1f %.1f,%.1f' % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
        if closed:
            d += ' Z'
        return d

    def circle_d(self, cx, cy, r, n=10, a=None):
        a = r * 0.03 if a is None else a
        pts = []
        off = self.j(0.4)
        for i in range(n):
            t = off + 2 * math.pi * i / n
            rr = r + self.j(a)
            pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
        return self.cr(pts, True, 0)

    def ellipse_d(self, cx, cy, rx, ry, n=10, rot=0):
        pts = []
        for i in range(n):
            t = 2 * math.pi * i / n
            x, y = rx * math.cos(t), ry * math.sin(t)
            xr = x * math.cos(rot) - y * math.sin(rot)
            yr = x * math.sin(rot) + y * math.cos(rot)
            pts.append((cx + xr + self.j(rx * 0.02), cy + yr + self.j(ry * 0.02)))
        return self.cr(pts, True, 0)

    def rr_d(self, x, y, w, h, r, a=1.2):
        pts = [(x + r, y), (x + w / 2, y), (x + w - r, y),
               (x + w, y + r), (x + w, y + h / 2), (x + w, y + h - r),
               (x + w - r, y + h), (x + w / 2, y + h), (x + r, y + h),
               (x, y + h - r), (x, y + h / 2), (x, y + r)]
        return self.cr(pts, True, a)

    def line_d(self, p0, p1, bend=3):
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        b = self.j(bend)
        return 'M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f' % (p0[0], p0[1], mx + nx * b, my + ny * b, p1[0], p1[1])

def ink(d, w=3.6, fill='none', extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'

def shape(d, fill, off=(4, 3), w=3.6):
    s = ''
    if off:
        s += f'<path d="{d}" fill="{fill}" transform="translate({off[0]},{off[1]})"/>'
        s += ink(d, w)
    else:
        s += ink(d, w, fill)
    return s

def tube(d, col, w=17, ow=24):
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{ow}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def svg(w, h, body, vb=None):
    vb = vb or f'0 0 {w} {h}'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{body}</svg>'

# ---------------------------------------------------------------- KID
def kid(p, x, y, s=1.0, skin=SKINS[0], top=YEL, pants='#2B2F3A', shoe=WHITE,
        hair='curly', hair_col=INK, pose='cheer', flip=False, prop_col=RED):
    o = ''
    # legs
    o += shape(p.rr_d(-38, -138, 30, 126, 10), pants, (3, 2))
    o += shape(p.rr_d(8, -138, 30, 126, 10), pants, (3, 2))
    o += shape(p.ellipse_d(-26, -8, 28, 13), shoe, (3, 2))
    o += shape(p.ellipse_d(26, -8, 28, 13), shoe, (3, 2))
    if hair == 'long':
        o += shape(p.cr([(-44, -300), (-51, -262), (-42, -230), (42, -230), (51, -262), (44, -300), (0, -348)], True, 1.2), hair_col, (3, 3), 3.4)
    # neck
    o += shape(p.rr_d(-11, -268, 22, 26, 6), skin, None)
    # arms behind torso for down-poses drawn later; torso
    torso = [(-48, -128), (-54, -190), (-42, -240), (-14, -258), (14, -258), (42, -240), (54, -190), (48, -128), (0, -122)]
    o += shape(p.cr(torso, True, 1.6), top, (5, 4))
    # hoodie details
    o += ink(p.line_d((-26, -252), (26, -252), 8) if False else 'M-27,-250 Q0,-228 27,-250', 3.2)
    o += ink('M-9,-238 L-10,-212', 3)
    o += ink('M9,-238 L10,-212', 3)
    o += ink('M-32,-158 Q0,-146 32,-158', 3)
    # arms
    def arm(p0, p1, p2, hand='skin', glove=False):
        d = 'M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f' % (p0[0], p0[1], p1[0] + p.j(3), p1[1] + p.j(3), p2[0], p2[1])
        s_ = tube(d, top)
        if glove:
            s_ += shape(p.circle_d(p2[0], p2[1], 21), RED, (3, 3))
            s_ += ink('M%.1f,%.1f q8,-3 14,6' % (p2[0] - 8, p2[1] - 6), 2.6)
            s_ += ink('M%.1f,%.1f l20,0' % (p2[0] - 10, p2[1] + 16), 3)
        else:
            s_ += shape(p.circle_d(p2[0], p2[1], 12), skin, None)
        return s_
    prop = ''
    if pose == 'cheer':
        o += arm((-42, -232), (-90, -246), (-98, -318))
        o += arm((42, -232), (90, -246), (98, -318))
    elif pose == 'ball':
        o += arm((-42, -232), (-66, -196), (-58, -160))
        o += arm((42, -232), (84, -206), (74, -168))
        prop = shape(p.circle_d(84, -150, 27), ORANGE, (3, 3))
        prop += ink('M57,-150 Q84,-160 111,-150', 2.6) + ink('M84,-177 Q76,-150 84,-123', 2.6)
        o += prop
    elif pose == 'box':
        o += arm((-42, -232), (-92, -222), (-80, -268), glove=True)
        o += arm((42, -232), (92, -222), (80, -268), glove=True)
    elif pose == 'wave':
        o += arm((-42, -232), (-64, -196), (-54, -158))
        o += arm((42, -232), (92, -250), (98, -318))
    elif pose == 'hips':
        o += arm((-42, -232), (-86, -206), (-58, -168))
        o += arm((42, -232), (86, -206), (58, -168))
    elif pose == 'paint':
        o += arm((-42, -232), (-78, -204), (-58, -168))
        o += ink('M108,-312 L148,-372', 6)
        o += shape(p.ellipse_d(152, -378, 10, 16, 8, 0.5), prop_col, (2, 2), 3.2)
        o += arm((42, -232), (98, -258), (108, -312))
    elif pose == 'picker':
        o += ink('M94,-252 L82,-8', 6)
        o += ink('M82,-8 q-12,4 -16,-8', 4) + ink('M82,-8 q12,4 16,-8', 4)
        o += arm((-42, -232), (-74, -198), (-66, -154))
        o += shape(p.cr([(-86, -148), (-94, -112), (-80, -84), (-52, -86), (-42, -112), (-50, -146)], True, 1.2), GREEN, (3, 3), 3.4)
        o += ink('M-70,-150 q6,-10 12,0', 3)
        o += arm((42, -232), (90, -214), (86, -182))
    elif pose == 'carry':
        o += arm((-42, -232), (-74, -204), (-48, -176))
        o += arm((42, -232), (74, -204), (48, -176))
        o += shape(p.rr_d(-40, -198, 80, 54, 6), '#C99A5B', (3, 3), 3.4)
        o += ink('M0,-198 L0,-144', 3)
        o += shape(p.ellipse_d(-14, -206, 17, 9), '#E0B36A', (2, 2), 3)
        o += shape(p.circle_d(18, -208, 9), RED, (2, 2), 3)
    # head
    if hair == 'scarf':
        o += shape(p.cr([(-47, -296), (-45, -332), (0, -350), (45, -332), (47, -296), (54, -250), (30, -234), (-30, -234), (-54, -250)], True, 1.2), hair_col, (3, 3), 3.4)
        o += shape(p.ellipse_d(0, -293, 33, 38), skin, None)
    else:
        o += shape(p.circle_d(-38, -292, 8), skin, None) + shape(p.circle_d(38, -292, 8), skin, None)
        o += shape(p.circle_d(0, -296, 39, 12, 1.2), skin, (3, 3))
    # face
    o += f'<circle cx="-13" cy="-298" r="3.6" fill="{INK}"/><circle cx="13" cy="-298" r="3.6" fill="{INK}"/>'
    o += ink('M-11,-280 Q0,-269 11,-280', 3)
    o += ink('M1,-294 Q-4,-286 1,-285', 2.4)
    # hair
    if hair == 'curly':
        for i in range(9):
            t = math.pi + math.pi * (i + 0.5) / 9 + 0.05
            cx, cy = 34 * math.cos(t), -296 + 36 * math.sin(t)
            o += shape(p.circle_d(cx, cy, 15), hair_col, None, 3)
        o += shape(p.circle_d(0, -334, 17), hair_col, None, 3)
    elif hair == 'cap':
        dome = [(-42, -302), (-38, -326), (-18, -342), (12, -344), (34, -330), (42, -304), (0, -308)]
        o += shape(p.cr(dome, True, 1), hair_col, (3, 3))
        o += shape(p.rr_d(14, -314, 56, 13, 6), hair_col, (2, 3), 3.2)
    elif hair == 'beanie':
        dome = [(-44, -312), (-40, -336), (-20, -352), (10, -354), (34, -340), (45, -314), (0, -306)]
        o += shape(p.cr(dome, True, 1), hair_col, (3, 3))
        o += shape(p.rr_d(-46, -326, 92, 22, 8), hair_col, (2, 3), 3.4)
        o += ink('M-30,-322 L-30,-307', 2.4) + ink('M-10,-323 L-10,-306', 2.4) + ink('M10,-323 L10,-306', 2.4) + ink('M30,-322 L30,-307', 2.4)
    elif hair == 'long':
        o += shape(p.cr([(-40, -304), (-32, -336), (0, -344), (32, -336), (40, -304), (16, -322), (-14, -318)], True, 1), hair_col, None, 3)
    elif hair == 'bun':
        o += shape(p.cr([(-38, -306), (-34, -330), (-10, -340), (18, -338), (36, -324), (39, -306), (10, -318), (-14, -318)], True, 1), hair_col, None, 3)
        o += shape(p.circle_d(0, -352, 16), hair_col, None, 3)
    elif hair == 'buzz':
        dome = [(-38, -306), (-34, -330), (-10, -340), (18, -338), (36, -324), (39, -306), (10, -318), (-14, -318)]
        o += shape(p.cr(dome, True, 1), hair_col, None, 3)
    sc = f'scale({-s},{s})' if flip else f'scale({s})'
    return f'<g transform="translate({x},{y}) {sc}">{o}</g>'

def bulb(p, cx, cy, r=26, rays=True):
    o = shape(p.circle_d(cx, cy, r, 10), YEL, (3, 3), 3.4)
    o += shape(p.rr_d(cx - 12, cy + r - 3, 24, 16, 5), WHITE, (2, 2), 3.2)
    o += ink('M%.1f,%.1f q6,-14 6,-6 q0,8 6,-6' % (cx - 8, cy + 4), 2.6)
    if rays:
        for a in (-150, -120, -90, -60, -30):
            t = math.radians(a)
            o += ink(p.line_d((cx + (r + 10) * math.cos(t), cy + (r + 10) * math.sin(t)), (cx + (r + 24) * math.cos(t), cy + (r + 24) * math.sin(t)), 1.5), 3.2)
    return o

def heart(p, cx, cy, s=1, col=RED):
    d = p.cr([(0, 10), (-14, -2), (-12, -14), (0, -10), (12, -14), (14, -2)], True, 0.8)
    return f'<g transform="translate({cx},{cy}) scale({s})">' + shape(d, col, (2, 2), 3.2) + '</g>'

def bubble(p, x, y, w, h, tail='left'):
    d = p.rr_d(x, y, w, h, h / 2.4)
    o = shape(d, WHITE, (3, 3), 3.4)
    tx = x + 24 if tail == 'left' else x + w - 24
    o += f'<path d="M{tx},{y+h-2} l{-10 if tail=="left" else 10},18 l22,-14" fill="{WHITE}" stroke="{INK}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>'
    return o

def ground(p, x0, x1, y):
    o = ink(p.line_d((x0, y), (x1, y), 5), 4)
    for i in range(6):
        xx = x0 + 30 + i * (x1 - x0 - 60) / 5 + p.j(8)
        o += ink(p.line_d((xx, y + 8), (xx - 10, y + 16), 2), 2.6)
    return o
