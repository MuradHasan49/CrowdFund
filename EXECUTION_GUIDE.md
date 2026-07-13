# CrowdFund — Complete Execution Guide
**Read every MD file and compiled into this single step-by-step guide.**

> Follow phases in order. Never skip ahead. Commit after every phase.

---

## 🔧 Pre-Start: Environment & Secrets

Before writing a single line of code, do this:

### Server `.env`
Create `d:/SCIC13/Server/.env`:
```
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/crowdfund
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Client `.env.local`
Create `d:/SCIC13/client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

### Verify `.gitignore`
Both repos must ignore their env files before the first commit.

---

## ═══════════════════════════════════════════
## SERVER PHASES  (Complete ALL server phases before touching client)
## ═══════════════════════════════════════════

---

## Phase 1 — Server: Install & Skeleton Structure
**Location:** `d:/SCIC13/Server/`

### Step 1 — Install all packages
```bash
npm install mongoose jsonwebtoken bcrypt cookie-parser
npm install -D @types/jsonwebtoken @types/bcrypt @types/cookie-parser
```

### Step 2 — Rewrite `index.ts` with all 15 section skeletons
Open `Server/index.ts` and structure it exactly like this (empty sections, just comment headers):
```
// 1. IMPORTS & ENV
// 2. CONSTANTS
// 3. MONGOOSE CONNECTION
// 4. TYPESCRIPT INTERFACES
// 5. MONGOOSE MODELS
// 6. EXPRESS APP & MIDDLEWARE
// 7. AUTH MIDDLEWARE (verifyToken, roleGuard, setAuthCookie)
// 8. AUTH ROUTES
// 9. CAMPAIGN ROUTES
// 10. CONTRIBUTION ROUTES
// 11. WITHDRAWAL ROUTES
// 12. CREDIT PURCHASE ROUTES
// 13. USER MANAGEMENT ROUTES
// 14. GLOBAL ERROR HANDLER
// 15. SERVER LISTEN
```

### Step 3 — Fill Section 1: Imports
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { Schema, Document, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

dotenv.config(); // MUST be first line after imports
```

### Step 4 — Fill Section 2: Constants
```typescript
const CREDIT_PURCHASE_RATE    = 10;
const CREDIT_WITHDRAWAL_RATE  = 20;
const MIN_WITHDRAWAL_CREDITS  = 200;
const SUPPORTER_SIGNUP_CREDITS = 50;
const CREATOR_SIGNUP_CREDITS   = 20;
const BCRYPT_SALT_ROUNDS       = 12;
const PORT = process.env.PORT || 8000;
```

### Step 5 — Fill Section 3: MongoDB Connection
```typescript
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.error('✅ MongoDB connected'))
  .catch((err) => { console.error('❌ MongoDB error:', err); process.exit(1); });
```

> ✅ **Test:** Run `npm run dev` — should see "MongoDB connected" with no errors.

**📝 Commit:** `feat(server): initial Express 5 setup with dotenv, CORS, and section skeleton`

---

## Phase 2 — Server: TypeScript Interfaces & Mongoose Models

### Step 1 — Fill Section 4: Interfaces
Define all 5 interfaces (copy from `PRD.md → Data Models`):
- `IUser` — name, email, photoURL, password, role, credits, isActive
- `ICampaign` — title, story, category, funding_goal, minimum_contribution, deadline, reward_info, image_url, creator info, raised_amount, status
- `IContribution` — campaign_id, campaign_title, supporter info, amount, message, status
- `IWithdrawal` — creator info, withdrawal_credit, withdrawal_amount, payment_system, account_number, status
- `ICreditPurchase` — user info, amount_usd, credits_received, payment_method, status

Also add Express Request augmentation:
```typescript
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'supporter' | 'creator' | 'admin'; email: string };
    }
  }
}
```

### Step 2 — Fill Section 5: Mongoose Schemas + Models
Create all 5 models. Key indexes to add:
```typescript
// UserModel
userSchema.index({ email: 1 }, { unique: true });

// CampaignModel
campaignSchema.index({ status: 1, raised_amount: -1 });
campaignSchema.index({ title: 'text', campaign_story: 'text' });

// ContributionModel
contributionSchema.index({ campaign_id: 1, status: 1 });
contributionSchema.index({ supporter_id: 1 });

