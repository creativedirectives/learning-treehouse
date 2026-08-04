# Packet: M002 Fix SDK 54 Metro Resolution

## Packet Header

Packet: `packet-m002-fix-sdk54-metro-resolution`

Date created: 2026-08-01

Project: Learning Treehouse Mobile

Approved by: Dontavius

Approved on: 2026-08-01 (direct continuation of the requested SDK 54 Expo Go
compatibility work after a verified Metro resolution failure)

Depends on: `packet-m001-align-expo-go-sdk` complete.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Remove the obsolete hand-written monorepo Metro overrides and enable SDK 54's
autolinking-resolution protection so Metro bundles the SDK 54 mobile dependency set
instead of the web workspace's newer React Native dependency.

## Problem Being Solved

After M001 aligned the mobile package to Expo SDK 54, an iOS bundle attempt failed in
React Native 0.86 code from the monorepo root. The mobile app correctly declares React
Native 0.81. Expo Doctor also flagged the manual Metro overrides. Expo's SDK 52+
monorepo guidance says those overrides should be removed; SDK 54's
`experiments.autolinkingModuleResolution` option prevents this type of native-module
version mismatch.

## Allowed Changes

1. Replace `apps/mobile/metro.config.js` with the SDK 54 automatic monorepo Metro
   configuration from `expo/metro-config`, removing only manual `watchFolders` and
   `resolver.nodeModulesPaths` overrides.
2. Add `experiments.autolinkingModuleResolution: true` to `apps/mobile/app.json`.
3. Add this packet file.
4. Update `docs/CHANGELOG.md` only after an independent verifier accepts this packet,
   M001, and the relevant physical-device result.

## Not Allowed

1. Any changes to mobile feature source, shared book model, package manifest, lockfile,
   permissions, assets, web app, or FounderOS vault files.
2. Any package install, production build, EAS connection, or new platform surface.
3. Any change to `packet-m000` status or its physical-device speech requirements.

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Obsolete Metro overrides removed | Complete |
| 2 | SDK 54 autolinking resolution enabled | Complete |
| 3 | iOS bundle compiles without React Native 0.86 codegen failure | Complete |
| 4 | Expo Doctor no longer reports the manual Metro configuration warning | Complete |
| 5 | Physical Expo Go shelf-load test handed off | Complete |
| 6 | Independent verification accepted before closeout | Complete |

## Asset Check

- **No.** This packet changes only mobile configuration. No artwork or folders are
  created or touched.

## Rollback Plan

1. Restore `apps/mobile/metro.config.js` and `apps/mobile/app.json` from the commit
   immediately before this packet.
2. Remove this packet file if the correction is abandoned.
3. Run `npx expo start --clear` from `apps/mobile` and the mobile TypeScript check to
   confirm the prior configuration is restored.

## Test Steps

1. Start Expo with `npx expo start --clear`.
2. Request the iOS bundle and confirm the former React Native 0.86 `onModeChange`
   code-generation error does not appear.
3. Run `npx expo-doctor` and document any remaining monorepo-only warning separately.
4. Run `npx tsc --noEmit` from `apps/mobile` and `git diff --check` at repo root.
5. Open the SDK 54 project in Expo Go on the physical iPhone/iPad and confirm the
   shelf renders. M000's audible word and silent-mode test remains a separate required
   device result.
6. Obtain independent verification by an agent other than the builder before marking
   M001 or M002 Complete.

## Recommended Next Packet

Return to `packet-m000` physical-device speech proof and independent verification.

## Closeout

**Completed:** 2026-08-04

**Implementation:** The manual monorepo Metro resolver overrides were removed and
Expo SDK 54 autolinking module resolution was enabled in `apps/mobile/app.json`.

**Verification:** `npx expo-doctor` passed 18/18 checks. `npx tsc --noEmit` passed in
`apps/mobile`. Dontavius confirmed the mobile app loads in Expo Go on a physical
phone.

**Follow-up:** npm still hoisted incompatible React/React Native versions until the
workspace dependency layout was stabilized in M006.
