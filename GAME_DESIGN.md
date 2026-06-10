# 🏏 Cricket Game — Design Document

## Overview

A browser-based 2-player (User vs AI) cricket game built with vanilla HTML, CSS, and JavaScript. The game follows a simplified version of real cricket rules with a chase format. Designed for extensibility — animations, sounds, images, and advanced modes can be added later without rewriting core logic.

---

## 1. Game Flow (Phase Machine)

```
[TOSS] ─┬─→ [TIE MODAL] ─→ [TOSS]
         ├─→ [WIN MODAL] ─→ [CHOICE] ─→ [INNINGS 1]
         └─→ [LOSE MODAL] ─→ [INNINGS 1]

[INNINGS 1] ──→ [WICKET MODAL] ──→ [INNINGS 2]

[INNINGS 2] ─┬─→ [CHASE WIN MODAL] ──→ [RESULT]
              └─→ [WICKET/LOSE MODAL] ─→ [RESULT]
```

| Phase | Description |
|---|---|
| `toss` | Single round of Rock-Paper-Scissors. Opens modal with result. |
| `choice` | Toss winner chooses to **Bat** or **Bowl** first. |
| `play` | Active innings. Ball-by-ball gameplay. Opens modal on wicket/chase end. |
| `result` | Match over. Winner declared. "Play Again" button resets to toss. |

**Modal overlay**: At key events (toss result, wicket, chase complete), a fullscreen modal pauses the game. User clicks "Continue" to proceed. This prevents users from missing important moments.

---

## 2. Core Mechanics (Per Ball)

### Batting
- Batter picks a number **1–6** via UI buttons.
- This number = **runs scored** if not out.

### Bowling
- Bowler's number is **randomly generated 1–6** by the AI.
- The bowler (User or AI depending on who is bowling) picks/gets a number.

### Wicket Condition
- **If batter's number == bowler's number** → Batter is **OUT**.
- **Innings ends** when wickets reach the limit (currently `1`, configurable).

### Scoring
- If **not out**: `runs += batter's number`.
- If **out**: no runs added for that ball. Innings ends.

---

## 3. Match Format — Chase

### Innings 1
- Team A (batting) scores as many runs as possible until `wicketsLimit` is reached.
- Score becomes the **target** for Team B.

### Innings 2
- Team B (batting) chases the target.
- **If Team B's score exceeds the target** before being all out → **Team B wins**.
- **If Team B is all out before reaching/exceeding the target** → **Team A wins**.
- **If scores are equal** → **Draw / Tie**.

### Example Playthrough

> **Toss**: User wins → Chooses to Bat.
>
> **Innings 1 (User bats, AI bowls)**:
> - Ball 1: User picks `4`, AI rolls `3` → 4 runs (Score: 4/0)
> - Ball 2: User picks `2`, AI rolls `2` → **OUT!** (Score: 4/1)
> - **Target = 4**
>
> **Innings 2 (AI bats, User bowls)**:
> - Ball 1: AI rolls `5`, User bowls `3` → 5 runs (AI: 5/0 → **AI wins!**)
>
> **OR**
>
> - Ball 1: AI rolls `5`, User bowls `3` → 5 runs (AI: 5/0)
> - Ball 2: AI rolls `1`, User bowls `1` → **OUT!** (AI: 5/1)
> - Target was 6. AI made 5 < 6 → **User wins!**

---

## 4. UI States & Layout

### 4.1 Toss Screen
- Heading: "Toss — Rock Paper Scissors!"
- Three buttons: Rock 🪨, Paper 📄, Scissors ✂️
- AI choice is random.
- After picking → **event modal** shows the result (win/lose/tie). User clicks "Continue".

### 4.2 Choice Screen (only for toss winner)
- Heading: "You won the toss! Choose:"
- Two buttons: **Bat** 🏏 | **Bowl** ⚾
- After picking → game transitions to `play` phase.

