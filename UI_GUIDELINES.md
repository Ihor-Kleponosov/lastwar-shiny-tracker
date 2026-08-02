# UI_GUIDELINES.md

## 1. Purpose

This document defines the visual and interaction guidelines for the **Last War Shiny Tasks** PWA.

The goal is to create a clean, modern, mobile-first companion app that is easy to use quickly during gameplay.

The UI should feel polished enough for a portfolio project, while remaining lightweight and practical.

Do not copy copyrighted Last War artwork, logos, screenshots, or proprietary UI assets.

---

## 2. Design principles

Follow these principles:

1. **Mobile first**
   - The primary use case is a phone.
   - All important actions must be comfortable with one hand.
   - Touch targets must be large enough.

2. **Fast scanning**
   - Users should identify today's active servers within a few seconds.
   - Server IDs must be visually prominent.
   - Avoid unnecessary text.

3. **Clear hierarchy**
   - Selected date is the main context.
   - Active servers are the primary content.
   - Calendar and settings are secondary.

4. **Minimal friction**
   - Previous day, Today, and Next day controls must be always easy to reach.
   - Settings should open quickly.
   - Server toggles should require only one tap.

5. **Offline-friendly**
   - Do not rely on remote fonts, images, or assets.
   - The interface must remain complete when offline.

6. **Accessible by default**
   - Use semantic HTML.
   - Maintain sufficient contrast.
   - Support keyboard navigation.
   - Respect reduced motion preferences.

7. **Simple visual language**
   - Prefer clear cards, subtle borders, and compact badges.
   - Avoid excessive gradients, shadows, blur, glow, and animation.

---

## 3. Visual direction

Use a modern dark game-companion style.

The interface should feel:

- focused;
- reliable;
- compact;
- slightly futuristic;
- clean rather than decorative.

Avoid:

- military camouflage;
- copied game imagery;
- aggressive neon effects;
- excessive red;
- overly dense dashboards;
- desktop-first layouts;
- tiny buttons;
- excessive glassmorphism.

---

## 4. Color system

Use CSS variables as the source of truth, even when Tailwind utility classes are used.

Suggested tokens:

```css
:root {
  --color-background: #0b1120;
  --color-surface: #111827;
  --color-surface-elevated: #182234;
  --color-border: #263244;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;

  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-accent-contrast: #111827;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-focus: #38bdf8;

  --color-overlay: rgb(2 6 23 / 72%);
}
```

The exact values may be adjusted, but preserve the same semantic roles.

### Color usage

- Background: page background.
- Surface: standard cards and panels.
- Elevated surface: modal, active controls, selected calendar day.
- Accent: primary action and selected state.
- Success: online status or enabled state.
- Danger: destructive or disable-all action.
- Focus: keyboard focus ring.

Do not communicate meaning using color alone.

For example, an enabled server should have both:

- a visual color difference;
- a checked checkbox or explicit icon.

---

## 5. Typography

Use a system font stack.

Do not load external fonts.

Suggested stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

If Inter is not locally available, the system fallback is acceptable.

### Typography scale

Use a small and consistent scale:

```text
Page title:        24–28 px / bold
Section title:     18–20 px / semibold
Selected date:     18–22 px / semibold
Server ID:         18–24 px / bold
Body:              14–16 px / regular
Secondary text:    13–14 px / regular
Button text:       14–16 px / medium
```

Requirements:

- Never use body text smaller than 14 px.
- Server IDs should be easy to read at a glance.
- Use tabular numbers where practical:

```css
font-variant-numeric: tabular-nums;
```

---

## 6. Spacing system

Use a 4 px spacing scale.

Suggested spacing values:

```text
4 px
8 px
12 px
16 px
20 px
24 px
32 px
40 px
48 px
```

Default page horizontal padding:

```text
Mobile: 16 px
Tablet: 24 px
Desktop: 24–32 px
```

Default card padding:

```text
Mobile: 16 px
Desktop: 20–24 px
```

Avoid arbitrary spacing values unless required for alignment.

---

## 7. Layout

Use a single-column layout.

Suggested shell:

