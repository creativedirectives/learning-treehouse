# Packet: M009 Harden Relay Foundation

## Packet Header

Packet: `packet-m009-harden-relay-foundation`

Date created: 2026-08-15

Project: Learning Treehouse Mobile

Approved by: Dontavius (this chat, explicit "approved" — 2026-08-15)

Approved on: 2026-08-15

Depends on: "Deployed relay architecture" decision, Approved 2026-08-15
(`DECISION_LOG.md` → Infrastructure Decisions). Relay/networking work was frozen after
the `packet-m008` scope violation (`DECISION_LOG.md` → Process Decisions); that freeze
is only partially lifted — see Open Items below.

Status: **In Progress**

Builder and verifier must be different agents.

**Shell drafted by:** Executive Overseer — Vault, 2026-08-15, from Dontavius's direct
instruction in the vault-workspace chat. Per `.agents/lt.md`'s `Technical Overseer — LT`
role (added 2026-08-15, same incident), full technical scope-fill — concrete
deliverables, exact file scope, endpoint/schema detail, acceptance tests, and the
Rollback Plan — belongs to a `Technical Overseer — LT` session scoped to this repo, not
to the vault-workspace session that drafted this shell. **This packet may not move to
Approved until that pass happens.** Drafting the shell here (not the technical body) is
deliberate: writing the full technical packet from the vault session would repeat the
exact role-collapse pattern that caused the `packet-m008` incident this new role exists
to prevent.

**Technical scope-fill by:** `Technical Overseer — LT`, 2026-08-15, repo-scoped session
(this chat, redirected from the vault workspace after confirming role with Dontavius).
Allowed Changes, Deliverables, Rollback Plan, and Test Steps below are made concrete.
Both Open Items above still stand exactly as stated: rate limiting and body caps are
now scoped in (see Deliverables), not resolved-by-omission; the governance-tier
question is untouched here and remains Dontavius's call, not inferred from this
scope-fill.

**Implemented by:** the same session, same day, after Dontavius explicitly approved
the packet and a hosting-decision question in this chat. **Process note, disclosed
rather than hidden:** `packets/_m009-technical-overseer-handoff-prompt.md` (present in
the repo, not authored by this session) specifies that scope-fill and implementation
should happen in two separate sessions — "do not proceed to implementation even if
asked in the same session" — mirroring Codex/Implementer separation on PTP. This
session did not read that file until after implementation was already done (missed by
an initial narrow glob rather than a full `/packets` directory read). Dontavius was
informed of the deviation immediately on discovery and chose to accept the work as-is
rather than discard and redo via two sessions, on the condition that Test Step 5 below
(independent verification, by a session that did not write this code) still gates
`Complete`. Status stays `In Progress`, not `Complete`, until that happens.

---

## Purpose

Replace the frozen `apps/relay/server.js` prototype with a real, deployable relay
server for Family Circle: durable pairing, a transient audio store, per-device auth,
infrastructure-enforced expiry, and v1 revocation — the five decisions locked in
`DECISION_LOG.md` → "Deployed relay architecture." This is `packet-m009` in the
`audit-001` renumbering (`DECISION_LOG.md`, 2026-08-15): **relay foundation only**
(storage, auth, expiry, revocation, rate limiting). Not client wiring (`packet-m010`),
not screen unification (`packet-m011`), not the voice-message feature itself
(`packet-m012`).

## Problem Being Solved

`apps/relay/server.js` was built outside any authorized packet
(`DECISION_LOG.md` → "packet-m008 scope violation"). It is frozen, not deleted — kept
as reference for the UX it proved. It does not carry forward: its in-memory `Map` state
cannot run on Vercel's serverless model no matter how it's patched, so this packet
writes a new server rather than modifying that one.

Separately, `audit-001` (referenced in `DECISION_LOG.md` and backfilled in
`ARCHITECTURE_REVIEWS/2026-08-15_deployed-relay-architecture-backfill.md` — the audit
file itself was never committed to this repo's `audits/` folder, only its findings
survive in those two vault documents) found two gaps in the pairing flow that the five
architecture decisions do **not** close:

1. **Invite-code redemption has no rate limiting.** A 24-bit invite code with unlimited
   guess attempts is brute-forceable, and a successful guess now yields a *completed
   pairing* (the per-device auth token protects the post-pairing queue, not the pairing
   endpoint itself) — a more consequential version of the original finding, not a
   smaller one.
2. **Unbounded request bodies** — a cost/availability exposure on Vercel's
   per-invocation billing, independent of the privacy question.

