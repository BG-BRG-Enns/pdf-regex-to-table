---
applyTo: "**/*.js"
---

# JavaScript instructions (ESLint)

- Always keep JavaScript changes **ESLint-clean** using the repo’s flat config in `eslint.config.js`.
- Before finishing a JS change, run `npx eslint . --fix` (or `npx eslint path/to/file.js --fix`) and fix any remaining violations.
- Don’t silence lint rules (e.g. `eslint-disable`) unless there’s no reasonable alternative.
- This repo formats JS via ESLint (see `.vscode/settings.json`); prefer `source.fixAll.eslint` over manual formatting.