```text
AppShell
├── Header
├── Main
│   ├── DateSummaryCard
│   ├── DateNavigation
│   ├── ServerListCard
│   └── CalendarCard
└── SettingsModal
```

### Content width

Use:

```text
width: 100%
max-width: 1200 px
margin-inline: auto
```

The app should not become a wide desktop dashboard.

### Vertical rhythm

Recommended section gap:

```text
16 px on mobile
20–24 px on larger screens
```

### Safe areas

Support mobile safe areas where relevant:

```css
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

The modal and app shell should not place controls under device notches or home indicators.

---

## 8. Responsive behavior

Suggested breakpoints:

```text
Mobile:  < 640 px
Tablet:  640–1023 px
Desktop: >= 1024 px
```

The UI should remain primarily single-column at all sizes.

On larger screens:

- Increase card padding.
- Allow server badges to fit more columns.
- Keep the calendar and main content centered.
- Do not create unnecessary sidebars.

---

## 9. Header

The header contains:

- Application name.
- Settings button.
- Optional offline indicator.

### Requirements

- Keep it compact.
- The settings button must use an accessible label.
- Use a Lucide settings icon.
- Minimum touch target: `44 × 44 px`.
- The header may be sticky if it does not reduce usable mobile space too much.

Suggested structure:

```tsx
<header>
  <div>
    <p>Last War</p>
    <h1>Shiny Tasks</h1>
  </div>

  <button aria-label={t('settings.open')}>
    <Settings />
  </button>
</header>
```

Do not rely on the icon alone without `aria-label`.

---

## 10. Date summary card

The date summary card provides the current context.

Show:

- formatted selected date;
- Today label when applicable;
- visible server count;
- optional cycle group label.

Suggested content:

```text
Today
Tuesday, July 28
3 active servers

All text in this example must come from translations.
```

### Visual priority

1. Today or selected-date status.
2. Full date.
3. Server count.
4. Cycle group, if shown.

The internal group index is technical information. Do not make it visually dominant.

---

## 11. Date navigation

Provide three actions:

- Previous day.
- Today.
- Next day.

Suggested layout:

```text
[←]      [Today]      [→]

Button labels must come from translations.
```

Requirements:

- Previous and next buttons must have accessible labels.
- Buttons must have at least `44 px` height.
- Today button should be disabled or visually inactive when the selected date is already today.
- Use consistent button sizes.
- Avoid swipe-only navigation.

Optional keyboard shortcuts may be added later, but are not required.

---

## 12. Server list

The server list is the primary content.

### Server item design

Display server IDs as cards or badges.

Example:

```text
1691
1695
1702
```

Recommended badge/card properties:

- Strong numeric text.
- Clear contrast.
- Rounded corners.
- Subtle border.
- Consistent height.
- Minimum tap target if interactive.

Suggested grid:

```css
grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
```

On narrow screens, avoid showing too many tiny columns.

### Sort order

Always sort server IDs numerically.

### Empty state

If no enabled servers are available for the selected date, show:

- clear message;
- settings shortcut;
- no error styling.

Example:

```text
No enabled servers for this date.

[Open settings]

