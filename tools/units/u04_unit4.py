# Unit 4: Functions involving parameters, vectors and matrices (not on the AP exam). Batch 2: param. Batch 3: paramroc.
import math
PI = math.pi

# =====================================================================
# 4.1, 4.2, 4.4  Parametric functions
# =====================================================================
def _seg_fig():
    P = Plot((-1, 9), (-3, 4), (30, 14, 220, 160))
    base = P.axes([1, 4, 7], [-1, 2], 'x', 'y', True)
    L = [(1, P.dot(1, 2, 'A (1, 2)', 'f', 0, -9, 5) + P.dot(7, -1, 'B (7, −1)', 'f', 0, 18, 5), 'A and B', 'f'),
         (2, P.seg(1, 2, 7, -1, 'f', 2.8) + P.text(4.2, 1.2, 'x = 1 + 6t, y = 2 − 3t', 'f', 10, 'start'), 'start + t · (change)', 'f'),
         (3, P.dot(3, 1, 't = 1/3', 'tan', 0, -9, 5), 't = 1/3: (3, 1)', 'tan'),
         (4, P.seg(7, -1, 5.2, -.1, 'dd', 3) + P.text(1.0, -2.5, 'B → A, 0 ≤ t ≤ 2', 'dd', 10, 'start'), 'x = 7 − 3t, y = −1 + 1.5t', 'dd')]
    return fig(base, L, 'The segment from A to B traced by a parameter t.', 200)

def _kick_fig():
    P = Plot((0, 50), (0, 10.5), (34, 12, 214, 186))
    T = (12 + math.sqrt(163.6)) / 9.8
    base = P.axes([10, 20, 30, 40, 50], [2, 4, 6, 8, 10], 'x (m)', 'y (m)')
    xs = lambda t: 18 * t; ys = lambda t: 1 + 12 * t - 4.9 * t * t
    pts = [(P.X(xs(T * i / 120)), P.Y(ys(T * i / 120))) for i in range(121)]
    L = [(1, pline(pts, 'f', 2.6) + ''.join(P.dot(xs(t), ys(t), '', 'f', r=3) for t in (.5, 1, 1.5, 2, 2.5)), 'dots every 0.5 s', 'f'),
         (2, P.dot(18 * 12 / 9.8, 1 + 144 / 19.6, '(22.0, 8.35)', 'tan', 0, -9, 5), 'top: t ≈ 1.224 s, y ≈ 8.35 m', 'tan'),
         (3, P.dot(18 * T, 0, '45.5 m', 'tan', -4, -9, 5), 'lands at t ≈ 2.530 s, x ≈ 45.5 m', 'tan'),
         (4, '', 'y = 1 + (2/3)x − 0.01512x²', 'ink')]
    return fig(base, L, 'A kicked ball: x = 18t, y = 1 + 12t − 4.9t² (meters, seconds). Dots are 0.5 s apart.', 222)

