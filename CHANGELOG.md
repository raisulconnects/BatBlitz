# Changelog

All notable changes to BatBlitz are documented here.

## Version 1.5.0

- Heads & Tails toss mode — new toss option alongside Rock Paper Scissors, selectable from Settings
- Settings modal — volume mute toggle and toss mode selector, accessible from main menu
- Sound toggle removed from header — volume now controlled via Settings modal
- `determineTossWinnerHT` added to game-logic.js — pure function for heads/tails coin toss logic
- Settings and toss mode persisted to localStorage (`batblitz-toss-mode`, `batblitz-sound`)
- Toss screen dynamically updates between RPS and H&T button sets based on selected mode

## Version 1.4.0

- Innings end red overlay effect — radial red gradient full-screen overlay, 'OUT!' text with GSAP bounce-in, wicket confetti burst, strong screen shake, chase sound. Game phase set to 'transition' to disable buttons during the effect, modal appears after 1.2s delay.

## Version 1.3.0

- How to Play modal — comprehensive game guide with icons: game modes (Quick/T20/Test), batting and bowling instructions, match flow explanation, keyboard controls. Launched from new menu button.
- Role indicator now clears correctly when leaving play screen — calls updateRoleIndicator() from showScreen() so badge resets on any screen transition

## Version 1.2.0

- Role indicator badge in header — shows '🏏 BATTING' (green) or '⚾ BOWLING' (red) next to BatBlitz title, updates with GSAP bounce animation on role change
- Status display simplified — removed 'YOU ARE BATTING/BOWLING' from status area since header badge now shows the role
- Text selection disabled globally — user-select: none applied to all elements for cleaner UI

## Version 1.1.0

- Century milestone effect — golden radial gradient full-screen overlay, 'CENTURY!' text with GSAP bounce, golden confetti cascade, strong screen shake
- Half-century milestone effect — blue/silver radial gradient overlay, 'FIFTY!' text with GSAP bounce, blue confetti burst, moderate screen shake
- Wicket glassmorphism effect — red glass overlay on scoreboard with pulsing shadow and border highlight, auto-fades after 800ms
- Milestone tracking — game.milestones object prevents repeated triggering of fifty/hundred celebrations

## Version 1.0.0

- Ball log panel no longer shows duplicate empty message when entries exist
- Back button added to toss screen for returning to mode selection
- Changelog now loads dynamically from a JSON file for easy updates
- General bug fixes and UI polish across all screens

## Version 0.4.0

- Keyboard shortcuts — number keys 1–6 to play, Escape to dismiss modals
- Exit confirmation dialog to prevent accidental match abandonment
- Quick rematch from the result screen — returns to toss with the same mode
- Sound preference saved to localStorage and restored across sessions
- Ball button disable states prevent input during modals, wrong phases, or before innings start
- Collapsible ball log panel — toggle visibility during play
- Collapsible commentary feed — toggle visibility during play

## Version 0.3.0

- 8-bit procedural sound effects — distinct sounds for runs, boundaries, sixes, wickets, and match events
- GSAP-driven screen transitions, modal entrance, and scoreboard update animations
- Particle effects via tsParticles — confetti shower on victory, burst effects for sixes, boundaries, and wickets
- Flash animations on the last ball display — color-coded for runs, fours, sixes, and wickets
- Ball-by-ball history with colored glow dots
- AI thinking delay (300–400ms) before revealing ball results
- Dark neon aesthetic with glassmorphism panels and CRT scanline overlay
- Glitch-text logo animation on the main menu
- Responsive two-column layout supporting mobile and landscape orientations

## Version 0.2.0

- Full two-innings chase format: Team 1 bats and sets a target, Team 2 chases
- Rock-Paper-Scissors toss with tie auto-retry — AI re-picks until a winner is decided
- Choice to bat or bowl first after winning the toss
- Three match formats: Quick Match (1 wicket), T20 (10 wickets, 20 overs), Test (10 wickets, unlimited)
- Live scoreboard with score, wickets, overs, and target display
- Chase information banner showing runs required to win
- Ball log panel with scrollable entries and staggered fade-in animation
- Commentary feed showing the last three balls with pick details and results

## Version 0.1.0

- Ball-by-ball number matching mechanic (1–6) — matching numbers result in wickets, differences score runs
- Single-innings quick match format with AI opponent
- Foundational sound effects via Web Audio API
- Basic visual layout and styling
