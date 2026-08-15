# Packet: M007 Build Local Book-Powered Spelling Bee

## Packet Header

Packet: `packet-m007-build-local-spelling-bee`

Date created: 2026-08-04

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-04 (`ok next` after LT repo stability cleanup)

Depends on: M000 through M006 complete.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Add the first narrow book-powered practice activity: a local Spelling Bee that uses
only the selected book's existing vocabulary words.

## Problem Being Solved

The mobile loop currently supports reading, word help, and a Parent Guide, but it does
not yet let a parent and child practice spelling from the same book-owned word set.

## Allowed Changes

1. Add one mobile Spelling Bee screen under `apps/mobile/src/features/practice/`.
2. Use only `Book.words` from the selected full book; do not add a separate spelling
   library.
3. Let the child hear the current word through the existing device-speech adapter.
4. Let the child type a spelling attempt and check it locally in memory.
5. Add navigation from the Parent Guide and reader to this local practice screen.
6. Update this packet and repo changelog if the implementation is verified.

## Not Allowed

1. New dependencies.
2. Changes to web app source.
3. Changes to shared book content unless a missing book-owned activity reference is
   explicitly scoped later.
4. Persistence, saved scores, profiles, accounts, auth, cloud, analytics, network,
   microphone, recording, speech recognition, AI services, or RAIVL Core integration.
5. A separate app, companion surface, grade-level library, or global spelling content
   library.
6. Visual asset import or artwork folder changes.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Spelling Bee screen renders for Mary from existing vocabulary words | Verified on device |
| 2 | Hear-word button uses existing device speech path | Verified on device |
| 3 | Typed answer checks locally against normalized book word text | Verified on device |
| 4 | Parent Guide opens Spelling Bee | Verified on device |
| 5 | Reader opens Spelling Bee | Verified on device |
| 6 | No persistence, data, recording, AI, network, account, or new dependency added | Code scan passed |
| 7 | Mobile TypeScript and whitespace checks pass | Complete |
| 8 | Physical Expo Go navigation and spelling check confirmed | Verified on device (2026-08-05) |
| 9 | Reveal correct spelling after 3 wrong attempts; input box fills with the revealed word | Verified on device (2026-08-05) |
| 10 | Progression to Next word requires an explicit Check spelling press — typing the right letters alone does not unlock it | Verified on device (2026-08-05) |
| 11 | Keyboard no longer covers the action buttons (book title removed, word counter moved onto the prompt card) | Verified on device (2026-08-05) |
| 12 | iOS predictive-text/QuickType suggestion bar suppressed on the spelling input | Verified on device (2026-08-05) |
| 13 | Shelf entry point and guide screen header renamed "For grown-ups" → "Parent dashboard" | Verified on device (2026-08-05) |

## Asset Check

- **No.** This packet creates no assets and imports no artwork.

## Rollback Plan

1. Remove `apps/mobile/src/features/practice/spelling-bee.tsx`.
2. Restore `apps/mobile/App.tsx`, `parent-guide.tsx`, and `book-reader.tsx` from the
   commit before this packet.
3. Remove this packet file if the feature is abandoned.
4. Run `cd apps/mobile && npx tsc --noEmit` and open the shelf/reader in Expo Go to
   confirm the prior app flow is restored.

## Test Steps

1. Run `cd apps/mobile && npx tsc --noEmit`.
2. Run `git diff --check`.
3. Search the touched mobile scope for prohibited APIs/features.
4. Open Expo Go on a physical phone.
5. Verify Shelf -> For grown-ups -> Parent Guide -> Practice spelling opens the
   Spelling Bee.
6. Tap Hear word and confirm device speech follows the existing silent-mode behavior.
7. Type an incorrect spelling and confirm it asks the child to try again.
8. Type the correct spelling and confirm the screen marks it correct.
9. Tap Next word and confirm the next Mary vocabulary word appears.
10. From Mary reader, tap Practice spelling and confirm it opens the same local
    book-powered screen.

## Recommended Next Packet

After physical-device verification, decide whether the next narrow loop should be
comprehension, parent-led flashcards, or a no-storage progress/reward preview. Do not
add saved scoring or child learning history without a separate local-data/privacy
packet.

## Implementation Checkpoint

**Implemented:** 2026-08-04. **Corrected and closed:** 2026-08-05.

**Current status:** Complete. Physical-device Expo Go verification passed for the
original scope and for every correction found during that verification pass.

**Corrections made during physical-device verification (2026-08-05), beyond original
scope, all still within `packet-m007`'s Allowed Changes (single screen, no new
dependency, no persistence):**

1. Reveal the correct spelling after 3 wrong `Check spelling` attempts; the input box
   is filled with the revealed word instead of leaving the incorrect attempt in place.
2. Fixed a progression bug: `Next word` was unlocking as soon as the typed text matched
   the target word, even without pressing `Check spelling` — defeated the point of a
   self-test. Progression now requires an explicit correct check (or a reveal), tracked
   via its own state rather than derived live from the input.
3. Suppressed the iOS keyboard's predictive/QuickType suggestion bar on the spelling
   input (`keyboardType="visible-password"`, `spellCheck={false}`,
   `textContentType="none"`) — it was surfacing the correct spelling as a suggestion
   before the child finished typing.
4. Fixed a layout bug: the keyboard covered the action buttons on smaller screens.
   Removed the book-title line and moved the word counter onto the same row as
   "Spell this word" inside the practice card, shortening the screen enough that the
   buttons stay reachable with the keyboard open.
5. Renamed "For grown-ups" to "Parent dashboard" (shelf entry button and the guide
   screen's own header) — the original label tested confusing to the person clicking
   it; the new label is a plain description of what it opens, matching the verb-style
   naming ("Start reading," "Practice spelling," "Return to shelf") already used
   elsewhere in the flow.

**Builder/verifier note:** corrections 1-5 were implemented directly in this session at
Dontavius's explicit direction, in the FounderOS vault chat rather than a separate
Implementer session. The meaningful independent check — physical-device behavior
confirmed by Dontavius himself on his own phone, not self-reported by the agent that
wrote the code — still held for every correction before this packet was marked
Complete.

**Checks run (final pass, 2026-08-05):**

- `cd apps/mobile && npx tsc --noEmit` — PASS.
- `git diff --check` — PASS with line-ending warnings only.
- Touched-scope prohibited-feature search — PASS: no storage, recording, speech
  recognition, network, account, analytics, AI, RAIVL Core, or new dependency work was
  added (`keyboardShouldPersistTaps` is an unrelated React Native scroll-view prop, not
  data persistence).
- `git diff --stat -- package.json apps/mobile/package.json` and lockfile status — PASS:
  no dependency manifest changes.
- Files touched, total: `apps/mobile/src/features/practice/spelling-bee.tsx`,
  `apps/mobile/src/features/parent/parent-guide.tsx`,
  `apps/mobile/src/features/shelf/book-shelf.tsx`.
