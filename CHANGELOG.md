# Changelog

All notable changes to BatBlitz are documented here.

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
