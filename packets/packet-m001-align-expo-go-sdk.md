# Packet: M001 Expo Go SDK 54 Compatibility

## Packet Header

Packet: `packet-m001-align-expo-go-sdk`

Date created: 2026-08-01

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-01 (direct request to make the current mobile slice testable in
the iPhone App Store version of Expo Go)

Depends on: `packet-m000-native-reading-slice` complete.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Align the mobile app from Expo SDK 57 to Expo SDK 54 so it can run in the current
App Store version of Expo Go on a physical iPhone or iPad.

## Problem Being Solved

The installed Expo Go client reports support through SDK 54. The current mobile app
declares Expo SDK 57 and its matching React/React Native packages, so Expo Go cannot
load it even when local-network access and the Metro server are working.

## Allowed Changes

1. Update `apps/mobile/package.json` only as required to align Expo, Expo modules,
   React, React Native, and type packages to the SDK 54 compatibility set selected by
   the official Expo installer.
2. Update the root `package-lock.json` through npm's normal workspace install process.
3. Add this packet file.
4. Update `docs/CHANGELOG.md` only after an independent verifier accepts the exact
   dependency diff and the physical Expo Go test is recorded.

## Not Allowed

1. Any change to `App.tsx`, `src/`, shared book model, book fixture, speech adapter,
   app behavior, permissions, or visual assets.
2. Any new package beyond versions Expo identifies as necessary for SDK 54 alignment.
3. Any change to `app.json`, Metro configuration, workspace configuration, or the web
   app unless Expo Doctor identifies a specific SDK 54 incompatibility and a follow-up
   packet authorizes it.
4. Any accounts, EAS project connection, production build, publishing, cloud service,
   analytics, microphone, recording, or other feature work.
5. Marking `packet-m000` Complete without its own audible physical-device speech proof
   and independent verification.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Mobile package manifest aligned to Expo SDK 54 | Complete |
| 2 | Root lockfile aligned with the approved manifest | Complete |
| 3 | Expo dependency validation passes | Complete |
| 4 | Mobile TypeScript check passes | Complete |
| 5 | Metro starts and offers the SDK 54 project to Expo Go | Complete |
| 6 | Physical iPhone/iPad loads the shelf and reports audible word-speech result | Complete |
| 7 | Independent verifier accepts exact scope before packet closeout | Complete |

## Asset Check

Does this packet involve protected visual or brand assets?

- **No.** This is dependency alignment only. No asset is created, imported, moved, or
  transformed.

## Rollback Plan

1. **What to restore:** `apps/mobile/package.json` and the root `package-lock.json`.
   Remove this packet file if the compatibility path is abandoned.
2. **From where:** revert the dedicated compatibility commit once it exists; until then,
   restore the two existing files from commit `087b245`.
3. **Verify by:** `npm install` at the repo root followed by
   `cd apps/mobile && npx tsc --noEmit`; the prior SDK 57 dependency tree is restored.

## Test Steps

1. Run the official Expo alignment process targeting SDK 54:
   `npm install expo@^54.0.0 --workspace apps/mobile`, then
   `npx expo install --fix` from `apps/mobile`.
2. Run `npx expo-doctor` from `apps/mobile`; resolve only SDK 54 dependency-alignment
   findings within Allowed Changes.
3. Run `npx tsc --noEmit` from `apps/mobile`.
4. Run `git diff --check` and inspect `git diff -- apps/mobile/package.json
   package-lock.json` for dependency-only scope.
5. Start Metro in LAN mode and confirm it advertises the SDK 54 app without a version
   mismatch.
6. On the iPhone/iPad with Expo Go, open the project and confirm the shelf renders.
7. Select Mary, tap multiple words, and record whether each word is audible. Test iOS
   with silent mode off; this is still required by M000 Test Steps 5–6.
8. An agent other than the builder verifies the dependency diff, test output, and M000
   device-test record before this packet or M000 is marked Complete.

## Recommended Next Packet

After M000's physical proof and independent verification, continue the mobile packet
sequence. This compatibility packet occupies the previously proposed `packet-m001`
slot; deferred feature work moves only when it is actually scoped.

## Closeout

**Completed:** 2026-08-04

**Implementation:** The mobile workspace was aligned to the Expo SDK 54 dependency
set required by the current Expo Go app. The root lockfile was regenerated through npm
workspace install.

**Verification:** `npx expo-doctor` passed 18/18 checks. `npx tsc --noEmit` passed in
`apps/mobile`. Dontavius confirmed the SDK 54 project loads on a physical phone through
Expo Go and that tapped-word speech works when silent mode is off.

**Follow-up:** The monorepo still needed Metro/autolinking and dependency-layout
stabilization; those corrections are recorded separately in M002 and M006.
