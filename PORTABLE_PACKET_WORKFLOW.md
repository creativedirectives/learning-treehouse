# Portable Packet Workflow
### Version 2.0

---

## v2 Change Log

| Section | Change |
|---|---|
| 7 - Packet Status Lifecycle | NEW. Defines explicit allowed Status values and transitions. |
| 8 - Rollback Requirements | NEW. Rollback Plan promoted from optional to required for qualifying packets. |
| 10 - Audit Packet Template | NEW. Standard output format for audit packets. |
| 20 - Session Initialization | NEW. Required reading and startup sequence before any session begins. |

All v1 content preserved. Sections renumbered to accommodate additions.

---

## 1. What This Is

This workflow is a `packet-driven development system`.

A `packet` is a small written work order that defines:

- what to build
- what not to touch
- what files may change
- how completion is checked
- what should happen next

The goal is to keep AI work controlled, reviewable, and easy to recover when something goes wrong.

---

## 2. Why Use It

Use this workflow when you want:

- smaller, safer implementation steps
- less scope drift
- clearer approvals
- easier audits
- easier handoff between different AIs
- better verification before trusting reported progress

This works especially well when:

- the founder is directing multiple agents
- the product has important constraints
- visual/design assets are sensitive
- the builder AI tends to overreach or assume too much

---

## 3. Core Rule

Do not build from vague goals.

Build from approved packets.

Every meaningful change should trace back to:

1. project rules
2. an approved packet
3. a verification step

---

## 4. Recommended File Structure

You can start with this:

```text
/docs
  BUILD_RULES.md
  CHANGELOG.md
  DATA_MODEL.md
  UI_CONTRACT.md
  ENV_CONTRACT.md
  VISUAL_ASSET_CONTRACT.md

/packets
  packet-000-bootstrap-docs.md
  packet-001-define-mvp.md
  packet-002-...

/audits
  audit-001-...

AGENTS.md
USER.md
PORTABLE_PACKET_WORKFLOW.md
```

Not every project needs every file, but the pattern should stay stable.

---

## 5. Packet Naming Convention

Use:

`packet-NNN-verb-noun.md`

Examples:

- `packet-000-bootstrap-docs.md`
- `packet-003-build-content-foundation.md`
- `packet-014-audit-end-to-end-loop.md`
- `packet-015-fix-copy-flow.md`

Why:

- keeps work ordered
- makes handoff easier
- reduces ambiguity in changelogs and prompts

---

## 6. Standard Packet Anatomy

Each packet should contain these sections:

```md
# Packet: packet-NNN-name

## Packet Header
Packet:
Date created:
Project:
Approved by:
Approved on:
Depends on:
Status:

## Purpose

## Problem Being Solved

## Allowed Changes

## Not Allowed

## Deliverables

## Asset Check

## Rollback Plan

## Test Steps

## Recommended Next Packet
```

Optional sections:

- `Approval Gate`
- `Assumptions to Approve`
- `Correction Note`

Note: `Rollback Plan` is required for any packet that meets the criteria in Section 8.
See Section 7 for allowed `Status` values.

---

## 7. Packet Status Lifecycle

The `Status:` field in every packet header must use one of these values only.
No other values are permitted.

| Status | Meaning |
|---|---|
| `Draft` | Written but not reviewed. Implementation must not begin. |
| `Approved` | Human has reviewed and signed off. Implementation may begin. |
| `In Progress` | Actively being built by an implementing agent. |
| `Complete` | Implementation done and verified against all deliverables. Changelog updated. |
| `Corrected` | Was marked Complete but had verified drift. A correction pass was applied and re-verified. |
| `Abandoned` | Work stopped before completion. Reason and last known state logged in CHANGELOG.md. |

**Transition rules:**

- A packet may only move to `Approved` after a human explicitly approves it.
- A packet may only move to `Complete` after verification against actual files, not self-report.
- A packet must move to `Corrected` - not edited back to `Complete` - if a completed packet is found to have drift.
- A packet moving to `Abandoned` must include a CHANGELOG entry explaining why.

**What not to do:**

- Do not silently rewrite a packet's Status without a corresponding CHANGELOG entry.
- Do not skip `Approved` by jumping straight from `Draft` to `In Progress`.
- Do not mark `Complete` before running the Test Steps section.

---

## 8. Rollback Requirements

`Rollback Plan` is **required** in any packet that meets one or more of these conditions:

- touches more than one existing file
- modifies a shared contract (ENV, data model, routing, type definitions)
- removes or renames anything
- changes a persistent state layer
- has a `Not Allowed` section longer than two items (a signal the packet is close to a sensitive boundary)

For packets that do not meet any condition above, `Rollback Plan` may be written as:

```text
Not required. Packet is additive only and touches no existing files or contracts.
```

**What a valid Rollback Plan must include:**