mod('param', 'Parametric functions',
 'Give x and y each their own clock. As t ticks, the point (x(t), y(t)) moves along a path, with a direction and a speed built in.',
 ['A <b>parametric function</b> gives both coordinates as functions of a third variable, the <b>parameter</b> t (often time): <span class="m">(x(t), y(t))</span>. As t increases, the point traces a <b>path</b> in the plane, in a definite direction. The path alone does not show when the point was where; the parametric function does.',
  'Read it as three linked pictures: the graph of x(t), the graph of y(t), and the path. When x(t) is increasing the point moves <b>right</b>; when y(t) is increasing it moves <b>up</b>. A <b>line segment</b> from (x₀, y₀) to (x₁, y₁) is <span class="m">x = x₀ + (x₁ − x₀)t, y = y₀ + (y₁ − y₀)t</span> for 0 ≤ t ≤ 1. A <b>circle</b> of radius r centered at (h, k) is <span class="m">x = h + r cos t, y = k + r sin t</span>, counterclockwise.',
  'Sometimes you can <b>eliminate the parameter</b>: solve one equation for t and substitute into the other to get an equation in x and y. That gives the shape of the path, but loses the direction and the timing.'],
 ('a curve was y as a function of x, and only the shape mattered', 'any notion of when or in which direction', 'motion in the plane: where the object is at each time, so x and y both depend on t', 'parametric functions, reading direction from x(t) and y(t), and parametrizing lines and circles'),
 [('(x(t), y(t))', 'position at time t'), ('x = x₀ + (x₁ − x₀)t', 'segment, 0 ≤ t ≤ 1'), ('y = y₀ + (y₁ − y₀)t', ''), ('x = h + r cos t, y = k + r sin t', 'circle, counterclockwise'), ('x(t) increasing', 'moving right')],
 [lab('pa-lab', 'Three views of one motion', canvas='pa-canvas', aria='The graph of x against t, the graph of y against t, and the path in the plane, with the current time marked on all three.',
   seg=('pa-pre', 'Motion', [('circ', 'Circle'), ('line', 'Segment'), ('proj', 'Kicked ball'), ('liss', 'Figure-eight'), ('cyc', 'Pebble in a tire')]),
   pre='<p class="small" id="pa-eq" style="margin:0;font:600 15px var(--f-math)"></p><div class="row"><button type="button" class="btn primary" id="pa-play">Play</button></div>',
   ctl=[('pa-t', 'Time t', 0, 6.283, .006, 1)],
   out=[('pa-xy', '(x(t), y(t))', 'x'), ('pa-dir', 'moving', 'v'), ('pa-note', 'what you see', '')]),
  lab('pa-lab2', 'Design x(t) and y(t), watch the path', canvas='pa-canvas2', aria='Two small graphs, x against t and y against t, with draggable points; the path they make is drawn on the right.',
   seg=('pa-pre2', 'Start from', [('line', 'Segment'), ('circ', 'Circle'), ('stop', 'Stop and go back'), ('rand', 'Random')]),
   ctl=[('pa-t2', 'Time t', 0, 6, .01, 2)],
   out=[('pa-xy2', '(x, y)', 'x'), ('pa-mv', 'moving', 'v')])],
 [('Choose <b>Circle</b> and press Play. Which way does the point go, and where is it at t = π/2?', show(['click', '#pa-pre [data-k=circ]'], ['#pa-t', 0]), 'Counterclockwise, starting at (3, 0). At t = π/2 it is at (3 cos π/2, 3 sin π/2) = (0, 3), the top. x(t) is a cosine and y(t) a sine.'),
  ('With the circle, find a time when x(t) is decreasing and y(t) is increasing. Where is the point?', show(['click', '#pa-pre [data-k=circ]'], ['#pa-t', .8]), 'For 0 &lt; t &lt; π/2: moving left (x decreasing) and up (y increasing), so the point is in quadrant I heading toward the top.'),
  ('Choose <b>Kicked ball</b>. Watch the dots on the x(t) graph and on the path. Why are they evenly spaced across but not up?', show(['click', '#pa-pre [data-k=proj]'], ['#pa-t', 1.2]), 'x(t) = 18t is linear: the ball covers 18 m sideways every second. y(t) is a downward parabola: fast rise, slowing at the top, then falling faster.'),
  ('Choose <b>Figure-eight</b>. The path crosses itself at the origin. Is the point ever there twice at the same time?', show(['click', '#pa-pre [data-k=liss]'], ['#pa-t', 0]), 'No: it passes through (0, 0) at t = 0 and again at t = π, at different times and heading in different directions. A path can cross itself; a parametric function just visits the same place twice.'),
  ('In the second lab choose <b>Stop and go back</b>. Where does x(t) level off, and what does the point do there?', show(['click', '#pa-pre2 [data-k=stop]'], ['#pa-t2', 3]), 'Where both graphs level off together, the point stops; where they then reverse, it retraces its path backward. The path looks like a plain segment, but the motion goes out, pauses and comes back.')],
 [('Parametrize the segment from A(1, 2) to B(7, −1) with 0 ≤ t ≤ 1, find the point at t = 1/3, then parametrize the trip from B back to A taking 0 ≤ t ≤ 2.', [
   '<b>Endpoints.</b> Start A(1, 2), end B(7, −1). The change is Δx = 6 and Δy = −3.',
   '<b>Start plus a fraction of the change.</b> <b>x = 1 + 6t, y = 2 − 3t</b>, 0 ≤ t ≤ 1. At t = 0 it is A, at t = 1 it is B.',
   '<b>t = 1/3.</b> x = 1 + 2 = 3, y = 2 − 1 = 1: the point <b>(3, 1)</b>, one third of the way from A to B.',
   '<b>Reverse in 2 units of time.</b> Start at B and cover the change (−6, 3) at half the rate: <b>x = 7 − 3t, y = −1 + 1.5t</b>, 0 ≤ t ≤ 2. Same path, opposite direction, different timing.'], _seg_fig()),
  {'h': 'Worked example 2: a kicked soccer ball', 'fig': _kick_fig(),
   'prob': 'A ball is kicked from 1 m above the ground. Its position after t seconds is x(t) = 18t, y(t) = 1 + 12t − 4.9t² (meters). (a) When is the ball highest, and how high? (b) When and where does it land? (c) Eliminate t to find the shape of the path.',
   'steps': ['<b>Read each coordinate.</b> x(t) = 18t: 18 m per second sideways, steadily. y(t) is a quadratic opening down: up, then down.',
    '<b>(a)</b> The vertex of y(t) is at t = −12/(2 · (−4.9)) = 12/9.8 ≈ <b>1.224 s</b>. Then y = 1 + 144/19.6 ≈ <b>8.35 m</b>, at x ≈ 22.0 m.',
    '<b>(b)</b> Lands when y = 0: 4.9t² − 12t − 1 = 0, so t = (12 + √163.6)/9.8 ≈ <b>2.530 s</b> (the other root is negative). Then x = 18(2.530) ≈ <b>45.5 m</b>.',
    '<b>(c)</b> t = x/18, so y = 1 + 12(x/18) − 4.9(x/18)² = <b>1 + (2/3)x − 0.01512x²</b>: a parabola. The equation gives the shape, but not when the ball is where.']}],
 ['Treating the path as the graph of a function of x: a path can loop, cross itself or go straight up.', 'Ignoring direction: x = cos t, y = sin t and x = sin t, y = cos t trace the same circle in opposite directions.', 'Plugging x into y(t): find t first, then use it in both coordinates.', 'Forgetting the t-interval: it decides where the path starts, stops, and how many times it is traced.', 'Assuming equal steps in t give equal distances on the path.'],
 ('One path, many parametrizations',
  ['The path x² + y² = 1 is the circle, but (cos t, sin t), (cos 2t, sin 2t), (sin t, cos t) and (cos t, −sin t) are four different motions on it: different speeds and directions. Planar motion problems care about the motion, so the parametric function carries more information than the path.']),
 [('Which is a parametrization of the circle of radius 2 centered at (1, −3), counterclockwise?', ['x = 2 + cos t, y = 2 − 3 sin t', 'x = 1 + 2 cos t, y = −3 + 2 sin t', 'x = 1 + 2 sin t, y = −3 + 2 cos t', 'x = 2 cos(t − 1), y = 2 sin(t + 3)'], 1, 'Center plus radius times (cos t, sin t). The third option traces the same circle clockwise.'),
  ('On an interval, x(t) is decreasing and y(t) is constant. The point is moving', ['up', 'down', 'left', 'right'], 2, 'x decreasing means moving left; y constant means no vertical motion.')],
 ced=('4.1', '4.2', '4.4'))

