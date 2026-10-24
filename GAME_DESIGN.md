# BatBlitz — Game Design Document

## Overview
BatBlitz is a turn-based browser cricket game built with vanilla HTML, CSS, and JavaScript. It includes automated unit tests with Jest and uses the Web Audio API for sound effects.

## Architecture

### Files
| File | Purpose |
|------|---------|
| `index.html` | All screens: menu, mode-select, about, toss, choice, play (with ball log toggle, exit toolbar, keyboard hint, commentary toggle), result (with play-again + menu), event modal. CDN deps: Google Fonts, GSAP, tsParticles-confetti |
| `style.css` | Dark neon theme with glassmorphism, CRT scanline overlay, ~40 CSS animations, two-column play layout, retro typography, responsive, exit-btn, disabled ball buttons, empty states, result-actions |
| `script.js` | UI logic: GSAP-powered transitions, tsParticles confetti, screen shake, score/boundary/six particle effects, ball log stagger, sound persistence (localStorage), keyboard shortcuts (1-6 / Escape), exit confirmation, AI thinking delay, quick rematch, ball button disable states, exported helpers for testing |
| `game-logic.js` | Pure logic: `getBallResult`, `shouldEndInnings`, `getChaseResult`, `determineTossWinner`, `determineTossWinnerHT`, `getOppositeRole`, `formatOvers` |
| `sounds.js` | 8-bit Web Audio API sounds using square/triangle/noise waves: 8 sound functions |
| `game-logic.test.js` | 87 tests for pure logic (includes `determineTossWinnerHT`) |
| `sounds.test.js` | 11 tests for sound functions |
| `ux.test.js` | 112 tests for UX helper functions: `getSavedSoundPreference`, `setSavedSoundPreference`, `getSavedTossMode`, `setSavedTossMode`, `getRunFromKey`, `isPlayBlocked`, `getSavedPlayerName`/`setSavedPlayerName`/`getDisplayName`/`getDisplayNamePossessive`, trophy/currency persistence, `updateTrophiesAndCurrency`, `getInventory`/`setInventory`/`getItemCount`/`addItem`/`useItem`, `activateShield`, `getShieldBarHTML` |
| `ui.test.js` | 152 tests for UI toggles, ball log empty-message fix, toss back button, changelog.json/shop.json validation, milestone effects (century, fifty, wicket glow, innings end), role indicator, user-select CSS, how-to-play modal, HTML button structure, settings modal, Heads & Tails HTML, sound-toggle removal, mode tooltips, player name, responsive CSS, menu stats, result rewards, trophy/currency localStorage keys, `animateRewardCounter`, `showShop`, shield-bar HTML/CSS, shop modal |
| `changelog.json` | Dynamic changelog data consumed by `showChangelog()` |
| `shop.json` | Shop item definitions (id, name, description, price, maxPerMatch, icon) consumed by `showShop()` |
| `CHANGELOG.md` | Version history with all notable changes |

### External Dependencies (CDN)
| Package | Purpose |
|---------|---------|
| Google Fonts: `Press Start 2P` + `VT323` | Retro pixel headings + readable mono body |
| `gsap` (v3.12) | Screen transition slides, scoreboard animate, ball-log stagger, screen shake, modal entrance, button click feedback |
| `tsparticles-confetti` | Rich particle effects: star burst on six, sparkle ring on boundary, red burst on wicket, medal shower on win |

