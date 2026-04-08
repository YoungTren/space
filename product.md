# Product: Space

> A cinematic web app for exploring the Solar System through an interactive 3D scene and short planet facts.

## Overview

- **Problem:** Most educational space experiences split into two extremes: visually impressive but complex simulators, or simple fact pages with weak immersion. Casual learners often lose interest before reaching the "wow" moment or getting digestible knowledge.
- **Target Audience:** School students, university students, parents with children, space enthusiasts, and users who enjoy polished interactive visualizations in the browser.
- **Value Proposition:** `Space` combines a visually impressive first impression with a simple exploration loop: see the Solar System, click a planet, smoothly fly closer, read 10 high-signal facts, continue exploring.
- **Market Opportunity:** Space education remains evergreen, browser-based 3D rendering is now mainstream, and short-form educational experiences perform well because users expect immediate interaction instead of long reading sessions.

## Competitors

| Name | URL | Key Features | Monetization | Weaknesses |
|------|-----|--------------|--------------|------------|
| Solar System Scope | https://wp.solarsystemscope.com/ | Real-time Solar System model, planet facts, night sky, search, downloadable apps | Free web app, paid desktop app, mobile with optional in-app purchases, merchandise | Broad feature set can feel less focused; older UX patterns; less curated first-run storytelling |
| NASA Eyes on the Solar System | https://solarsystem.nasa.gov/eyes/ | Real-time 3D exploration, mission tracking, time travel, NASA data, many objects | Free public educational experience | Very deep and information-heavy; stronger for science exploration than simple beginner-friendly onboarding |
| Stellarium Web | https://www.stellarium-web.org/ | Browser planetarium, sky exploration, high data density, astronomy tooling | Free web experience based on open-source project | More sky-observatory oriented than Solar System storytelling; less cinematic product framing for newcomers |
| SpaceTrekk | https://spacetrekk.com/ | Interactive 3D Solar System, real-time orbital mechanics, spacecraft tracking, strong modern presentation | No clear public paid tier shown; appears free-to-use web experience | Scope is broader than an MVP pet project; feature density increases cognitive load for casual learners |
| Solar System Live | https://www.fourmilab.ch/solar/solar.html | Interactive orrery, time/date controls, viewpoints, orbit tracking | Free web experience | Utility-first presentation, dated UI, low visual wow-factor compared with modern WebGL products |

## Target Users

### Persona 1: Curious Student

- **Role:** Teen or university student exploring astronomy outside class or while preparing a report.
- **Behavior:** Searches for visual explainers, watches short science videos, clicks through interactive educational sites.
- **Pain Points:** Text-heavy resources feel boring; advanced simulators are intimidating; facts are often not memorable.
- **Willingness to Pay:** Low. Expects free access; may share or revisit if the experience is polished.

### Persona 2: Casual Space Enthusiast

- **Role:** Adult user who likes science, beautiful interfaces, and interactive demos.
- **Behavior:** Finds products through social links, design showcases, or search queries like "interactive solar system".
- **Pain Points:** Wants quick delight and smooth controls, not a technical astronomy workstation.
- **Willingness to Pay:** Low to medium. Open to donations or a small one-time supporter purchase if the experience feels premium.

### Persona 3: Parent or Educator

- **Role:** Parent showing space to a child, or teacher looking for a simple classroom-safe demo.
- **Behavior:** Prefers easy browser access and content that is both educational and visually engaging.
- **Pain Points:** Needs trustworthy, short, age-friendly content; cannot spend time teaching complicated controls.
- **Willingness to Pay:** Low. More likely to use a free version and optionally support if it proves useful.

## Monetization

- **Model:** Free core experience with optional supporter monetization.
- **Pricing:**
  - Free tier: full MVP experience with all planets and facts.
  - Supporter: pay what you want (`$3-$10`) to support development and unlock cosmetic thank-you perks in a future iteration.
  - Premium future: optional one-time purchase for guided tours, extra scenes, or downloadable wallpapers if the project gains traction.
- **Payment Integration:** No payment flow in MVP. Use a simple external support link such as Ko-fi or Buy Me a Coffee first.

## Funnel

| Step | Event Name | Description |
|------|------------|-------------|
| Landing page visit | `page_view_landing` | User opens the home page |
| Scene ready | `scene_loaded` | The 3D scene is ready for interaction |
| First interaction | `scene_interaction_started` | User drags, zooms, or clicks inside the 3D scene |
| Planet selected | `planet_selected` | User clicks a planet |
| Focus transition completed | `planet_focus_completed` | Camera finishes moving toward the selected planet |
| Facts viewed | `planet_facts_viewed` | Facts panel for a planet becomes visible |
| Planet switched | `planet_switched` | User changes from one selected planet to another |
| Return session | `session_returned` | User comes back after 24h or more |
| Support intent | `support_cta_clicked` | User clicks the external support or donation CTA |

## SEO

- **Primary Keywords:** interactive solar system, 3d solar system, solar system explorer, planets facts, browser space app
- **Long-tail Keywords:** interactive solar system for students, 3d planets browser experience, solar system planets facts for kids, explore the solar system online, educational space visualization web app
- **Strategy:** Target a high-conversion landing page for interactive Solar System queries, support it with planet-specific pages or sections later, and write lightweight content around "facts about [planet]" only after the core experience is polished.

