# Kurmanji Learning Platform — Project Overview

> **Version:** 0.4 — A1 and A2 complete, text-first product  
> **Last updated:** 2026-11-06  
> **Status:** Phase 3 in progress. A1 and A2 are complete: 12 units, 72 playable lessons, 460 exercises, 677 lexemes and 32 grammar points. B1 remains. The product is text-first: no content audio, no listening exercises, no microphone, no TTS, and no native-review gate. Optional interface tones can be muted.  
> **Language target:** Standard Literary Kurmanji (Northern Kurdish), Hawar/Bedirxan Latin orthography.  
> **CEFR scope:** A1.1 → B1.2, with a text-first B1 exit examination and exam simulator.

---

## 1. Product Definition

A browser-based, local-first Kurmanji course that takes an English-speaking learner from absolute beginner to confident B1 performance. The product is gamified in presentation but deliberately free of the coercive mechanics common in language apps: no hearts, lives, energy, cooldowns, daily locks, or paywalls.

The learner can practise for five minutes or five hours. Progress is driven by demonstrated mastery and spaced retrieval, not by waiting for a timer or buying access.

### Core promise

- **Unlimited practice.** Every lesson, review, and checkpoint can be repeated immediately.
- **Mastery over gatekeeping.** Units are all accessible; recommended order is guidance, not a lock.
- **Verified language.** Every Kurdish string is traceable to a listed grammar, dictionary, or corpus source.
- **Text-first by design.** Reading, writing, and structured production carry the course. There is no content audio, no listening exercise, and no microphone requirement. Optional interface tones can be switched off.
- **Explain every answer.** Feedback includes the rule, the source reference, and the common error being tested.
- **B1 readiness, not just completion.** The final examination tests reading, language use, writing, and an optional rubric-based speaking interview against a CEFR-aligned blueprint.

### Non-goals

- Sorani, Zazaki, Gorani, or Arabic-script Kurdish as productive targets.
- Replacing an accredited certificate. The B1 examination is an original CEFR-aligned readiness assessment, not a replica of a specific national board.
- Social feeds, public leaderboards, or competitive pressure.
- A backend account system in the MVP. Local-first is the default; optional sync comes later.
- Automatic speech recognition as a high-stakes speaking grader. Kurmanji ASR is not reliable enough for that claim.
- Audio-input or listening-comprehension exercises. Listening practice is recommended outside the app, not assessed inside it.
- Recorded native audio, synthetic speech, or a native-review gate for published content.

---

## 2. Learner Experience Principles

1. **One decision at a time.** A lesson shows one exercise card, one primary action, and one clear feedback state.
2. **No punishment loops.** A wrong answer produces explanation and another attempt later — not loss of a resource.
3. **Progress is visible and honest.** The path shows mastery, not just “completed.” A learner can see which skills are fragile.
4. **Short sessions are legitimate.** A 5-minute review is a complete session. A 90-minute deep practice is equally valid.
5. **Text is the primary channel.** Every lesson is fully usable with the screen and keyboard; no exercise depends on hearing or recording audio.
6. **The keyboard is a first-class input.** Every exercise can be completed without a mouse, including Kurdish characters.
7. **Kurdish is never hidden behind transliteration.** Latin-script Kurdish is the target; phonetic hints are support, not a replacement.
8. **Errors are diagnostic.** Each distractor and each wrong answer maps to a known error type (case, agreement, tense, word order, vocabulary).

---

## 3. Success Criteria

### Content integrity

- 100% of published Kurdish strings have a non-empty `sourceRefs` array.
- 100% of published Kurdish strings have `reviewStatus: "checked"` or higher.
- 0 published items containing unverified machine translation.
- 0 published grammar examples that contradict the citation ledger.
- 0 exercises that depend on audio input, audio playback, or a microphone.

### Learning outcomes

- A learner completing the core path and required practice scores at least **60/100 overall** on the B1 mock examination, with no section below 50.
- A learner at “Ready” status scores at least **70%** on the reading section and at least **60%** on writing and speaking rubrics.
- At least **80%** of unit can-do statements are self-rated “can do with confidence” after the corresponding checkpoint.

### Technical quality

- WCAG 2.2 AA for the learning path, exercise engine, and exam runner.
- Largest Contentful Paint under 2.5 s on a mid-range mobile device on a 4G connection.
- Full lesson playable offline after first load.
- No PII collected by default; data export and deletion available in settings.
- Content validation and linguistic regression tests run in CI on every content change.

