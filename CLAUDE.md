@AGENTS.md

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (config in `app/globals.css` via `@theme`, no `tailwind.config.js`)
- **Forms**: React Hook Form + Zod + Server Actions
- **Responsive**: Mobile First
- **Package Manager**: pnpm

## Commands

| Command                  | Description                  |
| ------------------------ | ---------------------------- |
| `pnpm install`           | Install dependencies         |
| `pnpm dev`               | Start dev server (port 3000) |
| `pnpm build`             | Production build             |
| `pnpm start`             | Run production build         |
| `pnpm lint`              | Run ESLint                   |
| `pnpm exec tsc --noEmit` | Type-check without emitting  |

> The `dev` script must include `-p 3000` (e.g. `"dev": "next dev -p 3000"`).

## Git Workflow

- Branches: `main` (production), `feature/*`, `fix/*`
- Commit messages in **English**, conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Commits are authored by the repo owner only: **no `Co-Authored-By: Claude` trailer** or any other AI attribution in commit messages or PR descriptions
- Be descriptive about the "why", not just the "what"

## Project Structure

This is an **authenticated web payments terminal** (not a landing page), so the architecture is **feature-based**. The unit of organization is a business flow (login, venta, consultas, cancelación, devolución), and copy/data lives apart from UI. The `@/*` alias points at `src/*`.

```
spark-pay/
├── app/                          # Routes ONLY (App Router)
│   ├── layout.tsx                # Root layout: fonts, metadata, providers
│   ├── page.tsx                  # Redirects to /login
│   ├── not-found.tsx
│   ├── globals.css               # Design tokens (@theme)
│   ├── (auth)/login/page.tsx
│   ├── (app)/
│   │   ├── operador/             # + venta, consultas
│   │   └── supervisor/           # + cancelacion, devolucion
│   └── api/                      # Route Handlers (BFF proxy to the mock backend)
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       └── transacciones/…/route.ts
│
├── src/
│   ├── features/                 # One folder per business flow
│   │   ├── auth/login-form.tsx   # "use client" leaf
│   │   ├── venta/                # sale-form, card-preview
│   │   ├── consultas/            # transactions-table, transaction-item
│   │   ├── reversal/             # reversal-form (cancelación + devolución)
│   │   └── home/                 # role-home, role-card, action-card
│   │
│   ├── components/
│   │   ├── ui/                   # Own primitives (Button, Badge, Input, Toast…)
│   │   └── layout/               # AppShell, Navbar, Sidebar, Footer, PageHeader
│   │
│   ├── content/                  # Copy & data: nav, role labels, toast messages…
│   │   └── mock-data.ts
│   │
│   ├── actions/                  # Server Actions ("use server"), with their Zod schema
│   │
│   ├── types/                    # Shared domain types
│   │
│   └── lib/
│       ├── cn.ts                 # cn() + helpers
│       ├── format.ts             # Intl money/date formatters
│       ├── env.ts                # Validated env (Zod)
│       ├── api.ts                # Backend base URL + fetch helpers
│       └── auth.ts               # JWT decode, role, cookie helpers
│
├── public/
├── middleware.ts                 # Reads the auth cookie, guards routes by role
├── next.config.ts
└── package.json
```

### Structure rules

- **`app/**/page.tsx` only composes features and layout**. No business logic or heavy markup there.
- **A feature must not import from another feature.** Anything shared goes to `src/components/` or `src/lib/`.
- **Subcomponents live inside their feature folder** until a second feature needs them; only then move them to `src/components/`.
- **Feature variants** go in the same folder. Don't create a new feature for a variant.
- **No hardcoded copy in components.** Texts, labels, lists and image paths live in `src/content/`, typed with `satisfies` or an explicit type, so copy can change without touching UI.
- `src/types/` holds shared domain types. Don't create `hooks/`, `store/` or `context/` folders preemptively — add them only when something real needs them.

## Code Rules

### Naming

- **Files & folders**: `kebab-case`
- **React components**: `PascalCase` (file stays `kebab-case`)
- **Hooks**: `use-*` prefix

### TypeScript

- Strict mode always on. **No `any`**: use proper types or `unknown`.
- Check null/undefined and array lengths before access.

### Server vs Client Components

