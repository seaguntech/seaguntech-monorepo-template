# @seaguntech/design-system

Shared Tailwind CSS v4 design system for the Seaguntech monorepo. This package
ships tokens, themes, base styles, and custom utilities as CSS, plus a PostCSS
config that enables `@tailwindcss/postcss`.

## Overview

- CSS-first Tailwind v4 (no `tailwind.config.js` required)
- Design tokens defined in `@theme` using CSS variables
- Theme overrides split into light/dark files
- Custom utilities declared with top-level `@utility`

## Installation

```json
{
  "devDependencies": {
    "@seaguntech/design-system": "workspace:*"
  }
}
```

## Exports

- `@seaguntech/design-system` -> `globals.css`
- `@seaguntech/design-system/globals` -> `globals.css`
- `@seaguntech/design-system/design-tokens` -> `design-tokens.css`
- `@seaguntech/design-system/theme-light` -> `theme-light.css`
- `@seaguntech/design-system/theme-dark` -> `theme-dark.css`
- `@seaguntech/design-system/postcss-config` -> `postcss-config.js`

## Usage

1. Configure PostCSS in your app or package:

```js
export { default } from '@seaguntech/design-system/postcss-config';
```

2. Import the globals once in your main CSS entry point:

```css
@import '@seaguntech/design-system';

/* package-specific styles */
```

3. Theme switching:

- Light theme lives in `:root` (`theme-light.css`)
- Dark theme uses `.dark` (`theme-dark.css`)
- Additional variants can be added via `@custom-variant` in `design-tokens.css`

## What is inside

- `globals.css`: Tailwind base layer and utilities
- `design-tokens.css`: source of truth for tokens (`@theme`)
- `theme-light.css` / `theme-dark.css`: semantic overrides

## Best practices

- Prefer semantic tokens over raw scale values
- Keep `@utility` blocks top-level (Tailwind v4 disallows nesting)
- Avoid custom utility names that collide with Tailwind color utilities (`text-primary`, `bg-primary`, etc.)
- Update both themes when you add new semantic tokens
- Import the globals only once per app/library

## Notes for apps in this monorepo

- Use `@source` in each app CSS entry to include monorepo packages in class scanning.
- Keep the design-system source of truth in CSS (`@theme`, `@utility`, `@custom-variant`).

## Migration (from @seaguntech/tailwind-config)

- Replace package dependency with `@seaguntech/design-system`
- Update imports to `@seaguntech/design-system` and `/postcss-config`

## Contributing

1. Update tokens in `design-tokens.css`
2. Adjust theme overrides as needed
3. Validate in Web and Storybook
