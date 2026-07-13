# AGENTS.md — AI Agent Rules & Coding Standards
# CrowdFund Platform (Client — Next.js 16 / React 19 / TypeScript)

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ Critical: This is NOT the Next.js you know

This project uses **Next.js 16.2.10** with **React 19.2.4** and **Tailwind CSS v4**.
APIs, conventions, and file structure may all differ from your training data.
**Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`.**
Heed all deprecation notices. Never assume behavior from older Next.js versions.
<!-- END:nextjs-agent-rules -->

---

## 1. Project Identity

| Property         | Value                                      |
|------------------|--------------------------------------------|
| **App Name**     | CrowdFund — Community Crowdfunding Platform |
| **Stack**        | Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 |
| **Backend**      | Express 5 · Node.js · MongoDB · JWT — **all code in `Server/index.ts`** |
| **Auth**         | JWT in **httpOnly cookie** (`cf_token`)    |
| **Roles**        | Supporter · Creator · Admin                |

---

## 2. TypeScript Rules

- **Strict mode is ON** — `tsconfig.json` must have `"strict": true`.
- Never use `any`. Use `unknown` and narrow with type guards.
- Every function, component prop, and API response **must** have explicit types.
- Use `interface` for object shapes and `type` for unions / intersections.
- Use `enum` only when values are truly constant and discrete.
- Export types from a central `src/types/` directory, grouped by domain:
  - `src/types/user.types.ts`
  - `src/types/campaign.types.ts`
  - `src/types/contribution.types.ts`
  - `src/types/api.types.ts`
- Use `satisfies` operator where appropriate to preserve literal types.

---

## 3. Project Structure (App Router — Client)

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public layout group
│   │   ├── layout.tsx            # Navbar + Footer
│   │   ├── page.tsx              # Home / Landing
│   │   ├── campaigns/
│   │   │   ├── page.tsx          # Explore Campaigns (listing)
│   │   │   └── [id]/page.tsx     # Campaign Details
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/page.tsx
│   │   └── faq/page.tsx
│   ├── (auth)/                   # Auth layout group (no navbar/footer)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Protected layout group
│   │   ├── layout.tsx            # Sidebar + Header
│   │   └── dashboard/
│   │       ├── page.tsx          # Role-specific home
│   │       ├── explore/page.tsx
│   │       ├── my-contributions/page.tsx
│   │       ├── purchase-credit/page.tsx
│   │       ├── payment-history/page.tsx
│   │       ├── add-campaign/page.tsx
│   │       ├── my-campaigns/page.tsx
│   │       ├── withdrawals/page.tsx
│   │       ├── manage-users/page.tsx
│   │       ├── manage-campaigns/page.tsx
│   │       └── withdrawal-requests/page.tsx
│   ├── globals.css
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # Primitive / atomic components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   ├── common/                   # Shared layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   └── DashboardHeader.tsx
│   ├── home/                     # Landing page sections
│   │   ├── HeroSlider.tsx
│   │   ├── TopFundedCampaigns.tsx
│   │   ├── Testimonials.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ExploreByCategory.tsx
│   │   ├── PlatformStats.tsx
│   │   ├── Newsletter.tsx
│   │   └── CallToAction.tsx
│   ├── campaigns/
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignGrid.tsx
│   │   ├── CampaignFilters.tsx
│   │   └── ContributeModal.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       ├── ContributionsTable.tsx
│       └── WithdrawalForm.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useCampaigns.ts
│   ├── useContributions.ts
│   └── useCredits.ts
├── lib/                          # Utilities & config
│   ├── api.ts                    # Axios instance + interceptors
│   ├── utils.ts                  # cn(), formatCurrency(), formatDate()
│   ├── queryKeys.ts              # TanStack Query key factory
│   └── constants.ts              # CREDIT_RATE, MIN_WITHDRAWAL, etc.
├── store/                        # Zustand global state
│   ├── authStore.ts
│   └── creditStore.ts
├── types/                        # All TypeScript types
│   ├── user.types.ts
│   ├── campaign.types.ts
│   ├── contribution.types.ts
│   └── api.types.ts
└── middleware.ts                 # Auth guard — protects /dashboard/*
```

### Server Structure (Single File)

```
Server/
├── index.ts    ← ENTIRE backend: models, middleware, routes, logic
├── .env        ← Never commit
├── package.json
└── tsconfig.json
```

