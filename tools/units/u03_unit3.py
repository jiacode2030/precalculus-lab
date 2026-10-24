# Unit 3: Trigonometric and polar functions. Batch 1: unitcircle, sinusoid, polarcoord, polargraph, polarroc.
import math
PI = math.pi

def pfrac(k, d):
    """k·π/d as text: pfrac(5,6) -> '5π/6'."""
    from math import gcd
    if k == 0: return '0'
    g = gcd(abs(k), d); k //= g; d //= g
    s = ('−' if k < 0 else '') + ('' if abs(k) == 1 else str(abs(k))) + 'π'
    return s if d == 1 else s + '/' + str(d)

def exact(v):
    for t, s in ((0, '0'), (.5, '1/2'), (1, '1'), (math.sqrt(2) / 2, '√2/2'), (math.sqrt(3) / 2, '√3/2'), (math.sqrt(3), '√3'), (math.sqrt(3) / 3, '√3/3')):
        if abs(abs(v) - t) < 1e-9: return ('−' if v < 0 and t else '') + s
    return f'{v:.3f}'

# ---------- figure helpers: a unit circle and a polar grid in a 260-wide box ----------
def ucircle(cx=130, cy=112, R=86, ticks=True):
    o = arr(cx - R - 18, cy, cx + R + 22, cy, 'mut', '', 1.3) + arr(cx, cy + R + 16, cx, cy - R - 20, 'mut', '', 1.3)
    o += f'<circle cx="{cx}" cy="{cy}" r="{R}" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>'
    if ticks:
        o += txt(cx + R + 4, cy - 6, '1', 'mut', 10, 'start', 500, True) + txt(cx + 5, cy - R - 4, '1', 'mut', 10, 'start', 500, True)
    return o

def anglearc(cx, cy, r, a0, a1, c='area', w=2.4):
    """arc from angle a0 to a1 (radians, counterclockwise, math orientation)"""
    k = max(8, int(abs(a1 - a0) * 12)); pts = [(cx + r * math.cos(a0 + (a1 - a0) * i / k), cy - r * math.sin(a0 + (a1 - a0) * i / k)) for i in range(k + 1)]
    return pline(pts, c, w)

def pgrid(cx, cy, R, rings=4, rays=12):
    o = ''.join(f'<circle cx="{cx}" cy="{cy}" r="{R * i / rings:.1f}" style="fill:none;stroke:var(--line);stroke-width:1"/>' for i in range(1, rings + 1))
    o += ''.join(ln(cx, cy, cx + R * math.cos(2 * PI * k / rays), cy - R * math.sin(2 * PI * k / rays), 'line', 1) for k in range(rays))
    return o

def pcurve(f, cx, cy, s, a=0, b=2 * PI, k=360, c='f', w=2.4, dash=''):
    pts = []
    for i in range(k + 1):
        t = a + (b - a) * i / k; r = f(t); pts.append((cx + s * r * math.cos(t), cy - s * r * math.sin(t)))
    return pline(pts, c, w, dash)

def rgraph(f, a=0, b=2 * PI, yr=(-3, 3), c='f', xl='θ', yl='r', box=(30, 14, 214, 112), k=160):
    P = Plot((a, b), yr, box)
    o = P.axes([], [], xl, yl)
    for m in range(1, 5):
        t = a + (b - a) * m / 4; o += ln(P.X(t), P.Y(0) - 3, P.X(t), P.Y(0) + 3, 'mut', 1.2) + txt(P.X(t), P.Y(0) + 13, ['π/2', 'π', '3π/2', '2π'][m - 1] if b == 2 * PI else '', 'mut', 9, mono=True, w=500)
    for v in (yr[0], yr[1]):
        if v: o += txt(P.X(a) - 5, P.Y(v) + 3.5, str(v).replace('-', '−'), 'mut', 9, 'end', mono=True, w=500)
    o += P.curve(f, a, b, c, 2.4, '', k)
    return P, o

def svg(body, h=230, label=''):
    return f'<svg viewBox="0 0 260 {h}" role="img" aria-label="{label}">{body}</svg>'

# =====================================================================
# 3.2–3.3  Sine, cosine & the unit circle
# =====================================================================
def _uc_fig():
    cx, cy, R = 120, 118, 84; th = 5 * PI / 6; px, py = cx + R * math.cos(th), cy - R * math.sin(th)
    base = ucircle(cx, cy, R) + txt(cx + R + 4, cy + 14, '0.35 m', 'mut', 10, 'start', 500, True) + circ(cx, cy, 4, 'ink') + txt(cx + 8, cy + 14, 'hub', 'mut', 10, 'start', 500)
    base += dot(cx + R, cy, '', 'mut', r=3.5) + txt(cx + R - 4, cy - 8, 'start', 'mut', 10, 'end', 500)
    L = [(1, ln(cx, cy, px, py, 'ink', 2) + anglearc(cx, cy, 22, 0, th) + txt(cx + 26, cy - 24, '150°', 'area', 11, 'start'), '150° = 5π/6', 'area'),
         (2, ln(px, py, px, cy, 'f', 3.4) + txt(px - 6, (py + cy) / 2 + 4, 'y', 'f', 12, 'end'), 'y = 0.35 sin 150°', 'f'),
         (2, ln(cx, cy, px, cy, 'dd', 3.4) + txt((cx + px) / 2, cy + 16, 'x', 'dd', 12), 'x = 0.35 cos 150°', 'dd'),
         (3, dot(px, py, '', 'tan', r=6) + txt(6, 16, 'valve (−0.303, 0.175)', 'tan', 11, 'start'), 'valve at (−0.303, 0.175) m', 'tan'),
         (4, anglearc(cx, cy, R + 7, 0, th, 'tan', 3), 'arc s = rθ ≈ 0.916 m', 'tan')]
    return fig(base, L, 'The valve starts at 3 o\'clock and the wheel turns 150° counterclockwise about the hub.', 240)

def _uc_fig2():
    cx, cy, R = 130, 112, 84; th = 4 * PI / 3; px, py = cx + R * math.cos(th), cy - R * math.sin(th)
    base = ucircle(cx, cy, R)
    L = [(1, ln(cx, cy, px, py, 'ink', 2) + anglearc(cx, cy, 20, 0, th) + txt(cx + 24, cy - 20, '4π/3', 'area', 11, 'start'), '4π/3 is in quadrant III', 'area'),
         (2, anglearc(cx, cy, 36, PI, th, 'tan', 3) + txt(cx - 46, cy + 30, 'π/3', 'tan', 11), 'reference angle π/3', 'tan'),
         (3, ln(px, py, px, cy, 'f', 3.4) + ln(cx, cy, px, cy, 'dd', 3.4) + txt(px - 6, (py + cy) / 2 + 4, '√3/2', 'f', 11, 'end') + txt((cx + px) / 2, cy - 6, '1/2', 'dd', 11), 'sides 1/2 and √3/2', 'f'),
         (4, dot(px, py, '', 'tan', r=6) + txt(px + 4, py + 18, '(−1/2, −√3/2)', 'tan', 11, 'middle'), 'both coordinates negative', 'tan')]
    return fig(base, L, 'The angle 4π/3, its reference angle, and the point on the unit circle.', 228)