Both strings must come from translations.
```

An empty state is not an application error.

---

## 13. Calendar

Use React DayPicker.

### Calendar container

Place the calendar inside a card.

Requirements:

- Full width on mobile.
- Center the month caption.
- Large enough day cells.
- Selected day must be obvious.
- Today and selected day must remain distinguishable.
- Disabled dates are not currently required.
- Week starts on Monday.
- Use the active application locale for month names, weekday labels, and accessible calendar text.
- Configure React DayPicker with the matching `date-fns` locale for `en`, `fr`, `de`, and `uk`.
- Do not hard-code a single calendar locale.

### Day states

Use distinct styles for:

- default day;
- hover;
- focus-visible;
- today;
- selected day;
- outside month day.

Suggested behavior:

- Today: subtle outline or dot.
- Selected: accent background with high-contrast text.
- Outside month: muted text.
- Focus: visible focus ring.

Do not rely only on a tiny dot to show the selected day.

### Calendar navigation

Month navigation buttons:

- minimum `40 × 40 px`;
- accessible labels;
- visible hover/focus state.

---

## 14. Custom settings modal

The settings modal must be a custom component.

Do not use a third-party modal library.

### Desktop behavior

- A full-screen settings modal is acceptable when it provides enough space for
  server configuration. Its inner content container must use the same maximum
  width and horizontal padding as the main page content.
- A centered panel may be used instead, with a maximum width around `480–560 px`,
  maximum height around `85vh`, a scrollable content area, and rounded corners.

### Mobile behavior

Use either:

- centered panel with small margins;
- or bottom-sheet-like panel.

Preferred mobile pattern:

```text
position: fixed
left: 0
right: 0
bottom: 0
max-height: 90dvh
border-radius: 20px 20px 0 0
```

The implementation may use one responsive modal component rather than separate desktop and mobile components.

### Modal structure

```text
Modal
├── Header
│   ├── Title
│   └── Close button
├── Search
├── Summary and bulk actions
├── Server checkbox list
└── Optional footer
```

### Required interactions

- Open from settings button.
- Close button closes.
- Escape closes.
- When the modal uses a visible backdrop around a panel, clicking that backdrop
  closes the modal. This does not apply to a full-screen modal.
- Clicking inside the panel does not close.
- Body scroll is locked while open.
- Focus moves into the modal when opened.
- Focus returns to the settings button when closed.
- Basic focus trapping should be implemented.
- `role="dialog"`.
- `aria-modal="true"`.
- Heading connected with `aria-labelledby`.

### Modal animation

Use subtle animation only:

```text
Backdrop: fade
Panel: fade + short translate
Duration: 150–220 ms
```

Disable or minimize animation when:

```css
@media (prefers-reduced-motion: reduce);
```

---

## 15. Search field

The server search field should:

- filter by partial server number;
- update immediately;
- include a search icon;
- include a clear button when non-empty;
- use a visible label or accessible name.

Example:

```text
Search servers
[ 169...                         × ]

The label and accessible name must come from translations.
```

Do not require submitting a form.

If no servers match, show:

```text
No servers found.
```

---

## 16. Server settings list

Each server row should contain:

- checkbox;
- server number;
- clear enabled/disabled state.

Example:

```text
☑ Server 1691
☐ Server 1695

The word “Server” must come from translations.
```

Requirements:

- Entire row should be clickable.
- Checkbox must remain a native checkbox when practical.
- Minimum row height: `44 px`.
- Use visible focus styles.
- Do not use custom toggle switches unless they improve clarity.

### Bulk actions

Provide:

- Enable all.
- Disable all.

Requirements:

- Enable all is a standard secondary action.
- Disable all should not look like a destructive deletion.
- Do not require confirmation because preferences can be restored immediately.
- The current enabled count should remain visible.

Example:

```text
24 of 60 enabled
[Enable all] [Disable all]

All labels and counts must be localized.
```

---

## 17. Buttons

Create a reusable `Button` component only if it reduces repetition.

Suggested variants:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
```

Suggested sizes:

```ts
type ButtonSize = 'sm' | 'md' | 'icon'
```

### Button requirements

- Minimum interactive size: `44 × 44 px` for icon buttons.
- Visible hover state.
- Visible active state.
- Visible `focus-visible` ring.
- Disabled state must be visually clear.
- Use `type="button"` unless the button submits a form.
- Icon-only buttons require `aria-label`.

Do not add a large component library for buttons.

---

## 18. Cards

Cards should use:

- surface background;
- subtle border;
- moderate radius;
- minimal shadow.

Suggested radius:

```text
14–18 px
```

Suggested shadow:

```css
box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
```

Use shadows sparingly.

Nested cards should generally be avoided.

---

## 19. Icons

Use `lucide-react`.

Recommended icons:

- `Settings`
- `ChevronLeft`
- `ChevronRight`
- `CalendarDays`
- `Search`
- `X`
- `RotateCcw`
- `WifiOff`
- `Check`
- `Server`

Requirements:

- Use a consistent icon size.
- Typical inline icon size: `18–20 px`.
- Typical icon button size: `20–24 px`.
- Decorative icons should use `aria-hidden="true"`.
- Do not use emoji as primary interface icons.

