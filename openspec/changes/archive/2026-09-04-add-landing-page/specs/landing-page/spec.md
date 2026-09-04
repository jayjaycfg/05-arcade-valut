## Purpose

Gives first-time visitors a marketing entry point at `/` that explains what Arcade Vault is, shows proof it works and is free, and drives them toward the game catalog or account creation.

## ADDED Requirements

### Requirement: Landing route
The system SHALL serve the landing page at the root path (`/`), and the game catalog SHALL no longer be served there.

#### Scenario: Visiting the root path
- **WHEN** a visitor navigates to `/`
- **THEN** the landing page is shown, not the game catalog

### Requirement: Hero section
The landing page SHALL show a hero section with an eyebrow line, a headline, supporting copy, and two calls to action: one to explore the game catalog and one to create an account.

#### Scenario: Hero CTAs navigate correctly
- **WHEN** a visitor selects the "explore games" call to action in the hero
- **THEN** the system navigates to the game catalog
- **WHEN** a visitor selects the "create account" call to action in the hero
- **THEN** the system navigates to the sign-up/sign-in screen

#### Scenario: Decorative hero imagery is not exposed to assistive technology
- **WHEN** a visitor using a screen reader reaches the hero section
- **THEN** the floating decorative graphics are not announced as content

### Requirement: Feature grid
The landing page SHALL present a set of feature highlights describing the product's value proposition (classic games, free access, competitive leaderboards, growing catalog).

#### Scenario: Feature grid is shown
- **WHEN** a visitor views the landing page
- **THEN** each feature highlight shows a label and a short description

### Requirement: Featured games rail
The landing page SHALL show a rail of featured games drawn from the catalog, each linking to that game's detail screen, plus a link to view the full catalog.

#### Scenario: Selecting a featured game
- **WHEN** a visitor selects a game in the featured rail
- **THEN** the system navigates to that game's detail screen

#### Scenario: Viewing all games
- **WHEN** a visitor selects the "view all games" link
- **THEN** the system navigates to the game catalog

### Requirement: Stats band
The landing page SHALL display summary statistics about the catalog and community, and the displayed game count SHALL match the number of games actually in the catalog.

#### Scenario: Game count reflects the catalog
- **WHEN** a game is added to or removed from the catalog
- **THEN** the stats band's displayed game count changes accordingly without manual edits to the landing page content

### Requirement: Live activity section
The landing page SHALL show a list of recent scores and a list of top players, generated from existing player and score data, and SHALL link to the full hall of fame.

#### Scenario: Activity content is deterministic
- **WHEN** the landing page is rendered more than once with the same underlying catalog and player data
- **THEN** the recent-scores list and top-players list show the same entries in the same order each time

#### Scenario: Viewing the hall of fame
- **WHEN** a visitor selects the "view hall of fame" link in the live activity section
- **THEN** the system navigates to the hall of fame screen

### Requirement: Pricing and FAQ section
The landing page SHALL present a single, free pricing plan with its included features and a call to action to create an account, alongside a short set of frequently asked questions.

#### Scenario: Pricing CTA navigates to account creation
- **WHEN** a visitor selects the pricing plan's call to action
- **THEN** the system navigates to the sign-up/sign-in screen

### Requirement: Final call to action
The landing page SHALL end with a closing call-to-action section that links to the game catalog.

#### Scenario: Selecting the final call to action
- **WHEN** a visitor selects the final call-to-action button
- **THEN** the system navigates to the game catalog

### Requirement: Scroll reveal
Landing page sections SHALL progressively reveal as the visitor scrolls to them, and SHALL remain fully present and readable in their final state regardless of whether the reveal animation runs.

#### Scenario: Content available without animation support
- **WHEN** a visitor's browser does not support the reveal animation mechanism
- **THEN** all landing page content is still visible and readable

### Requirement: Responsive layout
The landing page's multi-column sections (feature grid, featured games rail, stats band, live activity, pricing/FAQ) SHALL collapse to fewer columns as viewport width decreases, remaining usable on mobile-width viewports.

#### Scenario: Narrow viewport
- **WHEN** a visitor views the landing page on a mobile-width viewport
- **THEN** multi-column sections lay out in a single column and all content and calls to action remain reachable