# =====================================================================
# 4.3  Parametric functions: rates of change
# =====================================================================
def _svg(body, h=200, label=''):
    return f'<svg viewBox="0 0 260 {h}" role="img" aria-label="{label}">{body}</svg>'

def _qr_drill():
    """Which way is the point moving? Read the signs of the rates of x(t) and y(t)."""
    s, c = math.sin, math.cos
    D = [(lambda t: 2 * c(t), lambda t: 2 * s(t), 1.2, 'x = 2 cos t, y = 2 sin t'),
         (lambda t: t * t - 2 * t, lambda t: 3 - t, 0.5, 'x = t² − 2t, y = 3 − t'),
         (lambda t: 1 + t, lambda t: (t - 1) ** 2, 2.0, 'x = 1 + t, y = (t − 1)²'),
         (lambda t: 2 * s(t), lambda t: s(2 * t), 5.3, 'x = 2 sin t, y = sin 2t'),
         (lambda t: 3 - t * t / 2, lambda t: t * t - 4 * t + 3, 1.2, 'x = 3 − t²/2, y = t² − 4t + 3'),
         (lambda t: t - s(t), lambda t: 1 - c(t), 2.0, 'x = t − sin t, y = 1 − cos t')]
    opts = ['up and right', 'up and left', 'down and right', 'down and left']
    cases = []
    for fx, fy, t0, eq in D:
        e = 1e-5; dx = (fx(t0 + e) - fx(t0 - e)) / (2 * e); dy = (fy(t0 + e) - fy(t0 - e)) / (2 * e)
        assert abs(dx) > .05 and abs(dy) > .05, eq
        k = (0 if dy > 0 else 2) + (0 if dx > 0 else 1)
        ta, tb = t0 - 1.2, t0 + 1.2
        def small(f, box, col, name):
            vs = [f(ta + (tb - ta) * i / 80) for i in range(81)]; lo, hi = min(vs), max(vs); pad = (hi - lo) * .15 + .1
            P = Plot((ta, tb), (lo - pad, hi + pad), box)
            o = f'<rect x="{box[0]}" y="{box[1]}" width="{box[2]}" height="{box[3]}" style="fill:none;stroke:var(--line);stroke-width:1"/>'
            o += P.curve(f, ta, tb, col, 2.4, '', 80) + ln(P.X(t0), box[1], P.X(t0), box[1] + box[3], 'area', 1.2, '3 3') + P.dot(t0, f(t0), '', 'tan', r=4.5)
            return o + txt(box[0] + 6, box[1] + 13, name, col, 11, 'start') + txt(box[0] + box[2] - 4, box[1] + box[3] - 5, 't', 'mut', 10, 'end', 500)
        b = small(fx, (8, 8, 112, 84), 'dd', 'x(t)') + small(fy, (8, 104, 112, 84), 'd', 'y(t)') + txt(130, 198, '', 'mut', 1)
        b += f'<rect x="132" y="8" width="120" height="180" style="fill:none;stroke:var(--line);stroke-width:1;stroke-dasharray:4 4"/>' + txt(192, 100, 'path?', 'mut', 12)
        xs = [fx(ta + (tb - ta) * i / 120) for i in range(121)]; ys = [fy(ta + (tb - ta) * i / 120) for i in range(121)]
        sc = min(104 / ((max(xs) - min(xs)) or 1), 164 / ((max(ys) - min(ys)) or 1)); mx, my = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        X = lambda x: 192 + (x - mx) * sc; Y = lambda y: 98 - (y - my) * sc
        a = small(fx, (8, 8, 112, 84), 'dd', 'x(t)') + small(fy, (8, 104, 112, 84), 'd', 'y(t)')
        a += f'<rect x="132" y="8" width="120" height="180" style="fill:none;stroke:var(--line);stroke-width:1"/>' + pline([(X(x), Y(y)) for x, y in zip(xs, ys)], 'f', 2.4)
        L = math.hypot(dx, dy); a += arr(X(fx(t0)), Y(fy(t0)), X(fx(t0)) + 30 * dx / L, Y(fy(t0)) - 30 * dy / L, 'tan', '', 2.6) + dot(X(fx(t0)), Y(fy(t0)), '', 'tan', r=4.5)
        why = (f'At the marked time x(t) is {"increasing" if dx > 0 else "decreasing"} (moving {"right" if dx > 0 else "left"}) and y(t) is '
               f'{"increasing" if dy > 0 else "decreasing"} (moving {"up" if dy > 0 else "down"}): the point heads {opts[k]}. ({eq}, t = {t0})')
        cases.append(('x(t) and y(t) near the marked time are shown. Which way is the point moving?', _svg(b, 196, f'Graphs of x(t) and y(t) for {eq}'), _svg(a, 196, f'The path of {eq} with the direction of motion'), opts, k, why))
    return drill('Which way is it moving? 6 cases', 'Read the direction from x(t) and y(t) alone, then see the path.', cases, 'qr-drill')

