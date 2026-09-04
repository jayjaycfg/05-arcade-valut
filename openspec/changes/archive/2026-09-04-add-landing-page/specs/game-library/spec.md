## MODIFIED Requirements

### Requirement: Catalog listing
The system SHALL display every game in the catalog as a card on the game catalog screen, each showing the game's title, category, short description, and best recorded score. The catalog screen SHALL be reachable at a dedicated path distinct from the landing page.

#### Scenario: Default view shows all games
- **WHEN** a player opens the game catalog screen without searching or filtering
- **THEN** every game in the catalog is shown as a card

#### Scenario: Catalog is not the root path
- **WHEN** a player navigates to the root path (`/`)
- **THEN** they see the landing page, not the game catalog
