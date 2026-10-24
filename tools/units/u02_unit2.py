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

# =====================================================================
# 2.8  Inverse functions
# =====================================================================
def _temp_fig():
    F = lambda c: 1.8 * c + 32
    Ci = lambda f: (f - 32) / 1.8
    P = Plot((-20, 110), (-20, 110), (36, 12, 206, 170))
    base = P.axes([0, 50, 100], [0, 50, 100], '', '', True) + P.seg(-20, -20, 110, 110, 'area', 1.4, '5 4') + P.text(100, 104, 'y = x', 'area', 10, 'end')
    L = [(1, P.seg(-20, F(-20), 55, F(55), 'f', 2.6) + P.dot(37, 98.6, '(37, 98.6)', 'f', -4, -10, 4.5), 'f converts °C to °F: f(37) = 98.6', 'f'),
         (2, P.seg(-4, -20, 110, Ci(110), 'd', 2.6) + P.dot(98.6, 37, '(98.6, 37)', 'd', 0, 16, 4.5), 'the inverse undoes it: C = (F − 32)/1.8', 'd'),
         (3, P.seg(37, 98.6, 98.6, 37, 'tan', 1.4, '3 3'), 'the points (37, 98.6) and (98.6, 37) mirror across y = x', 'tan'),
         (4, '', 'check: (98.6 − 32)/1.8 = 66.6/1.8 = 37 ✓', 'ink')]
    return fig(base, L, 'The graph of an inverse is the reflection over y = x.', 210)

def _circ_fig():
    P = Plot((0, 9), (0, 9), (36, 12, 206, 170))
    A = lambda r: math.pi * r * r
    base = P.axes([2, 4, 6, 8], [2, 4, 6, 8], '', '', True)
    P2 = Plot((0, 9), (0, 260), (36, 12, 206, 170))
    base = P2.axes([2, 4, 6, 8], [50, 100, 150, 200, 250], 'r (cm)', 'A (cm²)', True)
    L = [(1, P2.curve(A, 0, 9, 'f', 2.6, '', 120), 'A(r) = πr² for r ≥ 0', 'f'),
         (2, P2.seg(0, 50, 3.989, 50, 'tan', 1.5, '4 3') + P2.seg(3.989, 50, 3.989, 0, 'tan', 1.5, '4 3') + P2.dot(3.989, 50, '3.99', 'tan', 0, -14, 4.8), 'to get area 50, read across then down', 'tan'),
         (3, P2.text(5.4, 60, 'r = √(A/π)', 'd', 11, 'start'), 'inverse: r(A) = √(A/π) (positive root only)', 'd'),
         (4, '', 'r(50) = √(50/π) ≈ √15.915 ≈ 3.99 cm', 'tan')]
    return fig(base, L, 'Why we keep only r ≥ 0: negative radii make no sense, and that restriction makes A one-to-one.', 210)

def _inv_drill():
    cases = []
    cs = [(lambda x: x ** 3, 'x³', True), (lambda x: x * x, 'x²', False), (lambda x: 2 ** x, '2ˣ', True), (lambda x: abs(x), '|x|', False), (lambda x: x ** 3 - 3 * x, 'x³ − 3x', False), (lambda x: .5 * x + 1, '0.5x + 1', True)]
    for f, nm, ok in cs:
        P = Plot((-3, 3), (-4, 8) if nm == '2ˣ' else (-4, 4) if nm != 'x²' and nm != '|x|' else (-1, 6), (14, 10, 232, 140))
        b = P.axes([-2, -1, 1, 2], [], 'x', '') + P.curve(f, -2.99 if nm != '2ˣ' else -3, 2.99 if nm not in ('2ˣ', 'x³') else 2.2, 'f', 2.6, '', 240)
        yv = {'x³': 1.5, 'x²': 3, '2ˣ': 3, '|x|': 2, 'x³ − 3x': 1, '0.5x + 1': 2}[nm]
        xs = [x / 1000 for x in range(-3000, 3000) if abs(f(x / 1000) - yv) < .003]
        pts = []
        for x in xs:
            if not pts or abs(x - pts[-1]) > .05: pts.append(x)
        a = b + P.seg(-3, yv, 3, yv, 'tan', 1.6, '5 4') + ''.join(P.dot(x, yv, '', 'tan', r=4.5) for x in pts)
        why = ('Every horizontal line crosses the graph at most once: each output comes from exactly one input, so f has an inverse.' if ok else f'The horizontal line y = {yv} crosses the graph {len(pts)} times: two inputs give the same output, so f has no inverse on this whole domain.')
        cases.append((f'f(x) = {nm}. Does f have an inverse function? Imagine a horizontal line sweeping up the graph.', svg(b, 160, f'The graph of {nm}'), svg(a, 160, f'The graph of {nm} with a horizontal line'), ['yes, it is one-to-one', 'no, a horizontal line hits it twice'], 0 if ok else 1, why))
    return drill('Horizontal line test', 'A function has an inverse exactly when every horizontal line meets its graph at most once.', cases, 'iv-drill')

