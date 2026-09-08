# game-catalog Specification

## Purpose

Defines the persisted game catalog that every other screen reads from — the canonical record of what games exist, their display metadata, and whether each one is actually playable.

## Requirements

### Requirement: Persisted catalog record
The system SHALL persist each game's identity and display metadata — a unique id, title, category, short and full descriptions, cover art reference, color theme, best recorded score, and play count — as a durable record, not a value compiled into the application.

#### Scenario: Catalog record is readable independent of a deploy
- **WHEN** a game's display metadata is updated in the persisted catalog
- **THEN** the updated metadata is reflected the next time the catalog is read, without requiring a new application deploy

### Requirement: Playable flag
The system SHALL mark each catalog record as either playable or not-playable, and this flag SHALL determine whether the game can actually be played, independent of whether application code happens to contain a game engine for that id.

#### Scenario: Not-playable game shows a coming-soon experience
- **WHEN** a player opens the play screen for a game marked not-playable in the catalog
- **THEN** the system shows a coming-soon experience instead of a playable session, even if application code has an engine for that game id

#### Scenario: Playable game is actually playable
- **WHEN** a player opens the play screen for a game marked playable in the catalog
- **THEN** the system starts a real play session for that game

### Requirement: Public catalog access
The system SHALL let any visitor, signed in or not, read the full catalog, and SHALL NOT allow visitors to create, modify, or remove catalog records through normal application access.

#### Scenario: Anonymous visitor reads the catalog
- **WHEN** a visitor who has not signed in requests the catalog
- **THEN** the system returns the full set of catalog records

### Requirement: Catalog read failure
The system SHALL treat a failure to read the catalog as distinct from a game or the catalog genuinely being empty, so that callers can show an error state instead of treating the failure as "no games exist" or "this game does not exist."

#### Scenario: Read failure is distinguishable from an empty catalog
- **WHEN** the catalog cannot be retrieved due to a connectivity or server failure
- **THEN** the result is distinguishable from a successful read that found zero games

#### Scenario: Read failure is distinguishable from a missing game
- **WHEN** a lookup for one game by id fails due to a connectivity or server failure
- **THEN** the result is distinguishable from a successful lookup that found no game with that id
