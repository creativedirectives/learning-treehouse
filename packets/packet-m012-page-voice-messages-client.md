# Packet: M012 Page Voice Messages — Client

## Packet Header

Packet: `packet-m012-page-voice-messages-client`

Date created: 2026-08-19

Project: Learning Treehouse Mobile

Approved by: [pending — not yet Approved]

Approved on: [pending]

Depends on: `packet-m011-page-voice-messages-relay-extension` (Status:
Complete, 2026-08-18) — uses its `bookId`/`pageIndex` upload params and
`GET /api/audio/pending/:deviceId` discovery endpoint directly.

Status: **Draft**

Builder and verifier must be different agents, per `.agents/lt.md`'s "still
binding" category — this is the microphone/recording feature itself, the
category that has required its own explicit authorized packet since the
original `packet-m008` incident.

**Scoped by:** this session (repo-scoped), 2026-08-19, per Dontavius's direct
instruction to build the functionality now rather than wait for UI ideation
(happening separately) to land first. This packet builds working, usable
screens in the app's existing plain style — record button, play indicator —
not final visual design. Restyling once UI ideas land is a separate, later
pass, not blocked by this packet and not this packet's job.

---

## Purpose

Build the client side of the corrected feature: a circle member records a
voice message for a specific page of a specific book; the kid's device
discovers it (a play indicator on that page) and plays it once, then it's
gone — using the endpoints `packet-m011` already built and deployed.

## Not Allowed

1. Final visual/branded design — ships in the app's existing plain
   functional style. Restyling from UI ideation is separate, later work.
2. Pause/rewind/replay of any kind — confirmed v1 scope, single
   play-through only, matching what `packet-m011`'s server side (delete-on-
   read) already enforces.
3. A dedicated "manage my circle" / roster UI (invite multiple named people,
   see who's connected, remove one). The existing `connect-screen.tsx`
   pairing flow (one invite/redeem at a time) is reused as-is — a device can
   already have multiple partners at the data layer (`packet-m009`), this
   packet doesn't add a view for seeing or managing all of them at once.
4. Any change to `apps/relay/**` — `packet-m011` is Complete and frozen.
5. Modifying, reusing, or deleting the retired live-sync files
   (`real-channel.ts`, `real-read-together.tsx`). Left in place, untouched;
   cleanup is a separate decision.
6. Widening microphone use beyond this one recording flow, or any
   background/always-on audio capability.

## Deliverables

1. **`apps/mobile/src/features/read-together/audio-message-client.ts`**
   (new) — three functions, all requiring `serverUrl`, `token`, and the
   relevant device IDs (mirrors `real-channel.ts`'s auth-header pattern):
   - `fetchPendingForBook(serverUrl, deviceId, token, bookId)` — calls
     `GET /api/audio/pending/:deviceId?bookId=...`, returns the list.
   - `uploadPageRecording(serverUrl, { fromDeviceId, toDeviceId, token,
     bookId, pageIndex, fileUri })` — reads the local recorded file and
     `POST`s it to `/api/audio/upload` with the required query params.
   - `playPendingMessage(serverUrl, messageId, token)` — `GET`s
     `/api/audio/:messageId`, plays the returned bytes once via the audio
     package resolved in Deliverable 5, resolves when playback finishes.
2. **`apps/mobile/src/features/read-together/page-recorder.tsx`** (new) —
   screen for a circle member: shows which book/page they're recording for
   (the paired partner's current book — reuses `pairedCode`/partner state
   already flowing through `App.tsx` from the existing connect flow), a
   record button (start/stop, standard Expo microphone permission request
   on first use — denial shows a plain explanatory message, doesn't crash
   or silently no-op), a review-and-send step, calls
   `uploadPageRecording` on send.
3. **`apps/mobile/src/features/reader/book-reader.tsx`** (edit) — on
   opening a book (and on page change), calls `fetchPendingForBook` for the
   current `(deviceId, book.id)`; if the current page has a pending
   recording, shows a play button/indicator on that page; tapping it calls
   `playPendingMessage` and removes the indicator locally once playback
   finishes (the relay already deleted it server-side on that same read).
4. **`apps/mobile/App.tsx`** (edit) — a new screen mode for
   `page-recorder.tsx`, reachable from the existing paired/connected state
   (a circle member who's already paired can choose to record for the book
   their partner is reading), reusing the `deviceId`/`token`/`serverUrl`
   state already present from the `packet-m010` pairing wiring.
5. **`apps/mobile/package.json`** (edit) — adds an audio recording/playback
   package. Exact package (`expo-audio` vs. the older `expo-av`) resolved
   via `npx expo install` at implementation time, same as
   `expo-secure-store` was for `packet-m010` — not guessed in this scope-
   fill, since Expo's own resolver picks what's actually compatible with
   this project's pinned SDK 54.

## Allowed Changes

1. `apps/mobile/src/features/read-together/audio-message-client.ts` (new)
2. `apps/mobile/src/features/read-together/page-recorder.tsx` (new)
3. `apps/mobile/src/features/reader/book-reader.tsx` (edit)
4. `apps/mobile/App.tsx` (edit)
5. `apps/mobile/package.json`, `apps/mobile/app.json` (edit — the latter
   only if the resolved audio package needs a config plugin, same mechanical
   pattern as `expo-secure-store` did)
6. `package-lock.json` (root — same single-workspace-lockfile reason as
   every prior packet)

No file under `apps/relay/` is touched.

## Asset Check

No new visual/brand assets — this packet ships in the existing plain style;
restyling from UI ideation is a separate pass.

## Rollback Plan

1. **What to restore:** `book-reader.tsx` and `App.tsx` to their pre-packet
   state; delete the two new files; drop the new dependency from
   `package.json`/`app.json`.
2. **From where:** `git revert` of this packet's commit(s).
3. **Verify by:** `cd apps/mobile && npx tsc --noEmit` passes; the existing
   solo reading flow (word-tap speech, spelling practice link) is unaffected;
   `apps/relay/` shows zero diff throughout.

## Test Steps

1. `cd apps/mobile && npx tsc --noEmit` — no errors.
2. `cd apps/mobile && npx expo-doctor` — no new failures beyond any
   pre-existing, already-disclosed drift.
3. Manual two-device pass (same requirement as `packet-m010`'s open item,
   still needs a human with real devices): pair two devices via the
   existing connect flow; from device A, record a message for a page in
   device B's current book; confirm device B shows a play indicator on
   that exact page; play it; confirm it plays once and the indicator is
   gone afterward (both locally and confirmed via a fresh
   `GET /api/audio/pending/:deviceId` call showing it's no longer listed).
4. Confirm microphone permission denial is handled gracefully (deny the
   prompt, confirm a clear message appears, no crash).
5. Confirm no file outside the Allowed Changes list shows a diff.
6. Independent verification (fresh agent) before `Complete` — same
   discipline as every prior packet in this sequence.

## Recommended Next Packet

Restyle `page-recorder.tsx` and `book-reader.tsx`'s discovery/playback UI
once ideas come back from the separate UI ideation chat. Also a candidate
follow-up: the retention-window choice (global default vs. per-recording
vs. parent-configurable) Dontavius raised but explicitly deferred.