def _uc_drill():
    cases = []
    spec = [(5, 6, 'sin'), (3, 4, 'cos'), (4, 3, 'sin'), (7, 4, 'cos'), (2, 3, 'cos'), (11, 6, 'sin'), (7, 6, 'cos'), (5, 3, 'sin'), (3, 2, 'cos'), (5, 4, 'tan'), (-1, 6, 'sin'), (9, 4, 'sin')]
    for k, d, fn in spec:
        th = k * PI / d; c, s = math.cos(th), math.sin(th)
        val = {'sin': s, 'cos': c, 'tan': s / c if abs(c) > 1e-12 else None}[fn]
        right = exact(val)
        # distractors: wrong sign, the other coordinate, and its negative
        other = exact(c if fn == 'sin' else s) if fn != 'tan' else exact(c / s) if abs(s) > 1e-12 else '0'
        opts = [right]
        for o in [exact(-val) if val else '1', other, ('−' + other if not other.startswith('−') else other[1:]) if other != '0' else '−1']:
            if o not in opts and len(opts) < 3: opts.append(o)
        if len(opts) < 3: opts.append('0' if '0' not in opts else '1')
        # deterministic shuffle so the answer is not always first
        rot = (k + d) % 3; opts = opts[rot:] + opts[:rot]; corr = opts.index(right)
        cx, cy, R = 130, 104, 70; px, py = cx + R * c, cy - R * s
        b = ucircle(cx, cy, R, False) + anglearc(cx, cy, 18, 0, th) + ln(cx, cy, px, py, 'ink', 2) + dot(px, py, '', 'tan', r=5.5) + txt(14, 20, f'θ = {pfrac(k, d)}', 'area', 13, 'start')
        ref = math.atan2(abs(s), abs(c))
        a = b + ln(px, py, px, cy, 'f', 3.2) + ln(cx, cy, px, cy, 'dd', 3.2) + txt(px + (8 if c >= 0 else -8), (py + cy) / 2 + 4, exact(s), 'f', 11, 'start' if c >= 0 else 'end') + txt((cx + px) / 2, cy + (14 if s >= 0 else -6), exact(c), 'dd', 11)
        a += txt(246, 20, f'({exact(c)}, {exact(s)})', 'tan', 12, 'end')
        q = f'{fn}({pfrac(k, d)}) = ?'
        refd = round(ref / PI * 180)
        quad = 'on an axis' if abs(c) < 1e-9 or abs(s) < 1e-9 else ['quadrant I', 'quadrant II', 'quadrant III', 'quadrant IV'][(0 if c > 0 and s > 0 else 1 if c < 0 and s > 0 else 2 if c < 0 else 3)]
        why = (f'The angle lands {quad}. ' + (f'Reference angle {refd}°, so the sizes are the quadrant I values; the signs come from the quadrant. ' if quad != 'on an axis' else '') +
               f'The point is ({exact(c)}, {exact(s)}), so {fn}({pfrac(k, d)}) = <b>{right}</b>' + (' (sin ÷ cos).' if fn == 'tan' else '.'))
        cases.append((q, svg(b, 200, f'Unit circle with the angle {pfrac(k, d)}'), svg(a, 200, f'Unit circle with the angle {pfrac(k, d)} and its coordinates'), opts, corr, why))
    return drill('Read the circle: 12 exact values', 'Find the point first, then read the coordinate. The picture adds the triangle once you choose.', cases, 'uc-drill')

mod('unitcircle', 'Sine, cosine & the unit circle',
 'An angle is a rotation. Turn a point around a circle of radius 1: its x-coordinate is the cosine and its y-coordinate is the sine.',
 ['Start at the point (1, 0) and rotate counterclockwise by an angle θ. Wherever you land on the <b>unit circle</b> (radius 1), the point is <span class="m">(cos θ, sin θ)</span>. That is the definition: no right triangle needed, so θ can be 125°, −30° or 7π.',
  'Angles are measured in <b>radians</b>: the length of arc the angle cuts on the unit circle. A full turn is 2π (about 6.28) radians, so <span class="m">180° = π</span>. On a circle of radius r the arc is r times longer: <span class="m">s = rθ</span>.',
  'Every angle has a <b>reference angle</b>: the acute angle to the x-axis. The reference angle sets the sizes of sin and cos; the quadrant sets their signs. Learn quadrant I (0, π/6, π/4, π/3, π/2) and you know the whole circle.'],
 ('angles were between 0° and 90°, and sine and cosine were ratios of sides in a right triangle', 'angles bigger than 90° or negative angles, or any picture of what sine does as the angle keeps growing', 'sine and cosine are the coordinates of a point moving around a circle, so they repeat and can be negative', 'radians, the unit circle and the signs of sine, cosine and tangent in each quadrant'),
 [('point = (cos θ, sin θ)', 'on the unit circle'), ('tan θ = sin θ / cos θ', 'slope of the radius'), ('radians = degrees × π/180', '180° = π'), ('sin²θ + cos²θ = 1', 'the point is on the circle'), ('s = rθ', 'arc length, θ in radians')],
 [lab('uc-lab', 'Spin the unit circle', canvas='uc-canvas', aria='Unit circle with a draggable point; the sine and cosine segments, the angle arc and the tangent line are drawn, with the unrolled sine and cosine graphs to the right.',
   seg=('uc-snap', 'Snap to special angles', [('on', 'on'), ('off', 'off')]),
   pre='<div class="row"><button type="button" class="btn primary" id="uc-spin">Spin</button><button type="button" class="btn" id="uc-tan">Hide tangent</button></div>',
   ctl=[('uc-ang', 'Angle (degrees)', -360, 720, 1, 125)],
   out=[('uc-rad', 'radians', 'x'), ('uc-sin', 'sin θ', 'x'), ('uc-cos', 'cos θ', 'a'), ('uc-tanv', 'tan θ', 'v'), ('uc-q', 'quadrant · reference angle', '')]),
  lab('uc-lab2', 'Any circle: same angle, scaled point', canvas='uc-canvas2', aria='A circle of adjustable radius with a point at angle θ; the arc length and the coordinates are labeled.',
   ctl=[('uc-r', 'Radius r', .5, 3, .1, 2), ('uc-th2', 'Angle θ (radians)', 0, 6.28, .01, 1)],
   out=[('uc-pt', 'point (r cos θ, r sin θ)', 'x'), ('uc-arc', 'arc length s = rθ', 'v'), ('uc-ratio', 'y / r', 'x')])],
 [('Set the angle to 125°. Which coordinate is negative, and why does the tangent come out negative? ' , show(['#uc-ang', 125]), 'The point is in quadrant II: x = cos 125° ≈ −0.574 is negative and y = sin 125° ≈ 0.819 is positive. tan = sin/cos ≈ −1.428, negative because the signs differ: the radius slopes down to the right.'),
  ('Turn snapping on and step through 30°, 150°, 210° and 330°. What stays the same, and what changes?', show(['click', '#uc-snap [data-k=on]'], ['#uc-ang', 150]), 'All four have reference angle 30°, so |sin| = 1/2 and |cos| = √3/2 every time. Only the signs change: (+,+) in I, (−,+) in II, (−,−) in III and (+,−) in IV.'),
  ('Slide to 90°. What happens to tan θ, and what does the orange tangent line do?', show(['#uc-ang', 90]), 'cos 90° = 0, so tan 90° = 1/0 is undefined. The radius is vertical, and the line through it never meets the vertical line x = 1: the tangent segment runs off to infinity.'),
  ('Set 30°, then 390°, then −330°. Compare the points.', show(['#uc-ang', 390]), 'All three are the same point (√3/2, 1/2). Angles that differ by a full turn (360° = 2π) are coterminal, which is why sine and cosine repeat with period 2π.'),
  ('In the second lab, keep θ = 1 and drag the radius from 1 to 3. What happens to the arc length and to y/r?', show(['#uc-th2', 1], ['#uc-r', 3]), 'The arc length s = rθ triples (from 1 to 3), but y/r stays sin 1 ≈ 0.841. The ratio depends only on the angle, which is why sin θ = y/r works on a circle of any size.')],
 [('A bicycle wheel has radius 0.35 m. The tire valve starts level with the hub on the right (3 o\'clock). The wheel turns 150° counterclockwise. (a) Where is the valve relative to the hub? (b) How far did the valve travel along the rim?', [
   '<b>Convert the angle.</b> 150° × π/180 = <b>5π/6</b> radians. It lands in quadrant II, with reference angle 30°.',
   '<b>Height.</b> On a circle of radius r the point is (r cos θ, r sin θ). y = 0.35 sin(5π/6) = 0.35 × 1/2 = <b>0.175 m</b> above the hub.',
   '<b>Width.</b> x = 0.35 cos(5π/6) = 0.35 × (−√3/2) ≈ <b>−0.303 m</b>: 0.303 m to the left of the hub (the negative sign means left).',
   '<b>(a) Answer.</b> The valve is at (−0.303, 0.175) m relative to the hub: 0.303 m left and 0.175 m up.',
   '<b>(b) Arc length.</b> s = rθ = 0.35 × 5π/6 ≈ <b>0.916 m</b>. The angle must be in radians for s = rθ.'], _uc_fig()),
  {'h': 'Worked example 2: exact values from the reference angle', 'fig': _uc_fig2(),
   'prob': 'Find the exact values of sin(4π/3), cos(4π/3) and tan(4π/3).',
   'steps': ['<b>Locate the angle.</b> 4π/3 = π + π/3: past the negative x-axis by π/3, so quadrant III.',
    '<b>Reference angle.</b> The acute angle to the x-axis is 4π/3 − π = <b>π/3</b>.',
    '<b>Sizes from quadrant I.</b> sin(π/3) = √3/2 and cos(π/3) = 1/2.',
    '<b>Signs from the quadrant.</b> In quadrant III both coordinates are negative: <b>sin(4π/3) = −√3/2</b> and <b>cos(4π/3) = −1/2</b>.',
    '<b>Tangent.</b> tan = sin/cos = (−√3/2)/(−1/2) = <b>√3</b>. Positive, because the two negatives cancel (the radius slopes up to the right through the origin).']}],
 ['Mixing degrees and radians: sin(30) on a calculator in radian mode is sin of 30 radians, about −0.988, not 1/2.', 'Using the angle itself instead of the reference angle: sin(5π/6) is sin(π/6), not "sin of something bigger".', 'Getting the signs wrong: x is cosine (width) and y is sine (height). Quadrant II has negative cosine, positive sine.', 'Saying tan 90° = 0. It is undefined, because cos 90° = 0.', 'Using s = rθ with θ in degrees.'],
 ('Why the circle definition',
  ['In a right triangle an angle can only be between 0° and 90°. Periodic things (a wheel, a tide, a sound wave) keep going around, so precalculus redefines sine and cosine as coordinates on the unit circle. For acute angles the two definitions agree: the radius is the hypotenuse (length 1), the height is the opposite side and the width is the adjacent side.',
   'Because the point is on the circle x² + y² = 1, every angle satisfies <span class="m">sin²θ + cos²θ = 1</span>. That one fact is the Pythagorean theorem, and it gives one value from the other: if sin θ = 3/5 in quadrant II, then cos θ = −4/5.']),
 [('In which quadrant is sin θ &lt; 0 and cos θ &gt; 0?', ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], 3, 'cos is the x-coordinate (positive means right) and sin is the y-coordinate (negative means down): right and down is quadrant IV.'),
  ('Which is the exact value of cos(5π/4)?', ['√2/2', '−√2/2', '−1/2', '−√3/2'], 1, '5π/4 is in quadrant III with reference angle π/4, so cos = −√2/2.')],
 extra_after_labs=_uc_drill(), ced=('3.2', '3.3'))

