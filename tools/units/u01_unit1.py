# Unit 1: Polynomial and rational functions. Batch 4: roc, linquad, polyfn, zeros, endbeh.
import math

def svg(body, h=200, label=''):
    return f'<svg viewBox="0 0 260 {h}" role="img" aria-label="{label}">{body}</svg>'

def num(v, d=2):
    """a number for display: trailing zeros dropped, minus sign as −"""
    s = f'{v:.{d}f}'.rstrip('0').rstrip('.') if d else str(int(round(v)))
    return ('−' + s[1:]) if s.startswith('-') else s

# =====================================================================
# 1.1, 1.2  Change in tandem & rates of change
# =====================================================================
FUN = lambda t: (600 * t / math.pi) ** (1 / 3)   # water height (cm) in a cone with r = h/2, filled at 50 cm³/s

def _funnel_fig():
    P = Plot((0, 44), (0, 22), (36, 12, 206, 170))
    base = P.axes([10, 20, 30, 40], [5, 10, 15, 20], 't (s)', 'h (cm)', True)
    T = [0, 10, 20, 30, 40]; H = [FUN(t) for t in T]
    L = [(1, ''.join(P.dot(t, h, '', 'f', r=4) for t, h in zip(T, H)), 'the data: h at t = 0, 10, …, 40', 'f'),
         (2, P.seg(0, 0, 10, H[1], 'tan', 2.2, '5 4') + P.text(7.2, 5, '1.24', 'tan', 10, 'start'), '[0, 10]: 12.41/10 ≈ 1.24 cm/s', 'tan'),
         (3, P.seg(10, H[1], 20, H[2], 'tan', 2.2, '5 4') + P.seg(20, H[2], 30, H[3], 'tan', 2.2, '5 4') + P.seg(30, H[3], 40, H[4], 'tan', 2.2, '5 4')
          + P.text(15, H[2] + 1.6, '0.32', 'tan', 10) + P.text(25, H[3] + 1.6, '0.23', 'tan', 10) + P.text(35, H[4] + 1.6, '0.18', 'tan', 10), 'then 0.32, 0.23, 0.18 cm/s', 'tan'),
         (4, P.curve(FUN, 0, 44, 'f', 2.4, '', 120), 'rising, but more and more slowly: concave down', 'f')]
    return fig(base, L, 'Water poured at a steady 50 cm³/s into a cone-shaped glass, point down.', 210)

def _bike_fig():
    P = Plot((0, 4.4), (0, 18), (36, 12, 206, 170))
    d = lambda t: .5 * t * t + 2 * t
    base = P.axes([1, 2, 3, 4], [5, 10, 15], 't (s)', 'd (m)', True) + P.curve(d, 0, 4.4, 'f', 2.6)
    L = [(1, P.seg(2, d(2), 4, d(4), 'tan', 2.2) + P.dot(2, d(2), '', 'tan', r=4.5) + P.dot(4, d(4), '5 m/s', 'tan', -22, -4, 4.5), 'slope 5', 'tan'),
         (2, P.seg(2, d(2), 3, d(3), 'dd', 2.2) + P.dot(3, d(3), '4.5', 'dd', 16, 14, 4), '[2, 3]: 4.5 m/s', 'dd'),
         (3, P.seg(2, d(2), 2.1, d(2.1), 'd', 3), '[2, 2.1]: 4.05 m/s', 'd'),
         (4, P.seg(.6, d(2) - 4 * 1.4, 3.6, d(2) + 4 * 1.6, 'area', 1.8, '6 4') + P.text(2.9, 2.2, 'slope 4', 'area', 10, 'start'), 'shrinking toward 4 m/s at t = 2', 'area')]
    return fig(base, L, 'A cyclist speeding up: d(t) = 0.5t² + 2t meters.', 210)