def _qr_fig():
    P = Plot((0, 48), (0, 10.5), (34, 12, 214, 186))
    xs = lambda t: 18 * t; ys = lambda t: 1 + 12 * t - 4.9 * t * t
    T = (12 + math.sqrt(163.6)) / 9.8
    base = P.axes([10, 20, 30, 40], [2, 4, 6, 8, 10], 'x (m)', 'y (m)')
    pts = [(P.X(xs(T * i / 120)), P.Y(ys(T * i / 120))) for i in range(121)]
    L = [(1, pline(pts, 'f', 2.6) + ''.join(P.dot(xs(t), ys(t), f't = {t}', 'f', 18 if t == 0 else 0, 4 if t == 0 else -9 if t == 1 else 14, 4) for t in (0, 1, 2)), 'x = 18t, y = 1 + 12t − 4.9t²', 'f'),
         (2, P.seg(0, 1, 18, 8.1, 'tan', 2.4, '6 4') + P.text(7, 6.6, 'slope 0.394', 'tan', 10, 'end'), '[0, 1]: Δx/Δt = 18, Δy/Δt = 7.1', 'tan'),
         (3, P.seg(18, 8.1, 36, 5.4, 'dd', 2.4, '6 4') + P.text(30, 8.6, 'slope −0.15', 'dd', 10, 'start'), '[1, 2]: Δx/Δt = 18, Δy/Δt = −2.7', 'dd'),
         (4, '', 'Δy/Δx = (Δy/Δt) ÷ (Δx/Δt)', 'ink')]
    return fig(base, L, 'Average rates over two seconds of a kicked ball: same sideways rate, very different vertical rate.', 222)

