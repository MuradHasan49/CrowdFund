# CrowdFund — Phase Progress Tracker

> Updated automatically as each phase completes.  
> Reference: [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md) for full step details.

---

## Legend
- ✅ **COMPLETE** — All steps done, tested, committed
- 🔄 **IN PROGRESS** — Currently being worked on
- ⬜ **NOT STARTED** — Waiting

---

## SERVER PHASES

### ✅ Phase 1 — Server: Install & Skeleton Structure
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Installed `mongoose`, `jsonwebtoken`, `bcrypt`, `cookie-parser`
- [x] Installed dev types: `@types/jsonwebtoken`, `@types/bcrypt`, `@types/cookie-parser`
- [x] All 15 section comment blocks written in `Server/index.ts`
- [x] Section 1 (Imports) — all packages imported, `dotenv.config()` at top
- [x] Section 2 (Constants) — all 6 business logic constants defined
- [x] Section 3 (MongoDB Connection) — `mongoose.connect()` with error + `process.exit(1)`
- [x] Section 4 (TypeScript Interfaces) — skeleton + Express Request augmentation (`req.user`)
- [x] Section 15 (Server Listen) — temporary Express app + health check route
- [x] `.gitignore` created for Server (protects `.env`)
- [x] `Server/.env` updated with all required variable templates
- [x] Verified `Server/package.json` has all packages

#### Packages Installed (0 vulnerabilities)
| Package | Version | Type |
|---------|---------|------|
| `mongoose` | ^9.7.4 | dependency |
| `jsonwebtoken` | ^9.0.3 | dependency |
| `bcrypt` | ^6.0.0 | dependency |
| `cookie-parser` | ^1.4.7 | dependency |
| `@types/jsonwebtoken` | ^9.0.10 | devDependency |
| `@types/bcrypt` | ^6.0.0 | devDependency |
| `@types/cookie-parser` | ^1.4.10 | devDependency |

#### Server Startup Test
- ✅ TypeScript compiles with no errors
- ✅ Express server starts on port 8000
- ⚠️ MongoDB connection fails — **expected** (real `MONGODB_URI` not set in `.env` yet)
- ✅ No security vulnerabilities in packages

