# Packet: M005 Build Local Parent Guide v0

## Packet Header

Packet: `packet-m005-build-local-parent-guide`

Date created: 2026-08-02

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-02

Depends on: No completed-packet prerequisite. This is an isolated, in-memory,
adult-facing information screen. It does not touch the existing reader/speech
implementation or alter M000's remaining proof requirements.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Give a parent a simple place in the mobile app to use Learning Treehouse deliberately:
start reading together, use word help, see Mary’s existing book-owned practice words,
and return to reading.

## Allowed Changes

1. Add `apps/mobile/src/features/parent/parent-guide.tsx`.
2. Modify `apps/mobile/src/features/shelf/book-shelf.tsx` to add a clearly labeled
   adult-facing entry and callback.
3. Modify `apps/mobile/App.tsx` only to add in-memory screen state and navigation
   between shelf, reader, and Parent Guide.
4. Derive displayed practice words and definitions only from existing shared `Book`
   data; reuse the full Mary book already on the shelf.
5. Add accessible labels and simple return/start-reading actions.

## Not Allowed

1. Any persistence, AsyncStorage, filesystem write, database, network request,
   analytics, or new dependency.
2. Names, profiles, ages, contacts, relationships, usage history, family members,
   invitations, accounts, authentication, PINs, cloud sync, or Family Circle.
3. Microphone, recording, voice playback, speech recognition/scoring, camera, or AI
   service work.
4. A parent text field or parent-added words.
5. Changes to `packages/book-model`, the existing reader/speech implementation,
   fixtures, app configuration, or any other screen.
6. A visual redesign, artwork import, Treehouse navigation map, or a separate spelling
   feature.

## Deliverables and Tests

1. Shelf exposes an accessible “For grown-ups” entry.
2. Parent Guide explains the deliberate book loop and shows only existing Mary
   book-owned words/definitions.
3. Parent can start Mary reading or return to shelf; no personal form or family data
   appears.
4. Reader-only books never appear as active practice content.
5. TypeScript, iOS bundle compilation, and `git diff --check` pass.
6. Independent reviewer confirms allowed-file scope and absence of deferred data,
   voice, account, cloud, and AI features.
7. Physical device smoke test confirms Shelf -> Parent Guide -> Mary reader -> Shelf.

## Asset Check

- **No.** No art, branding, or asset folders are changed.

## Rollback Plan

Remove the new Parent Guide component and the two navigation/entry changes, then run
TypeScript and open the shelf in Expo Go to confirm the prior reading-only flow.

## Closeout — Completed 2026-08-04

`packet-m005` is Complete. Dontavius confirmed the physical device navigation flow in
Expo Go: Shelf -> For grown-ups -> Parent Guide -> Start reading -> Mary reader ->
Back to shelf all worked without a blank screen, stuck state, or crash.

Independent code verification was performed by Codex from the repo files:

- Allowed-file scope matches the packet: `apps/mobile/src/features/parent/parent-guide.tsx`,
  `apps/mobile/src/features/shelf/book-shelf.tsx`, and `apps/mobile/App.tsx`.
- Parent Guide derives practice words from the existing Mary `Book` data and does
  not collect parent/child data.
- Search found no prohibited M005 APIs or features in the touched scope: persistence,
  filesystem/database writes, network requests, analytics, accounts, authentication,
  PINs, family-member records, microphone, recording, voice playback, speech
  recognition/scoring, camera, or AI service work.
- `cd apps/mobile && npx tsc --noEmit` passed.
- `git diff --check` reported line-ending warnings only, with no whitespace errors.

Known limitation: the repo still contains other local mobile changes and packet files
from the broader mobile sequence. This closeout covers M005 only.