### Test Coverage
- **Total**: 386 tests (87 game-logic + 11 sounds + 112 ux + 152 ui)
- `shouldEndInnings`: 18 tests
- Toss redo loop: 4 tests verifying tie auto-retry always produces non-tie
- `determineTossWinnerHT`: 9 tests covering correct call, wrong call, and edge cases
- UX helpers (`ux.test.js`): 112 tests across 25+ functions with edge case coverage including trophy/currency persistence, `updateTrophiesAndCurrency` delta calculations, streak tracking, W/L/D counters, `getSavedPlayerName`/`setSavedPlayerName`/`getDisplayName`/`getDisplayNamePossessive`, `getInventory`/`setInventory`/`getItemCount`/`addItem`/`useItem`, `activateShield`, `getShieldBarHTML`
- UI toggles (`ui.test.js`): 152 tests covering ball log/commentary toggles, empty message removal, toss back button structure, changelog.json/shop.json format validation, milestone effects, role indicator, user-select CSS, how-to-play modal, HTML button structure, settings modal, Heads & Tails HTML, sound-toggle removal, mode tooltips, player name UI, responsive CSS, menu stats, result rewards, trophy/currency localStorage keys, animateRewardCounter, `showShop`, shield-bar HTML/CSS, shop modal CSS
- All other logic functions fully covered

### Game Flow
```
Menu → Mode Select → Toss (RPS or Heads & Tails) → Choice (bat/bowl) → Play → Result → Menu
Settings and Shop accessible from Menu at any time
```

### Screens
1. **Menu** — Glitch-text logo, HUD-style stats bar (🏆 trophies, 🪙 coins, W/L/D record with GSAP counter animation), neon "PLAY" button, SHOP button (🛒), About button, CHANGELOG button (inside About), SETTINGS button, selected mode label
2. **Mode Select** — Three glassmorphism cards (Quick/T20/Test) with hover glow
3. **About** — Description and credits
4. **Toss** — Rock Paper Scissors OR Heads & Tails (configurable in Settings), with hover scale + AI reveal sound. Toss screen dynamically shows RPS buttons or HT buttons based on `tossMode` setting.
5. **Choice** — Two neon "BAT" / "BOWL" buttons (green/red accent)
6. **Play** — Two-column layout (game left, ball log right) with stadium scoreboard, exit toolbar
7. **Result** — Animated score cards + tsParticles confetti burst on win + play again buttons
8. **Event Modal** — GSAP slide-down entrance, glassmorphism dark panel, dual buttons for confirm/cancel

## Game Modes

| Mode | Wickets | Max Overs |
|------|---------|-----------|
| Quick Match | 1 | Unlimited |
| T20 | 10 | 20 |
| Test Match | 10 | Unlimited |

Data model in `game.config`: `{ wicketsLimit, maxOvers, ballsPerOver }`

## Core Logic (`game-logic.js`)

### `getBallResult(batterPick, bowlerPick)`
Returns `{ isOut, runs }`. Out if picks match, otherwise runs = absolute difference.

### `shouldEndInnings(wickets, wicketsLimit, balls?, ballsLimit?)`
Returns true when:
- `wickets >= wicketsLimit`, or
- `balls >= ballsLimit` (if `ballsLimit` is not null/undefined)
Returns false for invalid inputs (negative, NaN, non-finite).

### `getChaseResult(currentScore, target, currentWickets, wicketsLimit)`
- `'win'` if `currentScore >= target`
- `'lose'` if `currentWickets >= wicketsLimit` (all out before reaching target)
- `null` otherwise (innings still in progress)

### `determineTossWinner(userPick, aiPick)`
Returns `'user'`, `'ai'`, or `'tie'`.

### `determineTossWinnerHT(call, result)`
Returns `'user'` if call matches coin result, `'ai'` otherwise, or `null` for invalid inputs.

### `getOppositeRole(role)`
Returns `'bat'` for `'bowl'` and vice versa.

### `formatOvers(balls)`
Formats as `overs.balls` (e.g., 13 balls → "2.1").

## Play Screen Layout

### Left Panel (`play-left`)
- Exit toolbar (red "✕ EXIT" button)
- Scoreboard (dark panel, neon green score, gold target badge, dimmed previous innings)
- Chase info banner (gold neon)
- Status message (innings + role)
- Last ball with flash animation (green/red/blue/orange highlight)
- Ball grid (buttons 1–6 with hover glow, blue for "4", gold for "6")
- Shield bar (below keyboard hint): shield activation buttons when batting or active shield indicator with green pulsing glow
- Keyboard hint ("[1-6] to bat/bowl · [ESC] to close")
- Commentary toggle row (chevron icon + label, collapses/expands the feed)
- Commentary area (dimmed monospace, collapsible, with empty state)