---

## 20. Loading and startup states

The application has no remote data, so loading states should be minimal.

Avoid artificial skeleton loaders.

Potential startup states:

- localStorage preferences are available immediately;
- current date is calculated synchronously;
- app renders without a blocking spinner.

If PWA update handling is implemented, use a small non-blocking banner or toast.

---

## 21. Offline state

The app should remain fully functional offline.

Optional offline indicator:

```text
Offline
```

Use a small unobtrusive badge.

Requirements:

- Do not show offline mode as an error.
- Do not block any feature.
- Hide or update the indicator when the connection returns.
- The actual source of truth remains local data.

---

## 22. PWA install experience

Do not create a custom install prompt in the initial version unless needed.

The app should include:

- valid manifest;
- correct icons;
- standalone display;
- theme color;
- background color;
- Apple touch icon.

The installed app should visually match the browser version.

---

## 23. Feedback and notifications

Prefer inline feedback.

Examples:

- Empty server list.
- No search matches.
- PWA update available.
- Offline status.

Avoid introducing a toast library.

If a toast is needed, create a very small local component.

Do not show a notification after every checkbox change.

---

## 24. Accessibility

Meet practical WCAG-oriented requirements.

### Required

- Correct heading hierarchy.
- Semantic buttons.
- Native checkbox inputs.
- Visible focus indicators.
- Keyboard-accessible calendar and modal.
- Accessible modal labeling.
- Sufficient color contrast.
- No information conveyed only by color.
- `aria-label` for icon-only buttons.
- `aria-live` only where it adds value.
- Respect `prefers-reduced-motion`.

### Focus style

Use a clearly visible ring:

```css
outline: 2px solid var(--color-focus);
outline-offset: 2px;
```

Do not remove outlines without providing a replacement.

### Screen-reader considerations

Examples:

```tsx
<button aria-label={t('navigation.previousDay')}>
  <ChevronLeft aria-hidden="true" />
</button>
```

```tsx
<p aria-live="polite">{t('servers.visible', { count: 3 })}</p>
```

Avoid excessive live-region announcements.

---

## 25. Motion

Keep motion subtle.

Allowed:

- button state transitions;
- modal fade and slide;
- small hover transitions;
- update banner entrance.

Suggested duration:

```text
120–220 ms
```

Suggested easing:

```css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

Avoid:

- bouncing;
- looping animation;
- large parallax;
- animated backgrounds;
- flashing effects.

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 26. Dark mode

Dark mode is the initial and primary theme.

Do not implement a theme switcher during the initial MVP unless explicitly requested.

Still use semantic CSS variables so a light theme can be added later.

Avoid hardcoding color values directly across many components.

---

## 27. Component guidelines

Suggested components:

```text
AppShell
Header
DateSummary
DateNavigation
ServerList
ServerBadge
CalendarView
SettingsModal
ServerSearch
ServerSettingsList
Button
EmptyState
OfflineBadge
```

Do not split components purely to create more files.

Create a component when:

- it has a clear responsibility;
- it is reused;
- it contains meaningful interaction logic;
- extracting it improves readability.

Keep business logic in utilities and hooks rather than visual components.

---

## 28. Suggested component states

### Button

- default;
- hover;
- active;
- focus-visible;
- disabled.

### Server badge

- default active server;
- optionally highlighted favorite in the future.

### Calendar day

- default;
- today;
- selected;
- outside month;
- focus-visible.

### Settings row

- enabled;
- disabled;
- search match;
- focus-visible.

### Modal

- closed;
- opening;
- open;
- closing.

Animations do not need a complex state machine.

---

## 29. Content, language, and internationalization

The application must use internationalization from the initial implementation.

### Supported locales

- English: `en`
- French: `fr`
- German: `de`
- Ukrainian: `uk`

English is the default and fallback language.

### General requirements

- Do not hard-code user-facing text in React components.
- Use `react-i18next` for interface strings.
- Keep translations in JSON files under `src/locales`.
- Use the existing translation namespaces, beginning with `common`.
- Add every new translation key to all supported locales in the same change.
- Use semantic, stable keys rather than English sentences as keys.
- Do not use translated strings as identifiers, state values, or business-logic inputs.
- The application name and game-specific proper nouns may remain untranslated when appropriate.
- Avoid mixing languages within the same interface state.
- Missing translations must fall back to English.
- The selected language should persist between sessions.
- Browser-language detection may be used for the initial choice, but unsupported locales must fall back to English.

Suggested structure:

```text
src/
  i18n/
    index.ts
  locales/
    en/
      common.json
    fr/
      common.json
    de/
      common.json
    uk/
      common.json