### Product quality

- A new learner can complete the first lesson without creating an account.
- A review session can start in one click from the home screen.
- No UI state can block practice because of a timer, “energy,” or a currency.

---

## 4. Confirmed Tech Stack

The stack below is confirmed and in use. Versions are pinned in `package.json` and `package-lock.json`. Items marked *planned* are architectural commitments, not current implementations.

| Layer | Confirmed choice | Why | Alternatives considered |
|---|---|---|---|
| Framework | **Next.js 16.4.4 (App Router) + React 19.3.1 + TypeScript 5.9.3 (strict)** | Static-first content, file-based routing, server components for lesson shells, client islands for interactive exercises, strong ecosystem | Vite + React SPA (simpler but weaker routing/SEO), Remix/React Router |
| Styling | **Tailwind CSS 4.3.4 + CSS custom properties** | Fast design-system iteration and consistent tokens; no component-library dependency yet | CSS Modules, vanilla-extract, Chakra |
| Motion | **CSS transitions** | Purposeful card and progress feedback without an animation dependency | Framer Motion (deferred until a concrete need) |
| Client state | **Zustand 5.0.16** | Small, predictable, no provider pyramid; ideal for lesson/session state | Redux Toolkit, Jotai, React Context |
| Durable data | **Dexie 4.4.7 (IndexedDB) + dexie-react-hooks 4.4.0, behind a repository layer** | Attempt logs and SRS queues grow beyond localStorage comfort; structured queries and live dashboards | localStorage only, SQLite/WASM |
| Validation | **Zod 4.6.7 + a custom content validator (`scripts/validate-content.ts`)** | Runtime-safe content schemas and build-time checks for source/answer integrity | JSON Schema + Ajv |
| Drag and drop | **dnd-kit 6.3.1 / sortable 10.0.0** | Keyboard-accessible sortable tiles for SentenceBuilder, with tap-to-add fallback | HTML5 drag events, react-beautiful-dnd |
| Testing | **Vitest 5.1.0 + React Testing Library 16.3.3 + Playwright 1.64.1** | Unit, component, and end-to-end coverage; Chromium and Firefox smoke runs pass | Jest + Cypress |
| PWA/offline | **Workbox service worker — planned** | Precached lesson chunks for offline review | next-pwa, Serwist |
| Lint/format | **ESLint 9 flat config + Prettier 3.9** | Standard, CI-friendly formatting; `npm run check` is the local gate | Biome |
| CI | **GitHub Actions** | Typecheck, lint, format, unit tests, content validation, production build, and Playwright in Chromium/Firefox | GitLab CI |
| Deployment | **Vercel or static export; Docker optional — not yet configured** | Frictionless previews; static export keeps the app portable | Self-hosted Node server |
| Analytics | **None** | Local-first privacy; no PII collection | Plausible/Umami (optional later), Google Analytics (rejected) |

### 4.1 Current implementation status

| Area | Implemented |
|---|---|
| Routes | `/`, `/learn/[lessonId]`, `/review`, `/progress`, `/settings`, English-only 404 |
| Content | A1 and A2 complete: 12 units, 72 lessons (all playable), 460 exercises, 677 lexemes, 32 grammar points |
| Exercise widgets | `MultipleChoice`, `VocabularyMatch`, `SentenceBuilder`, `FillInTheBlank` |
| Learning engine | Normalisation, answer checking, per-target outcomes, diagnostic error tags, hint tracking |
| SRS | Accuracy EWMA, 1-day/3-day/ease scheduling, 10-minute lapses, mastery levels 0–5 |
| Persistence | Dexie attempts/review items/profile, XP/streak, lesson completion, JSON export/import/reset |
| Verification | `npm run validate:content`, `npm run check`, 41 Vitest tests, 20 Playwright runs including axe scans in Chromium and Firefox, production build |

**Current content caveat:** A1 and A2 strings are source-checked (`reviewStatus: "checked"`) against Thackston, Chyet, Rizgar, Bedirxan and IKP. They are not native-reviewed, and native review is not a gate. The product is text-first: there are no content audio assets, no listening exercises, and no microphone input. Optional interface tones are synthesized locally and can be muted. The curriculum totals 12 units and 72 lessons; B1 is not authored yet.

