# CrowdFund — Master Task Checklist

**Project:** CrowdFund Crowdfunding Platform  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Express 5 · MongoDB · JWT  
**Server:** All backend code in `Server/index.ts` (single file)

---

## Phase 0: Project Setup & Config

### Server (`Server/index.ts`)
- [ ] Install: `npm install mongoose jsonwebtoken bcrypt`
- [ ] Install dev types: `npm install -D @types/jsonwebtoken @types/bcrypt`
- [ ] Add all 15 section comment blocks to `index.ts`
- [ ] `dotenv.config()` at the very top
- [ ] Mongoose connect with `process.env.MONGODB_URI!`
- [ ] Startup validation — `console.error` + `process.exit(1)` if no `MONGODB_URI` or `JWT_SECRET`
- [ ] `.gitignore` — confirm `.env` is listed

### Client
- [ ] Install: `npm install axios @tanstack/react-query zustand react-hook-form zod @hookform/resolvers framer-motion swiper recharts`
- [ ] `src/lib/api.ts` — Axios instance with `NEXT_PUBLIC_API_URL` + JWT interceptor
- [ ] `src/lib/constants.ts` — matching credit constants
- [ ] `src/lib/queryKeys.ts` — centralized query key factory
- [ ] `src/lib/utils.ts` — `cn()`, `formatCurrency()`, `formatDate()`
- [ ] `src/store/authStore.ts` — Zustand auth store + re-hydration logic
- [ ] `src/store/creditStore.ts` — live credit balance
- [ ] `globals.css` — all `--cf-*` CSS custom properties
- [ ] `app/layout.tsx` — root layout with Inter font + `QueryClientProvider` + `Toaster`
- [ ] `src/middleware.ts` — protect `/dashboard/*` routes
- [ ] `.env.local` — add `NEXT_PUBLIC_API_URL`, Google, imgBB keys
- [ ] `.gitignore` — confirm `.env.local` is listed

---

## Phase 1: Server — Models & Constants (Section 2–5 of `index.ts`)

- [ ] Section 2: Constants block (`CREDIT_PURCHASE_RATE`, etc.)
- [ ] Section 3: Mongoose connect
- [ ] Section 4: TypeScript interfaces (`IUser`, `ICampaign`, `IContribution`, `IWithdrawal`, `ICreditPurchase`)
- [ ] Section 5: Mongoose schemas + models
  - [ ] `UserModel` — email unique index
  - [ ] `CampaignModel` — text index, compound indexes
  - [ ] `ContributionModel` — indexed by campaign + status
  - [ ] `WithdrawalModel` — indexed by creator + status
  - [ ] `CreditPurchaseModel`
- [ ] Global Express type augmentation (`req.user`)

---

## Phase 2: Server — Auth (Section 6–8 of `index.ts`)

- [ ] Section 6: `app = express()`, cors, json middleware
- [ ] Section 7: `verifyToken()` middleware inline
- [ ] Section 7: `roleGuard(...roles)` factory inline
- [ ] `POST /api/auth/register` — hash password, assign credits, sign JWT
- [ ] `POST /api/auth/login` — compare password, sign JWT
- [ ] `GET /api/auth/me` — verifyToken → return user (no password)
- [ ] Duplicate email → 409 response
- [ ] Strip `password` and `__v` from all user responses
- [ ] Default credits: 50 (supporter), 20 (creator) — only on registration

---

## Phase 3: Server — Campaign Routes (Section 9)

- [ ] `GET /api/campaigns` — paginated, text search, category filter, status filter, sort
- [ ] `GET /api/campaigns/top` — top 6 by `raised_amount` (status: active)
- [ ] `GET /api/campaigns/mine` — Creator's own campaigns (verifyToken + roleGuard('creator'))
- [ ] `GET /api/campaigns/:id` — single campaign (public)
- [ ] `POST /api/campaigns` — Creator only, Zod/manual validation, status: "pending"
- [ ] `PATCH /api/campaigns/:id` — Creator only (title, story, reward_info)
- [ ] `DELETE /api/campaigns/:id` — Creator only + bulk refund logic (see ARCHITECTURE.md)
- [ ] `PATCH /api/campaigns/:id/status` — Admin only (approve → active, reject → rejected)

---

## Phase 4: Server — Contribution Routes (Section 10)

- [ ] `POST /api/contributions` — Supporter only, atomic credit deduct
- [ ] `GET /api/contributions/mine` — Supporter's contributions
- [ ] `GET /api/contributions/pending` — Creator: pending on own campaigns
- [ ] `PATCH /api/contributions/:id/approve` — Creator: atomic approve + add to raised_amount
- [ ] `PATCH /api/contributions/:id/reject` — Creator: atomic reject + refund supporter

---

## Phase 5: Server — Withdrawal, Credits, Users (Sections 11–13)

- [ ] `POST /api/withdrawals` — Creator, min 200 credits guard, status: "pending"
- [ ] `GET /api/withdrawals/mine` — Creator's own withdrawal history
- [ ] `GET /api/withdrawals` — Admin: all withdrawal requests
- [ ] `PATCH /api/withdrawals/:id/approve` — Admin
- [ ] `PATCH /api/withdrawals/:id/reject` — Admin
- [ ] `POST /api/credits/purchase` — Supporter, save CreditPurchase, add credits
- [ ] `GET /api/credits/history` — Supporter's purchase history
- [ ] `GET /api/users` — Admin: all users
- [ ] `PATCH /api/users/:id/role` — Admin: change role
- [ ] `PATCH /api/users/:id/status` — Admin: activate/deactivate
- [ ] Section 14: Global error handler (`app.use` with 4 args)
- [ ] Section 15: `app.listen(PORT, ...)`

