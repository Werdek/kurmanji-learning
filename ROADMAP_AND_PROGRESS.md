# ROADMAP_AND_PROGRESS.md

> **Version:** 0.5  
> **Last updated:** 2026-11-06  
> **Current phase:** Phase 3 — A1 and A2 curricula complete and playable; B1 content remains.  
> **Overall progress:** ~62% (Phases 1 and 2 engineering complete, A1 and A2 fully authored and playable, 12 of 18 units complete).  
> **Product stance:** text-first. No content audio, no listening exercises, no native-review gate, and no audio-production dependency. Optional interface tones can be muted.

---

## 1. Status Snapshot

| Workstream | Status | Progress | Notes |
|---|---|---:|---|
| Documentation baseline | ✅ Complete | 100% | Four living documents created and updated for A1–A2 |
| Tech stack confirmation | ✅ Complete | 100% | Confirmed 2026-11-03; see PROJECT_OVERVIEW.md §4 |
| Repository scaffold | ✅ Complete | 100% | Next.js 16, strict TS, Tailwind 4, build and typecheck pass |
| Design system and app shell | 🟡 In progress | 90% | Home, lesson, review, progress, settings and 404; exam hub still planned |
| Exercise engine (4 core widgets) | ✅ Complete | 100% | Multiple choice, vocabulary match, sentence builder, fill-in-the-blank |
| SRS and mastery engine | ✅ Complete | 100% | Accuracy EWMA, intervals, lapses, mastery 0–5; unit-tested |
| Content: A1.1 (U1–U3) | ✅ Complete | 100% | 18 lessons, 136 exercises, 138 lexemes, 12 grammar points |
| Content: A1.2 (U4–U6) | ✅ Complete | 100% | 18 lessons, 108 exercises, 197 lexemes, 8 grammar points |
| Content: A2.1 | ✅ Complete | 100% | 18 lessons, 108 exercises, 163 lexemes, 7 grammar points |
| Content: A2.2 | ✅ Complete | 100% | 18 lessons, 108 exercises, 179 lexemes, 5 grammar points |
| Content: B1.1 | ⛔ Not started | 0% | 3 units / 18 lessons planned |
| Content: B1.2 | ⛔ Not started | 0% | 3 units / 18 lessons planned |
| B1 exam simulator | ⛔ Not started | 0% | Blueprint defined; text-first sections only |
| QA, accessibility, pilot | 🟡 In progress | 60% | 41 Vitest tests, 20 Playwright runs, axe scans clean, CI configured; manual audit/pilot pending |

**Legend:** ✅ complete · 🟡 in progress · ⏳ awaiting decision · ⛔ not started · ⚠️ blocked

### A1–A2 content totals

| Metric | Count |
|---|---:|
| Units | 12 |
| Lessons | 72 (72 playable) |
| Exercises | 460 |
| Lexemes | 677 |
| Grammar points | 32 (G01–G32) |
| Audio assets | 0 (not part of the product) |
| Native-review gates | 0 (source-checked content only) |

---

## 2. Phase 1 — Documentation and Stack Setup

### 2.1 Deliverables

| ID | Deliverable | Status | Acceptance criteria |
|---|---|---|---|
| DOC-001 | `PROJECT_OVERVIEW.md` | ✅ Complete | Architecture, stack proposal, UX, SRS, quality gates |
| DOC-002 | `CURRICULUM_MATRIX.md` | ✅ Complete | A1.1–B1.2 units, lessons, grammar map, assessment blueprint |
| DOC-003 | `LINGUISTIC_RESOURCES.md` | ✅ Complete | Source hierarchy, section-level ledger, lexicon policy, conflict log |
| DOC-004 | `ROADMAP_AND_PROGRESS.md` | ✅ Complete | Phases, tasks, milestones, risks, definition of done |
| DOC-005 | B1 exit targets | ✅ Complete | Reading, writing, language use and speaking targets defined |
| DOC-006 | Citation ledger | ✅ Complete | 32 A1–A2 grammar rules mapped to Thackston sections and supporting sources |

### 2.2 Stack decision

**Confirmed:** Next.js 16.4.4 (App Router) + React 19.3.1 + TypeScript 5.9.3 strict + Tailwind CSS 4.3.4 + Zustand 5.0.16 + Dexie 4.4.7 + Zod 4.6.7 + dnd-kit + Vitest 5.1.0/RTL + Playwright 1.64.1.

