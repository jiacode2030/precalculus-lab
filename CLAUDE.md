# Precalculus Lab: notes for Claude

Interactive, intuition-first AP Precalculus study site. One self-contained `index.html`, built from `src/` by `python3 build.py`. Built from the Calculus Lab engine (github.com/jiacode2030/calculus-lab); sibling of Mechanics, E&M, Chemistry and Biology Labs: they share the engine and design but are separate repos and sites.

## Workflow
- Edit `src/`, never `index.html` directly. Run `python3 build.py` (needs Python 3 and Node for the JS syntax check), then commit both `src/` and the rebuilt `index.html`.
- Module = `src/modules/<id>.html` + `<id>.js`. The HTML is **generated** from `tools/units/*.py` by `python3 tools/mk.py` (one `mod(...)` call per module; edit the Python, not the HTML). The JS is hand-written. Add new modules to `src/groups.json` (unit order; `bc:true` marks Unit 4, which is not on the AP exam) and `src/mods.json` (title, description, `bc`). `mod(..., ced=('3.13',))` adds the CED topic tags; `drill(...)` in `tools/mk.py` builds a predict-then-reveal drill (pass it as `extra_after_labs`).
- Shared engine: `src/js/core.js` (helpers, panels), `calclib.js` (`sim2d`, `glab` graph labs, `parseExpr`/`sameFn` expression checker, numerics `D`, `D2`, `integ`, `limit`, `roots`, `argmax`, `svgG` static graphs, `mcq`, `terms`), `teach.js` (Coach, Reset, Set-it-up buttons), `practice.js` (problem cards, FRQs, "Which method?"). Data banks: `src/data/*.js` (FRQs, method clues).
- Theme tokens: `src/css/calc.css` (rose-magenta theme from Jia's reference screenshot: page #FAF4F7, accent #B3245C, lavender assumption cards). Color roles stay fixed on every graph: **main curve / sine blue, second curve / inverse / transformed green, cosine / third curve magenta, moving point / secant / tangent orange, asymptotes / midline / guides gold**. Polar curves: blue where r ≥ 0, magenta where r < 0. Shared trig and polar helpers (`SPECIAL`, `exactTrig`, `piText`, `polarGrid`, `polarPanels`, `polarStroke`) are at the end of `calclib.js`.

## Exam units / all units
- Unit 4 parts carry class `bc` (the name is left over from the Calculus engine). The toggle `COURSE()` is stored in `prec-course`: `AB` = AP exam units only, `BC` = all units (default). `body.is-ab` hides everything marked `bc`.

## Rules that break the site if ignored
- The page has no doctype (quirks mode): ids and class names match case-insensitively. Never use two names that differ only by case (for example `x-A` and `x-a`), and never reuse an id across modules (`build.py` stops on case clashes).
- localStorage keys use the prefix `prec-`.
- A `sim2d`/`glab` step function must not call its own `render()`. Other sims' `render()` is fine.
- In canvas draw code, do not shadow the global theme object `T` with a local variable.
- Problem generators (`PROBS.push({id,topic,title,gen})`) return `{q, ans|choices|expr, unit, tol|abs, hint, sol}`. Symbolic answers use `expr` (compared by `sameFn`); antiderivatives also set `c:true`. Give every numeric generator an independent `chk` (a numeric computation of the same quantity) and every `expr` generator a `chkf`; `tests/audit.js` compares them.
- Answer boxes accept `3/4`, `2pi`, `ln(2)`, `sqrt(3)/2` and so on (`parseNum` falls back to `exprConst`).

## Content rules
- Accuracy first. After adding or changing problems run `N=400 node tests/audit.js` and verify answers by hand.
- Keep the notices: "Unofficial study aid. Not affiliated with the College Board." and the study-only note.
- Part of Intulab (`jiacode2030/intulab`), matching Mechanics, E&M and Chemistry: More labs link, Get the app button (rail on computers, overview on phones), footer credit with LinkedIn, ©, Last updated, Privacy/Terms links (`/intulab/...`), the AP trademark line, the Exam format box in Exam review, and the shared GoatCounter counter (`intulab`, skipped under Do Not Track / Global Privacy Control). Reports go to `jiacode2030/intulab-feedback` with the `course:precalc` label.
- App: the head tags link `/intulab/manifest.webmanifest`; `sw.js` (cache `aplabs-precalculus-lab-v1`) gives offline support. Keep the `viewport` tag; without it phones show the desktop layout.
- AP exam date: `AP_EXAM_DATES` in `src/js/ui.js` (2027-05-11, Session 1, morning). Reconfirm each year at apstudents.collegeboard.org/exam-dates.

## Tests (Playwright + Chromium)
`node tests/check.js [moduleId ...]` (all views, desktop and phone, light and dark; takes tens of minutes for all, run it in the background), `node tests/flow.js`, `node tests/audit.js`, `node tests/design.js`.

## Known uncertainties
FRQs and "Which tool?" items are original and want teacher review. Several CED topics share one module (listed by the CED tags on each module).
