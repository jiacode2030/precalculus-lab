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


# =====================================================================
# 4.5, 4.7  Implicitly defined functions
# =====================================================================
def _imp_fig():
    P = Plot((-7.5, 7.5), (-7, 7), (30, 8, 210, 196))
    R = 5
    circ_pts = [(P.X(R * math.cos(t)), P.Y(R * math.sin(t))) for t in [2 * math.pi * i / 240 for i in range(241)]]
    top = P.curve(lambda x: math.sqrt(max(0, 25 - x * x)), -5, 5, 'f', 2.8, '', 160)
    bot = P.curve(lambda x: -math.sqrt(max(0, 25 - x * x)), -5, 5, 'd', 2.8, '', 160)
    base = P.axes([-5, 5], [-5, 5], 'x', 'y', True)
    L = [(1, pline(circ_pts, 'f', 2.8), 'the curve x² + y² = 25: a circle of radius 5', 'f'),
         (2, P.seg(3, -6.4, 3, 6.4, 'tan', 1.6, '5 4') + P.dot(3, 4, '(3, 4)', 'tan', -26, 14, 5) + P.dot(3, -4, '(3, −4)', 'tan', 24, 4, 5), 'at x = 3: y² = 16, so y = 4 or y = −4', 'tan'),
         (3, top + bot + P.text(-3.2, 5.9, 'y = √(25 − x²)', 'f', 10, 'end') + P.text(-3.2, -6.3, 'y = −√(25 − x²)', 'd', 10, 'end'), 'two halves: upper blue, lower green', 'd'),
         (4, P.dot(4, 3, '(4, 3)', 'dd', 24, 10, 5) + P.dot(4, 4, '(4, 4)', 'ink', 24, -9, 4) + hole(P.X(4), P.Y(4), 'ink', 4.4), '(4, 3) is on it; (4, 4) is outside', 'dd')]
    return fig(base, L, 'The circle x² + y² = 25 is not a function of x, but each half is.', 215)

def _imp2_fig():
    P = Plot((-7.5, 7.5), (-7, 7), (30, 8, 210, 196))
    circ_pts = [(P.X(5 * math.cos(t)), P.Y(5 * math.sin(t))) for t in [2 * math.pi * i / 240 for i in range(241)]]
    base = P.axes([-5, 5], [-5, 5], 'x', 'y', True) + pline(circ_pts, 'f', 2.8)
    L = [(1, P.seg(-6.5, -5.5, 6, 7, 'd', 2.4) + P.text(7.4, 4.2, 'y = x + 1', 'd', 10, 'end'), 'the line y = x + 1', 'd'),
         (2, '', 'substitute: x² + (x + 1)² = 25, so 2x² + 2x + 1 = 25', 'tan'),
         (3, '', '2x² + 2x − 24 = 0, so x² + x − 12 = 0 and (x + 4)(x − 3) = 0', 'dd'),
         (4, P.dot(3, 4, '(3, 4)', 'tan', 20, -2, 5) + P.dot(-4, -3, '(−4, −3)', 'tan', -2, 16, 5), 'x = 3 gives y = 4; x = −4 gives y = −3', 'tan')]
    return fig(base, L, 'A line meets the circle where both equations hold.', 215)

