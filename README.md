# TeamFlow

## Overview

TeamFlow is a frontend project-management dashboard for small development teams. It brings projects, tasks, team workload, delivery progress, and workspace activity into one focused interface so teams can coordinate work without switching between disconnected views.

The application is intentionally frontend-only at this stage. It demonstrates a complete product workflow using typed React state, mock authentication, seeded data, and browser persistence.

## Features

- Mock authentication with the demo account and protected application routes.
- Project CRUD with validation, status badges, progress, members, and project details tabs.
- Task CRUD with status management, priority, assignee, project, and due-date metadata.
- Project search and status filtering.
- Task search, filtering by status, priority, project, and assignee, plus sorting by due date, priority, or title.
- Dashboard statistics calculated from the current project, task, user, and activity state.
- Team view with searchable members and calculated task/project involvement counts.
- Analytics for task status, task priority, project status, completion rate, and project progress.
- Activity tracking for project and task changes, including project-specific activity history.
- Light/dark theme preferences and notification preferences.
- localStorage persistence for authentication, projects, tasks, activities, theme, and notification preferences, with safe fallback handling for invalid stored data.
- Responsive application shell with desktop sidebar and mobile navigation.
- Accessibility practices including semantic HTML, labels, keyboard navigation, visible focus states, accessible dialogs, meaningful control names, and reduced-motion handling.
- Automated behavior tests for authentication, project/task workflows, filtering, dashboard/analytics calculations, settings, and persistence.

## Tech Stack

- React: component-based UI and route/page composition.
- TypeScript: typed domain models, context contracts, service boundaries, and component props.
- Vite: local development server and production bundling.
- Bootstrap 5: responsive grid, utilities, form primitives, and base UI styles.
- SCSS: TeamFlow design tokens, mixins, application components, responsive rules, and theme overrides.
- React Router: nested application routes, protected routes, dynamic project URLs, and active navigation.
- Context API: shared authentication, project, task, activity, theme, and notification-preference state.
- Vitest: test runner and assertions.
- React Testing Library: user-facing component and workflow tests.
- `@testing-library/user-event`: realistic keyboard and pointer interaction in tests.
- `localStorage`: browser persistence for the frontend-only demo state.
- Vercel: static hosting target for the Vite production output; `vercel.json` provides the SPA fallback, and no CI/CD pipeline is committed in this repository.

## Architecture

The application follows a page-to-state-to-persistence flow:

```text
Pages and routes
    -> reusable components
    -> Context API state
    -> services and storage validation
    -> browser localStorage
```

- Pages own route-level composition, local UI state, filters, modal visibility, and presentation decisions.
- Reusable components own repeatable UI patterns such as cards, buttons, badges, forms, dialogs, loading states, dashboard widgets, and navigation.
- Context providers own shared application state and domain operations. Context-specific hooks live beside their contexts.
- Services own cross-cutting behavior such as JSON storage access, authentication storage, activity creation, sorting, and persisted-data validation.
- The `data` directory provides static users and first-launch seed data. Seed data is used only when no valid saved collection exists.

Authenticated routes share one `AppLayout` with an `Outlet`, so the sidebar, topbar, and content scroll area are not duplicated across pages. Application pages are lazy-loaded at route level with a shared `Suspense` fallback; the shell and login experience remain available immediately.

## State Management

### AuthContext

Owns the current mock user, authentication status, and login initialization state. It exposes `login()` and `logout()`, persists only the mock user record, and deliberately does not own projects, tasks, or authorization security. The authentication flow is for demonstration only.

### ProjectContext

Owns the current project collection, persistence errors, and `createProject()`, `updateProject()`, and `deleteProject()` operations. It records project activities through the activity context. It deliberately does not own page filters, task state, or team-member records.

### TaskContext

Owns the current task collection, persistence errors, and task creation, update, deletion, and status-change operations. It records task activities through the activity context. It deliberately does not own task-page filters, project state, or user records.

### ThemeContext

