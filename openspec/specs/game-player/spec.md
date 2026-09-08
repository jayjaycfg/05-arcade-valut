# game-player Specification

## Purpose

Provides the in-browser play screen with a simulated score/level HUD, pause control, and end-of-game score submission, standing in for real game logic in the MVP.

## Requirements

### Requirement: Simulated scoring
For a game with no bundled real engine, the system SHALL continuously increase the player's score while a play session is active and not paused, and SHALL stop increasing it while paused or after the session ends. For a game with a bundled real engine (see `asteroids-game`), the displayed score SHALL instead reflect that engine's own score state, updated as the engine reports it.

#### Scenario: Score increases during play
- **WHEN** a play session for a game without a bundled engine is active and not paused
- **THEN** the displayed score keeps increasing over time

#### Scenario: Score frozen while paused
- **WHEN** a player pauses an active play session for a game without a bundled engine
- **THEN** the displayed score stops increasing until the player resumes

#### Scenario: Score reflects the real engine (engine-backed game)
- **WHEN** a play session for a game with a bundled engine is active
- **THEN** the displayed score matches the score reported by that engine rather than any simulated counter

### Requirement: Level progression
For a game with no bundled real engine, the system SHALL increase the player's level as their score crosses fixed score thresholds during a session. For a game with a bundled real engine, the displayed level SHALL instead reflect that engine's own level state.

#### Scenario: Level increases with score
- **WHEN** the player's score crosses a level threshold in a game without a bundled engine
- **THEN** the displayed level increases

#### Scenario: Level reflects the real engine (engine-backed game)
- **WHEN** a play session for a game with a bundled engine advances to a new level inside that engine
- **THEN** the displayed level updates to match

### Requirement: Pause and resume
The system SHALL let the player pause and resume an active play session, showing a distinct paused state while paused. For a game with a bundled real engine, pausing SHALL also suspend that engine's update loop and stop it from responding to input, and resuming SHALL restart the loop from where it left off.

#### Scenario: Pausing shows paused state
- **WHEN** a player pauses an active session
- **THEN** the screen indicates the session is paused

#### Scenario: Pausing suspends the real engine (engine-backed game)
- **WHEN** a player pauses an active session for a game with a bundled engine
- **THEN** that engine stops advancing its game state and ignores player input until resumed

### Requirement: End session and submit score
The system SHALL let the player end a play session at any time, then show the final score and let the player submit it with a name before returning to the library or restarting. Submitting a score SHALL persist it so it can appear on that game's leaderboard, using an anonymous per-device identity established at submission time — the player is not required to have a full account. The system SHALL show a pending state while a submission is in progress, and SHALL let the player retry a failed submission without losing their entered name or score. For a game with a bundled real engine, running out of lives inside that engine SHALL also end the session automatically, using the engine's own final score.

#### Scenario: Ending shows final score
- **WHEN** a player ends an active play session
- **THEN** the system shows the final score and a way to submit it

#### Scenario: Submitting a score confirms success
- **WHEN** a player submits their final score with a name
- **THEN** the system shows a pending state while the submission is in progress, then confirms the score was saved and no longer shows the submission form

#### Scenario: Submission fails
- **WHEN** a score submission cannot be completed
- **THEN** the system shows an error message, keeps the entered name and score, and lets the player retry submitting

#### Scenario: Submitting does not require a prior account
- **WHEN** a player who has not signed in submits a score
- **THEN** the system still accepts and persists the submission, establishing an anonymous identity for that device if one does not already exist

#### Scenario: Restart after game over
- **WHEN** a player chooses to play again after a session ends
- **THEN** the system starts a new session with score, level, and lives reset; for a game with a bundled engine, the engine itself is re-initialized rather than reusing prior state

#### Scenario: Engine game over ends the session (engine-backed game)
- **WHEN** the player loses their last life inside a game with a bundled engine
- **THEN** the system ends the session and shows the final score reported by that engine, without requiring the player to press "FIN"

### Requirement: Exit to detail
The system SHALL let the player leave the play screen and return to the game's detail screen at any time.

#### Scenario: Exiting mid-session
- **WHEN** a player selects "salir" during a play session
- **THEN** the system navigates back to that game's detail screen

### Requirement: Catalog playable flag gates engine use
The system SHALL treat a game as having a "bundled real engine" (as referenced throughout this capability's other requirements) only when the catalog marks that game as playable, regardless of whether application code contains a matching engine implementation.

#### Scenario: Not-playable game does not use its engine
- **WHEN** a player opens the play screen for a game that the catalog marks not-playable, even though application code has an engine registered for that game id
- **THEN** the system uses the simulated, non-engine play experience rather than the real engine

#### Scenario: Playable game with no registered engine falls back to simulated play
- **WHEN** a player opens the play screen for a game that the catalog marks playable, but application code has no engine registered for that game id
- **THEN** the system uses the simulated, non-engine play experience rather than failing
