# Unit 2: Exponential and logarithmic functions. Batch 6: seqs, expfn, expmanip, expmodel, compose.
import math

# =====================================================================
# 2.1  Arithmetic & geometric sequences
# =====================================================================
def _seat_fig():
    a = lambda n: 3 * n + 17
    P = Plot((0, 31), (0, 115), (34, 12, 208, 170))
    base = P.axes([5, 10, 15, 20, 25, 30], [25, 50, 75, 100], 'row n', 'seats', True)
    dots = lambda ns, c='f', r=3.4: ''.join(P.dot(n_, a(n_), '', c, r=r) for n_ in ns)
    L = [(1, dots(range(1, 31)) + P.dot(1, 20, '20', 'f', 8, -8, 4.2), 'row 1 has 20 seats; each row adds 3', 'f'),
         (2, P.seg(1, 20, 2, 20, 'tan', 2) + P.seg(2, 20, 2, 23, 'tan', 2) + P.text(5.5, 26, '+3', 'tan', 11), 'every step up is the same: +3', 'tan'),
         (3, P.seg(0, 17, 30, 107, 'area', 1.8, '6 4'), 'a(n) = 20 + 3(n − 1) = 3n + 17', 'area'),
         (4, P.seg(0, 100, 31, 100, 'dd', 1.4, '4 3') + P.dot(28, 101, 'row 28', 'dd', -20, -10, 5), 'first row over 100 seats: row 28', 'dd')]
    return fig(base, L, 'Seats per row in a theater: an arithmetic sequence.', 210)

def _views_fig():
    v = lambda n: 500 * 1.2 ** n
    P = Plot((-.5, 12.5), (0, 3800), (40, 12, 202, 170))
    base = P.axes([2, 4, 6, 8, 10, 12], [1000, 2000, 3000], 'day n', 'views', True)
    L = [(1, ''.join(P.dot(n_, v(n_), '', 'f', r=3.8) for n_ in range(0, 13)) + P.dot(0, 500, '500', 'f', 14, -4, 4.2), 'day 0: 500 views, each day 1.2 times the last', 'f'),
         (2, P.curve(v, 0, 12.4, 'd', 2.2, '5 4', 120), 'v(n) = 500(1.2)ⁿ', 'd'),
         (3, P.seg(-.5, 2000, 12.5, 2000, 'area', 1.6, '5 4') + P.dot(7, v(7), '1792', 'tan', 0, 15, 4.5), 'day 7: about 1792, still under 2000', 'tan'),
         (4, P.dot(8, v(8), '2150', 'dd', 0, -10, 5), 'day 8: about 2150 views. First day above 2000', 'dd')]
    return fig(base, L, 'Daily views of a video: a geometric sequence.', 210)

def _sq_drill():
    cases = []
    D = [([3, 7, 11, 15, 19], 'Arithmetic: each term is 4 more than the last.', 0),
         ([2, 6, 18, 54, 162], 'Geometric: each term is 3 times the last.', 1),
         ([1, 4, 9, 16, 25], 'Neither: the differences 3, 5, 7, 9 are not constant and the ratios 4, 2.25, … are not constant.', 2),
         ([80, 40, 20, 10, 5], 'Geometric: each term is half the last (ratio 0.5).', 1),
         ([10, 7, 4, 1, -2], 'Arithmetic: each term is 3 less than the last.', 0),
         ([1, 2, 4, 7, 11], 'Neither: the differences 1, 2, 3, 4 are not constant and the ratios are not constant.', 2)]
    opts = ['arithmetic', 'geometric', 'neither']
    for terms, why, k in D:
        P = Plot((-.5, 4.5), (min(0, min(terms)) - 2, max(terms) * 1.12), (30, 10, 210, 130))
        b = P.axes([0, 1, 2, 3, 4], [], 'n', '') + ''.join(P.dot(i, t, str(t).replace('-', '−'), 'f', 0, -9, 4.5) for i, t in enumerate(terms))
        cases.append(('Look at the terms. What kind of sequence is this?', svg(b, 160, 'The first five terms of a sequence'), None, opts, k, why))
    return drill('Arithmetic, geometric or neither?', 'Check the differences, then the ratios.', cases, 'sq-drill')

