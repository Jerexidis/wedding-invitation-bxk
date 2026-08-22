# Codebase map

Compact project context for humans and coding agents. Read this first; inspect
implementation files only when the current task requires them.

For a current per-invitation index, read `docs/INVITATIONS.md`. It is generated
from the registry, entry points, configs, and public asset folders; refresh it
with `npm run context:refresh`.

Custom invitations may include a short `DESIGN.md` describing durable art
direction and constraints. Use `docs/DESIGN-BRIEF-TEMPLATE.md` as the template;
new invitations created by the local admin receive one automatically.

## Purpose and stack

Invita-Ya is a multi-invitation React SPA. Each event is available under a slug,
with reusable invitation sections, custom designs, RSVP handling, social share
metadata, and local-only invitation administration.

- React 18, React Router 7, Vite 5
- Tailwind utility classes plus global/invitation-specific CSS
- GSAP for the richer template animations
- Supabase table `rsvp` for stored confirmations
- Supabase Storage bucket `shared-album` for public event photo uploads
- Vercel edge middleware for bot-specific Open Graph HTML
- `sharp` in local tooling for asset analysis/optimization

## Runtime map

```text
index.html
  -> src/main.jsx (BrowserRouter)
     -> src/App.jsx
        /                       -> Showcase
        /album                  -> public shared event photo album
        /privacidad             -> public privacy policy and Google API disclosures
        /terminos               -> public terms of service
        /i/:slug                -> registry lookup -> lazy invitation component
        /i/boda-lorena-y-arturo/album -> Supabase-themed guest photo album
        /i/gretel-y-geraldine/album    -> private Google Drive-backed guest album
        /i/:slug/rsvp           -> protected RSVP dashboard
        /admin                  -> local development only
        anything else           -> 404
```

`src/invitations/registry.js` is the runtime source of truth for enabled slugs,
lazy imports, event type, RSVP mode, demo status, event date, and portfolio
gallery permission. The first enabled entry is the default invitation if none
has `isDefault`.

Opening `/i/<slug>?portfolio=1` hides personal galleries unless that registry
entry explicitly has `portfolioGalleryAllowed: true`.

## Invitation architectures

There are four patterns. Identify the target pattern before making changes.

### Shared config renderer

Small `index.jsx` imports `config.json` and renders
`src/components/DynamicInvitation.jsx`.

Current slugs:

- `alexa-y-santiago`
- `erik-shady-bermejo`
- `isabella`
- `jose-raul`

Shared section order:

```text
Hero -> Intro -> Padrinos? -> Countdown -> Events -> DressCode?
     -> Gallery? -> Gifts -> Itinerary? -> RSVP -> Footer
```

Change `src/components/invitation/` when behavior should apply to all config
invitations. Change one invitation's `config.json` for its content, theme,
assets, event data, or enabled sections.

Config convention:

```text
slug, eventType, title, theme, hero, seo?, intro, padrinos, countdown,
calendar, events, dressCode, gallery, gifts, itinerary, rsvp, footer
```

`DynamicInvitation` derives media URLs from
`/invitations/<config.slug>/...`, injects theme fonts/CSS variables, and updates
browser SEO metadata.

### Shared sections with custom composition/overrides

These use config data but customize layout or replace selected shared sections:

- `andre-joel`
- `despedida-kass-brian`
- `maria-loyola`
- `michel-mtz`
- `victoria-rojas`

Start with that slug's `index.jsx`. Read an `*Override.jsx` only if the entry
point imports it. Do not assume a fix in a shared section reaches an override.

### Dedicated component suites

These own most or all of their section components:

- `kassandra-brian/components/`
- `melani-marisol/components/`

Treat these as isolated designs. Shared fixes may need an explicit equivalent
change here.

### Self-contained portfolio templates

These are large standalone demo components, with their own CSS/design logic:

- `plantilla-boda-editorial`
- `plantilla-rapunzel-xv`
- `plantilla-fiesta-casual`

They do not follow the shared `config.json` contract.

## Important directories and files

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Routes, lazy loading, portfolio privacy, error boundary |
| `src/invitations/registry.js` | Enabled invitations and route metadata |
| `src/components/DynamicInvitation.jsx` | Shared config-driven composition |
| `src/components/invitation/` | Reusable visual/functional sections |
| `src/invitations/<slug>/` | Per-event config and custom React code |
| `public/invitations/<slug>/` | Per-event images, audio, RSVP access hash |
| `src/utils/themeEngine.js` | Theme variables and Google Font injection |
| `src/utils/rsvpStore.js` | Supabase CRUD for table `rsvp` |
| `src/utils/albumStore.js` | Shared-album image validation, optimization, upload, and listing |
| `src/album/` | Public mobile-first shared event album page |
| `src/components/RsvpDashboard.jsx` | Confirmation list/edit/delete UI |
| `og-data.js` | Server-side social preview metadata by slug |
| `middleware.js` | Vercel bot detection and preview HTML |
| `scripts/invitation-tools.mjs` | Clone, rename, validate, preflight, assets |
| `scripts/invitation-lifecycle.mjs` | Draft activation planning, OG generation, and rollback |
| `scripts/publication-history.mjs` | Local publication history and non-destructive restore |
| `plugins/devAdminPlugin.js` | Local Vite `/api/*` invitation/admin endpoints |
| `src/admin/` | Local-only admin and wizard UI |

`src/admin/` and `plugins/` are intentionally ignored by Git. Production builds
do not include the admin route or Vite admin API.

