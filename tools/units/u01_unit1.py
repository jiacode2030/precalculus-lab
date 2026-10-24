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

# =====================================================================
# Batch 5: rational, holes, equiv, transform, models
# =====================================================================
def _ra_drill():
    D = [(lambda x: 2 * x / (x * x + 1), '2x / (x² + 1)', 0, None), (lambda x: (3 * x * x - 1) / (x * x + 2), '(3x² − 1) / (x² + 2)', 3, None),
         (lambda x: (x * x + 1) / (x - 1), '(x² + 1) / (x − 1)', None, (1, 1)), (lambda x: (-2 * x + 5) / (x - 4), '(−2x + 5) / (x − 4)', -2, None),
         (lambda x: 4 / (x * x + 1), '4 / (x² + 1)', 0, None), (lambda x: x ** 3 / (x * x - 4), 'x³ / (x² − 4)', None, (1, 0)),
         (lambda x: (5 * x * x + x) / (2 * x * x - 3), '(5x² + x) / (2x² − 3)', 2.5, None), (lambda x: (x + 1) / (x * x + x + 2), '(x + 1) / (x² + x + 2)', 0, None)]
    opts = ['y = 0', 'y = a constant other than 0', 'none: it keeps climbing like a slanted line']
    cases = []
    for f, form, ha, ob in D:
        # independent check: the far-away value of f decides the answer
        big = f(1e6); k = 0 if abs(big) < 1e-3 else 1 if abs(big) < 1e3 else 2
        assert (k == 0 and ha == 0) or (k == 1 and ha not in (None, 0)) or (k == 2 and ha is None), form
        P = Plot((-8, 8), (-8, 8), (14, 10, 232, 150))
        b = P.axes([-6, -3, 3, 6], [-6, -3, 3, 6], 'x', '') + safe_curve(P, f, -8, 8, 'f', 2.6, '', 800) + txt(20, 24, f'f(x) = {form}', 'mut', 10, 'start')
        a = b
        if k < 2: a += P.seg(-8, ha, 8, ha, 'area', 2, '6 4') + txt(244, P.Y(ha) - 6, f'y = {num(ha, 1)}', 'tan', 11, 'end')
        else:
            m = (f(2e5) - f(1e5)) / 1e5; c0 = f(1e5) - m * 1e5
            a += P.seg(-8, m * -8 + c0, 8, m * 8 + c0, 'area', 2, '6 4') + txt(244, 28, f'follows y = {num(m, 0)}x {"+" if c0 >= 0 else "−"} {num(abs(c0), 0)}', 'tan', 10, 'end')
        why = (['The numerator has the smaller degree, so the bottom wins far away: the outputs shrink to 0.', 'The degrees are equal, so the ratio of the leading coefficients is the horizontal asymptote.', 'The numerator has the bigger degree, so the outputs keep growing: no horizontal asymptote. Dividing gives the slanted line it follows.'][k])
        cases.append((f'What happens to f(x) = {form} far to the left and right?', svg(b, 172, f'Graph of f(x) = {form}'), svg(a, 172, f'Graph of f(x) = {form} with its far-away behavior'), opts, k, why))
    return drill('Far away: 8 rational functions', 'Compare the degrees of the top and the bottom, predict the far-away behavior, then see it.', cases, 'ra-drill')

RF = lambda x: (x - 1) * (x + 2) / ((x - 3) * (x + 1))

def _rat_fig():
    P = Plot((-6, 8), (-5, 6), (30, 10, 218, 176))
    base = P.axes([-4, -2, 2, 4, 6], [-4, -2, 2, 4], 'x', 'y')
    L = [(1, P.dot(1, 0, '1', 'tan', 0, 15, 4.5) + P.dot(-2, 0, '−2', 'tan', 0, 15, 4.5), 'zeros: 1 and −2 (numerator)', 'tan'),
         (2, P.seg(3, -5, 3, 6, 'area', 1.6, '6 4') + P.seg(-1, -5, -1, 6, 'area', 1.6, '6 4') + P.text(3.2, 5.2, 'x = 3', 'area', 9, 'start') + P.text(-1.2, -4.5, 'x = −1', 'area', 9, 'end'), 'vertical asymptotes: x = 3, x = −1', 'area'),
         (3, P.seg(-6, 1, 8, 1, 'area', 1.6, '2 3') + P.text(7.9, 1.45, 'y = 1', 'area', 9, 'end'), 'horizontal asymptote: y = 1', 'area'),
         (4, safe_curve(P, RF, -6, 8, 'f', 2.6, '', 700), 'f(x) = (x − 1)(x + 2) / ((x − 3)(x + 1))', 'f')]
    return fig(base, L, 'Zeros, asymptotes and the curve of one rational function.', 210)

def _avgcost_fig():
    A = lambda n: (500 + 8 * n) / n
    P = Plot((0, 110), (0, 40), (36, 12, 206, 170))
    base = P.axes([20, 40, 60, 80, 100], [10, 20, 30, 40], 'n', 'A ($)', True)
    L = [(1, safe_curve(P, A, 1, 110, 'f', 2.6, '', 400), 'A(n) = (500 + 8n)/n', 'f'),
         (2, P.dot(50, 18, '(50, $18)', 'tan', 20, -9, 4.5) + P.dot(100, 13, '(100, $13)', 'tan', -2, -12, 4.5), 'A(50) = 18, A(100) = 13', 'tan'),
         (3, P.seg(0, 8, 110, 8, 'area', 1.8, '6 4') + P.text(108, 6, 'y = 8', 'area', 10, 'end'), 'horizontal asymptote y = 8', 'area'),
         (4, '', 'more units: cost per unit → $8', 'ink')]
    return fig(base, L, 'Average cost per unit of a $500 setup plus $8 for each unit.', 210)

