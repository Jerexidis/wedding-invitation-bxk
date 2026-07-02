# Project context protocol

Read `docs/CODEBASE.md` and the generated `docs/INVITATIONS.md` before exploring
the repository. Treat them as the compact maps of the project, then use `rg` to
locate only the files relevant to the task.

- Do not scan `node_modules/`, `dist/`, media files, or every invitation.
- For invitation-specific work, read its `src/invitations/<slug>/index.jsx`,
  optional `config.json`, and only the components it imports.
- Shared invitation behavior lives under `src/components/invitation/`.
- Run `npm run context:check` after changing invitation structure or registry
  metadata. Run `npm run context:refresh` if the generated inventory is stale.
- Keep `docs/CODEBASE.md` current when routes, architecture, commands, data
  flows, or project conventions change materially.
- Before publishing, run `npm run publish:check`.