**Alternatives rejected:** Vite + React SPA; Remix/React Router; Redux Toolkit; localStorage only.

**Decisions confirmed on 2026-11-03 and 2026-11-04:**

- [x] Confirm framework and state stack.
- [x] Confirm UI language (English only for the MVP).
- [x] Confirm local-first MVP with no authentication or sync.
- [x] Confirm a **text-first** product: no content audio input, no listening exercises, no microphone, no TTS, and no audio-production dependency. Optional interface tones are not course content.
- [x] Confirm that content is source-checked (`reviewStatus: "checked"`) and does not require native-speaker sign-off.

### 2.3 Phase 1 exit criteria

- [x] Four living documents exist in the project root.
- [x] B1 exit targets are explicit and measurable.
- [x] Curriculum has 18 units and 108 lessons mapped.
- [x] Grammar rules have stable IDs and source sections.
- [x] Assessment blueprint and pass criteria are defined.
- [x] Stack confirmed by product owner.
- [x] Project owner signs off on dialect baseline and the text-first content plan.

---

## 3. Phase 2 — App Architecture and Component Design

**Goal:** a playable vertical slice: one complete unit, all core exercise types, local persistence, SRS, and a lesson-complete screen.

### 3.1 Work breakdown

| ID | Task | Depends on | Acceptance criteria | Status |
|---|---|---|---|---|
| STACK-001 | Confirm stack and versions | — | Decision recorded in PROJECT_OVERVIEW.md | ✅ |
| STACK-002 | Pin package versions and package manager | STACK-001 | Lockfile committed; Node version documented | ✅ |
| SCAFFOLD-001 | Create Next.js + TypeScript + Tailwind project | STACK-001 | `dev`, `build`, `typecheck`, `test` scripts pass | ✅ |
| SCAFFOLD-002 | Configure ESLint, Prettier, strict TS | SCAFFOLD-001 | CI lint/typecheck clean | ✅ ESLint flat config and Prettier; typecheck/lint/format clean |
| SCAFFOLD-003 | Configure Vitest, RTL, Playwright, axe | SCAFFOLD-001 | One passing smoke test per layer | ✅ Vitest/RTL/Playwright pass; axe scans clean on core routes |
| SCAFFOLD-004 | Configure CI (GitHub Actions) | SCAFFOLD-002/003 | CI runs on PR; required checks documented | ✅ Workflow added; first remote run pending |
| DESIGN-001 | Design tokens: colour, type, spacing, radius, motion | SCAFFOLD-001 | Tokens used only through Tailwind/CSS variables | ✅ |
| DESIGN-002 | App shell and navigation | DESIGN-001 | Home, lesson, review, exam, progress, settings routes render | 🟡 home/lesson/review/progress/settings/404 done; exam hub pending |
| DESIGN-003 | Responsive and mobile layout | DESIGN-002 | Usable at 360 px width; 44 px targets | 🟡 responsive shell implemented; manual mobile audit pending |
| CONTENT-SCHEMA-001 | Zod schemas for unit, lesson, exercise, lexeme, grammar | SCAFFOLD-001 | Schemas reject malformed fixtures | ✅ |
| CONTENT-VALIDATOR-001 | Content linter and CLI | CONTENT-SCHEMA-001 | Fails on missing source/answer key/explanation; catches duplicate IDs and out-of-unit refs | ✅ structural errors fail |
| STATE-001 | Zustand session store | SCAFFOLD-001 | Lesson state survives navigation within session | ✅ |
| STATE-002 | Dexie repository for attempts/reviews/profile | STATE-001 | Attempt log and review queue persist across reload | ✅ |
| STATE-003 | Export/import/reset data | STATE-002 | JSON round-trip preserves progress | ✅ |
| EX-001 | `MultipleChoice` widget | DESIGN-002, CONTENT-SCHEMA-001 | Keyboard + screen-reader accessible; tests | ✅ |
| EX-002 | `VocabularyMatch` widget | DESIGN-002 | Pair matching; no timer; tests | ✅ |
| EX-003 | `SentenceBuilder` widget | DESIGN-002 | Drag/tap and keyboard reorder; tests | ✅ tap-to-add, drag, and keyboard sensor |
| EX-004 | `FillInTheBlank` widget | DESIGN-002 | Conjugation/case answers; explanation; tests | ✅ |
| EX-005 | Shared feedback and lesson shell | EX-001–004 | Correct/incorrect, hint, source badge, continue | ✅ |
| SRS-001 | Scheduler (accuracy-driven SM-2 variant) | STATE-002 | Unit tests for correct/hint/incorrect paths | ✅ |
| SRS-002 | Session builder (due/current/interleaved) | SRS-001 | Queue respects ratios and empty states | 🟡 due/weak/anything queues; interleaving ratios not yet tuned |
| SRS-003 | Mastery levels and unit readiness | SRS-001 | Level 0–5 transitions tested | ✅ |
| A11Y-001 | Accessibility baseline | DESIGN-002 | axe-core clean on core routes; focus visible | ✅ axe scans clean on five routes; display preferences; manual screen-reader audit pending |
| CONTENT-A1 | A1 content (6 units, 36 lessons) | CONTENT-SCHEMA-001 | 36 playable lessons; sourced text; no audio dependency | ✅ 244 exercises, 335 lexemes, 20 grammar points |
| CONTENT-A2 | A2 content (6 units, 36 lessons) | CONTENT-A1 | 36 playable lessons; sourced text; no audio dependency | ✅ 216 exercises, 342 lexemes, 12 grammar points |
| E2E-001 | Vertical-slice Playwright test | CONTENT-A1, EX-005 | Complete an A1 lesson from home to completion | ✅ L1 in Chromium and Firefox |
| E2E-A2 | A2 Playwright smoke test | CONTENT-A2, E2E-001 | Complete an A2.1 lesson and reach an A2.2 lesson | ✅ U7 L1 and U12 L1 in Chromium and Firefox |

