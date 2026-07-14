# CrowdFund — Community Crowdfunding Platform

> **Empower creators. Support ideas. Build communities.**

[![Live Site (Vercel)](https://img.shields.io/badge/Live%20Site-crowdfund.vercel.app-6C47FF?style=for-the-badge)](https://crowdfund.vercel.app)
[![Client Repo](https://img.shields.io/badge/GitHub-Client-161827?style=for-the-badge&logo=github)](https://github.com/MuradHasan49/CrowdFund/tree/main/client)
[![Server Repo](https://img.shields.io/badge/GitHub-Server-161827?style=for-the-badge&logo=github)](https://github.com/MuradHasan49/CrowdFund/tree/main/Server)

---

## 🌐 Live Site

**URL:** `https://crowdfund.vercel.app` *(update after deployment)*


## 🚀 Key Features

1. **Three-Role System** — Supporter, Creator, and Admin each have tailored dashboards with role-specific navigation, permissions, and workflows.

2. **Campaign Lifecycle Management** — Creators submit campaigns that go through Admin approval before going live. Campaigns auto-close past their deadline.

3. **Credit Economy** — Supporters buy credits ($1 = 10 credits) and contribute to campaigns. Creators withdraw earnings at $1 per 20 credits raised.

4. **Contribution Review Workflow** — Creators manually approve or reject pending contributions; rejections automatically refund the Supporter's credits.

5. **Secure JWT Authentication** — Email/password login and Google OAuth, with JWT stored securely in an `httpOnly` cookie. Session is re-hydrated on page reload automatically by the server-side proxy middleware.

6. **Real-Time Credit Balance** — Available credits displayed in the navbar update instantly after every contribution, purchase, or withdrawal action.

7. **Campaign Discovery & Filtering** — Explore page with full-text search, category filter, status filter, funding range filter, sorting, and 12-per-page pagination.

8. **Responsive Dashboard** — Sidebar-driven dashboard works across mobile (drawer), tablet (icon-only), and desktop (full sidebar) with role-gated navigation.

9. **Animated Landing Page** — Hero with auto-sliding carousel, scroll-triggered counter animations, Swiper-powered testimonials, and smooth Framer Motion transitions.

10. **Withdrawal Request System** — Creators request fund withdrawals via Stripe or local payment methods; Admins review and approve with audit trail in payment history.

11. **Campaign Deletion with Refunds** — Deleting a campaign automatically refunds all approved supporters' credits in bulk, maintaining financial integrity.

12. **Image Upload via imgBB** — Creators can upload campaign cover images directly from the form using the imgBB API integration.

---

## 🛠️ Technology Stack

### Frontend
| Tech             | Version  | Purpose                          |
|------------------|----------|----------------------------------|
| Next.js          | 16.2.10  | React framework with App Router  |
| React            | 19.2.4   | UI rendering                     |
| TypeScript       | 5.x      | Type safety                      |
| Tailwind CSS     | v4       | Styling                          |
| TanStack Query   | v5       | Server state management          |
| Zustand          | v5       | Client state (auth, credits)     |
| Axios            | v1       | HTTP client with interceptors    |
| React Hook Form  | v7       | Form management                  |
| Zod              | v3       | Schema validation                |
| Framer Motion    | v11      | Animations                       |
| Swiper           | v11      | Sliders (hero, testimonials)     |
| Recharts         | v2       | Dashboard charts                 |

### Backend
| Tech        | Version | Purpose                     |
|-------------|---------|-----------------------------|
| Node.js     | 20+     | Runtime                     |
| Express     | 5.x     | Web framework               |
| TypeScript  | 7.x     | Type safety                 |
| MongoDB     | Atlas   | Database                    |
| Mongoose    | v8      | ODM                         |
| JWT         | v9      | Authentication tokens       |
| bcrypt      | v5      | Password hashing            |
| Zod         | v3      | Request validation          |
| cors        | v2      | Cross-origin requests       |
| dotenv      | v17     | Environment variables       |

---

## 📂 Project Structure

```
SCIC13/
├── client/          # Next.js 16 frontend
│   ├── src/
│   │   ├── app/     # App Router pages & layouts
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   ├── AGENTS.md
│   ├── PRD.md
│   └── ARCHITECTURE.md
│
└── Server/          # Express 5 backend (single file)
    ├── index.ts     ← ALL server code: models, middleware, routes, logic
    ├── .env         ← Never committed
    ├── AGENTS.md
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials
- imgBB API key (optional)

### 1. Clone Repository

```bash
git clone https://github.com/MuradHasan49/CrowdFund.git
cd CrowdFund
```

### 2. Server Setup

```bash
cd SCIC13/Server
npm install
```

Create `Server/.env`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/crowdfund
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
npm run dev    # starts on http://localhost:8000
```

### 3. Client Setup

```bash
cd SCIC13/client
npm install
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

```bash
npm run dev    # starts on http://localhost:3000
```

---

## 🎭 User Roles & Permissions

| Feature                | Supporter | Creator | Admin |
|------------------------|:---------:|:-------:|:-----:|
| Browse campaigns       | ✅        | ✅      | ✅    |
| Contribute to campaign | ✅        | —       | —     |
| Purchase credits       | ✅        | —       | —     |
| Create campaign        | —         | ✅      | —     |
| Approve contributions  | —         | ✅      | —     |
| Request withdrawal     | —         | ✅      | —     |
| Approve campaigns      | —         | —       | ✅    |
| Manage users           | —         | —       | ✅    |
| Process withdrawals    | —         | —       | ✅    |

---

## 💰 Credit System

```
Purchase:   $1.00 = 10 credits    (Supporter buying credits)
Withdrawal: 20 credits = $1.00    (Creator cashing out)
Minimum withdrawal: 200 credits ($10.00)

New Supporter signup: +50 credits (one-time)
New Creator signup:   +20 credits (one-time)
```


## 🌍 Deployment

| Service  | Platform        |
|----------|-----------------|
| Frontend | Vercel          |
| Backend  | Railway / Render|
| Database | MongoDB Atlas   |

---

## 📄 Documentation

- [AGENTS.md](./AGENTS.md) — AI agent rules, coding standards, design system
- [PRD.md](./PRD.md) — Full product requirements and acceptance criteria
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design, data flows, security

---

## 📞 Contact & Links

- **GitHub Repository:** [github.com/MuradHasan49/CrowdFund](https://github.com/MuradHasan49/CrowdFund)
- **LinkedIn:** [linkedin.com/in/murad-hasan](https://linkedin.com/in/murad-hasan)
