import math, sys
sys.path.insert(0, '/tmp/gen')
from doodle import Pen, ink, shape, tube, INK, YEL, RED, WHITE, GREEN, ORANGE, SKINS, svg

BLUE = '#2E3A5C'
DENIM = '#3C4A63'
BLACK = '#1C1B18'
MUSTARD = '#C79A2E'
BRICK = '#A83A28'
CHARCOAL = '#4A4844'
OLIVE = '#5C6B4E'

def teen(p, x, y, s=1.0, skin=SKINS[0], top=INK, bottom='#2B2F3A', shoe=WHITE,
         hair='fade', hair_col=INK, pose='stand', flip=False, accent=RED):
    o = ''
    # legs — longer, leaner than the kid proportions
    o += shape(p.rr_d(-34, -152, 26, 152, 8), bottom, (3, 2))
    o += shape(p.rr_d(8, -152, 26, 152, 8), bottom, (3, 2))
    o += shape(p.cr([(-46, -4), (-44, -18), (-24, -20), (-2, -14), (-2, -2)], True, 1), shoe, (3, 2))
    o += shape(p.cr([(2, -2), (2, -14), (24, -20), (44, -18), (46, -4)], True, 1), shoe, (3, 2))
    o += ink('M-46,-4 l44,0', 3.2) + ink('M2,-4 l44,0', 3.2)  # thick sole line
    # neck
    o += shape(p.rr_d(-9, -292, 18, 22, 5), skin, None)
    # torso — straighter, boxier hoodie/jacket, less rounded than kid torso
    torso = [(-42, -140), (-46, -200), (-38, -252), (-16, -272), (16, -272), (38, -252), (46, -200), (42, -140), (0, -134)]
    o += shape(p.cr(torso, True, 1.4), top, (5, 4))
    o += ink('M-24,-262 Q0,-244 24,-262', 3)
    o += ink('M-6,-250 L-7,-220', 2.6) + ink('M6,-250 L7,-220', 2.6)
    o += ink('M-30,-168 Q0,-158 30,-168', 2.6)

    def arm(p0, p1, p2, sleeve=top, hand_col=None):
        d = 'M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f' % (p0[0], p0[1], p1[0] + p.j(3), p1[1] + p.j(3), p2[0], p2[1])
        s_ = tube(d, sleeve)
        s_ += shape(p.circle_d(p2[0], p2[1], 11), hand_col or skin, None)
        return s_

    prop = ''
    if pose == 'cross':  # arms crossed, confident
        o += arm((-38, -246), (-20, -200), (18, -196))
        o += arm((38, -246), (20, -206), (-16, -202))
    elif pose == 'pocket':  # one hand in pocket, one down
        o += arm((-38, -246), (-44, -190), (-30, -156))
        o += arm((38, -246), (36, -196), (20, -160))
    elif pose == 'spray':  # holding a spray can up, tagging
        o += arm((38, -246), (70, -270), (86, -320))
        prop += shape(p.rr_d(78, -336, 18, 40, 5), RED, (2, 2), 3)
        prop += ink('M84,-336 l0,-10', 2.6)
        o += arm((-38, -246), (-58, -210), (-46, -172))
        o += prop
    elif pose == 'ball':  # foot on ball, arms relaxed
        o += arm((-38, -246), (-56, -204), (-42, -168))
        o += arm((38, -246), (54, -204), (40, -168))
        prop += shape(p.circle_d(26, -20, 24), ORANGE, (2, 2), 3)
        prop += ink('M4,-20 Q26,-30 48,-20', 2.2) + ink('M26,-42 Q18,-20 26,2', 2.2)
        o += prop
    elif pose == 'lean':  # leaning, headphones, hand near ear
        o += arm((38, -246), (54, -220), (44, -260), hand_col=skin)
        o += arm((-38, -246), (-50, -196), (-36, -160))
    elif pose == 'bag':  # tote/rubbish bag in one hand
        o += arm((38, -246), (58, -206), (50, -166))
        o += shape(p.cr([(38, -160), (66, -164), (72, -122), (40, -116)], True, 1.2), GREEN, (2, 2), 3)
        o += arm((-38, -246), (-52, -204), (-40, -168))
    elif pose == 'gloves':  # boxing, guard up
        o += arm((-38, -246), (-66, -232), (-54, -278))
        o += arm((38, -246), (66, -232), (54, -278))
        for side in (-1, 1):
            gx = 54 * side
            o += shape(p.circle_d(gx, -278, 17), RED, (2, 2), 3.2)
            o += ink('M%.1f,%.1f l14,0' % (gx - 7, -278 + 12), 2.4)

    # head — smaller relative to body than the kid figure
    o += shape(p.circle_d(-28, -304, 6), skin, None) + shape(p.circle_d(28, -304, 6), skin, None)
    o += shape(p.circle_d(0, -308, 30, 12, 1), skin, (2, 2))
    # face — flat, unimpressed; no eyebrow flick, no big grin
    o += f'<rect x="-13" y="-309" width="7" height="2.6" rx="1.2" fill="{INK}" transform="rotate(-4 -10 -308)"/>'
    o += f'<rect x="6" y="-309" width="7" height="2.6" rx="1.2" fill="{INK}" transform="rotate(4 10 -308)"/>'
    o += ink('M-7,-297 L7,-296', 2.2)
    # hair — flatter, older styles
    if hair == 'fade':
        o += shape(p.cr([(-33, -312), (-28, -334), (0, -342), (28, -334), (33, -312), (10, -324), (-10, -324)], True, 0.8), hair_col, None, 2.6)
    elif hair == 'hood':
        o += shape(p.cr([(-40, -300), (-38, -332), (0, -348), (38, -332), (40, -300), (46, -256), (30, -238), (-30, -238), (-46, -256)], True, 1.2), top, (3, 3), 3)
        o += shape(p.circle_d(0, -308, 30, 12, 1), skin, None)
        o += f'<rect x="-13" y="-309" width="7" height="2.6" rx="1.2" fill="{INK}" transform="rotate(-4 -10 -308)"/>'
        o += f'<rect x="6" y="-309" width="7" height="2.6" rx="1.2" fill="{INK}" transform="rotate(4 10 -308)"/>'
        o += ink('M-7,-297 L7,-296', 2.2)
    elif hair == 'bun':
        o += shape(p.cr([(-30, -314), (-26, -334), (-4, -342), (18, -338), (30, -320), (30, -312), (6, -322), (-14, -320)], True, 0.8), hair_col, None, 2.6)
        o += shape(p.circle_d(-2, -354, 13), hair_col, None, 2.6)
    elif hair == 'curls':
        for i in range(7):
            t = math.pi + math.pi * (i + 0.5) / 7 + 0.05
            cx, cy = 26 * math.cos(t), -308 + 28 * math.sin(t)
            o += shape(p.circle_d(cx, cy, 11), hair_col, None, 2.4)
    elif hair == 'cap':
        o += shape(p.cr([(-32, -314), (-30, -336), (-12, -350), (14, -352), (32, -338), (34, -314), (0, -318)], True, 0.8), hair_col, (2, 2), 3)
        o += shape(p.rr_d(10, -324, 40, 10, 5), hair_col, (1, 2), 2.6)

    sc = f'scale({-s},{s})' if flip else f'scale({s})'
    return f'<g transform="translate({x},{y}) {sc}">{o}</g>'