mod('rational', 'Rational functions',
 'A ratio of polynomials can blow up where the denominator is zero and settle down far away. Its zeros and asymptotes give the whole skeleton of the graph.',
 ['A <b>rational function</b> is a ratio of two polynomials, <span class="m">f(x) = p(x)/q(x)</span>. It is not defined where q(x) = 0. The <b>zeros</b> of f are the zeros of p, as long as q is not also 0 there. At each zero of q that is not cancelled, the graph has a <b>vertical asymptote</b>: the outputs grow without bound, positive or negative, as x approaches it.',
  '<b>Far away</b>, only the leading terms matter, as with polynomials. If deg p &lt; deg q the outputs shrink toward 0: horizontal asymptote <span class="m">y = 0</span>. If deg p = deg q they approach the ratio of leading coefficients: <span class="m">y = aₙ/bₙ</span>. If deg p &gt; deg q there is no horizontal asymptote: f keeps growing (when the degrees differ by exactly 1 it follows a slanted line, found by division).',
  'At a vertical asymptote x = c, look at the sign of f on each side: it depends on the sign of the factors and on whether the factor (x − c) appears an odd or even number of times. An odd power: the two sides go opposite ways (one to +∞, one to −∞). An even power: both sides go the same way. Write it as <span class="m">lim<sub>x→c⁺</sub> f(x) = ∞</span>.'],
 ('you could add, multiply and graph polynomials', 'a ratio of polynomials, which can be undefined at certain inputs', 'rates, averages and per-unit quantities are ratios, and ratios have behavior near zero and at infinity', 'zeros, vertical and horizontal asymptotes, end behavior, and one-sided limits of rational functions'),
 [('zeros of p(x)', 'x-intercepts (where q ≠ 0)'), ('q(x) = 0', 'vertical asymptote (or a hole)'), ('deg p < deg q', 'y = 0'), ('deg p = deg q', 'y = aₙ/bₙ'), ('deg p > deg q', 'no horizontal asymptote')],
 [lab('ra-lab', 'Build a rational function', canvas='ra-canvas', aria='A rational function with its zeros marked in orange, its vertical asymptotes as gold dashed vertical lines and its horizontal asymptote as a gold dashed horizontal line.',
   seg=('ra-case', 'Degrees', [('less', 'Top smaller'), ('equal', 'Equal'), ('slant', 'Top one bigger')]),
   pre='<p class="small" id="ra-form" style="margin:0;font:600 15px var(--f-math)"></p>',
   ctl=[('ra-z1', 'Zero 1', -5, 5, .5, 1), ('ra-z2', 'Zero 2', -5, 5, .5, -2), ('ra-p1', 'Pole 1 (denominator zero)', -5, 5, .5, 3), ('ra-p2', 'Pole 2', -5, 5, .5, -1), ('ra-k', 'Leading coefficient ratio', -3, 3, .5, 1)],
   out=[('ra-zero', 'zeros (x-intercepts)', 'x'), ('ra-va', 'vertical asymptotes', 'v'), ('ra-ha', 'far away', '')]),
  lab('ra-lab2', 'Which way does it go at an asymptote?', canvas='ra-canvas2', aria='A graph near a vertical asymptote with the left-hand and right-hand outputs marked by arrows; the power of the factor in the denominator can be changed.',
   seg=('ra-m', 'Power of (x − 2) in the denominator', [('m1', 'power 1'), ('m2', 'power 2'), ('m3', 'power 3')]),
   ctl=[('ra-s', 'Sign of the numerator', -1, 1, 2, 1)],
   out=[('ra-left', 'as x → 2 from the left', 'x'), ('ra-right', 'as x → 2 from the right', 'v'), ('ra-rule', 'rule', '')])],
 [('Choose <b>Equal</b>. Where does the graph level off, and does it ever cross that line?', show(['click', '#ra-case [data-k=equal]'], ['#ra-k', 2]), 'It levels off at y = the ratio of leading coefficients (2 when the ratio is 2). It can cross its horizontal asymptote in the middle; the asymptote describes only the far ends.'),
  ('Choose <b>Top smaller</b>. What is the horizontal asymptote? What happens at the zeros?', show(['click', '#ra-case [data-k=less]']), 'y = 0, the x-axis, because the bottom grows faster. The graph crosses the axis at each zero.'),
  ('Choose <b>Top one bigger</b>. Is there a horizontal asymptote?', show(['click', '#ra-case [data-k=slant]']), 'No: the outputs keep growing. The graph follows a slanted line far out, which you can find by dividing.'),
  ('Move Zero 1 until it sits on top of Pole 1. What happens to the asymptote?', show(['click', '#ra-case [data-k=equal]'], ['#ra-z1', 3], ['#ra-p1', 3]), 'It disappears and becomes a hole: the factor cancels. That is the next module.'),
  ('In the second lab, set power 1 and then power 2. What changes on the left side?', show(['click', '#ra-m [data-k=m2]']), 'With power 1 the sides go opposite ways. With power 2 the factor (x − 2)² is never negative, so both sides go the same direction.')],
 [{'h': 'Worked example: reading a rational function', 'fig': _rat_fig(),
   'prob': 'For f(x) = (x − 1)(x + 2) / ((x − 3)(x + 1)), find the zeros, the vertical asymptotes, the horizontal asymptote, and the sign of f just to the right of x = 3.',
   'steps': ['<b>Zeros.</b> The numerator is 0 at x = 1 and x = −2, and the denominator is not 0 there: <b>zeros 1 and −2</b>.',
    '<b>Vertical asymptotes.</b> The denominator is 0 at x = 3 and x = −1, and nothing cancels: <b>x = 3 and x = −1</b>.',
    '<b>Horizontal asymptote.</b> Degrees are equal (2 and 2); leading coefficients 1 and 1: <b>y = 1</b>.',
    '<b>Right of x = 3.</b> At x = 4: (3)(6)/((1)(5)) = 3.6 &gt; 0, so f(x) → <b>+∞</b> as x → 3⁺. At x = 2: (1)(4)/((−1)(3)) = −4/3, so f → −∞ from the left: opposite sides, as expected for an odd power.']},
  {'h': 'Worked example 2: cost per unit', 'fig': _avgcost_fig(),
   'prob': 'Making n units costs a $500 setup fee plus $8 per unit, so the average cost per unit is A(n) = (500 + 8n)/n. Find A(10), A(50) and A(100), and describe what happens as n gets large.',
   'steps': ['<b>A(10)</b> = (500 + 80)/10 = <b>$58</b>.',
    '<b>A(50)</b> = (500 + 400)/50 = <b>$18</b>. <b>A(100)</b> = (500 + 800)/100 = <b>$13</b>.',
    '<b>Large n.</b> Equal degrees (1 and 1), leading coefficients 8 and 1: horizontal asymptote <b>y = 8</b>. A(n) = 8 + 500/n, so the setup fee gets spread over more and more units.',
    '<b>Meaning.</b> The average cost keeps falling toward the $8 per-unit cost but never reaches it. At n → 0⁺ it blows up: a vertical asymptote at n = 0.']}],
 ['Thinking a graph can never cross its horizontal asymptote. It can, in the middle.', 'Cancelling terms instead of factors, like (x + 2)/(x + 3) → 2/3.', 'Writing a vertical asymptote as a y-value. A vertical asymptote is x = c.', 'Forgetting that a zero of the denominator that also cancels is a hole, not an asymptote.'],
 ('Why equal degrees give the ratio of leading coefficients',
  ['Divide the top and the bottom by the highest power of x. Every other term then has x in its denominator and shrinks toward 0, leaving the ratio of the leading coefficients. For (3x² − 5)/(2x² + 7x): divide by x² to get (3 − 5/x²)/(2 + 7/x) → 3/2.']),
 [('What is the horizontal asymptote of f(x) = (6x² + 1)/(2x² − 9)?', ['y = 3', 'y = 0', 'y = 6', 'none'], 0, 'Equal degrees: 6/2 = 3.'),
  ('f(x) = 1/(x − 4)². As x → 4 from either side, f(x) →', ['+∞', '−∞', '0', '+∞ on one side and −∞ on the other'], 0, 'An even power in the denominator keeps the sign positive: both sides go to +∞.')],
 extra_after_labs=_ra_drill(), ced=('1.7', '1.8', '1.9'))

