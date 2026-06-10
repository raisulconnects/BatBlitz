# BatBlitz — Game Design Document

## Overview
BatBlitz is a turn-based browser cricket game built with vanilla HTML, CSS, and JavaScript. It includes automated unit tests with Jest and uses the Web Audio API for sound effects.

## Architecture

### Files
| File | Purpose |
|------|---------|
| `index.html` | All screens: menu, mode-select, about, toss, choice, play (with ball log), result, and event modal |
| `style.css` | Full responsive styling with animations, two-column play layout, mode cards, ball log panel |
| `script.js` | UI logic: menu flow, toss, innings, rendering, ball log, modals |
| `game-logic.js` | Pure pure logic: `getBallResult`, `shouldEndInnings`, `getChaseResult`, `determineTossWinner`, `getOppositeRole`, `formatOvers` |
| `sounds.js` | Web Audio API: `playRunSound`, `playBoundarySound`, `playWicketSound`, `playWinSound`, `playChaseSound`, `playButtonSound` |
| `game-logic.test.js` | 72 tests for pure logic |
| `sounds.test.js` | 9 tests for sound functions |

### Test Coverage
- **Total**: 81 tests (72 game-logic + 9 sounds)
- `shouldEndInnings`: 12 tests (6 original + 6 over-limit)
- All other logic functions fully covered

### Game Flow
```
Menu → Mode Select → Toss (RPS) → Choice (bat/bowl) → Play → Result → Menu
```

### Screens
1. **Menu** — Title, "Play" and "About" buttons
2. **Mode Select** — Quick Match / T20 / Test Match cards
3. **About** — Description and credits
4. **Toss** — Rock Paper Scissors vs AI
5. **Choice** — Choose bat or bowl (only if user wins toss)
6. **Play** — Two-column layout (game left, ball log right)
7. **Result** — Final scores with confetti on win
8. **Event Modal** — Overlay for toss result, innings end, chase complete, wicket

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
- Scoreboard (current score, target, previous innings)
- Ball history dots (colored circles)
- Chase info banner
- Status message
- Last ball with flash animation
- Ball grid (buttons 1–6)
- Commentary area

### Right Panel (`play-right`)
- Ball Log panel with scroll
- Each entry: colored dot + ball number + description
- Cleared between innings

## Sound System (`sounds.js`)
6 sound effects generated via Web Audio API:
- `playRunSound` — short beep
- `playBoundarySound` — ascending tone
- `playWicketSound` — low buzz
- `playWinSound` — triumphant chord
- `playChaseSound` — alert
- `playButtonSound` — click

All controlled by `soundEnabled` toggle.

## UI Features
- **CSS Animations**: Flash effects on last ball (runs/four/six/out), modal entrance scale
- **Canvas Confetti**: On player win (result screen)
- **Ball History Dots**: Colored circles for last 12 balls
- **Commentary**: Last 3 ball descriptions
- **Ball Log**: Full per-ball scrollable log in right panel
- **Mobile Responsive**: Stacks to single column on small screens
- **Touch Mitigation**: Hover effects disabled on touch devices

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
- No runtime frameworks
- Jest for testing
- `window.confetti` from CDN
- All sounds are procedurally generated (no audio files)
- `shouldEndInnings` signature: `(wickets, wicketsLimit, balls?, ballsLimit?)`
- `shouldEndInnings` is called for both innings; Innings 2 overs limit is checked there before `getChaseResult`