// WithdrawalModel
withdrawalSchema.index({ creator_id: 1 });
withdrawalSchema.index({ status: 1 });
```

**📝 Commit:** `feat(models): all Mongoose schemas and models defined in index.ts`

---

## Phase 3 — Server: Express App, Middleware & Auth Routes

### Step 1 — Fill Section 6: App Setup
```typescript
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
```

### Step 2 — Fill Section 7: verifyToken + roleGuard + setAuthCookie
Three inline functions (see `Server/AGENTS.md → Section 8` for exact code):
- `verifyToken` — reads `req.cookies.cf_token`, verifies JWT, attaches `req.user`
- `roleGuard(...roles)` — factory that checks `req.user.role`
- `setAuthCookie(res, userId, role, email)` — signs JWT, sets httpOnly cookie

### Step 3 — Fill Section 8: Auth Routes
Write 4 routes:

| Route | Guard | Action |
|-------|-------|--------|
| `POST /api/auth/register` | none | hash password → save user with credits → `setAuthCookie` → return user (no password) |
| `POST /api/auth/login` | none | find user → compare password → `setAuthCookie` → return user |
| `POST /api/auth/logout` | none | `res.clearCookie('cf_token')` → `{ success: true }` |
| `GET /api/auth/me` | `verifyToken` | find user by `req.user.id` → return user (no password) |

**Critical rules:**
- Duplicate email → `res.status(409)`
- Never return `password` or `__v` — strip them manually
- Credits: `role === 'supporter' ? 50 : 20` — set ONCE on register only

> ✅ **Test in Postman/Thunder Client:**
> 1. POST `/api/auth/register` → check `Set-Cookie` header has `cf_token`
> 2. GET `/api/auth/me` → should return user data (cookie auto-sent)
> 3. POST `/api/auth/logout` → cookie cleared
> 4. GET `/api/auth/me` → 401 error

**📝 Commit:** `feat(auth): register, login, logout with httpOnly cookie + verifyToken middleware`

---

## Phase 4 — Server: Campaign Routes

### Fill Section 9 — 8 campaign routes:

| Route | Guard | Notes |
|-------|-------|-------|
| `GET /api/campaigns` | none | Support `?search=`, `?category=`, `?status=`, `?sort=`, `?page=`, `?limit=12` |
| `GET /api/campaigns/top` | none | `find({ status: 'active' }).sort({ raised_amount: -1 }).limit(6)` — **must come before `/:id`** |
| `GET /api/campaigns/mine` | `verifyToken + roleGuard('creator')` | Filter by `creator_id: req.user.id` |
| `GET /api/campaigns/:id` | none | Public |
| `POST /api/campaigns` | `verifyToken + roleGuard('creator')` | Validate all fields, save with `status: 'pending'` |
| `PATCH /api/campaigns/:id` | `verifyToken + roleGuard('creator')` | Only allow updating title, story, reward_info |
| `DELETE /api/campaigns/:id` | `verifyToken + roleGuard('creator')` | Bulk refund + delete (see ARCHITECTURE.md) |
| `PATCH /api/campaigns/:id/status` | `verifyToken + roleGuard('admin')` | Body: `{ status: 'active' \| 'rejected' }` |

> ⚠️ **Order matters!** `/api/campaigns/top` and `/api/campaigns/mine` MUST be defined **before** `/api/campaigns/:id` or Express will treat "top"/"mine" as `:id` values.

**📝 Commit:** `feat(campaigns): full CRUD routes with status workflow and admin approval`

---

## Phase 5 — Server: Contribution Routes

### Fill Section 10 — 5 contribution routes:

| Route | Guard | Key Logic |
|-------|-------|-----------|
| `POST /api/contributions` | `verifyToken + roleGuard('supporter')` | Atomic `$inc: { credits: -amount }` with `$gte` guard |
| `GET /api/contributions/mine` | `verifyToken + roleGuard('supporter')` | Filter by `supporter_id` |
| `GET /api/contributions/pending` | `verifyToken + roleGuard('creator')` | Join to creator's campaigns, filter `status: 'pending'` |
| `PATCH /api/contributions/:id/approve` | `verifyToken + roleGuard('creator')` | Atomic: status → approved + campaign `$inc raised_amount` |
| `PATCH /api/contributions/:id/reject` | `verifyToken + roleGuard('creator')` | Atomic: status → rejected + supporter `$inc credits` |

**📝 Commit:** `feat(contributions): create, approve, reject with atomic credit operations`

---

## Phase 6 — Server: Withdrawals, Credits, Users + Finalize

### Fill Section 11 — Withdrawal Routes (5 routes):
- `POST /api/withdrawals` — Creator; validate credits ≥ 200; save as pending
- `GET /api/withdrawals/mine` — Creator's history
- `GET /api/withdrawals` — Admin: all requests
- `PATCH /api/withdrawals/:id/approve` — Admin
- `PATCH /api/withdrawals/:id/reject` — Admin (refund raised pool)

### Fill Section 12 — Credit Purchase (2 routes):
- `POST /api/credits/purchase` — Supporter; `credits = amount_usd * 10`; save + `$inc user.credits`
- `GET /api/credits/history` — Supporter's purchases

### Fill Section 13 — User Management (3 Admin routes):
- `GET /api/users` — all users (with search)
- `PATCH /api/users/:id/role` — change role
- `PATCH /api/users/:id/status` — toggle isActive

### Fill Section 14 — Global Error Handler:
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Server error' });
});
```