# =====================================================================
# 1.10  Holes
# =====================================================================
def _hole_fig():
    P = Plot((-3, 7), (-2, 10), (30, 12, 210, 170))
    base = P.axes([-2, 2, 4, 6], [2, 4, 6, 8], 'x', 'y')
    f = lambda x: x + 2
    L = [(1, '', '(x − 3)(x + 2) / (x − 3)', 'ink'),
         (2, P.curve(f, -3, 7, 'f', 2.6) , 'cancel (x − 3): y = x + 2', 'f'),
         (3, hole(P.X(3), P.Y(5), 'f') + P.text(3.3, 4.1, 'hole at (3, 5)', 'tan', 10, 'start'), 'f(3) is undefined, but y → 5', 'tan'),
         (4, P.dot(0, 2, '', 'ink', r=3) + P.text(.2, 1.1, 'y-intercept 2', 'mut', 9, 'start'), 'no vertical asymptote at 3', 'ink')]
    return fig(base, L, 'f(x) = (x² − x − 6)/(x − 3): a line with one point missing.', 200)

def _margin_fig():
    P = Plot((0, 22), (0, 40), (32, 12, 208, 170))
    base = P.axes([5, 10, 15, 20], [10, 20, 30, 40], 'price x ($)', 'M ($)', True)
    M = lambda x: x + 10
    L = [(1, P.curve(M, 0, 22, 'f', 2.6), 'M(x) = (x² − 100)/(x − 10) = x + 10', 'f'),
         (2, hole(P.X(10), P.Y(20), 'f'), 'x = 10: the spreadsheet says #DIV/0!', 'tan'),
         (3, P.seg(10, 0, 10, 20, 'area', 1.2, '4 3') + P.seg(0, 20, 10, 20, 'area', 1.2, '4 3'), 'the graph points to M = 20', 'area'),
         (4, '', 'M(10) is undefined, M approaches 20', 'ink')]
    return fig(base, L, 'Margin per unit as the price approaches $10.', 210)

mod('holes', 'Holes',
 'When a factor appears in both the numerator and the denominator, the graph has a single missing point instead of an asymptote.',
 ['Factor the top and the bottom of a rational function. A factor <span class="m">(x − c)</span> in <i>both</i> means f is undefined at x = c, but it cancels everywhere else. After cancelling, the graph looks exactly like the simpler function, except for one missing point: a <b>hole</b> at x = c, drawn as an open circle.',
  'To find the hole, cancel the common factor, then plug x = c into what is left. That output is the height of the open circle. The original function is undefined there, but the outputs get closer and closer to this number from both sides: <span class="m">lim<sub>x→c</sub> f(x)</span> exists and equals it.',
  'Careful with <b>multiplicity</b>: if (x − c) appears more times in the denominator than in the numerator, some of it is left in the denominator after cancelling and x = c is still a vertical asymptote. A hole happens only when the factor is cancelled completely from the bottom.'],
 ('a zero of the denominator meant a vertical asymptote', 'a way to tell asymptotes from holes', 'a zero of the denominator can be cancelled, and the graph then has a hole, not a break in the whole graph', 'removable discontinuities (holes) versus vertical asymptotes, and the limit at a hole'),
 [('common factor (x − c)', 'hole at x = c'), ('hole height', 'plug c into the simplified function'), ('factor left in the denominator', 'vertical asymptote'), ('lim f(x) as x → c', 'the height of the hole')],
 [lab('ho-lab', 'Cancel it or not?', canvas='ho-canvas', aria='A rational function made from a numerator and denominator that share the factor (x − h). A hole is drawn as an open circle and any remaining vertical asymptote as a gold dashed line.',
   seg=('ho-pw', 'Powers of the shared factor', [('a11', 'top 1, bottom 1'), ('a12', 'top 1, bottom 2'), ('a21', 'top 2, bottom 1')]),
   pre='<p class="small" id="ho-form" style="margin:0;font:600 15px var(--f-math)"></p>',
   ctl=[('ho-h', 'Shared factor: zero h', -4, 4, .5, 1), ('ho-b', 'Other zero (top)', -4, 4, .5, -2), ('ho-c', 'Other pole (bottom)', -4, 4, .5, 3)],
   out=[('ho-simp', 'after cancelling', 'x'), ('ho-hole', 'at x = h', 'v'), ('ho-va', 'vertical asymptotes', '')]),
  lab('ho-lab2', 'Zoom in: hole or asymptote?', canvas='ho-canvas2', aria='A graph zoomed in on x = 2 so you can see whether the outputs settle on a number (a hole) or run off to infinity (an asymptote).',
   seg=('ho-fn', 'Function', [('hole', '(x² − 4)/(x − 2)'), ('va', '1/(x − 2)'), ('mix', '(x² − 1)/((x − 1)(x − 2))')]),
   ctl=[('ho-z', 'Zoom (window half-width)', .02, 3, .01, 3)],
   out=[('ho-near', 'f just beside x = 2', 'x'), ('ho-verdict', 'verdict', 'v')])],
 [('Choose <b>top 1, bottom 1</b>. Where is the open circle, and is there an asymptote at x = h?', show(['click', '#ho-pw [data-k=a11]'], ['#ho-h', 1]), 'The open circle sits at x = h with the height of the simplified function. There is no asymptote at h: the factor cancelled completely.'),
  ('Choose <b>top 1, bottom 2</b>. What happens now at x = h?', show(['click', '#ho-pw [data-k=a12]']), 'Cancelling one factor leaves (x − h) in the denominator, so there is a vertical asymptote at h. No hole.'),
  ('Choose <b>top 2, bottom 1</b>. Why is there a hole and also a zero at h?', show(['click', '#ho-pw [data-k=a21]']), 'One factor cancels (hole at x = h) and one is left in the numerator, so the simplified function has a zero there: the hole sits on the x-axis.'),
  ('In the second lab, choose <b>(x² − 4)/(x − 2)</b> and slide the zoom down to 0.02. What do you see?', show(['click', '#ho-fn [data-k=hole]'], ['#ho-z', .1]), 'The graph is a straight line with a tiny gap at x = 2 that never closes, however far you zoom. The outputs near 2 are all close to 4.'),
  ('Choose <b>1/(x − 2)</b> and zoom in the same way. What is different?', show(['click', '#ho-fn [data-k=va]'], ['#ho-z', .1]), 'The outputs get larger and larger: no number to settle on. That is an asymptote, not a hole.')],
 [{'h': 'Worked example: finding a hole', 'fig': _hole_fig(),
   'prob': 'Find the hole and any vertical asymptote of f(x) = (x² − x − 6)/(x − 3). Sketch the graph.',
   'steps': ['<b>Factor.</b> x² − x − 6 = (x − 3)(x + 2), so f(x) = (x − 3)(x + 2)/(x − 3).',
    '<b>Cancel.</b> For x ≠ 3, f(x) = x + 2: a line. The factor (x − 3) is gone from the denominator, so <b>no vertical asymptote</b>.',
    '<b>The hole.</b> f(3) is undefined, but the line has height 3 + 2 = 5 there: <b>hole at (3, 5)</b>.',
    '<b>Sketch.</b> Draw y = x + 2 and put an open circle at (3, 5). The outputs get closer and closer to 5 on both sides: lim f(x) = 5 as x → 3.']},
  {'h': 'Worked example 2: a spreadsheet error', 'fig': _margin_fig(),
   'prob': 'A shop\'s margin per unit at price x dollars is M(x) = (x² − 100)/(x − 10). The spreadsheet shows #DIV/0! at x = 10. What should the margin be there?',
   'steps': ['<b>Factor.</b> x² − 100 = (x − 10)(x + 10), so M(x) = (x − 10)(x + 10)/(x − 10).',
    '<b>Cancel.</b> For x ≠ 10, M(x) = x + 10.',
    '<b>At x = 10.</b> The graph is a line with a hole at (10, 20). The spreadsheet cannot divide by 0, but the values approach <b>$20</b>.',
    '<b>Check.</b> M(9.9) = 19.9, M(10.1) = 20.1: the margin passes smoothly through 20 on both sides.']}],
 ['Cancelling terms instead of factors.', 'Saying a hole is an asymptote, or the other way around: look at what is left in the denominator.', 'Finding the hole height from the original formula (it is undefined there). Use the simplified one.', 'Forgetting to factor completely before deciding.'],
 ('A hole is a removable discontinuity',
  ['If you simply define f(c) to be the missing height, the gap closes and the graph becomes one unbroken line. That is why holes are called removable. A vertical asymptote cannot be repaired by choosing one number.']),
 [('f(x) = (x² − 9)/(x − 3) has', ['a hole at (3, 6)', 'a vertical asymptote at x = 3', 'a hole at (3, 0)', 'neither'], 0, 'The simplified function is x + 3, which is 6 at x = 3.'),
  ('f(x) = (x − 2)/(x − 2)² has', ['a vertical asymptote at x = 2', 'a hole at x = 2', 'a zero at x = 2', 'a horizontal asymptote y = 2'], 0, 'After cancelling one factor, 1/(x − 2) remains: an asymptote.')],
 ced=('1.10',))