Owns the active light/dark theme and persistence errors. It exposes `setTheme()` and `toggleTheme()` and applies the theme at the document root with `data-theme`. It deliberately does not own notification preferences or page-specific styling.

Activity and notification preferences use their own supporting contexts. Activity state records meaningful project/task changes and is capped at the latest 100 entries. Notification preferences own the three persisted boolean preferences shown in Settings.

## Data Flow

Creating a task follows this path:

```text
User submits TaskForm
    -> Tasks page calls TaskContext.createTask()
    -> TaskContext updates the task collection
    -> storage service persists teamflow.tasks
    -> ActivityContext records the task-created event
    -> Tasks, Dashboard, Project Details, and Analytics re-render from context state
```

No page copies task data into its own long-lived store. The same principle applies to project mutations and preference changes.

## Project Structure

```text
src/
  components/  Reusable common, layout, dashboard, project, task, team, and analytics UI
  pages/       Route-level page composition
  context/     Shared providers, context contracts, and context-specific hooks
  services/    Storage, authentication storage, activity creation, and validation
  data/        Static users, seed projects/tasks/activities, and seed validation
  types/       Shared TypeScript domain models
  utils/       Filtering, sorting, dates, analytics, labels, focus, and validation helpers
  styles/      Bootstrap entrypoint, SCSS tokens, components, themes, and responsive rules
  tests/       Vitest and React Testing Library behavior tests
```

There is no standalone `src/hooks` directory; hooks that expose context state are kept next to the corresponding context implementation.

## Styling Strategy

Bootstrap 5 provides the responsive grid, spacing utilities, form controls, buttons, cards, modal primitives, and base responsive behavior.

SCSS provides the TeamFlow-specific layer:

- design variables for colors, typography, spacing, borders, shadows, and breakpoints;
- mixins for surfaces, focus rings, responsive rules, and interactive card states;
- application-specific styles for pages, navigation, cards, forms, badges, dashboard widgets, and dialogs;
- root-level light/dark theme tokens consumed by both Bootstrap and custom styles.

Bootstrap utilities and custom SCSS are used together in page markup, for example with Bootstrap grid classes alongside TeamFlow classes such as `tf-card`, `task-filters`, and `dashboard-page__stats`.

## Testing

The project uses Vitest with jsdom, React Testing Library, jest-dom, and user-event. The current suite contains 25 behavior tests across eight test files; this is meaningful workflow coverage, not complete application coverage.

Important tested workflows include:

- demo login, invalid credentials, required-field validation, redirects, and logout;
- project and task creation, editing, deletion, status updates, and persistence;
- search, combined filters, sorting, and filter reset behavior;
- dashboard and analytics calculations, including zero-data handling;
- theme and notification preference updates;
- localStorage restoration and malformed-data fallback.

No coverage report or coverage threshold is configured.

## Accessibility

TeamFlow uses semantic landmarks, headings, navigation elements, real links, associated labels, meaningful button names, accessible progress labels, and readable error text. The custom modal and mobile navigation provide keyboard focus management, Escape handling, and focus restoration. Focus-visible rings are defined in the shared SCSS layer, and reduced-motion users receive shortened transitions and disabled smooth scrolling. Status and priority also include text labels, so state is not communicated by color alone.

## Performance

The measured opportunity was eager loading: before Phase 23, the route table imported all authenticated pages into one JavaScript entry chunk. Route-level `React.lazy` imports now defer Dashboard, Projects, Project Details, Tasks, Team, Analytics, and Settings until their routes are visited, while a shared `Suspense` fallback preserves the application shell during loading.

Measured Vite production-build output:

- Before route splitting: one entry JavaScript chunk at 354.03 kB (103.58 kB gzip).
- After route splitting: entry JavaScript at 300.45 kB (93.08 kB gzip), plus deferred page chunks of approximately 2.92-13.03 kB each (1.17-3.88 kB gzip).
- Current CSS output: 279.92 kB (38.88 kB gzip).