### 3.2 Phase 2 exit criteria

- [x] All 36 A1 lessons are playable end-to-end (U1–U6, L1–L6).
- [x] All 36 A2 lessons are playable end-to-end (U7–U12, L1–L6).
- [x] All four core exercise types are implemented and keyboard operable.
- [x] SRS schedules reviews and survives reload.
- [x] Content validator blocks malformed or unsourced content.
- [x] Lesson completion writes attempts, updates mastery, and offers review.
- [x] No hearts/energy/lives/cooldown state exists in the schema or UI.
- [x] axe-core and Playwright smoke tests pass locally in Chromium and Firefox.
- [ ] The CI workflow has completed its first remote run.

---

## 4. Phase 3 — Curriculum and Content Population

**Goal:** populate all 18 units from A1.1 to B1.2 with sourced, text-first content.

### 4.1 Stage plan

| Stage | Units | Lessons | Items (target) | Gate | Status |
|---|---|---:|---:|---|---|
| A1.1 | U1–U3 | 18 | 136 actual | CP1 | ✅ Complete |
| A1.2 | U4–U6 | 18 | 108 actual | CP2 | ✅ Complete |
| A2.1 | U7–U9 | 18 | 108 actual | CP3 | ✅ Complete |
| A2.2 | U10–U12 | 18 | 108 actual | CP4 | ✅ Complete |
| B1.1 | U13–U15 | 18 | ~600 | CP5 | ⛔ Not started |
| B1.2 | U16–U18 | 18 | ~600 | CP6 + mock | ⛔ Not started |
| **Total** | **18** | **108** | **460 authored / ~2,500 planned** | | **12/18 units complete** |

A1 and A2 are authored at six exercises per lesson plus a six-item unit review. B1 will follow the same authoring helpers and may grow to eight to twelve items per lesson.

### 4.2 Content tasks

| ID | Task | Acceptance criteria | Status |
|---|---|---|---|
| CONTENT-A1.1 | U1–U3 lessons and CP1 | 18 playable lessons; sourced; no audio dependency | ✅ |
| CONTENT-A1.2 | U4–U6 lessons and CP2 | 18 playable lessons; sourced; no audio dependency | ✅ |
| CONTENT-A2.1 | U7–U9 lessons and CP3 | Sourced, text-first; past tense and ergativity authored | ✅ |
| CONTENT-A2.2 | U10–U12 lessons and CP4 | Sourced, text-first | ✅ |
| CONTENT-B1.1 | U13–U15 lessons and CP5 | Sourced, text-first; authentic text rights logged | ⛔ |
| CONTENT-B1.2 | U16–U18 lessons and CP6 | Sourced, text-first; formal writing tasks calibrated | ⛔ |
| CONTENT-LEXICON | Full lexicon registry | Every item has source, gender where relevant, stage, domain | 🟡 677 of 1,900 items registered |
| CONTENT-GRAMMAR | Grammar point records | Rule, examples, common errors, source refs | 🟡 32 of ~41 points authored |
| CONTENT-CULTURE | Culture notes and authentic texts | Sourced, non-essentialising, rights-cleared | ⛔ |