### Deliberate stack decisions

- **No backend in the MVP.** The course is content plus local state. This keeps the product fast, private, and usable offline.
- **No Redux.** The state graph is small and session-scoped; Zustand is sufficient and easier to test.
- **No SQLite/WASM.** Dexie covers the MVP. Revisit only if content authoring or analytics moves client-side.
- **No LLM in the runtime language path.** Language content is authored, sourced, and checked before build. The app never generates Kurdish at runtime.
- **No content-audio layer.** There is no audio manifest, player hook, audio schema, TTS fallback, or listening widget. Optional interface tones are generated in the browser with the Web Audio API; they carry no language content and can be muted.
- **No native-review gate.** Content publishes after source checking and schema validation. Reviewer feedback can improve content later, but it does not block publication.

---

## 5. System Architecture

```
Authoring layer
  content/units/*.ts, content/lexicon/*.ts, content/grammar/*.ts
        │
        ▼
Validation layer (build + CI)
  Zod schemas · sourceRefs checks · answer-key lint · duplicate IDs · cross-reference checks
        │
        ▼
Static content index
  units, lessons, exercises, lexemes, grammar points
        │
        ▼
Next.js App Router
  server-rendered shells for path, lesson, review, exam, progress
        │
        ├──► Exercise islands (client components)
        │       └──► Grading engine ──► attempt log
        │
        ├──► SRS scheduler ──► review queue
        │
        └──► Exam runner ──► section scoring ──► readiness report
        │
        ▼
Persistence layer
  Zustand (session/UI) + Dexie repository (attempts, review items, profile)
        │
        ▼
Progress dashboard and export/import
```

### Runtime layers

1. **Content layer.** Typed lesson, lexeme, and grammar data. Immutable at runtime.
2. **Domain layer.** Grading, normalization, SRS scheduling, mastery calculation, session building, exam scoring.
3. **UI layer.** App shell, path, lesson runner, exercise widgets, feedback, review, exam, progress.
4. **Persistence layer.** Repository interfaces over Dexie; Zustand for ephemeral session state.
5. **Telemetry layer.** Optional, opt-in events only; no answer text or free-writing content leaves the device.

### Rendering strategy

- Unit, lesson, review, and exam shells are statically generated where possible.
- Exercise widgets are client components because they need local interaction and state.
- Content is imported at build time and validated before the app can build.
- There are no content audio assets to preload or stream. Optional interface tones are generated at runtime.

---

## 6. Content Model

The model is implemented as Zod schemas in `src/content/schema/index.ts`, with TypeScript types inferred from those schemas. The prose below remains the design contract; the schema is the executable form.

| Entity | Purpose | Required fields |
|---|---|---|
| `Unit` | A thematic block of six lessons | `id`, `stage`, `order`, `titleKu`, `titleEn`, `description`, `outcomes`, `grammarRefs`, `lexemeRefs`, `lessonIds` |
| `Lesson` | One 15–35 minute learning session | `id`, `unitId`, `index`, `titleKu`, `titleEn`, `objectives`, `inputDialogue`, `exerciseIds`, `estimatedMinutes`, `sourceRefs`, `status` |
| `Exercise` | One interactive item | `id`, `kind`, `prompt`, `payload`, `answerKey`, `acceptedVariants`, `hints`, `explanation`, `skill`, `difficulty`, `sourceRefs`, `reviewTargets` |
| `Lexeme` | A dictionary headword or fixed expression | `id`, `ku`, `pos`, `en`, `gender?`, `sourceRefs`, `dialect`, `examples`, `tags`, `reviewStatus` |
| `GrammarPoint` | A teachable rule | `id`, `title`, `stage`, `rule`, `examples`, `commonErrors`, `sourceRefs`, `reviewStatus` |
| `Attempt` | One answer event | `id`, `exerciseId`, `timestamp`, `correct`, `latencyMs`, `hintsUsed`, `answer`, `errorTags` |
| `ReviewItem` | One schedulable memory | `key`, `domain`, `due`, `intervalDays`, `ease`, `reps`, `lapses`, `accuracy`, `mastery` |
| `Profile` | Learner settings and aggregate progress | `id`, `createdAt`, `xp`, `streak`, `dailyGoal`, `settings`, `masteryByUnit` |

### Invariants

