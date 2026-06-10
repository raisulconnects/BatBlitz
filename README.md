# BatBlitz

A turn-based browser cricket game built with vanilla HTML, CSS, and JavaScript. Play quick matches against an AI opponent with full innings, chase mode, and retro neon aesthetics.

## How to Play

1. **Select Mode** — Quick Match (1-wicket), T20 (10 wickets, 20 overs), or Test (10 wickets, unlimited)
2. **Toss** — Win the Rock-Paper-Scissors toss to choose who bats first
3. **Batting** — Pick a number 1–6. If AI's pick matches → OUT. Otherwise = runs (absolute difference).
4. **Bowling** — Pick a number 1–6 to try to match AI's batting pick. Match = wicket.
5. **Chase** — Both teams bat one innings each. Team 2 chases Team 1's target score.

## Features

- Rock-Paper-Scissors toss with tie auto-retry
- Three match formats: Quick, T20, Test
- Full innings + chase system with target display
- Animated ball results (flash effects for runs, fours, sixes, wickets)
- Commentary feed (last 3 balls with pick details) — collapsible
- 8-bit procedural sound effects (Web Audio API)
- GSAP-powered screen transitions + animations
- tsParticles confetti on win + particle effects on sixes, boundaries, wickets
- CRT scanline overlay + glitch logo animation
- Collapsible ball log panel with auto-scroll after ~5 entries
- Keyboard shortcuts (1–6 to play, Escape to close modals)
- Exit confirmation dialog
- Quick rematch from result screen
- Sound toggle with localStorage persistence
- Ball button disable states (prevents play during modals/wrong phase)
- Responsive two-column play layout
- Changelog viewer in main menu (loads from JSON)
- Toss screen back button
- 151 passing unit tests (Jest)

## Quick Start

```bash
python -m http.server 8080
# Open http://localhost:8080
```

Or double-click `start.bat`.

### Run Tests

```bash
npm install
npm test
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI** | Vanilla HTML / CSS with dark neon glassmorphism theme |
| **Animations** | GSAP 3.12 (CDN) — screen transitions, ball log stagger, modal entrance |
| **Particles** | tsParticles-confetti (CDN) — win confetti, six/boundary/wicket effects |
| **Fonts** | Google Fonts: Press Start 2P, VT323 |
| **Sound** | Web Audio API — procedural 8-bit wave generation |
| **Testing** | Jest — 151 unit tests across 4 suites |

## Project Structure

```
├── index.html             # All screens + event modal + CDN deps
├── style.css              # Dark neon theme, glassmorphism, 40+ animations, CRT overlay
├── game-logic.js          # Pure game logic (getBallResult, shouldEndInnings, etc.)
├── sounds.js              # 8 procedural sound functions (Web Audio API)
├── script.js              # DOM glue, state management, UI handlers, exported helpers
├── CHANGELOG.md           # Version history (markdown)
├── changelog.json         # Dynamic changelog data consumed by showChangelog()
├── GAME_DESIGN.md         # Full design document
├── game-logic.test.js     # 78 tests for game logic
├── sounds.test.js         # 11 tests for sound functions
├── ux.test.js             # 30 tests for UX helpers
├── ui.test.js             # 32 tests for UI toggles, ball log fix, changelog JSON
├── package.json           # npm config
├── start.bat              # Local server launcher
└── AGENTS.md              # AI development rules
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.
