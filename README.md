# The Project Graveyard 👻

> *"Every unfinished idea deserves another life."*

A futuristic, atmospheric developer tool for cataloguing, evaluating, and reviving abandoned projects. Built with React 19, TypeScript, and Vite. All data is stored in the browser's `localStorage` — no backend, no paid APIs, no account required to use the public app.

---

## Overview

The Project Graveyard gives developers a structured place to record why a project was abandoned, score it for revival potential, harvest reusable code from it, and track it if it gets resurrected. It ships with a cinematic ghost intro, three CSS themes, and a drag-and-drop Canvas Protocol for interacting with projects.

An optional **Admin Portal** is included as a frontend-only prototype. It gates an admin dashboard behind a login page. See [Demo Authentication](#demo-authentication) for full details and important security caveats.

---

## Features

| Feature | Description |
|---|---|
| **Digital Graveyard** | Browse all buried projects in grid, list, or canvas view with live search and category filters |
| **Bury a Project** | Record post-mortems: tech stack, completed tasks, blockers, abandonment reason, notes |
| **Canvas Protocol** | Drag-and-drop primary actions — drag cards into fate zones to revive, archive, or delete |
| **Revival Advisor** | Rule-based scoring engine (0–100) with verdicts: REVIVE / REPURPOSE / ARCHIVE |
| **Reuse Engine** | Harvest and manage reusable components, hooks, utilities, and ideas with code viewer |
| **Risen Projects** | Track revived projects with sprint milestones, progress bars, and celebration confetti |
| **Activity Feed** | Chronological audit log of all crypt events |
| **Settings** | Theme picker, profile customization, intro controls, JSON export/import, data reset |
| **Ghost Intro** | Cinematic 2-second intro animation; skippable, replay available, respects `prefers-reduced-motion` |
| **Admin Portal** | Frontend-only demo login → admin dashboard with project stats and management |
| **Three Themes** | Graveyard Dark (default), Ghost Light, Spectral Purple — switchable in navbar |

---

## Technologies

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Plain CSS with custom CSS variables (no CSS framework) |
| Icons | lucide-react |
| Animation | canvas-confetti (milestone celebrations) |
| Linter | oxlint |
| Storage | Browser `localStorage` |
| Auth | Frontend-only demo (see [Demo Authentication](#demo-authentication)) |

No external database, no paid services, no environment variables are required for the base application.

---

## Project Structure

```
src/
├── auth/
│   └── authContext.tsx          # AuthProvider, useAuth hook, demo login logic
├── components/
│   ├── BuryModal.tsx/.css       # Add-project modal
│   ├── GhostIntro.tsx/.css      # Cinematic intro overlay
│   ├── GhostIllustration.tsx    # SVG ghost in hero banner
│   ├── GraveyardCanvas.tsx/.css # Drag-and-drop canvas view
│   ├── MobileNav.tsx/.css       # Bottom nav bar (mobile)
│   ├── Navbar.tsx/.css          # Top navigation bar
│   ├── ProjectDetailsModal.tsx  # Full project detail / edit modal
│   ├── Sidebar.tsx/.css         # Desktop left sidebar
│   └── Toast.tsx                # Notification toasts
├── context/
│   └── GraveyardContext.tsx     # Global state (projects, snippets, settings)
├── data/
│   └── initialData.ts           # Sample projects, snippets, activities
├── pages/
│   ├── ActivityPage.tsx/.css    # Activity feed
│   ├── AdminDashboard.tsx/.css  # Post-login admin view
│   ├── Dashboard.tsx/.css       # Main landing page
│   ├── DigitalGraveyard.tsx/.css# Project grid/list/canvas
│   ├── LoginPage.tsx/.css       # Admin login page
│   ├── ReuseEngine.tsx/.css     # Snippet vault
│   ├── RevivalAdvisor.tsx/.css  # Scoring engine
│   ├── RisenProjects.tsx/.css   # Revived projects tracker
│   └── SettingsPage.tsx/.css    # Settings & preferences
├── types/
│   └── index.ts                 # TypeScript types and interfaces
├── utils/
│   └── revivalEngine.ts         # Revival score calculation logic
├── App.tsx                      # Root component, auth-aware router
├── index.css                    # Global styles, CSS variables, themes
└── main.tsx                     # Entry point
```

---

## Installation

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/Divya7786/TEAM_ROCKET-CodeVariant.git
cd TEAM_ROCKET-CodeVariant

# Install dependencies
npm install
```

---

## Running the Development Server

```bash
npm run dev
```

Vite starts on the first available port starting from **5173**. The URL is printed in the terminal, typically:

```
http://localhost:5173/
```

The app loads directly into the main graveyard — no login required for the public interface.

---

## Build and Preview

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

Output goes to `dist/`. The production build is a static site with no server-side requirements.

---

## Lint

```bash
npm run lint
```

Uses **oxlint**. The project currently produces a small number of warnings (no errors) related to fast-refresh hints in the auth context file. These do not affect functionality.

---

## Demo Authentication

> ⚠️ **This is a frontend-only prototype. It is not production-secure.**
> The credentials are hardcoded in source code. Anyone who reads the source can log in.
> Route protection only hides UI components — it does not protect any data.

### Demo credentials

| Field | Value |
|---|---|
| Email | `admin@graveyard.dev` |
| Username | `admin` |
| Password | `ghost1234` |

These are set in `src/auth/authContext.tsx` in the `DEMO_CREDENTIALS` constant.

### How authentication works

1. The main graveyard app is **publicly accessible** — no login required.
2. An **Admin** button is visible in the top navigation bar.
3. Clicking **Admin** opens the login page.
4. On successful login, the admin dashboard is shown.
5. From the admin dashboard, **Main Website** returns to the public app.
6. **Logout** ends the session and returns to the public app.

### Session persistence

- **Remember Me unchecked** — session is stored in `sessionStorage`. It ends when the browser tab is closed.
- **Remember Me checked** — session is stored in `localStorage`. It persists across browser restarts until logout.

The session object stored contains `email`, `displayName`, `role`, and `loginTime`. The password is **never** stored.

### Login page

The login page (`LoginPage.tsx`) has:
- Email or username field
- Password field with show/hide toggle
- Remember Me checkbox
- Loading state with spinner while authenticating
- Error message with shake animation for invalid credentials
- A clearly labeled demo credentials box with clickable auto-fill values

### Admin dashboard

After login, the admin dashboard (`AdminDashboard.tsx`) shows:
- Session info (email, login time)
- Live project statistics pulled from `GraveyardContext` (real counts from `localStorage`)
- Full projects table sorted by revival score
- Recent activity events
- Quick-action buttons that navigate back to specific sections of the main app
- A prominent security notice explaining the demo-only nature of the auth

---

## Environment Variables

No environment variables are required for the demo. There is no `.env` file.

If you replace demo auth with Supabase, you will need:

```
# .env (never commit this file)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The `.env` file is already listed in `.gitignore` via the `*.local` pattern.

---

## Replacing Demo Auth with Supabase

The full migration guide is in `src/auth/authContext.tsx`. The steps are:

```bash
npm install @supabase/supabase-js
```

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Enable **Email/Password** authentication under Authentication → Providers.
3. Create `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only — never the service-role key).
4. Create `src/lib/supabase.ts`:
   ```ts
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY,
   )
   ```
5. In `src/auth/authContext.tsx`, replace the `login()` body with:
   ```ts
   const { error } = await supabase.auth.signInWithPassword({ email: identifier, password })
   if (error) return { success: false, error: error.message }
   ```
6. Replace the `logout()` body with:
   ```ts
   await supabase.auth.signOut()
   ```
7. Remove all references to `DEMO_CREDENTIALS` and the `SESSION_KEY` localStorage logic.
8. Enable **Row Level Security (RLS)** on any Supabase tables to enforce server-side authorization.
9. **Never put the service-role key in any frontend file.**

---

## Deployment

The app builds to a static `dist/` folder and can be deployed to any static host.

### Netlify / Vercel

```bash
npm run build
# Deploy the dist/ folder
```

Both Netlify and Vercel can auto-deploy from the GitHub repo. Set the build command to `npm run build` and the publish directory to `dist`.

### Manual / Nginx

```bash
npm run build
# Serve dist/ with any static file server
npx serve dist
```

For client-side routing (single-page app), configure your server to serve `index.html` for all routes.

---

## Canvas Protocol

The Canvas Protocol replaces primary action buttons with drag-and-drop interactions. Users drag project cards into fate zones:

| Zone | Action |
|---|---|
| **RESURRECT** | Revives a buried project |
| **REPURPOSE** | Harvests assets then archives |
| **ARCHIVE** | Moves to cold storage |
| **BURN / DELETE** | Permanently deletes (requires a second confirmation drag) |

The Canvas view is accessible from the Digital Graveyard via the grid/list/canvas toggle in the top-right of that page.

---

## Known Limitations

- **Authentication is demo-only.** Frontend route protection hides UI but does not protect data.
- **All data is in `localStorage`.** Clearing browser storage removes all projects. Export your data from Settings before clearing.
- **No multi-device sync.** Data lives only in the browser where it was entered.
- **No real backend.** The app has no API, no database, and no server.
- **Revival scores are rule-based heuristics**, not AI. They are calculated deterministically from project metadata.

---

## Future Improvements

- Replace demo auth with Supabase Auth (email/password + OAuth)
- Add a Supabase database for persistent, cross-device project storage
- Add real-time collaboration via Supabase Realtime
- Export to PDF / Notion
- Public shareable project post-mortems
- GitHub integration to auto-import abandoned repos