> ⚠️ **All server code lives in `Server/index.ts`.**
> No sub-folders, no separate files. Organize with clearly labeled sections and comments inside the single file.

---

## 4. Naming Conventions

| Artifact            | Convention                | Example                        |
|---------------------|---------------------------|--------------------------------|
| React Components    | PascalCase                | `CampaignCard.tsx`             |
| Hooks               | camelCase prefixed `use`  | `useCampaigns.ts`              |
| Types / Interfaces  | PascalCase                | `Campaign`, `ApiResponse<T>`   |
| Constants           | SCREAMING_SNAKE_CASE      | `CREDIT_RATE`, `MIN_WITHDRAWAL`|
| API functions       | camelCase verb-noun       | `getCampaigns`, `postContribution` |
| Route files         | lowercase kebab           | `add-campaign/page.tsx`        |
| CSS variables       | `--cf-*` prefix           | `--cf-primary`, `--cf-surface` |

---

## 5. Design System (Tailwind CSS v4)

### Color Palette (max 3 primary + neutrals)
```css
/* In globals.css — define as CSS custom properties */
--cf-primary:      #6C47FF;   /* Violet — brand primary */
--cf-secondary:    #00D4AA;   /* Teal — accents, success */
--cf-accent:       #FF6B35;   /* Coral — CTAs, warnings */
--cf-bg:           #0D0F1A;   /* Near-black background */
--cf-surface:      #161827;   /* Card / panel surface */
--cf-surface-2:    #1E2130;   /* Elevated surface */
--cf-border:       #2A2D40;   /* Subtle borders */
--cf-text:         #E8EAFF;   /* Primary text */
--cf-text-muted:   #8890B0;   /* Muted / secondary text */
```

### Typography
- **Font**: `Inter` from Google Fonts (loaded via `next/font/google`)
- Scale: `text-xs` → `text-sm` → `text-base` → `text-lg` → `text-xl` → `text-2xl` → `text-3xl` → `text-4xl` → `text-5xl`
- Headings: `font-bold` or `font-extrabold`
- Body: `font-normal`, line-height `leading-relaxed`

### Component Consistency Rules
- **All cards**: same `rounded-xl`, same `p-5` padding, same `border border-[--cf-border]`
- **Buttons**: `rounded-lg`, `px-5 py-2.5`, `font-semibold`, transition on hover
- **Inputs**: `rounded-lg`, `px-4 py-3`, `border border-[--cf-border]`, `bg-[--cf-surface]`
- **Grid**: Desktop 4 cols (`grid-cols-4`), Tablet 2 cols, Mobile 1 col
- **Shadows**: `shadow-lg shadow-black/30` for elevated surfaces

### Animation Principles
- Use `transition-all duration-200 ease-out` for hover/focus states
- Use Framer Motion for page entrance animations and modals
- Hero slider: auto-play, 4 s interval, smooth fade/slide transition
- Skeleton loaders: pulse animation on card placeholders
- No heavy CPU animations — prefer `transform` and `opacity`

---

## 6. Component Rules

1. Every component must be a **named export** (no default-only exports for reusable components).
2. Props interface must be declared **above** the component in the same file.
3. Use `React.FC<Props>` OR explicit return type — be consistent (choose explicit return type).
4. Avoid inline styles. Use Tailwind classes exclusively.
5. Extract repeated class strings into `cn()` utility calls.
6. Never hardcode colors — use CSS variables or Tailwind tokens.
7. Skeleton loaders must be implemented for all data-fetching cards.

---

## 7. Data Fetching Rules

- Use **Axios** with a configured instance in `src/lib/api.ts`.
- All requests must attach the JWT `Authorization: Bearer <token>` header via an interceptor.
- Use **React Query (TanStack Query)** for all server state — no raw `useEffect` + `useState` for API calls.
- Define query keys in `src/lib/queryKeys.ts`.
- Handle `isLoading`, `isError`, and `data` states explicitly in every component.
- Never expose raw error objects to the UI — always show user-friendly messages.

---

## 8. Authentication Rules