```

### Translation keys

Prefer grouped, semantic keys:

```json
{
  "app": {
    "title": "Last War Shiny Tasks",
    "offline": "Offline"
  },
  "navigation": {
    "previousDay": "Previous day",
    "today": "Today",
    "nextDay": "Next day"
  },
  "settings": {
    "title": "Settings",
    "searchServer": "Search servers",
    "enableAll": "Enable all",
    "disableAll": "Disable all"
  }
}
```

Do not create keys such as:

```text
today_button_text
blue_modal_title
text_1
```

### Dates and calendar content

All user-facing dates must use the active locale.

Use locale-aware `date-fns` formatting rather than manually assembled strings.

Examples of the same date may appear as:

```text
English:   Tuesday, July 28
French:    mardi 28 juillet
German:    Dienstag, 28. Juli
Ukrainian: вівторок, 28 липня
```

Do not store translated date strings in application state.

Store dates as `Date` objects or stable machine-readable values and format them at the presentation boundary.

React DayPicker must receive the matching locale for the active application language.

### Pluralization and interpolation

Use i18next pluralization and interpolation for dynamic values.

Example translation shape:

```json
{
  "servers": {
    "active_one": "{{count}} active server",
    "active_other": "{{count}} active servers"
  }
}
```

Do not build translated sentences by concatenating fragments in components.

Avoid:

```tsx
<span>{count + ' ' + t('servers.active')}</span>
```

Prefer:

```tsx
<span>{t('servers.active', { count })}</span>
```

Each locale must use grammatically correct plural forms supported by i18next.

### Accessible text

Accessible names are also user-facing content and must be translated:

- `aria-label`;
- dialog titles;
- screen-reader-only text;
- live-region messages;
- calendar navigation labels;
- icon-only button labels;
- input labels and placeholders.

Example:

```tsx
<button aria-label={t('navigation.previousDay')}>
  <ChevronLeft aria-hidden="true" />
</button>
```

Do not hard-code English or Ukrainian text inside ARIA attributes.

### Layout resilience

The UI must tolerate longer French and German labels.

Requirements:

- Do not use fixed widths based on one language.
- Allow buttons and labels to grow or wrap when needed.
- Do not truncate primary actions unless there is no practical alternative.
- Verify that translated labels do not overlap icons.
- Prefer flexible grid and flex layouts.
- Avoid relying on exact character counts.
- Check modal headings, bulk-action buttons, date labels, and empty states in all supported locales.

Use English as the baseline, but test at least German for expansion and Ukrainian for Cyrillic rendering.

### Language selector

The settings interface should provide a language selector.

Requirements:

- Show all four supported languages.
- Display language names clearly.
- The control must be keyboard accessible.
- Persist the selected locale.
- Apply the language change without requiring a page reload.
- Use a native `<select>` unless a custom control provides a clear usability benefit.
- Do not identify languages using flags alone.

Suggested labels:

```text
English
Français
Deutsch
Українська
```

### Recommended English source wording

English translation values should remain concise:

```text
Last War Shiny Tasks
Today
Previous day
Next day
Settings
Search servers
Enable all
Disable all
Open settings
No servers found
No enabled servers for this date
Offline
Update available
Update
```

Other locales should express the same meaning naturally rather than translate word-for-word.

---

## 30. Error handling

There should be very few runtime error states.

Potential issues:

- corrupted localStorage;
- invalid config;
- PWA registration failure.

Guidelines:

- Corrupted localStorage: recover silently using defaults.
- Invalid development config: log a clear development error.
- PWA registration failure: app should still work online.
- Do not show technical stack traces to users.

---

## 31. Tailwind conventions

Use Tailwind for layout and component styling.

Recommended conventions:

- Keep repeated class combinations in components.
- Use a small helper such as `clsx` only if conditional classes become difficult to read.
- Do not install a large class-variance library unless it is justified.
- Use CSS variables through arbitrary values or theme configuration.
- Keep `index.css` for global tokens, resets, safe-area rules, and reduced-motion behavior.

Example:

```tsx
<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
  ...