mod('implicit', 'Implicit functions',
 'Some curves are given by an equation in x and y rather than as y = f(x). Substitute to test points, solve for y when you can, and watch for two y-values at one x.',
 ['An <b>implicitly defined</b> curve is the set of points (x, y) that satisfy an equation such as <span class="m">x² + y² = 25</span> or <span class="m">xy = 4</span>. A point is <b>on the curve</b> exactly when substituting its coordinates makes the equation true: (3, 4) works for the circle because 3² + 4² = 25, but (4, 4) does not because 32 ≠ 25.',
  'Such a curve is often <b>not a function of x</b>: a vertical line can hit it more than once. For the circle, x = 3 gives y² = 16, so y = 4 <i>or</i> y = −4. Solving for y gives <span class="m">y = ±√(25 − x²)</span>, two functions: the upper half and the lower half. Each half passes the vertical line test. When there is no solution (for example x = 6 on this circle), the vertical line misses the curve and x is outside its domain.',
  'To find where two curves meet, substitute one equation into the other and solve, then use the original equations to find the y-values (and check them in both). A curve can also be described by a <b>parametrization</b>: the circle x² + y² = 25 is x = 5 cos t, y = 5 sin t, which handles both y-values at once and gives the curve a direction.'],
 ('a graph was y = f(x), so each x had exactly one y', 'a curve could have two points above the same x', 'an equation in x and y defines a set of points, and a function may only describe part of it', 'implicitly defined curves, testing points, solving for y with ±, domain and the vertical line test, and intersections'),
 [('point on curve ⇔ equation true', 'substitute and compare'), ('x² + y² = r²', 'y = ±√(r² − x²)'), ('xy = k', 'y = k/x, x ≠ 0'), ('intersection: substitute, solve, check', 'both equations'), ('x = r cos t, y = r sin t', 'parametrization')],
 [lab('im-lab', 'Sweep a vertical line', canvas='im-canvas', aria='An implicitly defined curve drawn in two colored branches, with a movable vertical line and dots where it crosses the curve.',
   seg=('im-set', 'Curve', [('circ', 'x² + y² = 25'), ('ell', 'x²/16 + y²/9 = 1'), ('hyp', 'x² − y² = 4'), ('rec', 'xy = 4'), ('cub', 'y² = x³ − 3x + 3')]),
   ctl=[('im-x', 'Vertical line x =', -7, 7, .05, 3)],
   out=[('im-pts', 'points of the curve on that line', 'x'), ('im-n', 'number of points', 'v'), ('im-fn', 'so at this x', '')]),
  lab('im-lab2', 'Is the point on the curve?', canvas='im-canvas2', aria='An implicitly defined curve with a movable point; the equation is evaluated with the point substituted and the two sides are compared.',
   seg=('im-set2', 'Curve', [('circ', 'x² + y² = 25'), ('ell', 'x²/16 + y²/9 = 1'), ('hyp', 'x² − y² = 4'), ('rec', 'xy = 4'), ('cub', 'y² = x³ − 3x + 3')]),
   pre='<div class="row"><button type="button" class="btn primary" id="im-try">Try a point on the curve</button></div>',
   ctl=[('im-px', 'Point x =', -7, 7, .1, 3), ('im-py', 'Point y =', -7, 7, .1, 3)],
   out=[('im-sub', 'substitute', 'x'), ('im-cmp', 'left side vs right side', 'v'), ('im-ver', 'verdict', '')])],
 [('Choose <b>x² + y² = 25</b> and sweep the line to x = 3. How many points, and what are they?', show(['click', '#im-set [data-k=circ]'], ['#im-x', 3]), 'Two: (3, 4) and (3, −4). The vertical line meets the circle twice, so the circle is not the graph of a function of x.'),
  ('Move the line to x = 5, then x = 6 on the circle. What happens?', show(['click', '#im-set [data-k=circ]'], ['#im-x', 5]), 'At x = 5 the line just touches at (5, 0) (one point, y = 0). At x = 6 it misses the circle: x is outside the domain of the curve.'),
  ('Choose <b>xy = 4</b> and sweep through x = 0. What is special there?', show(['click', '#im-set [data-k=rec]'], ['#im-x', 0]), 'No point at all: xy = 0 never equals 4. The curve has two branches that never reach the y-axis (the y-axis is a vertical asymptote). Every other vertical line meets it exactly once, so xy = 4 is the function y = 4/x.'),
  ('In the second lab choose the circle and press <b>Try a point</b> a few times, then nudge the point off the curve. What do the two sides do?', show(['click', '#im-set2 [data-k=circ]'], ['click', '#im-try']), 'On the curve the two sides are equal (25 = 25). Moving the point inside makes the left side smaller than 25; moving it outside makes it larger.')],
 [{'h': 'Worked example: two points at one x', 'fig': _imp_fig(),
   'prob': 'For the curve x² + y² = 25: (a) find every point with x = 3; (b) is the curve a function of x? Write y in terms of x; (c) is (4, 3) on the curve? Is (4, 4)?',
   'steps': ['<b>(a)</b> Substitute x = 3: 9 + y² = 25, so y² = 16 and y = <b>4 or −4</b>. The points are (3, 4) and (3, −4).',
    '<b>(b)</b> One x with two y-values means it is <b>not a function of x</b>. Solving for y: y² = 25 − x², so <b>y = ±√(25 − x²)</b> with −5 ≤ x ≤ 5. The + sign is the upper half and the − sign the lower half; each half is a function.',
    '<b>(c)</b> (4, 3): 4² + 3² = 16 + 9 = 25 ✓, <b>on the curve</b>. (4, 4): 16 + 16 = 32 ≠ 25, <b>not on it</b> (32 > 25, so it is outside the circle).',
    '<b>Domain.</b> Because 25 − x² ≥ 0 is needed, x must be between −5 and 5. At x = ±5 the two halves meet at (±5, 0).']},
  {'h': 'Worked example 2: where a line meets the circle', 'fig': _imp2_fig(),
   'prob': 'Find the points where the circle x² + y² = 25 meets the line y = x + 1.',
   'steps': ['<b>Substitute.</b> Replace y by x + 1: x² + (x + 1)² = 25, which is 2x² + 2x + 1 = 25.',
    '<b>Solve.</b> 2x² + 2x − 24 = 0, divide by 2: x² + x − 12 = 0, so (x + 4)(x − 3) = 0 and <b>x = 3 or x = −4</b>.',
    '<b>Find y</b> from the line: x = 3 gives y = 4; x = −4 gives y = −3. The points are <b>(3, 4) and (−4, −3)</b>.',
    '<b>Check in the circle.</b> 3² + 4² = 25 ✓ and (−4)² + (−3)² = 16 + 9 = 25 ✓.']}],
 ['Writing y = √(25 − x²) and calling that the whole circle: it is only the upper half.', 'Forgetting the ± when you take a square root to solve for y.', 'Finding x in an intersection but not matching it with the right y: use the line to find y, not the circle (which gives two values).', 'Testing a point in only one side of the equation without simplifying both.'],
 ('Level curves and the idea of a curve you cannot solve for y',
  ['Some curves, like x³ + y³ = 6xy, cannot be solved neatly for y at all, yet they are perfectly good curves: a point is on one exactly when its coordinates satisfy the equation. In calculus you will find slopes of such curves without solving for y, by differentiating both sides (implicit differentiation).']),
 [('How many points of x² + y² = 36 have x = 4?', ['2', '1', '0', '3'], 0, '16 + y² = 36, y² = 20, y = ±√20: two points.'),
  ('Which point is on the curve xy = 12?', ['(3, 4)', '(3, 9)', '(2, 5)', '(6, 3)'], 0, '3 · 4 = 12.')],
 ced=('4.5', '4.7'))


