# BatBlitz — Game Design Document

## Overview
BatBlitz is a turn-based browser cricket game built with vanilla HTML, CSS, and JavaScript. It includes automated unit tests with Jest and uses the Web Audio API for sound effects.

## Architecture

### Files
| File | Purpose |
|------|---------|
| `index.html` | All screens: menu, mode-select, about, toss, choice, play (with ball log), result, event modal. CDN deps: Google Fonts, GSAP, tsParticles-confetti |
| `style.css` | Dark neon theme with glassmorphism, CRT scanline overlay, ~40 CSS animations, two-column play layout, retro typography, responsive |
| `script.js` | UI logic: GSAP-powered transitions, tsParticles confetti, screen shake, score/boundary/six particle effects, ball log stagger animation |
| `game-logic.js` | Pure logic: `getBallResult`, `shouldEndInnings`, `getChaseResult`, `determineTossWinner`, `getOppositeRole`, `formatOvers` |
| `sounds.js` | 8-bit Web Audio API sounds using square/triangle/noise waves: 8 sound functions |
| `game-logic.test.js` | 83 tests for pure logic |
| `sounds.test.js` | 12 tests for sound functions |

### External Dependencies (CDN)
| Package | Purpose |
|---------|---------|
| Google Fonts: `Press Start 2P` + `VT323` | Retro pixel headings + readable mono body |
| `gsap` (v3.12) | Screen transition slides, scoreboard animate, ball-log stagger, screen shake, modal entrance, button click feedback |
| `tsparticles-confetti` | Rich particle effects: star burst on six, sparkle ring on boundary, red burst on wicket, medal shower on win |

### Test Coverage
- **Total**: 85 tests (83 game-logic + 12 sounds)
- `shouldEndInnings`: 18 tests (10 original wicket + 5 over-limit normal + 3 over-limit edge)
- All other logic functions fully covered

### Game Flow
```
Menu → Mode Select → Toss (RPS) → Choice (bat/bowl) → Play → Result → Menu
```

### Screens
1. **Menu** — Glitch-text logo, neon "PLAY" button, About button, selected mode label
2. **Mode Select** — Three glassmorphism cards (Quick/T20/Test) with hover glow
3. **About** — Description and credits
4. **Toss** — Rock Paper Scissors with hover scale + AI reveal sound
5. **Choice** — Two neon "BAT" / "BOWL" buttons (green/red accent)
6. **Play** — Two-column layout (game left, ball log right) with stadium scoreboard
7. **Result** — Animated score cards + tsParticles confetti burst on win
8. **Event Modal** — GSAP slide-down entrance, glassmorphism dark panel

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
- Scoreboard (dark panel, neon green score, gold target badge, dimmed previous innings)
- Ball history dots (colored circles with glow shadows)
- Chase info banner (gold neon)
- Status message (innings + role)
- Last ball with flash animation (green/red/blue/orange highlight)
- Ball grid (buttons 1–6 with hover glow, blue for "4", gold for "6")
- Commentary area (dimmed monospace)

### Right Panel (`play-right`)
- Ball Log panel with custom scrollbar
- Each entry: colored glow dot + ball number + description
- GSAP staggered fade-in on new entries
- Cleared between innings

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
| Button glow | Hover on all buttons |
| Card lift | Hover on mode cards |
| Modal entrance | Via GSAP (slide-down + bounce) |

### GSAP-Powered JS Animations
- **Screen transitions**: Directional slide (`x: ±40`, `opacity`) with `0.3s ease`
- **Scoreboard refresh**: Opacity + y bounce on each update
- **Ball-log entry**: Staggered fade-in (`opacity: 0→1`, `x: -15→0`)
- **Button click**: Scale pulse (`1→0.92→1`, `0.08s`)
- **Screen shake**: `translateX` wiggle (`±6px`, 5 repeats, `0.16s`)
- **Modal entrance**: `y: -50→0` + `scale: 0.9→1` with `back.out(1.7)` ease
- **Result cards**: `y: 30→0` stagger with `0.15s` delay between

### tsParticles Effects
- **Six**: Gold star burst (30 particles, `spread: 90`)
- **Four**: Blue sparkle ring (15 particles, `spread: 60`)
- **Wicket**: Red burst (20 particles, `spread: 45`)
- **Win**: Multi-color confetti shower (200 + 100 particles in sequence)

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
};
```

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
- Jest for testing (85 tests)
- GSAP loaded from CDN for advanced animations
- tsParticles-confetti loaded from CDN for particle effects
- Google Fonts loaded from CDN for retro typography
- All sounds are procedurally generated via Web Audio API (no audio files)
- `window.confetti` from `tsparticles-confetti` replaces old `canvas-confetti`
- CRT overlay is a CSS pseudo-layer with scanlines and flicker animation
- `shouldEndInnings` signature: `(wickets, wicketsLimit, balls?, ballsLimit?)`
- `shouldEndInnings` is called for both innings; Innings 2 overs limit is checked there before `getChaseResult`