1. **What to restore** - identify the files, values, or state that would need to revert
2. **From where** - last known good commit, branch name, or manual restore instructions
3. **Verification step** - how to confirm the rollback succeeded (build passes, contract still valid, etc.)

**Example:**

```md
## Rollback Plan
1. Restore: `lib/types/session.ts` and `lib/store/sessionStore.ts`
2. From: last commit before this packet (`git revert HEAD`)
3. Verify: `npm run build` passes with no type errors; session flow test returns expected state shape
```

If no prior commit exists (first build session), write:

```text
No prior commit. Rollback = delete the following new files: [list them].
Verify: repo returns to pre-packet state; build passes.
```

---

## 9. Packet Types

Most projects will use these packet types:

- `bootstrap packets`
  - create rules, contracts, and docs first
- `foundation packets`
  - scaffold the app, types, content, storage, routing
- `feature packets`
  - build one user flow at a time
- `audit packets`
  - inspect the app without changing source
- `fix packets`
  - correct specific known issues only
- `polish packets`
  - visual and UX cleanup after core flows work

---

## 10. Audit Packet Template

Audit packets have a distinct structure from build packets.
They produce an inspection report - not a set of file changes.

**Key rules for audit packets:**

- No source files may be changed during an audit packet.
- If drift or issues are found, the audit packet outputs a recommended fix packet - it does not fix anything itself.
- The audit output is a written document saved to `/audits/`.

```md
# Audit: audit-NNN-name

## Audit Header
Audit: audit-NNN-name
Date created: YYYY-MM-DD
Project: [Project Name]
Requested by: [Human or packet reference]
Status: [Draft | In Progress | Complete]

## Scope
What is being inspected? Be specific: files, flows, contracts, visual assets, routing, state.

## Not In Scope
What is explicitly excluded from this audit?

## Inspection Checklist
- [ ] [Item to verify]
- [ ] [Item to verify]
- [ ] [Item to verify]

## Observations

### Confirmed Working
List what was inspected and found to be correct.

### Drift Found
List any gap between what exists and what was expected or contracted.
Be specific: file path, field name, contract reference.

### Risk or Ambiguity
List anything that is not clearly broken but is worth human attention.
Use `HV REQUIRED:` if it needs a decision before work continues.

## Recommended Actions
1. [Specific action or packet to address drift]
2. [Specific action or packet to address drift]

## Recommended Next Packet
`packet-NNN-name.md` or `audit-NNN-name.md`
```

---

## 11. Suggested Startup Sequence

For a new app, this is a strong default:

1. `packet-000-bootstrap-docs`
2. `packet-001-define-mvp`
3. `packet-002-normalize-doc-history` if needed
4. `packet-003-build-foundation`
5. `packet-004-build-state-or-persistence`
6. `packet-005+` one feature at a time
7. audit packet
8. fix packet
9. polish packet

Do not rush into UI polish before the core loop works.

---

## 12. Approval Model

A packet should be approved before implementation begins.

Good approval checkpoints:

- unclear scope
- content assumptions
- naming decisions
- route structure
- package/library selection
- anything that changes future packet numbering

If a packet depends on a human decision, isolate that decision clearly.

---

## 13. Verification Model

Never trust a completion report by itself.

Verify against the actual workspace.

Minimum verification habits:

- read the changed files
- confirm files are in the correct paths
- run the relevant build/test command
- inspect the changelog entry
- compare implementation against the packet deliverables

If the report says complete but the files disagree, the files win.

---

## 14. Changelog Discipline

Keep `CHANGELOG.md`:

- chronological
- factual
- packet-based
- free of duplicate entries

Each entry should say:

- date
- packet
- what changed
- tests run
- result

If a pass failed, record it honestly.
If a correction pass fixed it, log that separately.

Do not rewrite history unless the project intentionally approves a cleanup pass.

---

## 15. Human Attention Markers

Use simple markers so the project lead can skim quickly.

Recommended:

- `HV REQUIRED:` human must approve, verify, or decide something
- `HV NOTE:` important context worth noticing while skimming

Use them sparingly.
If every message is marked, nothing stands out.

Good use:

- approval needed
- blocker found
- assumption mismatch
- risky consequence

Bad use:

- repeating obvious status
- padding routine updates
- guessing what might matter

---

## 16. DDA Mode

If the project lead says `DDA just inspect`, stay in inspection mode only.

That means:

- inspect what exists
- summarize what it means
- point out risk or ambiguity
- do not shift into implementation momentum unless asked

This is useful when multiple AIs are being compared or calibrated.

---

## 17. AGENTS vs USER

Keep these separate:

`AGENTS.md`

- project-specific rules
- implementation constraints
- repo expectations
- coding workflow

`USER.md`

- how the AI communicates with the human
- attention markers
- verification style
- decision/request formatting

Why:

- prevents communication rules from getting mixed with product rules
- makes the human layer portable across projects

---

## 18. Recommended Working Roles

You can use one AI for all roles, but the workflow is stronger when the roles are distinct:

