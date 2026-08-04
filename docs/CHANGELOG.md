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

Date: 2026-08-04
Packet: packet-m001-align-expo-go-sdk; packet-m002-fix-sdk54-metro-resolution; packet-m006-stabilize-monorepo-dependency-layout
Approved by: Dontavius (2026-08-01 and 2026-08-04)

Changed:
- Aligned the mobile app to Expo SDK 54 for the current Expo Go client.
- Removed obsolete manual Metro monorepo resolver overrides and enabled Expo SDK 54 autolinking module resolution.
- Stabilized npm workspace dependency layout with nested install strategy, root React/React Native overrides, web React alignment, and a refreshed lockfile.

Files touched:
- `.npmrc`
- `apps/mobile/package.json`
- `apps/mobile/app.json`
- `apps/mobile/metro.config.js`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `packets/packet-m001-align-expo-go-sdk.md`
- `packets/packet-m002-fix-sdk54-metro-resolution.md`
- `packets/packet-m006-stabilize-monorepo-dependency-layout.md`
- `docs/CHANGELOG.md`

Tests run:
- `cd apps/mobile && npx expo-doctor` - PASS: 18/18 checks.
- `cd apps/mobile && npx tsc --noEmit` - PASS.
- `cd packages/book-model && npx tsc --noEmit` - PASS.
- `npm run lint:web` - PASS.
- `npm run build:web` - PASS.
- `git diff --check` - PASS with line-ending warnings only; no whitespace errors.
- Physical Expo Go check by Dontavius - PASS: app loads on another phone.

Result: Complete.

Known issues:
- No push or deployment occurred.
- Vercel deployment protection and web root-directory maintenance remain separate web operations.

Rollback available: Yes - revert the stabilization commit and rerun install plus the checks above.

Next recommended packet: continue mobile-only practice work; do not resume web feature work unless explicitly requested.

---

Date: 2026-08-04
Packet: packet-m003-fix-inline-word-help; packet-m004-expand-inline-word-help
Approved by: Dontavius (2026-08-01)

Changed:
- Made readable sentence words tappable in the Mary reader.
- Kept selected vocabulary words visually emphasized while ordinary story words are also tappable.
- Routed inline word taps through the existing device speech path.

Files touched:
- `apps/mobile/src/features/reader/book-reader.tsx`
- `packets/packet-m003-fix-inline-word-help.md`
- `packets/packet-m004-expand-inline-word-help.md`
- `docs/CHANGELOG.md`

Tests run:
- `cd apps/mobile && npx tsc --noEmit` - PASS.
- `git diff --check` - PASS with line-ending warnings only; no whitespace errors.
- Physical Expo Go check by Dontavius - PASS: tapped words speak when silent mode is off and do not sound off when silent mode is on.

Result: Complete.

Known issues:
- No microphone, recording, saved progress, account, cloud, analytics, AI, or separate practice surface was added.

Rollback available: Yes - restore `apps/mobile/src/features/reader/book-reader.tsx` from the prior commit and rerun mobile TypeScript.

Next recommended packet: scope the next book-powered practice packet narrowly.

---

Date: 2026-08-04
Packet: packet-008-adopt-product-platform-asset-brief; packet-009-record-parent-guided-raivl-spelling-bee-direction
Approved by: Dontavius (2026-08-01)

Changed:
- Adopted the Product, Platform, and Asset Brief as required reading.
- Recorded the parent-guided RAIVL and book-powered Spelling Bee direction without authorizing implementation.
- Updated the brief's immediate sequence to reflect the verified mobile loop and shelved web work.

Files touched:
- `CLAUDE.md`
- `docs/PRODUCT_PLATFORM_AND_ASSET_BRIEF.md`
- `packets/packet-008-adopt-product-platform-asset-brief.md`
- `packets/packet-009-record-parent-guided-raivl-spelling-bee-direction.md`
- `docs/CHANGELOG.md`

Tests run:
- Documentation scope inspection - PASS.
- `git diff --check` - PASS with line-ending warnings only; no whitespace errors.

Result: Complete.

Known issues:
- Future RAIVL Core, Spelling Bee, grade library, custom story service, accounts, child data, and asset intake remain explicitly deferred until dedicated packets.

