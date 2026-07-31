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

Result: Partial — local repo complete, remote/hosting deliverables not executed

Known issues:
- GitHub repo `creativedirectives/learning-treehouse` NOT created and nothing pushed —
  the `gh` CLI is not installed on this machine
- Vercel project NOT connected — the `vercel` CLI is not installed and the Vercel MCP
  connector is not authorized
- `git remote` is intentionally unset
- `npm audit` reports 12 high-severity advisories in transitive dev dependencies of the
  default scaffold. Not addressed in this packet — fixing them would mean changing
  dependency versions, which is outside this packet's allowed changes.
- `USER.md` is a small addition beyond a strict TCB mirror. It was added because the
  copied `PORTABLE_PACKET_WORKFLOW.md` lists `USER.md` as a required session-init read;
  omitting it would have left that reference pointing at a nonexistent file.

Rollback available: Yes — see the Rollback Plan in
`packets/packet-000-bootstrap-docs.md`. No prior commit exists, so rollback = delete
the project folder.

Next recommended packet: `packet-001-define-book-data-model.md` — blocked until
deliverables 6 and 7 of packet-000 are completed or explicitly deferred.

---
