# BUILD_RULES.md — Learning Treehouse

## Stack

Locked 2026-07-31 (vault `DECISION_LOG.md` → Infrastructure Decisions):

- Next.js (App Router) + React + TypeScript (strict) + Tailwind CSS
- `src/` directory layout, `@/*` import alias
- Local-first MVP — no accounts, no auth, no cloud sync, no analytics
- Hosting: Vercel under the Creative Directives team, private/preview pipeline

Do not add a database, ORM, auth provider, or analytics package. Do not swap the
framework or CSS approach without a packet and founder approval.

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

Run these before claiming a packet complete:

```
npm run build
```

```
npm run lint
```

Paste the real output. If the report says complete but the files or the build
disagree, the files win.

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
