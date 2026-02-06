# Fork Workflow Instructions

This repository is a fork of [cmiic/pdf-regex-to-table](https://github.com/cmiic/pdf-regex-to-table).

## Branch Structure

| Branch | Purpose | Tracks |
| --- | --- | --- |
| `main` | Deploy to GitHub Pages | `origin/main` |
| `upstream-sync` | Working branch with fork customizations | `upstream/main` |
| `feature/*` | Clean contributions to upstream | `upstream/main` |

## Remotes

- `origin` — BG-BRG-Enns fork (this repo)
- `upstream` — cmiic/pdf-regex-to-table (original)

## Workflows

### Daily Development (fork-specific work)

Work on `upstream-sync`, then merge to `main`:

```bash
git checkout upstream-sync
# make changes
git commit -m "feat: something"
git push origin upstream-sync
git checkout main
git merge upstream-sync --no-edit
git push origin main
```

### Contributing to Upstream

Create a feature branch from `upstream/main` (not from `main` or `upstream-sync`):

```bash
git fetch upstream
git checkout -b feature/my-feature upstream/main
# make changes (NO fork-specific branding/logos)
git commit -m "feat: description"
git push -u origin feature/my-feature
gh pr create --repo cmiic/pdf-regex-to-table --title "feat: description" --body "..."
```

After PR is merged upstream:

```bash
git fetch upstream
git checkout upstream-sync
git merge upstream/main --no-edit
git push origin upstream-sync
git checkout main
git merge upstream-sync --no-edit
git push origin main
```

### Syncing Upstream Changes

When upstream has new commits:

```bash
git fetch upstream
git checkout upstream-sync
git merge upstream/main --no-edit
git push origin upstream-sync
git checkout main
git merge upstream-sync --no-edit
git push origin main
```

## Fork-Specific Files

These files contain BG-BRG-Enns branding and must NOT be included in upstream PRs:

- `public/favicon.ico`
- `public/img/*`
- `public/manifest.webmanifest`
- `src/assets/img/*`
- `src/assets/logo.svg`
- `src/components/PageHeader.vue` (logo reference)

## Rules

1. **Never cherry-pick** — use proper merge workflow
2. **Feature branches for upstream** — always branch from `upstream/main`
3. **Keep upstream PRs clean** — no fork branding in contributions
4. **Merge, don't rebase** — preserves history for both forks