mod('seqs', 'Arithmetic & geometric sequences',
 'A sequence adds the same amount each step, or multiplies by the same factor each step. These two patterns are the seeds of linear and exponential functions.',
 ['A <b>sequence</b> is a list of numbers a₀, a₁, a₂, … : a function whose inputs are whole numbers. In an <b>arithmetic</b> sequence each term is the last plus a constant <b>common difference d</b>: <span class="m">aₙ = aₙ₋₁ + d</span>. In a <b>geometric</b> sequence each term is the last times a constant <b>common ratio r</b>: <span class="m">aₙ = r·aₙ₋₁</span>.',
  'Adding d, n times, gives an <b>explicit</b> formula: <span class="m">aₙ = a₀ + dn</span>, a linear function of n. Multiplying by r, n times, gives <span class="m">aₙ = a₀·rⁿ</span>, an exponential function of n. More generally, from any known term aₖ: <span class="m">aₙ = aₖ + d(n − k)</span> or <span class="m">aₙ = aₖ·rⁿ⁻ᵏ</span>.',
  'To tell them apart from data, look at <b>differences</b> and <b>ratios</b> of consecutive terms. Constant differences mean arithmetic; constant ratios mean geometric. If neither is constant, it is neither (a quadratic, for example, has constant <i>second</i> differences).'],
 ('you described change with a table or a single number', 'two different kinds of constant change', 'a sequence can change by a constant amount or by a constant factor', 'common difference and ratio, recursive and explicit rules, and a way to decide from data which one applies'),
 [('aₙ = aₙ₋₁ + d', 'arithmetic, recursive'), ('aₙ = a₀ + dn', 'arithmetic, explicit'), ('aₙ = r·aₙ₋₁', 'geometric, recursive'), ('aₙ = a₀·rⁿ', 'geometric, explicit'), ('aₙ = aₖ + d(n − k)', 'from any known term')],
 [lab('sq-lab', 'Build a sequence', canvas='sq-canvas', aria='The first eleven terms of a sequence drawn as dots, with the change from each term to the next drawn as bars below.',
   seg=('sq-kind', 'Rule', [('arith', 'add d each step'), ('geom', 'multiply by r each step')]),
   ctl=[('sq-a', 'First term a₀', -5, 10, 1, 2), ('sq-d', 'Difference d', -5, 5, 1, 3), ('sq-r', 'Ratio r', .5, 2, .1, 1.5)],
   out=[('sq-terms', 'first terms', 'x'), ('sq-rule', 'explicit rule', 'v'), ('sq-const', 'what stays constant', '')]),
  lab('sq-lab2', 'Step by step or jump straight there', canvas='sq-canvas2', aria='A chain of terms, each built from the one before; a marker shows the term chosen by the slider and the explicit formula that gives it directly.',
   seg=('sq-kind2', 'Rule', [('arith', 'aₙ = aₙ₋₁ + 3'), ('geom', 'aₙ = 2·aₙ₋₁')]),
   ctl=[('sq-n', 'Term number n', 0, 10, 1, 6)],
   out=[('sq-chain', 'building it step by step', 'x'), ('sq-jump', 'jumping straight there', 'v'), ('sq-val', 'aₙ', '')])],
 [('Choose <b>add d each step</b> with a₀ = 2 and d = 3. What do the bars show?', show(['click', '#sq-kind [data-k=arith]'], ['#sq-a', 2], ['#sq-d', 3]), 'All the bars are the same height, 3. The dots rise along a straight line: constant change means linear.'),
  ('Switch to <b>multiply</b> with r = 1.5. Do the bars still stay the same?', show(['click', '#sq-kind [data-k=geom]'], ['#sq-r', 1.5]), 'The differences grow, but the ratios stay at 1.5. For a geometric sequence it is the ratio that is constant, not the difference.'),
  ('Set r = 0.5. What happens to the terms?', show(['click', '#sq-kind [data-k=geom]'], ['#sq-r', .5], ['#sq-a', 8]), 'They shrink toward 0: multiplying by a number between 0 and 1 is decay. The differences are negative and shrinking in size.'),
  ('In the second lab choose <b>aₙ = 2·aₙ₋₁</b> and set n = 10. Which is quicker: building up, or jumping?', show(['click', '#sq-kind2 [data-k=geom]'], ['#sq-n', 10]), 'Jumping: a₁₀ = 1·2¹⁰ = 1024 takes one calculation, while the chain takes ten. That is why explicit formulas matter.')],
 [{'h': 'Worked example: seats in a theater', 'fig': _seat_fig(),
   'prob': 'The first row of a theater has 20 seats and each row has 3 more seats than the row in front of it. Write a formula for the number of seats in row n, and find the first row with more than 100 seats.',
   'steps': ['<b>Type.</b> The same amount is added each row, so the sequence is <b>arithmetic</b> with first term 20 (row 1) and d = 3.',
    '<b>Formula.</b> From row 1: a(n) = 20 + 3(n − 1) = <b>3n + 17</b>. Check: a(2) = 23 ✓.',
    '<b>Solve.</b> 3n + 17 > 100 gives 3n > 83, so n > 27.67.',
    '<b>Answer.</b> The first whole row number is <b>28</b>. Check: a(27) = 98 and a(28) = 101.']},
  {'h': 'Worked example 2: a video catches on', 'fig': _views_fig(),
   'prob': 'A video has 500 views on day 0, and each day it gets 1.2 times as many total views as the day before. Find the views on day 10 and the first day with more than 2000 views.',
   'steps': ['<b>Type.</b> Each day is multiplied by 1.2, so the sequence is <b>geometric</b> with a₀ = 500 and r = 1.2: <b>vₙ = 500(1.2)ⁿ</b>.',
    '<b>Day 10.</b> v₁₀ = 500(1.2)¹⁰ = 500(6.1917…) ≈ <b>3096 views</b>.',
    '<b>Day with more than 2000.</b> Try values: v₇ = 500(3.5832) ≈ 1792 and v₈ = 500(4.2998) ≈ 2150.',
    '<b>Answer.</b> The first day above 2000 is <b>day 8</b>. (Later, logarithms will solve 500(1.2)ⁿ = 2000 directly: n ≈ 7.6.)']}],
 ['Calling a sequence arithmetic because the terms increase. Check that the differences are <i>equal</i>.', 'Using aₙ = a₀ + d·n with n starting at 1 when the first given term is a₁: use the term you know.', 'Dividing in the wrong order for the ratio: r = aₙ / aₙ₋₁, the later over the earlier.', 'Confusing the common difference with the common ratio.'],
 ('Sequences are functions',
  ['A sequence is a function whose inputs are integers. Arithmetic sequences are the integer points of a line, and geometric sequences are the integer points of an exponential curve a·bˣ. The next modules turn these dots into continuous graphs, and the same two ideas, constant change versus constant factor, drive everything in Unit 2.']),
 [('The sequence 5, 8, 11, 14, … has explicit rule', ['aₙ = 5 + 3n (starting at n = 0)', 'aₙ = 5·3ⁿ', 'aₙ = 5 + 8n', 'aₙ = 3 + 5n'], 0, 'a₀ = 5 and d = 3.'),
  ('Terms 6, 12, 24, 48, … have', ['common ratio 2', 'common difference 6', 'common ratio 6', 'no pattern'], 0, '12/6 = 24/12 = 48/24 = 2.')],
 extra_after_labs=_sq_drill(), ced=('2.1',))

# =====================================================================
# 2.2, 2.3  Exponential functions
# =====================================================================
def _bact_fig():
    f = lambda t: 800 * 1.15 ** t
    P = Plot((-.4, 7), (0, 2200), (40, 12, 200, 170))
    base = P.axes([1, 2, 3, 4, 5, 6], [500, 1000, 1500, 2000], 't (hours)', 'cells', True)
    pts = lambda ts: ''.join(P.dot(t, f(t), '', 'f', r=4) for t in ts)
    L = [(1, pts(range(0, 7)) + P.dot(0, 800, '800', 'f', 14, -4, 4.2), 'f(0) = 800 cells at the start', 'f'),
         (2, ''.join(P.seg(t, f(t), t + 1, f(t + 1), 'tan', 1.8, '4 3') + P.text(t + .5, f(t + 1) + 150 - 40 * (t < 1), '×1.15', 'tan', 9) for t in (0, 1, 2)), 'each hour: multiply by 1.15', 'tan'),
         (3, P.curve(f, 0, 7, 'd', 2.2, '', 120), 'f(t) = 800(1.15)ᵗ', 'd'),
         (4, P.dot(6, f(6), '1850', 'dd', -4, -12, 5) + P.seg(6, 0, 6, f(6), 'dd', 1.2, '3 3'), 'f(6) = 800(1.15)⁶ ≈ 1850', 'dd')]
    return fig(base, L, 'A bacteria colony growing 15% per hour.', 210)