# =====================================================================
# 4.6  Conic sections
# =====================================================================
def _par(f, a, b, n=200):
    return [f(a + (b - a) * i / n) for i in range(n + 1)]

def _cx_fig1():
    P = Plot((-5.7, 8.3), (-9.5, 3.5), (30, 8, 210, 196))
    h, k, a, b = 2, -3, 2, 3; c = math.sqrt(b * b - a * a)
    el = pline([(P.X(h + a * math.cos(t)), P.Y(k + b * math.sin(t))) for t in [2 * math.pi * i / 200 for i in range(201)]], 'f', 2.8)
    base = P.axes([-4, 0, 4, 8], [-8, -4, 0], 'x', 'y', True)
    L = [(1, el, 'completed squares: (x − 2)²/4 + (y + 3)²/9 = 1', 'f'),
         (2, P.dot(h, k, '(2, −3)', 'ink', 0, 16, 4) + ''.join(P.dot(x, y, '', 'ink', r=3.6) for x, y in [(2, 0), (2, -6), (0, -3), (4, -3)]) + P.text(2.3, .6, '(2, 0)', 'ink', 10, 'start'), 'center (2, −3); vertices (2, 0), (2, −6), (0, −3), (4, −3)', 'ink'),
         (3, P.dot(h, k + c, 'F₁', 'dd', 14, 4, 5) + P.dot(h, k - c, 'F₂', 'dd', 14, 4, 5), 'foci (2, −3 ± √5) ≈ (2, −0.76) and (2, −5.24)', 'dd'),
         (4, '', 'the longer semi-axis (3) is vertical, so the foci lie on x = 2', 'tan')]
    return fig(base, L, 'The ellipse 9x² + 4y² − 36x + 24y + 36 = 0.', 215)

def _cx_fig2():
    P = Plot((-9.5, 9.5), (-9.5, 9.5), (22, 8, 214, 200))
    base = P.axes([-6, -3, 3, 6], [-6, -3, 3, 6], 'x', 'y', True)
    t1 = math.asinh(9 / 4)
    br = lambda s: pline([(P.X(s * 3 * math.cosh(t)), P.Y(4 * math.sinh(t))) for t in [-t1 + 2 * t1 * i / 160 for i in range(161)]], 'f', 2.8)
    L = [(1, P.dot(3, 0, '', 'ink', r=4) + P.dot(-3, 0, '', 'ink', r=4), 'vertices (±3, 0): a = 3', 'ink'),
         (2, P.dot(5, 0, 'F₂', 'dd', 0, -9, 5) + P.dot(-5, 0, 'F₁', 'dd', 0, -9, 5), 'foci (±5, 0): c = 5, so b² = c² − a² = 16', 'dd'),
         (3, P.seg(-3, -4, 3, -4, 'area', 1.4, '4 3') + P.seg(-3, 4, 3, 4, 'area', 1.4, '4 3') + P.seg(-3, -4, -3, 4, 'area', 1.4, '4 3') + P.seg(3, -4, 3, 4, 'area', 1.4, '4 3') + P.seg(-8, -32 / 3, 8, 32 / 3, 'area', 1.6, '6 4') + P.seg(-8, 32 / 3, 8, -32 / 3, 'area', 1.6, '6 4'), 'b = 4: the 3-by-4 box, and its diagonals y = ±(4/3)x', 'area'),
         (4, br(1) + br(-1), 'branches start at the vertices and approach the diagonals', 'f')]
    return fig(base, L, 'The hyperbola x²/9 − y²/16 = 1.', 225)

