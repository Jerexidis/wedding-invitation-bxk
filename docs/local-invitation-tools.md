# Local invitation tools

These tools are local-only. They do not install new packages and they do not deploy by themselves.

## Admin panel

Run the dev server and open `/admin`:

```bash
npm run dev
```

Available local actions:

- Create a new invitation with the wizard.
- Clone an existing invitation.
- Change an invitation slug/link.
- Validate an invitation before publishing.
- Review heavy image/audio assets.
- Publish with the existing git deploy flow.

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

## Notes

- The clone command updates `registry.js` because the SPA router needs a static import for the new invitation.
- Open Graph metadata is not changed automatically by the clone/rename CLI. Run validation and update `og-data.js` manually when you want share previews.
- Slugs must use lowercase letters, numbers, and hyphens.
- RSVP keys are generated with random bytes and stored as hashes in public `rsvp-access.json`.
- `publish:check` also verifies that generated context is current and that
  local admin endpoints, source identifiers, and raw-key files are absent from
  the production output.
