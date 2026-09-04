## Purpose

Provides the in-browser play screen with a simulated score/level HUD, pause control, and end-of-game score submission, standing in for real game logic in the MVP.

## ADDED Requirements

### Requirement: Simulated scoring
The system SHALL continuously increase the player's score while a play session is active and not paused, and SHALL stop increasing it while paused or after the session ends.

#### Scenario: Score increases during play
- **WHEN** a play session is active and not paused
- **THEN** the displayed score keeps increasing over time

#### Scenario: Score frozen while paused
- **WHEN** a player pauses an active play session
- **THEN** the displayed score stops increasing until the player resumes

### Requirement: Level progression
The system SHALL increase the player's level as their score crosses fixed score thresholds during a session.

#### Scenario: Level increases with score
- **WHEN** the player's score crosses a level threshold
- **THEN** the displayed level increases

### Requirement: Pause and resume
The system SHALL let the player pause and resume an active play session, showing a distinct paused state while paused.

#### Scenario: Pausing shows paused state
- **WHEN** a player pauses an active session
- **THEN** the screen indicates the session is paused

### Requirement: End session and submit score
The system SHALL let the player end a play session at any time, then show the final score and let the player submit it with a name before returning to the library or restarting.

#### Scenario: Ending shows final score
- **WHEN** a player ends an active play session
- **THEN** the system shows the final score and a way to submit it

#### Scenario: Submitting a score confirms success
- **WHEN** a player submits their final score with a name
- **THEN** the system confirms the score was saved and no longer shows the submission form

#### Scenario: Restart after game over
- **WHEN** a player chooses to play again after a session ends
- **THEN** the system starts a new session with score, level, and lives reset

### Requirement: Exit to detail
The system SHALL let the player leave the play screen and return to the game's detail screen at any time.

#### Scenario: Exiting mid-session
- **WHEN** a player selects "salir" during a play session
- **THEN** the system navigates back to that game's detail screen