# =====================================================================
# 1.11  Equivalent forms
# =====================================================================
def _syn_table(c, r, upto, hl=None):
    """synthetic division of coefficients c by (x − r), shown as a table up to step `upto`"""
    n = len(c); X0, DX = 70, 44; ys = (40, 84, 118)
    o = txt(30, ys[0], str(r), 'tan', 15) + ln(46, 22, 46, 134, 'mut', 1.4) + ln(46, ys[1] + 12, X0 + DX * n + 6, ys[1] + 12, 'mut', 1.4)
    bring = [c[0]]
    for a in c[1:]: bring.append(a + bring[-1] * r)
    for i, a in enumerate(c): o += txt(X0 + DX * i, ys[0], str(a).replace('-', '−'), 'f', 15)
    for i in range(n):
        if i < upto:
            if i >= 1: o += txt(X0 + DX * i, ys[1], str(bring[i - 1] * r).replace('-', '−'), 'tan', 14)
            o += txt(X0 + DX * i, ys[2], str(bring[i]).replace('-', '−'), 'dd' if i == n - 1 else 'd', 15)
    o += txt(X0 + DX * 0, 150, '', 'mut', 1)
    return o

def _box_div_fig():
    c = [2, 9, 7, -6]
    base = ln(0, 0, 0, 0, 'mut', 1)
    L = [(1, _syn_table(c, -3, 1), 'bring down the leading 2', 'd'),
         (2, _syn_table(c, -3, 4), 'multiply by −3, add, repeat', 'tan'),
         (3, txt(130, 174, '2x² + 3x − 2', 'd', 15) + txt(130, 192, 'remainder 0', 'dd', 12), 'quotient 2x² + 3x − 2, remainder 0', 'd'),
         (4, txt(130, 214, '= (2x − 1)(x + 2)', 'f', 14), '2x² + 3x − 2 = (2x − 1)(x + 2)', 'f')]
    return fig(base, L, 'Synthetic division of 2x³ + 9x² + 7x − 6 by (x + 3), so r = −3.', 226)

def _oblique_fig():
    A = lambda n: n + 8 + 468 / (n + 4)
    P = Plot((0, 40), (0, 70), (34, 12, 206, 170))
    base = P.axes([10, 20, 30, 40], [20, 40, 60], 'n', 'A ($)', True)
    L = [(1, safe_curve(P, A, 5, 40, 'f', 2.6, '', 300), 'A(n) = (n² + 12n + 500)/(n + 4)', 'f'),
         (2, '', 'n² + 12n + 500 = (n + 4)(n + 8) + 468', 'ink'),
         (3, P.seg(0, 8, 40, 48, 'area', 1.8, '6 4') + P.text(26, 24, 'y = n + 8', 'area', 10, 'start'), 'slanted asymptote A = n + 8', 'area'),
         (4, P.seg(20, 28, 20, A(20), 'tan', 3) + P.text(21, 41, 'gap 19.5', 'tan', 10, 'start'), 'the gap is 468/(n + 4): it shrinks', 'tan')]
    return fig(base, L, 'Average cost per ticket: the fixed part spread out plus a per-ticket part.', 210)