### 4.3 Content production order

1. **Lexicon and grammar seed** for the unit.
2. **Dialogue/text** with source-checked language.
3. **Exercise items** generated from the dialogue and grammar targets.
4. **Answer keys and explanations** with error tags.
5. **Source check** against Thackston, Chyet, Rizgar, Bedirxan and IKP.
6. **Schema validation** and golden-set regression.
7. **Checkpoint assembly** and item analysis.

### 4.4 Phase 3 exit criteria

- [x] A1 has 6 units, 36 lessons and six unit reviews.
- [x] A2 has 6 units, 36 lessons and six unit reviews.
- [ ] B1 has 6 units, 36 lessons and six unit reviews.
- [ ] All 6 stage checkpoints exist and are passable.
- [ ] 1,900 lexical items are registered and sourced.
- [ ] All grammar points are authored, exemplified, and cited.
- [x] No published item has `reviewStatus` below `checked`.
- [x] Content validator passes on the A1–A2 corpus.

---

## 5. Phase 4 — B1 Assessment and Exam Simulator

**Goal:** validate B1 readiness with a full, timed, sectioned mock examination and a transparent readiness report. The examination is text-first: reading, language use, writing and an optional rubric-based speaking interview. There is no listening section.

### 5.1 Work breakdown

| ID | Task | Acceptance criteria | Status |
|---|---|---|---|
| EXAM-001 | Finalise B1 blueprint | Text-first sections, timings, points, pass criteria match CURRICULUM_MATRIX §8 | ⛔ |
| EXAM-002 | Exam runner | Section timer, navigation, flagging, submit, accommodations | ⛔ |
| EXAM-003 | Auto-scoring for reading and language use | Answer keys, section scores, item review | ⛔ |
| EXAM-004 | Writing and speaking rubrics | 15-point rubrics, reviewer guide, calibration | ⛔ |
| EXAM-005 | Mock form A | 100 points; all items checked | ⛔ |
| EXAM-006 | Mock forms B and C | Equivalent difficulty; item-bank coverage | ⛔ |
| EXAM-007 | Readiness meter | Weighted formula; explains inputs; no false certainty | ⛔ |
| EXAM-008 | Result report | Section breakdown, pass/fail, revision plan | ⛔ |
| EXAM-009 | Accommodations | Extra time, font size, contrast, screen reader | ⛔ |
| EXAM-010 | Pilot analysis | Item difficulty/discrimination; rubric calibration | ⛔ |

### 5.2 Phase 4 exit criteria

- [ ] Full mock exam can be taken start to finish.
- [ ] Reading and language use are auto-scored.
- [ ] Writing and speaking use published rubrics with reviewer guidance.
- [ ] Results show overall and section scores, pass/fail, and next steps.
- [ ] At least three equivalent forms exist.
- [ ] Accommodations are documented and tested.
- [ ] Pilot data informs item revisions.

---

## 6. Phase 5 — QA, Beta, and Launch

### 6.1 Work breakdown

| ID | Task | Acceptance criteria | Status |
|---|---|---|---|
| QA-001 | Content QA sweep | No unsourced strings; no orphan items; no duplicate IDs | ⛔ |
| QA-002 | Linguistic regression | Golden set passes; conjugation/ergativity tests pass | ⛔ |
| QA-003 | Accessibility audit | WCAG 2.2 AA; manual screen-reader pass | ⛔ |
| QA-004 | Performance audit | LCP <2.5 s; lesson JS budget | ⛔ |
| QA-005 | Cross-browser/device | Chrome, Firefox, Safari; iOS/Android; 360 px width | ⛔ |
| QA-006 | Offline/PWA | Lesson and review work offline after first load | ⛔ |
| QA-007 | Data integrity | Export/import/reset; schema migration tested | ⛔ |
| QA-008 | Pilot with learners | 10–20 learners; pre/post mock; feedback | ⛔ |
| BETA-001 | Closed beta | Invite-only; feedback loop; crash/analytics review | ⛔ |
| LAUNCH-001 | Public launch | Release checklist complete; content ledger exported | ⛔ |