---

## Phase 6: Client — Public Layout & Home Page

### Navbar
- [ ] Logo + site name → `href="/"`
- [ ] Logged-out: Explore, Login, Register, Join as Developer
- [ ] Logged-in: Explore, Dashboard, Credits badge, Avatar dropdown, Join as Developer
- [ ] Sticky, full-width, responsive hamburger menu

### Footer
- [ ] Logo + tagline, navigation links, social icons, copyright

### Home Page Sections (all animated)
- [ ] **Section 1: Hero Slider** — Swiper, 3 slides, 60–70vh, auto-play
- [ ] **Section 2: Top Funded Campaigns** — top 6 live from API
- [ ] **Section 3: Testimonials** — Swiper slider, 5+ static
- [ ] **Section 4: How It Works** — 3-step visual
- [ ] **Section 5: Explore by Category** — category grid with icons
- [ ] **Section 6: Platform Stats** — animated counters on scroll
- [ ] **Section 7: Newsletter** — email input + success toast
- [ ] **Section 8: Call to Action** — gradient banner

---

## Phase 7: Client — Campaigns (Explore + Details)

- [ ] `/campaigns` — search, 2+ filters, sort, pagination (12/page), skeletons
- [ ] `CampaignCard` — image, title, description clamp, progress bar, meta, button
- [ ] Desktop 4 cols, tablet 2, mobile 1
- [ ] `/campaigns/[id]` — hero image, funding bar, creator info, contribute modal, story, rewards, related

---

## Phase 8: Client — Auth Pages

- [ ] `/register` — all fields + role dropdown + validation + Google OAuth
- [ ] `/login` — email/password + Google button + Demo login button
- [ ] JWT → `localStorage` as `cf_token`
- [ ] Zustand populated on login
- [ ] Session re-hydration on mount (GET /api/auth/me)

---

## Phase 9: Client — Dashboard Layout

- [ ] `(dashboard)/layout.tsx` — sidebar + header
- [ ] `DashboardSidebar.tsx` — role-based nav, active state highlight
- [ ] `DashboardHeader.tsx` — credits badge, avatar, notifications bell
- [ ] Sidebar: full desktop → icon-only tablet → drawer mobile

---

## Phase 10: Client — Supporter Dashboard

- [ ] `/dashboard` (Supporter) — welcome + 3 stats + recent contributions
- [ ] `/dashboard/explore` — reuse CampaignGrid
- [ ] `/dashboard/my-contributions` — table with status badges
- [ ] `/dashboard/purchase-credit` — calculator + payment
- [ ] `/dashboard/payment-history` — purchase history table

---

## Phase 11: Client — Creator Dashboard

- [ ] `/dashboard` (Creator) — 3 stat cards + contributions-to-review table
- [ ] `/dashboard/add-campaign` — full form + imgBB upload
- [ ] `/dashboard/my-campaigns` — table desc by deadline + update/delete
- [ ] `/dashboard/withdrawals` — credit summary + withdrawal form + guard
- [ ] `/dashboard/payment-history` — withdrawal history table

---

## Phase 12: Client — Admin Dashboard

- [ ] `/dashboard` (Admin) — platform stats + quick actions
- [ ] `/dashboard/manage-users` — table + role change + status toggle
- [ ] `/dashboard/manage-campaigns` — Pending tab + All Campaigns tab
- [ ] `/dashboard/withdrawal-requests` — approve/reject table

---

## Phase 13: Additional Pages

- [ ] `/about` — platform story, mission
- [ ] `/contact` — form + email + social
- [ ] `/blog` — 3+ static article cards
- [ ] `/faq` — accordion

---

## Phase 14: Polish & Quality

- [ ] `<title>` and `<meta description>` on every page
- [ ] All images via `next/image` with `alt` text
- [ ] No `console.log` anywhere (only `console.error` in catch)
- [ ] ESLint 0 warnings (`npm run lint`)
- [ ] TypeScript 0 errors (`npm run build`)
- [ ] No lorem ipsum or placeholder content
- [ ] All buttons and links functional
- [ ] Mobile (375px) ✅ Tablet (768px) ✅ Desktop (1280px) ✅
- [ ] Keyboard navigation on all modals and forms
- [ ] Loading skeletons on all async data
- [ ] Empty states on all list pages
- [ ] Toast notifications for all user actions

---

## Phase 15: Deployment & Submission

- [ ] Deploy frontend to **Vercel**
- [ ] Deploy backend to **Railway** or **Render**
- [ ] Set production env vars in deployment dashboards
- [ ] Test all features on live URL
- [ ] Update `README.md` with live URL
- [ ] Verify 20+ client commits, 12+ server commits
- [ ] Confirm admin credentials in `README.md`
- [ ] Confirm README has 10+ feature bullet points
- [ ] Meaningful `README.md` on server repo too

---

## Commit Count Tracker

| Repo   | Target | Current |
|--------|--------|---------|
| Client | 20+    | 0       |
| Server | 12+    | 0       |

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Client coding standards and design system |
| [Server/AGENTS.md](../Server/AGENTS.md) | Server rules — index.ts section layout, middleware patterns |
| [PRD.md](./PRD.md) | Full feature specs and acceptance criteria |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Data flows, credit transactions, DB indexes |