def _car_fig():
    V = lambda t: 24000 * .88 ** t
    P = Plot((-.4, 10.5), (0, 26000), (44, 12, 196, 170))
    base = P.axes([2, 4, 6, 8, 10], [5000, 10000, 15000, 20000, 25000], 't (years)', 'value ($)', True)
    L = [(1, P.curve(V, 0, 10.4, 'f', 2.6, '', 120) + P.dot(0, 24000, '24000', 'f', 20, 6, 4.2), 'V(t) = 24000(0.88)ᵗ: loses 12% a year', 'f'),
         (2, ''.join(P.seg(t, V(t), t + 1, V(t + 1), 'tan', 1.8, '4 3') for t in (0, 1, 2)) + P.text(1.6, 22800, '×0.88', 'tan', 10, 'start'), 'each year: multiply by 0.88', 'tan'),
         (3, P.seg(-.4, 10000, 10.5, 10000, 'area', 1.5, '5 4') + P.dot(6, V(6), '11146', 'tan', 0, -12, 4.5), 'year 6: about $11146, still above 10000', 'tan'),
         (4, P.dot(7, V(7), '9808', 'dd', 6, -12, 5), 'year 7: about $9808. First year below $10000', 'dd')]
    return fig(base, L, 'A car loses 12% of its value each year.', 210)

def _ex_drill():
    cases = []
    D = [(3, 2, '3(2)ˣ', ['3(2)ˣ', '3(0.5)ˣ', '1.5(2)ˣ']), (3, .5, '3(0.5)ˣ', ['3(2)ˣ', '3(0.5)ˣ', '6(0.5)ˣ']),
         (2, 3, '2(3)ˣ', ['2(3)ˣ', '3(2)ˣ', '2(1/3)ˣ']), (8, .25, '8(0.25)ˣ', ['8(4)ˣ', '2(0.25)ˣ', '8(0.25)ˣ']),
         (1, 1.5, '1(1.5)ˣ', ['1.5(1)ˣ', '1(1.5)ˣ', '1(0.5)ˣ']), (5, .8, '5(0.8)ˣ', ['5(1.25)ˣ', '5(0.8)ˣ', '0.8(5)ˣ'])]
    for a, b, form, opts in D:
        f = lambda x, a=a, b=b: a * b ** x
        ymax = max(f(0), f(2), f(-1) if b < 1 else f(2)) * 1.1
        P = Plot((-1.6, 3.6), (-ymax * .06, ymax), (34, 10, 206, 136))
        bs = P.axes([-1, 1, 2, 3], [], 'x', '') + P.curve(f, -1.5, 3.5, 'f', 2.6, '', 160) + P.dot(0, a, f'(0, {a})', 'tan', 30, -4, 4.8) + P.dot(1, f(1), f'(1, {f(1):g})', 'tan', 6, -12, 4.8)
        why = f'The y-intercept is a = {a} and each step right multiplies by b = f(1)/f(0) = {f(1):g}/{a} = {b:g}. So the function is {form}. ' + ('The factor is above 1, so it grows.' if b > 1 else 'The factor is below 1, so it decays.')
        cases.append(('Which function has this graph? (The two orange points are on it.)', svg(bs, 160, 'An exponential graph with two points marked'), None, opts, opts.index(form), why))
    return drill('Read the formula from the graph', 'The y-intercept is a. One step right multiplies by b.', cases, 'ex-drill')

mod('expfn', 'Exponential functions',
 'Linear functions add the same amount each step; exponential functions multiply by the same factor. That one difference changes the whole shape of the graph.',
 ['Over equal-length input intervals, a <b>linear</b> function changes by a constant <i>amount</i> and an <b>exponential</b> function changes by a constant <i>factor</i>. A function of the form <span class="m">f(x) = a·bˣ</span> (a ≠ 0, b > 0, b ≠ 1) is exponential: <b>a</b> is the initial value f(0), the y-intercept, and <b>b</b> is the <b>growth factor</b>, the number you multiply by for each step of 1 in x.',
  'If b > 1 the function is <b>growth</b>: with a > 0 it increases and is concave up; <span class="m">b = 1 + r</span> where r is the percent increase per step. If 0 < b < 1 it is <b>decay</b>: with a > 0 it decreases, still concave up, and r = b − 1 is negative. A 15% growth rate means b = 1.15; a 12% loss means b = 0.88.',
  'The graph has a <b>horizontal asymptote</b> at y = 0. For a > 0, b > 1: as x → ∞ the outputs grow without bound, and as x → −∞ they approach 0. For 0 < b < 1 the two ends swap. The domain is all real numbers; the range is y > 0 (or y < 0 if a < 0). Exponential growth eventually beats any polynomial.'],
 ('you added a constant to get the next term in a sequence', 'a rule where the whole real line is the input, not only whole numbers', 'the change per step is a factor, and the graph is continuous with an asymptote', 'the form a·bˣ, growth and decay factors, percent rates, concavity, end behavior and the horizontal asymptote'),
 [('f(x) = a·bˣ', 'a = f(0), b = growth factor'), ('b = 1 + r', 'r = rate per step'), ('f(x + 1) = b·f(x)', 'constant ratio'), ('b > 1: growth; 0 < b < 1: decay', ''), ('horizontal asymptote y = 0', 'range y > 0 when a > 0')],
 [lab('ex-lab', 'Explore a·bˣ', canvas='ex-canvas', aria='The graph of f(x) = a·b to the x, with its y-intercept marked and the points at whole x-values joined by dashed arrows labeled with the growth factor.',
   ctl=[('ex-a', 'Initial value a', -4, 4, .5, 2), ('ex-b', 'Growth factor b', .2, 3, .05, 1.5)],
   out=[('ex-form', 'f(x) =', 'x'), ('ex-rate', 'change per step', 'v'), ('ex-end', 'end behavior', '')]),
  lab('ex-lab2', 'Add or multiply?', canvas='ex-canvas2', aria='An exponential curve and a straight line through the same first two points; dots show each at equal steps along the x-axis.',
   ctl=[('ex-b2', 'Growth factor b', 1.1, 2.5, .1, 1.5), ('ex-h', 'Step length', .5, 2, .5, 1)],
   out=[('ex-ladd', 'line: each step adds', 'x'), ('ex-emul', 'exponential: each step multiplies by', 'v'), ('ex-six', 'at x = 6', '')])],
 [('Set a = 2 and b = 1.5. Where does the graph cross the y-axis, and what happens each time x goes up by 1?', show(['#ex-a', 2], ['#ex-b', 1.5]), 'It crosses at y = 2 = a. Each step right multiplies the height by 1.5, shown by the dashed arrows.'),
  ('Slide b below 1. What kind of change is it?', show(['#ex-a', 2], ['#ex-b', .5]), 'Decay: the graph falls toward the x-axis but never touches it. The x-axis is the horizontal asymptote, and the graph is still concave up.'),
  ('Set a = −2 with b = 1.5. What changes?', show(['#ex-a', -2], ['#ex-b', 1.5]), 'The whole graph flips under the x-axis: the range is now y < 0. Still an asymptote at y = 0, but decreasing and concave down.'),
  ('In the second lab set b = 1.5 and step length 1. Compare the line and the curve at x = 6.', show(['#ex-b2', 1.5], ['#ex-h', 1]), 'The line adds 1 each step (it reaches 8) while the curve multiplies by 1.5 (it reaches about 22.8). Same start, same first step, very different futures.'),
  ('Make b = 1.1 and look at x = 6. Is the exponential far ahead of the line yet?', show(['#ex-b2', 1.1], ['#ex-h', 1]), 'Not by much: about 3.54 against 3.2. But the exponential is above the line for every x > 1 and the gap keeps widening, so give it time and it leaves the line far behind.')],
 [{'h': 'Worked example: bacteria', 'fig': _bact_fig(),
   'prob': 'A colony starts with 800 bacteria and grows 15% each hour. Write a model for the number f(t) of bacteria after t hours, and estimate the number after 6 hours.',
   'steps': ['<b>Growth factor.</b> A 15% increase each hour multiplies the count by b = 1 + 0.15 = 1.15.',
    '<b>Model.</b> The initial value is 800, so <b>f(t) = 800(1.15)ᵗ</b>.',
    '<b>Check one step.</b> f(1) = 800(1.15) = 920, which is 15% more than 800 ✓.',
    '<b>Evaluate.</b> f(6) = 800(1.15)⁶ = 800(2.3131…) ≈ <b>1850 bacteria</b>.']},
  {'h': 'Worked example 2: a car loses value', 'fig': _car_fig(),
   'prob': 'A car costs $24,000 and loses 12% of its value each year. Model its value V(t) after t years and find the first whole year when it is worth less than $10,000.',
   'steps': ['<b>Decay factor.</b> Losing 12% leaves 88%, so b = 1 − 0.12 = 0.88.',
    '<b>Model.</b> <b>V(t) = 24000(0.88)ᵗ</b>.',
    '<b>Try years.</b> V(6) = 24000(0.4644) ≈ $11,146, still above 10,000. V(7) = 24000(0.4087) ≈ $9,808.',
    '<b>Answer.</b> The first whole year below $10,000 is <b>year 7</b>. (A logarithm will solve 24000(0.88)ᵗ = 10000 exactly: t ≈ 6.85.)']}],
 ['Writing b = 0.12 for a 12% decrease. The factor is 1 − 0.12 = 0.88.', 'Treating the exponential as if it adds a constant each step.', 'Thinking a decay graph crosses the x-axis. It approaches y = 0 but never reaches it.', 'Mixing up a (the starting value) with b (the factor).'],
 ('Exponential functions at a glance',
  ['Equal steps in x give equal ratios in y: f(x + h)/f(x) = bʰ for every x. This is why constant percent change is exponential, and why a table with a constant ratio between outputs, when the inputs go up by equal steps, signals an exponential model.']),
 [('f(x) = 5(0.8)ˣ is', ['decreasing, with horizontal asymptote y = 0', 'increasing, with asymptote y = 5', 'decreasing, crossing the x-axis', 'increasing, with asymptote y = 0'], 0, 'b = 0.8 < 1 is decay, and the asymptote is y = 0.'),
  ('A quantity grows 7% each year. The growth factor is', ['1.07', '0.07', '7', '0.93'], 0, 'b = 1 + 0.07.')],
 extra_after_labs=_ex_drill(), ced=('2.2', '2.3'))