### 6.2 Phase 5 exit criteria

- [ ] All quality gates in PROJECT_OVERVIEW.md §14 pass.
- [ ] Pilot learners show measurable pre/post gains.
- [ ] No P1/P2 accessibility defects.
- [ ] No content with pending review status.
- [ ] Export/import works across at least two schema versions.
- [ ] Launch checklist signed off.

---

## 7. Milestones

| Milestone | Deliverable | Indicative timing* | Status |
|---|---|---|---|
| M0 | Documentation baseline | Complete | ✅ |
| M1 | Playable vertical slice (U1 + core widgets + SRS) | Complete | ✅ |
| M2 | A1 complete (U1–U6, CP1–CP2) | Complete | ✅ 6 units, 36 lessons, 244 exercises |
| M3 | A2 complete (U7–U12, CP3–CP4) | Complete | ✅ 12 units, 72 lessons, 460 exercises |
| M4 | B1 content complete (U13–U18, CP5–CP6) | +12 weeks after A2 | ⛔ |
| M5 | B1 exam simulator + 3 forms | +15 weeks | ⛔ |
| M6 | QA, accessibility, pilot | +19 weeks | ⛔ |
| M7 | Public launch | +21 weeks | ⛔ |

\* Indicative only. Content authoring is the critical path; the text-first policy removes audio production and native-review scheduling from the critical path.

---

## 8. Progress Dashboard

### 8.1 By phase

| Phase | Progress | Notes |
|---|---:|---|
| Phase 1 — Documentation | 100% | Four documents complete; all product decisions confirmed |
| Phase 2 — Architecture | 95% | Vertical slice, settings, lint/format/axe and CI workflow done; exam hub remains |
| Phase 3 — Content | 67% | A1 and A2 complete (12/18 units); B1 remains |
| Phase 4 — Assessment | 0% | Blueprint only |
| Phase 5 — QA/launch | 25% | Unit/component/e2e green; axe clean; CI configured; manual audit and pilot pending |

### 8.2 By stage

| Stage | Units complete | Lessons complete | Exercises |
|---|---:|---:|---:|
| A1.1 | 3/3 | 18/18 | 136 |
| A1.2 | 3/3 | 18/18 | 108 |
| A2.1 | 3/3 | 18/18 | 108 |
| A2.2 | 3/3 | 18/18 | 108 |
| B1.1 | 0/3 | 0/18 | 0 |
| B1.2 | 0/3 | 0/18 | 0 |
| **Total** | **12/18** | **72/108** | **460** |

### 8.3 By exercise widget

| Widget | Designed | Implemented | Tested | Accessible |
|---|---:|---:|---:|---:|
| `MultipleChoice` | ✅ | ✅ | ✅ | ✅ axe clean |
| `VocabularyMatch` | ✅ | ✅ | ✅ | ✅ axe clean |
| `SentenceBuilder` | ✅ | ✅ | ✅ | ✅ axe clean |
| `FillInTheBlank` | ✅ | ✅ | ✅ | ✅ axe clean |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Stack churn or version incompatibility | Medium | Medium | Pin versions; confirm before scaffold; keep dependencies minimal | Engineering |
| Content authoring slower than planned | High | High | Freeze 18-unit scope; author in vertical slices; reuse helpers | Curriculum |
| Dialect inconsistency | Medium | High | Standard literary baseline; source refs; dialect tags; conflict log | Linguistics |
| LLM/machine translation contamination | Medium | High | Source ledger; validator; no runtime generation; audit samples | Linguistics |
| Assessment overstates B1 | Medium | High | Blueprint, pilot, section minima, rubric calibration | Assessment |
| Speaking cannot be auto-graded | High | Medium | Self/tutor rubric; no ASR score; optional human review | Product |
| Copyright in authentic texts | Medium | Medium | Public domain or licensed; adaptation log; legal check | Content |
| Browser storage loss | Medium | Medium | Export/import; schema versioning; clear data controls | Engineering |
| Accessibility regressions | Medium | Medium | axe-core CI; keyboard tests; manual audit | Engineering |
| Scope creep into C1/Sorani | Medium | High | Explicit scope boundaries; backlog for requests | Product |
| Text-only content feels thin for listening goals | Low | Medium | Be explicit that listening is out of scope; recommend external listening practice at A2–B1 | Product |

