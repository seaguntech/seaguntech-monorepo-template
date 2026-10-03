# @seaguntech/prettier-config

<div align="center">

Shared Prettier configuration for the monorepo.

[![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E)](https://prettier.io/)

</div>

---

## 📋 Overview

This package contains the shared Prettier configuration used across all packages and applications in the monorepo. It ensures consistent code formatting throughout the codebase.

## 📦 Installation

This package is automatically available to workspace packages:

```json
{
  "devDependencies": {
    "@seaguntech/prettier-config": "workspace:*"
  }
}
```

## 💻 Usage

### In `prettier.config.js`

```javascript
const baseConfig = require('@seaguntech/prettier-config/base');

/** @type {import("prettier").Config} */
module.exports = baseConfig;
```

### With Custom Overrides

```javascript
const baseConfig = require('@seaguntech/prettier-config/base');

/** @type {import("prettier").Config} */
module.exports = {
  ...baseConfig,
  // Your custom overrides
  printWidth: 100,
  tabWidth: 4,
};
```

### In `package.json`

```json
{
  "prettier": "@seaguntech/prettier-config/base"
}
```

## ⚙️ Configuration

### Base Configuration

```javascript
module.exports = {
  // Basic formatting
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,

  // Trailing commas
  trailingComma: 'all',

  // Quotes
  quoteProps: 'as-needed',
  jsxSingleQuote: false,

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Line endings
  endOfLine: 'lf',

  // Prose
  proseWrap: 'preserve',

  // File extensions
  overrides: [],
};
```

## 🎯 Key Rules

### Semicolons: Always

```typescript
// ✅ Correct
const x = 1;
function foo() {
  return 'bar';
}

// ❌ Wrong (Prettier will auto-fix)
const x = 1
function foo() {
  return 'bar'
}
```

### Single Quotes: For Strings

```typescript
// ✅ Correct
const message = 'Hello World';
import { Button } from '@seaguntech/ui';

// ❌ Wrong (Prettier will auto-fix)
const message = "Hello World";
```

### Trailing Commas: All

```typescript
// ✅ Correct
const obj = {
  a: 1,
  b: 2,
};

const arr = [1, 2, 3];

// ❌ Wrong (Prettier will auto-fix)
const obj = {
  a: 1,
  b: 2
};
```

### Print Width: 80 Characters

```typescript
// ✅ Correct - Properly wrapped
const message = formatMessage(
  'This is a very long message that exceeds the print width',
  options,
);

// ❌ Wrong - Too long
const message = formatMessage('This is a very long message that exceeds the print width', options);
```

## 📝 Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --check --ignore-path .gitignore .",
    "format:fix": "prettier --write --ignore-path .gitignore ."
  }
}
```

### Running Format Check

```bash
# Check formatting
pnpm format

# Auto-fix formatting
pnpm format:fix

# Format specific files
prettier --write "src/**/*.{ts,tsx}"
```

## 🔧 IDE Integration

### VS Code

Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ

1. Go to `Settings > Languages & Frameworks > JavaScript > Prettier`
2. Set Prettier package path
3. Check "On code reformat"
4. Check "On save"

## 📄 .prettierignore

Create a `.prettierignore` file in your project root:

```gitignore
# Dependencies
node_modules

# Build outputs
dist
build
.next
.expo

# Generated files
*.min.js
*.bundle.js

# Package manager files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Cache
.turbo
.cache
```

## 🎨 File Type Specific

### TypeScript/JavaScript

```typescript
// Formatted automatically
const MyComponent = ({ title, description }: Props) => {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
};
```

### JSON

```json
{
  "name": "package",
  "version": "1.0.0",
  "scripts": {
    "format": "prettier --write ."
  }
}
```

### Markdown

```markdown
# Title

This is properly formatted markdown with consistent line breaks
and spacing.

- List item 1
- List item 2
```

## 🔄 Pre-commit Integration

Prettier runs automatically via Husky hooks (configured at root level):

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

## 📚 Best Practices

### 1. Don't Disable Formatting

```typescript
// ❌ Avoid disabling Prettier
// prettier-ignore
const ugly = {a:1,b:2,c:3};

// ✅ Let Prettier format
const clean = { a: 1, b: 2, c: 3 };
```

### 2. Use Consistent Config

```javascript
// ✅ Use base config
module.exports = require('@seaguntech/prettier-config/base');

// ❌ Don't create completely custom config
module.exports = {
  /* custom config */
};
```

### 3. Format Before Commit

```bash
# Always format before committing
pnpm format:fix
git add .
git commit -m "feat: add new feature"
```

## 🐛 Troubleshooting

### Formatting Not Applied

```bash
# Clear Prettier cache
rm -rf node_modules/.cache/prettier

# Reinstall
pnpm install

# Force format
pnpm format:fix
```

### Conflicts with ESLint

Ensure you have `eslint-config-prettier` installed to disable conflicting ESLint rules:

```json
{
  "extends": ["@seaguntech/eslint-config", "prettier"]
}
```

### Different Formatting in IDE vs CLI

1. Ensure VS Code uses workspace Prettier version
2. Check `.vscode/settings.json` configuration
3. Restart VS Code

## 📖 Reference

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Configuration Options](https://prettier.io/docs/en/options.html)
- [Ignore Code](https://prettier.io/docs/en/ignore.html)

## 🤝 Contributing

To modify Prettier configuration:

1. Update `base.js` in `tooling/prettier-config`
2. Test formatting across packages: `pnpm format`
3. Document changes in this README
4. Update all packages: `pnpm format:fix`

---

<div align="center">
Part of the Seaguntech monorepo
</div>
