# auth Specification

## Purpose

Provides a mock, locally-persisted sign-in flow so the rest of the app has a consistent notion of the current player without needing a real backend.

## Requirements

### Requirement: Sign in
The system SHALL let a visitor sign in by submitting a username, and SHALL treat them as authenticated afterward across the app.

#### Scenario: Signing in updates the app
- **WHEN** a visitor submits the sign-in form with a username
- **THEN** the app treats them as the authenticated player and shows their name in the navigation

### Requirement: Create account
The system SHALL let a visitor create an account by submitting a username, email, and password, and SHALL treat them as authenticated afterward, equivalent to signing in.

#### Scenario: Creating an account signs the player in
- **WHEN** a visitor submits the create-account form
- **THEN** the app treats them as the authenticated player

### Requirement: Guest access
The system SHALL let a visitor continue without an account, remaining unauthenticated, and return them to the library.

#### Scenario: Continuing as guest
- **WHEN** a visitor selects "jugar como invitado"
- **THEN** the visitor is returned to the library without being authenticated

### Requirement: Sign out
The system SHALL let an authenticated player sign out, after which the app no longer treats them as authenticated.

#### Scenario: Signing out clears the session
- **WHEN** an authenticated player signs out
- **THEN** the navigation shows the sign-in action instead of the player's name

### Requirement: Session persistence
The system SHALL persist the authenticated player's identity across page reloads within the same browser, without requiring the player to sign in again.

#### Scenario: Reload keeps the player signed in
- **WHEN** an authenticated player reloads the page
- **THEN** the app still treats them as the authenticated player