---

## 10. Definition of Done

### 10.1 Feature DoD

- Acceptance criteria met.
- Unit/component tests pass.
- Keyboard and screen-reader path verified.
- No new axe-core violations.
- No hearts/energy/lives/cooldown introduced.
- Documentation updated if behaviour or architecture changes.

### 10.2 Lesson DoD

- Six lesson sections present and playable.
- At least six items with answer keys and explanations.
- Every Kurdish string has `sourceRefs` and `reviewStatus: "checked"`.
- Grammar point and lexeme refs resolve.
- Lesson completion updates SRS and mastery.
- Playtested on mobile and desktop.

### 10.3 Unit DoD

- Six lessons complete.
- Unit review complete.
- Lexicon and grammar refs complete.
- Source check complete; no native-review gate.
- Unit mastery calculation verified.
- No content validator errors.

### 10.4 Stage gate DoD

- All three units complete.
- Checkpoint items authored and blueprint-covered.
- Ledger review completed.
- Checkpoint pilot or internal dry run completed.
- Known issues logged; no P1 content defects.

### 10.5 Release DoD

- All quality gates pass.
- B1 mock forms A–C available.
- Readiness meter calibrated.
- Accessibility audit passed.
- Privacy/data controls verified.
- Content ledger exported with release.
- Launch checklist signed off.

---

## 11. Decision Log

| ID | Decision | Status | Date | Notes |
|---|---|---|---|---|
| ADR-001 | Local-first MVP, no account required | Accepted | 2026-11-03 | Confirmed; no sync in MVP |
| ADR-002 | Next.js + React + TypeScript + Tailwind | Accepted | 2026-11-03 | Confirmed; versions pinned |
| ADR-003 | Zustand + Dexie persistence | Accepted | 2026-11-03 | Confirmed; implemented and tested |
| ADR-004 | No hearts, lives, energy, or daily locks | Accepted | 2026-11-03 | Core product requirement |
| ADR-005 | Text-first product: no content audio input, listening exercises, microphone, or TTS | Accepted | 2026-11-04 | Supersedes the earlier recorded-audio plan; optional interface tones are muted separately |
| ADR-006 | Standard Literary Kurmanji, Hawar orthography | Accepted | 2026-11-03 | Amed/Diyarbakır primary, Qamishli secondary for reference |
| ADR-007 | No LLM-generated Kurdish as a source | Accepted | 2026-11-03 | Source ledger enforced |
| ADR-008 | Original CEFR-aligned B1 exam | Accepted | 2026-11-03 | Not an accredited certificate |
| ADR-009 | No ASR-based high-stakes speaking score | Accepted | 2026-11-03 | Rubric-based assessment |
| ADR-010 | English as MVP UI language | Accepted | 2026-11-03 | Confirmed; UI is English-only |
| ADR-011 | No native-review gate for content | Accepted | 2026-11-04 | Content publishes at `reviewStatus: "checked"` after source validation |

---

## 12. Changelog

### 2026-11-03 — v0.1 documentation baseline

- Created `PROJECT_OVERVIEW.md`, `CURRICULUM_MATRIX.md`, `LINGUISTIC_RESOURCES.md`, and `ROADMAP_AND_PROGRESS.md`.
- Defined A1.1–B1.2 programme: 18 units, 108 lessons, 1,900 lexical items, 6 checkpoints, 1 B1 mock.
- Defined 33 grammar rules with Thackston section-level citations.
- Defined the core exercise widget set, SRS model, mastery levels, and no-barrier progression.
- Defined B1 examination blueprint, rubrics, and readiness formula.

### 2026-11-03 — v0.2 Phase 2 vertical slice and U1 completion pass