# =====================================================================
# 2.4  Exponential function manipulation
# =====================================================================
def _shift_fig():
    S = lambda t: 3 * 2 ** (t + 2)
    P = Plot((-2.4, 3.4), (0, 108), (36, 12, 206, 170))
    base = P.axes([-2, -1, 1, 2, 3], [25, 50, 75, 100], 't', 'S', True)
    L = [(1, P.curve(S, -2.3, 3.2, 'f', 2.8, '', 120), 'S(t) = 3·2^(t + 2)', 'f'),
         (2, P.dot(0, 12, '(0, 12)', 'tan', 30, 2, 4.8) + P.dot(1, 24, '(1, 24)', 'tan', 30, 2, 4.8), 'S(0) = 3·4 = 12 and S(1) = 24: ×2', 'tan'),
         (3, P.curve(lambda t: 3 * 2 ** t, -2.3, 3.2, 'd', 2.2, '5 4', 120), 'the graph of 3·2ᵗ, 2 units to the right', 'd'),
         (4, P.text(-2.3, 62, '= 12·2ᵗ', 'f', 11, 'start'), 'shifting left 2 = stretching ×4', 'f')]
    return fig(base, L, 'A horizontal shift of an exponential is a vertical stretch.', 210)

def _half_fig():
    A = lambda t: 80 * .5 ** (t / 5)
    P = Plot((-1, 21), (0, 90), (36, 12, 206, 170))
    base = P.axes([5, 10, 15, 20], [20, 40, 60, 80], 't (days)', 'grams', True)
    L = [(1, ''.join(P.dot(t, A(t), str(int(A(t))), 'f', 0, -10, 4.2) for t in (0, 5, 10, 15, 20)) + P.curve(A, 0, 21, 'f', 2.2, '', 120), 'half the amount every 5 days: 80, 40, 20, 10, 5', 'f'),
         (2, '', 'A(t) = 80(½)^(t/5)', 'f'),
         (3, P.text(11, 78, '(½)^(t/5) = (2^(−1/5))ᵗ ≈ (0.8706)ᵗ', 'd', 10, 'start'), 'per day factor b ≈ 0.8706: loses 12.9% a day', 'd'),
         (4, P.dot(12, A(12), '15.16', 'tan', 6, -12, 5) + P.seg(12, 0, 12, A(12), 'tan', 1.2, '3 3'), 'A(12) = 80(½)^2.4 ≈ 15.16 g', 'tan')]
    return fig(base, L, 'A radioactive sample with a half-life of 5 days.', 210)

