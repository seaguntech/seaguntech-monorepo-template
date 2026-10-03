# @seaguntech/typescript-config

<div align="center">

Shared TypeScript configurations for the monorepo.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

</div>

---

## 📋 Overview

This package contains shared TypeScript configuration files used across all packages and applications in the monorepo. It ensures consistent TypeScript settings, type checking rules, and compilation options.

## 📦 Installation

This package is automatically available to workspace packages:

```json
{
  "devDependencies": {
    "@seaguntech/typescript-config": "workspace:*"
  }
}
```

## 🛠 Available Configurations

### `base.json`

The foundational TypeScript configuration with strict type checking.

```json
{
  "extends": "@seaguntech/typescript-config/base.json"
}
```

**Features:**

- Strict mode enabled
- ESNext module resolution
- ES2022 target compilation
- Declaration file generation
- Source maps enabled

### `react-native-library.json`

Optimized configuration for React Native library packages.

```json
{
  "extends": "@seaguntech/typescript-config/react-native-library.json"
}
```

**Features:**

- React JSX transformation
- React Native types included
- Bundler module resolution
- ES2019 target for compatibility
- Path aliases support

## 💻 Usage

### For React Native Libraries

```json
{
  "extends": "@seaguntech/typescript-config/react-native-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### For Base Packages (Config packages, Utils)

```json
{
  "extends": "@seaguntech/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## ⚙️ Configuration Details

### Base Configuration

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

### React Native Library Configuration

Extends `base.json` with:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2019",
    "types": ["react-native"],
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": true
  }
}
```

## 🎯 Strict Type Checking

All configurations enable strict TypeScript checking:

- ✅ `strict: true` - Enable all strict type checking options
- ✅ `noUncheckedIndexedAccess` - Prevent unsafe array/object access
- ✅ `isolatedModules` - Ensure files can be safely transpiled
- ✅ `skipLibCheck` - Skip type checking of declaration files

## 📝 Path Aliases

The React Native library config supports path aliases:

```typescript
{
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/screens/*": ["./src/screens/*"]
  }
}
```

## 🔧 Custom Overrides

You can override any setting in your package's `tsconfig.json`:

```json
{
  "extends": "@seaguntech/typescript-config/react-native-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./custom/path/*"]
    }
  }
}
```

## 📚 Best Practices

### 1. Don't Override Strict Settings

```json
// ❌ Don't disable strict mode
{
  "extends": "@seaguntech/typescript-config/base.json",
  "compilerOptions": {
    "strict": false
  }
}

// ✅ Keep strict mode enabled
{
  "extends": "@seaguntech/typescript-config/base.json"
}
```

### 2. Use Appropriate Config

```json
// ✅ For React Native components
{
  "extends": "@seaguntech/typescript-config/react-native-library.json"
}

// ✅ For utility packages
{
  "extends": "@seaguntech/typescript-config/base.json"
}
```

### 3. Specify Include/Exclude

```json
{
  "extends": "@seaguntech/typescript-config/base.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## 🐛 Troubleshooting

### Module Resolution Issues

If you encounter module resolution errors:

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
pnpm install

# Run type check
pnpm check-types
```

### Path Alias Not Working

Ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📖 Reference

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [React Native TypeScript](https://reactnative.dev/docs/typescript)

## 🤝 Contributing

To modify TypeScript configurations:

1. Update the appropriate config file in `packages/typescript-config`
2. Test across all packages: `pnpm check-types`
3. Document any breaking changes
4. Update this README

---

<div align="center">
Part of the Seaguntech monorepo
</div>