### 4.3 Play Screen (Innings)
```
┌──────────────────────────────────────┐
│          SCOREBOARD                   │
│    You: 45/1 (7.3 ov)   Target: 50  │
│    ○ ○ ○ ● ○ ○  (last 12 balls)     │
│    Need 5 more runs to win           │
├──────────────────────────────────────┤
│       CURRENT SITUATION              │
│  "You are batting. Pick a number!"   │
│  "Last ball: You picked 4, AI 3 → 4 runs" │
├──────────────────────────────────────┤
│      BUTTONS:  1  2  3  4  5  6      │
├──────────────────────────────────────┤
│  Commentary:                         │
│  You picked 4, AI 3 → 4 runs         │
│  You picked 2, AI 5 → 2 runs         │
└──────────────────────────────────────┘
```

- **Ball history**: Colored dots below scoreboard (green=runs, blue=4, orange=6, red=wicket)
- **Chase info**: In innings 2, shows runs needed to win
- **Flash animation**: Last-ball area flashes green/red/blue/orange based on result
- **Commentary**: Last 3 balls shown as text log at bottom

### 4.4 Event Modal (overlays all screens)
A fullscreen modal that pauses game flow at key moments:

| Trigger | Heading | Body | Button |
|---|---|---|---|
| User won toss | `🎉 You Won the Toss!` | Emoji picks | "Choose Bat/Bowl →" |
| AI won toss | `😤 AI Won the Toss!` | Picks + AI's choice | "Start Game →" |
| RPS tie | `🤝 Tie!` | "Pick again" | "OK" |
| Wicket (innings 1 ends) | `🔥 WICKET!` | Final score + target | "Start Innings 2 →" |
| Chase complete (win) | `🎉 Chase Complete!` | Chased target + final score | "See Result →" |
| Wicket (chase fails) | `🔥 WICKET!` | Final score + losing margin | "See Result →" |

### 4.5 Result Screen
- Final scores for both teams
- Winner announcement
- "Play Again" button → resets to toss

---

## 5. Data Model

```js
const game = {
  phase: 'toss',           // toss | choice | play | result

  // Toss
  tossWinner: null,        // 'user' | 'ai'
  userChoice: null,        // 'bat' | 'bowl'
  aiChoice: null,

  // Innings 1 (batting first)
  innings1: {
    battingTeam: null,     // 'user' | 'ai'
    score: 0,
    wickets: 0,
    balls: 0,
    target: null,          // set after innings 1 ends
  },

  // Innings 2 (chasing)
  innings2: {
    battingTeam: null,
    score: 0,
    wickets: 0,
    balls: 0,
  },

  // Current innings reference
  currentInnings: null,    // points to innings1 or innings2
  battingTeam: null,       // 'user' | 'ai'
  bowlingTeam: null,

  // Settings (configurable for future versions)
  config: {
    wicketsLimit: 1,       // change to 10 for full cricket
    maxOvers: null,        // null = unlimited overs
    ballsPerOver: 6,
  },

  // Match result
  result: null,            // 'user' | 'ai' | 'draw'

  // Ball-by-ball history (last 30 balls, for rendering dots + commentary)
  ballHistory: [],
};
```

### Modal Callback (global variable)
```js
let modalCallback = null;  // stored by showModal, consumed by onModalContinue
```

When an event modal is shown, the callback is stored in `modalCallback`. When the user clicks the modal's "Continue" button, `onModalContinue()` runs the stored callback then clears it. During a modal, ball buttons are inaccessible because the overlay captures all clicks.

### Ball History (for future stats/animations)
```js
const ballHistory = [
  // { innings: 1, batter: 'user', batterPick: 4, bowlerPick: 3, runs: 4, isOut: false },
  // { innings: 1, batter: 'user', batterPick: 2, bowlerPick: 2, runs: 0, isOut: true  },
];
```

---

## 6. Architecture — Logic / DOM Separation

The game is split into three layers:

### 6.1 Pure Logic Layer (`game-logic.js`)