- Confirmed the stack and all five product decisions; ADR-001/002/003/010 moved to Accepted.
- Scaffolded Next.js 16.4.4, React 19.3.1, strict TypeScript, Tailwind 4 and the app shell.
- Implemented exercise widgets, grading with diagnostic error tags, SRS and mastery 0–5.
- Implemented Dexie persistence, XP/streak, lesson completion, and JSON export/import/reset.
- Authored U1: all six lessons playable, 64 exercises, 44 lexemes, 6 grammar points.
- Added the content validator, 39 Vitest tests, and a Playwright L1 smoke test passing in Chromium and Firefox.
- Fixed live dashboard reads to stay read-only inside Dexie `liveQuery`, which had blocked hydration.

### 2026-11-04 — v0.3 Settings, accessibility, and CI

- Added `/settings` with persisted display preferences, data export/import/reset, and build information.
- Moved data controls from Progress to Settings; Progress now links there and keeps its evidence dashboard focused.
- Added a display-preference store (`localStorage`, separate from learner progress) and a root-level effect that applies preferences through CSS.
- Added a high-contrast theme, a reduced-motion override, and a 112.5% large-text mode.
- Fixed colour-contrast failures found by axe: hero text on brand, the sun accent used as text, and the clay text/button token.
- Added ESLint 9 flat config, Prettier, `lint`/`format`/`format:check`/`check` scripts, and a GitHub Actions workflow for static checks, build, and Playwright.
- Added axe-core Playwright scans for `/`, `/review`, `/progress`, `/settings`, and `/learn/u01-l1`; all pass in Chromium and Firefox.
- Added settings and preference tests: 41 Vitest tests and 18 Playwright runs now pass.
- Added `data-scroll-behavior="smooth"` to the root layout for the Next.js 16 navigation override.

### 2026-11-04 — v0.4 A1 curriculum complete; text-first reset

- Removed the listening/dictation exercise type, audio manifest, audio assets, audio hook, audio schema/validation and audio UI.
- Removed native-review requirements, warnings and status gates; all authored content publishes at `reviewStatus: "checked"`.
- Added U2–U6: 30 new lessons, 180 new exercises, 291 new lexemes and 14 new grammar points (G13–G20).
- Added `src/content/units/helpers.ts` with compact authoring factories.
- Wired all six units, 36 lessons, 244 exercises, 335 lexemes and 20 grammar points into `src/content/index.ts`.
- Reworked the home and progress dashboards for six units and overall A1 stats.
- Replaced U1 audio items with text-based fill-in-the-blank and multiple-choice items.
- Added shared unit/lesson/exercise helpers and kept the content validator free of audio and native-review checks.
- `npm run check`, `npm run validate:content`, `npm run build` and Playwright (18 tests) pass.

### 2026-11-06 — v0.5 A2 curriculum complete

- Added U7–U12: 36 new lessons and 216 new exercises across A2.1 and A2.2.
- Added 342 new A2 lexemes (163 in A2.1, 179 in A2.2), reusing A1 lexemes where the word already existed.
- Added grammar points G21–G32: past intransitive, past copula, split ergativity, patient agreement, ezafe chains, modals, subjunctive, future with `dê`, relative clauses, reported speech, conditionals and complex subordinators.
- Wired all six A2 units, lessons, exercises, lexicons and grammar points into `src/content/index.ts`.
- Added `unitNumber()` and switched the dashboard, progress, lesson header and unit cards to global unit numbering (`u07` → Unit 7).
- Updated the home, progress and settings copy from A1 to A1–A2.
- Added `tests/e2e/a2-smoke.spec.ts`, which completes U7 L1 and verifies U12 L1 loads.
- Updated the content gate to 12 units, 72 lessons, 72 playable lessons and 460 exercises.
- `npm run check`, `npm run validate:content`, `npm run build` and Playwright (20 runs) pass.

---

## 13. Immediate Next Actions

1. **Product owner:** playtest all twelve A1–A2 units end-to-end and flag any lesson that feels too short or unclear.
2. **Engineering:** add the `/exam` readiness hub once the exam content model is ready; keep it transparent that no mock form is published yet.
3. **Engineering:** run the CI workflow on the remote repository and make typecheck, lint, format, tests, content validation, build, and Playwright required checks.
4. **Engineering:** complete a manual keyboard and screen-reader audit of lesson, review, and settings flows.
5. **Curriculum:** author B1.1 (U13–U15) with the existing helpers and the text-first policy.
6. **Curriculum:** extend the grammar ledger from G32 to the planned B1 points before authoring U13.
7. **Assessment:** draft the first text-first mock form blueprint against the A1–A2 item pool.
