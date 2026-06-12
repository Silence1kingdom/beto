# B-20 Studio

Elite web design team specializing in 3D interactive experiences, futuristic UI/UX, and AI-powered digital systems.

## Features

- **3D Interactive Scene** — Three.js laptop model with live terminal simulation using `@react-three/fiber`
- **Smooth Scrolling** — Lenis-powered smooth scroll with GSAP ScrollTrigger animations
- **Bilingual (AR/EN)** — Full Arabic/English i18n with RTL layout support
- **Admin Dashboard** — Manage projects, team members, and contact messages with CRUD operations
- **Firebase Integration** — Optional Firestore backend with automatic localStorage fallback
- **Responsive Design** — Mobile hamburger menu, adaptive layouts, touch-friendly
- **Vercel-ready** — Pre-configured for Vercel deployment with SPA rewrites

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS 3.4, shadcn/ui |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Animations | GSAP, ScrollTrigger, Lenis |
| Routing | react-router v7 |
| Backend | Firebase Firestore (optional) |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run vercel` | Deploy to Vercel |

## Project Structure

```
src/
├── 3d/                  # Three.js components (LaptopScene, TerminalScreen, Particles)
├── components/          # Shared UI components (Navigation, NeonButton, admin/)
├── contexts/            # React contexts (AdminContext, LanguageContext)
├── hooks/               # Custom hooks (useEditableContent, use-mobile)
├── i18n/                # Translation files (en.json, ar.json)
├── lib/                 # Firebase, admin-lang, utils
├── pages/               # Page components (Home, NotFound, admin/)
├── sections/            # Page sections (Hero, About, Services, Projects, Team, Contact, Footer)
├── App.tsx              # Root component
└── main.tsx             # Entry point with routing
```

## Firebase Integration

Firebase is optional. The app checks for environment variables at runtime:

- If Firebase config is present: data is read/written to Firestore
- If Firestore is unavailable: app falls back to localStorage automatically
- No Firebase config: app runs entirely on localStorage

Set up Firebase:

1. Create a project in [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create Firestore collections: `projects`, `team`, `messages`
4. Copy `.env.example` to `.env` and fill in your config

## Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Deployment

The project includes a `vercel.json` with:

- SPA rewrites (all routes fall back to `index.html`)
- Asset caching headers
- Firebase environment variable secrets integration

```bash
npm run vercel
```

Or deploy via GitHub import in the Vercel Dashboard.

## Default Admin Credentials

> **⚠️ Local-only fallback** — `admin` / `b20admin2024`

These are only used when Firebase is not configured. Change them after first login if using localStorage auth.