Rollback available: Yes - revert the documentation commit.

Next recommended packet: continue mobile-only practice work from the book-centered loop.

---

Date: 2026-08-04
Packet: packet-m005-build-local-parent-guide
Approved by: Dontavius (2026-08-02)

Changed:
- Added a local, adult-facing Parent Guide v0 to the mobile shelf flow.
- Added a For grown-ups entry on the shelf.
- Added in-memory navigation between shelf, Parent Guide, and Mary reader.
- Displayed only existing Mary book-owned practice words and definitions.

Files touched:
- `apps/mobile/App.tsx`
- `apps/mobile/src/features/shelf/book-shelf.tsx`
- `apps/mobile/src/features/parent/parent-guide.tsx`
- `packets/packet-m005-build-local-parent-guide.md`
- `docs/CHANGELOG.md`

Tests run:
- Physical Expo Go navigation check by Dontavius - PASS: Shelf -> For grown-ups -> Parent Guide -> Start reading -> Mary reader -> Back to shelf.
- Code search for prohibited M005 features/APIs - PASS: no persistence, filesystem/database writes, network requests, analytics, accounts, authentication, PINs, family-member records, microphone, recording, voice playback, speech recognition/scoring, camera, or AI service work found in the touched scope.
- Allowed-file scope inspection - PASS.
- `cd apps/mobile && npx tsc --noEmit` - PASS.
- `git diff --check` - PASS with line-ending warnings only; no whitespace errors.

Result: Complete.

Known issues:
- The repo still contains other local mobile changes and packet files from the broader mobile sequence. This entry closes M005 only.

Rollback available: Yes - remove the Parent Guide component and the two navigation/entry changes, then run TypeScript and open the shelf in Expo Go.

Next recommended packet: continue the mobile packet sequence; do not resume web feature work unless explicitly requested.

---

Date: 2026-08-03
Packet: packet-m000-native-reading-slice
Approved by: Dontavius (mobile-primary pivot approved 2026-08-01; device proof confirmed 2026-08-03)

Changed:
- Closed the native mobile shelf-to-reader-to-word-speech slice.
- Recorded physical-device proof through Expo Go on a second phone.
- Confirmed desired silent-mode behavior: words speak when silent mode is off, do not play audible speech when silent mode is on, and speak again after silent mode is turned back off.
- Independently verified the M000 code boundary in the current repo state.

Files touched:
- `packets/packet-m000-native-reading-slice.md`
- `docs/CHANGELOG.md`

Tests run:
- Second-phone Expo Go test - PASS: app loaded, shelf opened, Mary reader opened, tapped-word speech worked.
- Silent-mode test - PASS: silent mode suppressed audible tapped-word speech; turning silent mode off restored speech.
- Code search for prohibited M000 features/APIs - PASS: no microphone, recording, speech recognition, camera, contacts, storage, accounts, analytics, backend/networking, or broad permissions found in the mobile/shared search scope.
- Speech path inspection - PASS: `expo-speech` is the only speech dependency and `apps/mobile/src/platform/speech.ts` is the only import site.
- `cd apps/mobile && npx tsc --noEmit` - PASS.
- `git diff --check` - PASS with line-ending warnings only; no whitespace errors.

Result: Complete.

Known issues:
- The repo already contains later local mobile work beyond M000. This entry closes M000 behavior and boundaries only; it does not close later packets.
- Vercel web Root Directory and Deployment Protection remain web maintenance items, not blockers for the mobile M000 closeout.

Rollback available: Yes - see the Rollback Plan in `packets/packet-m000-native-reading-slice.md`.

Next recommended packet: continue mobile work from the already-scoped local mobile packet sequence; do not open new web feature work unless web is explicitly resumed.

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

Date: 2026-08-01
Packet: none — cross-cutting infrastructure change, authorized directly by Dontavius
Approved by: Dontavius (2026-08-01, Executive Overseer vault chat)

Changed:
- **Mobile-primary platform pivot.** A native mobile app (Expo/React Native) was
  built in a separate, standalone repo (`LearningTreehouseMobile`) without an upfront
  vault decision. Discovered mid-session; Dontavius reviewed and approved the pivot:
  mobile is now the primary product target, web is secondary. Full incident and
  decision record: vault `VAULT_INTEGRITY.md` and `DECISION_LOG.md` → Process Decisions.