### Fill Section 15 — Server Listen:
```typescript
app.listen(PORT, () => {
  console.error(`✅ Server running at http://localhost:${PORT}`);
});
```

**📝 Commit:** `feat(withdrawals): creator request + admin approval`
**📝 Commit:** `feat(credits): purchase endpoint with credit increment`
**📝 Commit:** `feat(users): admin user management routes`
**📝 Commit:** `feat(server): global error handler, health check, finalize`

> ✅ **Final server test:** All 25+ routes working in Postman with cookie auth.

---

## ═══════════════════════════════════════════
## CLIENT PHASES  (Only start after server is fully working)
## ═══════════════════════════════════════════

---

## Phase 7 — Client: Foundation (Install + Config Files)

### Step 1 — Install all packages
```bash
cd d:/SCIC13/client
npm install axios @tanstack/react-query zustand react-hook-form zod @hookform/resolvers framer-motion swiper recharts
```

### Step 2 — Create `src/lib/api.ts`
Axios instance with:
- `baseURL: process.env.NEXT_PUBLIC_API_URL`
- `withCredentials: true` ← **critical for cookies to work cross-origin**

### Step 3 — Create `src/lib/constants.ts`
Mirror all business logic constants from the server.

### Step 4 — Create `src/lib/queryKeys.ts`
Centralized factory for all TanStack Query keys.

### Step 5 — Create `src/lib/utils.ts`
- `cn()` — class merging utility (use `clsx` + `tailwind-merge`)
- `formatCurrency(amount)` — format credits to `$X.XX`
- `formatDate(date)` — readable date string

### Step 6 — Create `src/store/authStore.ts`
Zustand store with:
- `user`, `setUser`, `clearUser`
- On mount: call `GET /api/auth/me` (cookie sent automatically) → populate store

### Step 7 — Update `src/app/globals.css`
Add ALL `--cf-*` CSS custom properties:
```css
:root {
  --cf-primary: #6C47FF;
  --cf-secondary: #00D4AA;
  --cf-accent: #FF6B35;
  --cf-bg: #0D0F1A;
  --cf-surface: #161827;
  --cf-surface-2: #1E2130;
  --cf-border: #2A2D40;
  --cf-text: #E8EAFF;
  --cf-text-muted: #8890B0;
}
```

### Step 8 — Update `src/app/layout.tsx`
- Load `Inter` font via `next/font/google`
- Wrap with `QueryClientProvider` + `Toaster`
- Set `background-color: var(--cf-bg)` on body

### Step 9 — Create `src/middleware.ts`
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('cf_token')?.value;
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = { matcher: ['/dashboard/:path*'] };
```

### Step 10 — Create folder structure
Create all empty `page.tsx` files for all routes listed in `AGENTS.md → Section 3`.

**📝 Commit:** `feat(config): client foundation — axios, zustand, design tokens, middleware`

---

## Phase 8 — Client: Auth Pages + End-to-End Cookie Test

