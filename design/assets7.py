# Thermos fumant pour la Première maraude (novembre), même vocabulaire que bowl/waffle
from doodle import *
import sys

OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/gen/svg/'

def save(name, w, h, body):
    open(OUT + name + '.svg', 'w').write(svg(w, h, body))

p = Pen(71)
b = ''
# vapeur au-dessus du gobelet
for x in (128, 150):
    b += ink('M%d,104 q8,-11 0,-22 q-8,-11 0,-22' % x, 3.2)
# corps du thermos
body = p.rr_d(46, 46, 60, 120, 14)
b += shape(body, RED, (5, 4))
b += shape(p.rr_d(46, 92, 60, 22, 4, 0.8), WHITE, (0, 0), 3.2)
# col et bouchon
b += shape(p.rr_d(54, 30, 44, 20, 6), BLUE, (3, 3), 3.4)
b += shape(p.rr_d(60, 16, 32, 16, 6), BLUE, (3, 3), 3.4)
# petit reflet
b += ink(p.line_d((58, 128), (58, 152), 1.5), 3, extra='stroke-opacity="0.9"').replace(INK, WHITE)
# gobelet (le bouchon qui sert de tasse)
cup = p.cr([(116, 112), (164, 112), (158, 160), (122, 160)], True, 1.0)
b += shape(cup, YEL, (4, 3))
b += shape(p.ellipse_d(140, 112, 24, 6), WHITE, (0, 0), 3.2)
b += ink(p.line_d((120, 128), (160, 128), 1.5), 2.8)
# sol et cœur
b += ink(p.line_d((30, 170), (176, 170), 3), 4)
b += heart(p, 174, 40, 0.9)
save('thermos', 200, 180, b)
