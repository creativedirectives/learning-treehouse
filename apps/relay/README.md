# Family Circle relay

`packet-m009-harden-relay-foundation` — see that packet file for the full design
(KV schema, endpoint contracts, rate limiting). This README covers deployment only.

## Two things in this folder

- `server.js` — the original in-memory, same-WiFi-only reference implementation.
  **Frozen, not deleted.** It does not deploy to Vercel (in-memory `Map` state can't
  survive across serverless invocations) and this packet does not modify it. Kept for
  the UX it proved. Run locally with `npm run start:relay` from the repo root, same
  as before.
- `api/` — the real, deployable relay this packet adds: Vercel Serverless Functions
  backed by Upstash KV and Vercel Blob. Nothing here runs until it's deployed as its
  own Vercel project (see below) — this is not wired into any client yet
  (`packet-m010`).

## Deploying (HV REQUIRED — needs the Vercel dashboard)

1. Create a **new, separate Vercel project** for this folder — Root Directory
   `apps/relay` — rather than adding it to the existing `apps/web` project. Decided
   2026-08-15: different security model and blast radius than the child-facing web
   app; an outage or misconfiguration in one should never touch the other.
2. In that project, add a **Redis** storage integration (Upstash-backed — `@vercel/kv`
   is deprecated, this project uses `@upstash/redis` directly) and **Vercel Blob** via
   the Vercel Marketplace (Project → Storage → Connect). This auto-populates the KV
   REST URL/token and `BLOB_READ_WRITE_TOKEN` — see `.env.example` for the full
   variable list, including the ones you set by hand (`AUDIO_RETENTION_SECONDS`,
   `CRON_SECRET`). The Redis integration's exact env var names weren't confirmed
   against a live provision as of this packet — `lib/store.js` checks both the legacy
   `KV_REST_API_URL`/`KV_REST_API_TOKEN` names and Upstash's own
   `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`; check which one actually gets
   set and drop the unused pair from `.env.example` once confirmed.
3. Deploy. `vercel.json` in this folder registers the `/api/cron/sweep-audio` Cron
   job automatically on deploy — no separate setup needed.

## Local development

`vercel dev` (Vercel CLI) from this folder, once the project above exists and you've
run `vercel link` + `vercel env pull`, will emulate the Functions locally against the
real (dev-linked) KV/Blob resources. There is currently no fully-offline emulation for
KV/Blob in this packet's scope.