The entry comparison is a reduction of 53.58 kB raw and 10.50 kB gzip, approximately 15.1% and 10.1% respectively. Route code still downloads when needed; it was deferred, not removed. The current dataset is small, so virtualization and broad memoization were not justified. Analytics and page filtering retain only the memoization that is useful for their state-driven calculations.

## Responsive Design

Responsive rules are defined for the project review widths of 320px, 375px, 414px, 768px, 1024px, 1280px, and 1440px.

On desktop, the sidebar remains visible and the main content scrolls inside the application shell. At mobile widths below the medium breakpoint, the desktop sidebar is hidden, the topbar exposes the mobile navigation trigger, and the content uses the full available width. Cards, forms, analytics sections, project details, and filters collapse into readable single-column layouts as space narrows.

These are the supported responsive targets. A local browser pass verified route rendering, authentication redirects, persistence, console output, and no horizontal overflow at representative widths from 320px through 1440px. Full visual sign-off across every page and width remains a manual review item.

## Screenshots

The repository currently has no captured screenshot assets. Screenshots must be taken from the running TeamFlow application before being added here; placeholder or unrelated images are intentionally not used.

Recommended captures:

- Dashboard: `/dashboard`
- Projects: `/projects`
- Project Details: `/projects/project-marketplace-refresh`
- Tasks: `/tasks`
- Dark Theme: `/settings` after selecting Dark, or another authenticated page in dark mode

## Installation

```bash
git clone https://github.com/rishiraj103/TeamFlow.git
cd TeamFlow
npm install
npm run dev
```

Open the local URL printed by Vite. The mock login account is:

```text
Email: demo@teamflow.app
Password: password123
```

## Testing Commands

```bash
npm run test          # interactive Vitest watch mode
npm run test:run      # one-shot test run
npm run lint          # ESLint
npm run format:check  # Prettier verification
npm run typecheck     # TypeScript project check
```

## Production Build

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript build followed by the Vite production build. `npm run preview` serves the generated `dist` output locally for a production-like check.

## Git Workflow

Use focused commits for completed phases and verify the working tree before committing. The current development branch is `feature/dashboard`; replace it with the branch you are using when applying these commands:

```bash
git status
git add <changed-files>
git commit -m "<focused commit message>"
git push origin feature/dashboard
```

The local `PROJECT_CHECKLIST.md` is intentionally ignored and is used only as a progress tracker.

## Deployment

The deployment target is Vercel. The repository includes `vercel.json` for client-side route fallback and does not include a CI/CD workflow. For a manual deployment:

1. Import `https://github.com/rishiraj103/TeamFlow` into Vercel.
2. Select Vite, or configure the build command as `npm run build`.
3. Use `dist` as the output directory if Vercel does not detect it automatically.
4. Deploy and verify the root redirect, authentication flow, all application routes, and deep-link refresh behavior.

Because TeamFlow is a client-side routed SPA, `vercel.json` rewrites application routes to `index.html` so deep-link refreshes can be handled by React Router. A deployment was created during the deployment audit, but it currently requires Vercel project re-authentication/protection access and is not listed as a public live demo until the deployed application can be verified.

## Limitations

- Authentication is mock frontend authentication and is not real security.
- The demo credentials are part of the frontend code and must never be used for a real account.
- Projects, tasks, activities, and preferences are stored in the current browser's localStorage.
- There is no backend API, server-side persistence, database, or server-side authorization.
- There is no real-time collaboration, team invitation flow, or notification delivery system.
- Team data is static in this phase; there is no team CRUD.
- localStorage can be cleared or modified by the user and is not suitable as a system of record.

## Future Improvements

The following are intentionally future work, not current features:

- real backend API and server-side persistence;
- PostgreSQL or another production database;
- real authentication, sessions, and password handling;
- role-based permissions and authorization;
- real-time updates and collaboration;
- server-backed notifications and delivery preferences;
- team invitations and member management;
- automated deployment and CI quality gates;
- production screenshot and visual regression coverage.