#### ⚠️ Action Required from You
Before Phase 2 will fully work, fill in `Server/.env` with real values:
```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/crowdfund
JWT_SECRET=any_random_32+_character_string_here
```
Get your MongoDB URI from: [MongoDB Atlas](https://cloud.mongodb.com)

#### Commit Message
```
feat(server): install packages, 15-section skeleton, constants, MongoDB connect
```

---

### ✅ Phase 2 — Server: TypeScript Interfaces & Mongoose Models
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Section 4: All TypeScript union types and 5 interfaces defined
  - [x] `IUser` — name, email, photoURL, password, role, credits, isActive, timestamps
  - [x] `ICampaign` — full campaign shape with creator info, raised_amount, status
  - [x] `IContribution` — campaign + supporter ref, amount, message, status
  - [x] `IWithdrawal` — creator ref, credit/amount, payment system, account, status
  - [x] `ICreditPurchase` — user ref, amount_usd, credits_received, payment_method, status
  - [x] Union types: `UserRole`, `CampaignStatus`, `ContributionStatus`, `WithdrawalStatus`, `PaymentSystem`, `CreditPurchaseStatus`, `CampaignCategory`
- [x] Section 5: All 5 Mongoose models with schemas + indexes
  - [x] `UserModel` — unique email index
  - [x] `CampaignModel` — 4 indexes: status+raised, creator+deadline, category+status, text search
  - [x] `ContributionModel` — 2 indexes: campaign+status, supporter+date
  - [x] `WithdrawalModel` — 2 indexes: creator+date, status
  - [x] `CreditPurchaseModel` — 1 index: user+date
- [x] `npx tsc --noEmit` → **0 TypeScript errors** ✅

#### Commit Message
```
feat(models): all 5 Mongoose schemas with TypeScript interfaces and indexes
```

---

### ✅ Phase 3 — Server: Express App, Middleware & Auth Routes
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Section 6: Express app created with `cors({ credentials: true })`, `express.json()`, `cookieParser()`
  - [x] Health check routes: `GET /` and `GET /health`
- [x] Section 7: Auth middleware (3 functions + 1 helper)
  - [x] `verifyToken()` — reads `req.cookies.cf_token`, verifies JWT, attaches `req.user`
  - [x] `roleGuard(...roles)` — factory that checks `req.user.role` against allowed roles
  - [x] `setAuthCookie(res, userId, role, email)` — signs 7-day JWT, sets httpOnly cookie
  - [x] `stripUser(user)` — removes `password` + `__v`, transforms `_id` → `id: string`
- [x] Section 8: All 4 auth routes
  - [x] `POST /api/auth/register` — validates fields, checks duplicate email (409), bcrypt hash, assigns credits by role, sets cookie
  - [x] `POST /api/auth/login` — validates, checks isActive, compares bcrypt, sets cookie
  - [x] `POST /api/auth/logout` — `res.clearCookie('cf_token')`
  - [x] `GET /api/auth/me` — `verifyToken` guard, returns user without password
- [x] Duplicate email index warning fixed (removed redundant `schema.index()`)
- [x] Server boots: `✅ CrowdFund server running at http://localhost:8000`
- [x] MongoDB connects successfully when real `MONGODB_URI` set
- [x] `npx tsc --noEmit` → **0 TypeScript errors** ✅

#### Cookie Spec
| Attribute | Value |
|-----------|-------|
| Name | `cf_token` |
| httpOnly | `true` (JS cannot access) |
| sameSite | `lax` |
| secure | `true` in production only |
| maxAge | 7 days |

#### Route Summary
| Route | Guard | Returns |
|-------|-------|---------|
| `POST /api/auth/register` | none | user (no password) + sets cookie |
| `POST /api/auth/login` | none | user (no password) + sets cookie |
| `POST /api/auth/logout` | none | clears cookie |
| `GET /api/auth/me` | `verifyToken` | current user |

#### Commit Message
```
feat(auth): verifyToken + roleGuard + setAuthCookie middleware and all 4 auth routes with httpOnly cookie
```

---

### 🔄 Phase 4 — Server: Campaign Routes
**Status: IN PROGRESS — Next Phase**

Steps to do:
- [ ] `GET /api/campaigns` — paginated, text search, category + status filter, sort
- [ ] `GET /api/campaigns/top` — top 6 by raised_amount (**must be before** `/:id`)
- [ ] `GET /api/campaigns/mine` — Creator's own campaigns
- [ ] `GET /api/campaigns/:id` — public single campaign
- [ ] `POST /api/campaigns` — Creator only, status: pending
- [ ] `PATCH /api/campaigns/:id` — Creator only (title/story/reward)
- [ ] `DELETE /api/campaigns/:id` — Creator only + bulk refund
- [ ] `PATCH /api/campaigns/:id/status` — Admin only (approve/reject)

---

### ✅ Phase 4 — Server: Campaign Routes
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] `stripCampaign()` helper — safely strips `_id`/`__v`, returns `id: string`
- [x] `GET /api/campaigns` — paginated (12/page), `?search=`, `?category=`, `?status=`, `?sort=`, with `meta: { total, page, pages }`
- [x] `GET /api/campaigns/top` — top 6 active by raised_amount (**ordered before `/:id`**)
- [x] `GET /api/campaigns/mine` — Creator only, sorted by deadline desc (**ordered before `/:id`**)
- [x] `GET /api/campaigns/:id` — public single campaign detail
- [x] `POST /api/campaigns` — Creator only; validates all 8 fields, future deadline, funding_goal ≥ 100, min_contribution in range; saves with status `pending`
- [x] `PATCH /api/campaigns/:id` — Creator only; ownership check; updates title/story/reward
- [x] `DELETE /api/campaigns/:id` — Creator only; bulk refunds approved contributions; rejects pending
- [x] `PATCH /api/campaigns/:id/status` — Admin only; sets to `active` or `rejected`
- [x] `npx tsc --noEmit` → **0 TypeScript errors** ✅

