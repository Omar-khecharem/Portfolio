# Omar Khecharem — Portfolio

A modern, full-stack portfolio platform built with **React**, **Node.js**, **MongoDB**, and **Cloudflare Workers AI**. Features a live admin dashboard with real-time analytics, theme customization, newsletter management, and an AI-powered chatbot.

![Stack](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

## Architecture

```
portfolio/
├── frontend/          # React SPA (Vite + Tailwind + Framer Motion)
├── backend/           # Express REST API (Mongoose + JWT)
├── chatbot-worker/    # Cloudflare Workers AI (Llama 3.1)
├── .github/           # GitHub Actions deployment pipeline
└── docker-compose.yml # Production orchestration
```

---

## Features

### Public Site
- **Responsive UI** — Tailwind CSS with custom theme system (CSS custom properties)
- **Animated transitions** — page-level and element-level animations via Framer Motion
- **Dynamic sections** — Hero with scroll indicator & marquee tech bar, Skills, Projects (with detail modal), Certifications, Social Links
- **AI Chatbot** — contextual assistant powered by Llama 3.1 on Cloudflare Workers, drop-in spring animation, keyword-aware navigation buttons
- **Newsletter popup** — premium slide-in after 5s with email capture, stores subscription in localStorage
- **Scroll progress indicator** — subtle gradient bar at the top tracking reading progress
- **Cinematic navbar logo** — letter-reveal animation (fade + scale + blur per char), dot pulse, diagonal shimmer sweep
- **Letter-animation loader** — CSS-only "Omar" loader on slow connections, fades out on React mount
- **Morphing mobile menu** — animated `Grip` icon rotating into `X` with smooth framer-motion transitions
- **Premium monogram favicon** — custom "OK" monogram with gradient background and accent dot
- **Visitor analytics** — tracks page views, screen size, referrer, browser (anonymized)
- **Contact form** — with validation and email notifications
- **Multi-language support** — i18n-ready structure
- **Cookie consent** — GDPR-compliant banner
- **SEO** — dynamic tab titles per route, JSON-LD structured data, sitemap, robots.txt

### Admin Dashboard (`/admin/dashboard`)
| Tab | Description |
|-----|-------------|
| **Overview** | Quick stats + action shortcuts |
| **Analytics** | Charts (daily/hourly visits, top pages, browsers, recent visitors) |
| **Profile** | Full CRUD for personal info, social links, languages, CV/image upload with spinner |
| **Messages** | Inbox with read/unread status |
| **Newsletter** | Subscriber email list with subscription dates |
| **Categories** | Manage project category taxonomy |
| **Background** | Academic & professional background (education, experience, services) |
| **Skills** | Inline-editable skill table with global color picker |
| **Projects** | Create / edit / delete portfolio projects with image upload spinner |
| **Certifications** | Manage certifications with image upload spinner |
| **Ambiance** | Ambient background customization |
| **Chatbot** | AI assistant configuration (welcome message, personality) |
| **Theme** | Live theme customizer (colors, hero background, spacing) with presets |

---

## Tech Stack

### Frontend
| Dependency | Purpose |
|---|---|
| `react` + `react-dom` 18 | UI framework |
| `react-router-dom` 6 | Client-side routing |
| `framer-motion` 11 | Declarative animations |
| `lucide-react` | Icon library |
| `recharts` 3 | Analytics charts |
| `react-hot-toast` | Toast notifications |
| `tailwindcss` 3 | Utility-first CSS |
| `vite` 5 | Build tool & dev server |

#### UI Components (`src/components/ui/`)
| Component | Description |
|---|---|
| `ScrollProgress` | Fixed reading progress bar with gradient fill |
| `CustomCursor` | Optional custom cursor with `mix-blend-difference` and magnetic attraction |
| `FixedAmbient` | Ambient background orbs, shapes, particles with mouse parallax |
| `GeoShapes` | Floating geometric decorations with floating animations |
| `AnimatedNumber` | Count-up number animation on scroll |
| `ScrollToTop` | Scroll-to-top button |
| `CookieBanner` | GDPR-compliant cookie consent |
| `NewsletterPopup` | Email capture popup with spring animation and localStorage persistence |
| `ProjectDetailModal` | Full project detail view with image, long description, highlights, techs, links |
| `MarqueeBar` | Scrolling tech names bar in Hero section |
| `VisitTracker` | Anonymous visitor analytics |
| `TabTitle` | Dynamic title with visibility-based swap |

### Backend
| Dependency | Purpose |
|---|---|
| `express` 4 | HTTP server & routing |
| `mongoose` 8 | MongoDB ODM |
| `jsonwebtoken` | JWT-based auth |
| `bcryptjs` | Password hashing |
| `multer` | File upload handling |
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting |
| `express-validator` | Input validation |
| `morgan` | HTTP request logging |
| `dotenv` | Environment configuration |

### AI Chatbot
- **Runtime:** Cloudflare Workers
- **Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Context:** Dynamically builds system prompt from the owner's CV (skills, experience, projects, education, certifications)
- **Deployment:** `wrangler deploy`

### Infrastructure
- **Containerization:** Docker & Docker Compose (Node 20 Alpine)
- **CI/CD:** GitHub Actions → SSH deploy with `docker-compose up --build`
- **Database:** MongoDB (local dev via Docker, Atlas for production)
- **File storage:** UploadThing for production, local `/uploads` for development

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- (Optional) Docker & Docker Compose
- (Optional) Cloudflare account for chatbot

### 1. Clone & Install

```bash
git clone https://github.com/Omar-khecharem/Portfolio.git
cd Portfolio

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Chatbot worker
cd ../chatbot-worker && npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in the required values:
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login credentials |
| `CLOUDFLARE_*` | Cloudflare API credentials (chatbot) |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials for email verification |

### 3. Seed the Database

```bash
cd backend
npm run seed        # Creates admin user + sample profile
npm run seed-themes # Installs theme presets
```

### 4. Run in Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

The Vite dev server proxies `/api` and `/uploads` to `localhost:5000`.

### 5. Access
- **Public site:** `http://localhost:5173`
- **Admin login:** `http://localhost:5173/admin`
- **Admin dashboard:** `http://localhost:5173/admin/dashboard`

---

## Deployment

### Docker (Recommended)

```bash
docker-compose up --build -d
```

The compose file defines three services:
- `backend` — Express API on port 5000
- `frontend` — Nginx-served SPA on port 80
- `mongo` — MongoDB on port 27017

### GitHub Actions

The repository includes a CI/CD workflow (`.github/workflows/deploy.yml`) that:
1. Installs dependencies for backend and frontend
2. Builds the frontend
3. SSHs into the production server
4. Pulls the latest code and runs `docker-compose up --build`

Secrets required in the repository:
- `SERVER_HOST`
- `SERVER_USER`
- `SSH_KEY`

---

## Project Structure

```
backend/
├── src/
│   ├── config/db.js              # Mongoose connection
│   ├── controllers/              # Route handlers (10 resources)
│   ├── middleware/                # Auth, upload, validation, error handling
│   ├── models/                   # Mongoose schemas (8 models)
│   ├── routes/                   # Express routers
│   ├── services/                 # Business logic
│   ├── utils/                    # JWT, email helpers
│   ├── seed.js                   # Admin + profile seeder
│   ├── seed-themes.js            # Theme presets seeder
│   └── server.js                 # Entry point

frontend/
├── src/
│   ├── components/
│   │   ├── admin/                # 11 dashboard panel components
│   │   ├── layout/               # Navbar, Footer
│   │   ├── sections/             # Hero (scroll indicator, marquee, social), Skills, Projects, etc.
│   │   └── ui/                   # Reusable widgets
│   ├── contexts/                 # AuthContext, ThemeContext
│   ├── pages/                    # Route-level page components
│   ├── services/api.js           # Axios client + API methods
│   └── styles/globals.css        # Tailwind directives + custom vars

chatbot-worker/
├── src/index.js                  # Cloudflare Worker (AI chat)
├── wrangler.toml                 # Worker configuration
└── package.json
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Admin login (sends verification code) |
| POST | `/api/auth/verify-code` | — | Verify 2FA code & receive JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET/PUT | `/api/profile` | ✓* | Profile CRUD |
| GET/POST | `/api/projects` | ✓* | Projects list / create |
| PUT/DELETE | `/api/projects/:id` | ✓ | Update / delete project |
| GET/POST | `/api/certifications` | ✓* | Certifications list / create |
| PUT/DELETE | `/api/certifications/:id` | ✓ | Update / delete certification |
| GET/PUT | `/api/theme` | ✓* | Active theme |
| GET/POST | `/api/themes` | ✓ | Theme presets |
| PUT | `/api/themes/:id/activate` | ✓ | Activate theme |
| GET/POST | `/api/messages` | ✓* | Messages list / create |
| PUT | `/api/messages/:id/read` | ✓ | Mark as read |
| DELETE | `/api/messages/:id` | ✓ | Delete message |
| GET | `/api/visitor/stats` | ✓ | Analytics data |
| POST | `/api/upload` | ✓ | File upload |
| POST | `/api/chat` | — | AI chatbot |
| POST | `/api/newsletter` | — | Newsletter subscription |
| GET | `/api/newsletter` | ✓ | List subscribers |

> `✓*` — Public read, admin-only write.

---

## License

MIT © [Omar Khecharem](https://github.com/Omar-khecharem)
