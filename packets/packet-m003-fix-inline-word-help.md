# Packet: M003 Fix Inline Word Help

## Packet Header

Packet: `packet-m003-fix-inline-word-help`

Date created: 2026-08-01

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-01 (approved local-only next-version plan)

Depends on: No completed-packet prerequisite. This is an isolated correction to the
already-present `BookReader` and device-speech adapter while `packet-m000` remains
Approved and open for its own physical-device proof. It must not alter or close M000.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Make supported words inside a book page's actual read-along sentence tappable so a child
can ask for help at the moment they encounter a word, rather than needing to use only
the separate vocabulary cards below the sentence.

## Problem Being Solved

The current page sentence is one non-interactive `Text` element. Only the separate
"Words to notice" cards invoke device speech. This does not match the intended child
reading behavior reported during physical-device testing: tapping a visible supported
word such as "fleece," "white," or "snow" in the sentence should speak that word.

## Correction Boundary

This packet does not depend on M000 being marked Complete because it corrects an
observed reader interaction within M000's still-open implementation. Its only source
precondition is verified directly: the existing `BookReader` and `speakWord` adapter
are present. M000's audible device-speech and independent-verification gates remain
unchanged and must still close separately.

## Allowed Changes

1. Modify `apps/mobile/src/features/reader/book-reader.tsx` only.
2. Add inline-token rendering for the current page's read-along text.
3. Match an inline token to a current-page `BookWord` using normalized text while
   preserving the original visible punctuation and spacing.
4. Route an inline tap through the existing `hearWord` and `expo-speech` adapter; do
   not create a second speech path.
5. Visually distinguish an active inline word while it is being spoken, with an
   accessible button-like label or hint.

## Not Allowed

1. Changes to the book model, page text, fixtures, word IDs, speech adapter, package
   manifest, app configuration, or any other mobile screen.
2. Microphone, recording, storage, accounts, profiles, family-member data, cloud sync,
   invitations, analytics, or network features.
3. A visual redesign, artwork import, new navigation, or separate vocabulary system.
4. Any modification to `packet-m000`, `packet-m001`, `packet-m002`, or FounderOS vault
   files.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Supported words in a page sentence are individually tappable | Complete |
| 2 | Inline tap uses the existing speech operation | Complete |
| 3 | Original sentence punctuation/spacing remains readable | Complete |
| 4 | Active inline word is visibly distinguishable | Complete |
| 5 | Mobile TypeScript and iOS bundle checks pass | Complete |
| 6 | Physical device confirms an inline word speaks aloud | Complete |
| 7 | Independent verifier accepts scope before closeout | Complete |

## Asset Check

- **No.** No art, branding, or asset folders are changed.

## Rollback Plan

1. Restore `apps/mobile/src/features/reader/book-reader.tsx` from the commit before
   this packet.
2. Verify with `npx tsc --noEmit` from `apps/mobile` and by opening Mary in Expo Go;
   the prior non-interactive sentence is restored.

## Test Steps

1. Open Mary in Expo Go and navigate across all six pages.
2. Confirm sentence text preserves its words, whitespace, and punctuation.
3. Tap supported inline words, including a punctuation-adjacent word where present.
4. Confirm the tapped word highlights and invokes the same device speech behavior as a
   "Words to notice" card; a later tap replaces the prior utterance.
5. Confirm unsupported inline text remains ordinary readable text.
6. Run `npx tsc --noEmit` in `apps/mobile`.
7. Request the iOS Metro bundle and confirm it compiles.
8. Run `git diff --check` and independently verify the only feature source change is
   the allowed reader file.

## Recommended Next Packet

Create a separate safety-scoped packet for local parent/child page recording only after
the local-only voice-data decision is recorded in the Learning Treehouse vault.

## Closeout

**Completed:** 2026-08-04

**Implementation:** Inline story tokens now route through the existing `hearWord`
path in `BookReader`, preserving punctuation/spacing and emphasizing selected
vocabulary words.

**Verification:** `npx tsc --noEmit` passed in `apps/mobile`. `git diff --check`
passed. Dontavius confirmed on a physical phone that tapped inline words speak aloud
when silent mode is off.

**Follow-up:** M004 expanded the behavior from selected vocabulary words to every
readable story word.
