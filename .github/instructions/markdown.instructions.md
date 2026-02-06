---
applyTo: "**/*.md"
---

# Markdown instructions (markdownlint)

- Always keep Markdown changes **markdownlint-clean**.
- Use the repository ruleset in `.markdownlint.json` (and respect the rules that are explicitly disabled there).
- Before finishing a Markdown change, run `npx markdownlint-cli2` (uses `.markdownlint-cli2.jsonc`).
- Before addressing issues use the auto-fix option: `npx markdownlint-cli2 --fix` and fix any remaining issues manually.
- Don’t “fix” issues by disabling additional rules unless the project owner requests it.
- Shorthand for tables is fine. But ensure spaces around pipes for being markdownlint-clean (e.g. `| col1 | colu2 |` and `| --- | ---- |`).
- Never use `<!-- markdownlint-disable -->`

If `.markdownlint.json` is missing (shouldn’t happen), recreate it with the project’s disabled rules: `MD012`, `MD013`, `MD024`, `MD025`, `MD033`.