- Every Kurdish-bearing entity has `sourceRefs` and `reviewStatus`.
- A lesson cannot be published if any exercise lacks an answer key or explanation.
- Every exercise target must resolve to a lexeme in that unit's `lexemeRefs` or a grammar point in that unit's `grammarRefs`.
- The schema contains **no** `hearts`, `lives`, `energy`, `dailyLimit`, `unlockCost`, `audioRef`, or `audioAssets` fields.
- Lexeme gender is stored because it determines ezafe and oblique marking, even though Kurmanji nouns do not inflect for gender in the same way as, for example, German nouns.
- Dialect variants are tagged; the default productive target is Standard Literary Kurmanji.
- `reviewDomains` retains `"listening"` only for stored-data compatibility; no exercise emits it and the UI does not display it.

---

## 7. Exercise Engine

### Common contract

Every exercise widget receives the exercise payload, the current mode (`learn`, `review`, `exam`), and callbacks for submission and continuation. It returns a normalized result: correctness, the learner’s answer, hints used, latency, and optional error tags. The shared lesson shell owns the prompt, hint drawer, feedback panel, source badge, and continue action.

### Exercise types

| Type | Interaction | Grading | Key accessibility requirement |
|---|---|---|---|
| `SentenceBuilder` | Reorder scrambled word tiles into a grammatical sentence | Token-order match with accepted variants; token-level feedback | Full keyboard reordering with move-left/move-right controls |
| `VocabularyMatch` | Match Kurmanji terms to English translations | Pair-level correctness; partial completion allowed | No timer; screen-reader labels for both columns |
| `MultipleChoice` | Select one answer from contextual options | Exact option ID; distractors mapped to error tags | Radio-group semantics; focus visible |
| `FillInTheBlank` | Supply a conjugated verb, case marker, or word in context | Exact form or accepted variant; rule-level explanation | Kurdish character palette; no autocorrect |

The schema currently implements exactly these four kinds. `Dialogue` and `WritingPrompt` are planned A2–B1 additions, not current exercise kinds; until they exist, reading texts live in `inputDialogue` and writing is practised through sentence building and fill-in-the-blank.

### Grading rules

- Normalize whitespace, case where appropriate, and final punctuation.
- Do **not** normalize `ê`/`e`, `î`/`i`, `û`/`u`, `ş`/`s`, or `ç`/`c`; these are meaning-bearing orthographic distinctions.
- Accept common, source-verified spelling variants only when the lexeme record lists them.
- A hint reduces the review grade but never blocks continuation.
- In `exam` mode, feedback and explanations are withheld until the section is submitted.
- In `learn` and `review` modes, feedback is immediate and includes the rule and source badge.

---

## 8. Learning Model and Spaced Repetition

### No artificial barriers

There are no hearts, lives, energy, cooldowns, daily caps, or paid unlocks. A learner may repeat any lesson, checkpoint, or exam immediately. XP and streaks are motivational metadata only; they never gate content.

### Skill domains

Each lexeme or grammar point can be tracked in three domains:

- **Recognition:** Kurmanji → English.
- **Production:** English → Kurmanji.
- **Grammar:** apply the rule in a new context.

The schema retains a `"listening"` domain for backward compatibility with stored review items, but no exercise emits it and the Progress dashboard does not display it.

### Scheduling algorithm (accuracy-driven SM-2 variant)

Each review item stores `ease` (1.3–2.8), `intervalDays`, `reps`, `lapses`, `accuracy` (exponentially weighted), and `due`.

- New item: `intervalDays = 0`; first success schedules 1 day; second success schedules 3 days.
- Correct, no hint: `intervalDays = max(1, round(intervalDays × ease))`; `ease += 0.05` (cap 2.8).
- Correct with hint: `intervalDays = max(1, round(intervalDays × 1.2))`; `ease -= 0.05` (floor 1.3).
- Incorrect: `intervalDays = 10 minutes` (same-day retry); `ease -= 0.2` (floor 1.3); `lapses += 1`.
- Accuracy is updated as an exponentially weighted moving average, so recent performance dominates without discarding history.
- Intervals are a scheduling tool, never a gate. “Practice anyway” ignores `due` dates.

### Mastery levels

