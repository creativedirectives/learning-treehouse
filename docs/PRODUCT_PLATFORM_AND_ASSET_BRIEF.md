# Learning Treehouse: Product, Platform, and Asset Brief

**Purpose:** Give every future product, design, implementation, and verification chat
the same durable direction before it proposes or changes work.

**Read with:** `AGENTS.md`, `docs/AGENT_RULES.md`, `docs/BUILD_RULES.md`, the active
packet, and the Learning Treehouse vault `DECISION_LOG.md`.

## Product North Star

Learning Treehouse helps a child read with a parent, sibling, or eventually a
grandparent. A book is not a static document; it is one learning container that can
power reading, word help, vocabulary, practice, comprehension, rewards, and future
shared reading.

The current MVP flow is immutable unless Dontavius records a new product decision:

```text
Shelf -> choose a book -> read the book -> book-powered activities -> Treehouse growth
```

The Treehouse is a cozy visual home, reward/progress space, and eventual Clubhouse
connection. It is not permission to create independent global libraries for games,
lessons, family activities, or coding.

## Parent-Guided Learning Frame

**“A parent-guided learning system that grows with every word your child reads.”**

Learning Treehouse gives parents practical ways to grow a child's vocabulary and
learning habits as AI changes the wider learning landscape. Stories, word help,
practice, and rewards are tools inside that parent-guided system; the product is not
an AI story generator.

RAIVL is the future learning method behind this direction. It should stay quiet and
parent-guided, not become a child-facing chatbot or tutor. The current app uses
local/mock mastery signals first; a real RAIVL Core integration requires its own future
packet and decision.

## Future Practice and Story Services

A future **Spelling Bee** is a book-powered practice experience: it opens from the
Treehouse or selected book and uses the current book's word targets. It must not become
a separate global spelling-content library. A separate companion app, plug-in, or
standalone surface is a later platform decision, not current scope.

Custom weekly-word stories are a possible parent-facing concierge service, not
self-service generation in the child app. A future controlled service may receive a
request, prepare a story with appropriate review, and later return a finished story to
the family with a simple “We’ll be back with your story” status. There is no current
upload, scanning, direct child prompt, account, cloud, or AI-service feature.

## Future Grade-Level Word Library and Teacher Use

**Parking lot only — not current implementation permission.** A later parent/teacher
learning layer may use human-readable Markdown as its authoring format, for example
`content/grades/grade-4.md`, with word, definition, example, practice prompt, related
skill, and book connection fields. The first intended audience is Grade 4 and above.

This is not a replacement for book-owned words: a book remains the contextual reading
container, while a future grade-level library could help a parent deliberately choose
what to practice. A future teacher experience must consume the same governed content
foundation rather than create a separate library.

Before any implementation, decide the content source/licensing, grade-skill framework,
review process, how book words map to library words, privacy boundaries, and whether
the work is parent-facing, teacher-facing, or both. Current scope does not authorize a
dictionary, curriculum library, teacher tooling, standards claims, parent input, or a
new app surface.

An optional future AI companion may help an adult prepare Markdown in the prescribed
format, but it is not the child-facing app and it is not an unbounded story generator.
The contract must be validated before content can render in Learning Treehouse. A
future ChatGPT-based companion would run within its own ChatGPT/OpenAI product boundary;
the native Learning Treehouse app must not assume it can consume a family's ChatGPT
subscription or that it receives account access. Any integration, import flow, content
review, or child-data handling requires a dedicated future safety and platform packet.

## Platform Direction

The native mobile app is the primary product surface. The web app is a secondary
prototype/reference surface that may remain useful, but it must not dictate the mobile
experience.

```text
apps/mobile/            Primary Expo / React Native client
apps/web/               Secondary Next.js reference client
packages/book-model/    One shared book, page, word, activity, reward, and fixture model
```

Both apps must import the book model. Do not copy book types or fixture content into an
app. Rebuild UI per platform; do not attempt to port Next.js routes, Tailwind styles,
or DOM components directly into mobile.

## What We Build First

The first safe mobile vertical slice is:

```text
Shelf -> Mary Had a Little Lamb reader -> tap a word -> hear device text-to-speech
```