mod('expmanip', 'Exponent rules & rewriting',
 'The same exponential can be written many ways. Exponent rules show that shifting is stretching, and that changing the step length changes the base.',
 ['Exponent rules: <span class="m">bᵐ·bⁿ = bᵐ⁺ⁿ</span>, <span class="m">bᵐ/bⁿ = bᵐ⁻ⁿ</span>, <span class="m">(bᵐ)ⁿ = bᵐⁿ</span>, <span class="m">b⁻ⁿ = 1/bⁿ</span>, <span class="m">b⁰ = 1</span> and <span class="m">b^(1/n) = ⁿ√b</span>. Every rule just counts how many copies of b are being multiplied.',
  'A <b>horizontal shift</b> of an exponential is a <b>vertical stretch</b>: <span class="m">a·b^(x+k) = (a·bᵏ)·bˣ</span>. For example 3·2^(x+2) = 3·4·2ˣ = 12·2ˣ. So the graph of every exponential a·b^(x−h) can be written with no shift, just a different initial value. This is special to exponentials: a shifted parabola cannot be rewritten as a stretched one.',
  'Changing the length of a step changes the base: <span class="m">b^(x/k) = (b^(1/k))ˣ</span>. A quantity that doubles every 3 years is 2^(x/3) = (2^(1/3))ˣ ≈ (1.26)ˣ, about 26% growth <i>per year</i>. Half-life problems use base ½ with the half-life as the step: A(t) = A₀(½)^(t/T).'],
 ('you compared a line with an exponential and wrote a·bˣ', 'a way to rewrite and compare exponentials, and to convert doubling time or half-life into a yearly factor', 'exponentials come in different but equal forms', 'exponent rules, shifts as stretches, and conversions between doubling time, half-life and per-step factors'),
 [('bᵐ·bⁿ = bᵐ⁺ⁿ, (bᵐ)ⁿ = bᵐⁿ', ''), ('a·b^(x + k) = (a·bᵏ)·bˣ', 'shift = stretch'), ('b^(x/k) = (b^(1/k))ˣ', 'change of step'), ('b⁻ⁿ = 1/bⁿ, b^(1/n) = ⁿ√b', ''), ('A(t) = A₀(½)^(t/T)', 'half-life T')],
 [lab('em-lab', 'A shift is a stretch', canvas='em-canvas', aria='Two graphs: g(x) = a·b to the (x − h), and the unshifted function with a different initial value. They lie exactly on top of each other.',
   ctl=[('em-a', 'a', .5, 4, .5, 1.5), ('em-b', 'base b', 1.2, 3, .1, 2), ('em-h', 'shift h (right)', -3, 3, .5, -2)],
   out=[('em-g', 'shifted form', 'x'), ('em-f', 'unshifted form', 'v'), ('em-same', 'check at x = 0', '')]),
  lab('em-lab2', 'Doubling time to yearly factor', canvas='em-canvas2', aria='An exponential with a chosen doubling, tripling or halving time; dots one period apart show the multiplier and dots one unit apart show the per-unit factor.',
   seg=('em-kind', 'Every period the quantity', [('dbl', 'doubles'), ('trp', 'triples'), ('hlf', 'halves')]),
   ctl=[('em-T', 'Period length T', .5, 6, .5, 3)],
   out=[('em-form', 'A(t) =', 'x'), ('em-per', 'factor per unit', 'v'), ('em-pct', 'percent change per unit', '')])],
 [('Set a = 1.5, b = 2 and h = −2. Which unshifted form is the same graph?', show(['#em-a', 1.5], ['#em-b', 2], ['#em-h', -2]), 'a·b^(−h) = 1.5·4 = 6, so 6·2ˣ. The two graphs overlap completely.'),
  ('Change h to 2. Does the stretch factor grow or shrink?', show(['#em-h', 2]), 'It shrinks to 1.5/4 = 0.375: shifting right by 2 is the same as scaling down by 2² = 4.'),
  ('In the second lab choose <b>doubles</b> with T = 3. What is the yearly factor?', show(['click', '#em-kind [data-k=dbl]'], ['#em-T', 3]), '2^(1/3) ≈ 1.26: about 26% growth per unit. After 3 units the factor is 1.26³ = 2, as it should be.'),
  ('Choose <b>halves</b> with T = 5. What fraction is lost each unit?', show(['click', '#em-kind [data-k=hlf]'], ['#em-T', 5]), 'The per-unit factor is (½)^(1/5) ≈ 0.871, so about 12.9% is lost each unit.')],
 [{'h': 'Worked example: shift or stretch?', 'fig': _shift_fig(),
   'prob': 'A model for monthly sales (in thousands of items) is S(t) = 3·2^(t + 2), where t is the number of months after the product launch. Rewrite it in the form a·2ᵗ and say what S(0) means.',
   'steps': ['<b>Use the product rule.</b> 2^(t + 2) = 2ᵗ·2² = 4·2ᵗ.',
    '<b>Multiply by the 3.</b> S(t) = 3·4·2ᵗ = <b>12·2ᵗ</b>.',
    '<b>Check.</b> S(1) = 3·2³ = 24 and 12·2¹ = 24 ✓.',
    '<b>Meaning.</b> S(0) = <b>12 thousand items</b> in the launch month, and sales double every month. The shift of 2 months was hiding the initial value.']},
  {'h': 'Worked example 2: half-life', 'fig': _half_fig(),
   'prob': 'A sample of 80 grams of a radioactive isotope has a half-life of 5 days. Write A(t) for the grams left after t days, find the percent lost per day, and find the amount after 12 days.',
   'steps': ['<b>Model.</b> Half the amount remains after each 5 days, so <b>A(t) = 80(½)^(t/5)</b>.',
    '<b>Daily factor.</b> (½)^(t/5) = ((½)^(1/5))ᵗ = (0.8706…)ᵗ. The factor per day is about 0.8706, so about <b>12.9%</b> is lost each day.',
    '<b>After 12 days.</b> A(12) = 80(½)^(12/5) = 80(½)^2.4 = 80(0.1895…) ≈ <b>15.16 grams</b>.',
    '<b>Check.</b> 12 days is between 10 days (20 g) and 15 days (10 g), and 15.16 is between 10 and 20 ✓.']}],
 ['Writing 2^(x+2) = 2ˣ + 4. The exponents add when you multiply: 2^(x+2) = 2ˣ·2².', 'Using (bᵐ)ⁿ = bᵐ⁺ⁿ. It is bᵐⁿ.', 'Saying a doubling time of 3 years means 2/3 = 67% growth per year. It means 2^(1/3) ≈ 1.26.', 'Forgetting that b⁻ⁿ is a small positive number, not a negative number.'],
 ('Why shifts are stretches only for exponentials',
  ['f(x) = bˣ turns addition in the input into multiplication in the output: f(x + k) = f(x)·f(k). That is why a shift of the graph left by k just multiplies every height by bᵏ. No other family of functions does this, which is the algebraic reason exponentials are the model for constant percent change.']),
 [('3^(x + 1) equals', ['3·3ˣ', '3ˣ + 1', '3ˣ + 3', '9ˣ'], 0, '3^(x + 1) = 3ˣ·3¹.'),
  ('A quantity triples every 4 hours. Its hourly factor is', ['3^(1/4)', '3/4', '3⁴', '1/12'], 0, 'b^(4) = 3, so b = 3^(1/4) ≈ 1.316.')],
 ced=('2.4',))

# =====================================================================
# 2.5, 2.6  Exponential models & competing models
# =====================================================================
FOL = [(0, 100), (1, 130), (2, 169), (3, 220), (4, 286), (5, 371)]

