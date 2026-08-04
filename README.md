# Last War Shiny Tracker

An installable, offline-capable tracker for Last War shiny-task server rotations. It shows active server groups for selected presets on any selected date.

## Features

- Date-based server rotation using a configurable, anchored three-group cycle
- Select one or more saved presets to show their active server lists for the selected date
- Localized UI, dates, calendar labels, and accessible names in English, French, German, and Ukrainian
- Two-page navigation with a Presets page for creating and editing in-memory server-list presets
- Calendar picker with Monday as the first day of the week
- Full-screen preset configuration with search, inclusive range filtering, flat and grouped list views, bulk selection, draft saving, and unsaved-change confirmation
- PNG export: choose a month and preset, preview the export, select a light or dark export theme, and download the generated image
- PWA manifest, service worker, and precached production assets for offline use
- Error boundary and concise success feedback for saved preferences

## How it works

The configured server groups repeat from the ISO anchor date in `src/config/index.ts`. The selected date determines the current group. Select one or more presets on the main page to show one active-server list per preset. Presets are saved under the `last-war-shiny-tracker-presets` localStorage key as objects containing `id`, `name`, and `enabledServerIds`; up to 30 can be saved. The Presets page creates and saves an all-servers default preset on first launch when no stored presets exist and shows a dismissible notice. Invalid stored preset data is preserved and reported with an error toast; an existing stored list, including an empty list, is preserved.

Use **Edit Presets** to create or change server lists. Changes are kept as a draft until **Save**; closing a changed draft asks whether to discard it. Search filters server numbers immediately, while range filtering is inclusive and accepts bounds in either order. The server list can be shown as one flat list or separated into the configured A, B, and C rotation groups. PNG export allows choosing any existing preset for each export. When no preset is selected, it exports an empty server list.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, React DayPicker, date-fns, Lucide React, i18next, Motion, Sonner, html2canvas, and vite-plugin-pwa. ESLint, Prettier, Husky, lint-staged, Vitest, and React Testing Library provide quality tooling.

## Project structure

```text
src/
  assets/       Local application assets
  components/   Feature and reusable UI components, with colocated tests
  config/       Shiny-task cycle configuration
  hooks/        Reusable React behavior, including modal accessibility
  i18n/         i18next setup and supported-language metadata
  locales/      Translation resources by locale
  pages/        Top-level application pages
  test/         Shared Vitest setup
  types/        Shared domain types
  utils/        Framework-independent date, cycle, persistence, and export helpers
```

## Getting started

Use the Node.js version in `.node-version` (the project requires Node.js 20.19.0 or later), then install the locked dependency set:

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env` only when a non-root Vite base path is needed. `VITE_BASE_PATH=/` is appropriate for local development and custom domains; GitHub Pages builds use `/<repository-name>/`.

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint with zero warnings allowed
- `npm run format` / `npm run format:check` - write or verify Prettier formatting
- `npm run test` / `npm run test:run` - run Vitest in watch mode or once
- `npm run test:coverage` - generate coverage

Run the release checks with:

```bash
npm run format:check
npm run lint
npm run test:run
npm run build
```

## Internationalization

English (`en`) is the default and fallback language. The first visit uses browser-language detection when supported; explicit selections persist in localStorage. Translation resources live under `src/locales/<locale>/common.json`.

To add a user-facing string, add a semantic key to every supported locale in the same change. Use `react-i18next` in UI code, including accessible names and live-region messages. Format dates at the presentation boundary with the active `date-fns` locale; never store translated text in state.

To add a language, register its code and display name in `src/i18n/languages.ts`, add its `common.json`, and register its resource in `src/i18n/index.ts`.

## Configuration and persistence

`src/config/index.ts` is the source of truth for the cycle anchor date and server groups. Keep group order intentional: the group index is calculated from the calendar-day difference relative to the anchor date. Server IDs are deduplicated and sorted before they are presented or persisted.

Preset server IDs are normalized to configured servers and capped at 100 selections per preset.

Selected preset IDs are persisted under the `last-war-shiny-tracker-selected-preset-ids` localStorage key. When the first-launch default preset is created, it is selected automatically. IDs for presets that no longer exist are discarded, and a missing or invalid selection defaults to an empty list.

## Offline and deployment

`vite-plugin-pwa` generates the manifest and auto-updating service worker during production builds. The worker precaches the application shell and generated assets; the app does not require remote fonts, images, or API data.

GitHub Actions runs formatting, linting, tests, and a GitHub Pages-base-path build for pull requests and pushes to `master`. Successful pushes to `master` upload `dist/` and deploy it through GitHub Pages. Enable **GitHub Actions** as the Pages source in repository settings.