Contains **six pure functions** — no DOM access, no side effects, no random. These are tested exhaustively with Jest.

| Function | Input | Output | Purpose |
|---|---|---|---|
| `determineTossWinner(userPick, aiPick)` | `'rock'\|'paper'\|'scissors'` | `'user'\|'ai'\|'tie'\|null` | Decides RPS winner |
| `formatOvers(balls)` | `number` | `string` (`"1.3"`) | Formats ball count to overs display |
| `getBallResult(batterPick, bowlerPick)` | `1–6` | `{ isOut, runs }` | Determines ball outcome |
| `shouldEndInnings(wickets, wicketsLimit)` | `number, number` | `boolean` | Checks if innings is over |
| `getChaseResult(score, target, wickets, wicketsLimit)` | `number, number, number, number` | `'win'\|'lose'\|null` | Checks chase status |
| `getOppositeRole(role)` | `'bat'\|'bowl'` | `'bowl'\|'bat'\|null` | Returns opposing role |

**Dual export**: Functions are available as globals (browser `<script>` tag) and as CommonJS `module.exports` (Jest tests).

### 6.2 DOM Glue Layer (`script.js`)

Handles game state (`game` object), user interaction (button clicks), DOM rendering, random number generation, the event modal system, ball-history tracking, CSS animation triggers, and confetti. Calls the pure functions from `game-logic.js` for all rule decisions.

**Modal system**: Three functions handle all event overlays:
1. `showModal(heading, bodyHTML, buttonText, callback)` — shows the overlay and stores the callback
2. `onModalContinue()` — called by the modal button, runs the stored callback, hides overlay
3. `resetGame()` — also hides the modal if showing during reset

**Animation system**: CSS keyframe animations triggered by JS class toggling:
- `addAnimationClass(el, className)` — removes, force-reflows, then adds a class to restart CSS animation
- Flash classes: `flash-runs` (green), `flash-out` (red), `flash-four` (blue), `flash-six` (orange)
- Ball-history dots rendered from `game.ballHistory` array (max 30 entries)
- Commentary log shows last 3 balls as text

**Data flow with animations**:
```
User Click → script.js → game-logic.js (pure) → result → script.js → update state → render()
                                                                              ↓
                                                                        [DOM update]
                                                                        [class toggle for animation]
                                                                        [sound trigger]
                                                                              ↓
                                                              [event modal?] → wait for Continue → next action
```

### 6.3 Sound Layer (`sounds.js`)

Generates all game sounds programmatically via the Web Audio API — no audio files needed.

| Function | Sound | Trigger |
|---|---|---|
| `playButtonSound()` | Short click beep | Any button press |
| `playRunSound()` | Quick 660Hz tone | Run scored (1-3) |
| `playBoundarySound()` | Two ascending tones | 4 or 6 runs |
| `playWicketSound()` | Descending sawtooth | Wicket falls |
| `playWinSound()` | Ascending arpeggio | Chase complete / match win |
| `playChaseSound()` | Three ascending notes | Innings transition |

**Implementation**: Uses `OscillatorNode` + `GainNode` for each sound. `AudioContext` is created lazily on first call and resumed if suspended (browser autoplay policy). All calls are wrapped in try/catch to silently fail if audio is unavailable.

**Toggle**: Controlled by `soundEnabled` global variable. Toggled by the 🔊/🔇 button in the header.

**Dual export**: Same pattern as `game-logic.js` — globals for browser, `module.exports` for Jest.

---

## 7. Testing

### 7.1 Setup

```
npm install        # installs Jest
npm test           # runs 66 tests
```

### 7.2 Test Coverage (`game-logic.test.js`)

| Module | Tests | What's Covered |
|---|---|---|
| `determineTossWinner` | 12 | All 9 RPS outcomes + invalid input guards |
| `formatOvers` | 12 | Normal values, boundaries (0,6,12), edge cases (NaN, Infinity, null) |
| `getBallResult` | 15 | All 6 match cases, 3 mismatch cases, 5 invalid input guards |
| `shouldEndInnings` | 10 | Boundary crossings, negative/NaN/string/null guards |
| `getChaseResult` | 12 | Win/lose/in-progress, score priority, negative/NaN/null guards |
| `getOppositeRole` | 6 | Both valid roles, 4 invalid input guards |