---

## Features

### P0 — MVP

| Feature | Status | Effort | Impact | Acceptance Criteria |
|---------|--------|--------|--------|---------------------|
| Full-screen interactive Solar System scene | planned | medium | high | On first load, the home page renders a full-screen 3D scene with the Sun and all 8 planets visible or reachable through orbit/zoom controls on modern desktop browsers |
| Real-time planet motion and visual differentiation | planned | medium | high | Each of the 8 planets has distinct color and size, and their orbital motion updates continuously without user refresh |
| Planet selection by click | planned | low | high | Clicking a visible planet selects exactly that planet and updates UI state within 200ms on a local development build |
| Smooth camera transition to selected planet | planned | medium | high | After a planet click, the camera transitions toward the selected planet with visible interpolation and completes without a hard jump |
| Top-10 facts panel for each planet | planned | medium | high | Each planet has a dedicated facts payload containing exactly 10 readable facts, and selecting the planet shows that list in a dedicated panel |
| Simple navigation between planets and reset state | planned | low | high | From a selected planet state, the user can close the panel and select another planet without reloading the page |
| Short control hint overlay | planned | low | medium | On initial load, the interface displays concise interaction guidance for orbit, zoom, and selection |

### P1 — v1

| Feature | Status | Effort | Impact | Acceptance Criteria |
|---------|--------|--------|--------|---------------------|
| Planet textures and richer shaders | planned | high | high | At least 4 planets use textured or shader-enhanced surfaces that are visibly richer than flat colors while maintaining usable frame rate |
| Planet quick-jump navigation | planned | low | medium | Users can jump directly to any planet from a compact planet list in one click |
| Lightweight audio ambience toggle | planned | low | medium | Users can enable or disable ambient audio, and the preference persists for the current browser session |
| Mobile-responsive fallback layout | planned | medium | medium | On common mobile widths, facts panel content remains readable and controls do not block the main action |

### P2 — Future

| Feature | Status | Effort | Impact | Acceptance Criteria |
|---------|--------|--------|--------|---------------------|
| Guided story mode | planned | medium | medium | Users can start a guided tour that advances through planets in a predefined sequence with short narration text |
| Time controls for orbital simulation | planned | high | medium | Users can pause, slow down, and speed up planetary motion with visible effect on orbit animation |
| Expanded object set beyond 8 planets | planned | high | medium | The experience supports at least 10 additional celestial objects such as moons, dwarf planets, or spacecraft |
| Planet-specific SEO detail pages | planned | medium | medium | Each planet has its own indexable page with canonical metadata and a subset of facts available without loading the 3D scene |

## User Stories

```gherkin
Feature: Full-screen interactive Solar System scene
  Scenario: User enters the experience
    Given a visitor opens the Space home page on a supported desktop browser
    When the page finishes loading
    Then the visitor sees a full-screen 3D Solar System scene ready for exploration

Feature: Real-time planet motion and visual differentiation
  Scenario: User observes the living scene
    Given the Solar System scene is visible
    When the user watches the planets for a few seconds
    Then the planets appear visually distinct and continue moving in real time

Feature: Planet selection by click
  Scenario: User chooses a planet of interest
    Given the user can see a planet in the scene
    When the user clicks that planet
    Then that exact planet becomes the active selection

Feature: Smooth camera transition to selected planet
  Scenario: User zooms into a chosen planet
    Given a planet has just been selected
    When the focus transition starts
    Then the camera moves smoothly toward the selected planet without an abrupt jump

Feature: Top-10 facts panel for each planet
  Scenario: User reads a planet summary
    Given a planet is selected
    When the focus transition completes
    Then the interface shows a panel with exactly 10 facts about that planet

Feature: Simple navigation between planets and reset state
  Scenario: User continues exploration
    Given the facts panel for one planet is open
    When the user closes the panel or selects another planet
    Then the experience updates to the new browsing state without reloading the page

Feature: Short control hint overlay
  Scenario: First-time user learns the controls
    Given the visitor has not interacted with the scene yet
    When the experience is first shown
    Then the interface displays a short hint explaining drag, zoom, and click interactions
```

## Out of Scope

- NASA-grade scientific completeness or mission-accurate simulation
- User accounts, profiles, or saved progress in MVP
- Large encyclopedia-style text database with hundreds of entries
- Multiplayer, comments, quizzes, or classroom management features
- Native mobile apps in the initial release
- Monetization that requires building a full checkout flow into the app

## Open Questions

- [ ] Should the MVP stay desktop-first, or should mobile usability become a launch requirement instead of a P1 improvement?
- [ ] Should planet facts be written in one language first or designed for bilingual content from day one?
- [ ] How realistic should the camera fly-to be: cinematic and exaggerated, or shorter and more utility-focused?
- [ ] Is the primary distribution channel SEO, social sharing, or portfolio/showcase traffic?
- [ ] Should the initial tone lean more toward children-friendly wonder or general-audience science minimalism?

