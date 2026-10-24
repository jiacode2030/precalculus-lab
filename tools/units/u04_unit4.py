# Unit 4: Functions involving parameters, vectors and matrices (not on the AP exam). Batch 2: param.
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