mod('inverse', 'Inverse functions',
 'An inverse function undoes the original: inputs and outputs trade places, and the graph flips over the line y = x.',
 ['If f takes a to b, its <b>inverse</b> f⁻¹ takes b back to a. This only works if each output comes from exactly one input: f must be <b>one-to-one</b>. On a graph, that is the <b>horizontal line test</b>: no horizontal line meets the graph twice. The inverse swaps domain and range: the domain of f⁻¹ is the range of f, and the range of f⁻¹ is the domain of f. Note that f⁻¹(x) means the inverse, not 1/f(x).',
  'The two functions undo each other: <span class="m">f(f⁻¹(x)) = x</span> and <span class="m">f⁻¹(f(x)) = x</span>. Geometrically, if (a, b) is on the graph of f then (b, a) is on the graph of f⁻¹, so the two graphs are mirror images across the line <span class="m">y = x</span>.',
  'To find a formula: write y = f(x), <b>swap x and y</b>, and solve for y. For f(x) = 2x + 1: x = 2y + 1 gives y = (x − 1)/2. A function like x² is not one-to-one, but if you <b>restrict the domain</b> to x ≥ 0 it becomes one-to-one, and its inverse is √x. The choice of restriction decides which inverse you get.'],
 ('you evaluated functions and composed them', 'a way to undo a function and to solve for an input', 'a function can be reversed when it never repeats an output', 'one-to-one functions, inverse formulas, domain restrictions, and reading inverses from tables and graphs'),
 [('f(f⁻¹(x)) = x', 'and f⁻¹(f(x)) = x'), ('(a, b) on f ⇒ (b, a) on f⁻¹', 'reflection over y = x'), ('dom f⁻¹ = range f', 'range f⁻¹ = dom f'), ('y = f(x): swap x and y, solve', 'finding the inverse')],
 [lab('iv-lab', 'Reflect over y = x', canvas='iv-canvas', aria='A function and its inverse drawn as mirror images over the dashed line y = x, with a moving point and its mirror image.',
   seg=('iv-fn', 'Function', [('lin', '2x + 1'), ('cub', 'x³ + 1'), ('sqr', 'x² for x ≥ 0'), ('exp', '2ˣ')]),
   ctl=[('iv-a', 'Point on f: x =', -3, 3, .1, 1)],
   out=[('iv-pt', 'point on f  →  point on f⁻¹', 'x'), ('iv-inv', 'inverse', 'v'), ('iv-dr', 'domain and range of f (f⁻¹ swaps them)', '')]),
  lab('iv-lab2', 'Undo it', canvas='iv-canvas2', aria='A number is sent through f and then through its inverse; each step is shown with an arrow so that the original input returns.',
   seg=('iv-fn2', 'Function', [('lin', 'f(x) = 3x − 4'), ('cub', 'f(x) = x³ + 2'), ('rec', 'f(x) = 12/x')]),
   ctl=[('iv-x', 'Input x', 1, 6, 1, 3)],
   out=[('iv-fx', 'f(x)', 'x'), ('iv-back', 'f⁻¹ of that', 'v'), ('iv-form', 'f⁻¹(x) =', '')])],
 [('Choose <b>2x + 1</b>. Move the point on f. Where does its mirror image lie?', show(['click', '#iv-fn [data-k=lin]'], ['#iv-a', 1]), 'On the green graph, with the coordinates swapped: (1, 3) on f becomes (3, 1) on f⁻¹. They are mirror images over the dashed line.'),
  ('Choose <b>x² for x ≥ 0</b>. What is the inverse?', show(['click', '#iv-fn [data-k=sqr]'], ['#iv-a', 2]), 'The square root: (2, 4) becomes (4, 2). The restriction x ≥ 0 is what makes an inverse possible.'),
  ('Choose <b>2ˣ</b>. The inverse climbs very slowly. Why?', show(['click', '#iv-fn [data-k=exp]'], ['#iv-a', 2]), 'Because 2ˣ climbs very fast: reflecting a steep graph gives a flat one. This inverse is a logarithm, coming in the next module.'),
  ('In the second lab choose <b>12/x</b> and any input. What do you notice?', show(['click', '#iv-fn2 [data-k=rec]'], ['#iv-x', 3]), 'f(3) = 4 and f⁻¹(4) = 3, and f⁻¹(x) = 12/x too. This function is its own inverse: its graph is symmetric about y = x.')],
 [{'h': 'Worked example: temperature conversion', 'fig': _temp_fig(),
   'prob': 'A thermometer converts Celsius to Fahrenheit with F = 1.8C + 32. Find the inverse formula and convert a body temperature of 98.6°F to Celsius.',
   'steps': ['<b>Write y = f(x).</b> F = 1.8C + 32, with C as the input.',
    '<b>Swap and solve.</b> Solve for C: F − 32 = 1.8C, so <b>C = (F − 32)/1.8</b>. This is the inverse: it takes Fahrenheit in and gives Celsius out.',
    '<b>Evaluate.</b> C = (98.6 − 32)/1.8 = 66.6/1.8 = <b>37°C</b>.',
    '<b>Check.</b> f(37) = 1.8(37) + 32 = 66.6 + 32 = 98.6 ✓. The inverse undid f.']},
  {'h': 'Worked example 2: radius from area', 'fig': _circ_fig(),
   'prob': 'The area of a circle is A(r) = πr² for r ≥ 0. Find the inverse and the radius of a circle with area 50 cm².',
   'steps': ['<b>One-to-one?</b> On all real numbers π r² is not (r and −r give the same area), but radius cannot be negative: on r ≥ 0 it is one-to-one.',
    '<b>Solve.</b> A = πr² gives r² = A/π, so <b>r = √(A/π)</b> (positive root only).',
    '<b>Evaluate.</b> r(50) = √(50/π) = √15.915… ≈ <b>3.99 cm</b>.',
    '<b>Check.</b> π(3.99)² = π(15.92) ≈ 50 ✓.']}],
 ['Reading f⁻¹(x) as 1/f(x).', 'Swapping x and y but forgetting to solve for y.', 'Using an inverse on a function that is not one-to-one without restricting the domain.', 'Reflecting over the x-axis or y-axis instead of the line y = x.'],
 ('Inverse as a way to solve equations',
  ['Solving f(x) = k means finding the input that gives output k, which is f⁻¹(k). Every time you "undo" an operation to solve an equation, you apply an inverse function: subtract to undo adding, divide to undo multiplying, take the square root to undo squaring (on the right branch).']),
 [('f(3) = 7 and f has an inverse. Then f⁻¹(7) is', ['3', '7', '1/7', '−3'], 0, 'The inverse sends the output back to the input.'),
  ('f(x) = 4x − 8. Then f⁻¹(x) =', ['(x + 8)/4', '(x − 8)/4', '4x + 8', '1/(4x − 8)'], 0, 'x = 4y − 8 gives y = (x + 8)/4.')],
 extra_after_labs=_inv_drill(), ced=('2.8',))

# =====================================================================
# 2.9, 2.10, 2.11  Logarithms and log functions
# =====================================================================
def _log_fig():
    P = Plot((0, 34), (-3, 6.5), (34, 12, 208, 170))
    base = P.axes([8, 16, 24, 32], [-2, 2, 4], 'x', 'y', True)
    L = [(1, safe_curve(P, lambda x: math.log2(x), .15, 34, 'f', 2.6, '', 300, lim=6.5) + ''.join(P.dot(x, math.log2(x), '', 'f', r=3.8) for x in (1, 2, 4, 8, 16, 32)), 'y = log₂ x: the exponent on 2 that gives x', 'f'),
         (2, P.dot(32, 5, 'log₂ 32 = 5', 'tan', -22, -10, 4.8) + P.seg(32, 0, 32, 5, 'tan', 1.2, '3 3'), '2⁵ = 32, so log₂ 32 = 5', 'tan'),
         (3, P.dot(1, 0, '', 'd', r=4.5) + P.dot(.25, -2, '', 'd', r=4.5) + P.text(5.5, -1.4, 'log₂ ¼ = −2', 'd', 10, 'start'), '2⁻² = ¼, so log₂ ¼ = −2', 'd'),
         (4, P.dot(2, 1, '', 'dd', r=4.5) + P.text(9, .5, 'log₄ 8 = 3/2', 'dd', 10, 'start'), '4^(3/2) = 8, so log₄ 8 = 3/2', 'dd')]
    return fig(base, L, 'The logarithm is the exponent: log₂ x answers "2 to what power gives x?"', 210)

