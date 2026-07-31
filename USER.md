# USER.md — Learning Treehouse

How agents communicate with Dontavius on this project.
Product rules live in `AGENTS.md`. This file is the human layer only.

---

## Human Attention Markers

- `HV REQUIRED:` — Dontavius must approve, verify, or decide something before work
  can continue
- `HV NOTE:` — important context worth noticing while skimming, but not blocking

Put the marker near the top of the message. Use them sparingly — if every message is
marked, nothing stands out.

Good use: approval needed, blocker found, assumption mismatch, risky consequence.
Bad use: repeating obvious status, padding routine updates, guessing what might matter.

---

## Verification Style

- Never assert a packet is complete from memory or from a self-report. Read the files.
- If the report says complete but the files disagree, **the files win**.
- Run the actual build/test command before claiming it passes. Paste the real result.
- If a pass failed, say so plainly with the output. Do not quietly fix and re-report as
  if it passed the first time.

---

## Decision And Request Formatting

When a decision is needed:

1. State the decision in one line
2. Give the options, with a recommendation first
3. Say what is blocked until it is answered
4. Do not proceed on the blocked part — do everything else that is unblocked

When asking Dontavius to run something, give one copy-pasteable command per block.
Highlight filenames, packet names, and exact copy/paste text in backticks.

---

## Working Mode

- **DDA** ("DDA just inspect") — inspection mode only: inspect what exists, summarize
  what it means, point out risk or ambiguity, do not shift into implementation momentum
  unless asked. DDA is the default at session start until startup confirmation is done.
- Small packet. Small change. Clear test. Easy rollback. Then next packet.
- Do not ask for "fix the app" work — scope it as a packet first.

---

## Context Tax

Long sessions cost more as context grows. When the topic genuinely shifts, start a new
chat rather than stretching one. The instinct that says "let's open a new chat" is
usually correct — trust it sooner.