This proves the child-facing reading loop on a real phone/tablet. Device text-to-speech
is allowed because it does not need microphone, camera, account, contact, location,
cloud storage, analytics, or a family-data system.

Before building more native features, test this slice on a physical iPhone or iPad.
Check touch comfort, readability, device speech audibility, and iPhone silent-mode
behavior.

## Future Read Together, Family Circle, and Clubhouse

The intended future experience is valid but deliberately staged:

1. **Word Help:** device speech now; optional family-recorded word pronunciation later.
2. **Local Read Together:** page-specific record, replay, delete, and rerecord on one
   device only.
3. **Family Circle:** adult-controlled invites and secure sharing with grandparents or
   other approved adults.
4. **Artifact Passport:** future museum cards, QR keepsakes, reading rewards, and
   physical collectibles can become saved Clubhouse artifacts.
5. **MR Clubhouse:** a separate future Unity/Quest client may present shared artifacts
   in mixed reality. This is a Learning Treehouse concept and is unrelated to the
   separate PreTenPlay (PTP) project, even though both may eventually use Unity/Quest.

The later phases are not implementation permission. They require dedicated packets and
new safety decisions. `AGENTS.md` → "Do Not Build Yet" is the canonical deferred-scope
list; this roadmap does not replace, expand, or independently authorize that list.

## Family Safety Boundary

Family Circle is parent-controlled, not a child social network. The recommended eventual
model is adult-managed learner profiles, adult-only invites, no child search/discovery,
no open chat, least-privilege access, clear consent, deletion, and revocation rules.

Child voice recordings, shared family data, and public/external testing are safety and
privacy milestones, not ordinary UI tasks. Escalate them before implementation.

## Asset Intake and Folder Contract

Artwork is modular. Keep original art, approved art, and app-specific exports separate
so a book or visual area can evolve without affecting the whole product.

**Target structure — not current state:** the category folders shown below have not
been built. At present, `apps/mobile/assets/` contains only the flat Expo template
assets. Create each target category only when approved artwork for that category
arrives.

```text
assets/
  source/                         Original masters; never imported by an app
  approved/                       Approved assets and provenance records

apps/mobile/assets/
  brand/                          App icon, splash, wordmark
  ui/                             Buttons, controls, decorative interface pieces
  environments/                  Treehouse, shelf, sky, background art
  characters/                    Reusable original characters
  books/<book-id>/               Book cover, page illustrations, local art exports
  rewards/                       Stickers, lanterns, collectible visuals

apps/web/public/art/             Web-optimized counterparts of approved assets
  brand/
  ui/
  environments/
  characters/
  books/<book-id>/
  rewards/
```

Do not bulk-create empty folders or import placeholder/reference art as production art.

For every accepted asset, record a small manifest entry with:

- stable asset ID and descriptive name
- source/origin and creator
- license or permission status
- approved date and intended product use
- source master path
- mobile and web export paths
- owning book/page, if applicable

Modern covers, illustrations, character designs, and audiobooks are not made reusable
by a public-domain story text. Verify each asset separately.

## Working Rules for Future Chats

1. Read this brief and the active packet before proposing implementation.
2. Keep all activities book-powered; do not introduce a separate branch content system.
3. Add shared book/content changes only in `packages/book-model/`.
4. Keep web and mobile UI changes inside the appropriate app.
5. Use a scoped packet for every implementation, asset intake, or platform change.
6. Verify on actual mobile hardware before treating native interaction or audio as done.
7. Do not push real book content or feature work to the public web deployment until
   Vercel Deployment Protection is confirmed.

## Immediate Recommended Sequence

1. Keep the native mobile app as the primary active surface; web remains shelved unless
   Dontavius explicitly reopens web work.
2. Preserve the verified reading loop: shelf, Mary reader, tappable words, device
   speech, silent-mode behavior, and the local Parent Guide entry.
3. Use physical iPhone/iPad Expo Go checks for future native interaction or audio
   claims. Simulator checks are useful smoke tests only.
4. Scope the next book-powered practice packet narrowly, likely Spelling Bee from the
   selected book's own words. Do not create a separate app or independent word library.
5. Intake artwork through the target folder contract only as original, approved assets
   become ready.