def _ph_fig():
    X = lambda ph: 24 + (ph - 2) * 34
    base = ln(X(2) - 8, 100, X(8) + 8, 100, 'mut', 2) + ''.join(ln(X(p), 94, X(p), 106, 'mut', 1.6) + txt(X(p), 122, str(p), 'ink', 11) + txt(X(p), 138, '10⁻' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[p], 'mut', 9) for p in range(2, 9)) + txt(130, 160, 'pH  (and [H⁺] in mol/L)', 'mut', 10)
    L = [(1, txt(130, 28, 'pH = −log₁₀[H⁺]', 'f', 13), 'the pH is minus the exponent on 10', 'f'),
         (2, ln(X(5), 100, X(5), 84, 'tan', 1.6, '3 3') + ln(X(4), 100, X(4), 84, 'tan', 1.6, '3 3') + txt(X(5), 78, '10⁻⁵', 'tan', 10) + txt(X(4), 78, '10⁻⁴', 'tan', 10), '3.2 × 10⁻⁵ lies between 10⁻⁵ and 10⁻⁴', 'tan'),
         (3, circ(X(4.49485), 100, 6, 'dd', 1, 'surf', 2) + txt(X(4.49485), 56, '4.49', 'dd', 13), 'pH = 5 − log₁₀ 3.2 ≈ 5 − 0.505 = 4.49', 'dd'),
         (4, '', 'between pH 4 and 5, closer to 4.5: slightly acidic', 'ink')]
    return fig(base, L, 'Each pH step is a factor of 10 in hydrogen-ion concentration.', 170)

mod('logfn', 'Logarithms & log functions',
 'A logarithm is an exponent. The log graph is the exponential graph turned on its side, with a vertical asymptote instead of a horizontal one.',
 ['The <b>logarithm</b> <span class="m">log_b(x) = y</span> means <span class="m">bʸ = x</span>: it is the <b>exponent</b> you put on b to get x. So log₂ 8 = 3 because 2³ = 8, log₁₀ 0.001 = −3, and log₄ 8 = 3/2 because 4^(3/2) = 8. Because the logarithm undoes the exponential, <span class="m">log_b(bˣ) = x</span> and <span class="m">b^(log_b x) = x</span>. The base 10 logarithm is written <b>log</b>, and the base <b>e</b> ≈ 2.718 logarithm is the <b>natural logarithm ln</b>.',
  'The function <span class="m">f(x) = log_b(x)</span> is the inverse of <span class="m">bˣ</span>, so its graph is the reflection of y = bˣ over y = x. It has domain x > 0 (you cannot raise a positive base to any power to get 0 or a negative number), range all real numbers, a <b>vertical asymptote x = 0</b>, and passes through (1, 0) and (b, 1). For b > 1 it is increasing and concave down; for 0 < b < 1 it is decreasing.',
  'Transformations work as before: <span class="m">g(x) = log_b(x − h) + k</span> has vertical asymptote x = h, domain x > h, and its x-intercept moves to x = h + b^(−k). Logarithms also compress huge ranges into small numbers, which is why pH, earthquake magnitude and decibels use them.'],
 ('you wrote exponential functions and found their inverse graphs by reflection', 'a name and a formula for the inverse of bˣ', 'we need to ask "what exponent gives this number?"', 'logarithms as exponents, the log graph and its asymptote, domain and range, and transformations of log functions'),
 [('log_b(x) = y ⇔ bʸ = x', ''), ('log_b(bˣ) = x, b^(log_b x) = x', 'inverse'), ('log_b(1) = 0, log_b(b) = 1', ''), ('domain x > 0, asymptote x = 0', ''), ('log_b(x − h) + k', 'asymptote x = h')],
 [lab('lg-lab', 'The exponent that gives x', canvas='lg-canvas', aria='The graph of y = b to the t. A horizontal line at height x meets the curve; dropping down from the meeting point reads off the logarithm.',
   seg=('lg-b', 'Base', [('b2', '2'), ('b3', '3'), ('b10', '10'), ('be', 'e')]),
   ctl=[('lg-x', 'Number x', .1, 30, .1, 8)],
   out=[('lg-eq', 'logarithm', 'x'), ('lg-why', 'because', 'v'), ('lg-int', 'between two whole numbers', '')]),
  lab('lg-lab2', 'The log graph and its shifts', canvas='lg-canvas2', aria='The graph of g(x) = log base b of (x − h), plus k, with its vertical asymptote at x = h and its x-intercept marked.',
   seg=('lg-b2', 'Base', [('b2', '2'), ('b10', '10'), ('bh', '1/2')]),
   ctl=[('lg-h', 'Shift right h', -3, 4, .5, 0), ('lg-k', 'Shift up k', -3, 3, .5, 0)],
   out=[('lg-form', 'g(x) =', 'x'), ('lg-dom', 'domain and asymptote', 'v'), ('lg-int2', 'x-intercept', '')])],
 [('Choose base 2 and set x = 8. What is log₂ 8, and what is the reading on the t-axis?', show(['click', '#lg-b [data-k=b2]'], ['#lg-x', 8]), '3, because 2³ = 8. The orange point sits at t = 3 on the t-axis.'),
  ('Slide x to 1. What is the logarithm of 1 for any base?', show(['click', '#lg-b [data-k=b2]'], ['#lg-x', 1]), '0: b⁰ = 1 in every base, so the log graph always passes through (1, 0).'),
  ('Slide x below 1, to 0.25. What happens to the logarithm?', show(['click', '#lg-b [data-k=b2]'], ['#lg-x', .25]), 'It becomes negative: log₂ 0.25 = −2 since 2⁻² = 0.25. Numbers between 0 and 1 have negative logs.'),
  ('In the second lab set h = 2 and k = 1. Where is the asymptote and the x-intercept?', show(['click', '#lg-b2 [data-k=b2]'], ['#lg-h', 2], ['#lg-k', 1]), 'The asymptote is x = 2 and the domain is x > 2. The intercept solves log₂(x − 2) = −1: x = 2 + 2⁻¹ = 2.5.'),
  ('Choose base 1/2. Is the graph increasing or decreasing?', show(['click', '#lg-b2 [data-k=bh]'], ['#lg-h', 0], ['#lg-k', 0]), 'Decreasing: for bases between 0 and 1, the exponential decays, so its inverse falls.')],
 [{'h': 'Worked example: evaluate by asking "what exponent?"', 'fig': _log_fig(),
   'prob': 'Evaluate log₂ 32, log₂ (1/4) and log₄ 8 without a calculator.',
   'steps': ['<b>log₂ 32.</b> 2⁵ = 32, so log₂ 32 = <b>5</b>.',
    '<b>log₂ (1/4).</b> 2⁻² = 1/4, so log₂ (1/4) = <b>−2</b>. Numbers between 0 and 1 have negative logs.',
    '<b>log₄ 8.</b> Write both as powers of 2: 4 = 2² and 8 = 2³, so 4^(3/2) = 2³ = 8 and log₄ 8 = <b>3/2</b>.',
    '<b>Check on the graph.</b> The point (32, 5) lies on y = log₂ x, and so do (1/4, −2) and (2, 1).']},
  {'h': 'Worked example 2: the pH scale', 'fig': _ph_fig(),
   'prob': 'The pH of a solution is pH = −log₁₀[H⁺], where [H⁺] is the hydrogen-ion concentration in mol/L. Find the pH when [H⁺] = 3.2 × 10⁻⁵, and say how much more concentrated [H⁺] is at pH 4 than at pH 5.',
   'steps': ['<b>Substitute.</b> pH = −log₁₀(3.2 × 10⁻⁵).',
    '<b>Estimate.</b> 3.2 × 10⁻⁵ is between 10⁻⁵ and 10⁻⁴, so log₁₀ of it is between −5 and −4, and the pH is between 4 and 5.',
    '<b>Evaluate.</b> log₁₀(3.2 × 10⁻⁵) = log₁₀ 3.2 − 5 ≈ 0.505 − 5 = −4.495, so pH ≈ <b>4.49</b>.',
    '<b>Compare.</b> pH 4 means [H⁺] = 10⁻⁴ and pH 5 means 10⁻⁵: pH 4 is <b>10 times</b> more concentrated. Each pH step is a factor of 10.']}],
 ['Thinking log(a + b) = log a + log b. Logs turn products into sums, not sums into sums.', 'Trying to take the log of 0 or a negative number: the domain is x > 0.', 'Writing log_b x = bˣ. The log is the exponent y in bʸ = x.', 'Confusing log₁₀ with ln: log is base 10, ln is base e.'],
 ('Why logarithms compress scales',
  ['Each time the input is multiplied by b, the logarithm adds 1. So numbers from 1 to a million (10⁶) have base 10 logs between 0 and 6. That is why a pH scale from 0 to 14 can describe concentrations that differ by a factor of 10¹⁴, and why a log axis shows both tiny and huge values on one page.']),
 [('log₃ 81 =', ['4', '27', '1/4', '3'], 0, '3⁴ = 81.'),
  ('The vertical asymptote of g(x) = log₂(x + 3) is', ['x = −3', 'x = 3', 'x = 0', 'y = −3'], 0, 'The inside, x + 3, equals 0 at x = −3.')],
 ced=('2.9', '2.10', '2.11'))