# =====================================================================
# 3.5–3.6  Sinusoidal transformations
# =====================================================================
def _sn_fig():
    P = Plot((0, 2 * PI), (-2.6, 4.6), (30, 12, 220, 196))
    f = lambda t: 3 * math.sin(2 * (t - PI / 4)) + 1
    base = P.axes([], [-2, 1, 4], 'θ', 'y') + P.curve(math.sin, 0, 2 * PI, 'mut', 1.6, '4 4')
    for t, s in ((PI / 4, 'π/4'), (PI / 2, 'π/2'), (PI, 'π'), (5 * PI / 4, '5π/4'), (2 * PI, '2π')):
        base += txt(P.X(t), P.Y(0) + 13, s, 'mut', 9, mono=True, w=500)
    L = [(1, P.seg(0, 1, 2 * PI, 1, 'area', 2, '6 4') + P.text(2 * PI - .1, 1.25, 'midline y = 1', 'area', 10, 'end'), 'midline y = 1', 'area'),
         (2, P.seg(PI / 2, 1, PI / 2, 4, 'dd', 2.6) + P.text(PI / 2 + .12, 2.5, '3', 'dd', 12, 'start'), 'amplitude 3', 'dd'),
         (3, P.seg(PI / 4, -2.3, 5 * PI / 4, -2.3, 'tan', 2.4) + P.text(3 * PI / 4, -2.0, 'period π', 'tan', 10), 'period 2π/2 = π', 'tan'),
         (4, P.dot(PI / 4, 1, '', 'tan', r=5) + P.text(PI / 4 - .1, 1.6, 'start', 'tan', 10, 'end'), 'cycle starts at θ = π/4', 'tan'),
         (5, P.curve(f, 0, 2 * PI, 'f', 2.8) + P.dot(PI / 2, 4, '(π/2, 4)', 'f', 10, -4) + P.dot(PI, -2, '(π, −2)', 'f', 0, 16), 'max 4, min −2', 'f')]
    return fig(base, L, 'f(θ) = 3 sin(2(θ − π/4)) + 1 built from sin θ (dashed).', 220)

def _ac_fig():
    P = Plot((0, 1 / 30), (-200, 200), (36, 12, 214, 186))
    f = lambda t: 170 * math.sin(120 * PI * t)
    base = P.axes([], [-170, 170], 't (s)', 'V (volts)')
    for t, s in ((1 / 240, '1/240'), (1 / 120, '1/120'), (1 / 60, '1/60'), (1 / 30, '1/30')):
        base += ln(P.X(t), P.Y(0) - 3, P.X(t), P.Y(0) + 3, 'mut', 1.2) + txt(P.X(t), P.Y(0) + 13, s, 'mut', 9, mono=True, w=500)
    base += P.curve(f, 0, 1 / 30, 'f', 2.6, '', 160)
    L = [(1, P.seg(1 / 240, 0, 1 / 240, 170, 'dd', 2.6) + P.text(1 / 240 + .0006, 90, '170 V', 'dd', 11, 'start'), 'amplitude 170 V', 'dd'),
         (2, P.seg(0, -185, 1 / 60, -185, 'tan', 2.4) + P.text(1 / 120, -165, 'one cycle = 1/60 s', 'tan', 10), 'period 1/60 s', 'tan'),
         (3, P.dot(1 / 720, 85, '', 'tan', r=5) + P.seg(0, 85, 1 / 720, 85, 'area', 1.6, '4 3') + P.text(1 / 720 + .0008, 78, '(1/720, 85)', 'tan', 10, 'start'), 'V = 85 first at t = 1/720 s', 'tan'),
         (4, P.seg(0, 120, 1 / 30, 120, 'area', 1.6, '6 4') + P.text(1 / 30, 128, '120 V (rms)', 'area', 10, 'end'), '120 V is the rms value', 'area')]
    return fig(base, L, 'Voltage of a US wall outlet over two cycles.', 220)

