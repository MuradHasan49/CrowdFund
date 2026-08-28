# PROJECT_UI_AUDIT.md — CrowdFund Platform UI/UX Audit

> **Generated**: 2026-08-28 · **Purpose**: Read-only audit for sharing with another AI to plan a redesign.  
> **Scope**: Every page, component, layout, and global style under `src/`.

---

## 1. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.10 | Uses route groups `(public)`, `(auth)`, `(dashboard)` |
| **UI Library** | React | 19.2.4 | `'use client'` directives on interactive components |
| **Language** | TypeScript | ^5 | `strict: true` in `tsconfig.json` |
| **Styling** | Tailwind CSS v4 | ^4 | Via `@tailwindcss/postcss`; no `tailwind.config.js` — uses `@theme inline` + CSS custom props in `globals.css` |
| **CSS Utility** | `clsx` + `tailwind-merge` | 2.1.1 / 3.6.0 | Combined in `cn()` at `src/lib/utils.ts` |
| **Animations** | Framer Motion | ^12.42.2 | Used in Navbar dropdown, mobile nav, PlatformStats, NotificationsDropdown |
| **Slider** | Swiper | ^14.0.5 | Hero slider (EffectFade), Testimonials carousel |
| **Icons** | lucide-react | ^1.24.0 | Sole icon library — used everywhere |
| **Charts** | Recharts | ^3.9.2 | Admin dashboard only (PieChart, BarChart) |
| **Data Fetching** | TanStack React Query | ^5.101.2 | All server state; keys centralized in `src/lib/queryKeys.ts` |
| **HTTP** | Axios | ^1.18.1 | Instance at `src/lib/api.ts`, base URL via `NEXT_PUBLIC_API_URL` |
| **Forms** | React Hook Form + Zod | 7.81.0 / 4.4.3 | Login, Register pages; `@hookform/resolvers` bridge |
| **State Mgmt** | Zustand | ^5.0.14 | `authStore.ts` (user session), `creditStore.ts` (credits) |
| **Toast** | react-hot-toast | ^2.6.0 | `<Toaster>` in `Providers.tsx`, themed to design system |
| **Auth (Social)** | `@react-oauth/google` | ^0.13.5 | Google OAuth; Facebook is commented out |
| **Dates** | date-fns | ^4.4.0 | `formatDistanceToNow` in notifications |
| **Font** | Inter | Google Fonts | Loaded via `next/font/google`, var `--font-inter` |
| **UI Kit** | None (custom) | — | No shadcn, MUI, Radix, or Headless UI used in components |

### Component Structure Conventions
- **Atomic components**: `src/components/ui/` — only `Button.tsx`, `Input.tsx` (no Card, Badge, Modal, Skeleton primitives)
- **Common layout**: `src/components/common/` — Navbar, Footer, DashboardSidebar, DashboardHeader, NotificationsDropdown
- **Feature components**: `src/components/home/`, `campaigns/`, `dashboard/`, `auth/` — named with `Client` suffix for client components (e.g. `CampaignsClient.tsx`)
- **Export pattern**: Named exports for reusable components, default exports for page components
- **No barrel exports** (`index.ts`) exist — all imports are direct file paths

---

## 2. Pages & Routes

### Public Routes — `(public)` layout group
| Route | File | Description |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | Landing page — assembles 8 home sections |
| `/campaigns` | `src/app/(public)/campaigns/page.tsx` | Campaign listing with search, filters, pagination |
| `/campaigns/[id]` | `src/app/(public)/campaigns/[id]/page.tsx` | Campaign detail — hero, story, rewards, funding |
| `/about` | `src/app/(public)/about/page.tsx` | Static about page — mission, stats, cards |
| `/blog` | `src/app/(public)/blog/page.tsx` | Placeholder "Coming Soon" card |
| `/contact` | `src/app/(public)/contact/page.tsx` | Contact form + contact info |
| `/faq` | `src/app/(public)/faq/page.tsx` | 5-item accordion FAQ |