# =====================================================================
# 2.12  Logarithm rules and manipulation
# =====================================================================
def _cond_fig():
    f1 = lambda x: 2 * math.log(x, 3) + math.log(5, 3) - math.log(10, 3)
    f2 = lambda x: math.log(x * x / 2, 3)
    P = Plot((0, 10), (-2.5, 4), (36, 12, 206, 170))
    base = P.axes([2, 4, 6, 8, 10], [-2, 2, 4], 'x', 'y', True)
    L = [(1, '', '2 log₃ x + log₃ 5 − log₃ 10', 'f'),
         (2, '', 'power rule: 2 log₃ x = log₃ x²', 'tan'),
         (3, '', 'product and quotient: log₃(x² · 5 / 10) = log₃(x²/2)', 'd'),
         (4, safe_curve(P, f1, .12, 10, 'f', 5, '', 300, lim=4) + safe_curve(P, f2, .12, 10, 'd', 2, '5 4', 300, lim=4) + P.dot(3, f2(3), '(3, 1.37)', 'tan', 10, 14, 4.5), 'both forms draw the same graph', 'f')]
    return fig(base, L, 'Two expressions, one graph: the rules rewrite without changing the function.', 210)

def _db_fig():
    L_ = lambda r: 10 * math.log10(r)
    P = Plot((0, 12), (-3, 14), (36, 12, 206, 170))
    base = P.axes([2, 4, 6, 8, 10, 12], [0, 5, 10], 'I / I₀', 'L (dB)', True)
    L = [(1, safe_curve(P, L_, .25, 12, 'f', 2.6, '', 300, lim=14), 'L = 10 log₁₀(I/I₀)', 'f'),
         (2, ''.join(P.dot(r, L_(r), '', 'tan', r=4.5) for r in (1, 2, 4, 8)), 'intensity ratios 1, 2, 4, 8 (each doubles)', 'tan'),
         (3, P.text(3.1, 2.6, '+3.01', 'd', 10, 'start') + P.text(5.3, 5.6, '+3.01', 'd', 10, 'start') + P.text(8.9, 8.8, '+3.01', 'd', 10, 'start'), 'every doubling adds 10 log₁₀ 2 ≈ 3.01 dB', 'd'),
         (4, P.dot(10, 10, '10 → 10 dB', 'dd', -16, -10, 4.8), 'ten times the intensity adds exactly 10 dB', 'dd')]
    return fig(base, L, 'Loudness in decibels grows by the same amount for every doubling.', 210)

