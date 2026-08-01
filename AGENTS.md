<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Learning Treehouse

Project-specific rules and implementation constraints.
Communication rules live in `USER.md`. Packet mechanics live in `PORTABLE_PACKET_WORKFLOW.md`.

---

## What This Project Is

A child (approx. grade K–4) opens a personal treehouse and picks a book from a shelf.
Each book is not a static story — it is a structured learning container
(pages → words → activities) that powers several mini-experiences from one shared
source of content: Read Together (parent/child voice recording per page),
Vocabulary Builder, Spelling Bee, Word Match, Comprehension checks, and a Treehouse
reward system.

Core loop:
Open Treehouse → Choose book → Read/listen to page → Record own reading →
Tap vocabulary word → Mini spelling/comprehension check → Earn Treehouse reward →
See reading partner's new page

**Platform priority (locked 2026-08-01):** the native mobile app is the primary
product target — it is the moat. The web app is a secondary/reference surface: it
keeps working and may keep getting packets, but mobile gets priority when the two
compete for attention. See `DECISION_LOG.md` → Process Decisions for the full record.

---

## Repo Structure — Monorepo (locked 2026-08-01)

This repo holds both platform targets and their one shared content model:

```
apps/web/            Next.js app (App Router, TS strict, Tailwind) — secondary surface
apps/mobile/          Expo app (React Native, TS strict) — primary product target
packages/book-model/  THE single source of book/page/word/activity types and the
                       Mary Had a Little Lamb + reader-only fixture content.
                       Both apps import from here. Neither app may keep its own
                       copy of the book contract or fixture.
docs/, packets/, audits/   Repo-wide governance — not nested per-app
```

Root `package.json` declares npm workspaces (`apps/*`, `packages/*`). One root
`package-lock.json` covers all three packages — do not create a per-app lockfile.

`apps/web/next.config.ts` lists `@learning-treehouse/book-model` under
`transpilePackages`, since the package ships raw TypeScript with no build step.
`apps/mobile/metro.config.js` adds `watchFolders`/`nodeModulesPaths` so Metro can
resolve the same package — see that file's comment for why.

**Before adding a third book, activity type, or platform surface:** it belongs in
`packages/book-model`, imported by whichever app(s) need it — never copied.

---

## Architecture Lock — NON-NEGOTIABLE

**The MVP is book-centered.** Locked 2026-07-31 by Dontavius. Full record:
`F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\DECISION_LOG.md`
→ Architecture Decisions.

Primary child flow:
**Shelf → choose a book → read the book → complete book-powered activities → earn Treehouse growth.**

A competing four-branch proposal (a Treehouse-map home with four independent branches —
Interactive Lessons, Reading, Family Activities, Games — each with its own separate
content pipeline) was reviewed and **explicitly rejected** as the current MVP
architecture. It was not deferred ambiguously and not silently dropped. It remains a
valid *future* expansion only, after the first book loop is proven.

**Standing rule, binding on every agent and session:** no agent may replace
book-centered with branch-centered architecture. Any proposal that changes the primary
flow, the content engine, the first book, or the role of the Treehouse must be
presented to Dontavius as a new product decision and locked in the vault
DECISION_LOG **before** any implementation proceeds from it.

The Learning Treehouse illustration is approved as visual inspiration, brand/atmosphere
direction, a possible future activity map, and a future navigation model. It is
**not** approved as a literal MVP sitemap, and labels visible in the reference art do
not become separate MVP content systems.

