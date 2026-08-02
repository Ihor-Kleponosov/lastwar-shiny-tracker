# AGENTS.md

# Repository Agent Instructions

This repository is primarily developed using OpenAI Codex.

Your goal is to produce production-quality code that integrates naturally into the existing codebase while keeping changes as small, readable, and maintainable as possible.

---

# Mission

- Implement requested features.
- Fix bugs without introducing regressions.
- Preserve the existing architecture.
- Leave the repository in a releasable state.

---

# Source of Truth

Always follow project documentation in this order:

1. AGENTS.md
2. UI_GUIDELINES.md
3. README.md

If instructions conflict, follow the highest-priority document.

---

# Workflow

For every non-trivial task:

1. Read the relevant documentation.
2. Inspect the existing implementation.
3. Produce a short implementation plan.
4. Reuse existing code whenever practical.
5. Implement the smallest reasonable change.
6. Verify the result before finishing.

Do not start rewriting code before understanding how the current implementation works.

---

# General Principles

Prefer:

- small focused commits
- minimal diffs
- readable code
- simple solutions
- consistency with the existing project

Avoid:

- unnecessary refactoring
- speculative improvements
- introducing abstractions too early
- changing unrelated files

---

# Architecture

Respect the existing project structure.

Keep:

- business logic outside UI components whenever practical
- utilities framework-independent
- components focused on presentation and interaction
- state as local as reasonably possible

Do not introduce new architectural patterns unless explicitly requested.

---

# React

Prefer:

- functional components
- composition
- hooks
- early returns

Avoid creating components only to reduce file size.

Extract components or hooks only when they improve readability or reuse.

---

# TypeScript

- Avoid `any`.
- Prefer explicit types.
- Reuse existing shared types.
- Prefer immutable updates.
- Keep functions strongly typed.

---

# Styling

UI implementation must follow **UI_GUIDELINES.md**.

- Use existing Tailwind conventions.
- Use semantic CSS variables.
- Avoid hardcoded colors.
- Do not introduce additional UI frameworks.

---

# Accessibility

Accessibility is required.

Always preserve:

- semantic HTML
- keyboard navigation
- visible focus states
- proper ARIA attributes
- sufficient contrast

Never remove accessibility for convenience.

---

# Internationalization

All user-facing strings must use i18n.

Never hardcode visible text.

When introducing new strings:

- add English first
- update every supported locale
- write translation values using their literal characters (for example, Ukrainian Cyrillic), not Unicode escape codes such as `\u041c`

---

# Dependencies

Before adding a dependency:

- verify that existing libraries cannot solve the problem
- choose the smallest suitable dependency
- avoid overlapping functionality

Do not introduce large UI libraries.

---

# Testing

When changing behavior:

- update affected tests
- add tests for new logic where appropriate

Prefer testing business logic independently from UI.

---

# Performance

Prefer naturally efficient code.

Avoid:

- unnecessary renders
- unnecessary allocations
- duplicated computations

Do not optimize prematurely.

---

# Code Quality

Prefer:

- meaningful names
- short functions
- early returns
- low nesting

Avoid:

- dead code
- commented-out code
- TODO comments unless explicitly requested

---

# Git

Only modify files required for the task.

Do not:

- reformat unrelated files
- update lockfiles unnecessarily
- rename files without reason

Keep the resulting diff easy to review.

---

# Completion Checklist

Before considering a task complete:

- UI follows UI_GUIDELINES.md
- All user-facing text is localized
- Accessibility is preserved
- Relevant tests are updated
- Lint passes
- Tests pass
- Build succeeds

If any verification cannot be performed, explicitly state why.