mod('roc', 'Change in tandem & rates of change',
 'Two quantities that change together tell a story. The average rate of change measures how fast one changes compared with the other.',
 ['A function pairs each input with an output, so when the input changes, the output changes <b>in tandem</b>. As x increases, f is <b>increasing</b> if its outputs go up, and <b>decreasing</b> if they go down. How it goes up matters too: if the output rises faster and faster, the graph is <b>concave up</b>; if it rises more and more slowly, <b>concave down</b>.',
  'The <b>average rate of change</b> of f on [a, b] is the change in output divided by the change in input: <span class="m">(f(b) − f(a)) / (b − a)</span>. It is the slope of the <b>secant line</b> through (a, f(a)) and (b, f(b)), and it has units: output units per input unit, such as cm per second.',
  'The rate of change <b>at a point</b> is what the average rates approach as the interval around that point shrinks. You can estimate it with a small interval. A positive rate means increasing; a negative rate means decreasing; a rate that is itself increasing means concave up.'],
 ('functions were rules to evaluate one input at a time', 'a way to describe how the output responds as the input moves', 'real questions are about change: how fast is the water rising, how fast is the bike going', 'increasing, decreasing, concavity, the average rate of change, and estimating the rate at a point'),
 [('(f(b) − f(a)) / (b − a)', 'average rate of change on [a, b]'), ('Δy / Δx', 'slope of the secant line'), ('rate > 0', 'f increasing'), ('rate increasing', 'concave up'), ('rate decreasing', 'concave down')],
 [lab('ro-lab', 'Fill a glass: height in tandem with time', canvas='ro-canvas', aria='A glass being filled at a steady rate, its cross-section on the left, and the graph of water height against time on the right.',
   seg=('ro-shape', 'Glass', [('cyl', 'Cylinder'), ('cone', 'Cone, point down'), ('flask', 'Flask'), ('ball', 'Round flask')]),
   pre='<div class="row"><button type="button" class="btn primary" id="ro-play">Play</button></div>',
   ctl=[('ro-t', 'Time t (s)', 0, 12, .01, 4)],
   out=[('ro-h', 'height h', 'x'), ('ro-rate', 'rising at (rate now)', 'v'), ('ro-cc', 'the graph is', '')]),
  lab('ro-lab2', 'Secant slope: shrink the interval', canvas='ro-canvas2', aria='A curve with two points a and b and the secant line through them; the change in x and change in y are drawn as a right triangle.',
   seg=('ro-fn', 'Data', [('bike', 'Cyclist'), ('cool', 'Cooling coffee'), ('plant', 'Plant growth')]),
   pre='<div class="row"><button type="button" class="btn primary" id="ro-shrink">Shrink b toward a</button></div>',
   ctl=[('ro-a', 'a', 0, 10, .01, 2), ('ro-b', 'b', 0, 10, .01, 4)],
   out=[('ro-avg', 'average rate on [a, b]', 'x'), ('ro-at', 'rate at a (estimate)', 'v'), ('ro-dir', 'on [a, b]', '')])],
 [('Choose <b>Cylinder</b> and press Play. How does the height graph look, and why?', show(['click', '#ro-shape [data-k=cyl]'], ['#ro-t', 0]), 'A straight line: every second adds the same volume to the same-width column, so the height rises by the same amount each second. A constant rate of change.'),
  ('Choose <b>Cone, point down</b>. When is the water rising fastest?', show(['click', '#ro-shape [data-k=cone]'], ['#ro-t', 1]), 'At the start, where the glass is narrowest. As it widens, the same volume makes a thinner layer: the height keeps increasing, but at a decreasing rate. The graph is concave down.'),
  ('Choose <b>Round flask</b> and Play. Where does the graph switch from concave down to concave up?', show(['click', '#ro-shape [data-k=ball]'], ['#ro-t', 6]), 'At the widest part of the ball, halfway up. Below it the glass widens (rate falling, concave down); above it the glass narrows (rate rising, concave up). That switch is a point of inflection.'),
  ('In the second lab choose <b>Cyclist</b> with a = 2, b = 4, then press Shrink. What number does the average rate approach?', show(['click', '#ro-fn [data-k=bike]'], ['#ro-a', 2], ['#ro-b', 4]), 'From 5 m/s on [2, 4] down toward 4 m/s: the rate at t = 2, the cyclist\'s speed at that instant.'),
  ('Choose <b>Cooling coffee</b>. Is the average rate positive or negative? What does it mean?', show(['click', '#ro-fn [data-k=cool]'], ['#ro-a', 1], ['#ro-b', 5]), 'Negative, in degrees per minute: the temperature is decreasing. The rates get closer to 0 later on: it cools more and more slowly (decreasing, concave up).')],
 [{'h': 'Worked example: filling a cone-shaped glass', 'fig': _funnel_fig(),
   'prob': 'Water flows at a steady rate into a cone-shaped glass, point down. The table gives the water height h (cm) at time t (s). Find the average rate of change of h on each 10-second interval, and describe how h changes.',
   'table': ([['t (s)', '0', '10', '20', '30', '40'], ['h (cm)'] + [f'{FUN(t):.2f}' for t in (0, 10, 20, 30, 40)]], 'Water height'),
   'steps': ['<b>Formula.</b> On [a, b]: (h(b) − h(a)) / (b − a), in cm per second.',
    '<b>[0, 10].</b> (12.41 − 0)/10 ≈ <b>1.24 cm/s</b>.',
    '<b>The rest.</b> (15.63 − 12.41)/10 ≈ <b>0.32</b>, (17.89 − 15.63)/10 ≈ <b>0.23</b>, (19.69 − 17.89)/10 ≈ <b>0.18 cm/s</b>.',
    '<b>Describe it.</b> All the rates are positive, so h is <b>increasing</b>. They get smaller, so it rises more and more slowly: the graph is <b>concave down</b>. That fits the glass: it gets wider as it fills.']},
  {'h': 'Worked example 2: speed from position', 'fig': _bike_fig(),
   'prob': 'A cyclist starts from a light and has gone d(t) = 0.5t² + 2t meters after t seconds. Find the average speed on [2, 4], [2, 3] and [2, 2.1], and estimate the speed at t = 2.',
   'steps': ['<b>Values.</b> d(2) = 2 + 4 = 6, d(4) = 8 + 8 = 16, d(3) = 4.5 + 6 = 10.5, d(2.1) = 2.205 + 4.2 = 6.405.',
    '<b>[2, 4].</b> (16 − 6)/2 = <b>5 m/s</b>.',
    '<b>[2, 3].</b> (10.5 − 6)/1 = <b>4.5 m/s</b>. <b>[2, 2.1].</b> (6.405 − 6)/0.1 = <b>4.05 m/s</b>.',
    '<b>Estimate.</b> As the interval shrinks, the average rates approach <b>4 m/s</b>: the cyclist\'s speed at t = 2 (what a speedometer would show).']}],
 ['Dividing by the change in output instead of the change in input.', 'Leaving off units: an average rate of change is "output units per input unit".', 'Confusing decreasing with concave down: a graph can increase and be concave down at the same time.', 'Thinking one average rate describes the whole interval: on [0, 40] the glass averages 0.49 cm/s, but it was much faster at the start.'],
 ('Why the secant slope is the average',
  ['If you replaced the actual change by steady change at the average rate, you would end at exactly the same place: f(a) + (average rate)(b − a) = f(b). That straight-line trip is the secant line. A car that drives 150 km in 2 hours has an average rate of 75 km/h, even if it stopped for lunch.']),
 [('f(1) = 4 and f(5) = −8. What is the average rate of change of f on [1, 5]?', ['−3', '3', '−12', '−1/3'], 0, '(−8 − 4)/(5 − 1) = −12/4 = −3.'),
  ('On an interval, the average rates of change of g over consecutive equal-length pieces are 6, 4, 3, 1. Which describes g there?', ['increasing and concave up', 'increasing and concave down', 'decreasing and concave down', 'decreasing and concave up'], 1, 'Positive rates: increasing. Rates getting smaller: concave down.')],
 ced=('1.1', '1.2'))

# =====================================================================
# 1.3  Linear vs quadratic change
# =====================================================================
def _diff_fig():
    P = Plot((-.4, 4.6), (0, 38), (36, 12, 206, 170))
    f = lambda x: 2 * x * x + 3
    base = P.axes([1, 2, 3, 4], [10, 20, 30], 'x', 'f') + ''.join(P.dot(x, f(x), '', 'f', r=4) for x in range(5))
    L = [(1, ''.join(P.seg(x, f(x), x + 1, f(x), 'dd', 1.6) + P.seg(x + 1, f(x), x + 1, f(x + 1), 'tan', 3) + P.text(x + 1.12, (f(x) + f(x + 1)) / 2, f'{f(x + 1) - f(x):g}', 'tan', 10, 'start') for x in range(4)), 'first differences 2, 6, 10, 14', 'tan'),
         (2, '', 'second differences all 4', 'area'),
         (3, '', 'a = 4/2 = 2, f(0) = 3, f(1) = 5 → b = 0', 'ink'),
         (4, P.curve(f, -.4, 4.25, 'f', 2.4), 'f(x) = 2x² + 3', 'f')]
    return fig(base, L, 'Equal steps in x: the rises grow by the same amount each step.', 210)

def _fall_fig():
    P = Plot((0, 4.3), (0, 82), (36, 12, 206, 170))
    d = lambda t: 4.9 * t * t
    base = P.axes([1, 2, 3, 4], [20, 40, 60, 80], 't (s)', 'fallen (m)', True)
    L = [(1, P.curve(d, 0, 4.05, 'f', 2.6) + ''.join(P.dot(t, d(t), '', 'f', r=3.5) for t in range(5)), 'd = 4.9t²', 'f'),
         (2, ''.join(P.seg(t, d(t), t + 1, d(t + 1), 'tan', 2, '5 3') for t in range(4)), 'average speeds 4.9, 14.7, 24.5, 34.3 m/s', 'tan'),
         (3, '', 'each second the speed grows by 9.8 m/s', 'area'),
         (4, '', 'constant second difference ↔ quadratic', 'ink')]
    return fig(base, L, 'A dropped stone (air resistance ignored).', 210)

