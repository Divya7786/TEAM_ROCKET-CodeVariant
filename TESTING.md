# Testing Guide — The Project Graveyard

This document covers how to run the app, test authentication flows, and verify build/lint tooling.

---

## Local Development

There is no deployed URL configured. Run the app locally:

```bash
npm install     # first time only
npm run dev
```

Vite selects the first available port starting at **5173**. The actual URL is printed in the terminal output, for example:

```
VITE v8.x.x  ready in 90ms
  ➜  Local:   http://localhost:5173/
```

If port 5173 is in use, Vite tries 5174, 5175, etc. Use the URL shown in your terminal.

---

## Routes

This app has no URL-based router. All navigation is state-driven. "Routes" are views controlled by `AppView` state in `src/auth/authContext.tsx`.

| View | When shown |
|---|---|
| **Login page** (`'login'`) | Default on first load (no stored session); after logout |
| **Admin dashboard** (`'admin'`) | After a successful login; or automatically if a stored session is found on load |
| **Main app** (`'app'`) | After navigating from the admin dashboard via **Main Website** |

---

## Demo Credentials

These are the only credentials that work. They are hardcoded in `src/auth/authContext.tsx`.

| Field | Value |
|---|---|
| Email | `admin@graveyard.dev` |
| Alternate username | `admin` |
| Password | `ghost1234` |

The login page shows a clickable demo credentials box — clicking either value auto-fills both fields.

---

## Test Scenarios

### 1. Successful login

1. Open `http://localhost:5173/` (or whatever port Vite assigned).
2. **Expected result:** The Admin Portal login page loads immediately — green-themed, with tombstone decorations and a demo credentials box.
3. Enter `admin@graveyard.dev` and `ghost1234` (or click the green credential values to auto-fill).
4. Click **Sign In to the Crypt**.
5. A spinner appears for ~800ms simulating network delay.
6. **Expected result:** Admin dashboard loads showing project statistics, projects table, and recent activity.

**Result: PASS** ✓ (verified with Playwright automation)

---

### 2. Failed login — wrong credentials

1. Click **Admin** in the navbar.
2. Enter any email/username other than `admin@graveyard.dev` or `admin`.
3. Enter any wrong password.
4. Click **Sign In to the Crypt**.
5. **Expected result:** Red error box appears with the message *"Invalid credentials. Check the demo hints below."* The input borders turn red and the error box shakes.

**Result: PASS** ✓ (verified with Playwright automation)

---

### 3. Unauthenticated access

1. Open `http://localhost:5173/` with no stored session (fresh browser / private window).
2. **Expected result:** The login page loads — NOT the admin dashboard and NOT the main app.
3. Attempting to access the admin dashboard without credentials is impossible — there is no URL or button to bypass the login gate.

**Result: PASS** ✓

> **Note:** Frontend route protection only hides UI. It does not protect data. Anyone with access to the browser console or `localStorage` can inspect the data regardless of auth state. This is expected behavior for a frontend-only demo.

---

### 4. Logout and session behavior

#### Session-only (Remember Me unchecked)

1. Log in without checking Remember Me.
2. Confirm the admin dashboard loads.
3. Close the browser tab.
4. Open a new tab to `http://localhost:5173/`.
5. **Expected result:** The main app loads (session cleared — stored in `sessionStorage` which tab-close clears).

#### Persistent session (Remember Me checked)

1. Log in with **Remember Me** checked.
2. Close and reopen the browser.
3. Open `http://localhost:5173/`.
4. **Expected result:** Admin dashboard loads automatically (session restored from `localStorage`).

#### Logout button

1. While logged in, click **Logout** (in admin topbar or in the main app navbar).
2. **Expected result:** Session is cleared from both `sessionStorage` and `localStorage`. Returns to the **login page**.
3. The admin dashboard is no longer accessible without re-authenticating.

**Result: PASS** ✓ (verified with Playwright automation)

---

### 5. Navigation between admin and main app

1. Log in → land on admin dashboard.
2. Click **Main Website** (top-right of admin dashboard).
3. **Expected result:** Main graveyard app loads. Navbar shows **Admin** and **Logout** buttons.
4. Click **Admin** in the navbar.
5. **Expected result:** Returns directly to admin dashboard (no re-login needed — session is still active).

**Result: PASS** ✓

---

### 6. Responsive layout

#### Desktop (≥ 1024px)
- Login page: card centered on atmospheric background with tombstone decorations.
- Admin dashboard: full-width topbar, stats grid with 6 columns, full projects table.
- Main app: sidebar visible on left, full navbar with all labels.

#### Mobile (≤ 768px)
- Login page: card fills available width, tombstone decorations hidden, all form fields full-width.
- Admin dashboard: topbar wraps, stats grid collapses to 2–3 columns, projects table hides lower-priority columns (score, last updated).
- Main app: sidebar collapses into a mobile drawer, bottom nav bar shown.

**Not verified with automated screenshot testing on mobile.** Manual browser DevTools resize recommended.

---

## Build Commands

| Command | What it does | Last result |
|---|---|---|
| `npm run dev` | Start Vite dev server | ✓ Starts successfully |
| `npm run build` | Type-check (`tsc -b`) then Vite production build | ✓ Clean — no errors |
| `npm run preview` | Serve the `dist/` folder locally | ✓ Works after build |
| `npm run lint` | Run oxlint on all source files | ⚠️ 3 warnings, 0 errors (see below) |
| `npx tsc --noEmit` | Type-check only, no output | ✓ 0 errors |

### Lint warnings (non-blocking, 3 total)

```
src/auth/authContext.tsx:28       warning  react(only-export-components)
  DEMO_CREDENTIALS constant exported from the same file as AuthProvider component.
  Fast-refresh hint only — no runtime impact.

src/components/GhostIntro.tsx:82  warning  react(set-state-in-effect)
  Pre-existing in the original codebase before auth was added.

src/context/GraveyardContext.tsx:605  warning  react(only-export-components)
  Pre-existing in the original codebase before auth was added.
```

All three are fast-refresh or dev-server hints. They do not affect production builds or runtime behavior.

---

## Test Framework

There is **no automated test suite** configured (no Vitest, Jest, or similar). The project uses:

- TypeScript for static type checking (`npm run build` / `npx tsc --noEmit`)
- oxlint for static analysis (`npm run lint`)
- Manual and Playwright-scripted browser testing (used during development, not committed)

To add unit tests: install Vitest (`npm install -D vitest @vitest/ui`) and create test files alongside components.

---

## Build Output (last verified)

```
dist/index.html                            ~1 kB
dist/assets/ghost-mascot-*.png          ~1.44 MB
dist/assets/index-*.css                  ~101 kB  (gzip: ~18 kB)
dist/assets/index-*.js                   ~399 kB  (gzip: ~116 kB)
```

Build time: ~150ms on Apple Silicon.

---

## Known Issues

| Issue | Status |
|---|---|
| No automated test suite | Won't fix for now — manual verification only |
| `react(only-export-components)` lint warning in authContext.tsx | Low priority — fast-refresh hint, no runtime impact |
| Login page tombstone decorations not visible on very small screens (< 380px) | Cosmetic only |
| Admin dashboard projects table columns hidden on mobile | By design — responsive CSS |
