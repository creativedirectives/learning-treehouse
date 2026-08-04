# Packet: M000 Native Reading Slice

## Packet Header

Packet: `packet-m000-native-reading-slice`

Date created: 2026-08-01

Project: Learning Treehouse Mobile

Status: Complete

Depends on: Mobile Expo bootstrap exists; no prior mobile feature packet

Builder and verifier must be different agents.

## Amendment — Monorepo Consolidation (2026-08-01)

**Retroactive approval circumstance, recorded honestly rather than silently corrected.**
This packet's own header originally read "Draft — requires approval before
implementation." Implementation was completed before that approval — including
before the decision to build a mobile app at all had been brought to Dontavius or
recorded in the vault. Work stayed local and uncommitted pending review, which was
the right instinct, but the sequence was backwards. Full incident record:
`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\VAULT_INTEGRITY.md`.

Dontavius has since approved the mobile-primary pivot this packet was already built
against, which constitutes approval of this packet's scope. Status moves to
`Approved` on that basis — not to `Complete`, since the device speech test (Test
Step 5-6) and independent verification are still outstanding.

## Closeout — Completed 2026-08-03

`packet-m000` is Complete. Physical-device proof was confirmed through Expo Go on a
second phone: the app loaded, shelf opened, Mary reader opened, tapped words spoke
when silent mode was off, tapped words did not play audible speech when silent mode
was on, and speech worked again after silent mode was turned back off. This matches
the desired product behavior: tap-to-hear respects the device silent setting.

Independent code verification was performed by Codex from the repo files:

- `expo-speech` is the only speech dependency in `apps/mobile/package.json`.
- `apps/mobile/src/platform/speech.ts` is the only file importing `expo-speech`.
- The reader calls the speech adapter from `apps/mobile/src/features/reader/book-reader.tsx`.
- Search found no prohibited M000 features or APIs in the mobile/shared scope:
  microphone, recording, speech recognition, camera, contacts, storage, accounts,
  analytics, backend/networking, or broad permissions.
- `npx tsc --noEmit` in `apps/mobile` passed.
- `git diff --check` reported line-ending warnings only, with no whitespace errors.

Known limitation: the current repo already contains later local mobile work beyond
M000. This closeout verifies that M000's required shelf-to-reader-to-word-speech
behavior still works and that M000's prohibited feature boundaries remain intact in
the current repo state; it is not a closeout for later packets.

**Structural changes from consolidating the standalone `LearningTreehouseMobile`
repo into this repo as `apps/mobile/`, alongside `apps/web/` and a new shared
`packages/book-model/`:**

- Items 2 and 3 under Allowed Changes (creating local `src/domain/book.ts` and
  `src/domain/book.contract.ts` by copying the web contract) are **superseded**.
  There is no local copy. Both apps now import the identical contract and the
  identical Mary fixture from `@learning-treehouse/book-model` — this is a stronger
  fulfillment of Architecture Guardrail #1 than the original copy-based approach,
  since drift between two hand-copied contracts is no longer possible.
- Item 4 (creating `src/content/books.ts`) is likewise superseded — the fixture
  lives in the shared package as `packages/book-model/src/fixtures.ts`.
- All other Allowed Changes items (1, 5, 6, 7, 8) stand, at their new paths — see
  "Expected Files Touched" below, updated for the monorepo layout.
- A new `apps/mobile/metro.config.js` was added, not originally in scope, so Metro
  can resolve the shared workspace package. This is monorepo plumbing, not a
  product/feature change, and does not touch any of this packet's Not Allowed items.

The functional requirements, Not Allowed list, and Test Steps below are otherwise
unchanged and still govern this packet.

## Purpose

Create the first testable, native mobile vertical slice for Learning Treehouse:

`Shelf → Mary Had a Little Lamb → page-by-page reader → tap a vocabulary word → hear its pronunciation`

This packet proves that the existing book-centered content model works in an Expo
application on iOS and Android. It is a native-interface rebuild, not a conversion
of the Next.js UI or a change to the product architecture.

## Architecture Guardrails

1. The MVP remains book-centered. Shelf, reader, vocabulary words, and speech are
   all derived from one `Book` record; no independent content library is created.
2. Copy the platform-neutral `Book` contract and the local Mary fixture from the web
   prototype. Preserve all book/page/word/activity/reward ownership rules and the
   page-scoped `VoiceNote` identity (`bookId` + `pageId`).
3. This is a local, device-only slice. It has no backend, account, analytics,
   networking, or persistent progress.
4. Tap-to-hear uses device text-to-speech only. It does not record, listen to, score,
   retain, upload, or otherwise process a child's voice.
5. Do not add Clubhouse, Family Circle, museum/QR, camera, MR, reward, quiz, or
   word-recognition features in this packet.

## Allowed Changes

1. Modify `App.tsx` to compose the native shelf and reader flow in the existing
   TypeScript Expo application. A simple in-memory screen state is sufficient; do not
   add a navigation framework in this packet.
2. Create `src/domain/book.ts` by copying the platform-neutral book contract from
   `C:\Users\Dontavius\Claude projects\LearningTreehouse\src\types\book.ts`.
3. Create `src/domain/book.contract.ts` by copying/adapting the compile-time contract
   assertions from the web prototype without importing web framework code.
4. Create `src/content/books.ts` with the local Mary fixture and the existing
   reader-only shelf placeholders. It must remain a local TypeScript fixture and may
   not make fetches or include external media.
5. Create `src/features/shelf/book-shelf.tsx` for a native `FlatList`/pressable shelf
   that distinguishes Mary (`full`) from reader-only previews.