def _run_fig():
    cx, cy, R = 70, 150, 120
    base = f'<path d="M{cx + R} {cy} A{R} {R} 0 0 0 {cx} {cy - R}" style="fill:none;stroke:var(--line);stroke-width:1.5;stroke-dasharray:4 4"/>' + ln(cx - 10, cy, cx + R + 20, cy, 'mut', 1) + ln(cx, cy + 10, cx, cy - R - 12, 'mut', 1) + txt(cx - 6, cy + 14, 'O', 'mut', 11)
    L = [(1, f'<path d="M{cx + R} {cy} A{R} {R} 0 0 0 {cx} {cy - R}" style="fill:none;stroke:var(--cx);stroke-width:3"/>' + dot(cx + R, cy, 't = 0 (50, 0)', 'f', -4, 16, 5) + dot(cx, cy - R, 't = 20 (0, 50)', 'f', 52, -2, 5), 'arc: 78.54 m in 20 s', 'f'),
         (2, ln(cx + R, cy, cx, cy - R, 'tan', 2.2, '6 4') + txt(cx + R / 2 - 16, cy - R / 2 - 2, '70.71 m', 'tan', 11, 'end'), 'chord (straight line): 70.71 m', 'tan'),
         (3, arr(cx + R + 2, cy + 22, cx + 4, cy + 22, 'dd', '', 2.2) + txt(cx + R / 2, cy + 36, 'Δx/Δt = −2.5 m/s', 'dd', 10), 'Δx/Δt = −50/20 = −2.5 m/s', 'dd'),
         (4, arr(cx + R + 40, cy - 2, cx + R + 40, cy - R + 4, 'd', '', 2.2) + txt(cx + R + 36, cy - R - 6, 'Δy/Δt = 2.5', 'd', 10, 'end'), 'Δy/Δt = 50/20 = 2.5 m/s', 'd')]
    return fig(base, L, 'A quarter lap on a circular track of radius 50 m (one lap in 80 s).', 200)