mod('linquad', 'Linear vs quadratic change',
 'Linear functions change by the same amount every step. Quadratics change by an amount that itself changes steadily.',
 ['Take equal steps in the input. For a <b>linear</b> function the output changes by the same amount each step: the average rate of change is <b>constant</b>, and it is the slope. Equal inputs steps, equal output steps.',
  'For a <b>quadratic</b> function the output changes are not equal, but they change by the same amount each time: the <b>second differences</b> are constant. Over consecutive equal-length intervals, the average rates of change form a linear pattern. For f(x) = ax² + bx + c and steps of size h, the second difference is <span class="m">2ah²</span>.',
  'That links rates to shape. If the average rates are increasing, the graph bends up (<b>concave up</b>, a > 0); if they are decreasing, it bends down (<b>concave down</b>, a < 0). A line has no bend at all.'],
 ('you met linear and quadratic functions as formulas and graphs', 'a test that tells them apart from data', 'real data comes as tables: you have to decide what kind of change it shows', 'first and second differences, constant versus linearly changing rates, and concavity'),
 [('linear: Δy constant', 'for equal Δx'), ('quadratic: Δ(Δy) constant', 'second differences'), ('f(x) = ax² + bx + c', ''), ('second difference = 2ah²', 'step h'), ('rates increasing', 'concave up')],
 [lab('lq-lab', 'Equal steps, unequal rises', canvas='lq-canvas', aria='The graph of a·x² + b·x + 1 with equal steps in x; each rise is drawn in orange, and the rises are shown again as bars underneath.',
   ctl=[('lq-a', 'a (the x² coefficient)', -1, 1, .1, .5), ('lq-b', 'b (the x coefficient)', -3, 3, .5, -1), ('lq-h', 'step size h', .5, 2, .5, 1)],
   out=[('lq-d1', 'first differences Δy', 'x'), ('lq-d2', 'second differences', 'v'), ('lq-kind', 'so f is', '')]),
  lab('lq-lab2', 'The rate of the rate', canvas='lq-canvas2', aria='Top: data and a curve. Bottom: the average rate of change on each interval, plotted at the middle of the interval.',
   seg=('lq-data', 'Data', [('fall', 'Dropped stone'), ('brake', 'Braking car'), ('taxi', 'Taxi fare')]),
   ctl=[('lq-k', 'Highlight interval', 1, 4, 1, 2)],
   out=[('lq-r', 'average rates of change', 'x'), ('lq-rr', 'change from one rate to the next', 'v'), ('lq-cc', 'shape', '')])],
 [('Set a = 0. What do the bars look like, and why?', show(['#lq-a', 0], ['#lq-b', 2]), 'All the same height: with a = 0 the function is linear, f(x) = 2x + 1, and every step of 1 in x adds exactly 2.'),
  ('Set a = 0.5, b = −1, h = 1. How much does each bar grow by?', show(['#lq-a', .5], ['#lq-b', -1], ['#lq-h', 1]), 'By 1 each time: the first differences are −0.5, 0.5, 1.5, 2.5, …, and the second differences are all 2ah² = 2(0.5)(1) = 1.'),
  ('Keep a = 0.5 and change the step to h = 2. What happens to the second difference?', show(['#lq-a', .5], ['#lq-h', 2]), 'It becomes 2(0.5)(2²) = 4: four times as big. It is still constant, so the test still says quadratic.'),
  ('In the second lab choose <b>Dropped stone</b>. What is the pattern in the average rates?', show(['click', '#lq-data [data-k=fall]']), 'They rise by 9.8 m/s every second: the rates lie on a straight line with slope 9.8, the acceleration of gravity. Constant change in the rate is the signature of a quadratic.'),
  ('Choose <b>Taxi fare</b>. What does the bottom graph show?', show(['click', '#lq-data [data-k=taxi]']), 'A flat line: every kilometer costs the same, so the rate never changes. Linear.')],
 [{'h': 'Worked example: which kind of function?', 'fig': _diff_fig(),
   'prob': 'Decide whether the data are linear, quadratic or neither, and find a formula.',
   'table': ([['x', '0', '1', '2', '3', '4'], ['f(x)', '3', '5', '11', '21', '35']], ''),
   'steps': ['<b>First differences.</b> 5 − 3 = 2, 11 − 5 = 6, 21 − 11 = 10, 35 − 21 = 14. Not constant, so <b>not linear</b>.',
    '<b>Second differences.</b> 6 − 2 = 4, 10 − 6 = 4, 14 − 10 = 4: constant, so <b>quadratic</b>.',
    '<b>Find a.</b> With step 1 the second difference is 2a, so 2a = 4 and a = 2. Then f(0) = c = 3, and f(1) = 2 + b + 3 = 5 gives b = 0.',
    '<b>Formula.</b> <b>f(x) = 2x² + 3</b>. Check: f(4) = 32 + 3 = 35 ✓.']},
  {'h': 'Worked example 2: a dropped stone', 'fig': _fall_fig(),
   'prob': 'A stone dropped from a cliff has fallen d(t) = 4.9t² meters after t seconds. Find the average speed in each of the first four seconds. What pattern do you see?',
   'steps': ['<b>Distances.</b> d(0) = 0, d(1) = 4.9, d(2) = 19.6, d(3) = 44.1, d(4) = 78.4 m.',
    '<b>Average speeds.</b> 4.9, 14.7, 24.5 and 34.3 m/s on [0, 1], [1, 2], [2, 3], [3, 4].',
    '<b>Pattern.</b> Each average speed is <b>9.8 m/s</b> more than the one before. The rates change at a constant rate, which is exactly what makes d quadratic (second difference 2ah² = 2(4.9)(1) = 9.8).',
    '<b>Meaning.</b> 9.8 m/s per second is the acceleration of gravity. The rates are increasing, so the graph of d is concave up.']}],
 ['Testing differences when the x-values are not equally spaced.', 'Stopping at the first differences: unequal first differences rule out linear but do not prove quadratic.', 'Using the second difference as a: with step 1 it is 2a, not a.', 'Calling a function concave up because it is increasing.'],
 ('Where 2ah² comes from',
  ['For f(x) = ax² + bx + c, the change over [x, x + h] is f(x + h) − f(x) = 2ahx + ah² + bh. That is a linear function of x with slope 2ah, so moving x forward by h changes it by 2ah · h = 2ah². The b and c terms only shift the first differences; they never affect the second ones.']),
 [('A table has x = 0, 1, 2, 3 and y = 7, 4, 1, −2. The function is', ['linear', 'quadratic', 'neither', 'periodic'], 0, 'The first differences are all −3.'),
  ('The second differences of a quadratic with step 1 are all −6. What is a?', ['−3', '−6', '−12', '3'], 0, 'Second difference = 2a = −6, so a = −3 (concave down).')],
 ced=('1.3',))