### Right Panel (`play-right`)
- Ball Log panel with collapsible header toggle button
- Entries container shows ~5 entries with scrollbar, scrolls overflow
- Each entry: colored glow dot + ball number + description
- GSAP staggered fade-in on new entries
- Empty message shown when no balls bowled; auto-removed on first entry

## Sound System (`sounds.js`)
8 8-bit style sound effects generated via Web Audio API:
| Function | Wave | Character |
|----------|------|-----------|
| `playButtonSound` | Square 800Hz, 40ms | Sharp click |
| `playRunSound` | Square sweep 440→880Hz | Classic jump |
| `playBoundarySound` | Square arpeggio (C-E-G) | Ascending chord |
| `playSixSound` | Square arpeggio (C-E-G-C octave) | Triumphant |
| `playWicketSound` | Triangle sweep 300→100Hz + noise | Sad trombone |
| `playWinSound` | Square arpeggio (C-D-E-G-C) | Victory fanfare |
| `playChaseSound` | Square arpeggio (A-C-E) | Urgent alert |
| `playTossRevealSound` | Triangle arpeggio (E-A-C-E) | Reveal jingle |

All controlled by `soundEnabled` toggle.

## UI/UX Features

### Theme
- **Colors**: Dark `#0a0f0a` background, neon green `#39ff14` accents, cricket red `#ff3333`, gold `#ffd700`
- **Glassmorphism**: `rgba(255,255,255,0.04-0.06)` backgrounds + `backdrop-filter: blur(12px)`
- **Neon glow**: `text-shadow` + `box-shadow` glow effects on all interactive elements
- **CRT overlay**: Fixed scanline pseudo-element with flicker animation (`3s` cycle)

### CSS Animations (40+ keyframes)
| Animation | Trigger |
|-----------|---------|
| `glitch-skew` | Logo on menu screen (continuous) |
| `app-shake` | Wicket event (5 rapid oscillations) |
| `crt-flicker` | CRT overlay (continuous) |
| Flash animations | Last ball highlight (runs/four/six/out) |
| `thinking-pulse` | AI thinking delay modal |
| Button glow | Hover on all buttons |
| Card lift | Hover on mode cards |
| Modal entrance | Via GSAP (slide-down + bounce) |

### Milestone Visual Effects
- **Half-century (50 runs)**: Blue/silver radial gradient full-screen overlay, "🎯 FIFTY!" text with GSAP bounce-in, blue/silver confetti burst (40 + 20 particles), moderate screen shake, `playBoundarySound` jingle. Auto-fades after 2s.
- **Century (100 runs)**: Golden radial gradient full-screen overlay, "🎯 CENTURY!" text with GSAP bounce-in, golden confetti cascade (80 + 40 + 20 particles), strong screen shake, `playSixSound` fanfare. Auto-fades after 2.2s.
- **Wicket**: Red glassmorphism (`backdrop-filter: blur(4px)`) effect applied to the scoreboard element with a pulsing box-shadow and border highlight. Class applied for 800ms via `setTimeout`. Uses CSS animation `wicket-glass-pulse`.
- **Innings End**: Red radial gradient full-screen overlay, "🔥 OUT!" text with GSAP bounce-in, red wicket-style confetti burst (20 particles), strong screen shake, `playChaseSound` alert. Auto-fades after 2.2s. Game phase set to `'transition'` during the effect to disable ball buttons. Modal appears after 1.2s delay.

### GSAP-Powered JS Animations
- **Screen transitions**: Directional slide (`x: ±40`, `opacity`) with `0.3s ease`
- **Scoreboard refresh**: Opacity + y bounce on each update
- **Ball-log entry**: Staggered fade-in (`opacity: 0→1`, `x: -15→0`)
- **Button click**: Scale pulse (`1→0.92→1`, `0.08s`)
- **Screen shake**: `translateX` wiggle (`±6px`, 5 repeats, `0.16s`)
- **Modal entrance**: `y: -50→0` + `scale: 0.9→1` with `back.out(1.7)` ease
- **Result cards**: `y: 30→0` stagger with `0.15s` delay between
- **Century/fifty overlay**: Radial gradient burst scale-up + text bounce-in (`back.out(2.5)`)

