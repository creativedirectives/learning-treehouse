# Packet: M006 Stabilize Monorepo Dependency Layout

## Packet Header

Packet: `packet-m006-stabilize-monorepo-dependency-layout`

Date created: 2026-08-04

Project: Learning Treehouse Monorepo

Approved by: Dontavius

Approved on: 2026-08-04 (direct request to clean up the repo and get it stable)

Depends on: M001 and M002 dependency/Metro stabilization work.

Status: Complete

Builder and verifier must be different agents.

---

## Purpose

Make npm install, Expo Doctor, mobile TypeScript, web lint, and web production build
agree on one stable React/React Native layout inside the monorepo.

## Problem Being Solved

M001 and M002 fixed the mobile SDK target and Metro configuration, but npm still
hoisted incompatible React and React Native versions across the root, web, and mobile
workspaces. That left Expo Doctor failing and made the repo unstable even though each
individual change was directionally correct.

## Allowed Changes

1. Add a root `.npmrc` that uses nested workspace installs and legacy peer resolution.
2. Add root npm overrides for the Expo SDK 54 React and React Native versions.
3. Align the web workspace React and React DOM versions to the same React version used
   by the mobile SDK 54 dependency set.
4. Regenerate `package-lock.json` through `npm install`.
5. Update packet and changelog documentation for this stabilization.

## Not Allowed

1. App feature work, visual redesign, new screens, or asset changes.
2. New dependencies unrelated to React/React Native version stabilization.
3. Accounts, cloud, analytics, microphone, recording, AI services, or data persistence.
4. Vercel configuration changes or public deployment work.

## Deliverables and Tests

1. `.npmrc` records the npm install strategy needed for this monorepo.
2. Root overrides pin React to `19.1.0` and React Native to `0.81.5`.
3. Web React and React DOM are aligned to `19.1.0`.
4. `npm install` completes and refreshes the root lockfile.
5. `npx expo-doctor` passes from `apps/mobile`.
6. `npx tsc --noEmit` passes from `apps/mobile`.
7. `npx tsc --noEmit` passes from `packages/book-model`.
8. `npm run lint:web` and `npm run build:web` pass from the repo root.
9. `git diff --check` passes.

## Closeout

**Completed:** 2026-08-04

**Implementation:** Added `.npmrc`, root React/React Native overrides, root React dev
dependencies, web React alignment, and the regenerated lockfile.

**Verification:** `npx expo-doctor` passed 18/18 checks. Mobile TypeScript,
book-model TypeScript, web lint, web production build, and `git diff --check` all
passed.

**Deferred:** Web deployment protection and Vercel root-directory maintenance remain
separate web operations. No deployment occurred.