- `implementer`
  - builds the packet
- `verifier`
  - checks whether the implementation is actually correct
- `project lead`
  - approves packets and resolves decisions

Even if one AI does both build and review, it should mentally switch roles and verify from the files, not from memory.

---

## 19. Correction Pass Rule

If a packet was reported complete but was built incorrectly:

1. stop calling it complete
2. inspect the actual workspace
3. identify exact drift
4. make a correction plan
5. correct only the scoped issues
6. log the correction clearly

Do not hide a failed pass just because a later pass repaired it.

Update the packet Status to `Corrected`. Do not revert it to `Complete`.

---

## 20. Session Initialization

This workflow must live in the repo as a file, not only as a prompt paste.

The implementing AI must read the following at the start of every session, before touching any file or packet:

**Required reads:**

1. `PORTABLE_PACKET_WORKFLOW.md` - this file
2. `AGENTS.md` - project-specific rules and constraints
3. `USER.md` - communication and marker rules
4. The current in-progress packet file (if one exists)

**Required startup confirmation:**

Before implementation begins, the AI must state:

- which packet is being worked on
- its current Status
- what the first allowed action is

If no packet is `Approved`, the AI must not begin implementation.
The AI should surface the next unresolved dependency and wait for human direction.

**For human leads:**

At the start of each session, confirm the active packet before giving any build instruction.
If you are resuming mid-packet, confirm the last verified checkpoint before continuing.

---

## 21. Documentation Closeout Gate

At the end of any meaningful feature, scene, device proof, troubleshooting,
or corrective work, the agent must complete this gate before closing the session.

1. Agent must report whether any project docs need to be updated as a result
   of this work.
2. Agent must NOT auto-edit any documentation without explicit authorization
   from the project owner.
3. If docs need updating, agent surfaces the specific files and proposed
   changes and waits for approval.

This gate applies to:
- feature completion
- device proof pass or failure
- troubleshooting resolution
- corrective pass
- architecture or contract change
- any work that would make an existing doc inaccurate

This gate does not apply to:
- read-only inspection (DDA mode)
- draft proposals not yet approved
- work explicitly scoped to docs only

---

## 22. What Not To Do

Avoid these failure patterns:

- vague "build the app" prompts
- large multi-feature packets
- building before docs/contracts exist
- mixing audits with implementation
- trusting agent self-reports without checking files
- letting packet numbering drift silently
- changing unrelated files during a focused fix packet
- importing rules from one product into another without review
- beginning a session without reading the required files in Section 20
- marking a packet `Complete` before running Test Steps

---

## 23. Minimal Starter Prompt For A New Project

Use this when starting a new app with another AI:

```md
We are using a packet-driven workflow for this project.

Rules:
- Do not implement from a vague goal.
- Work from approved packet files only.
- Keep packets small and scoped.
- Verify against actual files, not just self-reported completion.
- Use packet names in the format `packet-NNN-verb-noun.md`.
- Keep CHANGELOG entries chronological and packet-based.
- If human attention is needed, mark it with `HV REQUIRED:`.
- If context is important but not blocking, mark it with `HV NOTE:`.
- If I say `DDA just inspect`, remain in inspection mode only.
- Before any session begins, read: PORTABLE_PACKET_WORKFLOW.md, AGENTS.md,
  USER.md, and the current in-progress packet file.
- Packet Status must only use the allowed values defined in the workflow.
- Rollback Plan is required for any packet that modifies existing files or contracts.

Your first task:
Create or refine the bootstrap docs and propose `packet-000-bootstrap-docs.md`
if it does not exist yet.
```

---

## 24. Minimal Packet Template

```md
# Packet: packet-NNN-name

## Packet Header
Packet: packet-NNN-name
Date created: YYYY-MM-DD
Project: [Project Name]
Approved by: [EDIT]
Approved on: [EDIT]
Depends on: [packet or none]
Status: Draft

## Purpose
[One short paragraph]

## Problem Being Solved
[What gap or issue this packet addresses]

## Allowed Changes
1. [Allowed file or area]
2. [Allowed file or area]

## Not Allowed
1. [Explicit constraint]
2. [Explicit constraint]

## Deliverables
1. [Concrete deliverable]
2. [Concrete deliverable]

## Asset Check
Does this packet involve protected visual or brand assets?
- [Yes/No and note]

## Rollback Plan
[Required if packet modifies existing files or contracts. See Section 8.]
1. What to restore:
2. From where:
3. Verify by:

## Test Steps
1. [How to verify]
2. [How to verify]

## Recommended Next Packet
`packet-NNN-next-name.md`
```

---

## 25. Final Principle

Small packets create trust.

The workflow is successful when:

- the human can skim and stay oriented
- the AI has less room to assume
- the repo history stays explainable
- mistakes are caught early
- corrections are cheaper than rebuilds

If you reuse only one thing from this document, reuse this:

`approved packet -> scoped implementation -> real verification -> honest changelog`
