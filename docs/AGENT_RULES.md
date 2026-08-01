# AGENT_RULES.md — Learning Treehouse

## Agent Role

The AI agent's role is:
Help inspect, suggest, draft, build, test, and document approved MVP packets only.

The AI agent is not allowed to behave like an unsupervised product owner.

---

## BEFORE DOING ANYTHING — AI Must Check

Before drafting or building any feature, AI must confirm:

1. The feature is NOT in the "Do Not Build Yet" list in `AGENTS.md`
2. There is an approved packet for this work
3. All files to be touched are in the packet's allowed areas
4. `AGENTS.md` has been read — especially the book-centered architecture lock
5. The work does not change the primary child flow, the content engine, the first
   book, or the role of the Treehouse
6. The packet's "Depends on" dependency is marked Complete in `docs/CHANGELOG.md`

If any check fails: STOP and report. Do not proceed.

---

## Architecture Guardrail — NON-NEGOTIABLE

This rule exists because an externally drafted planning packet proposed a
branch-centered MVP (four independent content pipelines) that directly conflicted with
the already-locked book-centered architecture. It was caught and rejected rather than
silently adopted.

**Before implementing any navigation, screen, or content structure:**

1. Read the Architecture Lock section of `AGENTS.md`
2. Confirm the structure is book-centered: Shelf → choose a book → read →
   book-powered activities → Treehouse growth
3. Confirm every activity pulls from the same book JSON — not its own content file
4. If the work would introduce separate content libraries per activity type —
   STOP, this needs a new founder decision first
5. If uncertain — default to book-centered and ask

**Branch-centered architecture is never introduced silently. Ever.**

---

## AI Can Read — Default

1. All files in `/docs/`
2. All files in `/packets/`
3. All files in `/audits/`
4. All source files in the packet's allowed areas
5. `package.json` / `tsconfig.json` / env structure (not `.env` values)
6. `public/` folder structure (asset paths, not asset content)
7. The Learning Treehouse vault docs at
   `F:\FounderOS_Vault\05_SHARED_FRAMEWORKS\Projects\LearningTreehouse\` — **read only**

## AI Can Suggest — Default

1. Cleanup improvements within the current packet scope
2. Next packet candidates after the current packet completes
3. Book data model improvements (suggest only, not implement)
4. UI improvements (suggest only, not implement without an approved packet)
5. Content pipeline improvements (suggest only)

## AI Can Draft — Default

1. Packet documents
2. Audit reports
3. Changelog entries
4. Component code within packet scope
5. Copy and content within packet scope

## AI Can Edit With Approval — Default

1. Source files listed in the active approved packet
2. `docs/CHANGELOG.md` after packet completion
3. Book JSON content files, when the active packet covers them

## AI Should Never Do Automatically

1. Delete any data or files
2. Push changes to production, or promote a preview deployment to production
3. Change the book/page/word data shape without approval
4. Rename fields, components, or routes without approval
5. Modify any file not listed in the active packet
6. Introduce a branch-centered structure or per-activity content libraries
7. Install packages not approved in the active packet
8. Publish, email, export, or trigger external services
9. Create GitHub repos, new platform targets/apps, or change hosting settings without
   explicit approval — see `AGENTS.md` → Platform / Architecture Pivot
10. Write to the FounderOS vault at `F:\FounderOS_Vault\`
11. `git add .` or `git add -A` — stage by exact filename only
12. Add accounts, auth, cloud sync, or analytics
13. Assume RAIVL Core exists or import from it

---

## Child-Facing Product Rules

This app is used by children roughly grade K–4, alongside a parent, teacher, or sibling.

1. No external network calls from child-facing screens in MVP — local-first
2. No third-party trackers, ad SDKs, or analytics
3. Microphone recordings stay local in MVP — no upload, no cloud storage
4. No open text input that reaches another user
5. Reading level and copy should match the target age; when in doubt, simpler

---

## Human Communication Rule

See `USER.md` for the full communication contract. Summary:

1. Use `HV REQUIRED:` for any item needing human verification or action
2. Use `HV NOTE:` for high-signal items worth noticing while skimming
3. Put the marker near the top of the message
4. Highlight important filenames, packet names, and exact copy/paste text in backticks
5. Keep messages concise and easy to scan

---

## Project-Specific Rules

1. The book-centered structure is the core product. Any feature that bypasses,
   restructures, or replaces it requires a dedicated packet and founder approval.
2. One shared book JSON powers every activity. Any agent that builds separate content
   per mini-app has failed.
3. Voice notes reference both `bookId` and `pageId` — never book-level only.
4. Functionality before decoration. Do not polish before the loop works end-to-end.
5. RAIVL Core is not assumed to exist. Mock mastery tracking only until a Phase 3+
   integration packet says otherwise.
