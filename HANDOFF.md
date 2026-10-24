# Precalculus Lab: handoff

State (2026-10-24): the site shell and batch 1 (Unit 3 polar and trig: unitcircle, sinusoid, polarcoord, polargraph, polarroc) are built. The other 36 modules in `src/groups.json` show as "Coming soon" until their files exist. Work goes in batches of about five modules, each reviewed by Jia from screenshots before the next.

## To publish on GitHub Pages
1. Push `main` to `jiacode2030/precalculus-lab` (only after Jia says "push").
2. Settings → Pages → deploy from `main`, root.
3. Add the course to the Intulab landing page (`courses.js` in jiacode2030/intulab: prefix `prec-`, progressKey `prec-done`, label `course:precalc`) and create the `course:precalc` label in jiacode2030/intulab-feedback.
4. Replace `og.png` (still the Calculus card) with a Precalculus social card.

## Before relying on the content
- Unit and topic list checked against the AP Precalculus course at a glance on AP Central (2026-10-24). Exam format and the Tue May 11, 2027 date checked against AP Central the same day; reconfirm each year.
- FRQs and "Which tool?" items are original; a teacher should review them.
- `node tests/audit.js` cross-checks every generator against an independent computation.