Custom drafts remain private until the local admin activation flow is confirmed.
Activation validates the manifest, generates a 1200x630 Open Graph image,
registers the public route, updates `og-data.js`, marks the manifest as
published, creates RSVP access when needed, and refreshes the generated
inventory. It does not commit, push, or deploy. The lifecycle mutation restores
the touched files if any activation step fails.

Publishing from the local panel records the previous and published Git commits
under ignored `.invita-history/`. Restoring the latest publication requires a
clean worktree and no later commit; it writes the previous version back as
reviewable local changes without resetting Git or pushing automatically.

## RSVP flow

The registry advertises one of four modes:

- `whatsapp`: compose and open a WhatsApp confirmation.
- `supabase`: insert a row into Supabase.
- `mixed`: store in Supabase, then continue to WhatsApp.
- `none`: no confirmation workflow.

Shared RSVP behavior is in `src/components/invitation/RSVP.jsx`; some custom
invitations have their own RSVP component or override.

Supabase uses:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Without them, `src/utils/supabase.js` exposes a safe no-op client and RSVP
operations return a configuration error instead of breaking the SPA.

## Shared album flow

The public `/album` route is intentionally independent from invitation slugs.
Guests can upload JPEG, PNG, WebP, or browser-decodable HEIC images to
`shared-album/evento-principal/` in Supabase Storage and see the newest public
photos. Invitation-specific albums reuse the same UI and storage helper with a
nested event folder; Lorena and Arturo use
`shared-album/evento-principal/boda-lorena-y-arturo/`. Images are converted to
JPEG and resized to a maximum 2400px edge in the browser before upload. Storage
RLS allows anonymous read and insert for that bucket/folder only; guests cannot
update or delete objects.

Gretel and Geraldine use the same browser-side validation and optimization but
send the prepared JPEG to `/api/albums/gretel-y-geraldine`. Private Vercel Node
functions upload to and list a folder owned by the administrator's Google Drive
account through OAuth. The Drive folder remains private: image display and
individual downloads are proxied by a route that verifies every requested file
belongs to that folder. Server-only variables are documented in `.env.example`;
they must never use the `VITE_` prefix.
`ALBUM_ALLOWED_ORIGINS` must include the exact public front-end origin
(`https://eventos.invita-ya.com` in production); multiple origins are separated
with commas.

The dashboard route fetches
`public/invitations/<slug>/rsvp-access.json`, validates the supplied key in the
browser, then uses `rsvpStore` to read/update/delete confirmations. Public files
contain a SHA-256 hash; raw local keys live in ignored
`plugins/rsvp-keys.json`.

## Social previews

Browser-side meta tags come from invitation config/React. Link-preview bots do
not execute the SPA, so `middleware.js` intercepts known crawler user agents and
serves HTML using `og-data.js`.

When adding or renaming an invitation, keep these aligned:

1. `src/invitations/registry.js`
2. the invitation's `config.json`/entry point
3. `public/invitations/<slug>/`
4. `og-data.js`
5. RSVP access files when using Supabase or mixed mode

The shared clone workflow generates a dedicated 1200x630 OG image and metadata
entry automatically. The rename workflow updates the OG key and invitation image
path. These behaviors apply to both the local panel and CLI.

## Local workflows

```bash
npm run dev                 # Vite app and local /admin API
npm run build               # production build
npm run lint                # ESLint
npm run invite:schema       # formal schema validation for config invitations
npm run invite:consistency  # read-only registry/config/OG comparison
npm run invite:validate     # validate all invitations
npm run invite:preflight    # validation plus asset checks
npm run invite:starter      # dry-run custom artistic scaffold
npm run context:check       # fail if the compact inventory is stale
npm run context:refresh     # regenerate the compact inventory
npm run review:quick        # refresh context + schema/consistency/preflight checks
npm run publish:check       # required pre-publish check + production build
npm run test:routes         # browser smoke tests for active invitations
npm run release:check       # publish checks + affected routes (or all if shared)
npm run release:check:full  # publish checks + every active route
```

The admin quality center uses `review:quick` for fast iteration. Publishing
automatically runs `release:check`: invitation-local changes test only the
affected active routes, while shared, registry, dependency, tooling, or unknown
changes fall back to every active route. `release:check:full` remains available
for an explicit complete pass. New wizard-uploaded photos are optimized
automatically; existing heavy images can be compressed from an invitation's
Assets report.

Targeted invitation tools:

```bash
npm run invite -- validate <slug>
npm run invite:assets -- <slug>
npm run invite:optimize -- <slug>          # dry run
npm run invite:optimize -- <slug> --write
npm run invite -- clone <source> <target> --title "..."
npm run invite -- rename <old> <new>
```

More detail: `docs/local-invitation-tools.md`.

The `deploy` script stages, commits, and pushes. Do not run it unless deployment
was explicitly requested.

## Efficient exploration rules

1. Search the registry for the slug.
2. Read only its entry point and config.
3. Follow imports for the affected section.
4. Check the shared component only if that invitation actually uses it.
5. Ignore `node_modules/`, `dist/`, binary media, logs, and unrelated slugs.
6. For visual changes, run the target route and verify it in a browser.
7. For cross-cutting changes, search both shared and custom implementations.

Useful searches:

```bash
rg -n "<slug>|<symbol>" src scripts plugins og-data.js middleware.js
rg -n "from .*components/invitation|Override" src/invitations
rg -n "addConfirmation|rsvpMode|whatsapp" src
```

## Maintenance rule

Update this file only for durable context: new routes, invitation patterns,
shared data flows, tooling, validation requirements, or architectural
conventions. Do not turn it into a changelog or duplicate component internals.

`docs/INVITATIONS.md` and `docs/invitations.inventory.json` are generated
artifacts. Do not edit them by hand.