mod('sinusoid', 'Sinusoidal transformations',
 'Every sine wave is the same wave, stretched and shifted. Four numbers say how: amplitude, period, phase shift and midline.',
 ['A <b>sinusoidal function</b> is any transformation of sine or cosine: <span class="m">f(θ) = a sin(b(θ + c)) + d</span>. Each parameter does one job. <b>a</b> stretches vertically: the <b>amplitude</b> is |a|. <b>d</b> moves the wave up: the <b>midline</b> is y = d. <b>b</b> squeezes horizontally: the <b>period</b> is 2π/|b|. <b>c</b> slides it sideways: the <b>phase shift</b> is −c (so θ + π/4 moves the graph left by π/4).',
  'Cosine is a sine wave shifted left by π/2: <span class="m">cos θ = sin(θ + π/2)</span>. So a sinusoid can always be written either way; pick the one whose starting point is easiest (cosine starts at a maximum, sine starts on the midline going up).',
  'Read the parameters straight off a graph: midline = (max + min)/2, amplitude = (max − min)/2, period = the distance between two neighboring maxima.'],
 ('sin θ and cos θ always had amplitude 1, period 2π and midline y = 0', 'a way to fit a wave of any size, speed or starting point', 'real waves have their own height, timing and average level', 'the four transformation parameters and how to read them from a graph or an equation'),
 [('f(θ) = a sin(b(θ + c)) + d', 'the general sinusoid'), ('amplitude |a| · midline y = d', 'vertical'), ('period 2π/|b|', 'horizontal squeeze'), ('phase shift −c', 'left if c > 0'), ('frequency = |b|/2π', 'cycles per unit')],
 [lab('sn-lab', 'Stretch and shift a sine wave', canvas='sn-canvas', aria='Graph of a transformed sine or cosine with the parent curve dashed; draggable handles at the maximum and on the midline.',
   seg=('sn-fn', 'Parent', [('sin', 'sin'), ('cos', 'cos')]),
   pre='<p class="small" id="sn-eq" style="margin:0;font:600 15px var(--f-math)"></p>',
   ctl=[('sn-a', 'a (vertical stretch)', -3, 3, .1, 2), ('sn-b', 'b (horizontal squeeze)', .25, 4, .05, 1), ('sn-c', 'c (inside shift)', -3.14, 3.14, .01, 0), ('sn-d', 'd (vertical shift)', -2, 2, .1, 0)],
   out=[('sn-amp', 'amplitude', 'a'), ('sn-per', 'period', 'v'), ('sn-ph', 'phase shift', 'x'), ('sn-mid', 'midline · range', '')]),
  lab('sn-lab2', 'Build the wave from a max and a min', canvas='sn-canvas2', aria='Two draggable points, a maximum and the next minimum; the sinusoid through them is drawn and its equation shown.',
   pre='<p class="small" style="margin:0">Drag the <b style="color:var(--cx)">maximum</b> and the next <b style="color:var(--ca)">minimum</b>. Half a period separates them.</p>',
   out=[('sn-feat', 'amplitude · midline', 'a'), ('sn-p2', 'period', 'v'), ('sn-eq2', 'equation', 'x')])],
 [('Set a = 2, then a = −2. What does a negative a do?', show(['#sn-a', -2], ['#sn-b', 1], ['#sn-c', 0], ['#sn-d', 0]), 'The amplitude is still 2, but the wave is flipped over its midline: it now starts on the midline going down. Amplitude is |a|.'),
  ('Set b = 2 and then b = 0.5 (keep a = 1). How long is one cycle each time?', show(['#sn-a', 1], ['#sn-b', 2], ['#sn-c', 0], ['#sn-d', 0]), 'Period = 2π/b: π ≈ 3.14 for b = 2 (twice as many waves) and 4π ≈ 12.57 for b = 0.5 (half as many). Bigger b squeezes the wave.'),
  ('Set b = 2 and c = 0.785 (about π/4). Is the shift π/4 or π/8? Read the start of the cycle.', show(['#sn-a', 1], ['#sn-b', 2], ['#sn-c', .785], ['#sn-d', 0]), 'π/4 to the left. The form b(θ + c) factors b out first, so the shift is −c = −π/4. Had it been written sin(2θ + π/4) = sin(2(θ + π/8)), the shift would be π/8.'),
  ('Choose cos with c = 0, then sin with c = 1.57. Compare the two graphs.', show(['click', '#sn-fn [data-k=sin]'], ['#sn-a', 1], ['#sn-b', 1], ['#sn-c', 1.57], ['#sn-d', 0]), 'They match (up to rounding of π/2): sin(θ + π/2) = cos θ. A cosine is a sine that starts half a hump early.'),
  ('In the second lab, drag the minimum farther right. What happens to the period?', '', 'The period is twice the horizontal distance from a maximum to the next minimum. Doubling that distance doubles the period and halves b = 2π/period.')],
 [('Find the amplitude, period, phase shift, midline and range of f(θ) = 3 sin(2(θ − π/4)) + 1, then sketch one cycle.', [
   '<b>Midline.</b> d = 1, so the midline is <b>y = 1</b>.',
   '<b>Amplitude.</b> a = 3, so the wave rises 3 above and falls 3 below the midline: range <b>[−2, 4]</b>.',
   '<b>Period.</b> b = 2, so the period is 2π/2 = <b>π</b>.',
   '<b>Phase shift.</b> θ − π/4 means c = −π/4: the cycle starts <b>π/4 to the right</b>, at θ = π/4, on the midline going up.',
   '<b>Key points.</b> A quarter period later (θ = π/4 + π/4 = π/2) it reaches the max 4; at θ = 3π/4 it is back on the midline; at θ = π it hits the min −2; at 5π/4 the cycle ends.'], _sn_fig()),
  {'h': 'Worked example 2: the voltage in a wall outlet', 'fig': _ac_fig(),
   'prob': 'The voltage of a US wall outlet is modeled by V(t) = 170 sin(120πt) volts, with t in seconds. (a) Find the amplitude, period and frequency. (b) When is the voltage first 85 V?',
   'steps': ['<b>Amplitude.</b> a = 170: the voltage swings between <b>−170 V and 170 V</b>.',
    '<b>Period and frequency.</b> b = 120π, so the period is 2π/(120π) = <b>1/60 s</b> and the frequency is <b>60 cycles per second</b> (60 Hz).',
    '<b>(b) Solve 170 sin(120πt) = 85.</b> sin(120πt) = 1/2. The first positive angle with sine 1/2 is π/6, so 120πt = π/6 and t = <b>1/720 s ≈ 0.00139 s</b>.',
    '<b>Why "120 volts"?</b> The label on an outlet is the root-mean-square value, peak ÷ √2: 170/√2 ≈ 120 V. The peak really is about 170 V (120√2 ≈ 169.7).']}],
 ['Reading the period as b instead of 2π/b.', 'Taking the phase shift from sin(2θ + π/2) as π/2. Factor first: sin(2(θ + π/4)), so the shift is π/4 to the left.', 'Getting the shift direction backwards: θ − h moves right by h, θ + h moves left.', 'Calling a negative a a negative amplitude. Amplitude is |a|; the sign flips the wave.', 'Forgetting the midline when finding max and min: max = d + |a|, min = d − |a|.'],
 ('Sine or cosine?',
  ['Any sinusoid can be written with either. Cosine begins its cycle at a maximum, sine on the midline going up, so choose the one that matches an easy point on your graph or in your context. A Ferris wheel that starts at the bottom, for instance, is −cos: it starts at a minimum.']),
 [('What is the period of g(θ) = 4 cos(πθ/3) − 2?', ['π/3', '3', '6', '2π/3'], 2, 'b = π/3, so the period is 2π ÷ (π/3) = 6.'),
  ('A sinusoid has a maximum of 9 and a minimum of 1. What are its midline and amplitude?', ['y = 5, amplitude 4', 'y = 4, amplitude 5', 'y = 5, amplitude 8', 'y = 9, amplitude 1'], 0, 'Midline (9 + 1)/2 = 5 and amplitude (9 − 1)/2 = 4.')],
 ced=('3.5', '3.6'))

# =====================================================================
# 3.13  Polar coordinates (and complex numbers in polar form)
# =====================================================================
def _pc_fig():
    cx, cy, s = 150, 120, 19
    base = pgrid(cx, cy, 5 * s, 5, 12) + arr(cx - 5 * s - 10, cy, cx + 5 * s + 12, cy, 'mut', '', 1.3) + arr(cx, cy + 5 * s + 8, cx, cy - 5 * s - 12, 'mut', '', 1.3)
    px, py = cx - 3 * s, cy - 3 * s
    L = [(1, dot(px, py, '(−3, 3)', 'ink', 0, -10, 5), 'the point (−3, 3)', 'ink'),
         (2, ln(cx, cy, px, py, 'tan', 3) + txt((cx + px) / 2 + 12, (cy + py) / 2 - 2, 'r = 3√2', 'tan', 11, 'start'), 'r = √(9 + 9) = 3√2', 'tan'),
         (3, anglearc(cx, cy, 18, 0, 3 * PI / 4) + txt(cx + 20, cy - 22, '3π/4', 'area', 11, 'start'), 'quadrant II: θ = 3π/4', 'area'),
         (4, ln(cx, cy, cx + 3 * s, cy + 3 * s, 'dd', 2, '5 4') + dot(px, py, '', 'dd', r=5) + txt(cx + 3 * s + 2, cy + 3 * s + 14, 'θ = −π/4, r = −3√2', 'dd', 10, 'end'), 'also (−3√2, −π/4)', 'dd')]
    return fig(base, L, 'Converting (−3, 3) to polar coordinates on a polar grid.', 236)

def _radar_fig():
    cx, cy, s = 140, 112, 7
    base = pgrid(cx, cy, 15 * s, 3, 12) + txt(cx, 12, 'N', 'mut', 11) + txt(252, cy + 4, 'E', 'mut', 11, 'end') + circ(cx, cy, 4, 'ink')
    th = 7 * PI / 6; px, py = cx + 12 * s * math.cos(th), cy - 12 * s * math.sin(th)
    L = [(1, anglearc(cx, cy, 20, 0, th) + ln(cx, cy, px, py, 'tan', 2.6) + dot(px, py, '', 'tan', r=6) + txt(cx + 24, cy - 18, '210°', 'area', 11, 'start'), '12 km at 210°', 'tan'),
         (2, ln(cx, cy, px, cy, 'dd', 3) + txt((cx + px) / 2, cy - 6, 'x ≈ −10.39', 'dd', 10), 'x = 12 cos 210° ≈ −10.39', 'dd'),
         (3, ln(px, cy, px, py, 'f', 3) + txt(px + 4, (cy + py) / 2 + 12, 'y = −6', 'f', 10, 'start'), 'y = 12 sin 210° = −6', 'f'),
         (4, txt(px, py + 18, '10.4 km W, 6 km S', 'tan', 11), '10.4 km west, 6 km south', 'tan')]
    return fig(base, L, 'A radar contact 12 km out at 210° (counterclockwise from east).', 236)