| Level | Label | Evidence |
|---|---|---|
| 0 | Unseen | No attempts |
| 1 | Introduced | Seen in a lesson |
| 2 | Recognized | Correct recognition with support |
| 3 | Recalled | Correct production with no hint |
| 4 | Independent | Correct across at least two domains, spaced by ≥3 days |
| 5 | Durable | Correct production + grammar + recognition, with a success after ≥7 days |

A unit is “secure” when at least 80% of its core items are at level 3 or above. A stage is “ready” when at least 70% of its items are at level 3 or above and the stage checkpoint is passed.

### Session builder

- 50% due reviews.
- 30% current unit or lesson content.
- 20% interleaved older content.
- “Practice anything” mode bypasses the ratio and lets the learner choose a skill, unit, or weak-item queue.
- The scheduler never withholds a session because a queue is empty; it offers new content or free practice.

### B1 readiness meter

A weighted indicator, not a lock:

- 40% SRS mastery across A1–B1 core items.
- 30% mock examination score.
- 20% stage checkpoint average.
- 10% coverage of can-do statements.

“Ready” requires ≥75% weighted readiness, a mock score ≥60/100, and writing/speaking rubric scores ≥60%. The learner can still practise or retake anything.

---

## 9. Text-First Language Policy

### No content audio in the product

The course deliberately excludes content audio input, content audio playback, listening exercises, dictation, microphone capture, and speech synthesis. This is a product decision, not a temporary gap. It keeps the course:

- usable in silent environments and on any device;
- free of recording, licensing, loudness, and pronunciation-QA work;
- fully testable with deterministic text fixtures;
- accessible to learners who cannot hear or record audio.

Optional interface tones are a separate, decorative layer: they confirm an action, never carry language content, and can be muted in Settings or the lesson header.

### What replaces listening

- **Reading and dialogue.** Every unit opens with a short dialogue or text that models the target language.
- **Structured production.** Fill-in-the-blank, sentence building, and short writing tasks carry productive practice.
- **Explicit orthography.** Kurdish characters are typed with the on-screen palette or a Kurdish keyboard layout.
- **External listening recommendations.** At A2–B1 the course may point learners to external Kurmanji media for optional listening practice, clearly marked as outside the assessed course.

### No TTS policy

Browser speech synthesis is not used anywhere in the product: not for assessment, not for previews, and not as an accessibility fallback. If a learner needs pronunciation support, the course provides written descriptions and recommends external audio.

### UI sound cues

Correct/incorrect feedback remains visual and textual first. In addition, the app may play short, quiet synthesized tones for a correct answer, a wrong answer and lesson completion. They are:

- optional and on by default, with a toggle in Settings and the lesson header;
- generated locally with the Web Audio API, with no recordings or network requests;
- purely confirmatory, so no exercise or instruction depends on hearing them;
- disabled automatically when the browser has no Web Audio support.

The reduced-motion preference suppresses animation but does not change sound; learners who want silence use the sound toggle.

---

## 10. UX and Navigation

### Primary routes

| Route | Purpose |
|---|---|
| `/` | Learning path, recommended next step, per-unit progress |
| `/learn/[lessonId]` | Lesson runner |
| `/review` | Due review queue and free practice |
| `/exam` | B1 mock examination hub and section runner (planned) |
| `/progress` | Mastery, skill breakdown, per-unit lesson status |
| `/settings` | Accessibility, data export/import/reset, build information |

### Home screen

- A1 units are shown as six sections with six lessons each.
- Each unit section shows mastery and lesson completion, not a lock.
- “Continue” is the primary action; “Review” is always available.
- A small “practice anything” entry point for learners who want a specific skill.
- No countdown timers, no “lives left,” no currency.

### Lesson screen

- Top bar: exit and lesson progress.
- Exercise card: prompt, answer area, hint button.
- Bottom action: Check, then Continue.
- Feedback panel: correct/incorrect, concise explanation, source badge, “why this matters,” and next action.
- Lesson completion: summary of accuracy, XP (cosmetic), items added to review, and a clear “Review now” or “Done” choice.

### Review screen

- Due count and estimated minutes.
- “Start review” and “Practice anything.”
- Mastery chips by skill (recognition, production, grammar).
- No penalty for revealing a hint; hints are recorded and affect scheduling only.

### Exam screen

- Section intro with instructions and timing.
- No feedback until the section is submitted.
- Question navigation and review flags.
- Accommodations: extended time, larger text, high contrast, and screen-reader support.
- Results: overall score, section scores, pass/fail against the stated criteria, and a targeted revision plan.