# =====================================================================
# 1.4  Polynomial functions and rates of change
# =====================================================================
def _cubic_fig():
    f = lambda x: x ** 3 - 6 * x * x + 9 * x + 1
    P = Plot((-.7, 4.7), (-6.5, 12), (36, 12, 206, 172))
    base = P.axes([1, 2, 3, 4], [-5, 5, 10], 'x', 'y', True) + P.curve(f, -.6, 4.6, 'f', 2.6, '', 160)
    L = [(1, P.curve(f, -.6, 1, 'd', 5) + P.curve(f, 3, 4.6, 'd', 5) + P.curve(f, 1, 3, 'dd', 5) + P.curve(f, -.6, 4.6, 'f', 2.2, '', 160), 'increasing (green), decreasing (magenta)', 'd'),
         (2, P.dot(1, 5, 'rel. max (1, 5)', 'tan', 0, -10, 5) + P.dot(3, 1, 'rel. min (3, 1)', 'tan', 22, 38, 5), 'turning points', 'tan'),
         (3, P.dot(2, 3, '', 'area', r=5) + P.text(2.35, 7.6, 'inflection (2, 3)', 'area', 10, 'start') + P.seg(2.3, 7.2, 2.05, 3.4, 'area', 1, '2 2'), 'concavity switches at x = 2', 'area'),
         (4, P.seg(-.5, -6.5, -.5, 12, 'mut', 1, '3 3') + P.seg(4.5, -6.5, 4.5, 12, 'mut', 1, '3 3') + P.dot(-.5, f(-.5), 'abs. min', 'dd', 30, 8, 5) + P.dot(4.5, f(4.5), 'abs. max', 'd', -26, 4, 5), 'on [−0.5, 4.5]: the ends win', 'ink')]
    return fig(base, L, 'f(x) = x³ − 6x² + 9x + 1.', 214)

def _box_fig():
    V = lambda x: x * (20 - 2 * x) * (30 - 2 * x)
    P = Plot((0, 10.5), (0, 1200), (40, 12, 200, 170))
    base = P.axes([2, 4, 6, 8, 10], [400, 800, 1200], 'x (cm)', 'V (cm³)', True)
    L = [(1, '', 'V(x) = x(20 − 2x)(30 − 2x)', 'f'),
         (2, P.curve(V, 0, 10, 'f', 2.6, '', 120), 'domain 0 < x < 10', 'f'),
         (3, P.dot(3.92, 1056.3, 'max ≈ 1056 cm³', 'tan', 44, -2, 5) + P.seg(3.92, 0, 3.92, 1056.3, 'tan', 1.2, '4 3'), 'x ≈ 3.92 cm', 'tan'),
         (4, P.dot(2, 832, '', 'ink', r=3) + P.dot(6, 864, '', 'ink', r=3), 'V(2) = 832, V(6) = 864: both less', 'ink')]
    return fig(base, L, 'An open box from a 20 cm × 30 cm card, cutting x cm squares from the corners.', 210)

mod('polyfn', 'Polynomial functions',
 'A polynomial can turn around only a limited number of times. Where it turns, and where its bending switches, tells you the shape.',
 ['A <b>polynomial</b> of degree n is f(x) = aₙxⁿ + … + a₁x + a₀ with aₙ ≠ 0. Its graph is smooth and unbroken. Where f switches from increasing to decreasing it has a <b>relative (local) maximum</b>; where it switches from decreasing to increasing, a <b>relative minimum</b>. Together these are the <b>relative extrema</b>, and a polynomial of degree n has at most <b>n − 1</b> of them.',
  'On an interval, the greatest output is the <b>absolute (global) maximum</b> and the least is the absolute minimum. Look at the relative extrema inside the interval and at the two endpoints: the largest and smallest of those values win. An endpoint can beat every turning point.',
  'A <b>point of inflection</b> is where the graph switches concavity: where the rate of change switches from increasing to decreasing, or the other way. Between two real zeros of a polynomial there is always at least one relative extremum.'],
 ('you could graph a polynomial and read off values', 'language for the features of the shape and a way to find them', 'questions like "when is it largest?" or "where does growth start slowing?" are questions about turning points and bends', 'relative and absolute extrema, increasing and decreasing intervals, concavity and points of inflection'),
 [('degree n', 'at most n − 1 turning points'), ('increasing → decreasing', 'relative max'), ('decreasing → increasing', 'relative min'), ('rate switches up ↔ down', 'inflection'), ('absolute extrema', 'compare turning points and endpoints')],
 [lab('py-lab', 'Drag a polynomial', canvas='py-canvas', aria='A polynomial through draggable points. Relative maxima and minima are marked in orange and points of inflection in gold; bands below show where it increases and where it is concave up.',
   seg=('py-deg', 'Degree', [('d3', 'Cubic (4 points)'), ('d4', 'Quartic (5 points)'), ('d5', 'Quintic (6 points)')]),
   out=[('py-ext', 'relative extrema', 'x'), ('py-inf', 'points of inflection', 'v'), ('py-cnt', 'turning points', '')]),
  lab('py-lab2', 'Absolute extrema on an interval', canvas='py-canvas2', aria='A polynomial with a shaded interval from a to b; the highest and lowest points on the interval are marked.',
   seg=('py-fn', 'Function', [('cubic', 'x³ − 6x² + 9x + 1'), ('quart', 'Quartic'), ('box', 'Box volume')]),
   ctl=[('py-a', 'a (left end)', -1, 5, .05, -.5), ('py-b', 'b (right end)', -1, 5, .05, 4.5)],
   out=[('py-max', 'absolute maximum', 'x'), ('py-min', 'absolute minimum', 'v'), ('py-why', 'found at', '')])],
 [('Choose <b>Cubic</b>. Drag the points until the graph has no turning points at all. Can you make three?', show(['click', '#py-deg [data-k=d3]']), 'No turning points is easy (put the points in rising order along a gentle curve). Three is impossible: a cubic has at most 3 − 1 = 2.'),
  ('With the cubic, where is the gold inflection point compared with the two orange turning points?', show(['click', '#py-deg [data-k=d3]']), 'Exactly halfway between them (in x). Every cubic is symmetric about its inflection point.'),
  ('Choose <b>Quartic</b>. Find a stretch where the top band is green (increasing) and the bottom band says ∩ (concave down). What is the graph doing there?', show(['click', '#py-deg [data-k=d4]']), 'Rising, but more and more slowly. That always happens just before a relative maximum, between an inflection point and the top.'),
  ('In the second lab, set the interval to [−0.5, 4.5]. Where are the absolute max and min?', show(['click', '#py-fn [data-k=cubic]'], ['#py-a', -.5], ['#py-b', 4.5]), 'Both at the endpoints: f(4.5) ≈ 11.1 beats the relative max 5, and f(−0.5) ≈ −5.1 is below the relative min 1.'),
  ('Shrink the interval to [0.5, 3.5]. Now what?', show(['#py-a', .5], ['#py-b', 3.5]), 'Now the turning points win: absolute max 5 at x = 1 and absolute min 1 at x = 3. Always check both the turning points and the ends.')],
 [{'h': 'Worked example: reading a cubic', 'fig': _cubic_fig(),
   'prob': 'For f(x) = x³ − 6x² + 9x + 1 (graphed), give the intervals where f increases and decreases, the relative extrema, the point of inflection, and the absolute extrema on [−0.5, 4.5].',
   'steps': ['<b>Increasing and decreasing.</b> From the graph, f increases on (−∞, 1) and (3, ∞) and decreases on (1, 3).',
    '<b>Relative extrema.</b> Increasing then decreasing at x = 1: relative max f(1) = 1 − 6 + 9 + 1 = <b>5</b>. Decreasing then increasing at x = 3: relative min f(3) = 27 − 54 + 27 + 1 = <b>1</b>.',
    '<b>Inflection.</b> Concave down to the left of x = 2 and up to the right: inflection at <b>(2, 3)</b>, halfway between the turning points.',
    '<b>Absolute extrema on [−0.5, 4.5].</b> Compare f(−0.5) = −5.125, f(1) = 5, f(3) = 1, f(4.5) = 11.125. Absolute max <b>11.125 at x = 4.5</b>, absolute min <b>−5.125 at x = −0.5</b>: both at the endpoints.']},
  {'h': 'Worked example 2: the biggest box', 'fig': _box_fig(),
   'prob': 'Cut a square of side x cm from each corner of a 20 cm × 30 cm card and fold up the sides to make an open box. Write the volume V(x), give its domain, and use a graphing calculator to find the largest volume.',
   'steps': ['<b>Dimensions.</b> Height x, width 20 − 2x, length 30 − 2x. So <b>V(x) = x(20 − 2x)(30 − 2x)</b>, a cubic.',
    '<b>Domain.</b> Every side must be positive: x > 0 and 20 − 2x > 0, so <b>0 < x < 10</b>.',
    '<b>Maximum.</b> On (0, 10) the graph rises, turns and falls. The calculator gives the relative max at <b>x ≈ 3.92 cm</b>, with V ≈ 3.92 × 12.15 × 22.15 ≈ <b>1056 cm³</b>.',
    '<b>Check.</b> V(2) = 2 × 16 × 26 = 832 and V(6) = 6 × 8 × 18 = 864, both less. On the open interval (0, 10) the turning point is the absolute maximum.']}],
 ['Giving the x-value when asked for the maximum value (the output), or the other way around.', 'Forgetting the endpoints when finding an absolute extremum on a closed interval.', 'Calling every point where the graph looks flat a turning point: x³ flattens at 0 but keeps increasing.', 'Confusing a point of inflection (bend switches) with a turning point (direction switches).'],
 ('Why at most n − 1 turning points',
  ['Each turning point is where the rate of change switches sign. For a polynomial of degree n, the rate of change behaves like a polynomial of degree n − 1 (you will see why in calculus), which has at most n − 1 zeros. So the direction can switch at most n − 1 times, and the bending at most n − 2 times.']),
 [('What is the greatest number of relative extrema a degree-6 polynomial can have?', ['5', '6', '7', '3'], 0, 'At most n − 1 = 5.'),
  ('f increases on (−∞, 2) and decreases on (2, ∞). Which is true?', ['f has a relative max at x = 2', 'f has a relative min at x = 2', 'f has an inflection point at x = 2', 'f(2) = 0'], 0, 'Increasing then decreasing: a relative maximum.')],
 ced=('1.4',))