mod('polarcoord', 'Polar coordinates',
 'Instead of "over and up", say "how far and which way". A point in the plane can be named by its distance from the origin and its angle.',
 ['In <b>polar coordinates</b> a point is <span class="m">(r, θ)</span>: turn to the angle θ (counterclockwise from the positive x-axis), then go a distance r along that ray. It is how radar, sonar and a lighthouse beam describe position.',
  'Converting is the unit circle again, scaled by r: <span class="m">x = r cos θ</span> and <span class="m">y = r sin θ</span>. Going back, <span class="m">r² = x² + y²</span> and <span class="m">tan θ = y/x</span>, but tan θ = y/x has two solutions in each full turn: choose the angle in the quadrant where the point actually is.',
  'One point has many polar names. Adding 2π to θ lands on the same ray. A <b>negative r</b> means "walk backwards": (−r, θ) is the same point as (r, θ + π). A complex number a + bi is the point (a, b), so it has a polar form too: <span class="m">a + bi = r(cos θ + i sin θ)</span>.'],
 ('every point had exactly one name, (x, y)', 'any other way to describe position', 'circular and rotating things are simpler as distance and angle', 'polar coordinates, conversion formulas, and the fact that one point has many polar names'),
 [('x = r cos θ · y = r sin θ', 'polar → rectangular'), ('r² = x² + y² · tan θ = y/x', 'rectangular → polar'), ('(r, θ) = (r, θ + 2π) = (−r, θ + π)', 'same point'), ('a + bi = r(cos θ + i sin θ)', 'complex number, polar form')],
 [lab('pc-lab', 'Drag a point on the polar grid', canvas='pc-canvas', aria='A polar grid with a draggable point; the ray, the angle arc and the x and y legs are drawn.',
   pre='<label class="check"><input type="checkbox" id="pc-neg"> Use a negative r (walk backwards along the ray)</label><label class="check"><input type="checkbox" id="pc-snap" checked> Snap to the grid (π/12 and 0.5)</label>',
   ctl=[('pc-r', 'r', 0, 5, .1, 3), ('pc-th', 'θ (degrees)', 0, 360, 1, 135)],
   out=[('pc-polar', '(r, θ)', 'v'), ('pc-rect', '(x, y)', 'x'), ('pc-also', 'also the same point', 'a')]),
  lab('pc-lab2', 'Complex numbers as points', canvas='pc-canvas2', aria='The complex plane with a draggable point z = a + bi; the modulus r and the argument θ are drawn.',
   ctl=[('pc-za', 'real part a', -4, 4, .1, 1), ('pc-zb', 'imaginary part b', -4, 4, .1, 1.7)],
   out=[('pc-zrect', 'z = a + bi', 'x'), ('pc-zr', 'r = |z|', 'v'), ('pc-zth', 'θ', 'a'), ('pc-zpol', 'polar form', '')])],
 [('Set r = 3 and θ = 135°. Predict (x, y) before you read it.', show(['#pc-neg', False], ['#pc-r', 3], ['#pc-th', 135]), 'x = 3 cos 135° = −3√2/2 ≈ −2.121 and y = 3 sin 135° ≈ 2.121: the point is up and to the left, as quadrant II should be.'),
  ('Keep r = 3, θ = 135° and tick "negative r". Where does the point go?', show(['#pc-r', 3], ['#pc-th', 135], ['#pc-neg', True]), 'To (2.121, −2.121), on the opposite ray (315°). (−3, 135°) is the same point as (3, 315°): a negative r walks backwards.'),
  ('Set θ = 30°, then 390° would be... why does the slider stop at 360°?', show(['#pc-neg', False], ['#pc-th', 30], ['#pc-r', 2]), 'Because 390° is the same ray as 30°. Every point has infinitely many polar names: (2, 30°) = (2, 390°) = (2, −330°) = (−2, 210°).'),
  ('In the complex plane set a = 1, b = 1.7 (about √3). Read r and θ.', show(['#pc-za', 1], ['#pc-zb', 1.7]), 'r = √(1 + 1.7²) ≈ 1.97 and θ ≈ 59.5°. With b = √3 exactly it is r = 2, θ = π/3: 1 + i√3 = 2(cos π/3 + i sin π/3).'),
  ('Set a = −2, b = 0. What is θ, and why is "θ = arctan(b/a)" not enough?', show(['#pc-za', -2], ['#pc-zb', 0]), 'θ = π (180°). arctan(0/−2) = arctan 0 = 0, which points the wrong way. arctan only returns angles in quadrants I and IV, so a point with a negative real part needs π added.')],
 [('Write the point (−3, 3) in polar coordinates in two different ways.', [
   '<b>Plot it.</b> x = −3, y = 3: quadrant II.',
   '<b>Distance.</b> r = √((−3)² + 3²) = √18 = <b>3√2</b> ≈ 4.243.',
   '<b>Angle.</b> tan θ = 3/(−3) = −1. The quadrant II angle with tan θ = −1 is <b>θ = 3π/4</b>. (−π/4 also has tangent −1, but points into quadrant IV.) So the point is (3√2, 3π/4).',
   '<b>A second name.</b> Walk backwards along the opposite ray: (−3√2, 3π/4 − π) = <b>(−3√2, −π/4)</b>. Check: x = −3√2 cos(−π/4) = −3 and y = −3√2 sin(−π/4) = 3.'], _pc_fig()),
  {'h': 'Worked example 2: a plane on the radar screen', 'fig': _radar_fig(),
   'prob': 'An air-traffic radar shows a small plane 12 km from the station at θ = 210°, measured counterclockwise from due east. How far east or west, and how far north or south, is the plane?',
   'steps': ['<b>The polar point.</b> r = 12 km, θ = 210° = 7π/6: quadrant III, reference angle 30°.',
    '<b>East–west.</b> x = 12 cos 210° = 12 × (−√3/2) = −6√3 ≈ <b>−10.39 km</b>.',
    '<b>North–south.</b> y = 12 sin 210° = 12 × (−1/2) = <b>−6 km</b>.',
    '<b>Answer.</b> The plane is about <b>10.4 km west and 6 km south</b> of the station. Check: √(10.39² + 6²) ≈ 12. Note that real navigation measures bearings clockwise from north; this problem uses the math convention.']}],
 ['Using θ = arctan(y/x) without checking the quadrant. For (−3, 3) the calculator gives −π/4, but the point is at 3π/4.', 'Thinking (r, θ) names a point uniquely. (r, θ), (r, θ + 2π) and (−r, θ + π) are all the same point.', 'Swapping sine and cosine: x goes with cos, y with sin.', 'Plotting a negative r on the ray θ. It goes on the opposite ray, θ + π.', 'Mixing degrees and radians within one problem.'],
 ('Converting equations',
  ['The same substitutions turn a polar equation into a rectangular one. For r = 4 cos θ, multiply by r: r² = 4r cos θ, so x² + y² = 4x, which is (x − 2)² + y² = 4: a circle of radius 2 centered at (2, 0). Going the other way, the line y = 3 is r sin θ = 3, or r = 3 csc θ.']),
 [('Which rectangular point is the same as the polar point (−2, π/2)?', ['(0, 2)', '(0, −2)', '(−2, 0)', '(2, 0)'], 1, 'x = −2 cos(π/2) = 0 and y = −2 sin(π/2) = −2: the negative r sends it to the opposite ray, straight down.'),
  ('Which polar form equals the complex number −1 + i?', ['√2(cos π/4 + i sin π/4)', '√2(cos 3π/4 + i sin 3π/4)', '2(cos 3π/4 + i sin 3π/4)', '√2(cos 7π/4 + i sin 7π/4)'], 1, 'r = √(1 + 1) = √2, and (−1, 1) is in quadrant II, so θ = 3π/4.')],
 ced=('3.13',))

# =====================================================================
# 3.14  Polar function graphs
# =====================================================================
def _pg_fig():
    f = lambda t: 2 + 4 * math.cos(t)
    cx, cy, s = 100, 112, 15
    base = pgrid(cx, cy, 6 * s, 3, 12) + arr(cx - 6 * s - 6, cy, cx + 6 * s + 10, cy, 'mut', '', 1.2) + arr(cx, cy + 6 * s + 6, cx, cy - 6 * s - 10, 'mut', '', 1.2)
    base += txt(cx + 2 * s, cy + 13, '2', 'mut', 9, mono=True, w=500) + txt(cx + 6 * s, cy + 13, '6', 'mut', 9, mono=True, w=500)
    pt = lambda t: (cx + s * f(t) * math.cos(t), cy - s * f(t) * math.sin(t))
    L = [(1, dot(*pt(0), '', 'f', r=4.5) + dot(*pt(PI / 3), '', 'f', r=4.5) + dot(*pt(PI / 2), '', 'f', r=4.5) + txt(pt(0)[0] - 2, pt(0)[1] - 8, '(6, 0)', 'f', 10, 'end'), 'r = 6, 4, 2 at θ = 0, π/3, π/2', 'f'),
         (2, pcurve(f, cx, cy, s, 0, 2 * PI / 3) + pcurve(f, cx, cy, s, 4 * PI / 3, 2 * PI), 'r shrinks to 0 at θ = 2π/3', 'f'),
         (3, pcurve(f, cx, cy, s, 2 * PI / 3, 4 * PI / 3, c='dd', w=2.6) + dot(*pt(PI), '', 'dd', r=4.5) + txt(pt(PI)[0] - 4, pt(PI)[1] + 34, '(−2, π) = (2, 0)', 'dd', 10, 'start'), 'r < 0: the inner loop', 'dd'),
         (4, txt(244, 30, 'r = 2 + 4 cos θ', 'f', 12, 'end') + txt(244, 46, 'symmetric about', 'mut', 10, 'end', 500) + txt(244, 59, 'the x-axis', 'mut', 10, 'end', 500), 'cos(−θ) = cos θ: mirror image', 'ink')]
    return fig(base, L, 'r = 2 + 4 cos θ: a limaçon with an inner loop (the inner loop drawn in magenta).', 230)

