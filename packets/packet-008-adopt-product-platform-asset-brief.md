# Packet: packet-008-adopt-product-platform-asset-brief

## Packet Header

Packet: packet-008-adopt-product-platform-asset-brief
Date created: 2026-08-01
Project: Learning Treehouse (LT)
Approved by: Dontavius
Approved on: 2026-08-01 (direct docs-only instruction to Codex)
Depends on: Monorepo restructuring complete at commit `087b245`; future roadmap
decision recorded in the Learning Treehouse vault `DECISION_LOG.md` on 2026-08-01

Status: Complete

---

## Purpose

Adopt `docs/PRODUCT_PLATFORM_AND_ASSET_BRIEF.md` as required repo reading while making
its current-state, scope, and device-verification boundaries explicit.

## Problem Being Solved

The brief correctly describes the mobile-primary monorepo and book-centered product
direction, but future sessions could mistake its proposed asset tree for existing
folders, treat its roadmap as implementation permission, maintain a second exclusion
list that drifts from `AGENTS.md`, or count an iOS Simulator smoke test as completion of
`packet-m000`'s physical-device speech gate.

## Allowed Changes

1. Add `docs/PRODUCT_PLATFORM_AND_ASSET_BRIEF.md` to `CLAUDE.md`'s Required Reading list.
2. Clarify in the brief that the asset folder tree is a target structure that has not
   yet been created.
3. Point deferred-build guidance to the canonical `AGENTS.md` "Do Not Build Yet" list
   instead of maintaining a parallel list in the brief.
4. State that MR Clubhouse is a separate future Learning Treehouse concept unrelated to
   PreTenPlay (PTP).
5. Correct the Immediate Recommended Sequence so an iOS Simulator is a smoke-test tool,
   while `packet-m000` still requires physical-device speech and silent-mode proof.
6. Add this packet file. Update `docs/CHANGELOG.md` only after independent verification
   accepts every deliverable.

## Not Allowed

1. Any application, shared-model, package, configuration, dependency, or asset changes.
2. Creating the target asset folder tree or importing artwork.
3. Editing `AGENTS.md`, `packet-m000`, or any FounderOS vault file.
4. Changing the book-centered architecture, current product scope, or platform priority.
5. Treating Family Circle, Artifact Passport, MR Clubhouse, or any other deferred item
   as authorized implementation work.
6. Marking `packet-m000` Complete or weakening its physical-device verification gate.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Brief added as item 11 in `CLAUDE.md` Required Reading | Complete |
| 2 | Asset tree labeled as target/not yet created | Complete |
| 3 | Deferred-build guidance points to canonical `AGENTS.md` list | Complete |
| 4 | MR Clubhouse explicitly disambiguated from PTP | Complete |
| 5 | Simulator smoke test distinguished from physical-device M000 gate | Complete |
| 6 | Exact diff contains documentation only | Complete |

## Asset Check

Does this packet involve protected visual or brand assets?

- **No.** It documents a future intake structure only. No folders are created and no
  artwork, reference image, or production asset is imported.

## Rollback Plan

1. **What to restore:** `CLAUDE.md` and
   `docs/PRODUCT_PLATFORM_AND_ASSET_BRIEF.md`; remove this new packet file.
2. **From where:** restore the two existing files from commit `087b245`; the brief was
   untracked before this packet, so rollback may instead remove it if the entire brief
   is being abandoned.
3. **Verify by:** `git status --short` and `git diff --check` show no remaining changes
   from this packet; application and shared-model files remain untouched.

## Test Steps

1. Read the three changed documentation files in full and compare them to this packet.
2. Confirm `CLAUDE.md` Required Reading is numbered 1 through 11 and item 11 resolves to
   the brief.
3. Confirm the brief labels the asset tree as a future target and does not claim its
   folders currently exist.
4. Confirm the brief names `AGENTS.md` as the canonical "Do Not Build Yet" source and
   does not repeat a competing exclusion list.
5. Confirm the brief states MR Clubhouse is unrelated to PTP.
6. Confirm the Immediate Recommended Sequence reserves M000 completion for physical
   iPhone/iPad speech and silent-mode testing; simulator testing is smoke testing only.
7. Run `git diff --check`.
8. Run `git status --short` and confirm no source, asset, dependency, packet-m000, or
   vault file changed.
9. Obtain independent verification by someone other than the editor before changing
   this packet to `Complete` or adding its closeout to `docs/CHANGELOG.md`.

## Recommended Next Packet

No feature packet is opened by this documentation work. Continue from the mobile
packet sequence only; do not resume web feature work unless explicitly requested.

## Closeout

**Completed:** 2026-08-04

**Implementation:** `CLAUDE.md` now names the Product, Platform, and Asset Brief as
required reading. The brief labels the asset tree as future target structure, points
deferred scope back to `AGENTS.md`, distinguishes MR Clubhouse from PTP, and preserves
physical-device verification as the native interaction gate.

**Verification:** Documentation scope was inspected. `git diff --check` passed. No app
source, package, asset, or `packet-m000` status change was made by this docs packet.