### Auth Routes — `(auth)` layout group (no navbar/footer)
| Route | File | Description |
|---|---|---|
| `/login` | `src/app/(auth)/login/page.tsx` | Email/password login + Google login + demo buttons |
| `/register` | `src/app/(auth)/register/page.tsx` | Registration form + Google login |

### Dashboard Routes — `(dashboard)` layout group (sidebar + header)
| Route | File | Description |
|---|---|---|
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Role-switched home: Supporter / Creator / Admin |
| `/dashboard/my-contributions` | `MyContributionsClient` | Table of supporter's contribution history |
| `/dashboard/purchase-credit` | `PurchaseCreditClient` | Credit purchase form |
| `/dashboard/payment-history` | `PaymentHistoryClient` | Transaction log table |
| `/dashboard/add-campaign` | `AddCampaignClient` | Campaign creation form (imgBB upload) |
| `/dashboard/my-campaigns` | `MyCampaignsClient` | Creator's campaign list (edit/delete) |
| `/dashboard/withdrawals` | `WithdrawalsClient` | Creator withdrawal requests + history |
| `/dashboard/manage-users` | `ManageUsersClient` | Admin: user list |
| `/dashboard/manage-campaigns` | `ManageCampaignsClient` | Admin: approve/reject campaigns |
| `/dashboard/withdrawal-requests` | `WithdrawalRequestsClient` | Admin: approve/reject withdrawal requests |
| `/dashboard/profile` | inline in `page.tsx` | Profile editor (avatar upload, name) |

### Other
| Route | File | Description |
|---|---|---|
| 404 | `src/app/not-found.tsx` | Custom 404 with ping icon, two CTAs |

---

## 3. Current Design System

### 3.1 Color Palette (from `globals.css` `:root`)

| Token | Hex | Usage |
|---|---|---|
| `--cf-primary` | `#6C47FF` | Violet — buttons, active states, links, focus rings, gradients |
| `--cf-secondary` | `#00D4AA` | Teal — funding amounts, success, progress bars, credit badges |
| `--cf-accent` | `#FF6B35` | Coral — CTAs, errors, status badges, "Sign out", warning icons |
| `--cf-bg` | `#0D0F1A` | Near-black — page backgrounds |
| `--cf-surface` | `#161827` | Card/panel surfaces, navbar bg, footer bg |
| `--cf-surface-2` | `#1E2130` | Elevated surfaces, hover states, icon backgrounds |
| `--cf-border` | `#2A2D40` | All borders: cards, inputs, dividers, sidebar |
| `--cf-text` | `#E8EAFF` | Primary text color |
| `--cf-text-muted` | `#8890B0` | Secondary/muted text, labels, placeholders |

### 3.2 Typography
- Font family: `Inter`
- Heading weight: `font-extrabold` (800) or `font-bold` (700)
- Body weight: `font-normal` (400) / `font-medium` (500)
- Scale: `text-xs` through `text-6xl`
- Leading: `leading-relaxed` for paragraphs

### 3.3 Button & Input Styles (`src/components/ui/`)
- Buttons: `rounded-lg` (8px), 5 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), loading state with `Loader2`, `asChild` pattern.
- Inputs: `rounded-lg`, `h-11`, `border border-[--cf-border] bg-[--cf-surface]`, focus ring with `--cf-primary`.

---

## 4. Component Inventory (Selected)

- **`Navbar` / `Footer` / `DashboardSidebar` / `DashboardHeader`**: Main layout shells.
- **`NotificationsDropdown`**: Polls every 30s, Framer Motion dropdown.
- **Home Components**: `HeroSlider`, `PlatformStats`, `HowItWorks`, `TopFundedCampaigns`, `ExploreByCategory`, `Testimonials`, `Newsletter`, `CallToAction`.
- **Campaign Components**: `CampaignCard` (widely reused), `CampaignCardSkeleton`, `CampaignsClient` (explore), `CampaignDetailsClient`, `ContributeModal`.
- **Dashboard Components**: `StatsCard` (reused in all 3 dashboards), plus role-specific tables and clients.
- **Auth Components**: `SocialLoginButtons`.

