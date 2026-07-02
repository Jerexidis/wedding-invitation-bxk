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

Rename a slug/link:

```bash
npm run invite -- rename victoria-rojas-demo victoria-demo
```

Validate all invitations:

```bash
npm run invite:validate
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

## Notes

- The clone command updates `registry.js` because the SPA router needs a static import for the new invitation.
- Open Graph metadata is not changed automatically by the clone/rename CLI. Run validation and update `og-data.js` manually when you want share previews.
- Slugs must use lowercase letters, numbers, and hyphens.
- RSVP keys are generated with random bytes and stored as hashes in public `rsvp-access.json`.
- `publish:check` also verifies that generated context is current and that
  local admin endpoints, source identifiers, and raw-key files are absent from
  the production output.