- **Default to Server Components.** Pages, layouts and feature entries are server components.
- **`"use client"` only when there is no server/HTML/CSS alternative.** Before adding it, prefer native platform features: `<details>`/`<summary>`, `<dialog>`, the Popover API (`popover` + `popovertarget`, e.g. the mobile menu), CSS `:has()`, `@starting-style`, `aria-*`/`data-*` variants.
- When it's unavoidable (e.g. a form, IntersectionObserver, scrolling without changing the URL), keep it in a **tiny, reusable leaf** that server components compose. Never mark a page, a layout component or the whole navbar as client.
- **Mutations go through Server Actions or BFF Route Handlers** (`app/api/*`), never direct client→backend fetch. The browser only talks to our own origin; the Route Handler/Action proxies to the mock backend and holds the JWT in an httpOnly cookie.

### Styling & Colors

- **No arbitrary color values** (`bg-[#111113]`, `text-[rgb(...)]`, inline `style` colors). Use only design tokens from `@theme` in `app/globals.css` (`accent`, `accent-hover`, `surface`…) or Tailwind's default palette (`black`, `white`, `zinc-*`…), with opacity modifiers when needed (`text-white/70`).
- A color the design needs that doesn't exist yet becomes a **named token** in `@theme` first (e.g. `--color-surface`), then is used by name.

### Imports

- Use the `@/*` path alias for `src/` imports.
- Order: external packages → `@/` internal → relative, **with no blank lines between groups**.

### Comments

- **Avoid comments.** Code should explain itself through naming and structure. Don't add JSDoc, section dividers or comments that restate what the code does. Only comment a genuinely non-obvious _why_ that can't be expressed in code, and keep it to one line.

### Environment Variables

- Client-exposed vars must be prefixed `NEXT_PUBLIC_*`.
- Validate all env vars in `src/lib/env.ts` with Zod and import from there, never `process.env` directly.

## Validation (Zod)

- **All user input goes through Zod.** No hand-written validation.
- **Infer types from schemas**: `type ContactInput = z.infer<typeof ContactSchema>`.
- **One schema, both layers**: the form uses `@hookform/resolvers/zod` and the Server Action re-validates with the same schema.
- Server Actions use `safeParse` and return field errors, never throw raw to the client:
  ```ts
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  ```
- If an external service is called (email provider, CRM, CMS), validate its response with Zod before using it.

## Error Handling & UX

- Handle errors explicitly in Server Actions; log with context, never expose internals.
- **User-facing messages in Spanish**, clear and actionable (e.g. "No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.").
- Forms must show loading, success and error states.

## Accessibility & Semantic HTML

- No component library: primitives are built in-house, so a11y is our responsibility.
- Every interactive element is keyboard-navigable, has a visible focus state and an accessible label.
- **Every clickable element shows `cursor: pointer`** (disabled ones `not-allowed`). Tailwind v4 removed it from buttons, so it's set globally in `app/globals.css` (`@layer base`); custom clickable elements outside those selectors need `cursor-pointer`. Non-interactive elements (e.g. cards that aren't links) must not use it.
- Prefer native elements before custom ones: `<button>` for actions, `<a>` for navigation, `<dialog>` for modals.
- Custom interactive widgets must expose the right ARIA state (`aria-expanded`, `aria-pressed`, `aria-controls`); e.g. the mobile menu toggle and the sidebar collapse.
- `<main>` is rendered once per page shell (the app shell for authenticated views, the auth shell for login). A component must not render a second `<main>`.
- **Group related content in a `<section>`** with `aria-labelledby` pointing at its heading.
- Use `<header>`, `<nav>`, `<footer>`, `<aside>` where they apply; `<div>` only for pure layout wrappers.
- **One `<h1>` per page** (the page's main heading); other blocks start at `<h2>`.
- Respect `prefers-reduced-motion` for animations.

## SEO & Performance

- This is a **private, authenticated app**: it must **not** be indexed. Set `robots: { index: false, follow: false }` in metadata; no sitemap, no Open Graph needed.
- Define base `metadata` (title template, description) in `app/layout.tsx`; override `title` per page.
- **Images**: always `next/image` with `alt`, explicit sizes and `sizes`.
- **Fonts**: `next/font` only, no external font `<link>`.
- Authenticated pages read the auth cookie, so they render dynamically — that's expected. Keep uncached backend fetches on the server (Route Handlers / Actions), not the client.
- Keep client JS minimal: avoid heavy animation libraries for effects CSS can do.

## Testing

- **E2E (Playwright)**: smoke test that the page renders, anchor navigation works and the contact form submits (success and validation error).
- **Unit (Vitest)**: only for Server Actions and non-trivial helpers. Co-locate as `*.test.ts`.
