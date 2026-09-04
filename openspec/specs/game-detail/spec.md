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
The system SHALL show a "not found" screen, instead of a detail screen, when the requested game id does not exist in the catalog.

#### Scenario: Unknown id
- **WHEN** a player navigates to a game id that does not exist in the catalog
- **THEN** the system shows a "not found" screen with a way back to the library

### Requirement: Per-game leaderboard
The system SHALL show a ranked list of top scores for the selected game on its detail screen.

#### Scenario: Leaderboard is ranked
- **WHEN** a player views a game's detail screen
- **THEN** the leaderboard entries are shown in descending score order with a rank number for each

### Requirement: Enter play from detail
The system SHALL let the player start the play screen for the selected game from its detail screen, and SHALL let the player return to the library.

#### Scenario: Start playing
- **WHEN** a player selects "jugar ahora" on a game's detail screen
- **THEN** the system navigates to that game's play screen
