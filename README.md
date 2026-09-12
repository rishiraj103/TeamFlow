# TeamFlow

TeamFlow is a responsive project-management workspace for small development teams. It brings projects, tasks, team workload, progress, analytics, and activity history into one focused interface.

> TeamFlow is currently a frontend-only product demonstration. It uses mock authentication and browser-local persistence; it is not a production security or collaboration system.

## Product overview

TeamFlow demonstrates a complete client-side workflow for managing delivery work:

- Protected sign-in flow with a reusable application shell.
- Project creation, editing, deletion, status, progress, members, and details.
- Task creation, editing, deletion, status changes, priorities, assignees, projects, and due dates.
- Dashboard statistics derived from the current application state.
- Searchable team view with calculated task and project involvement.
- Analytics for task status, priority, completion rate, and project progress.
- Activity history for meaningful project and task actions.
- Light and dark themes plus notification preferences.
- Responsive desktop, tablet, and mobile navigation.
- Loading, error, empty, filtered-empty, and not-found states.
- Route-level lazy loading for authenticated pages.

## Demo access

Use the following mock account on the login page:

```
Email:    demo@teamflow.app
Password: password123
```

These credentials are intentionally part of the frontend demo. Do not use them for a real account or treat this authentication flow as secure.

## Technology

- React 19 and TypeScript
- Vite
- React Router
- Bootstrap 5 and SCSS
- Context API for shared application state
- Vitest and React Testing Library
- Browser localStorage for frontend persistence
- Vercel-compatible static deployment configuration

## Architecture

The application follows a simple page-to-state-to-persistence flow:

```
React Router pages
        ↓
Reusable UI components
        ↓
Context providers and typed domain operations
        ↓
Services, validation, and activity tracking
        ↓
Browser localStorage
```

Key boundaries:

- src/pages/ composes route-level screens and local UI state.
- src/components/ contains reusable common, layout, dashboard, project, task, team, and analytics UI.
- src/context/ owns shared authentication, project, task, activity, theme, and notification state.
- src/services/ centralizes storage, authentication persistence, activity creation, and data validation.
- src/data/ provides static users and first-launch seed data.
- src/types/ contains shared TypeScript models.
- src/utils/ contains filtering, sorting, date, analytics, validation, and accessibility helpers.
- src/styles/ contains the Bootstrap entrypoint and TeamFlow's reusable SCSS design system.
- src/tests/ contains behavior and persistence tests.

The shared AppLayout renders the sidebar, topbar, mobile navigation, and an Outlet for authenticated pages. This keeps the shell in one place while nested routes render only their page content. Authenticated page modules are lazy-loaded with a shared Suspense fallback.

## Routes

| Route                | Purpose                                       |
| -------------------- | --------------------------------------------- |
| /login               | Mock sign-in page                             |
| /dashboard           | Workspace summary and recent activity         |
| /projects            | Project list and project actions              |
| /projects/:projectId | Project details and project activity          |
| /tasks               | Task list, filters, sorting, and task actions |
| /team                | Team members and calculated workload          |
| /analytics           | Project and task metrics                      |
| /settings            | Theme and notification preferences            |

The root route redirects to /dashboard for the demo. Protected routes redirect unauthenticated visitors to /login; an authenticated visitor opening /login is redirected to /dashboard.

## Getting started

### Requirements

- Node.js 20 or newer recommended
- npm

### Install and run locally

```
git clone https://github.com/rishiraj103/TeamFlow.git
cd TeamFlow
npm install
npm run dev
```

Open the local URL printed by Vite, then sign in with the demo account above.

## Quality and build commands

```
npm run dev          # Start the Vite development server
npm run typecheck    # Run the TypeScript project check
npm run lint         # Run ESLint
npm run format:check # Verify Prettier formatting
npm run test:run     # Run the complete test suite once
npm run test         # Run Vitest in watch mode
npm run build        # Type-check and create the production bundle
npm run preview      # Serve the generated dist directory locally
```

Before committing a feature, the useful full check is:

```
npm run typecheck
npm run lint
npm run format:check
npm run test:run
npm run build
```

## Persistence and data model

The storage service centralizes JSON serialization, parsing, removal, and safe fallback behavior. Projects, tasks, activities, authentication state, theme, and notification preferences are stored under centralized TeamFlow keys in localStorage.

- Seed projects, tasks, and activities are used only when no saved collection exists.
- CRUD and status mutations persist the updated collection immediately.
- Activity history is capped at the latest 100 entries.
- Malformed saved collections are rejected safely and replaced with the relevant seed data when available.
- Passwords and sensitive credentials are never stored.
- Data belongs only to the current browser and device; clearing browser storage removes the demo state.

## Styling and responsive behavior

Bootstrap supplies the responsive grid, utilities, form primitives, buttons, cards, and modal foundation. SCSS adds TeamFlow design tokens, mixins, application components, status badges, navigation, theme overrides, and responsive rules.

The interface is designed for narrow mobile screens through large desktop displays. On mobile, the permanent sidebar is replaced by accessible mobile navigation and only the main content region scrolls. Light and dark theme tokens are applied at the document root so cards, forms, navigation, dialogs, badges, borders, and text remain readable together.

## Deployment

TeamFlow is a Vite single-page application. The repository includes vercel.json with an SPA rewrite so direct navigation and refreshes on nested React Router routes resolve to index.html.

For a Vercel project, use:

```
Framework preset: Vite
Build command:    npm run build
Output directory: dist
```

After deployment, verify /login, each protected route, a project-details deep link, browser refresh, localStorage persistence, light mode, dark mode, and mobile layout.

### Live demo status

A public live-demo URL is not listed yet. The deployment account currently requires Vercel project re-authentication/protection access before the deployed TeamFlow application can be verified publicly. Once access is restored and the production URL is confirmed, add it here rather than publishing an unverified link.

## Performance notes

The main measured opportunity was eager route loading. Authenticated pages now use route-level React.lazy imports, so the initial entry bundle does not eagerly load every page module. The current dataset is small, so virtualization and broad React.memo usage were not justified. Filtering and analytics calculations remain straightforward and state-driven.

## Current limitations

- Authentication is mock frontend authentication, not real security.
- There is no backend API, database, server-side session, or authorization layer.
- Projects, tasks, activities, and preferences are local to the current browser/device.
- Team data is static; team CRUD and invitations are not implemented.
- Notifications are stored preferences only; no notification delivery system exists.
- There is no real-time collaboration or multi-user synchronization.

## Contributing locally

Keep changes focused, run the quality commands above, and use descriptive commits. The local PROJECT_CHECKLIST.md is intentionally ignored and is used only as a private phase tracker; it is not part of the repository deliverable.

```
git status
git add <changed-files>
git commit -m "<focused commit message>"
git push origin <branch-name>
```

## License

No open-source license has been added to this repository yet.
