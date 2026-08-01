# Packet: packet-005-build-vocabulary-practice

## Packet Header

Packet: packet-005-build-vocabulary-practice
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-004-build-book-reader` (Complete)
Status: Approved

Builder and verifier must be different agents.

## Release Guard — carried forward

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Add the first book-powered practice experience: a tappable vocabulary view that reads
only the selected book's word and definition records.

## Allowed Changes

1. Create `src/app/books/[bookId]/vocabulary/page.tsx` to resolve the local full book or
   render `notFound()`.
2. Create `src/components/vocabulary-practice.tsx` as a client component that lets the
   child select a vocabulary word and view its definition.
3. Modify `src/components/book-reader.tsx` only to add one honest “Learn these words”
   link for full books.

- Derive every word and definition from the existing book fixture; only include words with
  `vocabulary` data.
- Keep selection state in component memory only. A “Nice job” acknowledgement is visual
  only; it must not claim saved mastery or reward progress.
- Include a return-to-reader link.

## Not Allowed

1. Modify `src/types/`, `src/data/books.ts`, the shelf/home, global CSS, package/config,
   or metadata files.
2. Add vocabulary data, a second content collection, storage, RAIVL, network calls, audio,
   speech recognition, auth, analytics, or rewards.
3. Change the reader’s fake recording behavior.

## Deliverables

1. `/books/mary-had-a-little-lamb/vocabulary` is testable locally from the reader.
2. A child can choose a Mary vocabulary word and see its book-provided definition.
3. The route rejects unknown/reader-only books rather than inventing activity content.

## Asset Check

No. Vocabulary is rendered from existing local text; no external audio or illustrations.

## Rollback Plan

1. Restore: remove the vocabulary route/component and revert the one reader link.
2. From: `git revert <packet-005-commit>`.
3. Verify: `npm run lint` and `npm run build` pass; the reader remains functional.

## Test Steps

1. Run `npm run lint`, `npm run build`, and `git diff --check`; all pass.
2. From Mary’s reader, follow “Learn these words,” select each vocabulary word, and confirm
   its displayed definition matches `src/data/books.ts`.
3. Return to the reader and verify the current browser session has no persisted progress
   after a full refresh.
4. Inspect the diff: only the three allowed files changed; no separate vocabulary content,
   persistence, RAIVL, network, media, auth, or analytics code exists.

## Recommended Next Packet

`packet-006-build-comprehension-quiz.md`