# =====================================================================
# 1.5  Zeros & complex zeros
# =====================================================================
def _fit(f, a, b, k=200):
    vs = [f(a + (b - a) * i / k) for i in range(k + 1)]; m = max(abs(v) for v in vs) or 1
    return m

def _zr_drill():
    D = [(lambda x: (x + 2) * (x - 1) ** 2, 1, 2, '(x + 2)(x − 1)²'),
         (lambda x: (x + 2) * (x - 1) ** 2, -2, 1, '(x + 2)(x − 1)²'),
         (lambda x: x ** 3, 0, 3, 'x³'),
         (lambda x: (x - 1.5) ** 3 * (x + 1), 1.5, 3, '(x − 1.5)³(x + 1)'),
         (lambda x: -(x + 1) ** 2 * (x - 2), -1, 2, '−(x + 1)²(x − 2)'),
         (lambda x: (x + 2) * x * (x - 2), 0, 1, '(x + 2)x(x − 2)'),
         (lambda x: x * x * (x - 2) ** 2, 2, 2, 'x²(x − 2)²'),
         (lambda x: (x + 1) ** 3 * (x - 2) ** 2, -1, 3, '(x + 1)³(x − 2)²')]
    opts = ['1: it crosses', '2: it touches and turns back', '3: it flattens and crosses']
    why = {1: 'A simple zero: the factor changes sign there, so the graph crosses the axis like a line.',
           2: 'A squared factor never changes sign, so the graph touches the axis and turns back, like a parabola.',
           3: 'A cubed factor changes sign but is very flat near its zero, so the graph levels off as it crosses, like y = x³.'}
    cases = []
    for f, r, m, form in D:
        sc = _fit(f, -3, 3); P = Plot((-3, 3), (-1.15, 1.15), (14, 10, 232, 150)); g = lambda x, f=f: f(x) / sc
        b = P.axes([-2, -1, 1, 2], [], 'x', '') + P.curve(g, -3, 3, 'f', 2.6, '', 240) + P.dot(r, 0, '', 'tan', r=5.5)
        a = b + P.text(-2.9, 1.0, f'f(x) = {form}', 'tan', 11, 'start') + P.text(r, -.3 if g(r + .4) > 0 else .3, f'mult. {m}', 'tan', 11)
        cases.append(('What is the multiplicity of the zero marked in orange?', svg(b, 172, 'A polynomial graph with one zero marked'), svg(a, 172, f'Graph of {form}'), opts, m - 1, why[m] + f' Here f(x) = {form}.'))
    return drill('Cross, touch or flatten: 8 zeros', 'The shape at a zero tells you how many times its factor repeats.', cases, 'zr-drill')

def _zero_fig():
    f = lambda x: (x - 2) ** 2 * (x * x - 2 * x + 2)
    P = Plot((-.6, 3.4), (-1, 9.5), (36, 12, 120, 160))
    base = P.axes([1, 2, 3], [4, 8], 'x', '') + P.curve(f, -.45, 3.25, 'f', 2.6, '', 160)
    C = Plot((-.6, 3), (-2, 2), (178, 40, 74, 82))
    cp = C.seg(-.6, 0, 3, 0, 'mut', 1) + C.seg(0, -2, 0, 2, 'mut', 1) + C.text(2.9, .25, 'Re', 'mut', 9, 'end') + C.text(.15, 1.75, 'Im', 'mut', 9, 'start')
    L = [(1, P.dot(2, 0, 'x = 2 (mult. 2)', 'tan', 0, -10, 5), 'real zero 2, double: touches', 'tan'),
         (2, cp + C.dot(1, 1, '1 + i', 'dd', 12, -6, 4) + C.dot(1, -1, '1 − i', 'dd', 12, 14, 4) + C.dot(2, 0, '', 'tan', r=4), 'conjugate pair 1 ± i', 'dd'),
         (3, '', '(x − (1 + i))(x − (1 − i)) = x² − 2x + 2', 'dd'),
         (4, P.dot(0, 8, 'f(0) = 8', 'f', 26, 4, 4), 'f(x) = (x − 2)²(x² − 2x + 2)', 'f')]
    return fig(base, L, 'A degree-4 polynomial: 4 zeros counted with multiplicity, 2 of them not real.', 206)

