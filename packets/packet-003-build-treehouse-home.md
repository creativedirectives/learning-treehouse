# Packet: packet-003-build-treehouse-home

## Packet Header

Packet: packet-003-build-treehouse-home
Date created: 2026-07-31
Project: Learning Treehouse (LT)
Approved by: Codex under the Light Governance Tier
Approved on: 2026-07-31
Depends on: `packet-002-build-mock-book-content` (Complete)
Status: Approved

Builder and verifier must be different agents.

## Release Guard — carried forward

Vercel Deployment Protection must be enabled and confirmed before any real content or
feature work from this packet is staged, committed, or pushed to `main`, and before any
deployment. Until confirmation, local testing only: do not stage, commit, push, deploy,
or change hosting settings for this work.

## Purpose

Replace the starter page with a simple local Treehouse shelf that begins the locked flow:
Shelf → choose a book → reader.

## Allowed Changes

1. Modify `src/app/page.tsx` to render the home screen from the local book fixture.
2. Create `src/components/book-shelf.tsx` for the presentational shelf/card list.
3. Modify `src/app/globals.css` only for minimal app-wide color, layout, focus, and
   reduced-motion foundations needed by this screen.

- The full Mary card links to `/books/mary-had-a-little-lamb` using Next.js navigation.
- Reader-only cards visibly state that they are preview/read-only and must not claim an
  unavailable activity works.
- Use CSS shapes/gradients and text only; no new visual assets or packages.
- Keep all displayed book data derived from `src/data/books.ts`.

## Not Allowed

1. Modify the book data model or fixture data.
2. Create the reader route, activity routes, recording behavior, progress state, or a
   separate branch/library navigation model.
3. Add dependencies, network calls, auth, analytics, storage, images, or external fonts.
4. Change layout metadata, package/config files, or any vault file.

## Deliverables

1. A child-readable, keyboard-accessible local shelf/home screen.
2. One visible, working entry point to the Mary reader route and honest reader-only cards.
3. A home screen that reinforces book-centered progression rather than four independent
   feature branches.

## Asset Check

No. Use code-native CSS only; do not use the external Treehouse reference illustration as
an imported asset or literal sitemap.

## Rollback Plan

1. Restore: `src/app/page.tsx`, `src/app/globals.css`; remove `src/components/book-shelf.tsx`.
2. From: `git revert <packet-003-commit>`.
3. Verify: `npm run lint` and `npm run build` pass and the project returns to its prior
   scaffold home screen.

## Test Steps

1. Run `npm run lint`, `npm run build`, and `git diff --check`; all pass.
2. In a local browser, open `/`: the four local book cards render; the Mary card navigates
   to `/books/mary-had-a-little-lamb` (the route may be added by the next packet).
3. Use keyboard Tab/Enter to activate the Mary card; visible focus is present.
4. Inspect the diff: only the three allowed files changed; no data duplication, external
   fetches, storage, auth, analytics, or branch-centered navigation was introduced.

## Recommended Next Packet

`packet-004-build-book-reader.md`
