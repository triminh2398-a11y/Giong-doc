# Graph Report - gsrc  (2026-11-11)

## Corpus Check
- 19 files · ~8,137 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 503 nodes · 671 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- body.js
- ng_chars.js
- deo.js
- build.py
- lib_ml.js
- hideAll
- helpers.js
- char2.js
- over.js
- scenes_head.js
- H
- char5.js
- char7.js
- render_local.js
- re
- mirBase
- close

## God Nodes (most connected - your core abstractions)
1. `R0()` - 13 edges
2. `hideAll()` - 12 edges
3. `HPW()` - 12 edges
4. `HPP()` - 12 edges
5. `figure()` - 8 edges
6. `babaDeco()` - 8 edges
7. `H()` - 7 edges
8. `halo()` - 7 edges
9. `shaded()` - 6 edges
10. `fig5()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `shade()` --indirect_call--> `H()`  [INFERRED]
  lib_ml.js → body.js

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "body.js"
Cohesion: 0.01
Nodes (206): altarL, ALTBOWL, AM, amL, AMS, AMSL, AMSN, asphT (+198 more)

### Community 1 - "ng_chars.js"
Cohesion: 0.07
Nodes (48): anhHoa(), babaDeco(), baBay(), baChin(), baLua(), baNam(), baSau(), baSau2() (+40 more)

### Community 2 - "deo.js"
Cohesion: 0.05
Nodes (37): AMS, AMSL, AMSN, asphT, cab, CB, cCold, cDash (+29 more)

### Community 3 - "build.py"
Cohesion: 0.13
Nodes (15): bed(), load(), place(), expr(), ff(), loadmp3(), vox(), ghost() (+7 more)

### Community 4 - "lib_ml.js"
Cohesion: 0.12
Nodes (11): fhead(), halo(), house(), lamp(), lerpC(), mountains(), room(), sun() (+3 more)

### Community 5 - "hideAll"
Cohesion: 0.11
Nodes (18): bowls(), brgReset(), buaN(), buongDoor(), cabReset(), hideAll(), kdoor(), mbowls() (+10 more)

### Community 6 - "helpers.js"
Cohesion: 0.16
Nodes (10): bamboo(), circ(), cl(), grains, moon(), person(), poly(), rnd() (+2 more)

### Community 7 - "char2.js"
Cohesion: 0.29
Nodes (11): CAST, ch(), face(), figure(), hairBack(), hairFront(), hand(), limb() (+3 more)

### Community 8 - "over.js"
Cohesion: 0.18
Nodes (5): ctaTxt(), fitText(), flat, hookText(), NOISE

### Community 9 - "scenes_head.js"
Cohesion: 0.18
Nodes (5): HN, JUMPS, KH, S, SOFT

### Community 10 - "H"
Cohesion: 0.20
Nodes (10): H(), HZ(), inBed(), mInBed(), put(), putM(), rock(), thotnot() (+2 more)

### Community 11 - "char5.js"
Cohesion: 0.50
Nodes (7): c5(), CAST5, face5(), fig5(), limb5(), ln(), q()

### Community 12 - "char7.js"
Cohesion: 0.50
Nodes (7): c5(), CAST5, face5(), fig5(), limb5(), ln(), q()

### Community 13 - "render_local.js"
Cohesion: 0.29
Nodes (3): { chromium }, path, { spawn }

### Community 15 - "mirBase"
Cohesion: 0.67
Nodes (3): mirBase(), mirG, mirN

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `H()` connect `H` to `body.js`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `body.js` be split into smaller, more focused modules?**
  _Cohesion score 0.008771929824561403 - nodes in this community are weakly interconnected._
- **Why does `shade()` connect `H` to `lib_ml.js`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `ng_chars.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07247223845704266 - nodes in this community are weakly interconnected._
- **Should `deo.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0524390243902439 - nodes in this community are weakly interconnected._
- **Should `build.py` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._
- **Should `lib_ml.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._