### tsParticles Effects
- **Six**: Gold star burst (30 particles, `spread: 90`)
- **Four**: Blue sparkle ring (15 particles, `spread: 60`)
- **Wicket**: Red burst (20 particles, `spread: 45`)
- **Win**: Multi-color confetti shower (200 + 100 particles in sequence)
- **Century**: Golden confetti cascade (80 + 40 + 20 particles in sequence)
- **Fifty**: Blue/silver confetti burst (40 + 20 particles in sequence)

## State (`script.js`)

```js
const game = {
  phase: 'menu',           // menu | mode | about | toss | choice | play | transition | result
  mode: null,              // 'quick' | 't20' | 'test'
  config: {
    wicketsLimit: 1,
    maxOvers: null,
    ballsPerOver: 6
  },
  tossWinner: null,        // 'user' | 'ai'
  userRole: null,          // 'bat' | 'bowl'
  aiRole: null,
  activeShield: null,      // { id: string, remaining: number } | null
  innings1: { battingTeam, score, wickets, balls, target },
  innings2: { battingTeam, score, wickets, balls },
  currentInnings: null,
  lastBall: null,
  ballHistory: [],         // max 30 entries
  result: null,            // 'user' | 'ai' | null
  message: '',
  milestones: {            // tracks which score milestones have triggered
    fifty: false,
    hundred: false,
  },
};
```

## UX Features (script.js helpers)

### Role Indicator
- `.role-indicator` badge in header next to BatBlitz title
- Shows `🏏 BATTING` (green neon) or `⚾ BOWLING` (red neon) during play
- Automatically hides (`.idle`) on menu, toss, choice, and result screens
- Updates with GSAP bounce animation when role changes (innings switch)
- Powered by `updateRoleIndicator()` called inside `render()`
- Tracks previous label via module-level `lastRoleIndicator` to avoid re-animating when nothing changed

### Trophy & Currency System (`script.js`)
Persistent career progression tracked in localStorage:

| Key | Default | Description |
|-----|---------|-------------|
| `batblitz-trophies` | `0` | Career trophy count (goes up/down, min 0) |
| `batblitz-currency` | `0` | Spendable coins (earn-only, min 0) |
| `batblitz-streak` | `0` | Current streak (positive=wins, negative=losses, 0=draw) |
| `batblitz-wins` | `0` | Total career wins |
| `batblitz-losses` | `0` | Total career losses |
| `batblitz-draws` | `0` | Total career draws |

**Reward Table:**

| Outcome | Trophies | Streak Bonus | Currency |
|---------|:--------:|:------------:|:--------:|
| Win | +10 | +2 per streak (max +10 at 5) | 30 (Quick) / 80 (T20) / 120 (Test) |
| Loss | -5 (floor 0) | -1 extra per streak (max -5 at 5) | +5 consolation |
| Draw | +2 | — | +10 |

- **`updateTrophiesAndCurrency(result, mode)`** called in `endGame()` before showing result screen. Calculates deltas, applies streak bonus/penalty, persists all six values, and returns `{ trophiesDelta, currencyDelta, streak, totalTrophies, totalCurrency }` for UI display.
- **Menu stats**: HUD-style glassmorphism card below logo showing 🏆 trophies count, 🪙 coins count, and W/L/D record. GSAP counter animation on each menu visit via `animateMenuStats()`. Record updated via `updateMenuRecord()`.
- **Result rewards**: Two glassmorphism cards (trophies left, coins right) with GSAP-driven counter animation. Delta ticks up/down with `power2.out` easing over 800ms, then a CSS `counter-pop` scale bounce (`1 → 1.3 → 1`) on completion. Streak info (🔥 WIN STREAK / 💔 LOSS STREAK / 🤝 NO STREAK) fades in after trophy counter finishes with a slide-up transition.
- Streak bonus caps at +10 for 5+ consecutive wins. Extra penalty caps at -5 for 5+ consecutive losses.