## Assumptions

- The MVP will use static planet metadata and authored facts stored directly in the codebase.
- Scientific believability matters more than astrophysical precision.
- The strongest success metric for the first version is whether users quickly interact with at least one planet and consume a facts panel.
- The solo builder should optimize for polish in one core loop, not breadth of content.

---

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Database:** None in MVP; static content modules
- **ORM:** None
- **Auth:** None
- **Hosting:** Vercel
- **UI:** React 19, Tailwind CSS v4, shadcn/ui, Base UI
- **3D / Rendering:** `three`, `@react-three/fiber`, `@react-three/drei`
- **Analytics:** Vercel Analytics or PostHog later; no analytics package required for prototype completion
- **Payments:** None in MVP; optional external supporter link later
- **Key APIs:** No required third-party runtime API for MVP; optional NASA assets or public references for fact verification and visual inspiration

## UX / Design

- **Style:** Cinematic, modern, minimal HUD over an immersive 3D scene
- **Theme:** Dark-first
- **Typography:** Geist Sans for UI and headings, Geist Mono available for small technical labels if needed
- **Colors:** Near-black space background, warm solar highlights, cool blue-violet accents, translucent card surfaces
- **Key Screens:**
  - Home scene — full-screen 3D Solar System with minimal overlay and immediate interaction
  - Planet details panel — right-side or bottom-sheet information surface with top 10 facts
  - Future lightweight navigation overlay — quick-jump list for switching planets
- **User Flows:**
  - Landing -> scene loads -> user drags/zooms -> user clicks planet -> fly-to -> facts panel
  - Selected planet -> user closes panel -> returns to exploration -> selects another planet
- **UX Principles:**
  - Show value before explanation
  - Keep controls discoverable but unobtrusive
  - Favor one strong motion transition over many competing animations
  - Keep copy short enough to scan in under 30 seconds per planet

## Architecture

- **Routes:**
  - `/` -> main immersive Solar System experience
- **Core UI Composition:**
  - `src/app/page.tsx` -> entry route
  - `src/app/home-client.tsx` -> client-only handoff for the 3D view
  - `src/components/solar-system/solar-system-view.tsx` -> page composition, selected planet state, facts panel
  - `src/components/solar-system/solar-scene.tsx` -> scene graph, lighting, stars, planet meshes, controls
  - `src/lib/planets.ts` -> static planet config for IDs, names, colors, sizes, orbit radii, speed
- **Data Model (MVP):**
  - `planet_config` -> `id`, `name`, `color`, `radius`, `orbit_radius`, `speed`
  - `planet_fact_set` -> `planet_id`, `facts[10]`
- **API Endpoints:** None required for MVP
- **Key Patterns:** Client-rendered 3D scene, static typed content, local UI state for selection, dynamic import to avoid SSR issues with WebGL
- **Implementation Notes:**
  - Keep facts and planet metadata collocated in `src/lib`
  - Add smooth camera interpolation inside the scene layer rather than introducing global state
  - Avoid backend dependencies until there is a clear need for CMS, localization, or personalization

---

## Analytics

- **KPIs:**
  | Metric | Baseline | Target (Month 1) | Target (Month 6) |
  |--------|----------|-------------------|-------------------|
  | First planet selection rate | 0% | 60% | 75% |
  | Facts panel completion rate | 0% | 35% | 50% |
  | Return visitor rate (7-day) | 0% | 10% | 20% |
  | Support CTA click-through | 0% | 1% | 3% |

- **Event Tracking Plan:**
  All events use `snake_case`. See Funnel section for core funnel events. Additional:
  | Event | Trigger | Properties |
  |-------|---------|------------|
  | `planet_hovered` | Cursor first hovers a planet | `planet_id`, `session_id` |
  | `planet_panel_closed` | User closes facts panel | `planet_id`, `time_open_ms` |
  | `hint_dismissed` | User dismisses or ignores onboarding hint | `dismiss_method` |
  | `zoom_used` | User uses wheel or gesture zoom | `zoom_direction`, `camera_distance` |
  | `orbit_drag_used` | User drags to orbit camera | `drag_duration_ms` |

## Growth Hypotheses

| Hypothesis | Status | Metric | Baseline | Target | Result |
|------------|--------|--------|----------|--------|--------|
| If the first interaction teaches controls in one concise line, first planet selection rate will improve | planned | First planet selection rate | 0% | 60% | — |
| If the camera fly-to feels cinematic, facts panel completion rate will improve because the transition creates anticipation | planned | Facts panel completion rate | 0% | 35% | — |
| If each planet has a short memorable fact near the top, return visitor rate will improve through sharing and repeat exploration | planned | Return visitor rate (7-day) | 0% | 20% | — |

## Insights

_This section is updated later based on analytics data._

---

## Changelog

### 2026-04-08 — Initial product discovery

- Created the first `product.md` for `Space` with market research, personas, monetization, funnel, SEO, feature priorities, and architecture
- Scoped the MVP around one polished exploration loop: browse planets, fly to a target, and read 10 facts
- Initiated by: product-manager skill
