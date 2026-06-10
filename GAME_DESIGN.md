# 🏏 Cricket Game — Design Document

## Overview

A browser-based 2-player (User vs AI) cricket game built with vanilla HTML, CSS, and JavaScript. The game follows a simplified version of real cricket rules with a chase format. Designed for extensibility — animations, sounds, images, and advanced modes can be added later without rewriting core logic.

---

## 1. Game Flow (Phase Machine)

```
[TOSS] → [CHOICE] → [INNINGS 1] → [INNINGS 2] → [RESULT]
```

| Phase | Description |
|---|---|
| `toss` | Single round of Rock-Paper-Scissors. Winner advances to choice. |
| `choice` | Toss winner chooses to **Bat** or **Bowl** first. |
| `play` | Active innings. Ball-by-ball gameplay. |
| `result` | Match over. Winner declared. "Play Again" available. |

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
- Result text: "You won!" / "AI won!"
- Auto-advances to choice phase.

### 4.2 Choice Screen (only for toss winner)
- Heading: "You won the toss! Choose:"
- Two buttons: **Bat** 🏏 | **Bowl** ⚾
- After picking → game transitions to `play` phase.

### 4.3 Play Screen (Innings)
```
┌──────────────────────────────────────┐
│          SCOREBOARD                   │
│    You: 45/1 (7.3 ov)               │
│    AI:  0/0  (0.0 ov)               │
│    Target: — (shown in innings 2)    │
├──────────────────────────────────────┤
│       CURRENT SITUATION              │
│  "You are batting. Pick a number!"   │
│  "Last ball: You picked 4, AI 3 → 4 runs" │
├──────────────────────────────────────┤
│      BUTTONS:  1  2  3  4  5  6      │
└──────────────────────────────────────┘
```

### 4.4 Result Screen
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
};
```

### Ball History (for future stats/animations)
```js
const ballHistory = [
  // { innings: 1, batter: 'user', batterPick: 4, bowlerPick: 3, runs: 4, isOut: false },
  // { innings: 1, batter: 'user', batterPick: 2, bowlerPick: 2, runs: 0, isOut: true  },
];
```

---

## 6. Architecture — Logic / DOM Separation

The game is split into two layers:

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

Handles game state (`game` object), user interaction (button clicks), DOM rendering, and random number generation. Calls the pure functions from `game-logic.js` for all rule decisions.

```
User Click → script.js → game-logic.js (pure) → result → script.js → DOM update
```

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

**Total: 66 tests**

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
├── style.css             # Styling (basic, no animations yet)
├── game-logic.js         # Pure logic functions (no DOM) — shared by browser & tests
├── script.js             # DOM glue — calls game-logic.js functions, handles UI
├── game-logic.test.js    # Jest test suite (66 tests)
├── package.json          # npm config, test runner
├── .gitignore            # ignores node_modules/
├── start.bat             # double-click to launch local server
├── GAME_DESIGN.md        # This document
└── AGENTS.md             # AI agent development rules
```

---

## 11. Extensibility Points (Future Versions)

| Feature | How to Add |
|---|---|
| **Multiple wickets (10)** | Change `config.wicketsLimit` from 1 → 10. No logic change. |
| **Overs limit (T20/ODI)** | Set `config.maxOvers`. Check before each ball. |
| **Wide balls / No balls** | Add extra random outcome to bowling. Add penalty runs + extra ball. |
| **Animations** | CSS keyframes on ball result display. |
| **Sound effects** | `Audio` objects triggered on events (runs, wicket, win). |
| **Player names / teams** | Add input fields before toss. |
| **Statistics display** | Use `ballHistory` to render batting/bowling averages, run rate, etc. |
| **Match history** | Save completed matches to `localStorage`. |
| **Difficulty levels** | Adjust AI randomness — e.g., AI more likely to match user's frequent picks. |
| **Powerplay / Field settings** | Add bonuses/penalties based on field configuration. |
| **Mobile responsive** | Media queries + larger tap targets. |

---

## 12. Technical Constraints & Conventions

- **No external runtime libraries** — pure vanilla JS, no frameworks (dev-only: Jest for testing).
- **No comments in code** unless absolutely required.
- **CSS class names**: `kebab-case`.
- **JS variables/functions**: `camelCase`.
- **File encoding**: UTF-8.
- **Game state** driven by `game.phase` — UI re-renders based on phase transitions.
- **No routing** — single page, all state managed via DOM manipulation.
