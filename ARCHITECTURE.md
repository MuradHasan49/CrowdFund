# ARCHITECTURE.md
# CrowdFund — System Architecture & Design Decisions

**Version:** 1.1.0 | **Updated:** 2026-07-13

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Next.js 16 App (React 19 · TypeScript 5)       │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │  App Router │  │  React Query │  │  Zustand Store │  │  │
│  │  │  (Pages)    │  │  (Server     │  │  (Auth/Credits)│  │  │
│  │  │             │  │   State)     │  │                │  │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘  │  │
│  │                         │                                │  │
│  │              Axios Instance (JWT interceptor)            │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          EXPRESS 5 SERVER — Server/index.ts  (ONE FILE)         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Section 1: Imports & dotenv.config()                   │   │
│  │  Section 2: Constants (credit rates, signup bonuses)    │   │
│  │  Section 3: Mongoose.connect()                          │   │
│  │  Section 4: TypeScript Interfaces                       │   │
│  │  Section 5: Mongoose Models (User, Campaign, etc.)      │   │
│  │  Section 6: Express app + cors + json middleware        │   │
│  │  Section 7: verifyToken() + roleGuard() middleware      │   │
│  │  Section 8: Auth Routes  (register / login / me)        │   │
│  │  Section 9: Campaign Routes                             │   │
│  │  Section 10: Contribution Routes                        │   │
│  │  Section 11: Withdrawal Routes                          │   │
│  │  Section 12: Credit Purchase Routes                     │   │
│  │  Section 13: User Management Routes (Admin)             │   │
│  │  Section 14: Global Error Handler                       │   │
│  │  Section 15: app.listen()                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                                 │
│                                                                 │
│  Collections: users | campaigns | contributions                 │
│               withdrawals | credit_purchases                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Server: Single-File Architecture (`Server/index.ts`)

### Why One File?
- Simple to navigate for assessment purposes.
- Eliminates import graph complexity for a project of this scope.
- Easy to version-control and review in a single diff.
- Organized with clear section comments for readability.

### File Organization Pattern

```typescript
// ============================================================
// 1. IMPORTS & ENV
// ============================================================
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { Schema, Document, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config(); // MUST be first

// ============================================================
// 2. CONSTANTS
// ============================================================
const CREDIT_PURCHASE_RATE    = 10;
const CREDIT_WITHDRAWAL_RATE  = 20;
const MIN_WITHDRAWAL_CREDITS  = 200;
const SUPPORTER_SIGNUP_CREDITS = 50;
const CREATOR_SIGNUP_CREDITS   = 20;

// ============================================================
// 3. MONGOOSE CONNECTION
// ============================================================
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => { console.error(err); process.exit(1); });

// ============================================================
// 4. TYPESCRIPT INTERFACES
// ============================================================
interface IUser extends Document { ... }
interface ICampaign extends Document { ... }
// ... etc.

// ============================================================
// 5. MONGOOSE MODELS
// ============================================================
const UserModel = mongoose.model<IUser>('User', userSchema);
// ... etc.

// ============================================================
// 6. EXPRESS APP & MIDDLEWARE
// ============================================================
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// ============================================================
// 7. AUTH MIDDLEWARE
// ============================================================
function verifyToken(req, res, next) { ... }
function roleGuard(...roles) { return (req, res, next) => { ... }; }

// ============================================================
// 8–13. ROUTES
// ============================================================
app.post('/api/auth/register', async (req, res) => { ... });
// ... all other routes inline

// ============================================================
// 14. GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => { ... });

// ============================================================
// 15. SERVER LISTEN
// ============================================================
app.listen(PORT, () => console.log(`✅ Server on :${PORT}`));
```

---

## Frontend Architecture

### Next.js App Router Layout Groups