mod('paramroc', 'Parametric rates of change',
 'A moving point has two rates: how fast it moves sideways and how fast it moves up. Their ratio is the slope of the path.',
 ['For a parametric function (x(t), y(t)), each coordinate has its own <b>rate of change</b>. Over an interval [t₁, t₂], the average rates are <span class="m">Δx/Δt = (x(t₂) − x(t₁))/(t₂ − t₁)</span> and <span class="m">Δy/Δt</span>, defined the same way. They are the horizontal and vertical speeds of the point, on average.',
  'The slope of the line through the two points of the path, the <b>average rate of change of y with respect to x</b>, is the ratio of the two: <span class="m">Δy/Δx = (Δy/Δt) / (Δx/Δt)</span>, as long as Δx ≠ 0. The time cancels. As the interval shrinks, these rates approach the rates at an instant, and the slope approaches the direction the point is heading.',
  'Signs tell direction: if x(t) is increasing on an interval, the point moves right; decreasing, left. If y(t) is increasing it moves up. Where x(t) has a turning point the path has a <b>vertical</b> tangent (the point momentarily moves straight up or down); where y(t) turns, a <b>horizontal</b> one.'],
 ('rate of change meant Δy/Δx for one function', 'a way to talk about sideways and vertical speed separately', 'a moving point has a horizontal rate and a vertical rate at the same time', 'average rates of x(t) and y(t), the slope Δy/Δx of the path, and direction from the signs'),
 [('Δx/Δt = (x(t₂) − x(t₁))/(t₂ − t₁)', 'horizontal rate'), ('Δy/Δt = (y(t₂) − y(t₁))/(t₂ − t₁)', 'vertical rate'), ('Δy/Δx = (Δy/Δt) / (Δx/Δt)', 'slope of the path'), ('x(t) increasing', 'moving right'), ('y(t) turns', 'horizontal tangent')],
 [lab('qr-lab', 'Average rates on an interval', canvas='qr-canvas', aria='Graphs of x against t and y against t with secant lines over [t1, t2], and the path with the chord between the two points.',
   seg=('qr-pre', 'Motion', [('proj', 'Kicked ball'), ('run', 'Runner on a track'), ('liss', 'Figure-eight')]),
   pre='<p class="small" id="qr-eq" style="margin:0;font:600 15px var(--f-math)"></p>',
   ctl=[('qr-a', 't₁', 0, 6.283, .01, 0), ('qr-b', 't₂', 0, 6.283, .01, 1)],
   out=[('qr-dx', 'Δx/Δt', 'x'), ('qr-dy', 'Δy/Δt', 'v'), ('qr-m', 'Δy/Δx (slope of the chord)', '')]),
  lab('qr-lab2', 'Shrink the interval: direction at an instant', canvas='qr-canvas2', aria='A path with the chord from t to t + h, its horizontal and vertical parts, and markers where the tangent is horizontal or vertical.',
   seg=('qr-pre2', 'Path', [('liss', 'Figure-eight'), ('circ', 'Circle'), ('cyc', 'Pebble in a tire')]),
   ctl=[('qr-t', 'Time t', 0, 6.283, .01, .5), ('qr-h', 'Interval h', .01, 1.5, .01, 1)],
   out=[('qr-rate', '(Δx/Δt, Δy/Δt)', 'x'), ('qr-dir', 'heading', 'v'), ('qr-tan', 'tangent here', '')])],
 [('Choose <b>Kicked ball</b> with t₁ = 0 and t₂ = 1. Then move both up by 1 second. Which rate stays the same?', show(['click', '#qr-pre [data-k=proj]'], ['#qr-a', 0], ['#qr-b', 1]), 'Δx/Δt = 18 m/s on every interval: x(t) = 18t is linear. Δy/Δt drops from 7.1 to −2.7 m/s: the ball rises, then falls.'),
  ('Choose <b>Runner on a track</b>, t₁ = 0 and t₂ = 20. Why is Δx/Δt negative while the runner is going forward?', show(['click', '#qr-pre [data-k=run]'], ['#qr-a', 0], ['#qr-b', 20]), 'Running counterclockwise from (50, 0) to (0, 50), x shrinks from 50 to 0: Δx/Δt = −2.5 m/s, moving left, even though the runner never slows down.'),
  ('Choose <b>Figure-eight</b> and set t₁ = 0, t₂ = π (3.14). What is the slope of the chord, and why?', show(['click', '#qr-pre [data-k=liss]'], ['#qr-a', 0], ['#qr-b', 3.14]), 'Both endpoints are the origin, so Δx = Δy = 0: no chord, the slope is undefined. Average rates of 0 do not mean the point stood still.'),
  ('In the second lab, choose <b>Circle</b> and shrink h toward 0.01. What does the chord turn into?', show(['click', '#qr-pre2 [data-k=circ]'], ['#qr-t', .5], ['#qr-h', .01]), 'The tangent direction: the chord rotates until it just touches the circle at the point, perpendicular to the radius.'),
  ('With <b>Figure-eight</b>, find a time where the tangent is vertical. What is x(t) doing there?', show(['click', '#qr-pre2 [data-k=liss]'], ['#qr-t', 1.57], ['#qr-h', .01]), 'At t = π/2 the point is at the right end (3, 0): x(t) = 3 sin t reaches its maximum and turns around, so Δx/Δt → 0 while y keeps changing. The path is vertical there.')],
 [('A ball is kicked with x(t) = 18t and y(t) = 1 + 12t − 4.9t² (meters, seconds). Find the average rates of change of x and y, and the slope of the path, on [0, 1] and on [1, 2].', [
   '<b>Positions.</b> t = 0: (0, 1). t = 1: (18, 8.1). t = 2: (36, 5.4), since y(2) = 1 + 24 − 19.6 = 5.4.',
   '<b>[0, 1].</b> Δx/Δt = (18 − 0)/1 = <b>18 m/s</b>; Δy/Δt = (8.1 − 1)/1 = <b>7.1 m/s</b>; slope Δy/Δx = 7.1/18 ≈ <b>0.394</b>.',
   '<b>[1, 2].</b> Δx/Δt = 18 m/s again; Δy/Δt = (5.4 − 8.1)/1 = <b>−2.7 m/s</b>; slope = −2.7/18 = <b>−0.15</b>.',
   '<b>Read it.</b> Same sideways speed, but the vertical rate went from positive to negative: the ball passed its highest point between t = 1 and t = 2 (at t ≈ 1.22 s).'], _qr_fig()),
  {'h': 'Worked example 2: a runner on a circular track', 'fig': _run_fig(),
   'prob': 'A runner goes counterclockwise around a circular track of radius 50 m, centered at the origin, starting at (50, 0) and taking 80 s per lap: x(t) = 50 cos(πt/40), y(t) = 50 sin(πt/40). Find Δx/Δt and Δy/Δt on [0, 20], and compare the distance run with the straight-line distance.',
   'steps': ['<b>Positions.</b> t = 0: (50, 0). t = 20: πt/40 = π/2, so (0, 50), a quarter lap.',
    '<b>Rates.</b> Δx/Δt = (0 − 50)/20 = <b>−2.5 m/s</b> (moving left); Δy/Δt = (50 − 0)/20 = <b>2.5 m/s</b> (moving up). The chord has slope 2.5/(−2.5) = −1.',
    '<b>Distance run.</b> A quarter of the circumference: 2π(50)/4 = 25π ≈ <b>78.54 m</b>, at a constant 78.54/20 ≈ 3.93 m/s.',
    '<b>Straight line.</b> The chord is 50√2 ≈ <b>70.71 m</b>, so the average rates describe a slower, straight-line trip (√(2.5² + 2.5²) ≈ 3.54 m/s). Average rates only see the endpoints.']}],
 ['Dividing Δx/Δt by Δy/Δt for the slope: it is (Δy/Δt) / (Δx/Δt), rise over run.', 'Reading a negative Δx/Δt as "slowing down": it means moving left.', 'Expecting the slope of the path to exist when Δx = 0, or that zero average rates mean no motion.', 'Using x-values instead of t-values in the denominator of Δx/Δt.'],
 ('Rates at an instant',
  ['Shrinking the interval turns the average rates into the rates at an instant: the horizontal and vertical velocity. In calculus these are x′(t) and y′(t), and the slope of the path is dy/dx = y′(t)/x′(t). Precalculus works with average rates and with the signs (which way, and where it turns); the lab shows the limit as a picture.']),
 [('On [2, 5], x(t) goes from 4 to −2 and y(t) from 1 to 10. What is the average rate of change of y with respect to x?', ['−3/2', '−2/3', '3', '−2'], 0, 'Δy/Δt = 9/3 = 3 and Δx/Δt = −6/3 = −2, so Δy/Δx = 3/(−2) = −3/2.'),
  ('On an interval, x(t) is increasing and y(t) is decreasing. The point is moving', ['up and right', 'down and right', 'up and left', 'down and left'], 1, 'x increasing: right. y decreasing: down.')],
 extra_after_labs=_qr_drill(), ced=('4.3',))