6. Create `src/features/reader/book-reader.tsx` for native one-page-at-a-time reading,
   bounded Previous/Next controls, and page-specific vocabulary word controls.
7. Create `src/platform/speech.ts` as the only adapter that imports `expo-speech`.
   It must expose a small word-speaking operation that stops a prior utterance before
   speaking the selected word. The reader must retain only temporary UI state for the
   active/speaking word.
8. Modify `package.json` and `package-lock.json` only through the Expo-compatible
   install of `expo-speech`.

## Permitted Dependency

- `expo-speech`, installed with `npx expo install expo-speech` so its version matches
  the installed Expo SDK.

`expo-speech` is native/device text-to-speech, not a speech-recognition or cloud
service dependency. Do not install audio, microphone, camera, storage, navigation,
authentication, analytics, or backend packages.

## Required Behavior

1. The initial screen shows a small shelf with Mary as readable and the other three
   books as reader-only previews.
2. Tapping Mary opens its six pages one at a time. Previous is disabled on page 1;
   Next is disabled on page 6.
3. The reader exposes only words owned by the visible page and already present in the
   Mary fixture.
4. Tapping a visible word highlights it while its word text is sent to
   `expo-speech`. A new tap interrupts any earlier word before speaking the new word.
5. If speech is unavailable or errors, the app keeps the reader usable and provides a
   truthful in-app status message; it must not claim that audio played.
6. Reader-only books cannot open a misleading interactive reader.
7. No microphone permission is requested on either platform.

## Expected Files Touched

Paths updated for the monorepo layout (see Amendment above). All paths relative to
the repo root.

- `apps/mobile/App.tsx`
- `apps/mobile/package.json`
- `apps/mobile/metro.config.js` — monorepo plumbing, added by the consolidation
- `apps/mobile/src/features/shelf/book-shelf.tsx`
- `apps/mobile/src/features/reader/book-reader.tsx`
- `apps/mobile/src/platform/speech.ts`
- `package-lock.json` — now a single root-level lockfile covering all workspaces

Superseded, no longer created (see Amendment): `src/domain/book.ts`,
`src/domain/book.contract.ts`, `src/content/books.ts`. The equivalent content now
lives in `packages/book-model/src/` and is imported, not duplicated.

No other files may be modified without a packet amendment.

## Explicitly Not Allowed

1. `expo-audio`, `MediaRecorder`, microphone permission, audio recording/playback,
   speech-to-text, pronunciation scoring, or saving audio files.
2. AsyncStorage, SecureStore, SQLite, local file persistence, cloud storage, APIs,
   fetch calls, telemetry, analytics, accounts, invitations, contacts, or Family Circle.
3. Camera, QR/museum cards, Artifact Passport implementation, Unity/MR work, or
   cross-app shared code/package setup.
4. New book text, illustrations, narration, licensed media, or changes to the book
   contract's ownership model.
5. App-store publishing, deployment, signing, production credentials, or changes to
   the existing web repository or Vercel project.

## Test Steps

1. Run `npx tsc --noEmit`; it passes with no TypeScript errors.
2. Run `npx expo start` and open the app in Expo Go or an Android/iOS simulator.
   Confirm the Shelf screen appears without a runtime error.
3. Open Mary; advance from page 1 through page 6; return to page 1. Confirm controls
   never cross the page bounds.
4. On each page, confirm displayed vocabulary controls belong only to that page in
   `packages/book-model/src/fixtures.ts`.
5. Tap each visible word on a physical Android/iOS device and confirm it invokes
   device speech, replaces any currently queued word, and the active-word highlight
   clears after completion or an error.
6. On an iOS physical device, test with the device out of silent mode. Record the
   result; iOS system silent mode can suppress text-to-speech output.
7. Attempt to open/select a reader-only shelf entry. Confirm the app labels it as a
   preview and does not render the interactive reader.
8. Inspect device permissions and the source diff: no microphone, camera, contacts,
   storage, network, account, analytics, or audio-recording code exists.
9. Run `git diff --check` and inspect the changed-file list. It contains only the
   expected files above.

## Verification Requirements

The verifier must be a different agent from the builder and must independently check:

- all copied contracts remain JSON-serializable and book-owned;
- `expo-speech` is the only added dependency;
- the speech adapter is the only file importing `expo-speech`;
- Mary has six readable pages, page words are page-scoped, and reader-only books remain
  non-interactive;
- no prohibited permissions, platform services, persistence, or networking were added;
- TypeScript and a native device/simulator smoke test pass.

## Rollback Plan

1. Revert the eventual M000 commit with `git revert <m000-commit>`.
2. Remove only the new `apps/mobile/src/` files/directories introduced by that revert
   and restore `apps/mobile/App.tsx` and `apps/mobile/package.json` to their prior
   bootstrap state. `packages/book-model` is shared with `apps/web` and is not part
   of this rollback.
3. Run `npm install` at the repo root, `npx tsc --noEmit` in `apps/mobile`, and
   `npx expo start` there to verify the clean Expo starter app still runs.

## Exit Criteria

This packet is complete only when the native shelf-to-reader-to-word-speech loop works
locally on at least one Android or iOS device/simulator, the listed tests pass, and an
independent verifier accepts the exact scope. It does not authorize publishing,
recording, syncing, or Family Circle work.

## Recommended Next Packet

`M001-local-progress-and-vocabulary-practice` only after M000 is independently
verified. Real recording requires a separate consent, permissions, retention, and
local-file-storage packet before implementation.
