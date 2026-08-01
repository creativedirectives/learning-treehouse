# Packet: packet-004-build-book-reader

## Packet Header

Packet: packet-004-build-book-reader
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-003-build-treehouse-home` (Complete)
Status: Approved

Builder and verifier must be different agents.

## Release Guard — carried forward

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Make the Mary book locally readable, page by page, with a clearly fake in-memory record
control. This establishes the first testable reading loop without recording or storing a
child's voice.

## Allowed Changes

1. Create `src/app/books/[bookId]/page.tsx` as the server route that resolves a local
   book or renders Next.js `notFound()`.
2. Create `src/components/book-reader.tsx` as a client component for in-memory page
   navigation and fake-record visual state.

- Render title, current page count, read-along text, and only words owned by the displayed
  page using `src/data/books.ts`.
- Provide accessible previous/next page controls and a return-to-shelf link.
- The fake record control may toggle labels such as “Ready to record” and “Pretend
  recording”; it must not call `MediaRecorder`, request microphone permission, create an
  audio blob, or persist anything.
- Reject reader-only/unknown URLs gracefully; no activities are exposed from this packet.

## Not Allowed

1. Modify `src/types/`, `src/data/books.ts`, the home shelf, global CSS, config, or
   package files.
2. Implement microphone access, audio playback, localStorage/IndexedDB, upload, cloud
   sync, accounts, analytics, or a voice-note record.
3. Create vocabulary, quiz, reward, or any independent activity content route.
4. Add dependencies or external assets.

## Deliverables

1. `/books/mary-had-a-little-lamb` presents all six Mary pages one at a time.
2. A local-only fake record control makes the Phase 1 limitation obvious.
3. Unknown and reader-only book URLs do not render a misleading interactive reader.

## Asset Check

No. No audio, image, or other media asset is created or imported.

## Rollback Plan

1. Restore: remove `src/app/books/[bookId]/page.tsx` and `src/components/book-reader.tsx`.
2. From: `git revert <packet-004-commit>`.
3. Verify: `npm run lint` and `npm run build` pass; shelf remains available.

## Test Steps

1. Run `npm run lint`, `npm run build`, and `git diff --check`; all pass.
2. Locally navigate from the shelf to Mary; page 1 renders, Next advances to page 6, and
   Previous returns to page 1 without crossing bounds.
3. Toggle the fake record control twice; its label changes but the browser never requests
   microphone permission and no data is written.
4. Open an unknown book route and a reader-only book route; both are rejected without a
   runtime error.
5. Inspect the diff: only the two allowed files changed and no audio, storage, network,
   auth, analytics, or activity-specific content collection exists.

## Recommended Next Packet

`packet-005-build-vocabulary-practice.md`