def _cx_curve(kind, P, c):
    if kind == 'circ':
        return pline([(P.X(c[2] * math.cos(t)), P.Y(c[2] * math.sin(t))) for t in [2 * math.pi * i / 200 for i in range(201)]], 'f', 2.6)
    if kind == 'ell':
        return pline([(P.X(c[2] * math.cos(t)), P.Y(c[3] * math.sin(t))) for t in [2 * math.pi * i / 200 for i in range(201)]], 'f', 2.6)
    if kind == 'hyp':
        a, b = c[2], c[3]; t1 = math.asinh(P.yr[1] / b)
        return ''.join(pline([(P.X(s * a * math.cosh(t)), P.Y(b * math.sinh(t))) for t in [-t1 + 2 * t1 * i / 120 for i in range(121)]], 'f', 2.6) for s in (1, -1))
    p = c[2]
    return pline([(P.X(x), P.Y(x * x / (4 * p))) for x in [-P.xr[1] + 2 * P.xr[1] * i / 160 for i in range(161)] if x * x / (4 * p) <= P.yr[1]], 'f', 2.6)

def _cx_drill():
    cs = [('x² + y² = 16', 'circ', (0, 0, 4), 'circle', 'Both squared, same sign, same coefficient: a circle of radius 4.'),
          ('x²/25 + y²/9 = 1', 'ell', (0, 0, 5, 3), 'ellipse', 'Both squared, same sign, different denominators: an ellipse with semi-axes 5 and 3.'),
          ('x² − y²/4 = 1', 'hyp', (0, 0, 1, 2), 'hyperbola', 'The squared terms have opposite signs: a hyperbola, opening left and right (the x² term is positive).'),
          ('x² = 6y', 'par', (0, 0, 1.5), 'parabola', 'Only one variable is squared: a parabola with 4p = 6, so p = 1.5. It opens upward.'),
          ('4x² + y² = 36', 'ell', (0, 0, 3, 6), 'ellipse', 'Both squared and added: an ellipse. Dividing by 36 gives x²/9 + y²/36 = 1: semi-axes 3 and 6.'),
          ('y²/9 − x²/4 = 1', 'hyp', (0, 0, 2, 3), 'hyperbola', 'Opposite signs: a hyperbola. The y² term is positive, so it opens up and down.')]
    cases = []
    names = ['circle', 'ellipse', 'hyperbola', 'parabola']
    for eq, kind, c, ans, why in cs:
        if kind == 'hyp' and eq.startswith('y²'):
            P = Plot((-7, 7), (-5, 5), (14, 8, 232, 144)); a, b = 3, 2
            t1 = math.asinh(5 / 3)
            crv = ''.join(pline([(P.X(b * math.sinh(t)), P.Y(s * a * math.cosh(t))) for t in [-t1 + 2 * t1 * i / 120 for i in range(121)]], 'f', 2.6) for s in (1, -1))
        elif kind == 'hyp':
            P = Plot((-7, 7), (-5, 5), (14, 8, 232, 144)); crv = _cx_curve('hyp', P, (0, 0, 1, 2))
        elif kind == 'par': P = Plot((-7, 7), (-1.2, 5), (14, 8, 232, 144)); crv = _cx_curve('par', P, c)
        else: P = Plot((-7, 7), (-7, 7), (14, 8, 232, 144)) if kind == 'ell' and c[3] == 6 else Plot((-7, 7), (-5, 5), (14, 8, 232, 144)); crv = _cx_curve(kind, P, c)
        ax = P.axes([], [], 'x', 'y')
        cases.append((f'The equation is <b>{eq}</b>. Which conic is it?', svg(txt(130, 84, eq, 'ink', 22, w=600), 160, f'The equation {eq}'), svg(ax + crv, 160, f'The graph of {eq}'), names, names.index(ans), why))
    return drill('Name the conic', 'Look at the squared terms: how many, which signs, which coefficients?', cases, 'cn-drill')

