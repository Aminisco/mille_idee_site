from doodle import *
import cairosvg
p = Pen(11)
body = ''
body += bulb(p, 215, 62, 26)
body += bulb(p, 348, 100, 17, False)
body += heart(p, 92, 92, 1.3)
body += kid(p, 92, 440, 1.0, SKINS[1], YEL, '#2B2F3A', WHITE, 'curly', INK, 'cheer')
body += kid(p, 218, 440, 1.06, SKINS[2], WHITE, '#3A4A7A', RED, 'cap', RED, 'ball', True)
body += kid(p, 346, 440, 1.0, SKINS[0], GREEN, '#D9CBA8', WHITE, 'beanie', YEL, 'box')
body += ground(p, 14, 424, 446)
open('/tmp/gen/svg/kids_group.svg', 'w').write(svg(440, 470, body))
cairosvg.svg2png(url='/tmp/gen/svg/kids_group.svg', write_to='/tmp/gen/kids.png', scale=1.6, background_color='#F2EEE4')
