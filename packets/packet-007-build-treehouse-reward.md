# Packet: packet-007-build-treehouse-reward

## Packet Header

Packet: packet-007-build-treehouse-reward
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-006-build-comprehension-quiz` (Complete)
Status: Approved

Builder and verifier must be different agents.

## Release Guard — carried forward

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Complete the local Phase 1 vertical slice by revealing the Mary book’s existing reward
when its comprehension activity is answered correctly. The moment is celebratory, but
strictly non-persistent.

## Allowed Changes

1. Create `src/components/reward-celebration.tsx` as a presentational component for an
   existing `RewardDefinition`.
2. Modify `src/components/comprehension-quiz.tsx` only to find the reward whose existing
   `activityId` matches the quiz activity and reveal it after a correct answer.

- Render reward label and kind from the selected book’s existing `rewards` array.
- Include a clear “Back to the shelf” or “Read again” path after the celebration.
- State may exist only in component memory; after refresh, the reward must be unearned
  again and the UI must say nothing has been saved.

## Not Allowed

1. Modify `src/types/`, `src/data/books.ts`, routes, reader, shelf/home, global CSS,
   package/config, or metadata files.
2. Add reward definitions, progress models, storage, localStorage/IndexedDB, cookies,
   accounts, network calls, analytics, RAIVL, audio, or child-recording behavior.
3. Claim durable Treehouse growth, saved achievements, or a cross-book reward system.

## Deliverables

1. A correct Mary comprehension answer reveals the reward already defined by that book.
2. A wrong answer never reveals it.
3. The visible Phase 1 loop is locally testable: Shelf → Mary reader/fake record →
   vocabulary → story question → one-time reward.

## Asset Check

No. The reward is code-native text/CSS; no external illustration, badge asset, audio, or
animation package is permitted.

## Rollback Plan

1. Restore: remove `src/components/reward-celebration.tsx` and revert the scoped quiz
   integration.
2. From: `git revert <packet-007-commit>`.
3. Verify: `npm run lint` and `npm run build` pass; the quiz still gives answer feedback
   but no reward UI.

## Test Steps

1. Run `npm run lint`, `npm run build`, and `git diff --check`; all pass.
2. Complete Mary’s quiz with a wrong answer: no reward appears. Complete it correctly: the
   displayed label/kind match the reward in `src/data/books.ts` whose `activityId` matches
   the comprehension activity.
3. Refresh the route: no reward or completion state survives.
4. Follow the post-reward link and verify the shelf/reader remains usable.
5. Inspect the diff: only the two allowed files changed; no data mutation, persistence,
   network, auth, analytics, RAIVL, media, or external asset code exists.

## Recommended Next Packet

Run a local Phase 1 vertical-slice audit before visual polish or any real recording work.
