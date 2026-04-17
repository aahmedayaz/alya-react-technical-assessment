# Alya React Technical Assessment

This project implements the four tasks below using **React 19**, **Vite**, **TypeScript**, **Tailwind CSS** for app layout/pages, and a **CSS Modules** component library for Task 4 primitives.

## Routes (sidebar mapping)

| Sidebar label | Route | Page |
| --- | --- | --- |
| Dashboard | `/` | Task 1 dashboard |
| Analytics | `/products` | Task 3 product explorer |
| Reports | `/onboarding` | Task 2 onboarding |
| Users | `/library` | Task 4 component gallery |
| Settings | `/settings` | Settings demo |

## Task 1 — Dashboard icons (your assets)

Place SVGs (prefer `stroke="currentColor"` / `fill="currentColor"` where possible) in:

**Folder:** `src/assets/icons/dashboard/`

| Filename | Used for |
| --- | --- |
| `icon-calendar.svg` | Date range control |
| `icon-download.svg` | Export button |
| `icon-dollar.svg` | Revenue KPI |
| `icon-users-metric.svg` | Active users KPI |
| `icon-percent.svg` | Conversion KPI |
| `icon-trend-up.svg` | (reserved / future KPI deltas) |
| `icon-trend-down.svg` | (reserved / future KPI deltas) |

They are wired through `src/features/dashboard/dashboardGlyphs.ts`.

## Task 3 — Pagination vs infinite scroll

**Choice:** numbered **pagination** (Previous / Next) with `limit` + `skip` against DummyJSON.

**Reasoning:** pagination gives stable UI anchors, predictable network usage, and straightforward **abort semantics** for in-flight requests when filters change. Infinite scroll is great for feeds, but it complicates “no stale results” and accessibility without extra work.

**Debounce:** search input is debounced at **400ms** (`src/hooks/useDebounce.ts`) so list requests do not fire on every keystroke.

## Task 4 — Component library

Located in `src/components/library/`:

- `Button` (`Button.module.css`)
- `Input` (`Input.module.css`)
- `DsModal` (`DsModal.module.css`) — focus trap, Escape, overlay click
- `Tooltip` (`Tooltip.module.css`)
- Global tokens: `tokens.css`

Toast UI is rendered via `ToastStack` (CSS Modules) from `ToastContext`.

---

## React + TypeScript + Vite (template)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configurations...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configurations...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also add [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configurations...
      // Enable React lint rules
      reactX.configs['recommended-typescript'],
      // Enable React DOM lint rules
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