def _pop_fig():
    b = (15500 / 12000) ** .1
    P = Plot((-1, 22), (0, 22000), (44, 12, 198, 170))
    base = P.axes([5, 10, 15, 20], [5000, 10000, 15000, 20000], 'years since 2010', 'people', True)
    L = [(1, P.dot(0, 12000, '12000', 'f', 22, 12, 4.6) + P.dot(10, 15500, '15500', 'f', 0, -12, 4.6), 'two data points: (0, 12000) and (10, 15500)', 'f'),
         (2, P.text(3, 4500, 'b¹⁰ = 15500/12000', 'tan', 10, 'start') + P.text(3, 2200, 'b ≈ 1.0259', 'tan', 11, 'start'), 'b = (15500/12000)^(1/10) ≈ 1.0259', 'tan'),
         (3, P.curve(lambda t: 12000 * b ** t, 0, 21, 'd', 2.6, '', 120), 'P(t) = 12000(1.0259)ᵗ', 'd'),
         (4, P.dot(20, 12000 * b ** 20, '20021', 'dd', -8, -12, 5) + P.seg(20, 0, 20, 12000 * b ** 20, 'dd', 1.2, '3 3'), 'prediction at t = 20 (2030): about 20,021', 'dd')]
    return fig(base, L, 'A town\'s population, fitted by an exponential through two points.', 210)

def _fol_fig():
    P = Plot((-.5, 8.5), (0, 900), (40, 12, 202, 170))
    base = P.axes([1, 2, 3, 4, 5, 6, 7, 8], [200, 400, 600, 800], 'week x', 'followers', True) + ''.join(P.dot(x, y, '', 'f', r=4) for x, y in FOL)
    ex = lambda x: 100 * 1.3 ** x
    L = [(1, ''.join(P.text(x + .5, 40, f'×{FOL[x + 1][1] / y:.2f}'.rstrip('0'), 'tan', 7) for x, (_, y) in enumerate(FOL[:-1])), 'ratios are all about 1.3', 'tan'),
         (2, P.seg(0, 100, 5, 371, 'd', 2, '6 4') + P.text(.3, 720, 'differences 30, 39, 51, 66, 85', 'd', 9, 'start'), 'differences keep growing: not linear', 'd'),
         (3, P.curve(ex, 0, 8.4, 'f', 2.6, '', 120), 'model f(x) = 100(1.3)ˣ', 'f'),
         (4, P.dot(8, ex(8), '816', 'dd', -4, -12, 5) + P.dot(8, 533.6, '534', 'd', 0, 16, 4.5), 'week 8: about 816, against about 534 for the line', 'dd')]
    return fig(base, L, 'Followers of a channel for the first 6 weeks.', 210)

mod('expmodel', 'Exponential models & data',
 'Build an exponential model from two points or a table, test it against competing models, and say where it should not be trusted.',
 ['To build an exponential model <span class="m">f(x) = a·bˣ</span> from two points (x₁, y₁) and (x₂, y₂): divide the outputs, <span class="m">y₂/y₁ = b^(x₂ − x₁)</span>, then take the root, <span class="m">b = (y₂/y₁)^(1/(x₂ − x₁))</span>, and find a from either point. In a table with equally spaced inputs, an exponential model has a constant <b>ratio</b> between consecutive outputs; a linear model has a constant <b>difference</b>.',
  'Real data are noisy, so a model never hits every point. A <b>residual</b> is data minus model. A good model has small residuals with no pattern. When two models both fit the data, compare their residuals, and think about the <b>context</b>: Can this quantity really grow without bound? What is a sensible domain? Models that agree inside the data can disagree wildly outside it, so extrapolation needs care.',
  'Competing models: for the same data you can build a linear, a quadratic and an exponential model. The best one has small, patternless residuals <i>and</i> makes sense in the situation. A quadratic eventually turns around; an exponential never does; a line grows at a fixed rate. Each of these behaviors may or may not fit what you know about the real thing.'],
 ('you chose a function type from differences and ratios', 'a way to fit, test and compare models with real data', 'real data are noisy and several models can look good', 'fitting a·bˣ from two points or regression, residuals, interpolation versus extrapolation, and choosing between competing models'),
 [('b = (y₂/y₁)^(1/(x₂ − x₁))', 'growth factor from two points'), ('a = y₁ / b^(x₁)', 'initial value'), ('residual = data − model', ''), ('constant ratio', 'exponential'), ('constant difference', 'linear')],
 [lab('xm-lab', 'Fit a·bˣ to data', canvas='xm-canvas', aria='A scatter plot of data with an exponential curve whose a and b can be changed; the residuals are drawn as orange segments from the curve to each point.',
   seg=('xm-data', 'Data', [('pop', 'Town population'), ('dep', 'Equipment value'), ('fol', 'Channel followers')]),
   pre='<div class="row"><button type="button" class="btn" id="xm-two">Through first and last points</button><button type="button" class="btn primary" id="xm-best">Best fit</button></div>',
   ctl=[('xm-a', 'a (initial value)', 5, 150, .5, 12), ('xm-b', 'b (factor per step)', .5, 1.6, .005, 1.03)],
   out=[('xm-eq', 'your model', 'x'), ('xm-rms', 'typical miss (RMS residual)', 'v'), ('xm-verdict', 'verdict', '')]),
  lab('xm-lab2', 'Competing models', canvas='xm-canvas2', aria='The same data fitted by a line, a quadratic and an exponential, extended past the data so you can compare their predictions.',
   seg=('xm-set', 'Data', [('grow', 'Followers'), ('arc', 'Ball height')]),
   ctl=[('xm-x', 'Predict at x', 0, 12, .5, 9)],
   out=[('xm-rmss', 'typical miss: line / quadratic / exponential', 'x'), ('xm-pred', 'predictions at x', 'v'), ('xm-pick', 'which one?', '')])],
 [('Choose <b>Town population</b> and press <b>Through first and last points</b>. Does the curve pass through the middle points too?', show(['click', '#xm-data [data-k=pop]'], ['click', '#xm-two']), 'Very close: the residuals are small and have no pattern, so the exponential is a good model for this town.'),
  ('Choose <b>Equipment value</b> and try b above 1. What happens to the residuals?', show(['click', '#xm-data [data-k=dep]'], ['#xm-b', 1.05]), 'They are huge: the data decrease, so the factor must be below 1 (decay).'),
  ('Press <b>Best fit</b> for the followers data. How close is the typical miss compared with the size of the data?', show(['click', '#xm-data [data-k=fol]'], ['click', '#xm-best']), 'Tiny: well under 1 follower against values from 100 to 371. The ratios are almost constant, so the exponential fits.'),
  ('In the second lab with <b>Followers</b>, compare the three predictions at x = 9.', show(['click', '#xm-set [data-k=grow]'], ['#xm-x', 9]), 'The line, quadratic and exponential agree inside the data but disagree sharply at x = 9. Which would you trust? That depends on the context.'),
  ('Switch to <b>Ball height</b>. Which model has the smallest miss, and does the exponential make sense?', show(['click', '#xm-set [data-k=arc]'], ['#xm-x', 9]), 'The quadratic. An exponential cannot turn around, and a ball must come back down, so context rules it out as well.')],
 [{'h': 'Worked example: a model from two points', 'fig': _pop_fig(),
   'prob': 'A town had 12,000 people in 2010 and 15,500 in 2020. Build an exponential model P(t) for t years since 2010 and predict the population in 2030.',
   'steps': ['<b>Initial value.</b> P(0) = 12000, so a = 12000.',
    '<b>Growth factor.</b> 12000·b¹⁰ = 15500, so b¹⁰ = 15500/12000 = 1.2917 and b = 1.2917^(1/10) ≈ <b>1.0259</b>: about 2.6% growth per year.',
    '<b>Model.</b> <b>P(t) = 12000(1.0259)ᵗ</b>.',
    '<b>Predict.</b> 2030 is t = 20: P(20) = 12000(1.2917)² ≈ <b>20,021 people</b>. This assumes the same growth rate for 10 more years (extrapolation).']},
  {'h': 'Worked example 2: competing models', 'fig': _fol_fig(), 'table': ([['week x', '0', '1', '2', '3', '4', '5'], ['followers', '100', '130', '169', '220', '286', '371']], 'Followers of a channel'),
   'prob': 'Decide whether a linear or an exponential model fits this table better, build it, and predict the followers in week 8.',
   'steps': ['<b>Ratios.</b> 130/100 = 1.30, 169/130 = 1.30, 220/169 ≈ 1.30, 286/220 = 1.30, 371/286 ≈ 1.30: almost constant.',
    '<b>Differences.</b> 30, 39, 51, 66, 85 keep growing, so a line does not fit.',
    '<b>Model.</b> a = 100 and b = 1.3: <b>f(x) = 100(1.3)ˣ</b>. Check: f(5) = 371.3 ✓.',
    '<b>Predict.</b> f(8) = 100(1.3)⁸ ≈ <b>816 followers</b>. A line through the end points would predict only about 534. Because the real channel cannot grow forever, treat 816 as a short-range estimate.']}],
 ['Taking a ratio of inputs instead of outputs.', 'Using a line because it fits the data decently without checking the pattern of residuals.', 'Extrapolating far beyond the data as if the model is certain.', 'Rounding b too early: small changes in b become big changes in far predictions.'],
 ('Interpolation versus extrapolation',
  ['Predicting between data points (interpolation) is usually safe when the model fits well. Predicting outside the data (extrapolation) depends on the assumption that the pattern continues. Exponential models are especially fragile: a tiny error in b multiplies over many steps.']),
 [('A table with equal x-steps has outputs 4, 12, 36, 108. A good model is', ['exponential, b = 3', 'linear, slope 8', 'quadratic', 'exponential, b = 8'], 0, 'Each output is 3 times the one before.'),
  ('A data point is 52 and the model says 48. The residual is', ['4', '−4', '52', '1.08'], 0, 'residual = data − model = 52 − 48.')],
 ced=('2.5', '2.6'))

