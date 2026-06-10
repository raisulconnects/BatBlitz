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
| `game-logic.js` | Pure logic: `getBallResult`, `shouldEndInnings`, `getChaseResult`, `determineTossWinner`, `getOppositeRole`, `formatOvers` |
| `sounds.js` | 8-bit Web Audio API sounds using square/triangle/noise waves: 8 sound functions |
| `game-logic.test.js` | 78 tests for pure logic |
| `sounds.test.js` | 11 tests for sound functions |
| `ux.test.js` | 30 tests for UX helper functions: `getSavedSoundPreference`, `setSavedSoundPreference`, `getRunFromKey`, `isPlayBlocked` |
| `ui.test.js` | 44 tests for UI toggles, ball log empty-message fix, toss back button, changelog.json validation, milestone effects (century/fifty overlay + wicket glow) |
| `changelog.json` | Dynamic changelog data consumed by `showChangelog()` |
| `CHANGELOG.md` | Version history with all notable changes |

### External Dependencies (CDN)
| Package | Purpose |
|---------|---------|
| Google Fonts: `Press Start 2P` + `VT323` | Retro pixel headings + readable mono body |
| `gsap` (v3.12) | Screen transition slides, scoreboard animate, ball-log stagger, screen shake, modal entrance, button click feedback |
| `tsparticles-confetti` | Rich particle effects: star burst on six, sparkle ring on boundary, red burst on wicket, medal shower on win |

### Test Coverage
- **Total**: 163 tests (78 game-logic + 11 sounds + 30 ux + 44 ui)
- `shouldEndInnings`: 18 tests
- Toss redo loop: 4 tests verifying tie auto-retry always produces non-tie
- UX helpers (`ux.test.js`): 30 tests across 4 functions with edge case coverage
- UI toggles (`ui.test.js`): 44 tests covering ball log/commentary toggles, empty message removal, toss back button structure, changelog.json format validation, milestone effects (triggerCentury, triggerHalfCentury, triggerWicketGlow), game milestones initial state
- All other logic functions fully covered

### Game Flow
```
Menu → Mode Select → Toss (RPS) → Choice (bat/bowl) → Play → Result → Menu
```

### Screens
1. **Menu** — Glitch-text logo, neon "PLAY" button, About button, CHANGELOG button, selected mode label
2. **Mode Select** — Three glassmorphism cards (Quick/T20/Test) with hover glow
3. **About** — Description and credits
4. **Toss** — Rock Paper Scissors with hover scale + AI reveal sound
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
  phase: 'menu',           // menu | mode | about | toss | choice | play | result
  mode: null,              // 'quick' | 't20' | 'test'
  config: {
    wicketsLimit: 1,
    maxOvers: null,
    ballsPerOver: 6
  },
  tossWinner: null,        // 'user' | 'ai'
  userRole: null,          // 'bat' | 'bowl'
  aiRole: null,
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
| `triggerParticles` | `(type) → void` | Fires confetti burst by type: six, four, wicket, win, century, fifty |
| `game` | `→ Object` | Reference to the global game state object (for test inspection) |

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
