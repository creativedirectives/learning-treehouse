# Packet: M008 Build Read Together — Single-Device Toggle Mock

## Packet Header

Packet: `packet-m008-build-read-together-toggle-mock`

Date created: 2026-08-05

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-05 (FounderOS vault session, "scope packet-m008 as the single-device toggle version")

Depends on: `packet-m007` Complete.

Status: Approved

Builder and verifier must be different agents.

---

## Purpose

Prototype the "Read Together" experience — a parent and child alternating through a
book page by page, each confirming when they've finished a page, with a small visual
signal when the other side has responded — as a **single-device toggle simulation**.
Establish the swap-point architecture (a `ReadTogetherChannel` interface, backed by a
local mock implementation) so this becomes the real foundation for a future two-device
version, not a throwaway demo.

## Problem Being Solved

"Read Together" has been named in this project's core loop since 2026-07-28 but never
built beyond static reading and tap-to-hear. Before any real two-device transport gets
decided (a genuine safety/pairing decision, deferred to a future packet), Dontavius
wants to see and feel the actual interaction shape on one device first.

**Why single-device, not two real phones:** with zero networking, two separate physical
phones cannot actually see each other's state — some signal has to cross between them
for that, which is a real transport decision even at its smallest. A single-device
toggle (switching between "You" and "Partner" perspective on one phone) gets the full
interaction shape and feel with no networking of any kind. Full reasoning: FounderOS
vault session, 2026-08-05 (see `STATUS.md` / `BUILD_DIARY/2026-08-05.md`).

## Allowed Changes

1. New feature area: `apps/mobile/src/features/read-together/`.
2. Define a `ReadTogetherChannel` TypeScript interface — e.g. `sendPageComplete`,
   `onPartnerPageComplete`, `sendReaction`, `onPartnerReaction` — documented in-code as
   the intended swap point for a future real (two-device) implementation. No real
   implementation is written against this interface in this packet.
3. Implement `MockReadTogetherChannel` — a local-only implementation of that interface.
   No network calls of any kind; it simulates a partner's response purely from local
   state (e.g. the role toggle below), not from any external signal.
4. Build a Read Together screen:
   - Displays the current book page (reuse existing page content — no content-model
     changes).
   - A "Finished this page" action for the active role.
   - A role toggle — "You" / "Partner" — so one person can act out both sides on the
     same device.
   - A small visual indicator (a face/reaction) that appears once the mock channel
     reports the other role has also confirmed the page.
   - Advancing to the next page requires both roles to have confirmed (toggled through
     and each pressed "Finished this page").
5. Entry point from the existing Parent dashboard (new option, alongside "Start
   reading" / "Practice spelling").
6. Update this packet and repo changelog once verified.

## Not Allowed

1. Any real networking — no WiFi discovery, Bluetooth, sockets, or cloud calls of any
   kind. This is a local-only mock; the two-device version is explicitly a future,
   separately-scoped packet.
2. Any account, pairing code, invite flow, or device-identity mechanism.
3. Any microphone/audio recording. Reusing the existing device-speech ("hear word")
   adapter for read-aloud is fine if it comes up; recording is not in scope.
4. Any persistence beyond the current in-memory session — nothing survives closing the
   app, same as every other local-only screen in this app so far.
5. New dependencies. The "face" indicator is a plain text/emoji character or simple
   shape — no image asset import.
6. Changes to web app source.
7. Building the real two-device transport itself — deferred to a future packet, only
   after this mock is seen and approved.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | `ReadTogetherChannel` interface defined and documented as the future swap point | Not started |
| 2 | `MockReadTogetherChannel` implementation — local-only, no network | Not started |
| 3 | Read Together screen: current page, "Finished this page" action, You/Partner role toggle | Not started |
| 4 | Partner-reaction indicator appears once the mock channel reports the other role confirmed | Not started |
| 5 | Advancing to the next page requires both roles confirmed | Not started |
| 6 | Entry point from Parent dashboard | Not started |
| 7 | No persistence, network, account, mic, or new dependency added | Not started |
| 8 | Mobile TypeScript and whitespace checks pass | Not started |
| 9 | Physical Expo Go verification of the full toggle flow | Not started |

## Asset Check

- **No.** The partner-reaction indicator is a plain text/emoji character or a simple
  shape built from existing style primitives — no artwork or image assets imported.

## Rollback Plan

1. Restore: remove `apps/mobile/src/features/read-together/` entirely; restore
   `apps/mobile/src/features/parent/parent-guide.tsx` (entry-point addition) to its
   state before this packet.
2. From: last commit before this packet begins.
3. Verify: `cd apps/mobile && npx tsc --noEmit` passes; Parent dashboard returns to its
   prior state (Start reading / Practice spelling only).

## Test Steps

1. `cd apps/mobile && npx tsc --noEmit`.
2. `git diff --check`.
3. Search the touched mobile scope for prohibited APIs/features (network, storage,
   account, microphone).
4. Open Expo Go on a physical phone.
5. From Parent dashboard, open Read Together.
6. Confirm the current page displays with a "Finished this page" action for the active
   role.
7. Tap Finished as "You," confirm the screen reflects a waiting/pending state for the
   other role.
8. Toggle to "Partner," tap Finished — confirm the partner-reaction indicator appears
   and the page is now able to advance.
9. Confirm "Next page" only becomes available once both roles have confirmed, and
   resets per-page on the following page.
10. Close and reopen the app — confirm nothing persisted (starts over at page 1, no
    saved role state).

## Recommended Next Packet

`packet-m009` — real two-device signal (the "what minimal local signal actually
crosses between two real phones" decision) — only after this mock is seen and
approved by Dontavius. That packet should also decide whether any lightweight local
transport (e.g. same-WiFi only, no accounts) is acceptable, or whether cross-device
Read Together should wait for the full Family Circle decision instead.
