# Packet: M004 Expand Inline Word Help to Every Story Word

## Packet Header

Packet: `packet-m004-expand-inline-word-help`

Date created: 2026-08-01

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-01

Depends on: No completed-packet prerequisite. This is a narrow expansion of the
already implemented reader speech interaction. M000 and M003 remain open for their
own physical-device evidence and status records; this packet must not alter or close
either one.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Let a child tap any readable word in Mary's current story sentence to hear it. Keep the
selected `BookWord` vocabulary words more visibly emphasized, so the child can still
see which words are the planned learning targets.

## Allowed Changes

1. Modify `apps/mobile/src/features/reader/book-reader.tsx` only.
2. Make every non-empty word token in the current page's read-along sentence tappable.
3. Use the existing `hearWord` and device-speech adapter; do not add a second speech
   path.
4. Preserve the original visible punctuation and whitespace.
5. Keep selected current-page `BookWord` vocabulary words visually distinct from the
   ordinary tappable story words.
6. Add or refine accessibility labels, hints, and selected state within the reader as
   needed for the expanded controls.

## Not Allowed

1. Changes to the book model, page text, fixtures, word IDs, speech adapter, package
   manifest, app configuration, or any other mobile screen.
2. Microphone, recording, storage, accounts, profiles, family-member data, cloud sync,
   invitations, analytics, or network features.
3. A visual redesign, artwork import, new navigation, or separate vocabulary system.
4. Any modification to `packet-m000`, `packet-m001`, `packet-m002`, `packet-m003`, or
   FounderOS vault files.

## Deliverables and Tests

1. Every readable word token in Mary's six-page sentence text is individually tappable.
2. Tapping any word speaks its normalized readable form through the existing device
   speech behavior.
3. Punctuation and spacing remain intact; whitespace is not a control.
4. Selected vocabulary words remain more visibly emphasized than ordinary tappable
   words; the active spoken word is visibly distinct.
5. `npx tsc --noEmit`, iOS Metro bundle compilation, and `git diff --check` pass.
6. Independent review confirms the only feature source change is the allowed reader
   file and that no deferred family, recording, data, or AI scope entered.
7. Physical iPhone/iPad test confirms both an ordinary story word and a selected
   vocabulary word speak aloud.

## Asset Check

- **No.** No art, branding, or asset folders are changed.

## Rollback Plan

Restore `apps/mobile/src/features/reader/book-reader.tsx` from the commit before this
packet, then rerun TypeScript and open Mary in Expo Go to confirm the selected-word
behavior remains available.

## Closeout

**Completed:** 2026-08-01

**Implementation:** A dedicated builder changed only
`apps/mobile/src/features/reader/book-reader.tsx`. Every readable, non-whitespace
token in the current page sentence now uses the existing device-speech path. Selected
current-page vocabulary words retain stronger visual emphasis; the active spoken word
is highlighted.

**Verification:** Independent verifier passed scope, TypeScript, whitespace, and iOS
Metro bundle checks. On a physical iPhone/iPad, Dontavius confirmed that both an
ordinary sentence word and a highlighted vocabulary word speak aloud.

**Deferred:** No family data, recordings, accounts, cloud, AI, or separate Spelling
Bee application was added.