mod('logrules', 'Log rules & equivalent forms',
 'Logarithms turn products into sums, quotients into differences and powers into multiples. Those rules are how you rewrite, condense and compare log expressions.',
 ['Because logarithms are exponents, they inherit the rules of exponents: <b>product</b> <span class="m">log_b(mn) = log_b m + log_b n</span> (exponents add when you multiply), <b>quotient</b> <span class="m">log_b(m/n) = log_b m − log_b n</span>, and <b>power</b> <span class="m">log_b(mᵖ) = p·log_b m</span>. Special values: log_b 1 = 0 and log_b b = 1.',
  'Different bases are related by <b>change of base</b>: <span class="m">log_b x = ln x / ln b = log x / log b</span>. So the graphs of log₂ x, log₁₀ x and ln x are <i>vertical stretches</i> of one another. Also log_b(cx) = log_b c + log_b x: stretching a log graph horizontally is the same as shifting it vertically.',
  'To <b>expand</b> an expression like log₂(8x³), use the rules: log₂ 8 + 3 log₂ x = 3 + 3 log₂ x. To <b>condense</b>, run them backward: 2 log₃ x + log₃ 5 − log₃ 10 = log₃(x²/2). The rules apply to <i>products, quotients and powers</i>: there is no rule for log_b(m + n).'],
 ('you evaluated logarithms one at a time and rewrote exponentials with exponent rules', 'a toolkit that rewrites log expressions without changing them', 'the same function can be written in many forms, and some forms are easier to evaluate or graph', 'the product, quotient and power rules, change of base, expanding and condensing log expressions'),
 [('log_b(mn) = log_b m + log_b n', 'product'), ('log_b(m/n) = log_b m − log_b n', 'quotient'), ('log_b(mᵖ) = p·log_b m', 'power'), ('log_b x = ln x / ln b', 'change of base'), ('log_b(m + n) ≠ log_b m + log_b n', 'no rule for sums')],
 [lab('lr-lab', 'Rules as lengths', canvas='lr-canvas', aria='Bars drawn on a number line show logarithms as lengths. For the product rule the bars for log m and log n laid end to end are exactly as long as the bar for log of mn.',
   seg=('lr-r', 'Rule', [('prod', 'product'), ('quot', 'quotient'), ('pow', 'power')]),
   ctl=[('lr-m', 'm', .5, 20, .5, 6), ('lr-n', 'n (or the power p)', .5, 20, .5, 4)],
   out=[('lr-lhs', 'left side', 'x'), ('lr-rhs', 'right side', 'v'), ('lr-ok', 'compare', '')]),
  lab('lr-lab2', 'One graph, three bases', canvas='lr-canvas2', aria='The graphs of log base 2, log base 10 and the natural logarithm, with a vertical line at a chosen x; their heights stay in a fixed ratio.',
   ctl=[('lr-x', 'x', .2, 20, .1, 8)],
   out=[('lr-vals', 'log₂ x, log₁₀ x, ln x', 'x'), ('lr-ratio', 'log₂ x ÷ log₁₀ x', 'v'), ('lr-why', 'why', '')])],
 [('With the product rule, m = 6 and n = 4: compare the two sides.', show(['click', '#lr-r [data-k=prod]'], ['#lr-m', 6], ['#lr-n', 4]), 'log₂ 24 and log₂ 6 + log₂ 4 are both about 4.585: the lengths of the two blue-green bars match the single orange bar.'),
  ('Switch to the quotient rule with m = 20, n = 5.', show(['click', '#lr-r [data-k=quot]'], ['#lr-m', 20], ['#lr-n', 5]), 'log₂(20/5) = log₂ 4 = 2, and log₂ 20 − log₂ 5 = 4.32 − 2.32 = 2. Subtracting logs divides the numbers.'),
  ('Use the power rule with m = 5 and p = 3.', show(['click', '#lr-r [data-k=pow]'], ['#lr-m', 5], ['#lr-n', 3]), 'log₂(5³) = log₂ 125 ≈ 6.97, and 3·log₂ 5 ≈ 6.97. An exponent on the inside comes out as a multiplier.'),
  ('In the second lab move x. Does the ratio log₂ x ÷ log₁₀ x ever change?', show(['#lr-x', 8]), 'No: it is always about 3.32 (= 1/log₁₀ 2), because log₂ x = log₁₀ x / log₁₀ 2. The graphs are vertical stretches of one another.')],
 [{'h': 'Worked example: condense an expression', 'fig': _cond_fig(),
   'prob': 'Write 2 log₃ x + log₃ 5 − log₃ 10 as a single logarithm, and check it at x = 3.',
   'steps': ['<b>Power rule.</b> 2 log₃ x = log₃(x²).',
    '<b>Product and quotient.</b> log₃(x²) + log₃ 5 − log₃ 10 = log₃(x² · 5 / 10).',
    '<b>Simplify.</b> The single logarithm is <b>log₃(x²/2)</b>.',
    '<b>Check at x = 3.</b> 2 log₃ 3 + log₃ 5 − log₃ 10 = 2 + (1.465 − 2.096) = 1.369, and log₃(9/2) = log₃ 4.5 = 1.369 ✓.']},
  {'h': 'Worked example 2: decibels', 'fig': _db_fig(),
   'prob': 'Sound level is L = 10 log₁₀(I/I₀) decibels, where I is the intensity and I₀ the quietest sound heard. By how many decibels does L change when the intensity doubles? When it is multiplied by 10?',
   'steps': ['<b>Doubling.</b> The new level is 10 log₁₀(2I/I₀) = 10[log₁₀ 2 + log₁₀(I/I₀)] = 10 log₁₀ 2 + L.',
    '<b>Evaluate.</b> 10 log₁₀ 2 = 10(0.30103) ≈ <b>3.01 dB</b>: every doubling adds about 3 dB.',
    '<b>Times 10.</b> 10 log₁₀ 10 = 10(1) = <b>10 dB</b>.',
    '<b>Meaning.</b> The product rule converts a multiplication of intensity into an addition of decibels, which is why decibels use logs.']}],
 ['Writing log(m + n) = log m + log n. There is no sum rule; only products become sums.', 'Dropping the parentheses: log₂ x² means log₂(x²) = 2 log₂ x, not (log₂ x)².', 'Using the power rule on a product inside: log(3x)² is 2 log(3x), not 2 log 3x.', 'Changing base the wrong way: log_b x = ln x / ln b (the base goes underneath).'],
 ('Why the log rules are the exponent rules in disguise',
  ['Let m = bᵃ and n = bᶜ, so a = log_b m and c = log_b n. Then mn = bᵃ·bᶜ = b^(a + c), which says log_b(mn) = a + c. The quotient rule comes from bᵃ/bᶜ = b^(a − c) and the power rule from (bᵃ)ᵖ = b^(ap).']),
 [('log₂ 12 + log₂ (2/3) =', ['3', 'log₂ 12.67', '2', 'log₂ 14'], 0, '12 · 2/3 = 8 and log₂ 8 = 3.'),
  ('log_b(x³) = ', ['3 log_b x', '(log_b x)³', 'log_b x + 3', 'log_b 3x'], 0, 'The power rule brings the 3 out as a multiplier.')],
 ced=('2.12',))