The backfilled architecture review's verdict was **REVISE**, explicitly naming both as
**required `packet-m009` deliverables**, not implicit follow-ups. Any technical
scope-fill of this packet must include them as named, testable items — not leave them
assumed.

## Open Items — do not treat either as resolved

1. **The freeze is only partially lifted.** The five architecture decisions (storage,
   auth, expiry, revocation) are Decided. The rate-limiting and request-body gaps above
   were never folded into a decision and must be in this packet's scope, not deferred
   again.
2. **Whether this incident re-tightens LT's governance tier is still open.** No
   decision exists either way in `DECISION_LOG.md`. Do not scope or build as if either
   answer is already known.

---

## Allowed Changes

Scope-filled by `Technical Overseer — LT`, 2026-08-15 (this session, repo-scoped —
see Packet Header). Concrete file list; see Deliverables for the endpoint/schema
contract each file must satisfy.

1. `apps/relay/api/invites.js` (new)
2. `apps/relay/api/pairings.js` (new)
3. `apps/relay/api/pairings/[deviceId].js` (new)
4. `apps/relay/api/events.js` (new)
5. `apps/relay/api/events/[deviceId].js` (new)
6. `apps/relay/api/audio/upload.js` (new)
7. `apps/relay/api/audio/[messageId].js` (new)
8. `apps/relay/api/connections/revoke.js` (new)
9. `apps/relay/api/cron/sweep-audio.js` (new)
10. `apps/relay/lib/store.js` (new — shared KV helpers)
11. `apps/relay/lib/auth.js` (new — token issuance/hashing/verification)
12. `apps/relay/lib/rate-limit.js` (new — attempt counters, body-size guard)
13. `apps/relay/vercel.json` (new — Cron schedule)
14. `apps/relay/package.json` (edit — add `@upstash/redis`, `@vercel/blob`; `server.js`
    and its `start` script are untouched, see Not Allowed #1). Originally scoped as
    `@vercel/kv` — swapped during implementation after `npm view` confirmed it's
    deprecated (Vercel's own registry metadata points to a Marketplace Redis/Upstash
    integration instead); `@upstash/redis`'s API is a superset of what `@vercel/kv`
    exposed, so no other file's design changed.
15. `apps/relay/.env.example` (new — variable names only, no real values)
16. `apps/relay/README.md` (new — deployment/provisioning notes for the HV REQUIRED
    items below)

No file outside `apps/relay/` is touched by this packet.

## Not Allowed

1. Patching or deleting `apps/relay/server.js` — it stays committed, untouched, as
   frozen reference. Superseded, not edited.
2. Client wiring — swapping `MockReadTogetherChannel` for the real channel in
   `connect-screen.tsx` / `real-read-together.tsx` is `packet-m010`, not this packet.
3. Screen unification (mock vs. real Read Together UI) — `packet-m011`.
4. The voice-message record/send/ephemeral-playback feature itself — `packet-m012`.
5. Any content filtering, speech recognition, or AI/ML service of any kind.
6. Widening the 24-bit invite-code space as a substitute for rate limiting, without a
   separate recorded decision — throttling is the named answer to the audit finding.
7. Accounts, passwords, or contact storage — the no-password trust model stays locked
   per `DECISION_LOG.md` → "Family Circle real infrastructure."
8. Any FounderOS vault file changes — this repo's lane reports to the vault, it does
   not write to it (`AGENTS.md` → AI Should Never Do Automatically).

## Deliverables

**KV schema** (all keys namespaced, native TTL noted — this is what makes expiry
infrastructure-enforced rather than app-code-enforced):

| Key | Value | TTL |
|---|---|---|
| `invite:{code}` | `{ fromDeviceId, expiresAt }` | 30 min |
| `invite-attempts:{code}` | integer counter | remaining invite life |
| `pairing-attempts-ip:{ip}` | integer counter | 15 min sliding window |
| `pairing:{deviceId}` | JSON array of partner deviceIds | none (durable) |
| `pairing-label:{a}:{b}` | string | none (durable) |
| `device-token-hash:{deviceId}` | sha256 hex of that device's token | none (durable) |
| `unclaimed-token:{deviceId}` | plaintext token, deleted on first read | 10 min |
| `events:{deviceId}` | JSON array of queued text events | 72 h (matches frozen `server.js`) |
| `audio-meta:{messageId}` | `{ fromDeviceId, toDeviceId, blobKey, expiresAt, delivered }` | configurable retention preset (45s / 120s / 240s, per `DECISION_LOG.md`'s 2026-08-05 voice-message entry — env-driven, default 120s) |

**Auth mechanism:** `crypto.randomBytes(32)` token generated once per device, at the
moment that device's pairing completes. Server stores only `sha256(token)`. Every
request that reads or writes a specific device's data must carry
`Authorization: Bearer <token>`, checked by constant-time comparison against the
stored hash. A token is never retrievable again after issuance — no accounts, no
password reset, consistent with the no-password trust model already locked in
`DECISION_LOG.md` → "Family Circle real infrastructure."

**Token bootstrap (closes the exact gap `audit-001` found — deviceId alone no longer
sufficient to read a device's data):**
- On `POST /api/pairings` success, the server generates tokens for **both** devices
  (redeemer and inviter), stores both hashes, returns the redeemer's plaintext token
  directly in the response, and writes the inviter's plaintext token to
  `unclaimed-token:{inviterDeviceId}`.
- `GET /api/pairings/:deviceId` (called by the inviter's poll loop while waiting) is
  the one endpoint reachable without a token — because before a pairing exists there
  is nothing to protect. The instant a partner appears, this same call also drains
  and returns `unclaimed-token:{deviceId}` if present, deleting it in the same
  operation (single-use, mirrors invite-burn). After that first drain, the key is
  gone — repeat polls (or an attacker guessing the deviceId) get `{ partners }` only,
  never the token, and once a token is required for the deeper endpoints below, a
  bare deviceId guess yields nothing sensitive.
- `GET /api/events/:deviceId`, `POST /api/events`, `GET/POST /api/audio/*`, and
  `POST /api/connections/revoke` all require a valid token for the acting deviceId —
  401 without one.

**Endpoints:**

1. `POST /api/invites` — body `{ deviceId }`. No auth (nothing to protect pre-pairing).
   Creates `invite:{code}` (`crypto.randomBytes(3).toString('hex').toUpperCase()`,
   same 24-bit code shape as the frozen server — width is unchanged per Not Allowed
   #6, throttling is the fix). Returns `{ code, expiresInMinutes }`.
2. `POST /api/pairings` — body `{ code, deviceId, label? }`. No pre-auth (this *is*
   the auth-bootstrap call). On every attempt: increments
   `invite-attempts:{code}` and `pairing-attempts-ip:{req ip}`; returns 429 if either
   exceeds its cap (5 attempts per code; 20 attempts per IP per 15 min) and burns the
   invite outright on the per-code cap. On success: creates the pairing; issues a
   token **only for a device that doesn't already have one** (a token is a per-device
   credential, not per-connection — a device already paired with someone else keeps
   its existing token rather than getting a new one that would invalidate nothing but
   would be redundant) per "Token bootstrap" above; returns
   `{ pairedWith, token }` where `token` is `null` if the redeeming device already
   held one.
3. `GET /api/pairings/:deviceId` — no auth; returns `{ partners, token? }` per "Token
   bootstrap" above.
4. `POST /api/events` — requires `Authorization` for `fromDeviceId` in the body;
   verifies `fromDeviceId`/`toDeviceId` are paired; rejects bodies over 4 KB (413);
   pushes onto `events:{toDeviceId}`.
5. `GET /api/events/:deviceId` — requires `Authorization` for that deviceId; drains
   and clears `events:{deviceId}` (delivered-or-expire, unchanged from frozen
   `server.js` behavior).
6. `POST /api/audio/upload` — requires `Authorization` for `fromDeviceId`; rejects
   bodies over 5 MB (413, generous bound for a 60s clip per the already-decided
   recording cap — the 60s enforcement itself is a client concern for `packet-m012`,
   this is only the server-side defensive ceiling); uploads bytes to Vercel Blob with
   **`access: 'private'`** (confirmed available in `@vercel/blob` 2.8.0 during
   implementation — true access-controlled private storage, not the
   public-with-unguessable-URL fallback originally assumed when this packet was
   scoped), writes `audio-meta:{messageId}`. No caller exists yet in this packet —
   this is foundation for `packet-m012`, per Purpose.
7. `GET /api/audio/:messageId` — requires `Authorization` for the metadata's
   `toDeviceId`; 404 if expired or already delivered; reads bytes via
   `@vercel/blob`'s `get(url, { access: 'private' })` (authenticated with
   `BLOB_READ_WRITE_TOKEN`, not a plain `fetch`) and streams them back through this
   Function — a private blob isn't fetchable by URL at all without that token, so
   this is stronger than "never expose the URL," it's actually inaccessible without
   it; marks delivered and deletes both the KV metadata and the Blob object on
   successful read (delete-on-read, TTL is the backstop for undelivered audio, not
   the primary mechanism).
8. `POST /api/connections/revoke` — body `{ deviceId, partnerId }`; requires
   `Authorization` for `deviceId`; deletes the pairing entry on both sides, the label,
   and any queued `events`/`audio-meta` records between the two deviceIds. Does not
   revoke either device's own token — a token is a device credential, not a
   per-connection one, and this device may still be paired with others. This is the
   server-side support for the "Remove connection" action; the confirmation dialog
   and client call are `packet-m010`.
9. `GET /api/cron/sweep-audio` — Vercel Cron target (`apps/relay/vercel.json`,
   `*/5 * * * *`); lists Blob objects under the audio prefix, deletes any with no
   matching live `audio-meta:{messageId}` KV record (i.e. already expired/delivered)
   — the orphan sweep Blob's lack of native TTL requires.

**Rate limiting / body caps (the two `audit-001` findings this packet exists to
close):** implemented above as (a) the per-code + per-IP attempt counters on
`POST /api/pairings`, both required, since per-code alone doesn't stop one source
spraying many codes; (b) explicit byte-size ceilings on every endpoint that accepts a
body (4 KB JSON endpoints, 5 MB audio upload), checked against `Content-Length` and
the actual bytes read (not `Content-Length` alone, which a client can misreport).

**Not included in this packet (named so it isn't silently assumed done):** widening
the invite-code space, CAPTCHA, or any per-account limiting — throttling as scoped
above is the full answer to the audit finding, per Not Allowed #6.

## Asset Check

No. Server-side/backend work only; no visual or brand assets involved.

## Hosting Decision — resolved

**Decided:** 2026-08-15 (Dontavius, this session). `apps/relay` becomes a new,
separate Vercel project (`learning-treehouse-relay` or similar), Root Directory
`apps/relay`, same GitHub repo — mirrors how `apps/web` is already configured in its
own project. `apps/web` is untouched: no relay code, no relay env vars, no shared
project. Upstash KV, Vercel Blob, and the Cron job are provisioned on the new project
only.

**Still outside this session's reach:** actually creating the Vercel project and
provisioning KV/Blob/Cron via the Marketplace requires the Vercel dashboard (this
repo's Vercel MCP connector is unauthenticated in this session). This blocks
*deployment*, not the code — the files in Deliverables can be written and
type-checked locally regardless; `apps/relay/vercel.json`'s project linkage is ready
to point at the new project once it exists.

## Rollback Plan

1. **What to restore:** nothing pre-existing is modified — every file in Deliverables
   is new except `apps/relay/package.json`, which only gains two dependency entries.
   `apps/relay/server.js` is never touched (Not Allowed #1).
2. **From where:** no prior commit needed. Rollback = delete the 16 new files listed
   under Allowed Changes and revert the two added lines in `apps/relay/package.json`
   (`git checkout -- apps/relay/package.json` restores it if this packet's commit is
   reverted; otherwise remove the two `dependencies` entries by hand).
3. **Verify by:** `apps/relay/server.js` still starts via `npm run start:relay`
   unchanged; `git status` shows a clean `apps/relay/` tree matching pre-packet state;
   no other workspace (`apps/web`, `apps/mobile`, `packages/book-model`) shows any
   diff, since none is touched by this packet.

## Test Steps

1. `cd apps/relay && npx tsc --noEmit` (or the repo's equivalent type-check for plain
   JS with JSDoc, whichever this session's implementation pass uses) — no errors.
2. Local emulation: run each endpoint against a local KV/Blob stand-in (Vercel CLI
   `vercel dev` with dev-linked Marketplace resources, once the HV REQUIRED hosting
   decision is made) and confirm:
   - Invite → redeem → both devices receive a token; `unclaimed-token` is gone after
     the inviter's first successful poll; a second poll returns no token.
   - 6th redemption attempt against the same code (or 21st from the same IP within 15
     min) returns 429; the per-code cap also burns the invite.
   - A `POST /api/events` body over 4 KB returns 413; a `POST /api/audio/upload` body
     over 5 MB returns 413.
   - `GET /api/events/:deviceId` and `GET/POST /api/audio/*` return 401 without a
     valid `Authorization` header, and 401 with a well-formed but wrong token.
   - An uploaded audio blob is retrievable once via `GET /api/audio/:messageId`, then
     404s on a second attempt (delete-on-read).
   - `POST /api/connections/revoke` removes the pairing both directions and clears any
     queued events/audio-meta between the two deviceIds; a third, unrelated pairing
     for either device is unaffected.
3. Confirm no file outside `apps/relay/` shows a diff (`git status` / `git diff
   --stat`) — this packet's Not Allowed list is client-wiring-free by construction.
4. Confirm `apps/relay/server.js` is byte-for-byte unchanged
   (`git diff --stat apps/relay/server.js` shows nothing).
5. Mark `Complete` only after Dontavius (or a verifier session distinct from whoever
   implements this) confirms 1–4 against the actual files, per
   `PORTABLE_PACKET_WORKFLOW.md` §13 and this packet's own "Builder and verifier must
   be different agents" line.

**Step 2 executed, 2026-08-15 (this session, self-report — not the independent
verification Step 5 still requires):** deployed to `learning-treehouse-relay`
(Vercel), Upstash Redis + Vercel Blob connected. Live `curl` round-trip against real
infrastructure:
- `POST /api/invites` → real code + KV TTL, confirmed via `expiresInMinutes`
- `POST /api/pairings` (redeem) → pairing created, redeemer token issued
- `GET /api/pairings/:deviceId` (poll) → partner + inviter token on first call;
  **second call correctly omits the token** (single-use claim verified)
- `POST /api/events` (authed) → queued; `GET /api/events/:deviceId` (authed) →
  delivered; **same call with no `Authorization` header → 401** (auth enforcement
  verified)
- `POST /api/connections/revoke` → pairing removed both sides; subsequent
  `POST /api/events` between the same two devices → **403 "not paired"** (revoke
  cascade verified)
- `GET /api/cron/sweep-audio` — confirmed firing every 5 minutes via Runtime Logs,
  200 once Blob credentials were live

**Not yet exercised live:** the audio upload/read pair (no caller exists yet, by
design — see Deliverables item 6/7) and the rate-limit caps (5 attempts/code, 20/IP)
— throttling was code-reviewed, not load-tested. Both remain open for whoever does
the independent verification pass.

**Deployment note for that verifier:** the Vercel project ended up named
`learning-treehouse-relay`, Root Directory `apps/relay`, with Upstash Redis
(`upstash-kv-alizarin-island`) and Vercel Blob (private access) connected. A second,
unused stray project (`learning-treehouse-relay1`) exists from a naming-collision
during setup — not deployed to, safe to ignore or delete.

**Independent verification, 2026-08-16 (fresh agent, no memory of the build
session) — verdict: did not pass as originally deployed.** Confirmed two bugs:
1. `parseJsonBody` (`lib/rate-limit.js`) trusted Vercel's pre-parsed `req.body`
   when present, but Vercel buffers the full body before handler code runs, with
   no size limit of its own — a request with no `Content-Length` (e.g. chunked
   transfer-encoding) skipped the app-level 4 KB cap entirely on `/api/invites`,
   `/api/pairings`, `/api/events`, and `/api/connections/revoke`. This is a direct
   miss on one of the two named `audit-001` deliverables.
2. `api/pairings.js` read the invite, validated it, then deleted it as two separate
   Redis calls — a race where two concurrent redemptions of the same code could
   both read it before either deleted it, both pass validation, and both succeed.
Also flagged, not yet independently confirmed: possible `X-Forwarded-For` spoofing
defeating the per-IP rate limit — needs a live test, not code-verified either way.

**Correction pass, same day, same session as the build (per that session's own
note above, this repeats the builder≠scope-filler deviation in miniature — a
different session did the verification, but the same one is applying the fix).
Every fix must go through fresh independent verification again before this packet
moves to `Complete`, same as if a different builder had made these specific
changes:**
1. `parseJsonBody` no longer trusts `req.body` at all — always runs the manual
   capped stream read, so the 413 cap can't be bypassed by omitting
   `Content-Length`. (Vercel's own unbounded pre-buffering is a platform limitation
   this can't close from app code — named, not silently treated as fully solved.)
2. Added `store.claimInvite()` using Redis `GETDEL` — atomic get-and-delete, so only
   one concurrent redemption of a given code can ever succeed; the other gets `null`
   and 404s, same as an expired/unknown code. `api/pairings.js` rewritten to use
   this instead of separate get/delete calls. Trade-off, disclosed: a self-pair
   attempt now burns the code (the atomic claim already consumed it before the
   self-pair check runs) rather than leaving it reusable — accepted since
   self-pairing isn't a real user flow and re-issuing the code would reopen the
   same race.

## Recommended Next Packet

`packet-m010` — relay contract tests + client resilience (per `DECISION_LOG.md`'s
`audit-001` renumbering) — only after this packet is Approved, built, and Complete.
