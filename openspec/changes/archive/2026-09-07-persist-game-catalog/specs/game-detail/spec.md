## MODIFIED Requirements

### Requirement: Unknown game handling
The system SHALL show a "not found" screen, instead of a detail screen, when the requested game id does not exist in the catalog. The system SHALL NOT show a "not found" screen when the catalog cannot be read at all — a read failure is a distinct error condition, not evidence the game is missing.

#### Scenario: Unknown id
- **WHEN** a player navigates to a game id that does not exist in the catalog
- **THEN** the system shows a "not found" screen with a way back to the library

#### Scenario: Catalog read failure is not treated as unknown game
- **WHEN** the catalog cannot be read while resolving a game id
- **THEN** the system shows an error state, not a "not found" screen
