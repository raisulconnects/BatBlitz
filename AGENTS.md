# AI Development Rules

## Project Memory

- Maintain `GAME_DESIGN.md` at all times.
- Before starting any task, read `GAME_DESIGN.md`.
- After completing any task, update `GAME_DESIGN.md`.
- Record:
  - Current game systems
  - Architecture decisions
  - Feature status
  - Known bugs
  - Technical debt
  - Important implementation details
  - Current priorities

## Planning

- Before implementing a feature, analyze existing code.
- Reuse existing systems whenever possible.
- Do not create duplicate functionality.
- If a similar system already exists, extend it rather than creating a new one.
- Create a short implementation plan before major changes.

## Code Quality

- Keep code modular and reusable.
- Follow existing project patterns.
- Avoid copy-pasted code.
- Refactor duplicated logic into shared utilities, components, managers, or systems.
- Keep files focused on a single responsibility.
- Remove dead code when safe.
- Prefer clarity over cleverness.

## Testing

- Every new feature must include tests.
- Every bug fix must include a regression test when possible.
- Update existing tests when behavior changes.
- Run the full test suite after every completed task.
- Do not consider a task complete if tests fail.
- Fix broken tests before moving on.

## Game Development Rules

- Consider performance before introducing new systems.
- Avoid unnecessary per-frame allocations.
- Avoid unnecessary Update/Tick loops.
- Reuse existing assets and systems when appropriate.
- Keep gameplay systems data-driven when possible.
- Preserve save-file compatibility unless explicitly approved to break it.

## Documentation

- Document public APIs and complex systems.
- Update documentation when behavior changes.
- Record major architecture decisions in `GAME_DESIGN.md`.

## Bug Prevention

- Check for edge cases.
- Check for null/invalid states.
- Verify multiplayer/network interactions if applicable.
- Verify save/load functionality if affected.
- Verify UI updates correctly reflect game state.

## Git

- Always ask before making any commit or push.
- Do NOT commit or push unless the user explicitly says to.

## Before Finishing Any Task

1. Verify implementation works.
2. Run all tests.
3. Fix warnings related to modified code.
4. Update `GAME_DESIGN.md`.
5. Review for duplicated logic.
6. Review for performance concerns.
7. Summarize changes made.