def _profit_fig():
    Pq = lambda q: -q ** 3 + 12 * q * q - 20 * q
    P = Plot((0, 11.5), (-60, 120), (40, 12, 200, 170))
    base = P.axes([2, 4, 6, 8, 10], [-50, 50], 'q (thousands)', 'P', True)
    L = [(1, P.curve(Pq, 0, 11, 'f', 2.6, '', 160), 'P(q) = −q³ + 12q² − 20q', 'f'),
         (2, P.dot(0, 0, '', 'tan', r=4.5) + P.dot(2, 0, '', 'tan', r=4.5) + P.dot(10, 0, '', 'tan', r=4.5), 'zeros 0, 2, 10', 'tan'),
         (3, P.between(Pq, lambda q: 0, 2, 10, 'd', .3), 'P > 0 on (2, 10)', 'd'),
         (4, '', 'sell between 2,000 and 10,000 units', 'ink')]
    return fig(base, L, 'Profit P in thousands of dollars from selling q thousand units.', 210)

mod('zeros', 'Zeros & complex zeros',
 'Every zero of a polynomial is a factor. Count them with multiplicity, include the complex ones, and a degree-n polynomial has exactly n.',
 ['If f(a) = 0 then <span class="m">(x − a)</span> is a factor of f, and a is a <b>zero</b> (an x-intercept when a is real). If the factor appears k times, a has <b>multiplicity k</b>. At a zero of odd multiplicity the graph crosses the x-axis (the sign changes); at even multiplicity it touches and turns back (no sign change). Higher multiplicity flattens the graph near the zero.',
  'A polynomial of degree n has exactly <b>n complex zeros</b>, counting multiplicity (the Fundamental Theorem of Algebra). Some can be non-real, like 1 + i. If the coefficients are real, non-real zeros come in <b>conjugate pairs</b> a + bi and a − bi, so a real cubic always has at least one real zero.',
  'Factors give you the sign of f between zeros, which solves polynomial inequalities. Symmetry is another shortcut: f is <b>even</b> if f(−x) = f(x) (mirror image in the y-axis, like x⁴ − x²) and <b>odd</b> if f(−x) = −f(x) (symmetric about the origin, like x³ − 4x).'],
 ('you solved quadratics and found x-intercepts', 'a full count of the zeros, including ones the graph cannot show', 'factored form lets you sketch and solve inequalities quickly, and some equations have no real solutions at all', 'factors and zeros, multiplicity and the shape at a zero, complex conjugate zeros, and even and odd functions'),
 [('f(a) = 0 ⇔ (x − a) is a factor', ''), ('odd multiplicity', 'crosses'), ('even multiplicity', 'touches'), ('degree n', 'exactly n complex zeros'), ('a + bi zero ⇒ a − bi zero', 'real coefficients'), ('f(−x) = f(x) / −f(x)', 'even / odd')],
 [lab('zr-lab', 'Build a polynomial from its zeros', canvas='zr-canvas', aria='A polynomial graph built from three zeros on the x-axis. Drag a zero to move it; tap it to change its multiplicity.',
   seg=('zr-sgn', 'Leading coefficient', [('pos', 'positive'), ('neg', 'negative')]),
   out=[('zr-form', 'f(x) =', 'x'), ('zr-deg', 'degree and zeros', 'v'), ('zr-sym', 'symmetry', '')]),
  lab('zr-lab2', 'Where do the missing zeros go?', canvas='zr-canvas2', aria='Left: the complex plane with the zeros of f. Right: the graph of f(x) = (x + 2)(x² − 2px + p² + k).',
   ctl=[('zr-p', 'p (center of the pair)', -1, 3, .05, 1), ('zr-k', 'k', -4, 4, .05, 1)],
   out=[('zr-list', 'the three zeros', 'x'), ('zr-real', 'real zeros (x-intercepts)', 'v'), ('zr-note', 'what happened', '')])],
 [('Tap the middle zero until it has multiplicity 2. What does the graph do there?', show(['click', '#zr-sgn [data-k=pos]']), 'It touches the axis and turns back: (x − a)² is never negative, so f does not change sign there.'),
  ('Give one zero multiplicity 3. How is it different from multiplicity 1?', show(['click', '#zr-sgn [data-k=pos]']), 'It still crosses (odd multiplicity), but it flattens out as it crosses, like y = x³.'),
  ('Drag the zeros to −2, 0 and 2, all multiplicity 1. What symmetry appears?', show(['click', '#zr-sgn [data-k=pos]']), 'f(x) = (x + 2)x(x − 2) = x³ − 4x is odd: rotating the graph 180° about the origin gives the same graph.'),
  ('In the second lab, slide k from 1 down to −1. Watch the left picture. What happens at k = 0?', show(['#zr-p', 1], ['#zr-k', 1]), 'The two non-real zeros 1 ± i slide toward the real axis, meet at k = 0 (a double zero at 1, where the graph touches), then split into two real zeros. There are always 3 zeros in total.'),
  ('With k = 2, how many x-intercepts does the graph have? How many zeros does f have?', show(['#zr-k', 2]), 'One x-intercept (x = −2), but three zeros: −2 and the conjugate pair p ± i√2. Non-real zeros do not show up on the graph.')],
 [{'h': 'Worked example: from zeros to a formula', 'fig': _zero_fig(),
   'prob': 'A degree-4 polynomial f with real coefficients has a zero of multiplicity 2 at x = 2, and 1 + i is also a zero. If f(0) = 8, find f(x).',
   'steps': ['<b>Count the zeros.</b> Degree 4 means 4 zeros with multiplicity: 2, 2, and 1 + i. The fourth must be the conjugate <b>1 − i</b>.',
    '<b>Pair the conjugates.</b> (x − (1 + i))(x − (1 − i)) = (x − 1)² − i² = <b>x² − 2x + 2</b>, which has real coefficients.',
    '<b>Write the form.</b> f(x) = a(x − 2)²(x² − 2x + 2). Then f(0) = a(4)(2) = 8a = 8, so a = 1.',
    '<b>Answer.</b> <b>f(x) = (x − 2)²(x² − 2x + 2)</b> = x⁴ − 6x³ + 14x² − 16x + 8. Only one x-intercept, at 2, where the graph touches.']},
  {'h': 'Worked example 2: when is the business profitable?', 'fig': _profit_fig(),
   'prob': 'A company\'s monthly profit is P(q) = −q³ + 12q² − 20q thousand dollars when it sells q thousand units. For which q is the profit positive?',
   'steps': ['<b>Factor.</b> P(q) = −q(q² − 12q + 20) = <b>−q(q − 2)(q − 10)</b>. Zeros: 0, 2, 10, each multiplicity 1, so the sign changes at each.',
    '<b>Test the sign.</b> For 0 < q < 2, try q = 1: −1(−1)(−9) = −9 < 0. For 2 < q < 10, try q = 5: −5(3)(−5) = 75 > 0. For q > 10, try q = 11: −11(9)(1) = −99 < 0.',
    '<b>Answer.</b> P(q) > 0 for <b>2 < q < 10</b>: between 2,000 and 10,000 units.',
    '<b>Meaning.</b> Below 2,000 units fixed costs eat the profit; above 10,000 the model says extra production costs more than it earns. The zeros are the break-even points.']}],
 ['Forgetting the conjugate: if 3 − 2i is a zero of a real polynomial, so is 3 + 2i.', 'Counting x-intercepts as the number of zeros: non-real zeros have no x-intercept.', 'Saying a graph crosses at a squared factor.', 'Writing the factor for the zero −4 as (x − 4) instead of (x + 4).'],
 ('Why conjugates come in pairs',
  ['If f has real coefficients and f(a + bi) = 0, take the complex conjugate of the whole equation. Conjugating a sum or product conjugates each piece, and the real coefficients stay the same, so f(a − bi) = 0 too. Multiplying the pair gives x² − 2ax + (a² + b²), a quadratic with real coefficients and no real zeros.']),
 [('A polynomial with real coefficients has zeros 4 and 2 − 3i. Which must also be a zero?', ['2 + 3i', '−2 + 3i', '−4', '3i'], 0, 'Non-real zeros of a real polynomial come in conjugate pairs.'),
  ('f(x) = x⁴ − 3x² is', ['even', 'odd', 'neither', 'both'], 0, 'f(−x) = x⁴ − 3x² = f(x): only even powers.')],
 extra_after_labs=_zr_drill(), ced=('1.5',))