### Exported Testable Helpers
| Function | Signature | Description |
|----------|-----------|-------------|
| `getSavedSoundPreference` | `() → boolean` | Reads `batblitz-sound` from localStorage, defaults to `true` |
| `setSavedSoundPreference` | `(val) → void` | Writes boolean to `batblitz-sound` in localStorage |
| `getRunFromKey` | `(event) → number|null` | Maps keyboard event to 1-6 or null. Returns null for non-string keys, multi-char keys, or out-of-range |
| `isPlayBlocked` | `(phase) → boolean` | Returns `true` if phase is not `'play'` (ball buttons disabled) |
| `toggleBallLog` / `getBallLogVisible` | `→ boolean` | Toggles ball log panel collapsed state; getter returns current visibility |
| `toggleCommentary` / `getCommentaryVisible` | `→ boolean` | Toggles commentary feed collapsed state; getter returns current visibility |
| `renderBallLog` | `() → void` | Renders latest ball entry into the ball log container; strips empty message first |
| `triggerCentury` | `() → void` | Shows golden full-screen overlay with "CENTURY!" text, golden confetti, screen shake, auto-hides after 2.2s |
| `triggerHalfCentury` | `() → void` | Shows blue full-screen overlay with "FIFTY!" text, blue confetti, screen shake, auto-hides after 2s |
| `triggerWicketGlow` | `() → void` | Adds red glassmorphism class to scoreboard element for 800ms |
| `triggerInningsEnd` | `() → void` | Shows red full-screen overlay with "OUT!" text, wicket confetti, screen shake, auto-hides after 2.2s |
| `triggerParticles` | `(type) → void` | Fires confetti burst by type: six, four, wicket, win, century, fifty |
| `updateRoleIndicator` | `() → void` | Updates header badge to show current role (BATTING/BOWLING) or idle state |
| `game` | `→ Object` | Reference to the global game state object (for test inspection) |
| `getSavedTrophies` / `setSavedTrophies` | `→ number` / `(val) → void` | Persists career trophies to `batblitz-trophies` |
| `getSavedCurrency` / `setSavedCurrency` | `→ number` / `(val) → void` | Persists coins to `batblitz-currency` |
| `getSavedStreak` / `setSavedStreak` | `→ number` / `(val) → void` | Persists streak to `batblitz-streak` |
| `getSavedWins` / `setSavedWins` | `→ number` / `(val) → void` | Persists win counter to `batblitz-wins` |
| `getSavedLosses` / `setSavedLosses` | `→ number` / `(val) → void` | Persists loss counter to `batblitz-losses` |
| `getSavedDraws` / `setSavedDraws` | `→ number` / `(val) → void` | Persists draw counter to `batblitz-draws` |
| `updateTrophiesAndCurrency` | `(result, mode) → Object` | Calculates rewards, persists, returns delta/streak/totals |
| `animateRewardCounter` | `(elementId, delta) → void` | Animates number counter from 0 to delta using requestAnimationFrame |
| `getInventory` | `() → Object` | Parses `batblitz-inventory` from localStorage |
| `setInventory` | `(obj) → void` | Writes inventory to `batblitz-inventory` |
| `getItemCount` | `(id) → number` | Returns quantity of an inventory item |
| `addItem` | `(id, count?) → void` | Adds to inventory quantity |
| `useItem` | `(id) → boolean` | Decrements inventory, returns success |
| `showShop` | `() → void` | Opens shop modal (fetches shop.json) |
| `activateShield` | `(id) → void` | Actives a shield powerup during play |
| `getShieldBarHTML` | `() → string` | Returns shield bar HTML for render() |

## Shop & Inventory System (`script.js`)