def _mic_fig():
    f = lambda t: 1 + math.cos(t)
    cx, cy, s = 112, 110, 52
    base = pgrid(cx, cy, 2 * s, 2, 12) + txt(cx + 2 * s + 8, cy + 4, 'front', 'mut', 10, 'start', 500) + txt(cx - 2 * s - 6, cy + 4, 'back', 'mut', 10, 'end', 500)
    base += rect(cx - 7, cy - 9, 14, 18, 'ink', 1, rx=3)
    L = [(1, pcurve(f, cx, cy, s) + dot(cx + 2 * s, cy, '', 'f', r=5) + txt(cx + 2 * s - 2, cy - 10, '2', 'f', 11, 'end'), 'front: r = 2', 'f'),
         (2, ln(cx, cy, cx, cy - s, 'tan', 3) + dot(cx, cy - s, '', 'tan', r=5) + txt(cx + 6, cy - s - 6, 'r = 1', 'tan', 11, 'start'), 'side (90°): r = 1, half', 'tan'),
         (3, dot(cx, cy, '', 'dd', r=4) + txt(cx - 12, cy + 26, 'r = 0 at 180°', 'dd', 10, 'end'), 'back: r = 0', 'dd'),
         (4, '', 'half the signal: 20 log₁₀(0.5) ≈ −6 dB', 'ink')]
    return fig(base, L, 'A cardioid microphone\'s pickup pattern, r = 1 + cos θ, seen from above.', 222)

def _pg_drill():
    D = [(lambda t: 3 * math.cos(2 * t), 'r = 3 cos(2θ)', (-3, 3), ['4-petal rose', '2-petal rose', 'circle'], 0, 'cos(nθ) with n = 2 (even) gives 2n = 4 petals. On the left graph, r hits ±3 four times per turn: each hump, up or down, is a petal.'),
         (lambda t: 3 * math.sin(3 * t), 'r = 3 sin(3θ)', (-3, 3), ['6-petal rose', '3-petal rose', 'limaçon with inner loop'], 1, 'n = 3 is odd, so 3 petals. The 6 humps on the left graph come in pairs that land on the same petal: the negative ones retrace the positive ones.'),
         (lambda t: 2 + 2 * math.cos(t), 'r = 2 + 2 cos θ', (-1, 4), ['circle', 'cardioid', 'limaçon with inner loop'], 1, 'a = b = 2: r touches 0 once (at θ = π) without going negative. That single touch is the cusp of a cardioid.'),
         (lambda t: 1 + 2 * math.cos(t), 'r = 1 + 2 cos θ', (-1, 3), ['cardioid', 'limaçon with inner loop', 'dimpled limaçon'], 1, '|a| < |b|: r dips below 0 between 2π/3 and 4π/3. Negative r is drawn on the opposite ray, which makes the small inner loop.'),
         (lambda t: 3 + math.cos(t), 'r = 3 + cos θ', (0, 4), ['dimpled limaçon', 'cardioid', 'convex limaçon (nearly a circle)'], 2, 'r stays between 2 and 4, never near 0, and a ≥ 2b (3 ≥ 2), so the curve is convex: an egg shape, no dimple.'),
         (lambda t: 3 + 2 * math.sin(t), 'r = 3 + 2 sin θ', (0, 5), ['dimpled limaçon', 'convex limaçon (nearly a circle)', 'cardioid'], 0, 'b < a < 2b (2 < 3 < 4): r gets fairly small (1 at θ = 3π/2) but not 0, so the bottom caves in: a dimple. Sine makes it point up and down.'),
         (lambda t: 4 * math.cos(t), 'r = 4 cos θ', (-4, 4), ['2-petal rose', 'cardioid', 'circle through the origin'], 2, 'r = a cos θ is a circle of diameter 4 through the origin: x² + y² = 4x. Between π/2 and 3π/2, r < 0 retraces the same circle.'),
         (lambda t: 3, 'r = 3', (0, 4), ['circle centered at the origin', 'spiral', 'line'], 0, 'r is the same at every angle: every point is 3 from the origin.'),
         (lambda t: t / 2, 'r = θ/2', (0, 3.5), ['circle', 'spiral', 'cardioid'], 1, 'r keeps growing with θ, so the curve winds outward: an Archimedean spiral. (On the left graph r is a straight line.)'),
         (lambda t: 2 * math.sin(4 * t), 'r = 2 sin(4θ)', (-2, 2), ['4-petal rose', '8-petal rose', '16-petal rose'], 1, 'n = 4 is even: 2n = 8 petals.')]
    cases = []
    for f, eq, yr, opts, c, why in D:
        P, g = rgraph(f, 0, 2 * PI, yr, 'f', 'θ', 'r', (28, 30, 216, 150))
        b = g + txt(250, 18, eq, 'f', 13, 'end')
        R = max(abs(yr[0]), abs(yr[1])); cx, cy = 130, 104; s = 82 / R
        a = pgrid(cx, cy, 82, 2, 12) + ln(cx - 90, cy, cx + 90, cy, 'mut', 1) + ln(cx, cy - 90, cx, cy + 90, 'mut', 1) + pcurve(f, cx, cy, s, 0, 2 * PI, 720, 'f', 2.6) + txt(250, 18, eq, 'f', 13, 'end')
        cases.append((f'This is the graph of {eq} in the (θ, r) plane. What does the polar graph look like?', svg(b, 200, f'Graph of r against θ for {eq}'), svg(a, 200, f'Polar graph of {eq}'), opts, c, why))
    return drill('Two pictures, one function: 10 curves', 'Read the left graph (θ across, r up), predict the polar shape, then check.', cases, 'pg-drill')