- **Repo restructured into an npm-workspaces monorepo:**
  - `apps/web/` — the existing Next.js app, moved intact (all history preserved via
    `git mv`)
  - `apps/mobile/` — the mobile app, brought in from the standalone repo
  - `packages/book-model/` — the book/page/word/activity contract and the Mary
    fixture, now a single shared source instead of two independently-copied
    versions (web's `src/types/book.ts` + `src/data/books.ts`, mobile's
    `src/domain/book.ts` + `src/content/books.ts` were near-duplicates of each other)
  - Root `package.json` declares workspaces; one root `package-lock.json` replaces
    the two independent lockfiles
  - `apps/web/next.config.ts` gained `transpilePackages` for the shared package;
    `apps/mobile/metro.config.js` (new) gained `watchFolders`/`nodeModulesPaths` so
    Metro can resolve it
- `packets/packet-m000-native-reading-slice.md` moved into this repo's `packets/`
  folder (previously only in the standalone repo). Amended: Status Draft → Approved
  with a recorded retroactive-approval circumstance; file paths and two
  now-superseded Allowed Changes items updated for the monorepo layout — see the
  packet's own Amendment section.
- `AGENTS.md`, `docs/AGENT_RULES.md`, `docs/BUILD_RULES.md`, `CLAUDE.md` updated:
  monorepo structure, mobile-primary framing, and a new "Platform / Architecture
  Pivot" escalation rule requiring Dontavius's approval before any future platform,
  framework, or repo change — before it happens, not after.

Files touched:
- Every file under the old `src/`, `public/`, and root config files (moved via
  `git mv` into `apps/web/`)
- New: `packages/book-model/` (4 files), `apps/mobile/` (copied from the standalone
  repo, two duplicated domain files deleted, imports repointed), `apps/mobile/metro.config.js`
- `package.json` (root, new), `.gitignore` (consolidated for monorepo-wide patterns)
- `packets/packet-m000-native-reading-slice.md`, `AGENTS.md`, `docs/AGENT_RULES.md`,
  `docs/BUILD_RULES.md`, `CLAUDE.md`, this file

Tests run:
- `npm install` at repo root — PASS (407 packages added across 3 workspaces)
- `npm run build --workspace apps/web` — PASS (routes `/`, `/_not-found`,
  `/books/[bookId]` all present). Noisy but non-fatal `pnpm`-related stderr from
  Next.js's own `@next/swc` lockfile self-heal probe — confirmed harmless (exit 0,
  correct output, one lockfile on disk); worth silencing later, not a defect today.
- `npm run lint --workspace apps/web` — PASS, no output
- `cd apps/mobile && npx tsc --noEmit` — PASS, no output
- `cd packages/book-model && npx tsc --noEmit` — PASS, no output (standalone check)
- Mobile device/simulator speech test — NOT RUN, remains open per `packet-m000`

Result: Complete for the restructuring itself. `packet-m000`'s own exit criteria
(device speech proof, independent verification) remain open.

Known issues:
- **Vercel Root Directory must change from `.` to `apps/web`**, or the next push to
  `main` will fail to build on Vercel. This requires the Vercel dashboard (Project →
  Settings → Root Directory) — outside what this session can do. `HV REQUIRED`.
- The `pnpm`-probe stderr noise above is cosmetic; consider investigating later.
- `npm audit` reports vulnerabilities across the larger dependency set (mobile adds
  Expo/React Native); not addressed here, same as the pre-existing web-only advisories
  noted in the `packet-000` entry.
- The original standalone `LearningTreehouseMobile` folder was renamed, not deleted,
  as a reversible safety measure — see `BUILD_DIARY` for the exact path.

Rollback available: Yes, but nontrivial — this is a repo-wide restructuring, not a
single feature. See the Rollback Plan pattern in `packet-m000`'s Amendment section for
the mobile-specific piece; the web move is a pure `git mv` and fully reversible via
`git revert` of this commit.

Next recommended packet: resolve the Vercel Root Directory HV REQUIRED item, then
either `packet-005-build-vocabulary-practice.md` (web) or a scoped mobile packet
covering the device speech proof for `packet-m000`.

---
