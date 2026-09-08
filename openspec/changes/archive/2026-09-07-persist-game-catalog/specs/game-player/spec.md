## ADDED Requirements

### Requirement: Catalog playable flag gates engine use
The system SHALL treat a game as having a "bundled real engine" (as referenced throughout this capability's other requirements) only when the catalog marks that game as playable, regardless of whether application code contains a matching engine implementation.

#### Scenario: Not-playable game does not use its engine
- **WHEN** a player opens the play screen for a game that the catalog marks not-playable, even though application code has an engine registered for that game id
- **THEN** the system uses the simulated, non-engine play experience rather than the real engine

#### Scenario: Playable game with no registered engine falls back to simulated play
- **WHEN** a player opens the play screen for a game that the catalog marks playable, but application code has no engine registered for that game id
- **THEN** the system uses the simulated, non-engine play experience rather than failing