- JWT stored in an **httpOnly cookie** named `cf_token` — set by the server on login/register.
- Cookie attributes: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production), `maxAge: 7 days`.
- **Never** store the JWT in `localStorage` or `sessionStorage` — prevents XSS token theft.
- User session (role, credits, name, avatar) stored in **Zustand** (`authStore`) — populated by calling `GET /api/auth/me` on app mount.
- `src/middleware.ts` reads the `cf_token` cookie via `request.cookies.get('cf_token')` to protect `/dashboard/*` routes.
- After page reload on protected routes, middleware reads the cookie server-side — no client redirect needed.
- Logout: server clears the cookie via `res.clearCookie('cf_token')`. Client clears Zustand store.
- Role checks must happen in middleware AND client-side in components.
- Available credits must be re-fetched and updated in Zustand after every contribution or withdrawal.

---

## 9. API Design (Express Server — `Server/index.ts`)

- Base URL: `http://localhost:8000/api`
- All routes follow REST conventions:
  - `GET /api/campaigns` — list
  - `GET /api/campaigns/:id` — detail
  - `POST /api/campaigns` — create
  - `PATCH /api/campaigns/:id` — update
  - `DELETE /api/campaigns/:id` — delete
- Responses follow shape: `{ success: boolean, data?: T, message?: string, error?: string }`
- All protected routes require `Authorization: Bearer <token>` header.
- Use Express 5 async route handlers — errors propagate automatically.
- Never return raw MongoDB `_id` — transform to `id: string` in response.
- **All server code is in one file** — organize with block comments:

```typescript
// ============================================================
// SECTION: Mongoose Models
// ============================================================

// ============================================================
// SECTION: Middleware (auth, roleGuard, errorHandler)
// ============================================================

// ============================================================
// SECTION: Auth Routes  POST /api/auth/register | /login | /me
// ============================================================

// ============================================================
// SECTION: Campaign Routes
// ============================================================

// ... etc.
```

---

## 10. Environment Variables

### Client (`d:/SCIC13/client/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

### Server (`d:/SCIC13/Server/.env`)
```
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/crowdfund
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Rules:**
- Never commit `.env` or `.env.local` files.
- Always prefix client-side vars with `NEXT_PUBLIC_`.
- Access via `process.env.VARIABLE_NAME` — never hardcode secrets.

---

## 11. Business Logic Constants

Define these at the top of `Server/index.ts` and in `src/lib/constants.ts`:

```typescript
const CREDIT_PURCHASE_RATE   = 10;   // 10 credits = $1
const CREDIT_WITHDRAWAL_RATE = 20;   // 20 credits = $1 for creators
const MIN_WITHDRAWAL_CREDITS = 200;  // minimum 200 credits to withdraw
const SUPPORTER_SIGNUP_CREDITS = 50;
const CREATOR_SIGNUP_CREDITS   = 20;
```

---

## 12. Git Commit Standards

Use **Conventional Commits** format:

```
type(scope): short description

Types: feat | fix | chore | docs | style | refactor | test | perf
Scopes: auth | campaigns | dashboard | ui | api | db | config
```

**Examples:**
```
feat(api): implement JWT auth, models, and all routes in index.ts
feat(campaigns): add filtering by category and min-funding
fix(dashboard): resolve credit re-hydration after page reload
chore(config): add imgBB upload utility
```

Minimum commits required:
- **Client**: 20 notable commits
- **Server**: 12 notable commits

---

## 13. Code Quality Rules

- **ESLint**: All warnings must be resolved before committing.
- **No `console.log`** in production code — use `console.error` only in catch blocks.
- **No dead code** — remove unused imports, variables, and functions.
- **No lorem ipsum** — all text must be meaningful and project-specific.
- **No placeholder images** — use real project assets or generated images.
- All `async` functions must have `try/catch` or rely on Express 5 auto-propagation.
- Components over 200 lines should be split into sub-components.

---

## 14. Responsiveness Checklist

Every page must pass:
- [ ] Mobile (375px) — single column, hamburger nav
- [ ] Tablet (768px) — 2-column grids, collapsible sidebar
- [ ] Desktop (1280px+) — 4-column card grids, full sidebar
- [ ] Dashboard sidebar collapses to icon-only on tablet, drawer on mobile

---

## 15. Accessibility (a11y)

- All interactive elements must have descriptive `aria-label` attributes.
- Images must have meaningful `alt` text.
- Color contrast ratio ≥ 4.5:1 for normal text.
- Keyboard navigation must work for all modals and forms.
- Focus rings must be visible (use `focus-visible:ring-2`).