# =====================================================================
# 2.7  Composition of functions
# =====================================================================
def _ripple_fig():
    P = Plot((0, 6.5), (0, 460), (40, 12, 202, 170))
    A = lambda t: 4 * math.pi * t * t
    base = P.axes([1, 2, 3, 4, 5, 6], [100, 200, 300, 400], 't (s)', 'area (cm²)', True)
    chain = txt(130, 24, 't  →  r = 2t  →  A = πr²', 'ink', 11)
    L = [(1, P.text(.5, 330, 'r(t) = 2t  (cm)', 'd', 11, 'start'), 'inner function: radius r(t) = 2t', 'd'),
         (2, P.text(.5, 375, 'A(r) = πr²', 'dd', 11, 'start'), 'outer function: area A(r) = πr²', 'dd'),
         (3, P.curve(A, 0, 6.3, 'f', 2.6, '', 120), 'A(r(t)) = π(2t)² = 4πt²', 'f'),
         (4, P.dot(3, A(3), '113.1', 'tan', -22, -4, 5) + P.seg(3, 0, 3, A(3), 'tan', 1.2, '3 3'), 'at t = 3: 36π ≈ 113.1 cm²', 'tan')]
    return fig(base, L, 'A circular ripple whose radius grows 2 cm each second.', 210)

def _coupon_fig():
    f1 = lambda p: .8 * (p - 10)
    f2 = lambda p: .8 * p - 10
    P = Plot((50, 70), (28, 50), (40, 12, 202, 170))
    base = P.axes([55, 60, 65], [30, 35, 40, 45], 'sticker price p ($)', 'you pay ($)', True)
    L = [(1, P.seg(50, f1(50), 70, f1(70), 'f', 2.8) + P.text(51, 44, '0.8(p − 10)', 'f', 10, 'start'), 'f(g(p)): take $10 off, then 20% off', 'f'),
         (2, P.seg(50, f2(50), 70, f2(70), 'd', 2.8) + P.text(63.5, 33.2, '0.8p − 10', 'd', 10, 'start'), 'g(f(p)): take 20% off, then $10 off', 'd'),
         (3, P.dot(60, 40, '40', 'f', -12, -4, 4.8) + P.dot(60, 38, '38', 'd', 12, 12, 4.8), 'at p = 60: pay $40 one way, $38 the other', 'tan'),
         (4, P.seg(60, 38, 60, 40, 'tan', 3), 'order matters: f∘g ≠ g∘f', 'tan')]
    return fig(base, L, 'A $10 coupon and a 20%-off sale in different orders (zoomed in near $60).', 210)

