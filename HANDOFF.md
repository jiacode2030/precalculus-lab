# Precalculus Lab: handoff

State (2026-10-24): all 41 modules are built (Unit 1: 10, Unit 2: 11, Unit 3: 13, Unit 4: 7; see `src/groups.json`; Unit 4 is marked "Not on the AP exam" but never hidden). There is one module list (no All / AP exam toggle). Batches 1-4 are on GitHub; batches 5-8 (sequences through linear transformations) are committed locally and wait for Jia's "push". Work goes in batches of about five modules, each reviewed by Jia from screenshots.

## To publish on GitHub Pages
1. Push `main` to `jiacode2030/precalculus-lab` (only after Jia says "push"; each push needs a new "push").
2. Settings → Pages → deploy from `main`, root.
3. Done: the course is in the Intulab landing page (`courses.js` in jiacode2030/intulab) and the `course:precalc` label exists in jiacode2030/intulab-feedback. Bump `modules` in `courses.js` (now 41) when the batch lands.
4. Done: `og.png` is the Precalculus card (rose r = cos 3θ).

## Before relying on the content
- Unit and topic list checked against the AP Precalculus course at a glance on AP Central (2026-10-24). Exam format and the Tue May 11, 2027 date checked against AP Central the same day; reconfirm each year.
- FRQs and "Which tool?" items are original; a teacher should review them.
- `node tests/audit.js` cross-checks every generator against an independent computation.
