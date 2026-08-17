# Packet: M010 Relay Contract Tests and Client Resilience

## Packet Header

Packet: `packet-m010-relay-contract-tests-and-client-resilience`

Date created: 2026-08-16

Project: Learning Treehouse Mobile

Approved by: Dontavius (this chat, explicit "approved" — 2026-08-16)

Approved on: 2026-08-16

Depends on: `packet-m009-harden-relay-foundation` (Status: Complete, 2026-08-16) —
this packet wires the mobile client to the real, deployed relay `packet-m009`
built. Per `DECISION_LOG.md`'s `audit-001` renumbering, this is the packet
immediately after `m009` in the sequence.

Status: **In Progress**

Builder and verifier must be different agents, per `packet-m009`'s own precedent
and `.agents/lt.md`'s "still binding" category (this packet is real networking +
persistence — a client talking to a real backend, storing a real credential — the
same category that made `m009` require independent verification before
`Complete`).

**Scoped by:** this session (repo-scoped, same session that built and deployed
`packet-m009`), 2026-08-16. Unlike `m009`, no separate vault-drafted shell exists
for this packet — the architecture it implements (the `m009` endpoint contracts)
is already Decided, not a new "still binding" decision, so per the light tier's
default (`DECISION_LOG.md` → "LT runs on a light governance tier": "Codex writes
the whole packet — shell and technical scope in one pass") a single pass is
appropriate here. Flagging the reasoning explicitly rather than silently assuming
it, since `m009`'s split was itself a deliberate, non-default exception.

---

## Purpose

Replace the mobile client's Read Together code — written against the frozen
`apps/relay/server.js` prototype's unauthenticated endpoint shapes — with real
calls to the deployed `packet-m009` relay: authenticated requests, secure token
storage, and resilience against the transient network failures a real deployed
backend actually has (unlike a same-WiFi dev server, which either works or is
obviously down).

## Problem Being Solved

`apps/mobile/src/features/read-together/real-channel.ts` and
`apps/mobile/src/features/read-together/connect-screen.tsx` currently call
unauthenticated, no-`/api`-prefix paths (`/invites`, `/pairings`,
`/pairings/:deviceId`, `/events`, `/events/:deviceId`) — the shape of the frozen
`server.js` reference, not the real deployed relay. They cannot talk to
`learning-treehouse-relay.vercel.app` at all as written: every `packet-m009`
endpoint that matters here now requires an `Authorization: Bearer <token>` header
the client never sends, and the paths themselves changed (`/api/*` prefix, Vercel
Functions convention). Additionally, the client has no concept of the per-device
token at all — nowhere to receive it, store it, or attach it to a request.

Separately, `real-channel.ts`'s poll loop retries on a fixed 2-second interval
forever, silently swallowing every fetch error with no backoff and no way for the
UI to know the connection has actually failed (vs. a normal empty poll tick) —
fine for a same-WiFi dev server that's either up or obviously down, not
appropriate for a real deployed backend over a real network.

## Allowed Changes

1. `apps/mobile/src/features/read-together/token-store.ts` (new) —
   `expo-secure-store` wrapper for the device's auth token. Mirrors
   `device-id.ts`'s shape (`getStoredToken`/`setStoredToken`/`clearStoredToken`)
   but uses `expo-secure-store`, **not** `AsyncStorage` — this is the one
   `DECISION_LOG.md` requirement (`AsyncStorage` may hold the device ID, never
   the token) this whole packet exists to satisfy on the client side.
2. `apps/mobile/src/features/read-together/real-channel.ts` (edit) —
   `/events`/`/events/:deviceId` → `/api/events`/`/api/events/:deviceId`; add
   `Authorization: Bearer <token>` to both; add exponential backoff to the poll
   loop; add a fatal-auth-error path (401 stops polling and notifies the caller,
   rather than retrying forever against a dead token); add a `revoke(partnerId)`
   method calling `POST /api/connections/revoke`.
3. `apps/mobile/src/features/read-together/connect-screen.tsx` (edit) —
   `/invites`/`/pairings`/`/pairings/:deviceId` → `/api/invites`/`/api/pairings`/
   `/api/pairings/:deviceId`; capture `token` from both the redeemer response
   (`POST /api/pairings`) and the inviter's poll response
   (`GET /api/pairings/:deviceId`); store it via `token-store.ts` when non-null;
   pass it forward through `onPaired`.
4. `apps/mobile/App.tsx` (edit) — `handlePaired` resolves the effective token
   (the freshly received one, or the previously-stored one via `token-store.ts`
   when the pairing response returned `null`) before constructing the real
   channel; wires the channel's fatal-auth-error callback to clear the stored
   token and bounce back to the connect screen with a message; wires a
   revoke-confirmed callback to clear local pairing state and return to the
   shelf.
5. `apps/mobile/src/features/read-together/real-read-together.tsx` (edit) — adds
   a "Remove connection" action (client-side half of `DECISION_LOG.md`'s v1
   revocation requirement — `packet-m009` built the server-side support for
   this), behind a confirmation dialog (`Alert.alert`, both-sides delete is
   already correct on the server), wired to `real-channel.ts`'s new `revoke()`.
6. `apps/mobile/package.json` (edit) — add `expo-secure-store`. Exact version
   deliberately not pinned in this packet — resolve via
   `npx expo install expo-secure-store` at implementation time so it matches
   this project's pinned Expo SDK 54, rather than guessing a version number now
   (the package's own version numbers track newer SDKs than this project uses).

## Not Allowed

1. Modifying any file under `apps/relay/` — that's `packet-m009`, Complete and
   frozen. If a new relay bug surfaces during this packet's work, it gets its own
   correction packet, not a silent edit here.
2. Screen unification (deciding when a user sees the mock vs. real Read Together
   flow) — `packet-m011`.
3. The voice-message record/send/playback feature itself — `packet-m012`.
4. Widening or changing the relay's endpoint contracts to make the client easier
   to write — the client conforms to what `packet-m009` already deployed, not the
   other way around.
5. Any microphone/recording capability — unrelated to this packet, still gated
   per `AGENTS.md`.
6. Touching `apps/relay/server.js` (frozen reference, per `packet-m009`) or any
   FounderOS vault file (`AGENTS.md` → AI Should Never Do Automatically).

## Deliverables

1. **`token-store.ts`**: `getStoredToken(): Promise<string | null>`,
   `setStoredToken(token: string): Promise<void>`,
   `clearStoredToken(): Promise<void>`, all backed by `expo-secure-store`'s
   `getItemAsync`/`setItemAsync`/`deleteItemAsync`.
2. **`real-channel.ts`**:
   - `RealChannelOptions` gains a required `token: string`.
   - Both the `POST /api/events` and `GET /api/events/:deviceId` calls carry
     `Authorization: Bearer ${options.token}`.
   - `pollOnce()` tracks consecutive failures (network error, non-2xx except
     401, or non-JSON response) and reports success/failure to the poll loop.
   - `pollLoop()` uses exponential backoff on consecutive failure: base 2000 ms,
     ×2 per consecutive failure, capped at 30000 ms; resets to 2000 ms on the
     next success.
   - A `GET /api/events/:deviceId` response of `401` is treated as fatal (bad or
     revoked token, not a transient network blip): polling stops, and a new
     `onAuthError` callback (passed in via `RealChannelOptions`) fires exactly
     once so the UI can react — no infinite retry against a dead credential.
   - New `revoke(partnerId): Promise<boolean>` — calls
     `POST /api/connections/revoke` with the token and `{ deviceId, partnerId }`,
     returns whether it succeeded.
3. **`connect-screen.tsx`**: both pairing paths (get-a-code / enter-a-code) read
   `token` from their respective relay responses and call
   `token-store.setStoredToken()` when it's non-null; `onPaired` gains a
   `token: string | null` field (null meaning "use whatever's already stored").
4. **`App.tsx`**: `handlePaired` becomes async — resolves
   `effectiveToken = paired.token ?? (await getStoredToken())`; if somehow still
   null (shouldn't happen in the normal flow — defensive only), bounces back to
   the connect screen with an error message instead of constructing a channel
   with no credential; passes `effectiveToken` into
   `createRealReadTogetherChannel`; wires `onAuthError` to
   `clearStoredToken()` + return to `connect` screen with a "reconnect" message;
   wires a new `onRevoked` callback (from `RealReadTogether`) to clear
   `realChannel`/`pairedCode` state and return to the shelf.
5. **`real-read-together.tsx`**: a "Remove connection" button, `Alert.alert`
   confirmation ("Remove this connection? Neither device will be able to send or
   receive anything from the other." / Cancel / Remove), calling
   `channel.revoke(partnerId)` (partner id needs to reach this component — either
   passed as a new prop from `App.tsx`, since `handlePaired` already has it, or
   read back off the channel if `real-channel.ts` exposes it) then invoking
   `onRevoked`.

## Asset Check

No. Client logic and one new secure-storage dependency; no visual or brand
assets involved beyond a standard confirmation dialog using existing app copy
conventions.

## Rollback Plan

1. **What to restore:** `apps/mobile/src/features/read-together/real-channel.ts`,
   `connect-screen.tsx`, `real-read-together.tsx`, and `apps/mobile/App.tsx` to
   their pre-packet state; `apps/mobile/package.json` to drop the
   `expo-secure-store` dependency.
2. **From where:** last commit before this packet's implementation commit(s) —
   `git revert` of those commits, or `git checkout <pre-packet-sha> --
   <paths above>`.
3. **Verify by:** `cd apps/mobile && npx tsc --noEmit` passes; the mock Read
   Together flow (`ReadTogether`/`read-together.tsx`, untouched by this packet)
   still works unaffected; `apps/relay/` shows no diff (this packet never touches
   it).

## Test Steps

1. `cd apps/mobile && npx tsc --noEmit` — no errors. **Run 2026-08-16 — PASS, no
   output.**
2. `cd apps/mobile && npx expo-doctor` — no new failures introduced. **Run
   2026-08-16 — 17/18 PASS. The 1 failure (`expo` patch version 54.0.36 vs
   54.0.37 expected) is pre-existing drift unrelated to this packet — this
   packet never touches the `expo` package's own version pin, only adds
   `expo-secure-store` (resolved via `npx expo install`, itself SDK-54
   compatible at `~15.0.8`). Not fixed here — out of this packet's scope.**

**Allowed Changes addendum:** `npx expo install expo-secure-store` also
mechanically added `apps/mobile/app.json`'s `plugins: ["expo-secure-store"]` —
required for the native module's config plugin to register, not a separate
design decision. `package-lock.json` (root) also shows a diff for the same
reason `packet-m009`'s did (single npm-workspace lockfile). Neither was in the
original Allowed Changes list; both are noted here rather than silently
included, same disclosure pattern as `packet-m009`.
3. Manual device/simulator pass (two devices or two Expo Go instances, mirroring
   how `packet-m008`'s original mock was proven): full pairing flow — get a code
   on device A, redeem on device B, confirm both devices receive a real,
   independent token; confirm `expo-secure-store` (not `AsyncStorage`) holds it —
   inspectable via a debug log during this test only, never shipped.
4. Kill the relay's reachability mid-session (e.g., toggle airplane mode on one
   device briefly) and confirm the poll loop backs off rather than hammering the
   dead endpoint, then recovers and resets to the fast interval once
   connectivity returns.
5. Manually invalidate a token (e.g., call the revoke endpoint from a third
   party / curl, matching how `packet-m009`'s own verification did this) and
   confirm the client's `onAuthError` path fires — no crash, no infinite retry,
   user is returned to the connect screen with a clear message.
6. Confirm "Remove connection" — trigger it from either device, confirm both
   sides lose the pairing (matches `packet-m009`'s server-side revoke behavior,
   already independently verified), confirm the confirmation dialog actually
   blocks accidental single-tap removal.
7. Confirm no file outside the Allowed Changes list shows a diff
   (`git status`/`git diff --stat`), and specifically that `apps/relay/` is
   untouched.

## Recommended Next Packet

`packet-m011` — unify the mock and real Read Together screens behind the
`ReadTogetherChannel` interface (per `DECISION_LOG.md`'s `audit-001`
renumbering), once this packet is Approved, built, and independently verified.
