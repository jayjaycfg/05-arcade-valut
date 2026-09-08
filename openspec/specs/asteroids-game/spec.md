# asteroids-game Specification

## Purpose

Defines the play rules of the ported Asteroids engine used by the new `asteroids` catalog game, and the state it must expose to the host play screen.

## Requirements

### Requirement: Ship control
The engine SHALL let the player rotate the ship left/right, thrust forward, and shoot, using keyboard input, only while its game loop is running (not paused, not game over).

#### Scenario: Rotating and thrusting
- **WHEN** the player holds the left/right rotate keys or the thrust key while a session is running
- **THEN** the ship rotates or accelerates in the faced direction accordingly

#### Scenario: Shooting
- **WHEN** the player presses the shoot key while a session is running
- **THEN** a bullet is fired from the ship's nose in the direction it faces

#### Scenario: Input ignored while suspended
- **WHEN** the engine is paused or the session has ended
- **THEN** input keys no longer move the ship or fire bullets

### Requirement: Asteroid splitting and scoring
The engine SHALL award points when a bullet destroys an asteroid, and SHALL split large and medium asteroids into two smaller asteroids on destruction, leaving small asteroids fully destroyed.

#### Scenario: Destroying a large or medium asteroid splits it
- **WHEN** a bullet hits a large or medium asteroid
- **THEN** that asteroid is removed and two smaller asteroids appear in its place, and the engine's score increases by that asteroid's point value

#### Scenario: Destroying a small asteroid removes it
- **WHEN** a bullet hits a small asteroid
- **THEN** that asteroid is removed with no replacement, and the engine's score increases by that asteroid's point value

### Requirement: Lives and collision
The engine SHALL end the ship's current life when it collides with an asteroid while not invincible, and SHALL grant the ship temporary invincibility after each respawn.

#### Scenario: Collision costs a life
- **WHEN** the ship collides with an asteroid while not invincible
- **THEN** the engine's remaining lives decreases by one and the ship respawns if lives remain

#### Scenario: Respawn invincibility
- **WHEN** the ship respawns after losing a life
- **THEN** it is briefly immune to further collisions before normal collision detection resumes

#### Scenario: Last life ends the game
- **WHEN** the ship collides with an asteroid while it has no lives left to lose
- **THEN** the engine enters a game-over state and stops advancing ship/asteroid gameplay

### Requirement: Level progression
The engine SHALL advance to the next level, with more asteroids than the previous one, once every asteroid on the current level has been destroyed.

#### Scenario: Clearing all asteroids advances the level
- **WHEN** no asteroids remain on the current level
- **THEN** the engine's level counter increases and a new, larger field of asteroids spawns

### Requirement: State reporting to host
The engine SHALL expose its current score, lives, level, and game-over status to the page that mounts it, updated at least once per rendered frame while running.

#### Scenario: Host reads live state
- **WHEN** the engine is running inside a host page
- **THEN** the host can read the engine's current score, lives, level, and whether the game has ended, without parsing anything drawn on the canvas

### Requirement: Mountable lifecycle
The engine SHALL start when explicitly mounted onto a host-provided canvas, SHALL stop advancing and release its input listeners when explicitly unmounted or paused, and SHALL support being reset to a fresh game without a full unmount/remount.

#### Scenario: Mounting starts the game
- **WHEN** the host mounts the engine onto a canvas element
- **THEN** the engine begins its update/render loop on that canvas without requiring a separate `index.html` or global `document`/`window`-level script

#### Scenario: Unmounting releases resources
- **WHEN** the host unmounts the engine
- **THEN** its render loop stops and its keyboard listeners are removed, leaving no running loop or dangling listeners behind

#### Scenario: Reset starts a fresh game
- **WHEN** the host asks the engine to reset after a game over
- **THEN** score, lives, level, ship, and asteroids all return to their initial-game values without the host needing to unmount and remount the engine
