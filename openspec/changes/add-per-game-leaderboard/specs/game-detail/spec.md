## MODIFIED Requirements

### Requirement: Per-game leaderboard
The system SHALL show a ranked list of top scores for the selected game on its detail screen, sourced from persisted score submissions, not fabricated data. The system SHALL show an empty-state message when no scores have been submitted for that game yet, and SHALL show an error-state message, without failing the rest of the detail screen, when the leaderboard data cannot be loaded.

#### Scenario: Leaderboard is ranked
- **WHEN** a player views a game's detail screen and at least one score has been submitted for that game
- **THEN** the leaderboard entries are shown in descending score order with a rank number for each

#### Scenario: Tied scores are ordered consistently
- **WHEN** two or more submitted scores for a game are equal
- **THEN** the leaderboard breaks the tie by earliest submission first, so the ranking is stable across reloads

#### Scenario: No scores yet
- **WHEN** a player views the detail screen for a game with no submitted scores
- **THEN** the system shows an empty-state message inviting the player to be the first to play, instead of an empty or fabricated list

#### Scenario: Leaderboard fails to load
- **WHEN** the leaderboard data cannot be retrieved
- **THEN** the system shows an error-state message in place of the leaderboard, and the rest of the detail screen (game info, play/back actions) remains usable
