# BUILD_RULES.md — Learning Treehouse

## Stack

Web locked 2026-07-31, mobile added 2026-08-01 as the primary platform target (vault
`DECISION_LOG.md` → Infrastructure Decisions and → Process Decisions):

- **Repo shape:** npm-workspaces monorepo — `apps/web`, `apps/mobile`,
  `packages/book-model`. See `AGENTS.md` → Repo Structure for the full layout.
- **apps/web:** Next.js (App Router) + React + TypeScript (strict) + Tailwind CSS.
  Secondary/reference surface.
- **apps/mobile:** Expo + React Native + TypeScript (strict). Primary product target.
- **packages/book-model:** the one shared book/page/word/activity contract and the
  Mary fixture. Both apps import it — never copy it.
- `src/` directory layout inside each app, `@/*` import alias inside `apps/web` only
- Local-first MVP — no accounts, no auth, no cloud sync, no analytics
- Hosting: Vercel under the Creative Directives team, private/preview pipeline, for
  `apps/web` only. Mobile has no store/publishing pipeline yet — see the
  "Do Not Build Yet" list in `AGENTS.md`.

Do not add a database, ORM, auth provider, or analytics package. Do not swap a
framework or CSS approach without a packet and founder approval. Do not add a third
platform target without going through "Platform / Architecture Pivot" in `AGENTS.md`.

---

## Packet Naming Convention

All packets must follow this exact format:

  `packet-NNN-verb-noun.md`

Examples:
  `packet-000-bootstrap-docs.md`
  `packet-001-define-book-data-model.md`
  `packet-002-build-mock-book-content.md`
  `packet-003-build-treehouse-home.md`
  `packet-004-build-book-reader.md`

Rules:
- NNN is a three-digit number starting at 000
- verb is what is happening (audit / build / fix / cleanup / refactor / define)
- noun is what is being affected (book-data-model / reader / vocabulary-panel / reward)
- No spaces. Hyphens only.
- Do not skip numbers.

---

## Governance Tier — Light (locked 2026-07-31)

Learning Treehouse runs lighter than PreTenPlay. LT is a greenfield app with one repo, no users, no device proof, and no recordings — the cost of a wrong move is `git revert`. PTP's ceremony is not warranted here.

**The loop:**

```
Dontavius says what to build
  -> Codex writes the packet (scope + forbidden + test steps) in packets/
  -> Implementer builds it            [must not be Codex]
  -> Codex verifies against the packet
  -> repeat until the feature works
  -> feature done: BUILD_DIARY entry (+ Trace Card if there's a reusable insight)
```

**Dropped:** a FounderOS-drafted shell step, per-packet founder approval, per-packet vault round-trips. Codex scoping a packet is sufficient authorization to build it.

**Kept, non-negotiable:**
- Every locked decision, above all the book-centered architecture lock in `AGENTS.md`
- A packet file per unit of work — a working note, not a gate
- **Builder ≠ verifier.** Whoever scopes or builds does not certify. This is the one rule that catches errors rather than recording them.

**Dontavius enters only for:** a real product or content decision, anything touching child safety or voice recordings, money, or public launch.

**Re-tighten to full ceremony when any of these is true:** real users touch the app, child voice recordings exist, money is involved, or something breaks that a packet gate would have caught.

---

## Recording — At Feature Boundaries And At Failure

The light tier drops paperwork, not the record. Log at the two moments it pays for itself.

**When a feature is done** — the whole feature, not each packet (e.g. "the reader screen works"):
- Write a closeout entry in the vault at `BUILD_DIARY/YYYY-MM-DD.md`: what was built, which files, what was tested, what is known-broken or deferred.
- If the work produced a reusable insight, capture a Trace Card too. Don't manufacture one when there isn't a real lesson.

**When a feature fails three times** — three genuine attempts, not three typos:
1. **Before attempting a fourth**, log it: date, symptom, what was tried, why each attempt failed.
2. **When fixed**, append how it was fixed and the rule to carry forward.
3. Carry both into that day's `BUILD_DIARY` entry.

One failure is normal, two is unlucky, three means the mental model is wrong — and guessing again costs more than stopping to write it down.

Vault paths:
`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\TROUBLESHOOTING_LOG.md`
`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\BUILD_DIARY\`

---

## Before Editing — AI Must Read and Report

AI must read:

1. `AGENTS.md`
2. `USER.md`
3. `docs/AGENT_RULES.md`
4. `docs/BUILD_RULES.md` — this file
5. `docs/CHANGELOG.md`
6. `PORTABLE_PACKET_WORKFLOW.md`
7. The active approved packet

Then report (before touching any file):

- Files I expect to touch
- Files I will not touch
- Packet-forbidden areas I am aware of
- Whether anything in scope would affect the book-centered architecture lock
- Risks
- Questions or blockers
- Test plan
- Rollback plan

Do not begin editing until this report is confirmed by Dontavius.

---

## During Editing

1. Touch only packet-approved files
2. Do not change the book/page/word data shape without approval
3. Do not rename fields without approval
4. Do not add packages without approval
5. Do not change routing unless the packet allows it
6. Do not mix cleanup and new features in the same packet
7. Prefer small, reversible edits
8. If something unexpected is found: stop and report — do not improvise

---

## After Editing

Report:

1. Files changed
2. What changed in each file
3. Tests run
4. What passed
5. What failed
6. Known remaining issues
7. Recommended next packet

---

## Verification Commands

Run these before claiming a packet complete. All from the repo root unless noted.

**apps/web:**
```
npm run build --workspace apps/web
npm run lint --workspace apps/web
```

**apps/mobile** (no device/simulator in most sessions — typecheck is the floor, not
the ceiling; device/simulator behavior stays open until someone with a device runs it):
```
cd apps/mobile && npx tsc --noEmit
```

**packages/book-model** (optional standalone check when editing the shared contract):
```
cd packages/book-model && npx tsc --noEmit
```

Paste the real output. If the report says complete but the files or the build
disagree, the files win. A green typecheck is not a substitute for the device test
a mobile packet actually requires — say plainly which one you ran.

---

## Git Rules

- Never `git add .` or `git add -A` — stage by exact filename only
- Never commit without reading `git status` first
- Commit message format: `type: short description (YYYY-MM-DD)`
- Do not push to a remote or deploy without explicit approval from Dontavius

---

## Build Philosophy

Small packet. Small change. Clear test. Easy rollback. Then next packet.

Do not ask AI to "build the app."
Ask AI to inspect, create the next packet, then build only the approved packet.

---

## Safe Build Sequence

```
1. Fill docs
2. Run audit
3. Identify drift
4. Create cleanup packet
5. Approve packet
6. Build packet
7. Test
8. Update changelog
9. Create next packet
```

---

## Feature Build Order — Locked

Do not decorate before the loop works:

```
book data structure
  -> reader screen
  -> record/playback
  -> vocabulary tap
  -> spelling mini-test
  -> comprehension question
  -> basic progress tracking
  -> simple Treehouse reward
  -> THEN visual polish
```