### Build `/register` page
Fields (see `PRD.md → Registration Page`):
- Name, Email, Photo URL, Password, Confirm Password, Role dropdown
- Validate with `react-hook-form + zod`
- Submit → `POST /api/auth/register` → on success, call `GET /api/auth/me` → populate Zustand → redirect `/dashboard`

### Build `/login` page
Fields: Email, Password
- Google OAuth button
- **Demo Login button** (auto-fill admin/supporter/creator credentials)
- Submit → `POST /api/auth/login` → populate Zustand → redirect `/dashboard`

### ✅ Critical End-to-End Test (do this before ANY other client work)
1. Register as Supporter → redirect to `/dashboard` ✅
2. Open DevTools → Application → Cookies → `cf_token` is there, `HttpOnly` flag set ✅
3. Refresh the page → still on `/dashboard`, not redirected to `/login` ✅
4. Logout → cookie gone ✅
5. Visit `/dashboard` manually → redirected to `/login` ✅

**If this test passes, your auth foundation is solid.**

**📝 Commit:** `feat(auth): register and login pages with cookie-based JWT auth`

---

## Phase 9 — Client: Navbar, Footer, Public Layout

### Build `src/app/(public)/layout.tsx`
Wraps all public pages with `<Navbar>` + `<Footer>`.

### Build `Navbar.tsx`
Two states based on Zustand `authStore.user`:
- **Logged out:** Logo, Explore, Login, Register, Join as Developer
- **Logged in:** Logo, Dashboard, Credits badge (from Zustand), Avatar dropdown, Join as Developer
- Sticky + full-width + hamburger on mobile (Framer Motion slide-in)

### Build `Footer.tsx`
Logo, tagline, nav links, social icons (LinkedIn, GitHub, Facebook), copyright.
All links must work.

**📝 Commit:** `feat(layout): Navbar with auth state, Credits badge, and Footer`

---

## Phase 10 — Client: Home Page (8 Sections)

Build each section as a separate component in `src/components/home/`:

| Component | Key Requirement |
|-----------|----------------|
| `HeroSlider.tsx` | Swiper, 3 slides, 60–70vh, auto-play 4s |
| `TopFundedCampaigns.tsx` | Fetch `GET /api/campaigns/top`, show top 6 |
| `Testimonials.tsx` | Swiper slider, 5+ static entries with photo/name/quote |
| `HowItWorks.tsx` | 3-step: Create → Fund → Withdraw |
| `ExploreByCategory.tsx` | Grid of category cards → links to `/campaigns?category=X` |
| `PlatformStats.tsx` | 4 animated counters (scroll-triggered, Framer Motion) |
| `Newsletter.tsx` | Email input + success toast |
| `CallToAction.tsx` | Gradient banner + 2 CTA buttons |

Assemble all 8 in `src/app/(public)/page.tsx`.

**📝 Commit:** `feat(home): hero slider, top campaigns, testimonials sections`
**📝 Commit:** `feat(home): how it works, category grid, platform stats, newsletter, CTA`

---

## Phase 11 — Client: Campaigns Explore + Detail Pages

### Build `CampaignCard.tsx` (used everywhere — build it once)
Required fields per `PRD.md`:
- Cover image (`next/image`, fixed height, `object-cover`)
- Title
- Short description (2-line clamp with `line-clamp-2`)
- Category badge
- Funding progress bar (`raised / goal` as percentage)
- Meta: deadline, min contribution, creator name
- "View Details" button

Rules: `rounded-xl`, `p-5`, `border border-[--cf-border]`, same height for all.

### Build `/campaigns` page (Explore)
- Search bar (debounced, queries `?search=`)
- Filter: Category dropdown
- Filter: Status (Active / All)
- Sort dropdown (Most Funded, Newest, Deadline Soon)
- 12 cards per page with pagination buttons
- Skeleton loader (pulse animation) while loading
- 4 cols desktop / 2 tablet / 1 mobile

### Build `/campaigns/[id]` page (Details)
Sections (see `PRD.md → Campaign Details Page`):
- Hero image, title, category badge
- Funding progress bar + raised/goal stats + days left
- Creator info card
- Contribute form (credit input + message + button)
- Campaign story
- Reward info
- Related campaigns (4 cards, same category)