# =====================================================================
# 1.6  End behavior
# =====================================================================
def _eb_drill():
    D = [(lambda x: x ** 3 - 4 * x, 'x³ − 4x'), (lambda x: -x ** 4 + 3 * x * x + 1, '−x⁴ + 3x² + 1'), (lambda x: -x ** 3 + 2 * x * x, '−x³ + 2x²'),
         (lambda x: x ** 4 - 5 * x * x + 4, 'x⁴ − 5x² + 4'), (lambda x: -.5 * x ** 5 + 4 * x ** 3 - 2, '−0.5x⁵ + 4x³ − 2'), (lambda x: (x - 1) ** 2 * (x + 1) * (x - 3), '(x − 1)²(x + 1)(x − 3)'),
         (lambda x: -(x + 2) * (x - 1) ** 2, '−(x + 2)(x − 1)²'), (lambda x: 3 - x * x, '3 − x²')]
    opts = ['up on both ends', 'down on both ends', 'down on the left, up on the right', 'up on the left, down on the right']
    cases = []
    for f, form in D:
        L, R = f(-60), f(60); k = 0 if L > 0 and R > 0 else 1 if L < 0 and R < 0 else 2 if R > 0 else 3
        P = Plot((-2, 2), (-1.15, 1.55), (14, 10, 232, 150)); s = _fit(f, -2, 2)
        b = P.axes([-1, 1], [], 'x', '') + P.curve(lambda x: f(x) / s, -2, 2, 'f', 2.6, '', 200) + P.text(-1.9, 1.38, f'y = {form}, −2 ≤ x ≤ 2', 'mut', 10, 'start')
        Q = Plot((-8, 8), (-1.15, 1.55), (14, 10, 232, 150)); s2 = _fit(f, -8, 8)
        a = Q.axes([-4, 4], [], 'x', '') + Q.curve(lambda x: f(x) / s2, -8, 8, 'f', 2.6, '', 300) + Q.text(-7.6, 1.38, f'y = {form}, −8 ≤ x ≤ 8', 'tan', 10, 'start')
        for x, v in ((-8, L), (8, R)):
            X, Y = Q.X(x), Q.Y(f(x) / s2); a += arr(X - (6 if x < 0 else -6), Y + (12 if v > 0 else -12), X, Y + (2 if v < 0 else -2), 'tan', '', 2.4)
        lead = {'x³ − 4x': 'x³', '−x⁴ + 3x² + 1': '−x⁴', '−x³ + 2x²': '−x³', 'x⁴ − 5x² + 4': 'x⁴', '−0.5x⁵ + 4x³ − 2': '−0.5x⁵', '(x − 1)²(x + 1)(x − 3)': 'x⁴', '−(x + 2)(x − 1)²': '−x³', '3 − x²': '−x²'}[form]
        n = {'x³': 3, '−x⁴': 4, '−x³': 3, 'x⁴': 4, '−0.5x⁵': 5, '−x²': 2}[lead]
        why = f'The leading term is {lead}: degree {n} ({"even" if n % 2 == 0 else "odd"}), coefficient {"negative" if lead.startswith("−") else "positive"}. ' + ('Even degree: both ends go the same way.' if n % 2 == 0 else 'Odd degree: the ends go opposite ways.')
        cases.append((f'Zoom out on y = {form}. What do the ends do?', svg(b, 172, f'Graph of y = {form} near the origin'), svg(a, 172, f'Graph of y = {form} zoomed out'), opts, k, why))
    return drill('Zoom out: 8 end behaviors', 'Predict the ends from the formula, then zoom out. The wiggles in the middle do not matter.', cases, 'eb-drill')

def _lead_fig():
    f = lambda x: -2 * x ** 5 + 30 * x ** 3 + x - 7
    P = Plot((-5, 5), (-1.2, 1.2), (20, 12, 222, 160)); s = _fit(f, -5, 5)
    base = P.axes([-4, -2, 2, 4], [], 'x', '')
    L = [(1, P.curve(lambda x: f(x) / s, -5, 5, 'f', 2.6, '', 300), 'f(x) = −2x⁵ + 30x³ + x − 7', 'f'),
         (2, P.curve(lambda x: -2 * x ** 5 / s, -4.1, 4.1, 'd', 2, '6 4', 200), 'leading term −2x⁵ (dashed)', 'd'),
         (3, arr(P.X(4.3), P.Y(-.5), P.X(4.7), P.Y(-1.1), 'tan', '', 2.6) + arr(P.X(-4.3), P.Y(.5), P.X(-4.7), P.Y(1.1), 'tan', '', 2.6), 'right: down; left: up', 'tan'),
         (4, '', 'f(100)/(−2·100⁵) ≈ 0.9985', 'ink')]
    return fig(base, L, 'The leading term takes over far from the origin (vertical scale compressed).', 196)

def _pop_fig():
    Pt = lambda t: -.1 * t ** 3 + 3 * t * t + 40 * t + 500
    P = Plot((0, 46), (-300, 2000), (40, 12, 200, 170))
    base = P.axes([10, 20, 30, 40], [500, 1000, 1500], 't (yr)', 'P', True)
    L = [(1, P.curve(Pt, 0, 30, 'f', 2.8, '', 100) + ''.join(P.dot(t, Pt(t), '', 'f', r=3.5) for t in (0, 10, 20, 30)), 'fits 30 years of data', 'f'),
         (2, P.curve(Pt, 30, 44, 'dd', 2.4, '6 4', 80), 'beyond the data the −0.1t³ term wins', 'dd'),
         (3, P.dot(42.26, 0, 't ≈ 42.3', 'tan', -26, -14, 5), 'P = 0 near t = 42', 'tan'),
         (4, '', 'use the model only near its data', 'ink')]
    return fig(base, L, 'A cubic town-population model: good for a while, absurd later.', 210)

