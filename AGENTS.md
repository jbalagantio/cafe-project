# Personal Development Rules for Codex

> Development-only instructions. These rules guide how Codex edits this repository. They are not application requirements and should not be shipped as client documentation.

## 1. Primary objective

Write HTML, CSS, and JavaScript in a consistent, readable, beginner-maintainable style that the developer can study, explain, and change without relying on an AI agent.

**Priority order:** correct behavior and security → accessibility → preservation of existing functionality → consistency with developer-written examples → readability → brevity.

Before editing, inspect the relevant files and any developer-authored examples. Do not assume AI-generated code represents the developer's preferred style. When examples conflict with this guide, ask before making a broad convention change.

## 2. General formatting

- Use four spaces for indentation; do not use tabs.
- Use clear, descriptive names. Keep existing public APIs, IDs, classes, storage keys, and event contracts unchanged unless specifically authorized.
- Keep related logic together and separate unrelated responsibilities.
- Use whitespace and section headings to make long files navigable.
- Do not minify or compress source code.
- Do not reformat unrelated files or make unrelated architectural changes.
- Avoid new dependencies, frameworks, build tools, or abstractions unless the task requires them.
- Prefer simple, explicit code over clever one-liners, but do not artificially expand trivial expressions.

## 3. HTML conventions

- Use semantic elements such as `header`, `nav`, `main`, `section`, `article`, `form`, and `footer` where appropriate.
- Use four-space indentation for nested elements.
- Use lowercase tag and attribute names, and double quotes around attribute values.
- Keep markup easy to scan; avoid unnecessary wrappers and deeply nested structures.
- Keep CSS in stylesheets and JavaScript in scripts unless there is a specific reason not to.
- Preserve existing IDs, classes, `data-*` attributes, element order, and hooks relied upon by JavaScript or CSS.
- Give form controls labels; provide useful alt text for meaningful images and empty alt text for decorative images.
- Prefer native interactive elements (`button`, `a`, `input`) over clickable generic containers.
- Do not change visible text or semantics during a style-only refactor without approval.

## 4. CSS conventions

- Use four-space indentation and one declaration per line.
- Put opening braces on the selector line and closing braces on their own line.
- Separate rules with a blank line.
- Use readable, descriptive section comments in long stylesheets, for example:

```css
/* ========================================
   PROJECT CARDS
======================================== */

.project-card {
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
}

.project-card img {
    display: block;
    width: 100%;
    height: auto;
}
```

- Reuse existing custom properties and design tokens.
- Prefer straightforward layout with Grid or Flexbox where appropriate; avoid positioning hacks.
- Avoid unnecessary `!important`, selector specificity escalation, duplicate declarations, and conflicting media queries.
- Respect the width of a component's parent. In particular, article screenshots should normally fit their article column; wider breakout images require explicit approval.
- Preserve image aspect ratios unless intentional cropping is part of the design.
- Group responsive overrides logically, and keep media queries expanded and readable.
- When replacing CSS rules, remove obsolete rules instead of appending competing overrides.
- Do not change visual design, colors, typography, spacing, or breakpoints during a formatting-only refactor.

## 5. JavaScript conventions

- Use four-space indentation and consistent semicolons.
- Use `const` by default, `let` for reassigned bindings, and avoid introducing new `var` declarations. **Exception:** preserve the existing convention when refactoring older developer-authored code unless a change is approved.
- Use descriptive `camelCase` names for variables and functions, and `UPPER_SNAKE_CASE` for true constants where the project already uses that convention.
- Prefer named functions for substantial behavior; use arrow functions where they improve clarity or match surrounding code.
- Use clear `if`/`else` branches for nontrivial decisions rather than nested ternaries.
- Avoid dense method chains, clever coercion, and one-line control-flow blocks when explicit steps would be easier to understand.
- Keep functions focused; extract helpers only when they remove meaningful repetition or clarify responsibilities.
- Preserve existing async behavior, event listeners, error handling, data structures, and browser storage formats.
- Do not replace working logic with a different algorithm merely for stylistic preference.
- Do not introduce TypeScript, frameworks, or external libraries unless requested.
- If a new language feature or unfamiliar pattern is necessary, explain it briefly in the completion summary.

## 6. Comments and organization

- Comment *why* a decision exists, not every obvious line of code.
- Use concise section comments to organize long files.
- Preserve comments that document requirements, edge cases, or known limitations.
- Remove comments only when they are clearly outdated or inaccurate.
- Do not insert self-referential AI comments or boilerplate explanations into production source.

## 7. Responsive design and visual quality

For changes that affect the interface, check relevant views at approximately 360px, 768px, 1024px, and 1440px when browser tools are available.

Verify that:
- No unintended horizontal scrolling or overlapping elements occur.
- Images fit their content sections and retain sensible proportions.
- Text, controls, and captions remain readable.
- Keyboard focus, links, forms, and navigation still work.
- Existing design hierarchy is preserved.

Never claim a browser or visual check was performed if it was not. If unavailable, report that visual QA remains pending.

## 8. Refactoring guardrails — mandatory

A **style refactor** changes readability and organization, not product behavior.

- Inspect the current implementation before editing.
- Make a short plan identifying which files need changes and why.
- Work in small, reviewable batches, ideally one file or closely related group at a time.
- Preserve DOM hooks, exported names, API endpoints, environment variable names, local-storage keys, and URL paths.
- Preserve features, calculations, ordering, timing, validation, loading states, and error handling.
- Do not silently fix, remove, or redesign functionality as part of a style refactor; report unrelated issues separately.
- Do not expose, print, commit, or move secrets into frontend files.
- Do not change package versions, deployment configuration, or Git history unless asked.
- Run available relevant checks and tests. If no automated tests exist, provide a concrete manual regression checklist.
- If a requested stylistic change risks behavior, explain the tradeoff before proceeding.

## 9. Working with the developer

- Keep code understandable to someone actively learning frontend development.
- When the developer supplies handwritten code samples, treat them as the strongest evidence of personal style, subject to correctness and safety.
- Ask rather than guessing when a major stylistic decision is unclear.
- Prefer explaining a new concept over silently replacing familiar code with a more advanced technique.
- Avoid large unsolicited rewrites.

## 10. Completion report

For each task, briefly provide:

1. Files changed and what changed in each.
2. Confirmation that behavior was intentionally preserved, or a clear description of any deliberate behavior change.
3. Checks/tests run and their results.
4. Any browser checks not performed or risks requiring manual review.
5. Any style decisions that differ from the existing developer-written examples.

Do not claim completion or successful verification without evidence.