mod('equiv', 'Equivalent forms',
 'Factored, expanded, divided: the same function can be written many ways, and each way shows something different.',
 ['A polynomial can be written <b>factored</b>, <span class="m">a(x − r₁)(x − r₂)…</span>, or <b>expanded</b>, <span class="m">aₙxⁿ + … + a₀</span>. Factored form shows the zeros and their multiplicities. Expanded form shows the degree, the leading term and the y-intercept a₀. Converting between them means multiplying out or factoring.',
  'To divide polynomials, use <b>long division</b> or, when dividing by (x − r), <b>synthetic division</b>. The result: <span class="m">p(x) = d(x)·q(x) + R(x)</span>, where the remainder R has smaller degree than the divisor d. For a divisor (x − r) the remainder is a number, and it equals p(r): the <b>Remainder Theorem</b>. If the remainder is 0, then (x − r) is a factor.',
  'Dividing the whole equation by d(x) gives a rational function as a quotient plus a remainder term: <span class="m">p(x)/d(x) = q(x) + R(x)/d(x)</span>. Far from the origin, R/d shrinks to 0, so the rational function follows q(x): for a quotient of degree 1 this is the slanted line (oblique asymptote).'],
 ('you factored quadratics and found zeros', 'a way to move between forms and to divide polynomials', 'each form answers a different question, and division reveals the asymptotes of a rational function', 'factoring, expanding, long and synthetic division, the Remainder Theorem and slanted asymptotes'),
 [('p(x) = d(x)·q(x) + R(x)', 'division'), ('remainder of p ÷ (x − r)', 'equals p(r)'), ('remainder 0', '(x − r) is a factor'), ('p/d = q + R/d', 'rational function as quotient + remainder')],
 [lab('eq-lab', 'Synthetic division, step by step', canvas='eq-canvas', aria='The synthetic division of a cubic polynomial by x minus r, drawn as a table that fills in one column at a time, with the quotient and remainder written below.',
   pre='<div class="row"><button type="button" class="btn primary" id="eq-step">Next step</button><button type="button" class="btn" id="eq-all">Show all</button></div>',
   ctl=[('eq-a', 'Coefficient of x³', 1, 4, 1, 2), ('eq-b', 'Coefficient of x²', -9, 9, 1, -3), ('eq-c', 'Coefficient of x', -9, 9, 1, 1), ('eq-d', 'Constant', -9, 9, 1, 5), ('eq-r', 'Divide by (x − r), r =', -4, 4, 1, 2)],
   out=[('eq-q', 'quotient', 'x'), ('eq-rem', 'remainder', 'v'), ('eq-chk', 'p(r) (Remainder Theorem)', '')]),
  lab('eq-lab2', 'Quotient plus remainder', canvas='eq-canvas2', aria='A rational function drawn with its slanted asymptote; the gap between them at a chosen x is the remainder term.',
   seg=('eq-fn', 'Function', [('a', '(x² + 3x + 5)/(x − 1)'), ('b', '(x² − 4x + 2)/(x + 2)'), ('c', '(2x² + x − 6)/(x − 1)')]),
   ctl=[('eq-x', 'x', -8, 8, .1, 4)],
   out=[('eq-form', 'p/d = quotient + R/d', 'x'), ('eq-gap', 'R/d at this x', 'v'), ('eq-tot', 'f(x)', '')])],
 [('Set the coefficients to 1, 0, −7, 6 with r = 2. What is the remainder, and what does it tell you?', show(['#eq-a', 1], ['#eq-b', 0], ['#eq-c', -7], ['#eq-d', 6], ['#eq-r', 2]), 'The remainder is 0: p(2) = 8 − 14 + 6 = 0, so (x − 2) is a factor. The quotient x² + 2x − 3 factors further as (x + 3)(x − 1).'),
  ('Change the constant to 7. What is the remainder now, and how does it compare with p(2)?', show(['#eq-d', 7]), 'The remainder is 1, and p(2) = 1: the Remainder Theorem. The remainder is just the output at r.'),
  ('Press <b>Next step</b> repeatedly. Which numbers get multiplied by r?', show(['#eq-a', 2], ['#eq-b', -3], ['#eq-c', 1], ['#eq-d', 5], ['#eq-r', 2]), 'Each result from the bottom row gets multiplied by r and written under the next coefficient, then added. Bring down, multiply, add, repeat.'),
  ('In the second lab, set x = 8. How much of f(x) comes from the remainder term?', show(['click', '#eq-fn [data-k=a]'], ['#eq-x', 8]), 'Almost none: R/d = 9/7 ≈ 1.29, compared with a quotient value of 12. The farther out you go, the smaller the remainder term and the closer f is to the slanted line.'),
  ('Move x close to the vertical asymptote. Which part dominates?', show(['click', '#eq-fn [data-k=a]'], ['#eq-x', 1.2]), 'The remainder term R/d: it grows without bound as d → 0, while the quotient stays moderate. Near an asymptote the remainder wins; far away the quotient wins.')],
 [{'h': 'Worked example: dividing a volume', 'fig': _box_div_fig(),
   'prob': 'A box has volume V(x) = 2x³ + 9x² + 7x − 6 and one dimension (x + 3). Find the other two dimensions.',
   'steps': ['<b>Set up.</b> Divide V(x) by (x + 3) = (x − (−3)), so r = −3, with coefficients 2, 9, 7, −6.',
    '<b>Synthetic division.</b> Bring down 2. 2 × (−3) = −6; 9 − 6 = 3. 3 × (−3) = −9; 7 − 9 = −2. (−2) × (−3) = 6; −6 + 6 = 0.',
    '<b>Read it.</b> The quotient is <b>2x² + 3x − 2</b> with <b>remainder 0</b>, which confirms that (x + 3) is a factor.',
    '<b>Factor the quotient.</b> 2x² + 3x − 2 = (2x − 1)(x + 2). The dimensions are <b>(x + 3), (2x − 1) and (x + 2)</b>.']},
  {'h': 'Worked example 2: cost per ticket', 'fig': _oblique_fig(),
   'prob': 'The total cost of making n tickets is n² + 12n + 500 dollars, so the average cost per ticket is A(n) = (n² + 12n + 500)/(n + 4). Rewrite A(n) as a quotient plus remainder and say what happens for large n.',
   'steps': ['<b>Divide.</b> (n + 4)(n + 8) = n² + 12n + 32, and 500 − 32 = 468: n² + 12n + 500 = (n + 4)(n + 8) + 468.',
    '<b>Rewrite.</b> <b>A(n) = n + 8 + 468/(n + 4)</b>.',
    '<b>Large n.</b> The fraction 468/(n + 4) shrinks toward 0, so A(n) follows the slanted line <b>y = n + 8</b>: no horizontal asymptote, a slanted one.',
    '<b>Check.</b> A(20) = 28 + 468/24 = 28 + 19.5 = 47.5. Directly: (400 + 240 + 500)/24 = 1140/24 = 47.5 ✓.']}],
 ['Forgetting a 0 for a missing term: dividing x³ − 7x + 6 means the coefficients are 1, 0, −7, 6.', 'Using r with the wrong sign: dividing by (x + 3) uses r = −3.', 'Calling the last number the last coefficient of the quotient: it is the remainder.', 'Cancelling terms across a sum in a fraction.'],
 ('Why the remainder is p(r)',
  ['Write p(x) = (x − r)q(x) + R. Put x = r: p(r) = 0·q(r) + R = R. So the remainder is exactly the value of p at r. That makes division a fast way to test whether r is a zero: if the remainder is 0, you have a zero and a factor at the same time.']),
 [('p(x) = x³ − 2x² − 5x + 6. What is the remainder when p is divided by (x − 3)?', ['0', '6', '−6', '12'], 0, 'p(3) = 27 − 18 − 15 + 6 = 0, so (x − 3) is a factor.'),
  ('(x² + 5x + 7)/(x + 2) = x + 3 + R/(x + 2). What is R?', ['1', '7', '−1', '3'], 0, '(x + 2)(x + 3) = x² + 5x + 6, so the remainder is 7 − 6 = 1.')],
 ced=('1.11',))

# =====================================================================
# 1.12  Transformations of functions
# =====================================================================
KEY = [(-2, 1), (0, 3), (2, -1), (4, 0)]

