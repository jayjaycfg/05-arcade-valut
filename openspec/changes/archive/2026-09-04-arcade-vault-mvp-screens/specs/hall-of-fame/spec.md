## Purpose

Lets players browse a cross-game leaderboard per title and see how they rank when signed in.

## ADDED Requirements

### Requirement: Per-game leaderboard tabs
The system SHALL let the player switch the displayed leaderboard between games in the catalog.

#### Scenario: Switching games updates the leaderboard
- **WHEN** a player selects a different game tab
- **THEN** the podium and ranking table update to show that game's leaderboard

### Requirement: Podium and ranking table
The system SHALL highlight the top three ranked players for the selected game in a podium display, and SHALL list all shown entries in descending score order with rank, player name, score, and date in a table.

#### Scenario: Top three shown on podium
- **WHEN** a player views a game's hall of fame
- **THEN** the first, second, and third ranked players are shown in a podium display

### Requirement: Signed-in player's rank
The system SHALL show the authenticated player's own rank and score for the selected game, highlighted separately from the general ranking table, and SHALL omit this when no player is signed in.

#### Scenario: Signed-in player sees their rank
- **WHEN** an authenticated player views a game's hall of fame
- **THEN** their own rank and score are shown highlighted in the list

#### Scenario: Guest sees no personal rank
- **WHEN** an unauthenticated visitor views a game's hall of fame
- **THEN** no personal rank row is shown

### Requirement: Return to library
The system SHALL let the player return to the library from the hall of fame.

#### Scenario: Returning to the library
- **WHEN** a player selects "volver a la biblioteca"
- **THEN** the system navigates to the library screen