**Total: 75 tests** (66 original + 9 sound function contract tests)

### 7.3 Adding Tests

1. Add a new pure function to `game-logic.js` (and export it)
2. Import it in `game-logic.test.js`
3. Write tests covering: normal cases, boundary cases, and invalid input guards
4. Run `npm test`

---

## 8. Who Picks What Per Scenario

| Innings | User's Role | User Action | AI Action |
|---|---|---|---|
| User bats, AI bowls | Batter | Picks 1–6 (runs) | Random 1–6 (bowling) |
| AI bats, User bowls | Bowler | Picks 1–6 (bowling) | Random 1–6 (runs) |

**Key rule**: The user **always** clicks a number every ball. The meaning (bat vs bowl) changes based on the innings.

---

## 9. Overs Tracking

- `balls` counter increments every ball.
- `overs` display: `Math.floor(balls / 6) + "." + (balls % 6)`.
- Example: 7 balls = `1.1 ov`, 12 balls = `2.0 ov`.
- No over limit enforced yet (set `config.maxOvers` later).

---

## 10. File Structure

```
/
├── index.html            # All HTML markup
├── style.css             # Styling + animations + responsive
├── game-logic.js         # Pure logic functions (no DOM) — shared by browser & tests
├── sounds.js             # Web Audio API sound generation
├── script.js             # DOM glue — calls game-logic.js + sounds.js, handles UI
├── game-logic.test.js    # Jest test suite (66 tests)
├── sounds.test.js        # Jest test suite (9 tests)
├── package.json          # npm config, test runner
├── .gitignore            # ignores node_modules/
├── start.bat             # double-click to launch local server
├── GAME_DESIGN.md        # This document
└── AGENTS.md             # AI agent development rules
```

---

## 11. Extensibility Points (Future Versions)

| Feature | How to Add | Status |
|---|---|---|
| **Multiple wickets (10)** | Change `config.wicketsLimit` from 1 → 10. No logic change. | ❌ Not started |
| **Overs limit (T20/ODI)** | Set `config.maxOvers`. Check before each ball. | ❌ Not started |
| **Wide balls / No balls** | Add extra random outcome to bowling. Add penalty runs + extra ball. | ❌ Not started |
| **Ball-by-ball history** | Colored dots + commentary rendered from `ballHistory` array | ✅ Done |
| **CSS Animations** | Flash effects on last-ball result, modal entrance animation | ✅ Done |
| **Sound effects** | Web Audio API — 6 sound types, toggle button | ✅ Done |
| **Confetti on win** | CDN `canvas-confetti` package, triggers on win screen | ✅ Done |
| **Mobile responsive** | Media queries, touch optimization, landscape support | ✅ Done |
| **Player names / teams** | Add input fields before toss. | ❌ Not started |
| **Statistics display** | Use `ballHistory` to render batting/bowling averages, run rate, etc. | ❌ Not started |
| **Match history** | Save completed matches to `localStorage`. | ❌ Not started |
| **Difficulty levels** | Adjust AI randomness — e.g., AI more likely to match user's frequent picks. | ❌ Not started |
| **Powerplay / Field settings** | Add bonuses/penalties based on field configuration. | ❌ Not started |

---

## 12. Technical Constraints & Conventions

- **No external runtime libraries** — pure vanilla JS, no frameworks (dev-only: Jest for testing).
- **No comments in code** unless absolutely required.
- **CSS class names**: `kebab-case`.
- **JS variables/functions**: `camelCase`.
- **File encoding**: UTF-8.
- **Game state** driven by `game.phase` — UI re-renders based on phase transitions.
- **No routing** — single page, all state managed via DOM manipulation.
