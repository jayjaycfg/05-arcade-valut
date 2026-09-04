# game-library Specification

## Purpose

Lets players browse the full game catalog, search by name, and filter by category from the home screen so they can find a game to play.

## Requirements

### Requirement: Catalog listing
The system SHALL display every game in the catalog as a card on the home screen, each showing the game's title, category, short description, and best recorded score.

#### Scenario: Default view shows all games
- **WHEN** a player opens the home screen without searching or filtering
- **THEN** every game in the catalog is shown as a card

### Requirement: Search by name
The system SHALL filter the displayed games to those whose title contains the player's search text, case-insensitively.

#### Scenario: Search narrows results
- **WHEN** a player types a substring of a game's title into the search field
- **THEN** only games whose title contains that substring (case-insensitive) remain visible

### Requirement: Filter by category
The system SHALL filter the displayed games to a single category when the player selects a category chip, and SHALL show every category when "TODOS" is selected.

#### Scenario: Category chip filters results
- **WHEN** a player selects a category chip other than "TODOS"
- **THEN** only games belonging to that category remain visible

#### Scenario: Search and category combine
- **WHEN** a player has both a search term and a non-default category selected
- **THEN** only games matching both conditions remain visible

### Requirement: Empty results state
The system SHALL show an explicit "no results" message when no game matches the current search and category filters.

#### Scenario: No matches
- **WHEN** the combination of search text and selected category matches no game
- **THEN** the game grid shows a "no results" message instead of an empty grid

### Requirement: Navigate to game detail
The system SHALL let the player open a game's detail screen by selecting its card or its play action.

#### Scenario: Selecting a card opens detail
- **WHEN** a player selects a game card
- **THEN** the system navigates to that game's detail screen