mod('conics', 'Conic sections',
 'Slice a cone and you get four curves. Their equations differ in just the squared terms: one square gives a parabola, two squares added give a circle or an ellipse, two squares subtracted give a hyperbola.',
 ['The four <b>conic sections</b> have standard forms. <b>Circle</b>: <span class="m">(x − h)² + (y − k)² = r²</span>. <b>Ellipse</b>: <span class="m">(x − h)²/a² + (y − k)²/b² = 1</span>, centered (h, k) with semi-axes a (horizontal) and b (vertical). <b>Hyperbola</b>: <span class="m">(x − h)²/a² − (y − k)²/b² = 1</span> opens left and right (swap the terms to open up and down). <b>Parabola</b>: <span class="m">(x − h)² = 4p(y − k)</span>, vertex (h, k), opening up (p &gt; 0) or down.',
  'Each has a <b>distance rule</b> built on special points. An ellipse is all points whose distances to two <b>foci</b> add to a constant (2a). A hyperbola is all points whose distances to the foci differ by a constant (2a). A parabola is all points equally far from the <b>focus</b> and a line, the <b>directrix</b>. Where the foci are: ellipse <span class="m">c² = |a² − b²|</span> along the longer axis; hyperbola <span class="m">c² = a² + b²</span>; parabola the focus is p from the vertex.',
  'To read a conic from a general equation, <b>complete the square</b> in x and in y to reach a standard form. The hyperbola\'s branches approach the <b>asymptotes</b> <span class="m">y − k = ±(b/a)(x − h)</span> (for the left-right form), which are the diagonals of the box a by b around the center.'],
 ('curves were graphs of functions or implicit equations such as the circle', 'a catalog of the main second-degree curves', 'the equation type tells the shape, and the constants tell the size, center and focus', 'standard forms of circles, ellipses, hyperbolas and parabolas, foci, vertices, asymptotes and completing the square'),
 [('(x − h)² + (y − k)² = r²', 'circle'), ('(x − h)²/a² + (y − k)²/b² = 1', 'ellipse, c² = |a² − b²|'), ('(x − h)²/a² − (y − k)²/b² = 1', 'hyperbola, c² = a² + b²'), ('(x − h)² = 4p(y − k)', 'parabola, focus p from the vertex'), ('y − k = ±(b/a)(x − h)', 'hyperbola asymptotes')],
 [lab('cn-lab', 'Build a conic', canvas='cn-canvas', aria='A conic section drawn from its equation, with its center, vertices, foci and guide lines marked, and the constants adjustable.',
   seg=('cn-set', 'Conic', [('circ', 'Circle'), ('ell', 'Ellipse'), ('hyp', 'Hyperbola'), ('par', 'Parabola')]),
   pre='<div class="seg" id="cn-or" role="group" aria-label="orientation"><button type="button" data-k="h" aria-pressed="true">Horizontal</button><button type="button" data-k="v" aria-pressed="false">Vertical</button></div>',
   ctl=[('cn-h', 'h (center x)', -4, 4, 1, 0), ('cn-k', 'k (center y)', -4, 4, 1, 0), ('cn-a', 'a (circle: r, parabola: p)', 1, 6, .5, 3), ('cn-b', 'b', 1, 6, .5, 2)],
   out=[('cn-eq', 'equation', 'x'), ('cn-pt', 'center / vertex', 'v'), ('cn-fo', 'foci and extras', '')]),
  lab('cn-lab2', 'The distance rule', canvas='cn-canvas2', aria='A point moves along an ellipse, a hyperbola or a parabola, with lines to the foci or to the focus and directrix, and the distances are reported.',
   seg=('cn-set2', 'Conic', [('ell', 'Ellipse'), ('hyp', 'Hyperbola'), ('par', 'Parabola')]),
   ctl=[('cn-t', 'Move the point', 0, 6.283, .01, 1)],
   out=[('cn-d1', 'distance 1', 'x'), ('cn-d2', 'distance 2', 'v'), ('cn-rule', 'the rule', '')])],
 [('Choose <b>Ellipse</b>, Horizontal, a = 3 and b = 2. Where are the foci, and why are they on the x-axis?', show(['click', '#cn-set [data-k=ell]'], ['click', '#cn-or [data-k=h]'], ['#cn-a', 3], ['#cn-b', 2]), 'c² = a² − b² = 9 − 4 = 5, so the foci are (±√5, 0) ≈ (±2.24, 0): on the longer axis, which is horizontal because a is larger.'),
  ('Make a = b on the ellipse. What happens to the foci?', show(['click', '#cn-set [data-k=ell]'], ['#cn-a', 3], ['#cn-b', 3]), 'c = 0: the two foci merge at the center and the ellipse is a circle.'),
  ('Choose <b>Hyperbola</b>. Where are the asymptotes, and what do they do to the shape of the branches?', show(['click', '#cn-set [data-k=hyp]'], ['click', '#cn-or [data-k=h]'], ['#cn-a', 3], ['#cn-b', 2]), 'They are the lines y = ±(2/3)x through the center, the diagonals of the 3-by-2 box. The branches bend toward them and never touch them.'),
  ('In the second lab choose the ellipse and drag the point all the way around. What stays the same?', show(['click', '#cn-set2 [data-k=ell]'], ['#cn-t', 1]), 'The sum of the two distances to the foci is always 10 = 2a: it is the ellipse\'s defining rule.')],
 [{'h': 'Worked example: an ellipse from a general equation', 'fig': _cx_fig1(),
   'prob': 'Identify the conic 9x² + 4y² − 36x + 24y + 36 = 0 and find its center, vertices and foci.',
   'steps': ['<b>Group and complete the square.</b> 9(x² − 4x) + 4(y² + 6y) = −36 → 9(x − 2)² − 36 + 4(y + 3)² − 36 = −36, so 9(x − 2)² + 4(y + 3)² = 36. Divide by 36: <b>(x − 2)²/4 + (y + 3)²/9 = 1</b>, an ellipse.',
    '<b>Center and vertices.</b> Center (2, −3). The semi-axes are a = 2 (horizontal) and b = 3 (vertical). Vertices: (2 ± 0, −3 ± 3) = <b>(2, 0), (2, −6)</b> and (2 ± 2, −3) = <b>(0, −3), (4, −3)</b>.',
    '<b>Foci.</b> The longer axis is vertical (3 &gt; 2), so c² = 9 − 4 = 5 and c = √5 ≈ 2.236. Foci: <b>(2, −3 ± √5)</b> ≈ (2, −0.76) and (2, −5.24).',
    '<b>Check.</b> The point (2, 0): 9(0)² + 4(3)² = 36 ✓, on the curve. The distances from (2, 0) to the two foci are 0.76 and 5.24, which add to 6 = 2b ✓.']},
  {'h': 'Worked example 2: a hyperbola from its vertices and foci', 'fig': _cx_fig2(),
   'prob': 'A hyperbola centered at the origin has vertices (±3, 0) and foci (±5, 0). Find its equation and its asymptotes.',
   'steps': ['<b>Read a and c.</b> The vertices are at distance a = 3 and the foci at distance c = 5. The foci are on the x-axis, so the hyperbola opens left and right.',
    '<b>Find b.</b> For a hyperbola c² = a² + b², so b² = 25 − 9 = 16 and b = 4.',
    '<b>Equation.</b> <b>x²/9 − y²/16 = 1</b>.',
    '<b>Asymptotes.</b> y = ±(b/a)x = <b>±(4/3)x</b>, the diagonals of the 3-by-4 box. Check: at x = 5, y² = 16(25/9 − 1) = 256/9, so y = ±16/3 ≈ ±5.33, close to the asymptote value (4/3)(5) = 6.67 and under it ✓.']}],
 ['Mixing up ellipse and hyperbola foci: ellipse c² = a² − b² (subtract), hyperbola c² = a² + b² (add).', 'Reading a and b backwards: a goes with the x² term only for the horizontal form, and for an ellipse the larger denominator is the longer axis.', 'Forgetting to divide by the constant to get 1 on the right before reading a² and b².', 'Writing the asymptote slope as a/b: for the left-right form it is b/a.', 'Thinking a parabola\'s two arms are asymptotic: they are not, they just spread apart.'],
 ('Orbits, mirrors and radar dishes',
  ['A planet moves on an ellipse with the sun at one focus. A satellite dish is a parabola: signals parallel to its axis bounce to the focus. A hyperbola models a sonic boom\'s shape and the paths of some comets that pass the sun once. The foci and the distance rules are what make these curves useful.']),
 [('Which equation is an ellipse?', ['x²/9 + y²/4 = 1', 'x²/9 − y²/4 = 1', 'y = x²/9', 'x² + y² = 9'], 0, 'Both squared and added with different denominators: an ellipse. The last one is a circle.'),
  ('The hyperbola x²/16 − y²/9 = 1 has foci at', ['(±5, 0)', '(±7, 0)', '(0, ±5)', '(±√7, 0)'], 0, 'c² = a² + b² = 16 + 9 = 25, so c = 5 on the x-axis.')],
 extra_after_labs=_cx_drill(), ced=('4.6',))