def _tr_fig():
    P = Plot((-3, 5), (-7, 5), (30, 10, 218, 180))
    base = P.axes([-2, 2, 4], [-6, -4, -2, 2, 4], 'x', 'y', True)
    a, b, h, k = -2, 2, 1, 1
    pl = lambda pts, c, w=2.4, d='': pline([(P.X(x), P.Y(y)) for x, y in pts], c, w, d)
    s1 = [(x / b, y) for x, y in KEY]; s2 = [(x / b + h, y) for x, y in KEY]; s3 = [(x / b + h, a * y + k) for x, y in KEY]
    L = [(1, pl(KEY, 'f') + ''.join(P.dot(x, y, '', 'f', r=4) for x, y in KEY), 'f through (−2, 1), (0, 3), (2, −1), (4, 0)', 'f'),
         (2, pl(s1, 'tan', 2, '5 4') + ''.join(P.dot(x, y, '', 'tan', r=3.5) for x, y in s1), 'f(2x): x-values halved', 'tan'),
         (3, pl(s2, 'dd', 2, '5 4') + ''.join(P.dot(x, y, '', 'dd', r=3.5) for x, y in s2), 'f(2(x − 1)): shifted right 1', 'dd'),
         (4, pl(s3, 'd', 2.8) + ''.join(P.dot(x, y, '', 'd', r=4) for x, y in s3), 'g = −2f(2(x − 1)) + 1: flipped, ×2, up 1', 'd')]
    return fig(base, L, 'Each key point (x, y) of f goes to (x/2 + 1, −2y + 1).', 226)

def _tide_fig():
    hA = lambda t: 4 + 3 * math.cos(math.pi * t / 6)
    hB = lambda t: 1.5 * hA(t - 2)
    P = Plot((0, 16), (0, 12), (34, 12, 206, 170))
    base = P.axes([4, 8, 12, 16], [3, 6, 9, 12], 't (h)', 'height (m)', True)
    L = [(1, P.curve(hA, 0, 16, 'f', 2.6, '', 160) + P.dot(0, 7, '7', 'f', 8, -6, 4) + P.dot(6, 1, '1', 'f', 0, 14, 4), 'harbor A: high 7 m at 0 h, low 1 m at 6 h', 'f'),
         (2, P.curve(hB, 2, 16, 'd', 2.6, '', 160) + P.dot(2, 10.5, '10.5', 'd', 12, -4, 4) + P.dot(8, 1.5, '1.5', 'd', 0, 14, 4), 'harbor B: 2 h later, 1.5 times as high', 'd'),
         (3, P.seg(0, 7, 2, 7, 'tan', 2, '4 3') + P.seg(2, 7, 2, 10.5, 'tan', 2, '4 3'), 'shift right 2, stretch vertically 1.5', 'tan'),
         (4, '', 'h_B(t) = 1.5·h_A(t − 2)', 'ink')]
    return fig(base, L, 'The same tide curve at two harbors.', 210)

mod('transform', 'Transformations of functions',
 'Shift, stretch and flip any graph with four numbers, and track what happens to every point.',
 ['Start from a graph y = f(x) and build a new one: <span class="m">g(x) = a·f(b(x − h)) + k</span>. Each number does one job. <b>h</b> shifts right by h (left if negative). <b>k</b> shifts up by k. <b>a</b> stretches vertically by |a| and flips the graph over the x-axis when a is negative. <b>b</b> compresses horizontally by a factor of 1/|b| and flips over the y-axis when b is negative.',
  'Follow a point. If (x, y) is on the graph of f, then <span class="m">(x/b + h, a·y + k)</span> is on the graph of g. The horizontal changes act on x and look <i>backwards</i> (b makes the graph narrower, h = 2 moves it right); the vertical changes act on y and look natural. To apply them in order: horizontal stretch or flip by b, then shift by h, then vertical stretch or flip by a, then shift by k.',
  'Transformations pass properties on. Zeros of g are at x/b + h for each zero x of f. The range of g is a·(range of f) + k, reversed if a is negative. Even and odd symmetry, intercepts and asymptotes all move with the graph. And any two graphs of the same shape at different sizes and places are related this way: the tide at one harbor and the tide at another.'],
 ('you graphed a function and read its values', 'a toolkit that turns one graph into a family of graphs', 'real data keep the same shape at different scales and positions', 'vertical and horizontal shifts, stretches and reflections, applied to key points, zeros, ranges and symmetry'),
 [('g(x) = a·f(b(x − h)) + k', ''), ('(x, y) on f ⇒ (x/b + h, a·y + k) on g', 'key points'), ('h, k', 'shifts'), ('|a|, |b|', 'stretch factors (b: horizontal, 1/|b|)'), ('a < 0, b < 0', 'flip over x-axis, y-axis')],
 [lab('tr-lab', 'Transform a graph', canvas='tr-canvas', aria='The original graph in blue, the transformed graph in green, and four key points of each connected by thin lines.',
   seg=('tr-base', 'Start from', [('bump', 'Four-point graph'), ('cubic', 'x³ − 3x'), ('inv', '1/x'), ('abs', '|x|')]),
   pre='<p class="small" id="tr-eq" style="margin:0;font:600 15px var(--f-math)"></p>',
   ctl=[('tr-a', 'a (vertical)', -3, 3, .5, 1), ('tr-b', 'b (horizontal)', -3, 3, .5, 1), ('tr-h', 'h (shift right)', -4, 4, .5, 0), ('tr-k', 'k (shift up)', -4, 4, .5, 0)],
   out=[('tr-pt', 'key point', 'x'), ('tr-dom', 'range of g', 'v'), ('tr-sym', 'symmetry of g', '')]),
  lab('tr-lab2', 'One step at a time', canvas='tr-canvas2', aria='The transformation drawn in four stages: the horizontal change, the horizontal shift, the vertical change and the vertical shift, with the current stage shown.',
   seg=('tr-ex', 'Example', [('e1', 'g = −2f(2(x − 1)) + 1'), ('e2', 'g = ½f(x + 2) − 3'), ('e3', 'g = f(−x) + 2')]),
   ctl=[('tr-st', 'Stage', 0, 4, 1, 0)],
   out=[('tr-stage', 'what just happened', 'x'), ('tr-order', 'point (−2, 1) is now', 'v')])],
 [('Choose the four-point graph. Set a = −1. What does each key point do?', show(['click', '#tr-base [data-k=bump]'], ['#tr-a', -1]), 'The graph flips over the x-axis: each point (x, y) goes to (x, −y).'),
  ('Set b = 2 (a = 1). Does the graph get wider or narrower?', show(['click', '#tr-base [data-k=bump]'], ['#tr-a', 1], ['#tr-b', 2]), 'Narrower: every x-coordinate is halved. A bigger b squeezes the graph, a trap for beginners.'),
  ('Set h = 2. Is that left or right? Which numbers change?', show(['#tr-b', 1], ['#tr-h', 2]), 'Right: g(x) = f(x − 2) needs x one bigger to do what f did, so each point moves 2 to the right. Only the x-coordinates change.'),
  ('Choose <b>1/x</b> and set k = 2. What happens to the horizontal asymptote?', show(['click', '#tr-base [data-k=inv]'], ['#tr-k', 2]), 'It moves up with the graph, from y = 0 to y = 2. Asymptotes are transformed like everything else.'),
  ('In the second lab choose the first example and drag the stage slider from 0 to 4. At which stage does the graph flip over?', show(['click', '#tr-ex [data-k=e1]'], ['#tr-st', 3]), 'At stage 3, the vertical stretch by a = −2: it stretches by 2 and flips. The shift by k = 1 in stage 4 then lifts it, but does not change its shape.')],
 [{'h': 'Worked example: moving key points', 'fig': _tr_fig(),
   'prob': 'The graph of f passes through (−2, 1), (0, 3), (2, −1) and (4, 0). Find the images of these points on the graph of g(x) = −2f(2(x − 1)) + 1.',
   'steps': ['<b>Read the numbers.</b> a = −2, b = 2, h = 1, k = 1.',
    '<b>Horizontal.</b> x → x/b + h = x/2 + 1. The x-values −2, 0, 2, 4 become 0, 1, 2, 3.',
    '<b>Vertical.</b> y → a·y + k = −2y + 1. The y-values 1, 3, −1, 0 become −1, −5, 3, 1.',
    '<b>Answer.</b> The graph of g passes through <b>(0, −1), (1, −5), (2, 3) and (3, 1)</b>. It is flipped and stretched vertically, squeezed horizontally and moved right 1 and up 1.']},
  {'h': 'Worked example 2: tides at two harbors', 'fig': _tide_fig(),
   'prob': 'At harbor A, the tide height is h_A(t) meters, with a high tide of 7 m at t = 0 and a low of 1 m at t = 6 hours. At harbor B the same tide arrives 2 hours later and is 1.5 times as high. Write h_B in terms of h_A, and find its high and low.',
   'steps': ['<b>Later.</b> A delay of 2 hours is a shift right by 2: replace t by t − 2.',
    '<b>Higher.</b> 1.5 times as high is a vertical stretch by 1.5: multiply the whole thing.',
    '<b>Formula.</b> <b>h_B(t) = 1.5·h_A(t − 2)</b>.',
    '<b>Key points.</b> High tide: (0, 7) → (2, 1.5 · 7) = <b>(2, 10.5)</b>. Low tide: (6, 1) → (8, 1.5 · 1) = <b>(8, 1.5)</b>. The range goes from [1, 7] to [1.5, 10.5].']}],
 ['Moving the wrong way for h: g(x) = f(x − 2) moves RIGHT.', 'Thinking b = 2 widens the graph. It narrows it by a factor of 2.', 'Doing the shifts before the stretches: f(2x − 2) is a shift by 1 after the squeeze, not by 2.', 'Forgetting that a vertical shift k also moves asymptotes and the range.'],
 ('Why the horizontal changes look backwards',
  ['For g(x) = f(2x), the output at x is what f produced at 2x, so g reaches f\'s value at x = 1 where f reached it at x = 2. The graph gets there twice as fast, so it is squeezed. In the same way g(x) = f(x − 2) at x = 5 gives f(3): g repeats f\'s outputs two units later, to the right.']),
 [('The graph of f has a zero at x = 4. Where is a zero of g(x) = f(2(x + 1))?', ['x = 1', 'x = 3', 'x = 5', 'x = 8'], 0, 'Solve 2(x + 1) = 4: x = 1. (Equivalently x/b + h = 4/2 − 1 = 1.)'),
  ('f has range [−3, 5]. What is the range of g(x) = −2f(x) + 1?', ['[−9, 7]', '[−7, 11]', '[−5, 11]', '[−11, 7]'], 0, 'Multiply by −2: [−10, 6], then add 1: [−9, 7]. The flip swaps which end is the max.')],
 ced=('1.12',))

