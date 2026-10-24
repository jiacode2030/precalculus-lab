# Precalculus Lab: handoff

State (2026-10-24): 15 modules built in three batches. Batch 1: unitcircle, sinusoid, polarcoord, polargraph, polarroc. Batch 2: sinegraph, tangent, invtrig, trigeq, param. Batch 3: periodic, sinmodel, recip, identities, paramroc. The other 26 modules in `src/groups.json` show as "Coming soon" until their files exist. Work goes in batches of about five modules, each reviewed by Jia from screenshots before the next.

## To publish on GitHub Pages
1. Push `main` to `jiacode2030/precalculus-lab` (only after Jia says "push"; each push needs a new "push").
2. Settings → Pages → deploy from `main`, root.
3. Done: the course is in the Intulab landing page (`courses.js` in jiacode2030/intulab) and the `course:precalc` label exists in jiacode2030/intulab-feedback. Bump `modules` in `courses.js` when a batch lands.
4. Done: `og.png` is the Precalculus card (rose r = cos 3θ).

## Before relying on the content
- Unit and topic list checked against the AP Precalculus course at a glance on AP Central (2026-10-24). Exam format and the Tue May 11, 2027 date checked against AP Central the same day; reconfirm each year.
- FRQs and "Which tool?" items are original; a teacher should review them.
- `node tests/audit.js` cross-checks every generator against an independent computation.
