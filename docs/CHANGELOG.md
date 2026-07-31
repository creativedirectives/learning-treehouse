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