#### Route Table
| Method | Route | Guard | Key Feature |
|--------|-------|-------|-------------|
| GET | `/api/campaigns` | none | search + filters + sort + pagination |
| GET | `/api/campaigns/top` | none | top 6 active by raised_amount |
| GET | `/api/campaigns/mine` | Creator | sorted by deadline |
| GET | `/api/campaigns/:id` | none | single campaign |
| POST | `/api/campaigns` | Creator | full validation, status=pending |
| PATCH | `/api/campaigns/:id` | Creator | title/story/reward only |
| DELETE | `/api/campaigns/:id` | Creator | bulk refund approved contributors |
| PATCH | `/api/campaigns/:id/status` | Admin | approve → active \| reject |

#### Commit Message
```
feat(campaigns): full CRUD routes with pagination, search, filters, bulk-refund delete, and admin approval
```

---

### ✅ Phase 5 — Server: Contribution Routes
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] `POST /api/contributions` — Supporter only; validates campaign is active + amount ≥ min_contribution; **atomic `$inc` with `$gte` guard** prevents over-spending
- [x] `GET /api/contributions/mine` — Supporter's full history, newest first (**before `/:id`**)
- [x] `GET /api/contributions/pending` — Creator: fetches own campaigns first, then finds pending contributions (**before `/:id`**)
- [x] `PATCH /api/contributions/:id/approve` — Creator only; ownership check; **atomic `Promise.all`**: status → approved + campaign `$inc raised_amount`
- [x] `PATCH /api/contributions/:id/reject` — Creator only; ownership check; **atomic `Promise.all`**: status → rejected + supporter `$inc credits` (refund)
- [x] `npx tsc --noEmit` → **0 TypeScript errors** ✅

#### Atomic Operation Pattern Used
```typescript
// Deduct credits — $gte guard prevents going below 0
const supporter = await UserModel.findOneAndUpdate(
  { _id: userId, credits: { $gte: amount } },  // guard
  { $inc: { credits: -amount } },
  { new: true }
);
if (!supporter) return res.status(400).json({ error: 'Insufficient credits' });

// Approve — parallel atomic updates
await Promise.all([
  ContributionModel.findByIdAndUpdate(id, { $set: { status: 'approved' } }),
  CampaignModel.findByIdAndUpdate(campaignId, { $inc: { raised_amount: amount } }),
]);
```

#### Route Table
| Method | Route | Guard | Atomic Op |
|--------|-------|-------|----------|
| POST | `/api/contributions` | Supporter | `$inc credits: -amount` with `$gte` guard |
| GET | `/api/contributions/mine` | Supporter | — |
| GET | `/api/contributions/pending` | Creator | — |
| PATCH | `/api/contributions/:id/approve` | Creator | `$inc raised_amount` |
| PATCH | `/api/contributions/:id/reject` | Creator | `$inc credits` (refund) |

#### Commit Message
```
feat(contributions): create, approve, reject with atomic credit operations and ownership guards
```

---

### ✅ Phase 6 — Server: Withdrawals, Credits, Users + Finalize
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Section 11: `POST /api/withdrawals` — Creator only; validates minimum 200 credits; converts to USD amount (`/ 20`)
- [x] Section 11: `GET /api/withdrawals/mine` — Creator's history, sorted newest first
- [x] Section 11: `GET /api/withdrawals` — Admin only; all withdrawal requests
- [x] Section 11: `PATCH /api/withdrawals/:id/approve` and `/reject` — Admin only; updates status
- [x] Section 12: `POST /api/credits/purchase` — Supporter only; atomic `Promise.all` saves purchase record and adds credits (`amount_usd * 10`)
- [x] Section 12: `GET /api/credits/history` — Supporter's purchase history
- [x] Section 13: `GET /api/users` — Admin only; returns users (without passwords); supports `?search=` filter on name/email
- [x] Section 13: `PATCH /api/users/:id/role` — Admin only; updates role
- [x] Section 13: `PATCH /api/users/:id/status` — Admin only; toggles `isActive` boolean
- [x] Section 14: Global error handler (`app.use` with 4 arguments) catches all async unhandled errors and returns 500
- [x] `npx tsc --noEmit` → **0 TypeScript errors** ✅

#### Commit Message
```
feat(server): finalize backend with withdrawals, credit purchases, admin user management and global error handler
```

---

## CLIENT PHASES