---

## 5. Layout Patterns

- **Root Layout**: `<html>` with `antialiased`, `<Providers>` wrapper. No suspense/streaming boundaries used.
- **Public Layout**: Sticky top nav (`max-w-7xl`), flex-grow main, 4-col footer.
- **Dashboard Layout**: Fixed left sidebar (`w-72`), sticky header (`h-16`), scrollable content area. Slide-in mobile menu.
- **Auth Layout**: Bare pages, centered forms with gradient orbs.
- **Breakpoints**: Mobile (1-col) -> `sm:` (640px) -> `md:` (768px, 2-3 cols) -> `lg:` (1024px, 3 cols) -> `xl:` (1280px, 4 cols).

---

## 6. Known UI Inconsistencies

1. **Border Radius**: `CampaignCard` uses `rounded-xl`, but `StatsCard` and tables use `rounded-2xl`. Violates AGENTS.md rule ("same rounded-xl").
2. **Card Padding**: `CampaignCard` is `p-5`, `StatsCard` is `p-6`, about cards are `p-8`. Violates AGENTS.md rule.
3. **Shadows**: No unified convention (`shadow-sm`, `shadow-lg`, `shadow-xl`, `shadow-2xl` scattered randomly).
4. **CSS Var Syntax**: Mix of `bg-[var(--cf-surface)]` and `bg-[--cf-surface]`.
5. **Missing Primitives**: No `Card`, `Modal`, `Badge`, `Skeleton`, or `Table` reusable components.
6. **Loading States**: Mix of `Loader2`, pulse skeletons, plain pulse divs, and "Loading..." text.
7. **Semantic HTML**: `CampaignCard` wraps `<Link>` inside `<Button>` improperly.
8. **Color Bleeding**: Default Tailwind colors (`blue-400`, `emerald-500`) used in categories and status badges.
9. **Dark Theme Breaking**: Google login button uses `bg-white` and `text-gray-700`.
10. **Unstyled Elements**: `<select>` on register and campaigns pages use browser native styles.

---

## 7. Weak Points (Honest Assessment)

1. **Placeholder Pages**: `/blog` is a single card.
2. **Minimal FAQ**: 5 questions, simple toggle, no smooth height animation.
3. **Stock Imagery**: About page and Hero slider use Unsplash generic photos.
4. **Dense Tables**: Dashboard tables are basic `<table>` markup with no sorting/resizing or empty-state illustrations.
5. **Fake Data**: Testimonials use hardcoded text and DiceBear avatars.
6. **Simulated Forms**: Contact form and Newsletter use `setTimeout` + toast.
7. **No Password Change**: Profile page lacks this feature.
8. **Animations**: Almost zero page transition or scroll-triggered entrance animations (except PlatformStats).
9. **Accessibility**: Missing ARIA landmarks, `aria-label`s on buttons, and skip links.

---

## 8. Logic vs UI Boundary Notes

- **Pure Presentation (Safe)**: Home page sections (except TopFunded), static cards, `CampaignCard`, most of `CampaignDetailsClient` text sections.
- **Mixed / UI wrappers (Safe to restyle markup, preserve handlers)**: Dashboard tables and `*Client.tsx` files. The `useQuery`/`useMutation` hooks and `onClick` handler functions are critical logic.
- **Tightly Coupled (Careful)**:
  - `CampaignsClient` filters/search: Many `useState` and `useEffect` hooks.
  - `ContributeModal`: Complex auth gates, API calls, store invalidation.
  - `Login/Register` forms: Tied tightly to `react-hook-form` and `zodResolver`.
  - `Navbar` & `NotificationsDropdown`: Auth state logic and polling mechanisms.