```
app/
├── (public)/layout.tsx        ← Navbar + Footer
│   ├── page.tsx               ← Home
│   ├── campaigns/
│   │   ├── page.tsx           ← Explore Campaigns
│   │   └── [id]/page.tsx      ← Campaign Details
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   └── faq/page.tsx
│
├── (auth)/layout.tsx          ← Centered card layout (no nav)
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (dashboard)/layout.tsx     ← Sidebar + Header (protected)
│   └── dashboard/
│       ├── page.tsx           ← Role-based home
│       ├── explore/
│       ├── my-contributions/
│       ├── purchase-credit/
│       ├── payment-history/
│       ├── add-campaign/
│       ├── my-campaigns/
│       ├── withdrawals/
│       ├── manage-users/
│       ├── manage-campaigns/
│       └── withdrawal-requests/
│
├── middleware.ts              ← Route protection
├── globals.css
└── layout.tsx                 ← Root (fonts, providers)
```

### State Management Strategy

| State Type       | Tool           | Location                   |
|------------------|----------------|----------------------------|
| Auth Session     | Zustand        | `store/authStore.ts`       |
| Credit Balance   | Zustand        | `store/creditStore.ts`     |
| Server Data      | TanStack Query | Co-located with components |
| Form State       | React Hook Form| Component-level            |
| UI (modals etc.) | useState       | Component-level            |

### Route Protection (middleware.ts)

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('cf_token')?.value;
  
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

> **Session Re-hydration:** The `cf_token` httpOnly cookie is automatically sent with every request. On app mount, `authStore` calls `GET /api/auth/me` (cookie sent automatically by the browser) to populate user session in Zustand — no localStorage read needed, no redirect on page reload.

---

## Authentication Flow

```
Browser                        Server (index.ts)              MongoDB
  │                                 │                            │
  │  POST /api/auth/register        │                            │
  │ ──────────────────────────── ▶  │                            │
  │                                 │  Check duplicate email     │
  │                                 │ ────────────────────────▶  │
  │                                 │  Hash password (bcrypt)    │
  │                                 │  Save user + credits       │
  │                                 │ ────────────────────────▶  │
  │                                 │  Sign JWT (7d)             │
  │                                 │  res.cookie('cf_token',    │
  │                                 │    token, { httpOnly,      │
  │                                 │    sameSite, maxAge })     │
  │  { user (no password) }         │                            │
  │  Set-Cookie: cf_token=...       │                            │
  │ ◀ ─────────────────────────────  │                            │
  │                                 │                            │
  │  Cookie stored by browser       │                            │
  │  (httpOnly — JS cannot read)    │                            │
  │  zustand: setUser(user)         │                            │
  │                                 │                            │
  │  [page reload]                  │                            │
  │  GET /api/auth/me               │                            │
  │  Cookie: cf_token=... (auto)    │                            │
  │ ──────────────────────────── ▶  │                            │
  │                                 │  verifyToken reads cookie  │
  │                                 │  req.cookies.cf_token      │
  │                                 │  Fetch fresh user data     │
  │  { user, credits }              │                            │
  │ ◀ ─────────────────────────────  │                            │
  │  zustand: setUser(user)         │                            │
  │  ← no redirect on reload ✅     │                            │
  │                                 │                            │
  │  POST /api/auth/logout          │                            │
  │ ──────────────────────────── ▶  │                            │
  │                                 │  res.clearCookie(...)      │
  │  Set-Cookie: cf_token=; Max-Age=0                            │
  │ ◀ ─────────────────────────────  │                            │
  │  zustand: clearUser()           │                            │
```

---

## Contribution Flow (Credit Transactions)

```
Supporter clicks "Contribute"
  → POST /api/contributions { campaign_id, amount, message }
  → verifyToken + roleGuard('supporter')
  → Atomic: UserModel.findOneAndUpdate(
      { _id: req.user.id, credits: { $gte: amount } },
      { $inc: { credits: -amount } }
    )  ← returns null if insufficient → 400
  → Save Contribution { status: "pending" }
  → Response 201

Creator clicks "Approve"
  → PATCH /api/contributions/:id/approve
  → verifyToken + roleGuard('creator')
  → Verify contribution belongs to creator's campaign
  → Atomic: Promise.all([
      Contribution: status → "approved",
      Campaign: $inc { raised_amount: amount }
    ])
  → Response 200

Creator clicks "Reject"
  → PATCH /api/contributions/:id/reject
  → Atomic: Promise.all([
      Contribution: status → "rejected",
      User (supporter): $inc { credits: +amount }  ← refund
    ])
  → Response 200
```