# =====================================================================
# 2.13  Exponential and logarithmic equations and inequalities
# =====================================================================
def _carsol_fig():
    V = lambda t: 24000 * .88 ** t
    t0 = math.log(10 / 24) / math.log(.88)
    P = Plot((-.4, 10.5), (0, 26000), (44, 12, 196, 170))
    base = P.axes([2, 4, 6, 8, 10], [5000, 10000, 15000, 20000, 25000], 't (years)', 'value ($)', True)
    L = [(1, P.curve(V, 0, 10.4, 'f', 2.6, '', 120) + P.seg(-.4, 10000, 10.5, 10000, 'area', 1.6, '5 4'), 'V(t) = 24000(0.88)ᵗ and the level $10,000', 'f'),
         (2, P.dot(t0, 10000, '', 'tan', r=5) + P.seg(t0, 0, t0, 10000, 'tan', 1.4, '3 3') + P.text(t0 - .3, 5500, f't ≈ {t0:.2f}', 'tan', 10, 'end'), '0.88ᵗ = 10/24, so t = ln(10/24)/ln(0.88) ≈ 6.85', 'tan'),
         (3, P.seg(t0, 0, 10.4, 0, 'd', 3.5), 'below $10,000 means t > 6.85 (the curve is under the line)', 'd'),
         (4, '', 'dividing by ln 0.88 < 0 turned < into >', 'dd')]
    return fig(base, L, 'When does a car lose enough value to be worth less than $10,000?', 210)

def _ext_fig():
    F = lambda x: math.log2(x) + math.log2(x - 2)
    P = Plot((-3, 8), (-3, 6), (36, 12, 206, 170))
    base = P.axes([-2, 2, 4, 6], [-2, 2, 4], 'x', 'y', True)
    L = [(1, safe_curve(P, F, 2.002, 8, 'f', 2.6, '', 300, lim=6) + P.seg(2, -3, 2, 6, 'area', 1.4, '5 4') + P.seg(-3, 3, 8, 3, 'mut', 1.4, '5 4'), 'y = log₂ x + log₂(x − 2) lives only on x > 2; compare with y = 3', 'f'),
         (2, '', 'combine: log₂[x(x − 2)] = 3, so x(x − 2) = 2³ = 8', 'tan'),
         (3, '', 'x² − 2x − 8 = 0 gives (x − 4)(x + 2) = 0: x = 4 or x = −2', 'dd'),
         (4, P.dot(4, 3, 'x = 4', 'tan', 0, -12, 5) + hole(P.X(-2), P.Y(3), 'dd', 5) + P.text(-2, 4.2, 'rejected', 'dd', 10), 'x = −2 is outside the domain: extraneous', 'dd')]
    return fig(base, L, 'A solution of the algebra is not always a solution of the equation.', 210)

mod('expeq', 'Exponential & log equations',
 'To get an unknown out of an exponent, take a logarithm. To get it out of a logarithm, exponentiate. Then check the answer against the domain.',
 ['To solve an exponential equation, isolate the exponential part and take a log of both sides: <span class="m">a·bˣ = c</span> gives <span class="m">bˣ = c/a</span>, so <span class="m">x = log_b(c/a) = ln(c/a) / ln b</span>. If both sides are powers of the same base, simply equate exponents: 2^(3x − 1) = 32 = 2⁵ gives 3x − 1 = 5.',
  'To solve a logarithmic equation, combine logs with the rules into a single log if needed, then rewrite as an exponential: <span class="m">log_b(u) = c ⇔ u = bᶜ</span>. Always <b>check the domain</b>: the input of every log must be positive, and an algebraic solution that breaks this is <b>extraneous</b>. For example log₂ x + log₂(x − 2) = 3 gives x² − 2x − 8 = 0, but only x = 4 works: x = −2 is outside the domain.',
  'Inequalities follow the same path. The key is the direction: applying a logarithm with base b > 1 keeps the inequality direction, but dividing or multiplying by a negative number (like ln 0.88 < 0) reverses it. Always sanity-check with a test value, or read the answer from the graph: where is the curve above or below the line?'],
 ('you evaluated a log and wrote an exponent as a log', 'a way to solve for exponents and for arguments of logs', 'equations whose unknown is in an exponent or inside a log', 'solving exponential and log equations and inequalities, extraneous solutions and checking domain'),
 [('a·bˣ = c ⇒ x = ln(c/a)/ln b', ''), ('log_b u = c ⇔ u = bᶜ', ''), ('bᵐ = bⁿ ⇒ m = n', 'same base'), ('check log inputs > 0', 'extraneous'), ('divide by a negative: reverse', 'inequality direction')],
 [lab('xe-lab', 'Where does a·bˣ reach c?', canvas='xe-canvas', aria='The graph of y = a times b to the x, a horizontal line y = c, and their intersection. The x-axis region that satisfies the chosen inequality is highlighted.',
   seg=('xe-rel', 'Solve', [('eq', 'a·bˣ = c'), ('gt', 'a·bˣ > c'), ('lt', 'a·bˣ < c')]),
   ctl=[('xe-a', 'a', 1, 10, .5, 3), ('xe-b', 'b', .3, 4, .1, 2), ('xe-c', 'c', 1, 100, .5, 24)],
   out=[('xe-steps', 'algebra', 'x'), ('xe-sol', 'solution', 'v'), ('xe-chk', 'check', '')]),
  lab('xe-lab2', 'The extra solution', canvas='xe-canvas2', aria='The graph of log base 2 of x plus log base 2 of (x minus d), a horizontal line at k, and the two roots of the quadratic that comes from combining the logs: one on the graph and one outside the domain.',
   ctl=[('xe-d', 'd', 1, 8, 1, 2), ('xe-k', 'k', 1, 4, 1, 3)],
   out=[('xe-quad', 'combined equation', 'x'), ('xe-roots', 'roots', 'v'), ('xe-valid', 'which one works?', '')])],
 [('Set a = 3, b = 2, c = 24 and press =. What is x?', show(['click', '#xe-rel [data-k=eq]'], ['#xe-a', 3], ['#xe-b', 2], ['#xe-c', 24]), 'x = 3: 3·2³ = 24. The curve crosses the line at x = 3.'),
  ('Switch to a·bˣ > c. Which side of x = 3 is the solution?', show(['click', '#xe-rel [data-k=gt]']), 'x > 3: to the right the exponential is above the line, so its output is bigger than c.'),
  ('Now slide b below 1, to 0.5, keeping a·bˣ > c. What flips?', show(['click', '#xe-rel [data-k=gt]'], ['#xe-b', .5], ['#xe-c', 1.5]), 'The solution becomes x < something: a decaying exponential is above the line on the left. The log of a base below 1 is negative, which reverses the inequality.'),
  ('In the second lab with d = 2 and k = 3, which root is a valid solution?', show(['#xe-d', 2], ['#xe-k', 3]), 'x = 4 works. The other root, x = −2, would need log₂(−2), which is not a real number, so it is extraneous.')],
 [{'h': 'Worked example: when is the car worth less than $10,000?', 'fig': _carsol_fig(),
   'prob': 'A car\'s value is V(t) = 24000(0.88)ᵗ dollars after t years. After how many years is it worth less than $10,000?',
   'steps': ['<b>Set up.</b> Solve 24000(0.88)ᵗ < 10000. Divide by 24000: 0.88ᵗ < 10/24 = 0.41667.',
    '<b>Take a logarithm.</b> ln of both sides: t·ln 0.88 < ln 0.41667, that is t(−0.12783) < −0.87547.',
    '<b>Divide by a negative number.</b> Dividing by −0.12783 reverses the inequality: t > 0.87547/0.12783 ≈ <b>6.85</b>.',
    '<b>Check.</b> V(6.85) ≈ 24000(0.4167) = 10,000 ✓ and V(8) = 24000(0.3596) ≈ $8,630, which is below 10,000 ✓. The car is worth less than $10,000 from about year 6.85 on.']},
  {'h': 'Worked example 2: an extraneous solution', 'fig': _ext_fig(),
   'prob': 'Solve log₂ x + log₂(x − 2) = 3.',
   'steps': ['<b>Domain first.</b> Both x > 0 and x − 2 > 0, so x > 2.',
    '<b>Combine.</b> log₂[x(x − 2)] = 3, so x(x − 2) = 2³ = 8.',
    '<b>Solve.</b> x² − 2x − 8 = 0, (x − 4)(x + 2) = 0, so x = 4 or x = −2.',
    '<b>Check the domain.</b> x = −2 is not greater than 2, so it is extraneous. Check x = 4: log₂ 4 + log₂ 2 = 2 + 1 = 3 ✓. The only solution is <b>x = 4</b>.']}],
 ['Writing ln(c/a) / ln b as ln(c/a)/b or ln c − ln a / ln b without parentheses.', 'Forgetting to reverse the inequality when dividing by a negative number (log of a base below 1, or ln of a number below 1).', 'Keeping an answer that makes the inside of a log zero or negative.', 'Taking the log of each term of a sum: log(a + b) is not log a + log b.'],
 ('Reading a solution from the graph',
  ['Solving a·bˣ = c is asking where the graph of the exponential meets the horizontal line y = c. For an inequality, ask where the graph is above or below the line. That picture also explains the flip in direction: when b < 1 the curve falls, so "above the line" is on the left.']),
 [('Solve 5·2ˣ = 40.', ['x = 3', 'x = 8', 'x = 4', 'x = 20'], 0, '2ˣ = 8, so x = 3.'),
  ('Solve log₃(x + 1) = 2.', ['x = 8', 'x = 5', 'x = 9', 'x = 7'], 0, 'x + 1 = 3² = 9, so x = 8.')],
 ced=('2.13',))

