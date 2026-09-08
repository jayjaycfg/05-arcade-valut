## MODIFIED Requirements

### Requirement: Per-game leaderboard tabs
The system SHALL let the player switch the displayed leaderboard between games in the catalog, where the set of games offered is sourced from the persisted catalog, not a list compiled into the application. The system SHALL show an empty-state message, instead of tabs with no content, when the catalog is empty or cannot be loaded.

#### Scenario: Switching games updates the leaderboard
- **WHEN** a player selects a different game tab
- **THEN** the podium and ranking table update to show that game's leaderboard

#### Scenario: No games available
- **WHEN** the persisted catalog is empty or cannot be loaded
- **THEN** the system shows an empty-state message instead of game tabs
