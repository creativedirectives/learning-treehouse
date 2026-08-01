# CHANGELOG.md — Learning Treehouse

---

## Change Entry Template

```
Date:
Packet:
Approved by:
Changed:
Files touched:
Tests run:
Result:
Known issues:
Rollback available:
Next recommended packet:
```

---

## Entries

---

Date: 2026-07-31
Packet: packet-000-bootstrap-docs
Approved by: Dontavius (2026-07-31, Executive Overseer vault chat)

Changed:
- Created the standalone Learning Treehouse repo at
  `C:\Users\Dontavius\Claude projects\LearningTreehouse`, per the repo/stack-home
  decision locked 2026-07-31
- Scaffolded a default `create-next-app` project: Next.js 16.2.12 (App Router),
  React 19.2.4, TypeScript 5 (strict), Tailwind CSS v4, ESLint 9, `src/` layout,
  `@/*` import alias. No feature code.
- Created project folder structure: `docs/`, `packets/`, `audits/`
- Created governance docs mirroring TCB's pattern:
    `CLAUDE.md`, `AGENTS.md`, `USER.md`, `PORTABLE_PACKET_WORKFLOW.md`,
    `docs/AGENT_RULES.md`, `docs/BUILD_RULES.md`, `docs/CHANGELOG.md`
- Created `packets/packet-000-bootstrap-docs.md` (Status: In Progress)
- `AGENTS.md` and `docs/AGENT_RULES.md` both encode the book-centered architecture lock
  and name the rejected four-branch proposal explicitly, so no future agent can
  reintroduce it silently

Files touched:
- All files listed under "Files Created" in `packets/packet-000-bootstrap-docs.md`
- No existing files outside this repo were modified
- No FounderOS vault files were modified

Tests run:
- `npm run build` — PASS
- `npm run lint` — PASS
- Dev server browser render — NOT RUN (the implementer session's browser-preview tool
  was blocked by a permission classifier). `next build` compiled and prerendered
  `/` and `/_not-found` successfully, so the scaffold is known to compile and render
  statically; an interactive dev-server check is still outstanding.
- `tsconfig.json` confirmed `"strict": true` — PASS

- Pushed `main` to `creativedirectives/learning-treehouse` (private repo, created by
  Dontavius in the browser; existing Git Credential Manager credentials covered the push)
- Connected the repo to Vercel project `creative-directives/learning-treehouse` (Hobby)
  via the Vercel GitHub import. Deployment Ready at
  `learning-treehouse-fpasggwps-creative-directives.vercel.app`, assigned domain
  `learning-treehouse.vercel.app`, source `main` @ `d2d320e`. Git integration is live —
  future pushes to `main` deploy automatically.

Result: Complete

Known issues:
- DEVIATION: the packet said "private/preview only," but the Vercel GitHub import
  necessarily produces a Production deployment, since Vercel treats the default branch
  as production. The URL is publicly reachable, though it serves only the unmodified
  Next.js starter page and nothing was launched or announced. Same shape as TCB.
  Recorded in full under "Deviation Note" in the packet file. Recommended follow-up:
  enable Deployment Protection before real content lands.
- `gh` CLI still not installed — the winget MSI stalled on an unclicked UAC prompt.
  Not needed; the repo was created in the browser and pushed with plain git. Worth
  finishing later so agents can create repos unattended.
- `vercel` CLI is installed but unusable from the implementer session — blocked by the
  permission classifier. The Vercel MCP connector is installed but unauthorized.
  Neither blocked this packet.
- `npm audit` reports 12 high-severity advisories in transitive dev dependencies of the
  default scaffold. Not addressed in this packet — fixing them would mean changing
  dependency versions, which is outside this packet's allowed changes.
- `USER.md` is a small addition beyond a strict TCB mirror. It was added because the
  copied `PORTABLE_PACKET_WORKFLOW.md` lists `USER.md` as a required session-init read;
  omitting it would have left that reference pointing at a nonexistent file.

Rollback available: Yes — see the Rollback Plan in
`packets/packet-000-bootstrap-docs.md`. No prior commit exists, so rollback = delete
the project folder.

Next recommended packet: `packet-001-define-book-data-model.md` — unblocked.

---

Date: 2026-07-31
Packet: packet-001-define-book-data-model
Approved by: Dontavius (2026-07-31)

Changed:
- Added the canonical, JSON-serializable book data model at `src/types/book.ts`.
- Added compile-time contract assertions at `src/types/book.contract.ts`.
- Commit: `18dace3` — `feat: define book data model (2026-07-31)`.

Files touched:
- `src/types/book.ts`
- `src/types/book.contract.ts`