# =====================================================================
# 1.13, 1.14  Function models
# =====================================================================
STOP = [(20, 44), (30, 82.5), (40, 132), (50, 192.5), (60, 264)]

def _stop_fig():
    P = Plot((0, 75), (0, 360), (38, 12, 204, 170))
    base = P.axes([20, 40, 60], [100, 200, 300], 'speed v (mph)', 'd (ft)', True) + ''.join(P.dot(v, d, '', 'f', r=4) for v, d in STOP)
    L = [(1, '', 'first differences 38.5, 49.5, 60.5, 71.5', 'tan'),
         (2, '', 'second differences all 11: quadratic', 'tan'),
         (3, P.curve(lambda v: .055 * v * v + 1.1 * v, 0, 62, 'f', 2.6), 'd = 0.055v² + 1.1v', 'f'),
         (4, P.dot(70, 346.5, '346.5', 'dd', -4, -10, 4.5) + P.curve(lambda v: .055 * v * v + 1.1 * v, 62, 72, 'dd', 2.4, '5 4'), 'prediction at 70 mph: about 347 ft', 'dd')]
    return fig(base, L, 'Stopping distance against speed.', 210)

def _pw_fig():
    P = Plot((0, 1000), (0, 160), (38, 12, 204, 170))
    C = lambda x: 10 + .12 * x if x <= 500 else 70 + .18 * (x - 500)
    base = P.axes([250, 500, 750, 1000], [40, 80, 120, 160], 'kWh', 'cost ($)', True)
    L = [(1, P.curve(C, 0, 500, 'f', 2.8, '', 40) + P.dot(0, 10, '$10', 'f', 14, 2, 4), 'first piece: 10 + 0.12x', 'f'),
         (2, P.curve(C, 500, 1000, 'd', 2.8, '', 40) + P.dot(500, 70, '(500, 70)', 'tan', -8, -10, 4.5), 'second piece: 70 + 0.18(x − 500)', 'd'),
         (3, P.dot(800, 124, '(800, $124)', 'tan', 16, 14, 4.5) + P.seg(800, 0, 800, 124, 'tan', 1.2, '4 3'), 'C(800) = 70 + 54 = 124', 'tan'),
         (4, '', 'no jump at 500: the pieces meet', 'ink')]
    return fig(base, L, 'A bill with a cheaper rate for the first 500 kWh.', 210)

