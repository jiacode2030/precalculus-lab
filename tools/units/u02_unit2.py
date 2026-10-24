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
