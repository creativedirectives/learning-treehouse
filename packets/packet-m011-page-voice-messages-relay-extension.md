# Packet: M011 Page Voice Messages — Relay Extension

## Packet Header

Packet: `packet-m011-page-voice-messages-relay-extension`

Date created: 2026-08-18

Project: Learning Treehouse Mobile

Approved by: Dontavius (this chat, explicit "approved" — 2026-08-18)

Approved on: 2026-08-18

Depends on: `packet-m009-harden-relay-foundation` (Status: Complete, 2026-08-16) —
extends its audio-message plumbing (Upstash Redis metadata, private Vercel Blob,
per-device auth tokens) rather than replacing it.

**Supersedes the previously-named `packet-m011`** ("unify mock/real Read
Together screens"), which is retired per the 2026-08-16/2026-08-18
product-direction correction recorded in memory and (pending) `DECISION_LOG.md`:
the live, synchronous, both-devices-online, confirm-every-page flow that
`packet-m008`/`m010` built is **not** the target feature and is not being
carried forward into new client work. This packet number is reused for the
feature that actually is the target, to avoid a confusing `m011`/`m011b` split.

Status: **In Progress**

Builder and verifier must be different agents, per `.agents/lt.md`'s "still
binding" category — this touches persistence (the audio metadata schema) and is
the direct foundation for a microphone/recording feature, even though this
specific packet contains no client-side recording code itself.

**Scoped by:** this session (repo-scoped), 2026-08-18, following a multi-message
product-direction conversation with Dontavius that corrected the target feature
away from live dual-device sync toward asynchronous, page-attached, ephemeral
voice recordings from a one-to-many family circle. Full detail of that
correction — what prompted it, what carries forward from `packet-m009`, and the
two items Dontavius explicitly confirmed (live-sync flow superseded; family
circle is one-to-many, not one-to-one) — is recorded in this session's memory
(`project_learningtreehouse.md`) and should already be reflected in
`DECISION_LOG.md` by the vault session; this packet does not re-litigate that
decision, it builds against it.

---

## Purpose

Extend the deployed `packet-m009` relay so a voice recording can be attached to
a **specific page of a specific book**, and so a recipient device can
**discover** what's waiting for it — the two capabilities the corrected feature
needs that the original relay (built for a generic two-device signal, not a
page-attached, browsable message) doesn't have yet.

## Problem Being Solved

`packet-m009`'s audio endpoints (`POST /api/audio/upload`, `GET
/api/audio/:messageId`) already move bytes securely between two paired devices,
with private Blob storage and delete-on-read — but the metadata has no concept
of *which book* or *which page* a recording belongs to, and there is no way for
a device to ask "what's waiting for me" — the existing design assumed the
caller already knows a specific `messageId` (e.g., from a live push-style
signal), which doesn't fit an asynchronous, browse-a-book, "does this page have
something" interaction at all.

## Not Allowed

1. Any client-side (`apps/mobile/**`) code — recording UI, playback UI,
   discovery indicators, microphone permission handling. That's the next
   packet, depends on this one, and needs its own explicit authorization per
   `.agents/lt.md`'s "still binding" category for microphone/recording.
2. Deleting or retiring `packet-m010`'s code (`real-channel.ts`,
   `real-read-together.tsx`, `connect-screen.tsx`, `token-store.ts`). Superseded
   in purpose, but cleanup/removal is a separate decision, not this packet's.
3. Any change to the pairing, invite, or token system itself — `packet-m009`
   is Complete and frozen; this packet only adds fields to the audio metadata
   it already owns.
4. Pause/rewind/replay support of any kind — confirmed out of scope for the
   whole feature's v1, not just this packet.
5. Deciding the final retention-window number — sets a real, disclosed default
   (see Deliverables) but the exact value remains Dontavius's call, changeable
   as a single env var on the deployed project, not a code change.

## Deliverables

1. **Audio metadata gains `bookId` and `pageIndex`.** `setAudioMeta`/
   `getAudioMeta` in `apps/relay/lib/store.js` are shape-agnostic (store/return
   whatever object is passed) — no function-signature change needed there. The
   new fields (`bookId: string`, `pageIndex: number`, `createdAt: number` epoch
   ms) are added by the caller, `apps/relay/api/audio/upload.js`. Existing
   fields (`fromDeviceId`, `toDeviceId`, `blobUrl`, `expiresAt`, `delivered`)
   unchanged.
2. **`POST /api/audio/upload`** (edit) — now requires `bookId` and `pageIndex`
   as additional query params alongside the existing `fromDeviceId`/
   `toDeviceId`; 400s if `pageIndex` isn't a non-negative integer or `bookId`
   is empty. Everything else (auth, pairing check, 5 MB cap, private Blob
   write) unchanged.
3. **New: `GET /api/audio/pending/:deviceId`** — requires `Authorization` for
   that deviceId (same pattern as `GET /api/events/:deviceId`). Returns
   `{ pending: [{ messageId, fromDeviceId, bookId, pageIndex, createdAt,
   expiresAt }] }` — metadata only, no audio bytes, so a client can cheaply
   ask "what's waiting for me" and show per-page indicators before committing
   to a download. Optional `?bookId=` query param filters to one book
   server-side. Built on the existing `audio-pending:{toDeviceId}` index
   (already present in `packet-m009` for revoke-cleanup, now getting its
   first real read-path consumer) — fetches each still-present message's
   metadata via `getAudioMeta`, skipping any index entries whose metadata has
   already expired (self-healing against TTL drift, no separate cleanup
   needed).
4. **Retention default — real number, not a testing placeholder.**
   `AUDIO_RETENTION_SECONDS` default changes from 45/120/240 (testing) to
   **259200 (72 hours)**. Disclosed as a reasonable starting point within the
   24-hour-to-30-day range already discussed, not a final decision — it's one
   env var on the deployed Vercel project, changeable anytime without a
   redeploy of code.
5. **`.env.example` / `README.md`** — updated to document the new required
   upload params, the pending-list endpoint, and the real-unit retention
   default.

## Allowed Changes

1. `apps/relay/lib/store.js` (edit)
2. `apps/relay/api/audio/upload.js` (edit)
3. `apps/relay/api/audio/pending/[deviceId].js` (new)
4. `apps/relay/.env.example` (edit)
5. `apps/relay/README.md` (edit)
6. `packets/packet-m011-page-voice-messages-relay-extension.md` (this packet)

No file under `apps/mobile/` or `apps/web/` is touched by this packet.

## Asset Check

No. Server-side schema/endpoint work only.

## Rollback Plan

1. **What to restore:** all changes are additive to existing files (new
   optional-turned-required params, new fields, one new file) — no destructive
   migration, since no real page-attached recordings exist in production yet
   (the client feature that would create them doesn't exist until the next
   packet).
2. **From where:** `git revert` of this packet's commit(s).
3. **Verify by:** `apps/relay/api/audio/[messageId].js` (unchanged) and every
   other `packet-m009` endpoint still behave exactly as already independently
   verified; `apps/mobile/` shows zero diff.

## Test Steps

1. `node --check` on `store.js`, `upload.js`, and the new
   `pending/[deviceId].js`.
2. Live curl round-trip against the deployed relay: upload with `bookId`/
   `pageIndex`, confirm the metadata stores them; call
   `GET /api/audio/pending/:deviceId`, confirm it lists the upload with the
   right fields and no audio bytes; play the recording once via the existing
   `GET /api/audio/:messageId`; call the pending list again, confirm the
   played recording is gone from it (delete-on-read already correct,
   verifying it flows through to the new list too).
3. Confirm `?bookId=` filtering actually filters (upload to two different
   `bookId`s for the same device, confirm the scoped list only returns one).
4. Confirm no file outside the Allowed Changes list shows a diff.
5. Independent verification (fresh agent, no memory of the build) before
   `Complete` — same discipline as `packet-m009`/`packet-m010`.

**Test Steps run, 2026-08-18 — all PASS, live against the deployed relay:**
- Uploaded a recording with `bookId=mary-had-a-little-lamb&pageIndex=2` — stored
  correctly.
- Uploaded a second recording for a different `bookId` — used to verify
  filtering.
- `GET /api/audio/pending/:deviceId` unfiltered — returned both, correct
  fields, `blobUrl` correctly absent.
- Same call with `?bookId=mary-had-a-little-lamb` — correctly returned only
  the matching one.
- Played the first recording via the existing `GET /api/audio/:messageId` —
  200, correct bytes.
- Pending list (filtered) called again — correctly empty; delete-on-read
  flows through to the discovery list, not just the single-fetch endpoint.
- `node --check` and require-resolution on all changed/new files — PASS.
- `git status` confirms zero diff outside the Allowed Changes list.

**Known live gap, disclosed not silently left:** the deployed Vercel project
still has `AUDIO_RETENTION_SECONDS=120` set explicitly in its environment
variables from the original `packet-m009` setup — an explicit env var
overrides this packet's new code-level default (259200). The upload response
above (`expiresInSeconds: 120`) confirms this directly. Updating that value on
Vercel (then redeploying) is a dashboard action outside this session's reach,
same category as the original storage provisioning.

## Recommended Next Packet

The client-side packet this depends on: recording UI (pick a page, record,
upload with the new `bookId`/`pageIndex` params), a discovery indicator in
`book-reader.tsx` (or wherever the corrected reading screen ends up) driven by
the new pending-list endpoint, and single-play-then-gone playback. Needs its
own explicit authorization per `.agents/lt.md`'s microphone/recording
"still binding" category, and should wait for the UI ideation currently
happening in a separate chat before its own scope-fill.