# =====================================================================
# 4.8, 4.9  Vectors and vector-valued functions
# =====================================================================
def _vec(P, x1, y1, x2, y2, c, lab='', off=(0, 0), w=2.6, size=11):
    return arr(P.X(x1), P.Y(y1), P.X(x2), P.Y(y2), c, lab, w, off, size)

def _vc_fig1():
    P = Plot((-3, 9), (-2, 9), (30, 8, 210, 196))
    base = P.axes([-2, 2, 4, 6, 8], [2, 4, 6, 8], 'x', 'y', True)
    L = [(1, _vec(P, 0, 0, 3, 4, 'f') + P.text(3.4, 2.0, 'u = ⟨3, 4⟩', 'f', 11, 'start'), 'u = ⟨3, 4⟩, length |u| = 5', 'f'),
         (2, _vec(P, 3, 4, 1, 5, 'd') + P.dot(3, 4, '', 'ink', r=3) + P.text(2.1, 5.7, 'v', 'd', 12), 'v = ⟨−2, 1⟩ placed at the tip of u', 'd'),
         (3, _vec(P, 0, 0, 1, 5, 'dd', '', (0, 0), 2.8) + P.text(-2.8, 7.2, 'u + v = ⟨1, 5⟩', 'dd', 11, 'start'), 'u + v = ⟨3 − 2, 4 + 1⟩ = ⟨1, 5⟩', 'dd'),
         (4, _vec(P, 0, 0, 8, 7, 'tan', '', (0, 0), 2.4) + P.text(8.9, 3.8, '2u − v = ⟨8, 7⟩', 'tan', 11, 'end'), '2u − v = ⟨6 + 2, 8 − 1⟩ = ⟨8, 7⟩', 'tan')]
    return fig(base, L, 'Adding vectors tip to tail: u + v goes from the start of u to the end of v.', 215)