# =====================================================================
# 2.14  Logarithmic function context and data modeling
# =====================================================================
PRAC = [(1, 42), (2, 50), (4, 57), (8, 66), (16, 73), (32, 81)]

def _prac_fig():
    b = 39 / math.log(32)
    f = lambda x: 42 + b * math.log(x)
    P = Plot((0, 35), (35, 100), (36, 12, 206, 170))
    base = P.axes([8, 16, 24, 32], [40, 60, 80, 100], 'hours x', 'score', True) + ''.join(P.dot(x, y, '', 'f', r=4) for x, y in PRAC)
    L = [(1, ''.join(P.seg(x, y, 2 * x, y, 'tan', 1.2, '3 3') for x, y in PRAC[:-1] if x <= 8) + P.text(16, 50, 'each ×2 adds about 8', 'tan', 10), 'each doubling of hours adds about 8 points', 'tan'),
         (2, P.dot(1, 42, '', 'dd', r=5) + P.dot(32, 81, '', 'dd', r=5), 'use (1, 42) and (32, 81): at x = 1, ln x = 0, so a = 42', 'dd'),
         (3, P.curve(f, .5, 35, 'd', 2.6, '', 160), 'y = 42 + b ln x with 81 = 42 + b ln 32, so b ≈ 11.25', 'd'),
         (4, P.dot(10, f(10), '67.9', 'tan', 22, 16, 5) + P.seg(10, 35, 10, f(10), 'tan', 1.2, '3 3'), 'at 10 hours: 42 + 11.25 ln 10 ≈ 67.9', 'tan')]
    return fig(base, L, 'Practice hours against test score: gains slow down.', 210)

def _alt_fig():
    h = lambda p: 38.8 - 8.4 * math.log(p)
    P = Plot((0, 110), (-1, 22), (36, 12, 206, 170))
    base = P.axes([20, 40, 60, 80, 100], [5, 10, 15, 20], 'pressure P (kPa)', 'altitude h (km)', True)
    L = [(1, P.curve(h, 12, 108, 'f', 2.6, '', 160), 'h = 38.8 − 8.4 ln P', 'f'),
         (2, P.dot(50, h(50), '5.94', 'tan', 14, -8, 5) + P.seg(50, -1, 50, h(50), 'tan', 1.2, '3 3'), 'P = 50: h = 38.8 − 8.4 ln 50 ≈ 5.94 km', 'tan'),
         (3, P.seg(0, 10, math.exp(28.8 / 8.4), 10, 'dd', 1.4, '4 3'), 'to find P at h = 10: 8.4 ln P = 28.8', 'dd'),
         (4, P.dot(math.exp(28.8 / 8.4), 10, '30.8', 'dd', 4, -12, 5), 'ln P = 3.4286, so P = e^3.4286 ≈ 30.8 kPa', 'dd')]
    return fig(base, L, 'Air pressure falls as altitude rises, so altitude is a log function of pressure.', 210)

