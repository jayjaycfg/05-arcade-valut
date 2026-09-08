# game-detail Specification

## Purpose

Shows a single game's full information and leaderboard, and is the entry point into the play screen.

## Requirements

### Requirement: Game information display
The system SHALL show the selected game's cover art, category, full description, play count, best global score, and difficulty on its detail screen.

#### Scenario: Viewing an existing game
- **WHEN** a player navigates to the detail screen for a game id that exists in the catalog
- **THEN** the screen shows that game's cover, description, and stats

### Requirement: Unknown game handling
The system SHALL show a "not found" screen, instead of a detail screen, when the requested game id does not exist in the catalog. The system SHALL NOT show a "not found" screen when the catalog cannot be read at all — a read failure is a distinct error condition, not evidence the game is missing.

#### Scenario: Unknown id
- **WHEN** a player navigates to a game id that does not exist in the catalog
- **THEN** the system shows a "not found" screen with a way back to the library

#### Scenario: Catalog read failure is not treated as unknown game
- **WHEN** the catalog cannot be read while resolving a game id
- **THEN** the system shows an error state, not a "not found" screen

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

### Requirement: Enter play from detail
The system SHALL let the player start the play screen for the selected game from its detail screen, and SHALL let the player return to the library.

#### Scenario: Start playing
- **WHEN** a player selects "jugar ahora" on a game's detail screen
- **THEN** the system navigates to that game's play screen