### Shop Modal
- Launched via "🛒 SHOP" button in main menu (between PLAY and HOW TO PLAY)
- Uses `showModal()` system with GSAP entrance animation
- Fetches item definitions from `shop.json` (dynamically loaded, like changelog)
- Shows loading state while fetching, error state on failure
- Renders each item as a `.shop-item` row with icon, name, description, price, and owned count
- Price displayed as coin amount or "—" when price is 0 (to be set later)
- Dismissed via "GOT IT" confirm button

### Inventory (`localStorage`)
Persistent inventory tracked in localStorage key `batblitz-inventory`:

| Key | Type | Description |
|-----|------|-------------|
| `batblitz-inventory` | JSON string `{ itemId: count }` | Maps item IDs to quantity owned |

**Helper functions:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `getInventory` | `() → Object` | Parses `batblitz-inventory` from localStorage, defaults to `{}` |
| `setInventory` | `(obj) → void` | Writes inventory object to `batblitz-inventory` |
| `getItemCount` | `(id) → number` | Returns quantity of a specific item (0 if not found) |
| `addItem` | `(id, count?) → void` | Adds `count` (default 1) to item's quantity |
| `useItem` | `(id) → boolean` | Decrements item count by 1, returns `true` if had stock |

### Powerup Items (`shop.json`)

| ID | Name | Icon | Protection | Price |
|----|------|:----:|:----------:|:-----:|
| `shield-1` | Bat Shield | 🛡️ | 1 ball | TBD (0) |
| `shield-2` | Reinforced Bat Shield | 🔰 | 2 balls | TBD (0) |

### Shield Activation (In-Match)
- When batting, if player has shields in inventory and no shield is active, a `.shield-bar` appears with shield button(s)
- Each button shows icon, name, and owned count (e.g. "🛡️ Bat Shield (2)")
- Clicking a shield button:
  1. Calls `useItem(id)` to decrement inventory (consumed on activation)
  2. Sets `game.activeShield = { id, remaining: charges }` where charges = 1 for `shield-1`, 2 for `shield-2`
  3. Shield bar updates to show "🛡️ Bat Shield active (1 ball)" with green pulsing glow
- Shield bar renders via `getShieldBarHTML()` inside `render()`
- Shield bar hidden when bowling, when no shields owned, or when `game.phase !== 'play'`

### Shield Logic (`playBall()`)
- After `getBallResult()` but before out processing:
  1. If `game.activeShield` is set and `result.isOut` is `true`:
     - `result.isOut` set to `false` (negates the dismissal)
     - `shieldSaved = true`
     - `game.activeShield.remaining--` decrements remaining charges
     - If remaining reaches 0, `game.activeShield` set to `null`
  2. Shield-saved ball:
     - No runs added (it was a wicket ball)
     - Status message shows "🛡️ Bat Shield saved you!" or "🛡️ Reinforced Shield saved you!"
     - No wicket sound, wicket particles, or screen shake
     - Shield-saved flag recorded in ball history entry (`.shieldSaved`)
- Shield persists across balls until all charges are consumed (remaining reaches 0)

- **Volume mute toggle**: Toggles `soundEnabled` on/off. When muted (`OFF`), no sound functions are called anywhere in the game. Persisted to `batblitz-sound` in localStorage.
- **Toss mode selector**: Switches between `'rps'` (Rock Paper Scissors) and `'ht'` (Heads & Tails) toss modes. Persisted to `batblitz-toss-mode` in localStorage.
- Settings modal is the new home for volume control (removed from header sound toggle button).
- Both settings are clickable rows with icon, label, and value display. Clicking toggles the setting and refreshes the modal body.
- Exported testable functions: `showSettings`, `toggleVolume`, `toggleTossMode`, `getSavedTossMode`, `setSavedTossMode`

### Keyboard Shortcuts
- **Keys `1`–`6`**: Play ball (batting) or bowl (bowling) + no modal open
- **`Escape`**: Close event modal (if open)
- Won't fire if modal is showing or phase isn't `'play'`

### Exit Confirmation
- Red "✕ EXIT" button in play screen toolbar
- Shows confirmation modal: "Are you sure? All progress will be lost."
- "YES, EXIT" → `resetGame()` → returns to menu
- "CANCEL" → just closes modal (no-op)

