# 🏏 BatBlitz

A browser-based cricket game built with vanilla HTML, CSS, and JavaScript. Play against an AI opponent in a fast-paced chase format.

## How to Play

1. **Toss** — Play Rock-Paper-Scissors to decide who bats first
2. **Batting** — Pick a number 1–6. If AI's number matches → OUT. Otherwise = runs.
3. **Bowling** — Pick a number 1–6 to try to match AI's batting number. Match = wicket.
4. **Chase** — Both teams bat once. Team 2 chases Team 1's target.

## Features

- 🎲 Rock-Paper-Scissors toss
- 🏏 Bat/Bowl decision after toss win
- 🔥 Animated ball results (flash effects for runs, wickets, boundaries)
- 🎯 Chase mode with required runs display
- ⚡ Ball-by-ball history (colored dots)
- 📖 Commentary log (last 3 balls)
- 🔊 Sound effects (click, runs, wicket, win)
- 🎉 Confetti celebration on win
- 📱 Mobile responsive
- 🧪 75 passing unit tests

## How to Run

### Option 1: Quick start
Double-click `start.bat` then open `http://localhost:8080` in your browser.

### Option 2: Manual
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.

### Run tests
```bash
npm install
npm test
```

## Tech Stack

- **Vanilla HTML/CSS/JS** — no frameworks
- **Web Audio API** — programmatic sound generation
- **canvas-confetti** — confetti on win (CDN)
- **Jest** — unit testing (75 tests)

## File Structure

```
├── index.html            # All HTML markup
├── style.css             # Styling + animations + responsive
├── game-logic.js         # Pure game logic (no DOM)
├── sounds.js             # Web Audio API sound generation
├── script.js             # DOM glue + game state management
├── game-logic.test.js    # 66 logic tests
├── sounds.test.js        # 9 sound contract tests
├── package.json          # npm config
├── start.bat             # Local server launcher
└── GAME_DESIGN.md        # Design document
```

## Future Plans

- 10-wicket innings (full cricket format)
- Over limits (T20/ODI modes)
- Wide balls / No balls
- Player names & team selection
- Match history with localStorage
- Difficulty levels