mod('polargraph', 'Polar graphs',
 'Give a radius for every angle and a curve draws itself: roses, hearts, loops and spirals, all from one rule r = f(θ).',
 ['A <b>polar function</b> <span class="m">r = f(θ)</span> sweeps a ray around the origin and, at each angle, puts a point at distance f(θ). Sweep θ from 0 to 2π and the points trace a curve. When f(θ) is negative, the point goes on the <b>opposite ray</b>.',
  'The same function has two pictures. In the <b>(θ, r) plane</b> it is an ordinary graph: θ across, r up. In the <b>polar plane</b> it wraps around the origin. Reading one from the other is the key skill: where the rectangular graph crosses zero, the polar curve passes through the origin; where |r| peaks, the polar curve is farthest out.',
  'Families to know: <b>circles</b> r = a, r = a cos θ, r = a sin θ; <b>roses</b> r = a cos(nθ) with n petals if n is odd and 2n if n is even; <b>limaçons</b> r = a + b cos θ (inner loop if |a| &lt; |b|, cardioid if |a| = |b|, dimpled if |b| &lt; |a| &lt; 2|b|, convex if |a| ≥ 2|b|); <b>spirals</b> r = aθ.'],
 ('a graph was y as a function of x, read left to right', 'curves that wrap around, cross themselves or pass through the origin many times', 'r = f(θ) describes shapes that are awkward or impossible as y = f(x)', 'to sweep the angle, read r from a (θ, r) graph, and handle negative r'),
 [('r = f(θ)', 'distance at each angle'), ('(x, y) = (f(θ) cos θ, f(θ) sin θ)', 'the point'), ('r = a cos(nθ)', 'rose: n or 2n petals'), ('r = a + b cos θ', 'limaçon'), ('f(θ) = 0', 'curve passes through the origin')],
 [lab('pg-lab', 'Draw a polar curve', canvas='pg-canvas', aria='Left: r against θ on rectangular axes. Right: the polar curve drawn up to the current angle, with the ray and the point.',
   seg=('pg-fam', 'Family', [('rose', 'Rose a cos(nθ)'), ('lim', 'Limaçon a + b cos θ'), ('lims', 'Limaçon a + b sin θ'), ('circ', 'Circle a cos θ'), ('spir', 'Spiral aθ')]),
   pre='<p class="small" id="pg-eq" style="margin:0;font:600 15px var(--f-math)"></p><div class="row"><button type="button" class="btn primary" id="pg-play">Play</button><button type="button" class="btn" id="pg-trail">Show whole curve</button></div>',
   ctl=[('pg-th', 'θ (sweep)', 0, 6.283, .005, 2.2), ('pg-a', 'a', .5, 4, .1, 3), ('pg-b', 'b (limaçon) or n (rose)', 1, 6, .1, 2)],
   out=[('pg-r', 'r = f(θ)', 'x'), ('pg-xy', '(x, y)', 'v'), ('pg-note', 'what you see', '')]),
  lab('pg-lab2', 'Drag r(θ) and watch the polar curve', canvas='pg-canvas2', aria='Left: a curve r(θ) through draggable control points on rectangular axes. Right: the polar curve it makes.',
   seg=('pg-pre', 'Start from', [('flat', 'Circle'), ('card', 'Cardioid'), ('rose', 'Rose'), ('rand', 'Random')]),
   out=[('pg-max', 'farthest from the origin', 'x'), ('pg-zero', 'passes through the origin at', 'a')])],
 [('Choose <b>Rose</b> with n = 3, press Play. How many petals, and how many times does the left graph reach ±a?', show(['click', '#pg-fam [data-k=rose]'], ['#pg-a', 3], ['#pg-b', 3]), 'Three petals, but the left graph peaks six times (three up, three down). For odd n, the negative-r humps retrace the same petals; that is why odd n gives n petals and even n gives 2n.'),
  ('Rose with n = 2: count the petals now.', show(['click', '#pg-fam [data-k=rose]'], ['#pg-a', 3], ['#pg-b', 2]), 'Four petals. With n even, the negative humps land on new petals between the positive ones.'),
  ('Choose <b>Limaçon a + b cos θ</b>. Set a = 1, b = 2, then a = 2, b = 2, then a = 3, b = 2. Name each shape.', show(['click', '#pg-fam [data-k=lim]'], ['#pg-a', 1], ['#pg-b', 2]), 'a = 1: inner loop (r goes negative). a = 2: cardioid (r touches 0 once, a cusp). a = 3: dimpled limaçon (r never reaches 0, but dips to 1).'),
  ('Limaçon, a = 1, b = 2. Sweep θ slowly from 100° to 260° (about 1.75 to 4.5). Where is the point drawn while r is negative?', show(['click', '#pg-fam [data-k=lim]'], ['#pg-a', 1], ['#pg-b', 2], ['#pg-th', 3.14]), 'On the opposite ray: at θ = π, r = −1 and the point is at (1, 0), on the right. That piece is the inner loop, drawn in magenta.'),
  ('In the second lab choose <b>Circle</b>, then drag one dot down below the θ-axis. What happens on the right?', show(['click', '#pg-pre [data-k=flat]']), 'The curve dives through the origin and the point for that angle appears on the opposite side. Every zero crossing on the left is a pass through the origin on the right.')],
 [('Sketch r = 2 + 4 cos θ for 0 ≤ θ ≤ 2π. Where does it pass through the origin, and what is the inner loop?', [
   '<b>Table of key angles.</b> θ = 0, π/3, π/2, 2π/3, π give r = 6, 4, 2, 0, −2.',
   '<b>Zeros.</b> 2 + 4 cos θ = 0 when cos θ = −1/2: <b>θ = 2π/3 and 4π/3</b>. The curve passes through the origin at both angles.',
   '<b>Negative r.</b> For 2π/3 &lt; θ &lt; 4π/3, r &lt; 0, so those points go on the opposite ray. At θ = π, r = −2 is plotted at (2, 0): this stretch makes the <b>inner loop</b>.',
   '<b>Symmetry and shape.</b> cos(−θ) = cos θ, so the curve is symmetric about the x-axis. |a| = 2 &lt; |b| = 4: a limaçon with an inner loop, reaching out to (6, 0).'], _pg_fig()),
  {'h': 'Worked example 2: a microphone\'s pickup pattern', 'fig': _mic_fig(),
   'prob': 'A cardioid microphone picks up sound with relative sensitivity r = 1 + cos θ, where θ is the angle from the direction the microphone points. (a) Compare its sensitivity at the front, the side (θ = π/2) and the back. (b) At what angle is it 1.5, three-quarters of its maximum?',
   'steps': ['<b>Front.</b> θ = 0: r = 1 + 1 = <b>2</b>, the maximum.',
    '<b>Side.</b> θ = π/2: r = 1 + 0 = <b>1</b>, half the front value. Half the amplitude is 20 log₁₀(0.5) ≈ −6 dB, the "−6 dB at the side" printed on microphone spec sheets.',
    '<b>Back.</b> θ = π: r = 1 − 1 = <b>0</b>. It hears nothing from directly behind, which is why singers point it at their mouth and away from the speakers.',
    '<b>(b)</b> 1 + cos θ = 1.5 gives cos θ = 0.5, so <b>θ = π/3 (60°)</b> on either side of the front.']}],
 ['Plotting a negative r on the ray θ itself instead of the opposite ray.', 'Counting petals of r = a cos(nθ) as n for every n: it is 2n when n is even.', 'Stopping at θ = π. Many curves need the full 0 to 2π (a rose with even n, any limaçon).', 'Reading the (θ, r) graph as if it were the shape. It is a different picture of the same function.', 'Assuming every limaçon has a loop: only |a| &lt; |b| does.'],
 ('Reading the (θ, r) graph',
  ['AP questions often show r = f(θ) on rectangular axes and ask about the polar curve. Three translations do most of the work: <b>r = 0</b> on the graph means the curve is at the origin; <b>|r| largest</b> means the curve is farthest out; <b>r negative</b> means the point is on the opposite side of the origin from the angle θ.']),
 [('How many petals does r = 5 sin(6θ) have?', ['6', '12', '3', '5'], 1, 'n = 6 is even, so 2n = 12 petals.'),
  ('For r = 3 − 3 sin θ, at which angle does the curve pass through the origin?', ['θ = 0', 'θ = π/2', 'θ = π', 'θ = 3π/2'], 1, 'r = 0 when sin θ = 1, at θ = π/2. (|a| = |b| = 3: a cardioid with its cusp at the origin.)')],
 extra_after_labs=_pg_drill(), ced=('3.14',))

# =====================================================================
# 3.15  Rates of change in polar functions
# =====================================================================
def _pr_fig():
    f = lambda t: 1 + 2 * math.sin(t)
    P, g = rgraph(f, 0, 2 * PI, (-1, 3), 'f', 'θ', 'r', (28, 14, 216, 120))
    a, b = PI / 2, 7 * PI / 6
    base = g
    L = [(1, P.dot(a, 3, '(π/2, 3)', 'f', 0, -8), 'r(π/2) = 3', 'f'),
         (2, P.dot(b, 0, '(7π/6, 0)', 'f', 22, -8), 'r(7π/6) = 0', 'f'),
         (3, P.seg(a, 3, b, 0, 'tan', 2.4), 'slope = −3 ÷ (2π/3)', 'tan'),
         (4, P.text(PI * 1.35, 2.4, '≈ −1.43 per radian', 'tan', 11), 'AROC = −9/(2π) ≈ −1.432', 'tan'),
         (5, '', 'r > 0 and decreasing: closer', 'dd')]
    cx, cy, s = 132, 196, 15
    pol = pgrid(cx, cy, 45, 3, 12) + pcurve(f, cx, cy, s, 0, 2 * PI, 300, 'mut', 1.4) + pcurve(f, cx, cy, s, a, b, 120, 'dd', 3)
    pol += dot(cx + s * 3 * math.cos(a), cy - s * 3 * math.sin(a), '', 'dd', r=4) + dot(cx, cy, '', 'dd', r=4)
    L.append((5, pol, '', ''))
    return fig(base, L, 'r = 1 + 2 sin θ on rectangular axes (top) and the polar arc from θ = π/2 to 7π/6 (bottom, magenta).', 252)