### Quick Rematch
- Result screen has two buttons: "▶ PLAY AGAIN" and "← MENU"
- "PLAY AGAIN" reuses current mode and goes straight to toss screen
- "← MENU" resets everything and goes to menu

### AI Thinking Delay
- `showModalAfterDelay()` shows an empty modal with "..." button for 300-400ms before revealing the actual result
- Builds tension for toss results, innings endings, and chase completions

### Ball Button Disable States
- `updateBallButtons()` adds/removes `.disabled` class on ball buttons:
  - Disabled during modal (phase check)
  - Disabled on non-play screens
  - Disabled before innings start (no `currentInnings`)
- Disabled buttons have `opacity: 0.35` + `pointer-events: none`
- **Enabled both when user is batting AND bowling** (fixed bug where bowling was blocked)

### Empty States
- Commentary area shows "Commentary will appear here" when no balls bowled
- Ball log shows "No balls bowled yet" when empty
- Cleared and reset on new innings

### Collapsible Panels
- **Ball log** (right panel): Toggle button in the header collapses/expands the entries section with CSS transitions (`max-height` + `opacity` animation)
- **Commentary feed** (below number pad): Toggle row with chevron icon collapses/expands the commentary area with smooth CSS animation
- Both states persist to localStorage (`batblitz-balllog`, `batblitz-commentary`) and restore on page reload
- Exported testable functions: `toggleBallLog`, `toggleCommentary`, `getBallLogVisible`, `getCommentaryVisible`

### How to Play Modal
- Launched via "📖 HOW TO PLAY" button in the main menu
- Uses the existing modal system with `showModal()` and GSAP entrance animation
- Content organized into 5 tabbed/carded sections:
  1. **Game Modes** — three mini-cards (Quick/T20/Test) with accent colors, wickets, and over limits
  2. **How to Bat** — numbered steps with check/cross icons explaining the pick mechanic
  3. **How to Bowl** — same structure as batting with red wicket highlight
  4. **Match Flow** — toss → innings 1 (set target) → innings 2 (chase)
  5. **Controls** — keyboard shortcuts (1-6, ESC)
- Styled with `.howto-content` (scrollable max-height), `.howto-section` cards, `.howto-modes` flex grid, `.howto-rule` rows with icon prefix
- Dismissed via "GOT IT" confirm button

### Sound Persistence
- Initial value read from `localStorage.getItem('batblitz-sound')`
- Written on every toggle via `setSavedSoundPreference()`
- Withstands page refresh

## Innings Rules
- Innings 1 ends when wickets or overs limit is reached → target set
- Ball log cleared between innings
- Innings 2 ends when:
  - Target chased (win)
  - Wickets reached with target not met (loss)
  - Overs limit reached with target not met (loss)
- Innings 2 ending by overs limit is treated as a loss for the chasing team
- `getChaseResult` still based on wickets only (overs limit is checked separately before chase result)

## Technical Notes
- No runtime frameworks (vanilla JS)
- Jest for testing (151 tests across 4 suites)
- GSAP loaded from CDN for advanced animations
- tsParticles-confetti loaded from CDN for particle effects
- Google Fonts loaded from CDN for retro typography
- All sounds are procedurally generated via Web Audio API (no audio files)
- `window.confetti` from `tsparticles-confetti` replaces old `canvas-confetti`
- CRT overlay is a CSS pseudo-layer with scanlines and flicker animation
- `shouldEndInnings` signature: `(wickets, wicketsLimit, balls?, ballsLimit?)`
- `shouldEndInnings` is called for both innings; Innings 2 overs limit is checked there before `getChaseResult`
- Changelog loaded dynamically from `changelog.json` via `fetch()` on button click
- Ball log entries self-scroll with `overflow-y: auto` after ~5 entries; parent panel has no overflow
- Toggle states persisted to localStorage (`batblitz-balllog`, `batblitz-commentary`)
- `jest-environment-jsdom` installed for DOM-dependent UI tests
