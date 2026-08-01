# Packet: packet-002-build-mock-book-content

## Packet Header

Packet: packet-002-build-mock-book-content
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-001-define-book-data-model` (Complete — requires the narrow
`docs/CHANGELOG.md` closeout record for verified commit `18dace3` before this packet starts).
Status: Approved

Dependency confirmation: The packet-001 closeout is already present and verified in
`docs/CHANGELOG.md`; no changelog change is required by packet-002.

Builder and verifier must be different agents.

## Execution Prerequisite

The factual `packet-001` closeout entry for verified commit `18dace3` and its passed
checks already exists in `docs/CHANGELOG.md`. It is a pre-existing dependency record,
not a change required by this packet. Packet-002's allowed source scope remains exactly
`src/data/books.ts`.

## Release Guard — HV REQUIRED

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Create the one local, typed book fixture that powers every Phase 1 screen: a six-page,
fully interactive *Mary Had a Little Lamb* and three reader-only shelf placeholders.

## Allowed Changes

Create only `src/data/books.ts`.

- Export a typed, JSON-serializable local collection and lookup helper based solely on
  `Book` and its IDs from `src/types/book.ts`.
- Include *Mary Had a Little Lamb* as `full`, with exactly six short pages, page-owned
  words/vocabulary, book-owned read-together, vocabulary, and comprehension activities,
  and a reward tied to its comprehension activity.
- Include exactly three `reader-only` placeholder books with attribution metadata and no
  activity-specific content.
- Use public-domain nursery-rhyme text only; use no remote media, image, audio, or
  third-party assets. Illustrations and narration may be absent.
- Put the comprehension prompt, three answer labels, and correct answer identifier in
  the existing scalar activity `configuration` fields (for example `choiceA`), not in a
  second quiz-content model.

## Not Allowed

1. Change anything in `src/types/`.
2. Create UI, routes, components, storage, recording, network calls, accounts, analytics,
   or asset files.
3. Add packages, licenses beyond truthful per-book metadata, or content for a second full
   book.
4. Use copied modern illustrations, narration, cover art, or audio.

## Deliverables

1. One `Book`-typed fixture collection that is the only Phase 1 content source.
2. A full Mary book that gives downstream reader, vocabulary, quiz, and reward packets
   stable book/page/word/activity/reward IDs to consume.
3. Three reader-only books for a populated shelf, with no implied independent activity
   libraries.

## Asset Check

No protected visual assets. This packet contains only public-domain text and local typed
data; it imports no images, audio, or external resource.

## Rollback Plan

1. Restore: remove `src/data/books.ts` with `git revert <packet-002-commit>`.
2. From: the commit immediately before this packet.
3. Verify: `npm run lint` and `npm run build` pass; no source imports the removed module.

## Test Steps

1. Run `npm run lint` and `npm run build`; both exit 0.
2. Inspect the fixture: all activity targets and reward activity IDs point to IDs owned by
   the Mary book; no separate vocabulary, quiz, or reward collection exists.
3. Inspect the exact diff: only `src/data/books.ts` changed and it contains no remote URL,
   media asset, storage, network, auth, analytics, or UI code.
4. Confirm Mary has six pages and the other three books are `reader-only`.

## Recommended Next Packet

`packet-003-build-treehouse-home.md`