### Progress screen

- Overall A1 mastery and per-unit lesson status.
- CEFR readiness meter with an explicit explanation of its inputs.
- Vocabulary counts: recognition, production.
- Grammar rule mastery with links to review.
- Time practised and streak (optional, non-punitive).

### Settings

- Reduced motion, high contrast, larger text; the operating-system reduced-motion setting is always respected.
- Kurdish keyboard layout and character palette.
- Data export (JSON), import, and full reset.
- Display preferences are device-level and stored in `localStorage`, separate from learner progress in IndexedDB.

---

## 11. Accessibility

- Target WCAG 2.2 AA.
- All interactive elements reachable and operable by keyboard.
- Visible focus states; logical focus order; no focus traps except modal dialogs, which are dismissible.
- Screen-reader labels for exercise prompts, answer choices, and feedback.
- Colour is never the only signal for correctness.
- Reduced-motion mode removes non-essential transitions.
- Text resizing to 200% without loss of function.
- Exam accommodations: extra time, font size, contrast, screen reader, and separate answer review.
- No exercise depends on audio perception or microphone access.

---

## 12. Data, Privacy, and Persistence

- Local-first: no account required for the MVP.
- Zustand holds transient lesson/session state.
- Dexie stores attempts, review items, profile, and settings.
- Export produces a single JSON file with schema version; import validates before merging.
- “Delete all data” removes local databases.
- Analytics are opt-in and aggregate only; no free-writing text or answers are sent.
- If sync is added later, it uses an authenticated backend with row-level security and encrypted transport. It is not part of the MVP.

---

## 13. Folder Structure

Actual layout:

```
src/
  app/
    page.tsx                    # home path and dashboard
    learn/[lessonId]/page.tsx   # statically generated playable lessons
    review/page.tsx             # due / fragile / anything queues
    progress/page.tsx           # mastery, skill accuracy, per-unit status
    settings/page.tsx           # accessibility and data controls
    layout.tsx
    not-found.tsx
    globals.css
  components/
    app-shell.tsx
    lesson-screen.tsx           # runner, persistence, completion
    feedback-panel.tsx
    icons.tsx
    exercises/                  # four widgets, Kurdish key palette, renderer
  content/
    schema/                     # Zod schemas and inferred types
    units/
      helpers.ts                # compact authoring factories
      a1-1/u01.ts–u03.ts        # U1–U3 lessons, exercises, dialogue
      a1-2/u04.ts–u06.ts        # U4–U6 lessons, exercises, dialogue
      a2-1/u07.ts–u09.ts        # U7–U9 lessons, exercises, dialogue
      a2-2/u10.ts–u12.ts        # U10–U12 lessons, exercises, dialogue
    lexicon/u01.ts–u12.ts       # 677 lexemes
    grammar/a1-1.ts             # G01–G12
    grammar/a1-2.ts             # G13–G20
    grammar/a2-1.ts             # G21–G27
    grammar/a2-2.ts             # G28–G32
    validate.ts                 # cross-reference checks
    index.ts                    # content bundle and lookups
  lib/
    grading/                    # normalisation, checking, error tags
    srs/                        # scheduler, mastery, queue helpers
    store/session.ts            # Zustand session store
    db/repositories.ts          # Dexie schema, repository, backup
    labels.ts, utils.ts, use-hydrated.ts
tests/
  unit/                         # grading, SRS, repository
  components/                   # widget rendering and interaction
  content/                      # schema and validator
  e2e/                          # Playwright smoke, settings, accessibility
scripts/
  validate-content.ts
```

Planned additions follow the same boundaries: `content/checkpoints/`, `content/exams/`, and an exam runner under `src/components/exam/`.

---

## 14. Quality Gates

### Content gate

- Schema validation passes.
- Every Kurdish string has `sourceRefs` and `reviewStatus` at `checked` or above.
- Every exercise has an answer key, at least one accepted answer, and an explanation.
- No duplicate IDs; no orphan lexemes or grammar refs.
- Distractors are unique and not accidentally correct.
- No banned sources or machine-translation traces.
- No exercise depends on audio input or audio playback.

### Code gate

