@AGENTS.md

# Learning Treehouse — Session Startup

You are the implementing agent for Learning Treehouse (LT).
Read every file listed below before doing anything else.
Do not begin implementation until startup confirmation is complete.

---

## Required Reading — In This Order

1. `C:\Users\Dontavius\Claude projects\LearningTreehouse\AGENTS.md`
   — project-specific rules and the book-centered architecture lock

2. `C:\Users\Dontavius\Claude projects\LearningTreehouse\USER.md`
   — how to communicate with Dontavius: HV markers, verification style

3. `C:\Users\Dontavius\Claude projects\LearningTreehouse\docs\AGENT_RULES.md`
   — agent role, guardrails, what AI can and cannot do

4. `C:\Users\Dontavius\Claude projects\LearningTreehouse\docs\BUILD_RULES.md`
   — build constraints and coding standards

5. `C:\Users\Dontavius\Claude projects\LearningTreehouse\PORTABLE_PACKET_WORKFLOW.md`
   — packet system, status lifecycle, rollback rules

6. `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\STATUS.md`
   — current active lane, checkpoint, open decisions

7. `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\ACTIVE_LANES.md`
   — what this chat is allowed to touch and what it is not

8. `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\PACKETS.md`
   — packet index, find the current active packet

9. `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\DECISION_LOG.md`
   — locked decisions, including the book-centered MVP lock

10. The current active packet file in `packets/`

---

## Startup Confirmation Required

After reading, state:

1. Which packet is active and its current Status
2. What lane this chat is in
3. What this chat is NOT allowed to touch
4. Whether anything in this packet's scope would change the book-centered
   structure, the primary child flow, the first book, or the role of the Treehouse
   (if yes — STOP, this needs a new founder decision before any implementation)
5. Any `HV REQUIRED:` items that need a decision before work begins
6. That RAIVL Core is NOT assumed to exist or be callable — this project is
   standalone for now (Option C, see the vault DECISION_LOG)

Do not proceed until this confirmation is complete.
DDA until confirmation is given.

---

## Closeout — At Feature Boundaries, Not Every Session

LT runs a light governance tier (locked 2026-07-31, see `docs/BUILD_RULES.md`). There is
no per-packet closeout report and no per-packet vault round-trip. Keep moving between
packets.

**When a whole feature works** (e.g. "the reader screen works", not "types compile"):

1. What was built — specific files, screens working
2. What was tested and the actual result
3. What is known-broken or deliberately deferred
4. Whether a reusable insight came out of it worth a Trace Card
5. Recommended next feature

Write that to `BUILD_DIARY/YYYY-MM-DD.md` in the vault.

**When something fails three times**, log it in `TROUBLESHOOTING_LOG.md` before the fourth
attempt — symptom, what was tried, why each failed. Append the fix when found. Carry both
into the day's `BUILD_DIARY` entry.

**Escalate to Dontavius only for:** a real product or content decision, anything touching
child safety or voice recordings, money, or public launch.

---

## Core Rules (Summary)

- DDA by default — do not build from vague goals
- Work from approved packets only
- **Book-centered architecture is locked.** Shelf → choose a book → read the book →
  complete book-powered activities → earn Treehouse growth. Never replace this with
  a branch-centered architecture without an explicit new founder decision.
- One shared book JSON powers every activity type — do not build separate content
  per mini-app
- First fully-interactive book is *Mary Had a Little Lamb*
- Functionality before decoration — the loop works before anything gets polished
- Local-first MVP — no accounts, no auth, no cloud sync, no analytics
- RAIVL Core is not assumed to exist; mock mastery tracking only

Full rules in `AGENTS.md` and `docs/AGENT_RULES.md`. This is a summary only.
