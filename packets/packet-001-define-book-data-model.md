# Packet: packet-001-define-book-data-model

## Packet Header

Packet: packet-001-define-book-data-model
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Dontavius
Approved on: 2026-07-31
Depends on: `packet-000-bootstrap-docs` (Complete, 2026-07-31, commit `dc59ca9`)

Status: Approved

**Shell drafted by:** FounderOS / Executive Overseer (vault chat), 2026-07-31, per the
Packet Flow in `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\AGENTS.md`.
**Technical scope filled by:** Codex, 2026-07-31. The technical scope, file scope, architecture guardrails, rollback review, and acceptance tests below are complete. Per the Packet Scope Rule, this does not authorize implementation; approval remains Dontavius's decision.
**Approved by:** Dontavius, 2026-07-31, exactly as scope-filled. Implementation authorized for the two source files named under Allowed Changes and nothing else.
**Implementer must not be Codex** — Codex scoped this packet and verifies it at closeout (Packet Flow steps 2 and 5). See the Role-Execution Boundary Rule.


---

## Purpose

Define the book data model — the single JSON structure every Learning Treehouse activity
reads from. This is the foundation the entire MVP sits on: the locked architecture says
one book powers Read Together, Vocabulary Builder, Spelling Bee, Word Match,
Comprehension, family participation, rewards, and progress. That is only true if the
shape is right before any screen exists.

Types and schema only. No UI, no content, no persistence.

## Problem Being Solved

The book-centered architecture is locked in decision but not yet expressed in code. Until
the shape exists, every downstream packet would have to invent its own idea of what a
book is — which is precisely how "separate content per mini-app" creeps back in despite
being explicitly forbidden. Defining it once, first, is what makes the locked decision
enforceable rather than aspirational.

## Governance Constraints — Binding, Not Negotiable

These come from locked decisions in
`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\DECISION_LOG.md`,
not from technical judgment. They are inputs to scope-fill, not things scope-fill may
revise.

1. **One shared book JSON powers every activity type.** Do not model separate content per
   mini-app.
2. The shape must be able to carry, now or by clean extension: story pages,
   illustrations, narration, read-along text, vocabulary, word matching, spelling,
   comprehension, family participation, family voice notes, rewards, and progress data.
3. **Voice notes reference BOTH `bookId` and `pageId`.** Never book-level only — this is
   what enables "parent reads page 1, child reads page 2."
4. First fully-interactive book is *Mary Had a Little Lamb*, 6–8 pages. The model must fit
   it without contortion, and must also accommodate partially-loaded, basic-reader-only
   books for the shelf.
5. Mastery tracking is **local and mock** in Phase 1–2 (per-word seen/missed counts,
   simple needs-review flags). Do NOT model a RAIVL Core integration. RAIVL is not assumed
   to exist or be callable.
6. Book source tiers differ in licensing. The model should carry per-book
   license/attribution metadata.
7. **No branch-centered structure.** Nothing in this model may imply separate content
   libraries per activity type.

## Allowed Changes

Create only these two new files:

1. `src/types/book.ts` — canonical TypeScript-only contract for a book, page, word,
   activity, licensing/attribution, local mock mastery progress, rewards, and page-scoped
   voice-note records.
2. `src/types/book.contract.ts` — compile-time-only contract assertions; no runtime code,
   fixture book, JSON, prose/story text, UI, or behavior.

**Architecture guardrails:**

- `Book` must distinguish `full` and `reader-only` books while retaining one schema.
- Interactive activity configuration remains book-owned and references the same stable
  `bookId`, `pageId`, `wordId`, and activity IDs; no activity may own a separate top-level
  content collection.
- `VoiceNote` requires both `bookId` and `pageId`.
- Local mock mastery includes only stable IDs, seen count, missed count, and needs-review
  state. Do not define RAIVL, browser-storage, network, or external-service types.
- No other source, config, route, component, dependency, lockfile, documentation, or
  vault file may change during implementation.

## Not Allowed

1. Any UI, screen, component, or route
2. Any persistence layer, IndexedDB, localStorage, or storage adapter
3. Any actual book content — *Mary Had a Little Lamb* is `packet-002`
4. Any account, auth, cloud-sync, or analytics
5. Any RAIVL Core import, client, or stub
6. Any dependency additions without explicit approval recorded in this packet
7. Any change to files created by `packet-000` except where listed under Allowed Changes
8. Any FounderOS vault file changes

## Deliverables

1. One JSON-serializable, book-owned contract covering pages, illustration/narration/
   read-along references, words, vocabulary, activities, rewards, license/attribution,
   local mock progress, and page-scoped voice notes.
2. A `full` versus `reader-only` distinction without a second activity-content model.
3. Compile-time assertions proving pages/words/read-along, book-owned activities,
   license/attribution, `VoiceNote.bookId` + `VoiceNote.pageId`, and local mock
   seen/missed/needs-review fields.
4. `npm run lint` and `npm run build` pass with no errors.

## Asset Check

**No.** This packet is types and schema only. No visual or brand assets are involved. The
Learning Treehouse illustration remains external, unimported, and approved as visual
inspiration only — explicitly not as an MVP sitemap.

## Rollback Plan

Required — this packet establishes a shared contract that later packets build on
(`PORTABLE_PACKET_WORKFLOW.md` §8: modifies a shared contract / type definitions).

1. **What to restore:** the type/schema files listed under Allowed Changes
2. **From where:** `git revert <this packet's commit>`. Last known good state is commit
   `dc59ca9` (packet-000 closeout).
3. **Verify by:** `npm run build` passes with no type errors; `npm run lint` passes; the
   repo returns to a scaffold-plus-docs state with no data model present.

**Codex review:** Confirmed. Rollback is `git revert <packet-001 implementation commit>`; verify the two listed type files are absent and lint/build pass.

## Test Steps

1. Run `npm run lint` — exit code 0.
2. Run `npm run build` — exit code 0.
3. Run `git diff --check` — no output.
4. Inspect `src/types/book.contract.ts`: the type-level assertions compile and cover the
   required book ownership, page/word/read-along, attribution, page-scoped voice-note,
   and local mock-mastery fields.
5. Inspect the implementation diff: only `src/types/book.ts` and
   `src/types/book.contract.ts` changed; neither contains UI, content, persistence,
   RAIVL, network, account, analytics, or dependency code.

## Recommended Next Packet

`packet-002-build-mock-book-content.md` — *Mary Had a Little Lamb* as mock JSON (6–8
pages) conforming to this model.

`HV NOTE:` `packet-002` is the first packet to put real content on the live deployment.
Vercel Deployment Protection should be enabled before it lands — see `STATUS.md`.
