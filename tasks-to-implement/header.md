Create a production-ready Header component for the application.

## Context

The implementation MUST follow the existing project architecture, design tokens and coding conventions. Do not introduce custom styling that conflicts with the design system.

## Layout

The header should be divided into three logical sections:

### Left

- Application logo.
- The logo should have a proper alt attribute.

### Center

Display the application title (should not be translated? use hardcoded text):

"Last War Shiny Tracker"

Requirements:

- It should always appear visually centered.
- Use the typography styles defined by the design system.
- Make it the primary visual element of the header.

### Right

Display two actions:

1. Language selector
   - Globe icon.
   - Opens a dropdown menu.
   - Uses the existing i18n configuration.
   - Show all supported languages.
   - Highlight the currently selected language.
   - Switching language should immediately call i18n.changeLanguage().
   - The menu should be keyboard accessible.

2. Settings button
   - Gear icon.
   - Icon-only button.
   - Include proper aria-label.
   - The click handler can contain a TODO placeholder if the Settings page/modal is not implemented.

## Visual Design

The header should clearly stand out from the page content without being visually heavy.

Prefer one of these approaches:

- Slightly elevated card appearance
- Subtle border
- Soft background using existing design tokens
- Rounded corners
- Small shadow
- Comfortable spacing

Do NOT use bright colors or strong borders.

The appearance should feel modern, lightweight and consistent with the rest of the application.

## Responsive Behavior

Desktop:

- Logo on the left
- Title centered
- Actions on the right

Mobile:

- Keep all controls on one row if possible.
- Preserve the centered title.
- Maintain comfortable touch targets (minimum 44x44 px).

## Accessibility

- Proper semantic <header>.
- Keyboard accessible dropdown.
- aria-labels for icon buttons.
- Visible focus states.
- Screen reader friendly.

## Code Quality

- Create reusable components if appropriate (LanguageSwitcher, HeaderActions, etc.).
- Keep the component clean and easy to extend.
- Avoid hardcoded spacing values when design tokens already exist.
- Use lucide-react icons.

## Deliverables

Implement:

- Header component
- LanguageSwitcher component
- Required styling
- Integration with i18n
- Responsive layout
- Accessible interactions

Do not modify unrelated parts of the application.
