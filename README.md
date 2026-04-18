# Ahya React technical assessment

Small React app I put together for the take-home: dashboard, onboarding, product listing against DummyJSON, and a tiny design-system style library. Nothing exotic in the stack on purpose — I wanted the code to read like something you would actually ship on a product team.

## Live demo

**Production:** [ahmedayaz-react-technical-assessment.vercel.app](https://ahmedayaz-react-technical-assessment.vercel.app/)

This is the same build as `npm run build` / `vite build`, hosted on Vercel.

## Run it locally

You need **Node 20+** (I used the current LTS line) and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Other useful commands:

```bash
npm run build    # typecheck + production bundle
npm run preview  # serve the production build locally
npm run lint     # eslint
```

## What you are looking at

| Area (sidebar) | Route | Notes |
| --- | --- | --- |
| Dashboard | `/` | Mock KPIs, chart, transactions table |
| Shop | `/products` | Live DummyJSON, search debounce, pagination |
| Profile | `/onboarding` | Three steps, blur validation, no form library |
| Library | `/library` | Buttons, inputs, modal, tooltip, toasts |
| Settings | `/settings` | Light placeholder screen |

Sidebar labels (**Dashboard**, **Shop**, **Profile**, **Library**, **Settings**) are mapped to those routes in `Layout.tsx` so the shell reads like a small product.

## SEO (titles, meta, social)

The app is a client-rendered SPA, so **per-route** metadata is applied in JavaScript after navigation — fine for real users, bookmarks, and many social crawlers that execute JS. Anything that only reads static HTML still sees `index.html` until you add SSR or prerender later.

**What runs**

- `src/config/seo.ts` — `SITE_NAME` plus `resolvePageSeo(pathname)` returning a **title** and **description** for `/`, `/products`, `/onboarding`, `/library`, and `/settings` (aligned with sidebar: Dashboard, Shop, Profile, Library, Settings).
- `src/components/layout/RouteSeo.tsx` — mounted inside `BrowserRouter` in `App.tsx`. On each `pathname` change it sets `document.title` and upserts (create-or-update) these tags: `meta[name=description]`, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`), and Twitter card fields (`twitter:card`, `twitter:title`, `twitter:description`).
- `index.html` — baseline `<title>`, `meta[name=description]`, and `og:site_name` so the first paint is sensible before the bundle loads.

**Why no `react-helmet`**

A tiny helper avoids an extra dependency while still centralizing copy. If the project grows, swapping to `react-helmet-async` would be straightforward.

## Technical decisions (why I did it this way)

**State management**  
I stayed with React state and context. Global pieces are limited to **theme** (`ThemeContext`) and **toasts** (`ToastProvider` + `useToast`). Everything else is local component state or a small amount of lifted state in page components. I did not pull in Redux or Zustand because the data flow never crossed that complexity threshold, and I wanted reviewers to see the actual UI logic without indirection.

**Styling**  
App shell and marketing-style pages use **Tailwind v4** with the Vite plugin so layout stays fast to iterate on. The reusable primitives for the assessment live under `src/components/library` and use **CSS Modules** plus a shared `tokens.css` file so the “library” is visibly separate from the Tailwind surface. That split was a deliberate constraint from the brief, and it also mirrors how teams often keep a token-driven core and utility classes at the edges.

**Component structure**  
`pages/` holds route-level screens. `features/` groups onboarding and dashboard-specific helpers (validators, mock data, glyph map). `components/layout` is the responsive shell (sidebar, navbar, bottom nav on small screens). I kept imports shallow — pages import features and library components directly rather than through a deep barrel file tree.

**Products / networking**  
DummyJSON’s payloads do not match the older FakeStore-style shape (`image` vs `thumbnail`, numeric `rating`, category list as objects). Normalization lives in `src/services/productsApi.ts` so the UI always sees a consistent `Product` type. In development, fetches go through a **Vite proxy** (`/api/dummyjson` → dummyjson.com) so the browser talks same-origin; production still hits the public API directly. Search is **debounced**; list requests use `AbortController` so a slow response cannot overwrite a newer filter. Pagination uses `limit` + `skip` rather than infinite scroll so the UX stays predictable and abort semantics stay obvious.

**Performance**  
I memoized leaf widgets where it buys something (product cards, table rows, chart bar data) and avoided pointless `useMemo` on trivial work. The products list effect was tightened so changing category or search does not fire an extra request on a stale page index before resetting to page one.

## Known limitations (what I would do with more time)

- **Tests**: No Playwright or RTL suite yet; I would add smoke tests for onboarding validation and the products happy path.
- **Accessibility**: Modal and toasts are decent, but I would run a full axe pass and tighten focus order on the mobile drawer.
- **API resilience**: Retry with exponential backoff and a stale-time cache for categories would be next steps for flaky networks.
- **Design system**: Tokens are minimal; I would document spacing and motion in a short MDX page and add visual regression if this grew past a demo.

## Rough time spent

These are honest ballparks including polish and fixing API surprises — not billable precision.

| Piece | Time |
| --- | ---: |
| Task 1 — Dashboard | ~4 h |
| Task 2 — Onboarding | ~3.5 h |
| Task 3 — Products + API normalization | ~4 h |
| Task 4 — Library + toasts | ~3.5 h |
| Shell, routing, README, cleanup passes | ~2.5 h |

## Dashboard & nav SVG assets

**Where files live**

| Purpose | Folder | Wired in |
| --- | --- | --- |
| KPI strip (revenue, users, conversion) | `src/assets/icons/dashboard/` | `src/features/dashboard/dashboardGlyphs.ts` |
| Chart / export / calendar (same folder) | `src/assets/icons/dashboard/` | same |
| Sidebar / bottom nav | `src/assets/icons/` (`nav-*.svg`) | `src/components/layout/navGlyphs.ts` |

**How they are loaded**

Icons are imported with Vite’s `?raw` into `dashboardGlyphHtml` / `navGlyphHtml` and injected as markup through `DashboardGlyph` / `NavGlyph`. That keeps them in the bundle, cache-friendly, and avoids extra HTTP round-trips.

**Why tweak or replace SVGs**

- **Color:** Prefer `stroke="currentColor"` and/or `fill="currentColor"` so Tailwind classes on the wrapper (`text-primary`, etc.) control the stroke/fill. Hard-coded hex in the SVG fights the theme.
- **ViewBox:** A consistent viewBox (e.g. 24×24) keeps `className="size-5"` / `size-10` predictable.
- **KPI tiles:** Replacing **`icon-dollar.svg`**, **`icon-users-metric.svg`**, and **`icon-percent.svg`** updates the three KPI cards without touching TS — those filenames are already mapped to `dollar`, `usersMetric`, and `percent` in `dashboardGlyphs.ts`.
- **Product/API reality:** DummyJSON uses different shapes than older examples; separate from SVGs, product thumbnails are normalized in `productsApi.ts` so list cards always get an `image` URL.

## Favicon & tab icon

The browser tab icon comes from **`public/favicon.svg`**, referenced in `index.html` as:

`<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`

Replace that file with your own SVG (simple mark, good contrast at 16×16). Most teams keep **one** global favicon for the whole SPA; changing it per route is uncommon and not wired here.

## PageSpeed Insights

Quality checks on the production deploy use Google’s **[PageSpeed Insights](https://pagespeed.web.dev/)** (same Lighthouse engine as Chrome DevTools). The goal is **100/100** across **Performance**, **Accessibility**, **Best Practices**, and **SEO** on both mobile and desktop. Enter the live URL, run the analysis, and use the reported opportunities (render-blocking resources, unused JS, accessibility issues, etc.) as the checklist for fixes. Lab scores can move a point or two between runs because of network variance and simulated throttling.

---

Thanks for reading — if something does not build on your machine, double-check Node version and that port `5173` is free.