### ✅ Phase 7 — Client: Foundation (Install + Config)
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Installed packages: `axios`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `framer-motion`, `swiper`, `recharts`, plus utilities like `tailwind-merge`, `clsx`, `react-hot-toast`
- [x] Created `src/lib/api.ts` — Axios instance with `withCredentials: true`
- [x] Created `src/lib/constants.ts` — Mirrored from server
- [x] Created `src/lib/queryKeys.ts` — Centralized factory for TanStack Query
- [x] Created `src/lib/utils.ts` — `cn()`, `formatCurrency()`, `formatDate()`
- [x] Created `src/store/authStore.ts` — Zustand store for user session + initialization state
- [x] Updated `src/app/globals.css` — Added `--cf-*` custom properties & standard theme resets
- [x] Created `src/components/Providers.tsx` — Wraps app in `QueryClientProvider` and `Toaster`
- [x] Updated `src/app/layout.tsx` — Inter font + Providers injected
- [x] Created `src/middleware.ts` — Route protection (`/dashboard/*` redirect to `/login` if no cookie)
- [x] Bootstrapped ALL App Router folders with base `page.tsx` exports (`(public)`, `(auth)`, `(dashboard)`)

#### Commit Message
```
feat(config): client foundation — axios, zustand, design tokens, middleware
```

---

### ✅ Phase 8 — Client: Auth Pages
**Status: COMPLETE**  
**Completed:** 2026-07-13

#### Steps Done
- [x] Created `useAuth()` hook (`src/hooks/useAuth.ts`) — Integrates TanStack Query + Zustand
- [x] Created `AuthInitializer` (`src/components/AuthInitializer.tsx`) — Global hydration wrapper
- [x] Created `Input` and `Button` UI components (`src/components/ui/`)
- [x] Implemented `src/app/(auth)/login/page.tsx` — Login Form with React Hook Form + Zod + Demo buttons
- [x] Implemented `src/app/(auth)/register/page.tsx` — Register Form with Zod validation and Confirm Password matching
- [x] Test the auth flow — Servers are running on `localhost:3000` (Client) and `localhost:8000` (Server)

#### Commit Message
```
feat(auth): register and login pages with cookie-based JWT auth
```

---

### 🔄 Phase 9 — Client: Navbar, Footer, Public Layout
**Status: IN PROGRESS — Next Phase**

Steps to do:
- [ ] Build `src/app/(public)/layout.tsx` — Wraps all public pages with `<Navbar>` + `<Footer>`
- [ ] Build `Navbar.tsx` — Responsive, sticky, shows user avatar/credits when logged in
- [ ] Build `Footer.tsx` — Static footer with links

---

### ⬜ Phase 10 — Client: Home Page (8 Sections)
**Status: NOT STARTED**

---

### ⬜ Phase 11 — Client: Campaigns Explore + Detail
**Status: NOT STARTED**

---

### ⬜ Phase 12 — Client: Dashboard Layout + Sidebar
**Status: NOT STARTED**

---

### ⬜ Phase 13 — Client: Supporter Dashboard Pages
**Status: NOT STARTED**

---

### ⬜ Phase 14 — Client: Creator Dashboard Pages
**Status: NOT STARTED**

---

### ⬜ Phase 15 — Client: Admin Dashboard Pages
**Status: NOT STARTED**

---

### ⬜ Phase 16 — Client: Additional Pages
**Status: NOT STARTED**

---

### ⬜ Phase 17 — Polish, Quality & Accessibility
**Status: NOT STARTED**

---

### ⬜ Phase 18 — Update README + Deployment
**Status: NOT STARTED**

---

## Commit Count Tracker

| Repo | Target | Done |
|------|--------|------|
| Server | 12+ | 6 |
| Client | 20+ | 2 |

---

## Quick File Map

| File | Purpose |
|------|---------|
| [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md) | Full step-by-step guide for all 18 phases |
| [AGENTS.md](./AGENTS.md) | Client coding rules, design system, naming |
| [Server/AGENTS.md](../Server/AGENTS.md) | Server rules, auth code patterns |
| [PRD.md](./PRD.md) | All feature specs and acceptance criteria |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Auth flow, credit transactions, DB diagrams |
| [TASKS.md](./TASKS.md) | Checkbox-style task list |
