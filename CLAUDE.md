# Happy Sad Golf — Project Memory

## What This Is
A Masters-themed mobile-first golf scoring PWA called **Happy Sad Golf**. Instead of traditional stroke-only scoring, the primary mechanic is assigning 😊 (happy) or 😔 (sad) to each hole. Optional stroke counts, per-hole stats, and multi-player are supported. The goal over time: more happy games than sad games.

Live URL: **https://koobicheck-gif.github.io/Happysadgolf/**
GitHub repo: `koobicheck-gif/Happysadgolf`
Dev branch: `claude/happy-sad-golf-app-Oz0FL`

---

## Tech Stack
- **Next.js 14** (App Router, static export `output: 'export'`)
- **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme` in `app/globals.css`)
- **Framer Motion** — animations throughout
- **canvas-confetti** — confetti burst on 😊 tap
- **recharts** — line chart on stats page
- **date-fns** — date formatting
- **localStorage** — all persistence, no backend

### Deploy
- GitHub Actions: `.github/workflows/deploy.yml`
- Builds with `NEXT_PUBLIC_BASE_PATH=/Happysadgolf`, pushes to `gh-pages` branch
- GitHub Pages set to serve from `gh-pages` branch (NOT GitHub Actions environment)
- Triggers on push to `claude/happy-sad-golf-app-Oz0FL` or `main`

---

## Custom Theme Colors (defined in `app/globals.css` `@theme` block)
```
masters-green:       #006747
masters-green-dark:  #004d35
masters-green-light: #e8f5ef
masters-gold:        #C9A84C
masters-cream:       #F5F0E8 (body background)
masters-dark:        #1A2E1A
happy:               #16a34a
happy-light:         #dcfce7
happy-dark:          #14532d
sad:                 #dc2626
sad-light:           #fee2e2
sad-dark:            #7f1d1d
```

---

## Data Model (`types/index.ts`)
```typescript
type EmojiResult = 'happy' | 'sad' | null

interface Hole {
  number: number
  par: number
  strokes?: number
  emoji: EmojiResult
  putts?: number
  fairwayHit?: boolean | null  // null = par 3 N/A
  gir?: boolean
  club?: string
}

type GameResult = 'happy' | 'sad' | 'tie' | 'in-progress'

interface Player {
  id: string
  name: string
  holes: Hole[]
  happyCount: number
  sadCount: number
  totalStrokes?: number
  result: GameResult
  handicapDifferential?: number
}

interface Game {
  id: string
  date: string             // ISO string
  courseName: string
  courseRating?: number    // e.g. 72.1
  slopeRating?: number     // e.g. 113
  holes: Hole[]            // primary player (backwards compat)
  players?: Player[]       // multi-player; index 0 mirrors holes
  totalHoles: 9 | 18
  result: GameResult
  happyCount: number
  sadCount: number
  totalStrokes?: number
  completedAt?: string
  handicapDifferential?: number
}
```

---

## File Structure
```
app/
  layout.tsx              Root layout — SW registration, PWA meta
  globals.css             Tailwind v4 @theme with Masters colors
  manifest.ts             PWA manifest (Next.js App Router API)
  page.tsx                Dashboard — stats banner, game history, bottom nav, install prompt
  stats/page.tsx          Stats page — trend chart, hole heatmap, course breakdown, handicap
  game/new/page.tsx       New game — course search, holes toggle, players, par editor, handicap fields
  play/page.tsx           Hole scoring — emoji buttons, multi-player tabs, stroke counter, hole stats, fire/confetti
  scorecard/page.tsx      Completed game — result hero, share button, per-player tabs, shot stats, scorecard table