def _vc_fig2():
    P = Plot((-30, 240), (-40, 230), (30, 8, 210, 196))
    ux, uy = 250 * math.cos(math.radians(30)), 125
    base = P.axes([100, 200], [100, 200], 'x (east)', 'y (north)', True)
    L = [(1, _vec(P, 0, 0, ux, uy, 'f') + P.text(215, 45, '250 mph at 30°', 'f', 11, 'end'), 'plane: 250 mph at 30° above east', 'f'),
         (2, _vec(P, ux, uy, ux - 40, uy, 'd') + P.text(186, 142, 'wind 40 mph', 'd', 11, 'middle'), 'wind: 40 mph toward the west, ⟨−40, 0⟩', 'd'),
         (3, _vec(P, 0, 0, ux - 40, uy, 'dd', '', (0, 0), 3) + P.text(100, 88, '216.3 mph', 'dd', 11, 'middle') , 'actual velocity ⟨176.5, 125⟩', 'dd'),
         (4, P.text(60, 14, '35.3°', 'tan', 11, 'start') + ''.join(ln(P.X(50 * math.cos(math.radians(a))), P.Y(50 * math.sin(math.radians(a))), P.X(50 * math.cos(math.radians(a + 2))), P.Y(50 * math.sin(math.radians(a + 2))), 'tan', 2.4) for a in range(0, 35, 2)), 'direction: tan⁻¹(125/176.5) ≈ 35.3°', 'tan')]
    return fig(base, L, 'A wind pushes the plane off its heading: add the velocity vectors.', 215)