</div>
```

If a Tailwind theme mapping is cleaner, map semantic variables there.

---

## 32. Suggested initial screen

The initial mobile screen should approximately contain:

```text
┌──────────────────────────────────┐
│ Last War              [Settings] │
│ Shiny Tasks                      │
├──────────────────────────────────┤
│ Today                           │
│ Tuesday, July 28                │
│ 3 active servers               │
├──────────────────────────────────┤
│ [←]       [Today]         [→]   │
├──────────────────────────────────┤
│ Active servers                  │
│ [1691] [1695] [1702]             │
├──────────────────────────────────┤
│             July 2026           │
│ Mo Tu We Th Fr Sa Su             │
│ ...                              │
└──────────────────────────────────┘
```

This is a hierarchy reference, not an exact visual mockup.

---

## 33. Settings modal reference

Approximate mobile structure:

```text
┌──────────────────────────────────┐
│ Settings                     [×] │
│ 24 of 60 enabled                │
│                                  │
│ [Search servers...          ×]  │
│                                  │
│ [Enable all] [Disable all]      │
│                                  │
│ ☑ Server 1691                   │
│ ☑ Server 1695                   │
│ ☐ Server 1702                   │
│ ...                              │
└──────────────────────────────────┘
```

The server list should scroll independently while the modal heading and search remain visible when practical.

---

## 34. Design acceptance criteria

The UI is acceptable when:

- The app is comfortable to use on a 360 px-wide screen.
- No horizontal scrolling occurs.
- Important controls have at least 44 px touch targets.
- Active servers are visible without visual clutter.
- Selected date is immediately understandable.
- Calendar states are visually distinct.
- Modal works with touch, mouse, and keyboard.
- Focus is visible.
- Contrast is sufficient.
- Interface works without remote fonts or images.
- Offline mode does not degrade the layout.
- Reduced motion is respected.
- The UI remains centered and readable on desktop.
- No copyrighted game artwork is included.
- No large UI framework is added.
- No default Vite styling remains.
- No user-facing text is hard-coded in components.
- All interface strings exist for `en`, `fr`, `de`, and `uk`.
- English is used as the default and fallback locale.
- Dates, calendar labels, plural forms, and accessible names follow the active locale.
- The layout remains usable with longer French and German translations.
- Changing the language updates the interface without a page reload.

---

## 35. Out of scope

Do not include during the initial UI implementation:

- Light theme switcher.
- User-selectable color themes.
- Complex dashboard charts.
- Game artwork.
- Character illustrations.
- Animated backgrounds.
- Sound effects.
- Drag-and-drop.
- Custom calendar implementation.
- Swipe gestures as the only navigation.
- Large toast or notification framework.
- Full design system documentation website.
- Storybook, unless explicitly requested later.

---

## 36. Codex implementation instructions

When implementing the UI:

1. Follow `INITIAL_SETUP.md`.
2. Follow `IMPLEMENTATION.md`.
3. Use this document as the visual and interaction source of truth.
4. Keep components simple and maintainable.
5. Use semantic tokens rather than scattered hardcoded colors.
6. Verify the layout at approximately:
   - 360 px width;
   - 390 px width;
   - 768 px width;
   - 1280 px width.
7. Verify keyboard interaction.
8. Verify the custom modal focus behavior.
9. Verify no horizontal overflow.
10. Verify the app still looks complete offline.
11. Verify the interface in `en`, `fr`, `de`, and `uk`.
12. Verify date formatting, calendar locale, pluralization, and accessible labels in each locale.
13. Verify that no user-facing text is hard-coded in components.
14. Verify that longer German and French strings do not break the layout.
15. Run lint, tests, and build before finishing.
16. Briefly document any deliberate deviation from these guidelines.