**Contribute button logic:**
- Not logged in → button text "Login to Contribute" → redirect `/login`
- User is the creator → button disabled
- Insufficient credits → show error toast

**📝 Commit:** `feat(campaigns): CampaignCard component with progress bar and skeleton`
**📝 Commit:** `feat(campaigns): explore page with search, filters, sort, pagination`
**📝 Commit:** `feat(campaigns): campaign detail page with contribute modal`

---

## Phase 12 — Client: Dashboard Layout + Sidebar

### Build `src/app/(dashboard)/layout.tsx`
- Fetches user from Zustand (re-hydrated from `/api/auth/me`)
- Shows `<DashboardSidebar>` + `<DashboardHeader>` + `{children}`

### Build `DashboardSidebar.tsx`
Role-based navigation from `PRD.md`:

| Supporter | Creator | Admin |
|-----------|---------|-------|
| Home | Home | Home |
| Explore Campaigns | Add New Campaign | Manage Users |
| My Contributions | My Campaigns | Manage Campaigns |
| Purchase Credit | Withdrawals | Withdrawal Requests |
| Payment History | Payment History | Reports |

Responsive: full sidebar on desktop, icon-only on tablet, drawer on mobile.

### Build `DashboardHeader.tsx`
- Credits badge (live from Zustand)
- User avatar
- Notifications bell

**📝 Commit:** `feat(dashboard): role-based sidebar layout with responsive collapse`

---

## Phase 13 — Client: Supporter Dashboard Pages

| Page | Key Features |
|------|-------------|
| `/dashboard` | Welcome + 3 stat cards (Total Contributions, Credits Spent, Balance) |
| `/dashboard/explore` | Reuse `CampaignGrid` component |
| `/dashboard/my-contributions` | Table: Campaign, Amount, Status badge (amber/green/red), Date |
| `/dashboard/purchase-credit` | `$amount` input → credits auto-calc (`× 10`) → Pay button |
| `/dashboard/payment-history` | Table: Date, Amount, Credits, Method, Status |

**📝 Commit:** `feat(dashboard/supporter): home stats, contributions table, purchase credit`

---

## Phase 14 — Client: Creator Dashboard Pages

| Page | Key Features |
|------|-------------|
| `/dashboard` (Creator) | 3 stat cards + Contributions-to-Review table with Approve/Reject buttons |
| `/dashboard/add-campaign` | Full form with all 8 fields + imgBB upload + validation |
| `/dashboard/my-campaigns` | Table sorted by deadline desc + Update modal + Delete confirm |
| `/dashboard/withdrawals` | Credit summary + Withdrawal form with 200-credit guard |
| `/dashboard/payment-history` | Table: Date, Credits, Amount, Method, Account, Status |

**Contribution Review Table** (Creator Home):
- Shows only `status: "pending"` contributions for creator's campaigns
- View button → modal showing full contribution details
- Approve → `PATCH /api/contributions/:id/approve` → toast + refetch
- Reject → `PATCH /api/contributions/:id/reject` → toast + refetch (credits refunded automatically by server)

**Withdrawal Form guard:**
- If total raised credits < 200: hide "Withdraw" button, show "Insufficient credit" text
- Credits-to-withdraw field: max = total raised credits
- Amount ($) field: read-only, auto = `credits / 20`

**📝 Commit:** `feat(dashboard/creator): add-campaign form with imgBB upload`
**📝 Commit:** `feat(dashboard/creator): my-campaigns with update and delete + refund`
**📝 Commit:** `feat(dashboard/creator): contributions review + withdrawal form`

---

## Phase 15 — Client: Admin Dashboard Pages

| Page | Key Features |
|------|-------------|
| `/dashboard` (Admin) | Platform stats: Total Users, Campaigns, Credits, Pending Count |
| `/dashboard/manage-users` | Table: Avatar, Name, Email, Role (dropdown), Credits, Status toggle |
| `/dashboard/manage-campaigns` | Two tabs: Pending (Approve/Reject) + All Campaigns |
| `/dashboard/withdrawal-requests` | Table with Approve/Reject on pending rows |

**📝 Commit:** `feat(dashboard/admin): manage users with role change and status toggle`
**📝 Commit:** `feat(dashboard/admin): campaign approval workflow and withdrawal processing`

