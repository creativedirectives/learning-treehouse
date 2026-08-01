# Packet: packet-006-build-comprehension-quiz

## Packet Header

Packet: packet-006-build-comprehension-quiz
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-005-build-vocabulary-practice` (Complete)
Status: Approved

Builder and verifier must be different agents.

## Release Guard — carried forward

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Add a one-question, book-owned comprehension check that can be completed locally before
the Phase 1 reward moment.

## Allowed Changes

1. Create `src/app/books/[bookId]/comprehension/page.tsx` to resolve the local full book
   and its existing comprehension activity or render `notFound()`.
2. Create `src/components/comprehension-quiz.tsx` as a client component for one in-memory
   multiple-choice attempt.
3. Modify `src/components/book-reader.tsx` only to add one “Story question” link for full
   books.

- Read the prompt, choice labels, and correct answer identifier from the selected book’s
  existing `BookActivity.configuration`; do not add quiz text in the component.
- Present exactly the three configured choices. Show correct/try-again feedback in memory
  only, with a return-to-reader link.
- Do not show a reward yet; that is the next packet.

## Not Allowed

1. Modify `src/types/`, `src/data/books.ts`, the shelf/home, global CSS, package/config,
   or metadata files.
2. Add a new comprehension model, extra question bank, score history, mastery state,
   storage, RAIVL, network, audio, auth, analytics, or reward behavior.
3. Change vocabulary behavior or the reader’s fake recording control.

## Deliverables

1. `/books/mary-had-a-little-lamb/comprehension` presents the Mary activity’s one question
   and exactly three local choices.
2. The answer feedback works without page reload or persistence.
3. Book-owned configuration remains the sole source for the question and answers.

## Asset Check

No. The screen uses existing local text only.

## Rollback Plan

1. Restore: remove the comprehension route/component and revert the one reader link.
2. From: `git revert <packet-006-commit>`.
3. Verify: `npm run lint` and `npm run build` pass; reader and vocabulary routes remain
   functional.

## Test Steps

1. Run `npm run lint`, `npm run build`, and `git diff --check`; all pass.
2. From Mary’s reader, open “Story question”; the prompt and all three choices exactly
   match its activity configuration in `src/data/books.ts`.
3. Test one wrong and one correct choice; feedback changes in place and a refresh resets
   the attempt state.
4. Inspect the diff: only the three allowed files changed; no hardcoded quiz content,
   additional content collection, storage, RAIVL, reward, network, auth, or analytics code
   was introduced.

## Recommended Next Packet

`packet-007-build-treehouse-reward.md`