---

## Campaign Deletion & Bulk Refund Logic

```typescript
// Inside DELETE /api/campaigns/:id handler in index.ts
app.delete('/api/campaigns/:id', verifyToken, roleGuard('creator'), async (req, res) => {
  const campaign = await CampaignModel.findOne({
    _id: req.params.id, creator_id: req.user!.id,
  });
  if (!campaign) return res.status(404).json({ success: false, error: 'Not found' });

  // Find all approved contributions
  const approved = await ContributionModel.find({
    campaign_id: req.params.id,
    status: 'approved',
  });

  // Bulk refund supporters
  if (approved.length > 0) {
    const bulkOps = approved.map(c => ({
      updateOne: {
        filter: { _id: c.supporter_id },
        update: { $inc: { credits: c.amount } },
      },
    }));
    await UserModel.bulkWrite(bulkOps);
  }

  // Mark all contributions rejected + delete campaign
  await ContributionModel.updateMany({ campaign_id: req.params.id }, { status: 'rejected' });
  await CampaignModel.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Campaign deleted and credits refunded' });
});
```

---

## Design Token System

### CSS Custom Properties (`globals.css`)

```css
@layer base {
  :root {
    --cf-primary:      #6C47FF;
    --cf-secondary:    #00D4AA;
    --cf-accent:       #FF6B35;
    --cf-bg:           #0D0F1A;
    --cf-surface:      #161827;
    --cf-surface-2:    #1E2130;
    --cf-border:       #2A2D40;
    --cf-text:         #E8EAFF;
    --cf-text-muted:   #8890B0;
  }
}
```

---

## Database Indexing Strategy

Define all indexes inside each schema in `index.ts`:

```typescript
// User
userSchema.index({ email: 1 }, { unique: true });

// Campaign
campaignSchema.index({ status: 1, raised_amount: -1 }); // top funded
campaignSchema.index({ creator_id: 1, deadline: -1 });
campaignSchema.index({ category: 1, status: 1 });
campaignSchema.index({ title: 'text', campaign_story: 'text' }); // search

// Contribution
contributionSchema.index({ campaign_id: 1, status: 1 });
contributionSchema.index({ supporter_id: 1, createdAt: -1 });

// Withdrawal
withdrawalSchema.index({ creator_id: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });
```

---

## Security Considerations

| Concern          | Mitigation                                          |
|------------------|-----------------------------------------------------|
| Password storage | bcrypt (salt rounds: 12)                            |
| JWT secret       | Min 32-char random string in `.env`                 |
| JWT expiry       | 7 days                                              |
| CORS             | Whitelist only `CLIENT_URL` from `.env`             |
| Input safety     | Mongoose typed schemas prevent injection            |
| Sensitive data   | Never return `password` or `__v` in responses       |
| Role guards      | `roleGuard()` applied on every protected route      |
| Atomic ops       | `$inc` with condition guard on all credit changes   |
| Env vars         | Validated at startup; `!` non-null assertion used   |

---

## Performance Targets

| Metric                  | Target      |
|-------------------------|-------------|
| First Contentful Paint  | < 1.5s      |
| Largest Contentful Paint| < 2.5s      |
| Cumulative Layout Shift | < 0.1       |
| Time to Interactive     | < 3.0s      |

### Optimization Techniques
- `next/image` for automatic WebP + lazy loading.
- React Query stale-while-revalidate caching.
- Skeleton loaders for all async content.
- Font preloading via `next/font/google`.
- MongoDB compound indexes on all list queries.