mod('compose', 'Composition of functions',
 'Feed the output of one function into another. The order matters, and the domain of the composite can be smaller than either piece.',
 ['The <b>composition</b> <span class="m">(f∘g)(x) = f(g(x))</span> means: apply g first, then f to the result. g is the <b>inner</b> function and f the <b>outer</b> one. Many real chains are compositions: time → radius of a ripple → area of the circle; sticker price → after coupon → after a discount.',
  'Order matters: usually f(g(x)) ≠ g(f(x)). Try f(x) = 2x and g(x) = x + 3: f(g(x)) = 2x + 6 but g(f(x)) = 2x + 3. The <b>domain</b> of f∘g is the set of x in the domain of g for which g(x) lies in the domain of f. For f(x) = √x and g(x) = x − 3 that means x ≥ 3.',
  'You can evaluate a composition from <b>formulas</b>, <b>graphs</b> or <b>tables</b>: go inside first, then read the outer function at that value. And you can <b>decompose</b> a formula: h(x) = (3x + 1)² is f(g(x)) with g(x) = 3x + 1 and f(x) = x². Composition is how inverse functions and many transformations are defined, so Unit 2 uses it constantly.'],
 ('you evaluated one function at a time', 'a way to chain functions and to see a complicated formula as simple pieces', 'the output of one function can be the input of the next', 'composites evaluated from formulas, graphs and tables, domains of composites, order of composition, and decomposing a function'),
 [('(f∘g)(x) = f(g(x))', 'inner g first'), ('f(g(x)) ≠ g(f(x))', 'usually'), ('dom(f∘g)', 'x in dom g with g(x) in dom f'), ('h(x) = (3x + 1)²', 'g = 3x + 1, f = x²')],
 [lab('cp-lab', 'Compose two functions', canvas='cp-canvas', aria='The graphs of f, g and the composite; a moving x marks how x goes through the inner function and then the outer one.',
   seg=('cp-g', 'Inner g', [('lin', 'g(x) = 2x + 1'), ('sq', 'g(x) = x²'), ('sh', 'g(x) = x − 3')]),
   pre='<div class="seg" id="cp-f" role="group" aria-label="Outer f"><button type="button" data-k="rt" aria-pressed="true">f(x) = √x</button><button type="button" data-k="inv" aria-pressed="false">f(x) = 1/x</button><button type="button" data-k="tri" aria-pressed="false">f(x) = 3x − 2</button></div><div class="seg" id="cp-ord" role="group" aria-label="Order"><button type="button" data-k="fg" aria-pressed="true">f(g(x))</button><button type="button" data-k="gf" aria-pressed="false">g(f(x))</button></div>',
   ctl=[('cp-x', 'x', -4, 4, .1, 2)],
   out=[('cp-step', 'inside, then outside', 'x'), ('cp-dom', 'domain of this composite', 'v'), ('cp-both', 'f(g(x)) and g(f(x))', '')]),
  lab('cp-lab2', 'Composition from tables', canvas='cp-canvas2', aria='Two tables drawn as arrows: x goes to g(x) and then to f(g(x)). If the output of the first table is missing from the second, the chain stops.',
   ctl=[('cp-t', 'Start at x', 1, 5, 1, 2)],
   out=[('cp-gx', 'g(x)', 'x'), ('cp-fgx', 'f(g(x))', 'v'), ('cp-gfx', 'g(f(x))', '')])],
 [('Choose g(x) = x − 3 and f(x) = √x. For which x does f(g(x)) exist?', show(['click', '#cp-g [data-k=sh]'], ['click', '#cp-f [data-k=rt]'], ['click', '#cp-ord [data-k=fg]'], ['#cp-x', 5]), 'Only for x ≥ 3: the inner output x − 3 has to be at least 0 before the square root can act on it. Slide x below 3 and the composite disappears.'),
  ('Keep f = √x but switch g to x². What is the domain now?', show(['click', '#cp-g [data-k=sq]'], ['click', '#cp-f [data-k=rt]'], ['click', '#cp-ord [data-k=fg]']), 'All real numbers: x² is never negative, so √(x²) is always defined. (It equals |x|.)'),
  ('With g(x) = 2x + 1 and f(x) = 3x − 2 compare the two orders at x = 2.', show(['click', '#cp-g [data-k=lin]'], ['click', '#cp-f [data-k=tri]'], ['#cp-x', 2]), 'f(g(2)) = f(5) = 13 but g(f(2)) = g(4) = 9. The order changes the answer.'),
  ('In the second lab set x = 2. What is f(g(2)), and why can g(f(2)) not be found?', show(['#cp-t', 2]), 'g(2) = 1 and f(1) = 6, so f(g(2)) = 6. But f(2) = −1 is not in g\'s table, so g(f(2)) cannot be read.')],
 [{'h': 'Worked example: a growing ripple', 'fig': _ripple_fig(),
   'prob': 'A circular ripple spreads so that its radius after t seconds is r(t) = 2t centimeters. The area of a circle of radius r is A(r) = πr². Write the area as a function of t and find the area after 3 seconds.',
   'steps': ['<b>Inner and outer.</b> t goes into r first (inner), and the radius goes into A (outer): the area is A(r(t)).',
    '<b>Substitute.</b> A(r(t)) = π(2t)² = π·4t² = <b>4πt²</b>.',
    '<b>Evaluate.</b> At t = 3: 4π(9) = 36π ≈ <b>113.1 cm²</b>.',
    '<b>Check by steps.</b> r(3) = 6 cm, then A(6) = π(36) = 36π ✓.']},
  {'h': 'Worked example 2: coupon, then sale', 'fig': _coupon_fig(),
   'prob': 'A store takes 20% off every item: f(p) = 0.8p, and also accepts a $10 coupon: g(p) = p − 10. Find f(g(p)) and g(f(p)), and compare them for an item priced at $60.',
   'steps': ['<b>Coupon first.</b> f(g(p)) = 0.8(p − 10) = <b>0.8p − 8</b>.',
    '<b>Sale first.</b> g(f(p)) = 0.8p − 10.',
    '<b>At p = 60.</b> f(g(60)) = 0.8(50) = <b>$40</b>; g(f(60)) = 48 − 10 = <b>$38</b>.',
    '<b>Conclusion.</b> The two orders differ, so composition is not commutative. Here sale-first is $2 cheaper: the $10 coupon is worth a full $10 at the end, but taken first it is shrunk by the 20% to only $8.']}],
 ['Applying the functions in the wrong order: f(g(x)) means g first.', 'Multiplying instead of composing: f(g(x)) is not f(x)·g(x).', 'Forgetting that the domain of the composite is limited by the inner function and by what the outer function accepts.', 'Assuming f(g(x)) = g(f(x)).'],
 ('Composition is not multiplication',
  ['f(x)·g(x) multiplies outputs of two functions at the same x. f(g(x)) feeds the output of g into f. For f(x) = x² and g(x) = x + 1, the product is x²(x + 1) but the composite is (x + 1)². Every time you substitute an expression for x, you are composing.']),
 [('f(x) = x² and g(x) = x + 4. Then f(g(2)) is', ['36', '10', '8', '20'], 0, 'g(2) = 6, then f(6) = 36.'),
  ('The domain of √(x − 5) as a composite is', ['x ≥ 5', 'x ≤ 5', 'all real numbers', 'x ≠ 5'], 0, 'The inside, x − 5, must be at least 0.')],
 ced=('2.7',))
