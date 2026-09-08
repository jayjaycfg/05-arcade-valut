## MODIFIED Requirements

### Requirement: End session and submit score
The system SHALL let the player end a play session at any time, then show the final score and let the player submit it with a name before returning to the library or restarting. Submitting a score SHALL persist it so it can appear on that game's leaderboard, using an anonymous per-device identity established at submission time — the player is not required to have a full account. The system SHALL show a pending state while a submission is in progress, and SHALL let the player retry a failed submission without losing their entered name or score.

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
- **THEN** the system starts a new session with score, level, and lives reset
