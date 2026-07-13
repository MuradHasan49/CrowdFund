# Product Requirements Document
# CrowdFund — Community Crowdfunding Platform

**Version:** 1.1.0  
**Date:** 2026-07-13  
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · Express 5 · MongoDB · JWT  
**Server Architecture:** All backend code in a **single file** — `Server/index.ts`  
**Assessment:** Junior MERN Stack Developer — Full Stack TypeScript Crowdfunding App

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Business Logic](#business-logic)
4. [Feature Specifications](#feature-specifications)
   - [Public Layout](#public-layout)
   - [Home Page](#home-page)
   - [Explore Campaigns](#explore-campaigns)
   - [Campaign Details](#campaign-details)
   - [Authentication](#authentication)
   - [Dashboard — Supporter](#dashboard--supporter)
   - [Dashboard — Creator](#dashboard--creator)
   - [Dashboard — Admin](#dashboard--admin)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Acceptance Criteria Checklist](#acceptance-criteria-checklist)

---

## Overview

CrowdFund is a full-stack crowdfunding platform where **Creators** raise funds for projects by collecting credit contributions from **Supporters**. The platform uses a credit system — Supporters buy credits, contribute to campaigns, and Creators withdraw earnings once approved by the Admin.

> ⚠️ **Server Architecture:** The entire Express backend (models, middleware, all routes, error handling) is written in a **single file**: `Server/index.ts`. Organized with 15 clearly labeled section comments.

**Core Value Proposition:**
- Creators launch campaigns, reach backers, and withdraw real earnings.
- Supporters discover compelling projects and back them with purchased credits.
- Admins maintain platform integrity through approvals and moderation.

---

## User Roles

| Role      | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Supporter | Browses campaigns, contributes credits, tracks contributions, buys credits. |
| Creator   | Creates and manages campaigns, tracks backers, requests withdrawals.        |
| Admin     | Approves campaigns, manages users, processes withdrawals, resolves reports. |

### Default Credits on Registration
| Role      | Default Credits |
|-----------|----------------|
| Supporter | 50 credits      |
| Creator   | 20 credits      |

---

## Business Logic

### Credit System
```
Purchase:    10 credits  =  $1.00  (Supporter buys)
Withdrawal:  20 credits  =  $1.00  (Creator earns)
Minimum Withdrawal: 200 credits ($10.00)
```

### Campaign Lifecycle
```
Created (pending) → Admin Approved (active) → Deadline Passed (closed)
                 ↘ Admin Rejected (rejected)
```

### Contribution Flow
```
Supporter selects campaign → enters amount ≥ minimum_contribution
→ credits deducted from Supporter's balance
→ Contribution saved as "pending"
→ Creator reviews → Approves (credits added to campaign raised) OR Rejects (credits refunded)
```

### Withdrawal Flow
```
Creator initiates withdrawal → selects credits to withdraw (max = total raised)
→ withdrawal saved as "pending"
→ Admin approves → funds disbursed
→ withdrawal_amount = credits / 20
```

---

## Feature Specifications

---

### Public Layout

#### Navbar

**Not Logged In (3 routes minimum):**
| Element             | Behavior                                         |
|---------------------|--------------------------------------------------|
| Logo / Website Name | Redirects to `/`                                 |
| Explore Campaigns   | Navigates to `/campaigns`                        |
| Login               | Navigates to `/login`                            |
| Register            | Navigates to `/register`                         |
| Join as Developer   | External link → client GitHub repository         |

**Logged In (5 routes minimum):**
| Element             | Behavior                                         |
|---------------------|--------------------------------------------------|
| Logo / Website Name | Redirects to `/`                                 |
| Dashboard           | Navigates to `/dashboard`                        |
| Available Credits   | Displays live credit balance badge               |
| User Profile        | Shows avatar + dropdown (Profile, Logout)        |
| Join as Developer   | External link → client GitHub repository         |

**Rules:**
- Sticky / fixed position at top.
- Full-width background.
- Fully responsive — hamburger menu on mobile.
- Credit badge updates in real-time after any transaction.

#### Footer
- Platform logo and tagline.
- Navigation links (Explore, About, Blog, Contact, FAQ).
- Social media icons linking to developer profiles (LinkedIn, GitHub, Facebook).
- Contact email.
- Copyright notice.
- All links must be functional.

---

### Home Page

> **Must use animation throughout.**

#### Section 1: Hero Slider
- Implemented with **React Responsive Carousel** or **Swiper Slider**.
- 3 slides, each with:
  - Unique background image or gradient.
  - Unique heading and subtitle.
  - CTA button ("Start a Campaign", "Explore Projects", "How It Works").
- Auto-play with 4-second interval.
- Height: 60–70% of viewport.

#### Section 2: Top Funded Campaigns
- Displays the **top 6 campaigns** ranked by `raised_amount` (descending).
- Each campaign shows: cover image, title, raised amount.
- "View All" link → `/campaigns`.

#### Section 3: Testimonials
- Static section with **Swiper Slider**.
- 5+ user testimonials with photo, name, role, and quote.

#### Section 4: How It Works
- 3-step visual flow: Create → Fund → Withdraw.
- Icon + step number + description for each step.

#### Section 5: Explore by Category
- Grid of campaign categories with icons (Technology, Art, Community, Health, etc.).
- Each category links to `/campaigns?category=X`.

#### Section 6: Platform Stats (Animated Counters)
- Total campaigns launched.
- Total credits raised.
- Total supporters.
- Total creators.
- Numbers animate up on scroll into view.

#### Section 7: Newsletter Sign-Up
- Email input + "Subscribe" button.
- Success message shown after submission.

#### Section 8: Call to Action (CTA Banner)
- Bold headline, sub-copy, and 2 buttons: "Start a Campaign" and "Explore Now".
- Gradient or vibrant background to stand out.

**Minimum:** 7 meaningful sections total ✅ (8 listed above).

---

### Explore Campaigns

**Route:** `/campaigns`

| Feature         | Specification                                                    |
|-----------------|------------------------------------------------------------------|
| Search Bar      | Full-text search on `title` and `campaign_story`                 |
| Filter: Category| Dropdown — Technology, Art, Community, Health, etc.              |
| Filter: Status  | Active, Closed, All                                              |
| Filter: Funding | Min/max funding goal slider or input                             |
| Sort            | Most Funded, Newest, Deadline Soon, Alphabetical                 |
| Pagination      | 12 cards per page OR infinite scroll                             |
| Card Layout     | 4 per row (desktop), 2 (tablet), 1 (mobile)                     |
| Skeleton        | Card skeletons shown while loading                               |

**Campaign Card Requirements:**
- Cover image (fixed height, `object-cover`)
- Title
- Short description (2-line clamp)
- Category badge
- Funding progress bar (`raised / goal`)
- Meta: deadline, minimum contribution, creator name
- "View Details" button → `/campaigns/:id`

---

### Campaign Details Page

**Route:** `/campaigns/:id`  
**Access:** Public

| Section              | Content                                                         |
|----------------------|-----------------------------------------------------------------|
| Cover Image / Media  | Full-width hero image                                           |
| Title + Category     | Large heading with category badge                               |
| Funding Progress     | Progress bar, raised amount, goal, percentage, days left        |
| Creator Info         | Avatar, name, total campaigns                                   |
| Contribute Form      | Credit input (≥ min_contribution), optional message, Contribute button |
| Campaign Story       | Rich text description                                           |
| Reward Info          | What supporters receive                                         |
| Key Specs            | Funding goal, deadline, minimum contribution, category          |
| Related Campaigns    | 4 campaigns in same category                                    |

**Contribute Button Logic:**
- Disabled if user not logged in → redirect to `/login`.
- Disabled if user is the creator of this campaign.
- Deducts credits from Supporter's account instantly.
- Shows error if insufficient credits.

---

### Authentication

#### Registration Page (`/register`)
| Field             | Validation                                         |
|-------------------|----------------------------------------------------|
| Full Name         | Required, min 2 chars                              |
| Email             | Valid email format, must be unique                 |
| Profile Photo URL | Valid URL format                                   |
| Password          | Min 8 chars, 1 uppercase, 1 number, 1 special char |
| Confirm Password  | Must match password                                |
| Role              | Dropdown: Supporter / Creator                      |

- Google Sign-In button (OAuth).
- "Already have an account? Login" link.
- Error messages for all invalid/duplicate inputs.
- On success: user saved to DB with default credits, redirect to `/dashboard`.

#### Login Page (`/login`)
| Field    | Validation             |
|----------|------------------------|
| Email    | Required, valid format |
| Password | Required               |

- Google Sign-In button.
- Demo Login button (auto-fills test credentials).
- "Forgot password?" link (optional).
- On success: JWT stored in `localStorage`, redirect to `/dashboard`.

---

### Dashboard — Supporter

#### Sidebar Navigation
1. Home (`/dashboard`)
2. Explore Campaigns (`/dashboard/explore`)
3. My Contributions (`/dashboard/my-contributions`)
4. Purchase Credit (`/dashboard/purchase-credit`)
5. Payment History (`/dashboard/payment-history`)

#### Dashboard Home (Supporter)
- Welcome message with avatar.
- Stats: Total Contributions, Total Credits Spent, Current Credits Balance.
- Recent contributions table (last 5).

#### My Contributions
- Table with columns: Campaign Title, Amount, Status (pending/approved/rejected), Date.
- Status badge with color coding:
  - `pending` → amber
  - `approved` → green
  - `rejected` → red with refund note.

#### Purchase Credit
| Field          | Spec                                        |
|----------------|---------------------------------------------|
| Amount ($)     | Number input, min $1                        |
| Credits        | Auto-calculated: `amount × 10`              |
| Payment Method | Dropdown: Stripe (implemented), Bkash, etc. |
| Pay Button     | Triggers Stripe checkout or simulated payment |

#### Payment History
- Table: Date, Amount ($), Credits Received, Payment Method, Status.

---

### Dashboard — Creator

#### Sidebar Navigation
1. Home (`/dashboard`)
2. Add New Campaign (`/dashboard/add-campaign`)
3. My Campaigns (`/dashboard/my-campaigns`)
4. Withdrawals (`/dashboard/withdrawals`)
5. Payment History (`/dashboard/payment-history`)

#### Dashboard Home (Creator)
| Stat Card              | Value                                      |
|------------------------|--------------------------------------------|
| Total Campaigns        | Count of all user's campaigns              |
| Active Campaigns       | Campaigns where deadline ≥ today           |
| Total Amount Raised    | Sum of all `raised_amount` across campaigns|

**Contributions to Review Table:**
| Column              | Content                               |
|---------------------|---------------------------------------|
| Supporter Name      | —                                     |
| Campaign Title      | —                                     |
| Contribution Amount | Credits                               |
| View Button         | Opens modal with message/details      |
| Approve Button      | Adds to `raised_amount`, status → approved |
| Reject Button       | Status → rejected, refunds Supporter  |

Only shows contributions with `status: "pending"`.

#### Add New Campaign (`/dashboard/add-campaign`)

| Field                 | Type       | Validation                               |
|-----------------------|------------|------------------------------------------|
| Campaign Title        | Text       | Required, 10–100 chars                   |
| Campaign Story        | Textarea   | Required, min 100 chars                  |
| Category              | Dropdown   | Required                                 |
| Funding Goal          | Number     | Required, min 100 credits                |
| Minimum Contribution  | Number     | Required, min 1, ≤ funding_goal          |
| Deadline              | Date       | Required, must be in the future          |
| Reward Info           | Textarea   | Required                                 |
| Campaign Image URL    | URL        | Required, valid URL (imgBB upload optional) |

- On submit: saved with `status: "pending"`.
- Visible to Supporters only after Admin approval.

#### My Campaigns (`/dashboard/my-campaigns`)
- Table sorted by deadline descending.
- Columns: Title, Category, Status, Raised, Goal, Deadline, Actions.
- **Update** button → modal to edit title, story, reward_info.
- **Delete** button → confirm dialog → deletes campaign → refunds all approved contributors.

#### Withdrawals (`/dashboard/withdrawals`)

**Summary:**
- Current raised credits.
- Withdrawal amount in dollars (`credits / 20`).

**Withdrawal Form:**

| Field                | Type     | Behavior                                    |
|----------------------|----------|---------------------------------------------|
| Credits to Withdraw  | Number   | Cannot exceed total raised; min 200         |
| Withdrawal Amount    | Number   | Read-only; auto = `credits / 20`            |
| Payment System       | Dropdown | Stripe, Bkash, Rocket, Nagad                |
| Account Number       | Text     | Required                                    |

- If credits < 200: hide Withdraw button, show "Insufficient credit" message.
- On submit: saved as `{ status: "pending" }`, awaits Admin approval.

#### Payment History (Creator)
- Table: Date, Credits Withdrawn, Amount ($), Payment Method, Account, Status.

---

### Dashboard — Admin

#### Sidebar Navigation
1. Home (`/dashboard`)
2. Manage Users (`/dashboard/manage-users`)
3. Manage Campaigns (`/dashboard/manage-campaigns`)
4. Withdrawal Requests (`/dashboard/withdrawal-requests`)
5. Reports (`/dashboard/reports`)

#### Dashboard Home (Admin)
- Platform overview stats:
  - Total Users, Total Campaigns, Total Credits in Circulation, Pending Approvals.
- Quick action cards: "Review Campaigns", "Process Withdrawals".

#### Manage Users
- Table: Avatar, Name, Email, Role, Credits, Joined Date.
- Actions:
  - Change Role (Supporter ↔ Creator) via dropdown.
  - Deactivate / Activate account.
- Search bar by name or email.

#### Manage Campaigns
- Two tabs: **Pending** | **All Campaigns**.
- Pending tab: shows campaigns awaiting approval.
  - **Approve** → status becomes "active", visible to all.
  - **Reject** → status becomes "rejected", creator notified.
- All Campaigns tab: full campaign list with status badges and delete option.

#### Withdrawal Requests
- Table: Creator Name, Credits, Amount ($), Payment Method, Account Number, Date, Status.
- Actions on `pending` rows:
  - **Approve** → status → "approved", creator notified.
  - **Reject** → status → "rejected", credits refunded to creator's raised pool.

#### Reports (optional stretch goal)
- Issues reported by creators displayed in table.
- Status management: Open → In Review → Resolved.

---

## Additional Pages

| Page    | Route      | Content                                        |
|---------|------------|------------------------------------------------|
| About   | `/about`   | Platform story, team, mission                  |
| Contact | `/contact` | Contact form, email, social links              |
| Blog    | `/blog`    | Static blog cards (3+ articles)                |
| FAQ     | `/faq`     | Accordion of frequently asked questions        |

---

## Data Models

### User
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;           // unique
  photoURL: string;
  password: string;        // hashed (bcrypt)
  role: 'supporter' | 'creator' | 'admin';
  credits: number;         // default 50 (supporter) | 20 (creator)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Campaign
```typescript
interface Campaign {
  _id: ObjectId;
  title: string;
  campaign_story: string;
  category: 'Technology' | 'Art' | 'Community' | 'Health' | 'Education' | 'Other';
  funding_goal: number;         // credits
  minimum_contribution: number; // credits
  deadline: Date;
  reward_info: string;
  campaign_image_url: string;
  creator_id: ObjectId;         // ref: User
  creator_name: string;
  creator_email: string;
  raised_amount: number;        // default 0
  status: 'pending' | 'active' | 'rejected' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
```

### Contribution
```typescript
interface Contribution {
  _id: ObjectId;
  campaign_id: ObjectId;        // ref: Campaign
  campaign_title: string;
  supporter_id: ObjectId;       // ref: User
  supporter_name: string;
  supporter_email: string;
  amount: number;               // credits
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

### Withdrawal
```typescript
interface Withdrawal {
  _id: ObjectId;
  creator_id: ObjectId;         // ref: User
  creator_name: string;
  creator_email: string;
  withdrawal_credit: number;
  withdrawal_amount: number;    // dollars = credits / 20
  payment_system: 'stripe' | 'bkash' | 'rocket' | 'nagad';
  account_number: string;
  withdraw_date: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}
```

### CreditPurchase
```typescript
interface CreditPurchase {
  _id: ObjectId;
  user_id: ObjectId;
  user_email: string;
  amount_usd: number;
  credits_received: number;     // amount_usd × 10
  payment_method: string;
  payment_intent_id?: string;   // Stripe
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
```

---

## API Endpoints

### Auth
| Method | Endpoint               | Auth | Description                    |
|--------|------------------------|------|--------------------------------|
| POST   | `/api/auth/register`   | —    | Register new user              |
| POST   | `/api/auth/login`      | —    | Login, returns JWT             |
| POST   | `/api/auth/google`     | —    | Google OAuth sign-in           |
| GET    | `/api/auth/me`         | JWT  | Get current user profile       |
| PATCH  | `/api/auth/me`         | JWT  | Update profile                 |

### Campaigns
| Method | Endpoint                    | Auth      | Description                     |
|--------|-----------------------------|-----------|---------------------------------|
| GET    | `/api/campaigns`            | —         | List active campaigns (filters) |
| GET    | `/api/campaigns/top`        | —         | Top 6 by raised_amount          |
| GET    | `/api/campaigns/:id`        | —         | Single campaign detail          |
| POST   | `/api/campaigns`            | Creator   | Create campaign (→ pending)     |
| PATCH  | `/api/campaigns/:id`        | Creator   | Update title/story/reward       |
| DELETE | `/api/campaigns/:id`        | Creator   | Delete + refund contributors    |
| GET    | `/api/campaigns/mine`       | Creator   | Creator's own campaigns         |
| PATCH  | `/api/campaigns/:id/status` | Admin     | Approve / reject                |

### Contributions
| Method | Endpoint                         | Auth      | Description                     |
|--------|----------------------------------|-----------|---------------------------------|
| POST   | `/api/contributions`             | Supporter | Create contribution             |
| GET    | `/api/contributions/mine`        | Supporter | My contributions                |
| GET    | `/api/contributions/pending`     | Creator   | Pending contributions to review |
| PATCH  | `/api/contributions/:id/approve` | Creator   | Approve → update raised_amount  |
| PATCH  | `/api/contributions/:id/reject`  | Creator   | Reject → refund Supporter       |

### Withdrawals
| Method | Endpoint                         | Auth    | Description                     |
|--------|----------------------------------|---------|---------------------------------|
| POST   | `/api/withdrawals`               | Creator | Request withdrawal              |
| GET    | `/api/withdrawals/mine`          | Creator | Creator's withdrawal history    |
| GET    | `/api/withdrawals`               | Admin   | All withdrawal requests         |
| PATCH  | `/api/withdrawals/:id/approve`   | Admin   | Approve withdrawal              |
| PATCH  | `/api/withdrawals/:id/reject`    | Admin   | Reject withdrawal               |

### Users (Admin)
| Method | Endpoint               | Auth  | Description              |
|--------|------------------------|-------|--------------------------|
| GET    | `/api/users`           | Admin | List all users           |
| PATCH  | `/api/users/:id/role`  | Admin | Change user role         |
| PATCH  | `/api/users/:id/status`| Admin | Activate / deactivate    |

### Credits
| Method | Endpoint                  | Auth      | Description                     |
|--------|---------------------------|-----------|---------------------------------|
| POST   | `/api/credits/purchase`   | Supporter | Purchase credits (Stripe)       |
| GET    | `/api/credits/history`    | User      | Purchase history                |

---

## Non-Functional Requirements

| Category        | Requirement                                                           |
|-----------------|-----------------------------------------------------------------------|
| Performance     | First Contentful Paint < 2s on 3G                                     |
| Security        | JWT expiry 7d, bcrypt password hashing, rate limiting on auth routes  |
| Responsiveness  | Works on 375px (mobile), 768px (tablet), 1280px+ (desktop)           |
| Accessibility   | WCAG 2.1 AA compliance, keyboard navigation, ARIA labels              |
| SEO             | Meta title, meta description, and OG tags on every page              |
| Code Quality    | ESLint + TypeScript strict mode, no `any`, no `console.log`          |
| Git             | Client: 20+ commits, Server: 12+ commits (conventional commit format)|
| Environment     | All secrets in `.env` / `.env.local`, gitignored                     |
| Reload Guard    | Protected routes do NOT redirect to login on reload (re-hydration)   |
| No Placeholder  | No lorem ipsum, no placeholder images, no dummy content              |

---

## Acceptance Criteria Checklist

### Assessment Requirements (PRD Rules 1–11)
- [ ] TypeScript strict mode active everywhere
- [ ] Tailwind CSS v4 (no other CSS frameworks)
- [ ] Max 3 primary colors enforced via CSS variables
- [ ] All cards: same size, border-radius, padding
- [ ] Fully responsive: mobile, tablet, desktop
- [ ] Navbar: 3 routes (logged out), 5 routes (logged in), sticky
- [ ] Hero: 60–70% viewport height, interactive slider
- [ ] Minimum 7 home sections (8 implemented)
- [ ] Footer: functional links, social icons, contact info
- [ ] Campaign cards: image, title, description, meta, "View Details"
- [ ] Desktop: 4 cards per row
- [ ] Skeleton loaders on all data cards
- [ ] Details page: publicly accessible, multiple sections
- [ ] Explore: search + 2 filters + sorting + pagination
- [ ] Auth: login, register, validation, demo button, social login
- [ ] Add Campaign (`/dashboard/add-campaign`): protected, form with all fields
- [ ] Manage Campaigns (`/dashboard/my-campaigns`): table with view/delete
- [ ] 4 additional pages: About, Contact, Blog, FAQ
- [ ] No lorem ipsum anywhere
- [ ] All buttons and links clickable

### Crowdfunding Platform Requirements
- [ ] 3 user roles: Supporter, Creator, Admin
- [ ] Credit system: 10 credits/$1 purchase, 20 credits/$1 withdrawal
- [ ] Supporter gets 50 credits on registration (once only)
- [ ] Creator gets 20 credits on registration (once only)
- [ ] Campaign lifecycle: pending → approved/rejected → active → closed
- [ ] Contribution approval/rejection with refund logic
- [ ] Withdrawal form with minimum 200 credit guard
- [ ] Admin: approve campaigns, manage users, process withdrawals
- [ ] Google OAuth sign-in
- [ ] JWT in localStorage, session re-hydrated on page reload
- [ ] 20 client GitHub commits, 12 server GitHub commits
- [ ] README.md with live URL, admin credentials, 10+ feature bullets
- [ ] All env vars in `.env` / `.env.local` (gitignored)