components/
  ui/
    MastersHeader.tsx     App header with golf flag, Masters gold title, optional back button
    Button.tsx            Themed button (primary/secondary/ghost/danger)
    Badge.tsx             Happy/Sad/Tie/In-Progress result badge
    BottomNav.tsx         Fixed bottom nav: Home | ⛳ (raised) | Stats
  dashboard/
    StatsBanner.tsx       Masters-green card: happy vs sad tally, happy rate bar, motivational message
    GameCard.tsx          Round history card with emoji strip, badge, mini stats
  game/
    EmojiButton.tsx       Giant animated 😊/😔 button (Framer Motion spring)
    HoleNavigator.tsx     Dot progress bar with emoji per hole
    StrokeCounter.tsx     +/- stroke counter with par/birdie/bogey label
    CourseSearch.tsx      Autocomplete search against COURSES database
    ParEditor.tsx         Per-hole +/- par grid with running total par badge
    PlayerSetup.tsx       Add/remove up to 4 players with color dots
    HoleStatsPanel.tsx    Putts, Fairway Hit, GIR, Club selector
    FireParticles.tsx     🔥/😤 emoji particles rising on 😔 tap
  stats/
    TrendChart.tsx        recharts LineChart — happy % over last 20 games
    HoleHeatmap.tsx       9-col grid colored green/gold/red by hole happiness rate
    CourseBreakdown.tsx   Per-course happy rate table
    HandicapCard.tsx      USGA handicap index display with recent differentials

lib/
  storage.ts              localStorage CRUD for Game[]
  gameUtils.ts            calculateResult, countEmojis, getPlayers, updatePlayerInGame, buildDefaultHoles, generateId
  handicap.ts             calcDifferential, calcHandicapIndex, getDifferentials, attachDifferential
  courses.ts              COURSES[] database (25 courses with pars, course rating, slope), searchCourses()
  defaultPars.ts          DEFAULT_PARS_18, DEFAULT_PARS_9
  notifications.ts        requestNotificationPermission, scheduleReminderIfNeeded, recordPlayed

public/
  sw.js                   Service worker (cache-first offline shell)
  icon.svg                App icon (green background + ⛳)
```

---

## Key Routing
All routes are static (query-param based, no dynamic segments):
- `/` — Dashboard
- `/game/new` — New game setup
- `/play?id=<gameId>` — Active hole scoring
- `/scorecard?id=<gameId>` — Completed game detail
- `/stats` — Stats & trends

---

## Features Implemented
- [x] 😊/😔 per-hole emoji scoring (primary mechanic)
- [x] Optional stroke counts per hole
- [x] 9 or 18 hole support (player chooses)
- [x] Course search (25 famous courses with auto-fill pars, course rating, slope)
- [x] Per-hole par editing (collapsible +/- grid)
- [x] Multi-player (up to 4, color-coded tabs 🟢🔵🟡🔴)
- [x] Per-hole stats: putts, fairway hit, GIR, club tracker
- [x] Confetti burst on 😊 tap (canvas-confetti, Masters green/gold)
- [x] Fire particles on 😔 tap (Framer Motion emoji animation)
- [x] Haptic feedback (vibrate API — 40ms happy, double-pulse sad)
- [x] Dashboard with all-time happy vs sad tally + motivational message
- [x] Stats page: line chart, hole heatmap, course breakdown, streaks
- [x] USGA Handicap Index (best 8 of last 20 differentials)
- [x] Share scorecard (Web Share API / clipboard fallback + emoji strip)
- [x] PWA: manifest, service worker, install banner, offline support
- [x] 7-day inactivity notification reminder
- [x] Bottom navigation bar (Home / ⛳ / Stats)
- [x] Delete rounds from dashboard
- [x] Resume in-progress rounds

## Not Yet Built (potential future work)
- GPS distance to green
- Photo capture per hole
- Export to PDF scorecard
- Push notifications via service worker
- Cloud sync / user accounts
- Leaderboard / social features
- Watch companion app

---

## Development Commands
```bash
npm run dev          # local dev server (localhost:3000)
npm run build        # production build (static export to /out)
git push -u origin claude/happy-sad-golf-app-Oz0FL  # triggers GitHub Pages deploy
```

## Important Notes
- **Tailwind v4**: Colors defined in `app/globals.css` `@theme {}` block, NOT in `tailwind.config.ts`
- **Static export**: No dynamic route segments — use query params (`/play?id=x`)
- **Backwards compat**: Old single-player games use `game.holes`; multi-player games use `game.players[]` with `game.holes` mirroring `players[0].holes`
- **basePath**: Set via `NEXT_PUBLIC_BASE_PATH=/Happysadgolf` env var at build time
- **GitHub Pages**: Deploys to `gh-pages` branch via `peaceiris/actions-gh-pages@v4` (NOT the Actions environment — avoids branch protection rules)
