---
applyTo: "**/*.{ts,tsx,d.ts}"
---

# TypeScript instructions (ESLint + tsc)

- Always keep TypeScript changes **ESLint-clean** using the repo’s flat config in `eslint.config.js`.
- Before finishing a TS change, run `npx eslint . --fix` (or `npx eslint path/to/file.ts --fix`) and fix any remaining violations.
- Always keep TypeScript changes **typecheck-clean** using `npm run typecheck` (runs `tsc -p tsconfig.json`).
- Don’t use `any` unless there’s no reasonable alternative; prefer `unknown` + runtime checks.
- Prefer `import type { ... }` for type-only imports.
- Don’t silence rules (e.g. `eslint-disable`) unless there’s no reasonable alternative.