mod('logmodel', 'Logarithmic models & data',
 'Some quantities grow quickly at first and then slow down. When equal multiples of the input give equal steps in the output, a logarithmic model fits.',
 ['A <b>logarithmic model</b> has the form <span class="m">y = a + b·ln x</span> (or a·log_c x + k). Its signature: multiplying the input by a constant adds a constant to the output. Doubling x always adds b·ln 2 to y. So a table whose inputs form a geometric pattern (1, 2, 4, 8, …) and whose outputs have <i>constant differences</i> is logarithmic.',
  'To <b>build</b> a log model from two points, use the logarithm of the inputs: <span class="m">b = (y₂ − y₁)/(ln x₂ − ln x₁)</span> and <span class="m">a = y₁ − b·ln x₁</span>. To <b>solve</b> for x, undo the log: <span class="m">x = e^((y − a)/b)</span>. A log model is the inverse of an exponential model: if y is logarithmic in x, then x is exponential in y.',
  'Interpret with care: a log function climbs without bound, but slowly, and is defined only for x > 0. In real situations other limits appear (a test score cannot exceed 100), so state the <b>domain</b> where the model makes sense. Compare it with linear, quadratic and exponential models using residuals and context, as in the last module.'],
 ('you modeled data that grows by a constant factor with a·bˣ', 'a model for rapid early change that levels off', 'the inverse relationship, where outputs go up by constant steps for constant multiples of the input', 'building and using y = a + b ln x, interpreting a and b, solving for x, doubling behavior and the domain of a model'),
 [('y = a + b ln x', ''), ('doubling x adds b ln 2', ''), ('b = (y₂ − y₁)/(ln x₂ − ln x₁)', 'from two points'), ('x = e^((y − a)/b)', 'solving for x'), ('inverse of exponential', 'x is exponential in y')],
 [lab('lm-lab', 'Fit y = a + b ln x', canvas='lm-canvas', aria='A scatter plot of data and a logarithmic curve whose a and b can be changed; the x-axis can be switched to a logarithmic scale where the model becomes a straight line.',
   seg=('lm-set', 'Data', [('score', 'Practice vs score'), ('alt', 'Pressure vs altitude')]),
   pre='<div class="seg" id="lm-ax" role="group" aria-label="x-axis scale"><button type="button" data-k="lin" aria-pressed="true">Ordinary x-axis</button><button type="button" data-k="log" aria-pressed="false">Log x-axis</button></div><div class="row"><button type="button" class="btn primary" id="lm-best">Best fit</button></div>',
   ctl=[('lm-a', 'a (value at x = 1)', -20, 120, .5, 42), ('lm-b', 'b (multiplier of ln x)', -20, 20, .1, 11.3)],
   out=[('lm-eq', 'your model', 'x'), ('lm-rms', 'typical miss (RMS residual)', 'v'), ('lm-dbl', 'each doubling of x changes y by', '')]),
  lab('lm-lab2', 'Use it and question it', canvas='lm-canvas2', aria='The practice-score model drawn over a wide range of hours, with the maximum score of 100 marked, so you can see where the model stops making sense.',
   ctl=[('lm-x', 'Hours x', 1, 250, 1, 20)],
   out=[('lm-pred', 'predicted score', 'x'), ('lm-dbl2', 'doubling to 2x adds', 'v'), ('lm-cap', 'the model reaches 100 at', '')])],
 [('Press <b>Best fit</b> for Practice vs score. What do a and b mean here?', show(['click', '#lm-set [data-k=score]'], ['click', '#lm-best']), 'a ≈ 42 is the predicted score after 1 hour (ln 1 = 0). b ≈ 11.3 means each doubling of hours adds b·ln 2 ≈ 7.8 points.'),
  ('Switch to the <b>Log x-axis</b>. What happens to the curve?', show(['click', '#lm-ax [data-k=log]']), 'It becomes a straight line: y = a + b·(ln x) is linear in ln x. This is the idea behind semi-log plots.'),
  ('Choose <b>Pressure vs altitude</b> and press Best fit. Why is b negative?', show(['click', '#lm-set [data-k=alt]'], ['click', '#lm-ax [data-k=lin]'], ['click', '#lm-best']), 'Because altitude falls as pressure rises: b ≈ −8.4. Each doubling of the pressure lowers the altitude by about 5.8 km.'),
  ('In the second lab drag the hours up to 250. Is the prediction sensible?', show(['#lm-x', 250]), 'No: the model gives more than 100, which a test score cannot be. The model is only valid for a limited domain.')],
 [{'h': 'Worked example: gains that slow down', 'fig': _prac_fig(), 'table': ([['hours x', '1', '2', '4', '8', '16', '32'], ['score', '42', '50', '57', '66', '73', '81']], 'Practice and test score'),
   'prob': 'Students practiced for x hours and then took a test. Choose a model for the score, build it from the first and last data points, and predict the score after 10 hours.',
   'steps': ['<b>Pattern.</b> The hours double each time and the score goes up by about the same amount each time (8, 7, 9, 7, 8). Equal multiples of the input give equal steps in the output: choose <b>y = a + b ln x</b>.',
    '<b>Find a.</b> At x = 1, ln 1 = 0, so a = y(1) = <b>42</b>.',
    '<b>Find b.</b> 81 = 42 + b ln 32, so b = 39/ln 32 = 39/3.4657 ≈ <b>11.25</b>.',
    '<b>Predict.</b> y(10) = 42 + 11.25 ln 10 = 42 + 11.25(2.3026) ≈ <b>67.9</b>. This assumes the same trend, and cannot continue past a score of 100.']},
  {'h': 'Worked example 2: altitude from air pressure', 'fig': _alt_fig(),
   'prob': 'A model for altitude (km) in terms of air pressure P (kPa) is h = 38.8 − 8.4 ln P. Find the altitude at P = 50 kPa, and the pressure at an altitude of 10 km.',
   'steps': ['<b>Evaluate.</b> h(50) = 38.8 − 8.4 ln 50 = 38.8 − 8.4(3.912) = 38.8 − 32.86 ≈ <b>5.94 km</b>.',
    '<b>Set up the reverse.</b> 38.8 − 8.4 ln P = 10, so 8.4 ln P = 28.8 and ln P = 3.4286.',
    '<b>Undo the log.</b> P = e^3.4286 ≈ <b>30.8 kPa</b>.',
    '<b>Check.</b> h(30.8) = 38.8 − 8.4 ln 30.8 = 38.8 − 8.4(3.4279) ≈ 10.0 ✓. Pressure falls by half roughly every 5.8 km.']}],
 ['Using ln x when the inputs are not positive.', 'Forgetting that a is the value at x = 1, not at x = 0 (ln 0 does not exist).', 'Trusting a log model far outside the data: it keeps rising forever, but real quantities hit limits.', 'Solving a·ln x = c by dividing the ln: x = e^(c/a), not (c/a) with ln removed.'],
 ('Log models are exponential models seen from the other side',
  ['If y = a + b ln x, solving for x gives x = e^((y − a)/b), an exponential function of y. When you plot y against ln x you get a straight line, and when you plot ln y against x for an exponential model you also get a straight line. Both are called semi-log plots, and the next module uses them to identify exponential and logarithmic models.']),
 [('For y = 10 + 4 ln x, doubling x changes y by', ['4 ln 2 ≈ 2.77', '4', '8', '10 ln 2'], 0, 'y(2x) − y(x) = 4 ln(2x) − 4 ln x = 4 ln 2.'),
  ('y = 3 + 2 ln x. Solve y = 9 for x.', ['x = e³', 'x = 3', 'x = e⁶', 'x = 6'], 0, '2 ln x = 6, ln x = 3, x = e³ ≈ 20.1.')],
 ced=('2.14',))
