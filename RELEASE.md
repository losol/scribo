# Releasing @eventuras/scribo

`@eventuras/scribo` is released with [Changesets](https://github.com/changesets/changesets)
and published to npm from GitHub Actions. This document covers the everyday flow
and the one-time setup that lives outside this repository.

## Release process

Releases are driven by changeset files. Do not edit `version` in
`packages/scribo/package.json` by hand.

1. **Describe the change** on your feature branch:

   ```bash
   pnpm changeset
   ```

   Pick the bump level and write the entry for whoever reads the changelog
   later. Review the generated file in `.changeset/` and edit it for clarity —
   it is copied verbatim into the changelog.

2. **Merge your pull request** into `main` with the changeset file included.

3. **Merge the version pull request.** The release workflow opens, or updates, a
   `chore: version packages` pull request that applies every pending changeset:
   it bumps `packages/scribo/package.json`, rewrites
   `packages/scribo/CHANGELOG.md`, and deletes the changesets it consumed.

4. **The workflow publishes** once that pull request lands on `main`. It builds
   the package, publishes to npm with provenance, pushes the git tag
   `@eventuras/scribo@x.y.z`, and creates the matching GitHub release from the
   changelog entry.

No manual `changeset version`, and no manual tagging.

## What the package ships

npm serves `packages/scribo/README.md` on the package page and reads the license
from `packages/scribo/LICENSE.md`. Both files also exist in the repository root,
which is where GitHub reads them instead. **Neither tool looks at the other's
copy**, so the two have to be updated together; CI fails the build if they drift
apart, or if the tarball is missing the README, license or changelog.

`CHANGELOG.md` lives only in `packages/scribo/`, because that is where Changesets
writes it.

## Setup outside this repository

### npm trusted publishing

Publishing authenticates over OIDC, so no npm token exists anywhere in this
repository. The trusted publisher registered on npmjs.com has to match this
repository exactly. When it does not, the OIDC token exchange returns 404,
`pnpm publish` falls back to an anonymous request, and npm rejects it with
`E404`.

Configure it on [npmjs.com](https://www.npmjs.com) under `@eventuras/scribo` →
Settings → Trusted Publisher → GitHub Actions:

| Field                | Value               |
| -------------------- | ------------------- |
| Organization or user | `losol`             |
| Repository           | `scribo`            |
| Workflow filename    | `scribo-release.yml` |
| Environment name     | `npm`               |

> The environment name has to match the `environment:` key on the `publish` job.
> Leave it blank on npmjs.com only if you also drop that key from the workflow.

### GitHub environment

The `publish` job runs in a GitHub environment named `npm`
(Settings → Environments). Trusted publishing needs no secrets there — the
environment exists so you can add protection rules, such as requiring a reviewer
or restricting deployments to `main`.

### Fallback: token-based publishing

If trusted publishing is not an option, create a granular access token with write
access to `@eventuras/scribo`, add it as a `NODE_AUTH_TOKEN` secret in the `npm`
environment, and pass it to the `publish` job in the workflow. Prefer trusted
publishing: it needs no long-lived credential and produces provenance on its own.

## Publishing by hand

Only when the workflow is broken and a release cannot wait:

```bash
cd packages/scribo
pnpm build
npm login --scope @eventuras --auth-type web
npm publish --access public
```

A manual publish gets no provenance attestation, and creates neither a git tag
nor a GitHub release, so tag the commit yourself afterwards.

## Workflow trigger

`.github/workflows/scribo-release.yml` runs on every push to `main` and decides
what to do on its own: pending changesets produce a version pull request, and a
version that is ahead of npm produces a publish.

It follows the [trusted publishing setup](https://changesets.dev/guide/automating#trusted-publishing)
from the Changesets docs. A `select-mode` job picks one of two paths: `version`
opens the version pull request, or `pack` builds and packs the tarballs that
`publish` then uploads. Only `publish` can mint the npm OIDC token, and it never
builds or runs dependency install scripts — keep it that way when editing the
workflow.