mod('endbeh', 'End behavior',
 'Far from the origin, a polynomial looks like its leading term. Degree and sign alone decide where the ends go.',
 ['For very large |x|, the highest-power term of a polynomial is so much bigger than the others that it decides everything: the <b>end behavior</b> of f(x) = aₙxⁿ + … + a₀ is the same as that of its <b>leading term</b> aₙxⁿ. The middle can wiggle; the ends cannot.',
  'Two facts settle the ends. <b>Even degree</b>: both ends go the same way, up if aₙ > 0 and down if aₙ < 0. <b>Odd degree</b>: the ends go opposite ways, down on the left and up on the right if aₙ > 0, the reverse if aₙ < 0.',
  'Write it with limits: <span class="m">lim<sub>x→∞</sub> f(x) = ∞</span> means f(x) grows without bound as x does. For example, for f(x) = −2x³ + 5x, lim<sub>x→∞</sub> f(x) = −∞ and lim<sub>x→−∞</sub> f(x) = ∞. For a factored polynomial, multiply the leading terms of the factors to get the leading term.'],
 ('you could describe a polynomial near its zeros and turning points', 'a quick way to know the shape far away', 'models are used to predict, and predictions far out are controlled by the leading term', 'end behavior from degree and leading coefficient, and limit notation for it'),
 [('even n, aₙ > 0', 'up and up'), ('even n, aₙ < 0', 'down and down'), ('odd n, aₙ > 0', 'down left, up right'), ('odd n, aₙ < 0', 'up left, down right'), ('lim<sub>x→±∞</sub> f(x) = lim aₙxⁿ', '')],
 [lab('eb-lab', 'Zoom out until only the leading term matters', canvas='eb-canvas', aria='A polynomial and its leading term graphed together on a window that can be zoomed out; far enough out they look the same.',
   seg=('eb-fn', 'Polynomial', [('a', 'x³ − 6x² + 4'), ('b', '−x⁴ + 4x³ + 2x'), ('c', '0.5x⁵ − 5x³ + 4x'), ('d', '−(x − 3)²(x + 1)')]),
   ctl=[('eb-z', 'Zoom out (window half-width)', .5, 2.5, .01, .7)],
   out=[('eb-lead', 'leading term', 'x'), ('eb-ratio', 'f(x) ÷ leading term at the right edge', 'v'), ('eb-ends', 'end behavior', '')]),
  lab('eb-lab2', 'Degree and sign', canvas='eb-canvas2', aria='The graph of a·xⁿ with arrows on both ends, beside a two-by-two table of the four cases.',
   seg=('eb-s', 'Sign of a', [('pos', 'a > 0'), ('neg', 'a < 0')]),
   ctl=[('eb-n', 'Degree n', 1, 8, 1, 3)],
   out=[('eb-lim', 'limits', 'x'), ('eb-case', 'case', 'v')])],
 [('Choose <b>x³ − 6x² + 4</b> and zoom out slowly. When do the two graphs look alike?', show(['click', '#eb-fn [data-k=a]'], ['#eb-z', .7]), 'Near the origin they look nothing alike. By a half-width of about 100, the ratio f(x)/x³ at the edge is above 0.9 and the curves are almost on top of each other.'),
  ('Choose <b>−(x − 3)²(x + 1)</b>. What is its leading term without expanding?', show(['click', '#eb-fn [data-k=d]'], ['#eb-z', 1.5]), 'Multiply the leading terms of the factors: −(x²)(x) = −x³. Odd degree, negative: up on the left, down on the right.'),
  ('In the second lab, keep a > 0 and step n from 1 to 6. What alternates?', show(['click', '#eb-s [data-k=pos]'], ['#eb-n', 1]), 'Odd n: down on the left, up on the right. Even n: up on both ends. Only the parity of n and the sign of a matter.'),
  ('Switch to a < 0. What happens to every picture?', show(['click', '#eb-s [data-k=neg]'], ['#eb-n', 4]), 'It flips upside down (a reflection in the x-axis), so every arrow flips.'),
  ('Set n = 2 and then n = 8. How are the shapes different, and is the end behavior?', show(['click', '#eb-s [data-k=pos]'], ['#eb-n', 8]), 'x⁸ is flatter near 0 and steeper outside [−1, 1], but both go up on both ends: same end behavior.')],
 [{'h': 'Worked example: end behavior from the formula', 'fig': _lead_fig(),
   'prob': 'Describe the end behavior of f(x) = −2x⁵ + 30x³ + x − 7 with limits, and show that the leading term dominates.',
   'steps': ['<b>Leading term.</b> −2x⁵: degree 5 (odd), coefficient −2 (negative).',
    '<b>Ends.</b> Odd and negative: <b>lim<sub>x→∞</sub> f(x) = −∞</b> and <b>lim<sub>x→−∞</sub> f(x) = ∞</b>.',
    '<b>Check at x = 10.</b> f(10) = −200,000 + 30,000 + 10 − 7 = −169,997, and −2(10⁵) = −200,000: ratio ≈ 0.85.',
    '<b>At x = 100.</b> The ratio is ≈ 0.9985. The other terms matter less and less: f(x)/(−2x⁵) → 1.']},
  {'h': 'Worked example 2: a model that runs out', 'fig': _pop_fig(),
   'prob': 'A town\'s population t years after 1990 was modeled by P(t) = −0.1t³ + 3t² + 40t + 500 for 0 ≤ t ≤ 30. What does the model predict in the long run, and when does it predict the town is empty?',
   'steps': ['<b>On the data.</b> P(0) = 500, P(10) = 1100, P(20) = 1700, P(30) = 1700: the model fits growth that is leveling off.',
    '<b>End behavior.</b> Leading term −0.1t³: lim<sub>t→∞</sub> P(t) = <b>−∞</b>. The model must eventually predict a falling, then negative, population.',
    '<b>When P = 0.</b> A graphing calculator gives <b>t ≈ 42.3</b>, around 2032, after a peak of about 1813 near t ≈ 25.',
    '<b>Lesson.</b> A cubic fit is reasonable near its data, but its end behavior is set by its leading term, not by the town. Do not extrapolate far.']}],
 ['Using the constant term or the first term written instead of the highest-power term.', 'Forgetting the sign of the leading coefficient.', 'Thinking the middle wiggles change the end behavior.', 'For a factored form, adding degrees wrongly: (x − 1)²(x + 2)³ has degree 5.'],
 ('Why the leading term wins',
  ['Factor out the leading term: f(x) = aₙxⁿ(1 + (aₙ₋₁/aₙ)/x + … + (a₀/aₙ)/xⁿ). Every term in the parentheses except the 1 has x in a denominator, so it shrinks toward 0 as |x| grows. The parentheses approach 1, and f(x) behaves like aₙxⁿ.']),
 [('Which describes f(x) = 4 − 3x⁶ + x⁵?', ['down on both ends', 'up on both ends', 'down left, up right', 'up left, down right'], 0, 'Leading term −3x⁶: even degree, negative coefficient.'),
  ('lim<sub>x→−∞</sub> (2x³ − 100x²) =', ['−∞', '∞', '0', '2'], 0, 'Odd degree, positive: as x → −∞, 2x³ → −∞.')],
 extra_after_labs=_eb_drill(), ced=('1.6',))