---

## Phase 16 — Client: Additional Pages

4 pages — these should be quick:

| Page | Content |
|------|---------|
| `/about` | Platform story, mission, team section |
| `/contact` | Contact form + email + social links |
| `/blog` | 3+ static blog article cards |
| `/faq` | Accordion component with 8+ questions |

**📝 Commit:** `feat(pages): about, contact, blog, and FAQ pages`

---

## Phase 17 — Polish, Quality & Accessibility

Work through every item in `TASKS.md → Phase 14`:

### SEO
- Every page: `export const metadata = { title: '...', description: '...' }`
- Campaign detail: dynamic metadata from campaign data

### Images
- Replace all `<img>` with `next/image`
- Add meaningful `alt` text to every image

### Code Quality
- Run `npm run lint` → fix all warnings
- Run `npm run build` → fix all TypeScript errors
- Search for `console.log` → delete all (keep `console.error`)

### Responsiveness Check
- Open DevTools → Mobile 375px → all pages ✅
- Tablet 768px → all pages ✅
- Desktop 1280px → all pages ✅

### Loading States
- Every data-fetching component needs a Skeleton loader
- Every list page needs an empty state

### Toast Notifications
- Register/Login → success toast
- Contribute → success/error toast
- Approve/Reject → success toast
- Delete campaign → confirm dialog → success toast

**📝 Commit:** `style(ui): responsive fixes for mobile and tablet`
**📝 Commit:** `chore(quality): fix ESLint warnings and TypeScript errors`
**📝 Commit:** `feat(ux): skeleton loaders, empty states, toast notifications`

---

## Phase 18 — Update README + Deployment

### Update `README.md`
- Add live URL after deployment
- Confirm admin credentials are accurate
- Count feature bullets — must be 10+

### Deploy Server → Railway or Render
1. Push server code to GitHub
2. Connect repo to Railway/Render
3. Set all env vars from `Server/.env`
4. Get live server URL

### Deploy Client → Vercel
1. Push client code to GitHub
2. Connect repo to Vercel
3. Set all env vars from `.env.local`
4. Update `NEXT_PUBLIC_API_URL` to the live server URL
5. Deploy

### Final Checklist
- Live site URL works ✅
- Login/Register with cookie works on live ✅
- Dashboard reloads without redirect ✅
- All features functional on live URL ✅
- 20+ client commits ✅
- 12+ server commits ✅

**📝 Commit:** `chore(deploy): update README with live URL and deployment config`

---

## 📊 Commit Count Tracker

| Repo | Target | Phase Guide Commits |
|------|--------|-------------------|
| Server | 12+ | Phases 1–6 = ~12 commits |
| Client | 20+ | Phases 7–18 = ~20 commits |

---

## 🚨 Top Rules — Never Break These

| Rule | Source |
|------|--------|
| All server code in `Server/index.ts` — no sub-files | `AGENTS.md` |
| JWT in httpOnly cookie — never localStorage | `AGENTS.md` |
| `withCredentials: true` on Axios | `AGENTS.md` |
| `credentials: true` on CORS | `Server/AGENTS.md` |
| Atomic `$inc` for all credit operations | `ARCHITECTURE.md` |
| Strip `password` + `__v` from every response | `Server/AGENTS.md` |
| `/campaigns/top` route before `/:id` route | `Phase 4` |
| No lorem ipsum anywhere | `PRD.md` |
| TypeScript strict — no `any` | `AGENTS.md` |
| Skeleton loaders on every data-fetching card | `AGENTS.md` |

---

## 📁 Quick Reference

| Need info on... | Read... |
|-----------------|---------|
| All features & acceptance criteria | [PRD.md](file:///d:/SCIC13/client/PRD.md) |
| Client coding rules & design tokens | [AGENTS.md](file:///d:/SCIC13/client/AGENTS.md) |
| Server rules & auth code patterns | [Server/AGENTS.md](file:///d:/SCIC13/Server/AGENTS.md) |
| Auth flow & credit transaction diagrams | [ARCHITECTURE.md](file:///d:/SCIC13/client/ARCHITECTURE.md) |
| Checkbox task list | [TASKS.md](file:///d:/SCIC13/client/TASKS.md) |