Any branch-like paths shown during MVP ("Read the Story," "Learn the Words,"
"Match the Words," "Practice Spelling," "Answer Story Questions," "Complete a Family
Activity," "Earn a Treehouse Reward") are different experiences powered by the same
book's content — not separate libraries.

---

## Content Rule — The Book Is The Content Source, Not The Curriculum

Every book is structured as JSON: pages → words → activities. Vocabulary Builder,
Spelling Bee, Word Match, Comprehension, and Read Together all pull from the same book
data. **Do not build separate content per mini-app.**

Related locked content rules:

- First fully-interactive book: *Mary Had a Little Lamb* (public domain, 6–8 pages).
  Build 3–4 other books as partially-loaded/basic-reader-only to populate the shelf.
- Voice notes attach to a **specific page**, not the whole story. `VoiceNote` records
  reference both `bookId` and `pageId` — this is what enables "parent reads page 1,
  child reads page 2." Do not simplify to book-level-only attachment.
- Book source tiers: public-domain classics; open-license modern children's stories
  (verify license per book before commercial use); custom family/keepsake books.
  Original text being free does not make modern covers, illustrations, audiobooks, or
  character designs free.

---

## BEFORE DOING ANYTHING — AI Must Check

1. There is an approved packet for this work (Status: `Approved`)
2. All files to be touched are in the packet's allowed areas
3. The work is NOT in the "Do Not Build Yet" list below
4. The work does not alter the book-centered architecture lock
5. The packet's "Depends on" dependency is `Complete` in `docs/CHANGELOG.md`

If any check fails: STOP and report. Do not proceed.

---

## Do Not Build Yet

Deferred — not part of the first MVP:

1. User accounts, authentication, cloud sync, or analytics
2. A separate Interactive Lessons library, Games catalog, or Family Activities library
   as independent systems
3. Four independent branch content pipelines
4. ABC curriculum or coding curriculum as independent systems
5. Multiple complete books before the first book loop is validated
6. Parent- or teacher-created content
7. Classroom/teacher tooling
8. Subscriptions, marketplace, or public sharing
9. AI tutoring or advanced pronunciation scoring
10. Full RAIVL Core integration
11. App-store publication

If a requested feature is on this list: stop, report, and ask Dontavius whether the
scope has changed. Do not proceed until the vault DECISION_LOG is updated and
re-approved.

---

## Platform / Architecture Pivot — Escalate BEFORE It Happens

Locked 2026-08-01, after a mobile app was fully built in a separate, ungoverned repo
before the decision to build it was ever brought to Dontavius or recorded anywhere.
The work itself was disciplined — it just never should have started without this step.
Full incident: `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\VAULT_INTEGRITY.md`.

**Stop and escalate to Dontavius before writing any code if the work involves any of:**

1. Starting an app on a new platform or framework for a product that already has one
2. Creating a new repo or workspace for a project that already has one
3. Anything that could make already-committed or already-approved work obsolete
4. Any change to which surface is the flagship/primary target for a product

One sentence is enough to escalate: what's changing, and why. Wait for a yes before
touching a filesystem.

**If this is discovered after the fact** (code already exists, no prior decision on
record): do not delete or hide it. Freeze it — no further building — until Dontavius
makes the actual call, it is logged in `DECISION_LOG.md`, and the new repo/surface is
brought into at least minimal vault governance.

---

## RAIVL Core — Not Assumed

Learning Treehouse is standalone for now (Option C, vault DECISION_LOG 2026-07-28).
RAIVL Core is intended to sit underneath eventually as the mastery engine, but:

- Do not assume RAIVL Core exists or is callable
- Do not import from it, stub a client for it, or block a phase on it
- Phase 1–2 use **local, mock** progress tracking (per-word seen/missed counts, simple
  "needs review" flags) directly in the app
- Wiring to real RAIVL Core is a Phase 3+ packet, logged in both this project's and
  RAIVL's DECISION_LOG when it happens

---

## Build Order — Functionality Before Decoration

book data structure → reader screen → record/playback → vocabulary tap →
spelling mini-test → comprehension question → basic progress tracking →
simple Treehouse reward → **then** visual polish.

Define the cozy-treehouse visual identity early conceptually, but do not spend build
time decorating before the core loop works end-to-end.

---

## Scope Guardrail — The 25-Book Library Is A Pitch Layer

Do not build 25 fully interactive books for MVP. MVP = 1 fully interactive book +
2–4 partial books + 1 custom keepsake demo. The 25-book claim is investor/partner pitch
framing, not an engineering target.

---

## AI Should Never Do Automatically

1. Delete any data or files
2. Push to production, or promote a preview deployment to production
3. Rename fields, components, or routes without approval
4. Modify any file not listed in the active packet
5. Install packages not approved in the active packet
6. Publish, email, export, or trigger external services
7. Create GitHub repos, new platform targets/apps, or change hosting settings without
   explicit approval — see "Platform / Architecture Pivot" above
8. Touch the FounderOS vault at `F:\FounderOS_Vault\` — this repo's lane reports to the
   vault, it does not write to it
9. `git add .` or `git add -A` — stage by exact filename only
10. Introduce accounts, auth, cloud sync, or analytics

---

## Lane Boundary

This repo is **Lane 1 — Product Build**.

| Content type | Correct lane |
|---|---|
| Mobile (Expo) implementation — `apps/mobile` | Lane 1 — this repo, primary surface |
| Web (Next.js) implementation — `apps/web` | Lane 1 — this repo, secondary surface |
| Shared book model — `packages/book-model` | Lane 1 — this repo, imported by both apps |
| Vault docs, packet status, project tracking | Lane 2 — FounderOS vault chat |
| RAIVL architecture / mastery engine questions | RAIVL project vault docs |

Closeout reports go back to the vault chat. Dontavius applies vault updates there.