mod('models', 'Building function models',
 'Choose the kind of function that fits the situation, say what you are assuming, and use the model with care.',
 ['A <b>function model</b> is a function that describes a real situation. To <b>select</b> one, look at the data and the context. Constant first differences: linear. Constant second differences: quadratic. Outputs that level off toward a value (like cost per unit): rational. A graph that changes behavior at a known point: piecewise. A shape that rises, falls and rises again: cubic or higher.',
  'Every model carries <b>assumptions</b>: that growth stays the same, that the shape continues, that no other factors matter. State them, check them against the data, and say where the model should not be trusted, especially outside the range of the data (<b>extrapolation</b>). A <b>residual</b> is data minus model: random residuals say the model fits; a pattern in the residuals says it does not.',
  'To <b>construct</b> a model: choose a type, find its parameters (from points, differences, a regression, or the context), state the domain, and use it to answer the question asked, with units. A <b>piecewise</b> function uses different formulas on different intervals, such as a bill with tiered rates; check what happens at the breakpoints.'],
 ('you worked with linear, quadratic, polynomial and rational functions as formulas', 'a way to choose among them and defend the choice', 'real situations come as tables and stories, not formulas', 'selecting and building models from data and context, residuals, extrapolation, assumptions, and piecewise functions'),
 [('constant first differences', 'linear'), ('constant second differences', 'quadratic'), ('(F + v·n)/n', 'average cost: rational'), ('residual = data − model', ''), ('piecewise', 'different rule on each interval')],
 [lab('md-lab', 'Fit a model to data', canvas='md-canvas', aria='A scatter plot of data with a fitted curve; the residuals are drawn as short vertical segments and also as bars below.',
   seg=('md-data', 'Data', [('stop', 'Stopping distance'), ('fuel', 'Fuel use'), ('cost', 'Cost per unit')]),
   pre='<div class="seg" id="md-type" role="group" aria-label="Model type"><button type="button" data-k="lin" aria-pressed="true">Linear</button><button type="button" data-k="quad" aria-pressed="false">Quadratic</button><button type="button" data-k="cub" aria-pressed="false">Cubic</button><button type="button" data-k="rat" aria-pressed="false">a/x + b</button></div>',
   out=[('md-eq', 'best-fit model', 'x'), ('md-rms', 'typical miss (RMS residual)', 'v'), ('md-verdict', 'verdict', '')]),
  lab('md-lab2', 'Piecewise models: a tiered bill', canvas='md-canvas2', aria='A piecewise-linear graph: one line up to the breakpoint and another after it. The breakpoint, the two rates and the fixed fee can be changed.',
   ctl=[('md-c', 'Breakpoint (kWh)', 100, 900, 50, 500), ('md-r1', 'Rate before ($ per kWh)', .05, .3, .01, .12), ('md-r2', 'Rate after ($ per kWh)', .05, .3, .01, .18), ('md-x', 'Usage x (kWh)', 0, 1000, 10, 800)],
   out=[('md-form', 'C(x) =', 'x'), ('md-val', 'bill at x', 'v'), ('md-cont', 'at the breakpoint', '')])],
 [('Choose <b>Stopping distance</b> with a linear model. What pattern do the residuals show?', show(['click', '#md-data [data-k=stop]'], ['click', '#md-type [data-k=lin]']), 'A U-shape: positive at both ends, negative in the middle. A pattern in the residuals means a line is the wrong kind of function.'),
  ('Switch to quadratic. What happens to the residuals?', show(['click', '#md-type [data-k=quad]']), 'They shrink to almost nothing and show no pattern: the quadratic fits.'),
  ('Choose <b>Cost per unit</b>. Which model type fits best?', show(['click', '#md-data [data-k=cost]'], ['click', '#md-type [data-k=rat]']), 'The a/x + b model, with b near the per-unit cost. Quadratic and cubic fits can match the points but go wrong outside the data.'),
  ('In the second lab, set both rates to 0.12. What happens at the breakpoint?', show(['#md-r1', .12], ['#md-r2', .12]), 'The kink disappears: it is a single line. A piecewise model needs different rates to be a genuinely different model.'),
  ('Move the breakpoint to 300. Does the bill at 800 kWh go up or down?', show(['#md-r1', .12], ['#md-r2', .18], ['#md-c', 300]), 'Up: more of the usage is charged at the higher rate, so the 800 kWh bill rises.')],
 [{'h': 'Worked example: choosing a model from a table', 'fig': _stop_fig(),
   'prob': 'A driver tests the stopping distance d (in feet) at several speeds v (in mph). Choose a model, find its formula, and predict d at 70 mph. Say what you are assuming.',
   'table': ([['v (mph)', '20', '30', '40', '50', '60'], ['d (ft)', '44', '82.5', '132', '192.5', '264']], 'Stopping distance'),
   'steps': ['<b>First differences</b> (step 10): 38.5, 49.5, 60.5, 71.5. Not constant, so not linear.',
    '<b>Second differences:</b> 11, 11, 11. Constant: choose a <b>quadratic</b>. With step 10, 2a(10)² = 11, so a = 0.055.',
    '<b>The rest.</b> d = 0.055v² + bv + c. Using d(20) = 44 and d(30) = 82.5: 22 + 20b + c = 44 and 49.5 + 30b + c = 82.5, so b = 1.1 and c = 0. <b>d = 0.055v² + 1.1v</b>.',
    '<b>Predict.</b> d(70) = 0.055(4900) + 1.1(70) = 269.5 + 77 = <b>346.5 ft</b>. This assumes the same road, tires and driver as in the test, and speeds beyond the data (extrapolation).']},
  {'h': 'Worked example 2: a tiered electricity bill', 'fig': _pw_fig(),
   'prob': 'An electric company charges a $10 fee plus $0.12 per kWh for the first 500 kWh, and $0.18 per kWh for each kWh above 500. Write the bill C(x) as a piecewise function and find the bill for 800 kWh.',
   'steps': ['<b>First piece</b> (0 ≤ x ≤ 500): C(x) = 10 + 0.12x. At 500 kWh: 10 + 60 = $70.',
    '<b>Second piece</b> (x > 500): start from $70 and add $0.18 for each kWh above 500: C(x) = 70 + 0.18(x − 500).',
    '<b>Piecewise form.</b> <b>C(x) = 10 + 0.12x for 0 ≤ x ≤ 500; C(x) = 70 + 0.18(x − 500) for x > 500</b>.',
    '<b>800 kWh.</b> C(800) = 70 + 0.18(300) = 70 + 54 = <b>$124</b>. The pieces meet at (500, 70), so the bill has no jump.']}],
 ['Choosing a model by its R² or how close it looks inside the data, without thinking about the context or what happens outside.', 'Extrapolating far beyond the data and trusting it.', 'Writing a piecewise function with pieces that do not meet when the story says they do.', 'Forgetting units, or the domain on which the model makes sense.'],
 ('No model is right; some are useful',
  ['A model is a simplified description. A quadratic for stopping distance is right for the physics (braking distance grows with the square of speed), plus a term for reaction time. A cubic could fit the same five points but has no physical reason to. Good modeling joins the data to the story.']),
 [('Constant second differences, but not constant first differences, suggest what kind of model?', ['quadratic', 'linear', 'rational', 'piecewise'], 0, 'Constant second differences are the signature of a quadratic.'),
  ('Data end at x = 10. A model predicts the value at x = 100. This is', ['extrapolation, and risky', 'interpolation, and safe', 'a residual', 'a piecewise function'], 0, 'Predicting outside the range of the data is extrapolation.')],
 ced=('1.13', '1.14'))