- TypeScript strict typecheck.
- ESLint and Prettier clean.
- Unit tests for grading, SRS, and scoring.
- Component tests for all exercise types.
- Playwright smoke test: first lesson, review session, exam submission.
- axe-core scan on key routes.
- Bundle budget: lesson route JavaScript under an agreed threshold.

### Linguistic regression gate

- A golden set of checked sentences must produce the expected tokens, answers, and explanations.
- Conjugation tables for core irregular verbs are tested against the reference ledger.
- Ergative agreement tests cover 1sg/2sg/3pl patients.
- Copula tests cover postconsonantal and postvocalic forms.
- Relative-clause and passive tests cover the B1 target forms.

### Assessment gate

- Blueprint coverage: every section and task type represented.
- Item analysis from pilot attempts: discrimination and difficulty reviewed.
- Writing and speaking rubrics calibrated with at least two reviewers.
- No exam form published with items that have not passed source checking.

---

## 15. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Dialect variation causes contradictory content | High | Standard Literary baseline; dialect tags; conflict log; source refs |
| LLM-generated Kurdish slips into content | High | Source ledger, `sourceRefs` requirement, no runtime generation, content lint |
| Content authoring is slow | High | Freeze the 18-unit matrix; author in vertical slices; reuse helpers |
| Scope expands beyond 18 units | High | Freeze the 18-unit matrix; new ideas go to a backlog |
| B1 exam overstates readiness | High | CEFR-aligned blueprint, pilot, section minima, writing/speaking rubrics |
| Speaking cannot be auto-graded reliably | Medium | Self/tutor rubric; optional human review; no fake ASR score |
| Browser storage loss | Medium | Export/import; schema versioning; clear data controls |
| Accessibility regressions | Medium | axe-core in CI; keyboard tests; manual screen-reader pass |
| Copyright issues in authentic texts | Medium | Public domain or licensed texts; adaptation log; rights check |
| Text-only course underserves listening goals | Medium | State the scope clearly; recommend external listening practice at A2–B1 |

---

## 16. Decision Log

| ID | Decision | Status | Rationale |
|---|---|---|---|
| ADR-001 | Local-first, no account for MVP | Accepted 2026-11-03 | Privacy, speed, offline use, lower operational cost |
| ADR-002 | Next.js + TypeScript + Tailwind | Accepted 2026-11-03 | Static-first, strong routing, accessible component ecosystem |
| ADR-003 | Zustand + Dexie | Accepted 2026-11-03 | Small session state plus durable attempt/SRS storage |
| ADR-004 | No hearts, lives, energy, or daily locks | Accepted | Core product requirement; unlimited practice |
| ADR-005 | Text-first product: no content audio, listening, microphone, or TTS | Accepted 2026-11-04 | Removes production cost and keeps the course deterministic; optional interface tones are muted separately |
| ADR-006 | Standard Literary Kurmanji, Hawar orthography | Accepted | Clear target; broad published reference base |
| ADR-007 | No LLM-generated Kurdish as a source | Accepted | Prevents self-referential translation loops |
| ADR-008 | Original CEFR-aligned B1 exam | Accepted | No single universal Kurmanji B1 board; transparent blueprint |
| ADR-009 | No ASR-based high-stakes speaking score | Accepted | Reliability and fairness |
| ADR-010 | English as MVP UI language | Accepted 2026-11-03 | Confirmed by product owner; content target remains Kurdish |
| ADR-011 | No native-review gate | Accepted 2026-11-04 | Source checking and schema validation are the publication gate |

---

## 17. Confirmed Product Decisions

All pre-code decisions were confirmed on 2026-11-03, and the text-first reset was confirmed on 2026-11-04:

1. **Tech stack:** Next.js + React + TypeScript + Tailwind + Zustand + Dexie (plus Zod, dnd-kit, Vitest/RTL, Playwright).
2. **UI language:** English only for the MVP; Kurdish remains the target language.
3. **Orthography baseline:** Standard Literary Kurmanji with Hawar/Bedirxan orthography. Amed/Diyarbakır is the reference variety; Qamishli is a secondary reference.
4. **Account/sync:** local-first MVP only; no accounts or sync.
5. **Content plan:** text-first, source-checked content with no content audio, no listening exercises, and no native-review gate. Optional interface tones are not course content.

A1 and A2 are complete and playable. The remaining work is B1 content, the exam hub, and the manual QA/pilot pass.
