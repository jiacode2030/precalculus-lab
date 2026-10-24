/* Clue table and "which model or method?" items for the Which-tool trainer. A third entry / bc:true marks Unit 4 rows (not on the AP exam). */
METHODS.clues.push(
 ['Equal steps in x give equal differences in y','Linear model (constant rate of change)'],
 ['Equal steps in x give equal second differences','Quadratic model'],
 ['Equal steps in x give equal ratios y₂/y₁','Exponential model a·bˣ'],
 ['"Grows by 6% per year", "half-life", "doubles every"','Exponential model: write the base from the percent or the doubling time'],
 ['Data that keeps rising but more and more slowly, with no ceiling','Logarithmic model a + b ln x'],
 ['Pattern repeats: tides, Ferris wheel, daylight, sound','Sinusoid: amplitude, midline, period, phase shift'],
 ['The unknown is in an exponent: 3ˣ = 20','Take a logarithm of both sides'],
 ['The unknown is inside a log: log₂(x + 1) = 5','Rewrite in exponential form, then check the domain'],
 ['sin θ = k or cos θ = k, "find all solutions"','Reference angle, then every quadrant that matches the sign, then add the period'],
 ['Zeros, end behavior, or "how many turning points" of a polynomial','Factor, read multiplicities, compare the leading term'],
 ['Fraction of polynomials: asymptotes and holes','Factor top and bottom: cancelled factors give holes, the rest of the bottom gives vertical asymptotes'],
 ['A point given by a distance and an angle','Polar coordinates: x = r cos θ, y = r sin θ'],
 ['"Is the curve getting closer to the origin?" for r = f(θ)','Sign of r and whether r is increasing or decreasing'],
 ['Straight line on a semi-log plot','The original data is exponential'],
 ['One function fed into another; "undo" a function','Composition; inverse (swap x and y, solve)'],
 ['x and y each given in terms of t','Parametric functions: track x(t) and y(t) separately',true],
 ['Rotate, reflect or stretch the whole plane','A 2 × 2 matrix as a linear transformation',true]
);
(function(){const T={lin:'Linear model',quad:'Quadratic model',exp:'Exponential model',log:'Logarithmic model',sin:'Sinusoidal model',takelog:'Take a log of both sides',expform:'Rewrite in exponential form',
    ref:'Reference angle, then all quadrants, then add the period',fact:'Factor and read multiplicities',lead:'Compare leading terms',polar:'Convert with x = r cos θ, y = r sin θ',rsign:'Sign of r and whether r is increasing',inv:'Find the inverse (swap x and y)',comp:'Composition f(g(x))',semi:'Semi-log plot',trans:'Transformations a·f(b(x − h)) + k',param:'Parametric functions x(t), y(t)',mat:'Matrix as a linear transformation'};
  const add=(q,right,wrong,explain,miss,bc)=>{const opts=[right,...wrong];const order=[0,1,2,3].sort(()=>Math.random()-.5);const shuffled=order.map(i=>opts[i]);METHODS.items.push({q,opts:shuffled,correct:shuffled.indexOf(right),explain,miss,bc});};
  add('A table shows y = 5, 15, 45, 135 at x = 0, 1, 2, 3. Which model fits exactly?',T.exp,[T.lin,T.quad,T.log],'Each y is 3 times the one before (equal ratios), so y = 5·3ˣ.');
  add('A table shows y = 2, 5, 10, 17 at x = 1, 2, 3, 4. Which model fits exactly?',T.quad,[T.lin,T.exp,T.sin],'First differences 3, 5, 7 are not constant; second differences 2, 2 are. Quadratic (y = x² + 1).');
  add('The depth of water at a dock rises and falls twice a day. Which model?',T.sin,[T.exp,T.quad,T.log],'It repeats with a fixed period, so a sinusoid with a period of about 12.4 hours.');
  add('Solve 4·2ˣ = 60.',T.takelog,[T.expform,T.fact,T.ref],'Divide by 4 to get 2ˣ = 15, then x = log₂ 15 = ln 15 / ln 2 ≈ 3.907.');
  add('Solve log₃(2x − 1) = 2.',T.expform,[T.takelog,T.inv,T.lead],'3² = 2x − 1, so x = 5. Check: 2(5) − 1 = 9 > 0, inside the domain.');
  add('Find every θ in [0, 2π) with 2 sin θ = −1.',T.ref,[T.inv,T.polar,T.trans],'sin θ = −1/2 has reference angle π/6 and is negative in quadrants III and IV: θ = 7π/6 and 11π/6.');
  add('Where does p(x) = (x − 2)²(x + 1) touch the x-axis without crossing?',T.fact,[T.lead,T.ref,T.semi],'The factor (x − 2) has even multiplicity 2, so the graph touches at x = 2 and crosses at x = −1.');
  add('What does f(x) = (3x² + 1)/(x² − 4) do as x → ∞?',T.lead,[T.fact,T.takelog,T.trans],'Equal degrees: the ratio of leading coefficients, 3/1. Horizontal asymptote y = 3.');
  add('Write the point with polar coordinates (4, 2π/3) in rectangular form.',T.polar,[T.rsign,T.ref,T.inv],'x = 4 cos(2π/3) = −2 and y = 4 sin(2π/3) = 2√3.');
  add('For r = 3 − 2 sin θ on 0 < θ < π/2, is the curve getting closer to or farther from the origin?',T.rsign,[T.polar,T.ref,T.trans],'r is positive (between 1 and 3) and decreasing (sin θ increases), so the distance from the origin shrinks: closer.');
  add('Data plotted with log y against x lie on a straight line. What was the original relationship?',T.exp,[T.lin,T.log,T.quad],'log y linear in x means y = a·bˣ: exponential.');
  add('g(x) = −2f(x − 3) + 1. Describe the graph of g from the graph of f.',T.trans,[T.comp,T.inv,T.fact],'Shift right 3, stretch vertically by 2, reflect over the x-axis, then shift up 1.');
  add('A ball\'s position is x(t) = 3t, y(t) = 20t − 5t². Where is it at t = 2?',T.param,[T.quad,T.polar,T.mat],'Evaluate each coordinate at t = 2: (6, 20).',null,true);
  add('Rotate every point of a figure 90° counterclockwise about the origin.',T.mat,[T.trans,T.polar,T.param],'Multiply each point by the matrix [[0, −1], [1, 0]].',null,true);
})();