mod('vectors', 'Vectors',
 'A vector is an arrow: it has a length and a direction, but no fixed start. Adding vectors puts them tip to tail, and the components do the arithmetic.',
 ['A <b>vector</b> is a quantity with magnitude and direction, written in components as <span class="m">⟨a, b⟩</span>: a units right and b units up. Its <b>magnitude</b> is <span class="m">|v| = √(a² + b²)</span> and its <b>direction</b> is the angle θ with tan θ = b/a (choose the quadrant from the signs of a and b). Going the other way, a vector of magnitude r at angle θ has components <span class="m">⟨r cos θ, r sin θ⟩</span>. A <b>unit vector</b> has magnitude 1: divide a vector by its length.',
  'To <b>add</b> vectors, add components: ⟨a, b⟩ + ⟨c, d⟩ = ⟨a + c, b + d⟩. Geometrically, place the second arrow at the tip of the first (tip to tail); the sum goes from the start to the end. A <b>scalar multiple</b> kv has components ⟨ka, kb⟩: the same direction (or reversed if k &lt; 0) and length |k||v|. Subtraction u − v = u + (−v). Velocities, forces and displacements add this way, which is why a wind changes a plane\'s path.',
  'A <b>vector-valued function</b> r(t) = ⟨x(t), y(t)⟩ gives a position vector for each t: it is a parametric function written as a vector. The <b>displacement</b> from t₁ to t₂ is r(t₂) − r(t₁), and the <b>average velocity</b> is that displacement divided by t₂ − t₁, a vector pointing along the secant of the path.'],
 ('quantities were single numbers, or a point moved along one path', 'a way to combine direction and size, such as a wind and a heading', 'one number is not enough to describe motion in the plane: direction matters', 'vectors in component form, magnitude and direction, vector addition, scalar multiples, and vector-valued functions'),
 [('|⟨a, b⟩| = √(a² + b²)', 'magnitude'), ('⟨r cos θ, r sin θ⟩', 'from magnitude and direction'), ('⟨a, b⟩ + ⟨c, d⟩ = ⟨a + c, b + d⟩', 'sum'), ('k⟨a, b⟩ = ⟨ka, kb⟩', 'scalar multiple'), ('r(t₂) − r(t₁)', 'displacement')],
 [lab('vc-lab', 'Add and scale vectors', canvas='vc-canvas', aria='Two vectors u and v drawn tip to tail, their sum from the origin, and a parallelogram, with components adjustable.',
   ctl=[('vc-u1', 'u horizontal', -6, 6, 1, 3), ('vc-u2', 'u vertical', -6, 6, 1, 4), ('vc-v1', 'v horizontal', -6, 6, 1, -2), ('vc-v2', 'v vertical', -6, 6, 1, 1), ('vc-s', 'scalar k (for k·u)', -2, 3, .5, 1)],
   out=[('vc-sum', 'u + v', 'x'), ('vc-mag', '|u|, |v|, |u + v|', 'v'), ('vc-ku', 'k·u and u − v', '')]),
  lab('vc-lab2', 'Magnitude and direction', canvas='vc-canvas2', aria='A vector drawn from the origin at an angle with its horizontal and vertical components shown as a right triangle.',
   ctl=[('vc-r', 'Magnitude r', 0, 10, .5, 6), ('vc-th', 'Direction θ (degrees)', 0, 360, 5, 40)],
   out=[('vc-comp', 'components ⟨r cos θ, r sin θ⟩', 'x'), ('vc-unit', 'unit vector', 'v'), ('vc-back', 'back again: |v| and θ', '')]),
  lab('vc-lab3', 'A vector-valued function', canvas='vc-canvas3', aria='A path r of t with two position vectors from the origin and the displacement vector between the two points.',
   seg=('vc-fn', 'r(t)', [('lin', '⟨2t, 1 + t⟩'), ('par', '⟨t, 4 − t²/2⟩'), ('cir', '⟨3 cos t, 3 sin t⟩')]),
   ctl=[('vc-t1', 't₁', 0, 3, .1, 0.5), ('vc-t2', 't₂', 0, 3, .1, 2)],
   out=[('vc-disp', 'displacement r(t₂) − r(t₁)', 'x'), ('vc-dl', 'its length', 'v'), ('vc-av', 'average velocity = displacement / (t₂ − t₁)', '')])],
 [('Set u = ⟨3, 4⟩ and v = ⟨−2, 1⟩. What is u + v, and how long is it?', show(['#vc-u1', 3], ['#vc-u2', 4], ['#vc-v1', -2], ['#vc-v2', 1]), 'u + v = ⟨1, 5⟩, with length √(1 + 25) = √26 ≈ 5.10. Notice it is not 5 + √5: lengths do not add, components do.'),
  ('Make v = −u. What is u + v, and what does the picture show?', show(['#vc-u1', 3], ['#vc-u2', 4], ['#vc-v1', -3], ['#vc-v2', -4]), 'The zero vector ⟨0, 0⟩: v undoes u, so the tip returns to the start.'),
  ('In the second lab set r = 10 and θ = 90°. What are the components?', show(['#vc-r', 10], ['#vc-th', 90]), '⟨10 cos 90°, 10 sin 90°⟩ = ⟨0, 10⟩: a vector pointing straight up with no horizontal part.'),
  ('In the third lab choose the circle and set t₁ = 0, t₂ = 3.1. Why is the displacement almost 2r?', show(['click', '#vc-fn [data-k=cir]'], ['#vc-t1', 0], ['#vc-t2', 3.1]), 'At t = 0 the point is (3, 0) and at t ≈ π it is on the opposite side (−3, 0): displacement ⟨−6, 0⟩ of length about 6 = 2r.')],
 [{'h': 'Worked example: add and scale', 'fig': _vc_fig1(),
   'prob': 'Let u = ⟨3, 4⟩ and v = ⟨−2, 1⟩. Find |u|, the unit vector in the direction of u, u + v and its magnitude, and 2u − v.',
   'steps': ['<b>Magnitude.</b> |u| = √(3² + 4²) = √25 = <b>5</b>. The unit vector is u/|u| = <b>⟨3/5, 4/5⟩ = ⟨0.6, 0.8⟩</b>.',
    '<b>Place v at the tip of u</b> (or just add components).',
    '<b>Sum.</b> u + v = ⟨3 + (−2), 4 + 1⟩ = <b>⟨1, 5⟩</b>, with |u + v| = √(1 + 25) = √26 ≈ <b>5.10</b>.',
    '<b>Scalar multiple and difference.</b> 2u = ⟨6, 8⟩, so 2u − v = ⟨6 − (−2), 8 − 1⟩ = <b>⟨8, 7⟩</b>.']},
  {'h': 'Worked example 2: a plane in a crosswind', 'fig': _vc_fig2(),
   'prob': 'A plane flies at 250 mph at 30° above east (relative to the air). A wind blows at 40 mph toward the west. Find the plane\'s actual velocity, speed and direction.',
   'steps': ['<b>Plane in components.</b> ⟨250 cos 30°, 250 sin 30°⟩ = ⟨216.5, 125⟩.',
    '<b>Wind.</b> Toward the west is ⟨−40, 0⟩.',
    '<b>Add.</b> ⟨216.5 − 40, 125 + 0⟩ = <b>⟨176.5, 125⟩</b>. The speed is √(176.5² + 125²) = √46777 ≈ <b>216.3 mph</b>.',
    '<b>Direction.</b> tan θ = 125/176.5 = 0.708, so θ = tan⁻¹ 0.708 ≈ <b>35.3°</b> above east: the wind slows the plane down and turns it away from its heading.']}],
 ['Adding lengths instead of components: |u + v| is usually not |u| + |v|.', 'Finding the direction with tan⁻¹(b/a) without checking the quadrant: ⟨−3, 4⟩ is not in quadrant IV.', 'Treating the vector as fixed at the origin: a vector can be drawn anywhere, only its length and direction matter.', 'Using degrees and radians on the calculator in mismatch when computing r cos θ.'],
 ('Dot products and the angle between vectors',
  ['The <b>dot product</b> of u = ⟨a, b⟩ and v = ⟨c, d⟩ is a single number: <span class="m">u · v = ac + bd = |u||v| cos θ</span>, where θ is the angle between them. When u · v = 0 the vectors are perpendicular. For example ⟨3, 4⟩ · ⟨4, −3⟩ = 12 − 12 = 0, and they are indeed at a right angle. The dot product is the tool behind "how much of this force acts along that direction".']),
 [('The magnitude of ⟨5, 12⟩ is', ['13', '17', '7', '60'], 0, '√(25 + 144) = √169 = 13.'),
  ('If u = ⟨1, 2⟩ and v = ⟨3, −1⟩ then 2u + v is', ['⟨5, 3⟩', '⟨4, 1⟩', '⟨5, 1⟩', '⟨7, 3⟩'], 0, '2u = ⟨2, 4⟩; add ⟨3, −1⟩ to get ⟨5, 3⟩.')],
 ced=('4.8', '4.9'))
