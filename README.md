# Precalculus Lab

An interactive, intuition-first study site for **AP Precalculus**: a unit circle you can spin, polar curves that draw themselves, graphs you stretch with sliders, step-by-step worked examples with figures, randomized practice with exact answers, original free-response questions, and an exam builder. Units 1–3 are on the AP exam; Unit 4 is part of the course but not tested, and its modules are marked "Not on the AP exam" in the menu.

Unofficial study aid. Not affiliated with the College Board. AP and Advanced Placement are trademarks registered by the College Board.

## What is inside
- 41 modules across the four units of the AP Precalculus course framework (Unit 1: 10, Unit 2: 11, Unit 3: 13, Unit 4: 7).
- Each module: the idea, an assumption upgrade, live labs, "Try this" predictions with Set-it-up buttons, worked examples with step-by-step figures (real-life contexts where they fit), common mistakes, an explanation and check-yourself questions. Some modules add a predict-then-reveal drill.
- Practice set (170 randomized problem generators), "Which tool?" trainer, exam builder, mistakes queue, FRQ practice with point-by-point scoring (one original question so far, a Q3 periodic-modeling question; the other three AP question types are still to be written).
- Reference drawer: functions, exponentials and logs, trig and polar.

## Build and test
```
python3 tools/mk.py   # regenerate module pages from tools/units/*.py
python3 build.py      # writes index.html (needs Python 3 and Node)
node tests/flow.js    # end-to-end flows (Playwright + Chromium)
N=400 node tests/audit.js
node tests/check.js [moduleId ...]
```
See `CLAUDE.md` for the layout and the rules that keep the site working. localStorage keys all start with `prec-`.

Part of [Intulab](https://jiacode2030.github.io/intulab/), and installable as part of the Intulab app (works offline).

Report a mistake or something confusing with the **Report an issue** link on any page. It opens a pre-filled issue in the shared [Intulab feedback](https://github.com/jiacode2030/intulab-feedback/issues) tracker, labelled `course:precalc`.

Privacy: progress stays in your browser (keys start with `prec-`); visits are counted anonymously with GoatCounter (no cookies). See the [Privacy policy](https://jiacode2030.github.io/intulab/privacy.html) and [Terms of use](https://jiacode2030.github.io/intulab/terms.html). © 2026 Jiarui Li. All rights reserved.