Tests run:
- `npm run lint` — PASS
- `npm run build` — PASS
- `git diff --check` — PASS
- Independent packet verification — PASS: changed-file scope and all required contract assertions confirmed.

Result: Complete

Known issues:
- No known source defects.

Rollback available: Yes — `git revert 18dace3` restores the packet-000 scaffold state; then run `npm run lint` and `npm run build`.

Next recommended packet: `packet-002-build-mock-book-content.md`.

---

Date: 2026-07-31
Packet: packet-002-build-mock-book-content
Approved by: Dontavius (2026-07-31)

Changed:
- Added the local-only mock book fixture at `src/data/books.ts`: one complete Mary fixture with six pages and three reader-only placeholder books.
- Corrected fixture attribution; the correction was independently verified.

Files touched:
- `src/data/books.ts` — intentionally untracked, uncommitted, and unpushed until Vercel Deployment Protection is enabled.
- `docs/CHANGELOG.md`

Tests run:
- `npm run lint` — PASS
- `npm run build` — PASS
- `git diff --check` — PASS
- Independent verification — PASS: fixture scope, page count, placeholder mode, and corrected attribution confirmed.

Result: Complete locally only; no deployment occurred.

Known issues:
- Vercel Deployment Protection remains required before committing or pushing real book content.

Rollback available: Yes — delete the untracked `src/data/books.ts` source file.

Next recommended packet: `packet-003`.

---

Date: 2026-07-31
Packet: packet-003-build-book-shelf
Approved by: Dontavius (2026-07-31)

Changed:
- Built the local-only book-shelf experience at the home route using the existing mock book fixture.
- Added the reusable `BookShelf` presentation component and replaced the starter home page with the shelf.
- Added responsive, reduced-motion-aware shelf styling.
- Full books expose a local link to `/books/{bookId}`; reader-only books are clearly shown as non-interactive previews. The reader route itself is intentionally deferred to `packet-004`.

Files touched:
- `src/app/page.tsx` — local home-route composition.
- `src/app/globals.css` — shelf and book-card styling.
- `src/components/book-shelf.tsx` — accessible book shelf and card rendering.
- `docs/CHANGELOG.md`

Tests run:
- `npm run lint` — PASS.
- `npm run build` — PASS.
- `git diff --check` — PASS.
- Local `GET /` — PASS: the shelf renders locally with its available and reader-only book states.

Result: Complete locally only. The local app is testable at `http://localhost:3000/`; no source files were staged, committed, pushed, or deployed.

Known issues:
- `src/data/books.ts` from `packet-002` remains intentionally local, untracked, and unpushed pending Vercel Deployment Protection.
- The full-book reader destination (`/books/{bookId}`) is intentionally not implemented until `packet-004`.

Rollback available: Yes — discard only the P003 local source changes to return to the prior scaffold/home experience; preserve the separate local P002 fixture unless that packet is also being rolled back.

Next recommended packet: `packet-004` — build the reader route before testing a full book link.

---

Date: 2026-07-31
Packet: packet-004-build-book-reader
Approved by: Codex under the Light Governance Tier (2026-07-31)

Changed:
- Added `/books/[bookId]` as a server route resolving a local book by ID; unknown or
  reader-only book IDs reject via `notFound()`.
- Added `BookReader`, a client component: in-memory page navigation (Previous/Next,
  bounded to the book's page count), read-along text, page-scoped word list, and a
  clearly-labeled fake record/playback control that never touches `MediaRecorder`,
  never requests microphone permission, and persists nothing.

Files touched:
- `src/app/books/[bookId]/page.tsx`
- `src/components/book-reader.tsx`
- `docs/CHANGELOG.md`

Tests run:
- `npm run lint` — PASS
- `npm run build` — PASS
- Local navigation shelf → Mary → page 1 through 6 → back to page 1 — PASS, bounds held
- Fake record control toggled twice — label changes, no permission prompt, no writes
- Unknown and reader-only book routes — both rejected without a runtime error

Result: Complete locally only. Not staged, committed, or deployed as of this entry —
Vercel Deployment Protection remains the release guard (see packet-004's Release Guard
section). This CHANGELOG entry and the underlying files are committed together in the
same commit that closes this out.

Known issues:
- `src/data/books.ts` (packet-002) remains the only content source; Vercel Deployment
  Protection still required before any of packets 002-004 are pushed live.
- No independent verifier is recorded by name for packet-003 or packet-004 in this log.
  Worth tightening going forward — the light tier still requires builder ≠ verifier.

Rollback available: Yes — remove `src/app/books/[bookId]/page.tsx` and
`src/components/book-reader.tsx`; shelf remains available on its own.

Next recommended packet: `packet-005-build-vocabulary-practice.md`.

---
