# Last War Shiny Tracker

An installable tracker for shiny tasks in Last War. The repository currently contains production-ready infrastructure; domain features will be added incrementally.

## Features

- Responsive React application shell
- English, French, German, and Ukrainian localization
- Browser-language detection with a persisted preference
- Installable PWA with offline asset caching
- Automated quality checks, dependency updates, and GitHub Pages deployment

## Tech Stack

React 19, TypeScript, Vite, Tailwind CSS, class-names, React DayPicker, date-fns, Lucide React, i18next, and vite-plugin-pwa. ESLint, Prettier, Husky, and lint-staged enforce quality; Vitest and React Testing Library provide tests.

## Structure

```text
src/
  components/   Reusable UI components
  config/       Application configuration
  hooks/        Reusable React hooks
  i18n/         i18next setup and supported languages
  locales/      Translation resources grouped by locale
  test/         Shared test setup
  types/        Shared TypeScript types
  utils/        Framework-independent helpers
```

## Internationalization

English (`en`) is the default and fallback. Browser preferences are detected on first use, while explicit selections are saved to `localStorage`. Supported languages are registered in `src/i18n/languages.ts`; resources live under `src/locales/<locale>/`.

To add a language:

1. Register its code and display name in `src/i18n/languages.ts`.
2. Create `src/locales/<code>/common.json` with the English keys.
3. Import and register the resource in `src/i18n/index.ts`.

To add a namespace:

1. Add `<namespace>.json` beneath every locale directory.
2. Import each file and add it beneath its locale in `resources`.
3. Add the namespace to the `ns` array in `src/i18n/index.ts`.
4. Use `useTranslation('<namespace>')` in components.

Components must use translation keys for user-facing copy. Missing keys and unsupported locales fall back to English.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — type-check and create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint with zero warnings allowed
- `npm run format` / `npm run format:check` — write or verify formatting
- `npm run test` — run Vitest in watch mode
- `npm run test:run` — run tests once
- `npm run test:coverage` — generate coverage

Run `npm install` after cloning. This also configures the Husky pre-commit hook, which runs lint-staged.

## Testing

Tests use Vitest, jsdom, React Testing Library, jest-dom, and user-event. Keep tests next to their source using `*.test.ts(x)`, then run `npm run test:run`.

## Deployment

GitHub Actions validates pull requests. Pushes to `master` publish `dist/` to GitHub Pages after all checks pass. Enable **GitHub Actions** as the Pages source in repository settings.

The Vite base path is controlled by `VITE_BASE_PATH`. CI uses `/<repository-name>/`; use `/` locally or for a custom domain. For example: `VITE_BASE_PATH=/custom-path/ npm run build`.

## Offline support

`vite-plugin-pwa` generates the manifest and service worker during production builds. The automatically updating worker caches the application shell and generated assets. Icons in `public/` are placeholders and may be replaced without renaming them.

## Roadmap

- Define the shiny-decoration domain model
- Add tracking and calendar workflows
- Add persistence and import/export
- Expand offline data behavior
- Improve accessibility and localization coverage
