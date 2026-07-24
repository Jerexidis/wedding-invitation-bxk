# Local invitation tools

These tools are local-only. They do not install new packages and they do not deploy by themselves.

## Simple workflow

On Windows, double-click `Abrir-Panel-InvitaYa.cmd`. It starts the local server
and opens `/admin` automatically. Keep its terminal window open while using the
panel.

Inside the panel, use **Revisión rápida** while editing. It refreshes generated
context and checks configurations, connected data, invitation structure, and
heavy assets without rebuilding or opening every invitation in the browser.
When you press **Publicar**, the panel runs **Revisión de producción**
automatically if the current changes have not passed it yet. It always keeps the
full build and production-boundary check, then tests only affected invitation
routes. Shared or structural changes automatically fall back to every active
route.

Each successful publication made from the panel stores local recovery metadata.
Use **Historial** to restore the version before the latest publication. Restore
is blocked when local changes or later commits exist, and it never pushes by
itself; review the restored changes and publish them through the normal flow.

## Admin panel

Run the dev server and open `/admin`:

```bash
npm run dev
```

Available local actions:

- Create a new invitation with the wizard.
- Review and prepare a completed custom draft as a local active invitation.
- Clone an existing invitation.
- Change an invitation slug/link.
- Validate an invitation before publishing.
- Review heavy image/audio assets.
- Compress heavy images from the Assets report. Wizard-uploaded photos are
  optimized automatically when a new invitation is created.
- Publish with the existing git deploy flow.
- Review local publication history and restore the previous release as pending
  local changes.

## CLI

Clone an invitation:

```bash
npm run invite -- clone victoria-rojas victoria-rojas-demo --title "XV Años | Demo"
```

Preview a custom artistic starter without writing files:

```bash
npm run invite:starter -- --slug evento-demo --title "Evento Demo" --event-type boda --reference plantilla-boda-editorial
```

Create the unregistered local draft after reviewing the file plan:

```bash
npm run invite:starter -- --slug evento-demo --title "Evento Demo" --event-type boda --reference plantilla-boda-editorial --write
```

The starter never edits `registry.js`, `og-data.js`, or production routes.
When the custom design is complete, select it in the panel and use **Preparar
activación**. The panel requires an event date and an image, generates the
1200x630 social preview, and updates the local registry, Open Graph data,
manifest, RSVP access, and generated inventory together. This action never
commits, pushes, or deploys.

Rename a slug/link:

```bash
npm run invite -- rename victoria-rojas-demo victoria-demo
```

Validate all invitations:

```bash
npm run invite:validate
```

Validate config-based invitations against the formal schema:

```bash
npm run invite:schema
```

Compare registry, config, public folders, and Open Graph without rewriting them:

```bash
npm run invite:consistency
```

Validate one invitation:

```bash
npm run invite -- validate victoria-rojas
```

Review assets:

```bash
npm run invite:assets -- victoria-rojas
```

Preview image optimization without writing files:

```bash
npm run invite:optimize -- victoria-rojas
```

Optimize images in place:

```bash
npm run invite:optimize -- victoria-rojas --write
```

Run the publish checklist:

```bash
npm run publish:check
```

Run the fast editing checklist:

```bash
npm run review:quick
```

Refresh or verify the compact agent context:

```bash
npm run context:refresh
npm run context:check
```

Verify an existing production build does not contain local admin tooling:

```bash
npm run production:boundary
```

Run browser smoke tests against every active invitation:

```bash
npm run test:routes
```

Run the complete local release gate:

```bash
npm run release:check
```

Force every active route regardless of the changed files:

```bash
npm run release:check:full
```

## Notes

- The clone command updates `registry.js` because the SPA router needs a static import for the new invitation.
- Clone automatically generates a dedicated 1200x630 `og-preview.jpg` and adds
  its `og-data.js` entry. Rename automatically moves the OG key and image path.
  Both operations are available from the panel and CLI.
- Slugs must use lowercase letters, numbers, and hyphens.
- RSVP keys are generated with random bytes and stored as hashes in public `rsvp-access.json`.
- `publish:check` also verifies that generated context is current and that
  local admin endpoints, source identifiers, and raw-key files are absent from
  the production output.