def _spr_fig():
    f = lambda t: 10 + 4 * math.cos(t)
    cx, cy, s = 112, 116, 6.4
    base = pgrid(cx, cy, 14 * s, 2, 12) + pcurve(f, cx, cy, s, 0, 2 * PI, 300, 'f', 2.4) + circ(cx, cy, 4, 'ink') + txt(cx + 6, cy + 14, 'sprinkler', 'mut', 10, 'start', 500)
    L = [(1, ln(cx, cy, cx + 14 * s, cy, 'tan', 2.6) + txt(cx + 14 * s - 2, cy - 8, '14 ft', 'tan', 11, 'end'), 'θ = 0: r = 14 ft', 'tan'),
         (2, ln(cx, cy, cx, cy - 10 * s, 'tan', 2.6) + txt(cx + 6, cy - 10 * s + 4, '10 ft', 'tan', 11, 'start'), 'θ = π/2: r = 10 ft', 'tan'),
         (3, pcurve(f, cx, cy, s, 0, PI / 2, 80, 'dd', 3.4), 'AROC = −8/π ≈ −2.55 ft/rad', 'dd'),
         (4, pcurve(f, cx, cy, s, PI, 3 * PI / 2, 80, 'd', 3.4) + ln(cx, cy, cx - 6 * s, cy, 'tan', 2) + txt(cx - 6 * s - 4, cy + 14, '6 ft', 'tan', 11, 'end'), 'π to 3π/2: +8/π, farther', 'd')]
    return fig(base, L, 'The edge of the watered region, r = 10 + 4 cos θ feet.', 232)

mod('polarroc', 'Rates of change in polar',
 'As θ turns, does the curve move toward the origin or away from it, and how fast? The answer is in r, not in x or y.',
 ['For a polar function r = f(θ), the <b>average rate of change</b> of r on [θ₁, θ₂] is <span class="m">(f(θ₂) − f(θ₁)) / (θ₂ − θ₁)</span>: how much the distance to the origin changes per radian of turning, on average. It is the slope of a secant on the (θ, r) graph.',
  'The sign of r and the direction r is changing together decide whether the point is getting <b>closer to or farther from the origin</b>. The distance is |r|. If r is positive and increasing, or negative and decreasing, |r| grows: <b>farther</b>. If r is positive and decreasing, or negative and increasing, |r| shrinks: <b>closer</b>.',
  'Where r changes from increasing to decreasing while positive, the curve is at a local maximum distance from the origin (the tip of a petal, the outer edge of a limaçon).'],
 ('rate of change was about y and x', 'a rate of the distance from the origin per angle', 'polar curves move toward and away from the origin as θ turns', 'the average rate of change of r and the sign test for closer or farther'),
 [('(f(θ₂) − f(θ₁)) / (θ₂ − θ₁)', 'average rate of change of r'), ('r > 0 and increasing', 'farther from origin'), ('r > 0 and decreasing', 'closer'), ('r < 0 and decreasing', 'farther (|r| grows)'), ('r < 0 and increasing', 'closer')],
 [lab('pr-lab', 'Closer or farther?', canvas='pr-canvas', aria='Left: r against θ with a secant over an interval. Right: the polar curve with the same interval highlighted, colored green when moving away from the origin and orange when moving closer.',
   seg=('pr-fn', 'Curve', [('lim', 'r = 1 + 2 sin θ'), ('rose', 'r = 3 cos(2θ)'), ('card', 'r = 2 + 2 cos θ'), ('spr', 'r = 10 + 4 cos θ')]),
   ctl=[('pr-th', 'θ₁ (start)', 0, 6.28, .01, 1.57), ('pr-dt', 'Δθ (interval width)', .02, 3.14, .01, 2.09)],
   out=[('pr-r', 'r(θ₁) → r(θ₂)', 'x'), ('pr-aroc', 'average rate of change', 'v'), ('pr-dir', 'over the interval', '')])],
 [('With r = 1 + 2 sin θ, set θ₁ = π/2 and Δθ = 2π/3 (θ₂ = 7π/6). Compute the average rate of change, then read it.', show(['click', '#pr-fn [data-k=lim]'], ['#pr-th', 1.571], ['#pr-dt', 2.094]), 'r goes from 3 to 0, so (0 − 3)/(2π/3) = −9/(2π) ≈ −1.43. r is positive and decreasing the whole way, so the point moves closer to the origin, reaching it at 7π/6.'),
  ('Now shrink Δθ toward 0.02 while θ₁ stays at π/2. What happens to the average rate?', show(['click', '#pr-fn [data-k=lim]'], ['#pr-th', 1.571], ['#pr-dt', .02]), 'It approaches 0: at θ = π/2 the (θ, r) graph is at its peak, so r is momentarily neither increasing nor decreasing. The polar point is at its farthest from the origin.'),
  ('Choose r = 3 cos(2θ). Set θ₁ = π/4 (0.785) and Δθ = π/4. Is r positive? Is the point getting closer or farther?', show(['click', '#pr-fn [data-k=rose]'], ['#pr-th', .785], ['#pr-dt', .785]), 'r goes from 0 to −3: negative and decreasing. |r| grows from 0 to 3, so the point moves farther from the origin, tracing a petal on the opposite side.'),
  ('Choose the sprinkler r = 10 + 4 cos θ. Compare the average rate of change on [0, π/2] and on [π, 3π/2].', show(['click', '#pr-fn [data-k=spr]'], ['#pr-th', 0], ['#pr-dt', 1.571]), 'On [0, π/2]: (10 − 14)/(π/2) = −8/π ≈ −2.55 ft per radian (edge coming closer). On [π, 3π/2]: (10 − 6)/(π/2) = +8/π ≈ 2.55 (edge moving away).')],
 [('For r = f(θ) = 1 + 2 sin θ, find the average rate of change of r on [π/2, 7π/6], and say whether the curve is getting closer to or farther from the origin on that interval.', [
   '<b>Endpoints.</b> f(π/2) = 1 + 2(1) = <b>3</b> and f(7π/6) = 1 + 2(−1/2) = <b>0</b>.',
   '<b>Interval width.</b> 7π/6 − π/2 = 7π/6 − 3π/6 = <b>2π/3</b>.',
   '<b>Average rate of change.</b> (0 − 3)/(2π/3) = −9/(2π) ≈ <b>−1.432</b>: r drops about 1.43 units per radian, on average.',
   '<b>Check the sign of r.</b> On this interval sin θ &gt; −1/2 (until 7π/6), so r &gt; 0, and sin θ is decreasing, so r is decreasing.',
   '<b>Conclusion.</b> r is positive and decreasing, so the distance |r| shrinks: the curve gets <b>closer to the origin</b>, reaching it at θ = 7π/6.'], _pr_fig()),
  {'h': 'Worked example 2: how far the sprinkler reaches', 'fig': _spr_fig(),
   'prob': 'A lawn sprinkler waters a region whose edge is r = 10 + 4 cos θ feet from the sprinkler, θ in radians. (a) Find the average rate of change of r on [0, π/2] and interpret it. (b) Is the edge getting closer or farther on [π, 3π/2]?',
   'steps': ['<b>Endpoints.</b> r(0) = 10 + 4 = 14 ft; r(π/2) = 10 + 0 = 10 ft.',
    '<b>(a) Rate.</b> (10 − 14)/(π/2 − 0) = −4/(π/2) = −8/π ≈ <b>−2.546 ft per radian</b>.',
    '<b>Interpretation.</b> As the spray direction turns from θ = 0 to θ = π/2, the edge of the watered region gets closer to the sprinkler at an average of about 2.55 feet per radian of turning.',
    '<b>(b)</b> r(π) = 6 ft and r(3π/2) = 10 ft. r is positive and increasing, so the edge is getting <b>farther</b>: average rate (10 − 6)/(π/2) = 8/π ≈ +2.546 ft per radian.']}],
 ['Saying "r is decreasing, so the point gets closer" when r is negative. Then |r| is growing: it moves away.', 'Using the change in x or y instead of the change in r.', 'Forgetting the units: the rate is in units of r per radian.', 'Subtracting in one order on top and the other on the bottom.', 'Using degrees in the denominator: θ₂ − θ₁ must be in radians unless told otherwise.'],
 ('Why the sign of r matters',
  ['The distance from the origin is |r|, not r. When r is negative, the point sits on the opposite ray at distance −r. If r goes from −1 to −3, it is decreasing, but the distance goes from 1 to 3: the point moves away. So always check two things: the sign of r and whether r is increasing or decreasing.']),
 [('On an interval, r = f(θ) is negative and increasing. The polar curve is', ['moving away from the origin', 'moving toward the origin', 'at a maximum distance', 'passing through the origin'], 1, '|r| shrinks when a negative r increases toward 0, so the point gets closer.'),
  ('For r = 4 sin θ, what is the average rate of change of r on [0, π/6]?', ['2/π', '12/π', '6/π', 'π/12'], 1, 'r(0) = 0 and r(π/6) = 2. (2 − 0)/(π/6) = 12/π ≈ 3.82.')],
 ced=('3.15',))
