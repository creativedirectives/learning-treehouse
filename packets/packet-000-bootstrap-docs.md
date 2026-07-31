# Packet: packet-000-bootstrap-docs

## Packet Header

Packet: packet-000-bootstrap-docs
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Dontavius
Approved on: 2026-07-31 (directly in the Executive Overseer vault chat)
Depends on: Repo/stack home decision — Resolved 2026-07-31
(`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\DECISION_LOG.md`
→ Infrastructure Decisions)

Status: In Progress

---

## Purpose

Create the Learning Treehouse repo and its governance docs so every future packet has a
contract to reference before touching code. Establishes the standalone repo decided on
2026-07-31, mirroring TCB's proven setup.

## Problem Being Solved

No codebase existed. Vault docs described the project but there was nowhere to build,
and no project-root rules for an implementing agent to follow. Without those rules the
first feature packet would have to invent its own constraints — which is exactly how the
rejected four-branch proposal nearly reached implementation.

## Allowed Changes

1. Create local folder `C:\Users\Dontavius\Claude projects\LearningTreehouse`
2. Scaffold a Next.js (App Router) + TypeScript (strict) + Tailwind CSS project —
   default starter only, no feature/book/activity code
3. `git init`, first commit
4. Create GitHub repo `creativedirectives/learning-treehouse`, push initial commit
5. Connect a Vercel project under the Creative Directives team for the standard
   preview-deploy pipeline (mirroring TCB) — private/preview only
6. Add project-root governance docs mirroring TCB's pattern
   (`AGENT_RULES.md` / `BUILD_RULES.md`), so the vault's `SESSION_START.md` can be
   filled in with real paths

## Not Allowed

1. Any book/lesson/activity/game feature code — that is `packet-001` onward
2. Any persistence layer, IndexedDB, or content JSON
3. Any account, auth, cloud-sync, or analytics integration
4. Public launch, production traffic, or marketing pages — this packet authorizes only
   the standard private/preview pipeline
5. Any branch-centered navigation or content structure — see the book-centered lock in
   the vault `DECISION_LOG.md`
6. Any FounderOS vault file changes beyond what the closeout report brings back

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Local folder at the exact decided path | Done |
| 2 | Next.js App Router + TS strict + Tailwind scaffold, default starter only | Done |
| 3 | `git init` + first commit | Done |
| 4 | Root governance docs mirroring TCB's pattern | Done |
| 5 | `npm run build` succeeds with no errors | Done |
| 6 | GitHub repo `creativedirectives/learning-treehouse` created and pushed | **Not done** |
| 7 | Vercel preview deployment under Creative Directives | **Not done** |

### Files Created

Scaffold (from `create-next-app`, default starter):
- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`
- `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, `.gitignore`, `README.md`
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico`
- `public/*.svg`

Governance docs (this packet):
- `CLAUDE.md` — session startup + closeout, required reading order
- `AGENTS.md` — project rules, architecture lock, Do Not Build Yet list
- `USER.md` — communication contract, HV markers, verification style
- `PORTABLE_PACKET_WORKFLOW.md` — copied from the vault shared frameworks
- `docs/AGENT_RULES.md`
- `docs/BUILD_RULES.md`
- `docs/CHANGELOG.md`
- `packets/packet-000-bootstrap-docs.md` (this file)
- `audits/.gitkeep`
- `.claude/launch.json` — dev-server launch config, mirroring the pattern used for TCB

## Asset Check

Does this packet involve protected visual or brand assets?
- **No.** No Learning Treehouse artwork, illustrations, or brand assets were added.
  The only images present are the default `create-next-app` SVGs in `public/`.
- The Learning Treehouse illustration remains external and unimported. It is approved as
  visual inspiration only — explicitly **not** as an MVP sitemap. See `AGENTS.md`.

## Rollback Plan

Required — this packet creates a new repo and a shared doc contract.

1. **What to restore:** the entire project folder
   `C:\Users\Dontavius\Claude projects\LearningTreehouse`
2. **From where:** no prior commit exists before this packet. Rollback = delete that
   folder outright. If the GitHub repo has been created by then, delete it too from
   GitHub settings, and remove the Vercel project from the Creative Directives team.
3. **Verify by:** the folder no longer exists; the vault's Phase 0 checklist item
   "First packet scoped and Approved" reverts to not-executed; no other project's repo
   was touched.

## Test Steps

1. `npm run build` completes with no errors — **PASS**
2. `npm run lint` completes with no errors — **PASS**
3. Dev server serves the default starter page with no console errors — **NOT RUN**
   (the implementer session's browser-preview tool was blocked by a permission
   classifier; `next build` compiled and prerendered the same routes successfully)
4. No feature code beyond the default scaffold exists — **PASS**
5. Root governance docs present and mirroring TCB's pattern — **PASS**
6. `tsconfig.json` has `"strict": true` — **PASS**
7. Repo exists on GitHub at `creativedirectives/learning-treehouse` — **NOT RUN**
8. Vercel preview deployment succeeds (private, not public launch) — **NOT RUN**

## Blockers

`HV REQUIRED:` Deliverables 6 and 7 could not be executed from this session:

- The `gh` CLI is not installed on this machine, so the GitHub repo cannot be created
  or pushed from here.
- The `vercel` CLI is not installed, and the Vercel MCP connector is not authorized in
  this session.
- Creating a remote repo and a hosted deployment is outward-facing and warrants an
  explicit go-ahead at the moment it happens, separate from packet approval.

The local repo is complete and committed. `git remote` is intentionally unset — nothing
has been pushed anywhere.

## Recommended Next Packet

`packet-001-define-book-data-model.md` — define the book/page/word JSON schema per the
locked book-centered structure. Do not open it until deliverables 6 and 7 above are
either completed or explicitly deferred by Dontavius, and this packet's Status is
moved to `Complete` in the vault `PACKETS.md`.
