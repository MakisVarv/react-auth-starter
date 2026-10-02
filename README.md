# React Auth Starter

A reusable React frontend starter for applications that need **authentication, role-based access control, user administration, hierarchy-aware access management, and production-style session handling**.

Built with React, React Router, Axios, Tailwind CSS, Vite, Vitest, and React Testing Library. The frontend is designed to work with a backend that provides JWT access tokens, an HttpOnly refresh-token cookie, CSRF-protected refresh/logout endpoints, refresh-token rotation, and role/permission data.

## Highlights

- Feature-based React structure
- Login, registration, logout, profile management, and password recovery
- In-memory access-token ownership through a dedicated token store
- Centralized access-token transport through Axios request interceptors
- Transparent access-token refresh and original-request retry
- Single-flight refresh coordination for concurrent expired requests
- Refresh-token rotation support
- Terminal session-expiration handling across Axios and React
- CSRF support for cookie-based refresh and logout
- Step-up reauthentication for sensitive account operations
- Protected, guest-only, and permission-aware routes
- Permission-aware navigation and UI actions
- User management with pagination, search, filters, sorting, and status changes
- Role creation, editing, deletion, and hierarchy-aware management
- Runtime role-permission assignment
- Read-only permission catalog
- Protected built-in `Admin` and `User` role behavior
- Centralized API error normalization
- Sonner toast feedback
- Tailwind CSS responsive UI
- Vitest + React Testing Library coverage for authentication and route behavior
- ESLint, Prettier, and production build checks

## Tech Stack

| Area          | Technology                     |
| ------------- | ------------------------------ |
| UI            | React 19                       |
| Routing       | React Router                   |
| HTTP Client   | Axios                          |
| Styling       | Tailwind CSS 4                 |
| Notifications | Sonner                         |
| Icons         | Lucide React                   |
| Testing       | Vitest + React Testing Library |
| Build Tool    | Vite                           |
| Linting       | ESLint                         |
| Formatting    | Prettier                       |

## Architecture

The project uses a feature-oriented structure instead of grouping the entire application by file type.

```text
src/
├── features/
│   ├── access-control/
│   ├── auth/
│   ├── dashboard/
│   └── users/
├── layouts/
├── pages/
├── shared/
│   ├── api/
│   ├── auth/
│   ├── components/
│   └── utils/
└── test/
```

Each feature owns its pages, components, API service functions, hooks, guards, and lightweight JSDoc types where appropriate.

Shared infrastructure such as the Axios client, access-token store, application errors, session-expiration events, shared components, and cookie helpers lives under `shared/`.

## Authentication Model

The frontend separates **UI authentication state** from **access-token transport state**.

```text
AuthProvider
├── current user
├── authentication loading state
└── auth actions

accessTokenStore
└── current normal access token

apiClient
├── attaches managed access tokens
├── detects access-token expiration
├── refreshes when recovery is available
└── retries the original request
```

The normal access token is kept only in memory. It is not persisted to `localStorage` or `sessionStorage`.

The refresh token is managed by the backend in an HttpOnly cookie.

### Login

```text
POST /auth/login
        ↓
access token returned in JSON
        ↓
stored in accessTokenStore
        ↓
user stored in AuthProvider
```

### Session restoration

On application startup, `AuthProvider` attempts to restore the session through the refresh endpoint.

```text
application start
        ↓
POST /auth/refresh
        ↓
new access token
        ↓
store access token
        ↓
GET /auth/me
        ↓
restore current user
```

If restoration fails, the application remains unauthenticated.

## Access-Token Transport

Ordinary authenticated requests do not manually pass the normal access token.

The shared Axios client reads the current token from `accessTokenStore` and attaches it through its request interceptor.

```text
feature service
    ↓
apiClient
    ↓
request interceptor
    ↓
accessTokenStore
    ↓
Authorization: Bearer <token>
```

This keeps normal-token ownership centralized and prevents features from accidentally using stale copies of the token.

Explicit `Authorization` headers still take precedence when a feature intentionally provides a special token.

## Transparent Refresh and Retry

When a request using the managed normal access token fails with an expired-token response, `apiClient` can transparently recover the request.

```text
protected request
        ↓
401 access_token_expired
        ↓
POST /auth/refresh
        ↓
new access token
        ↓
update accessTokenStore
        ↓
retry original request
```

The calling feature does not need to know that the refresh happened.

### Concurrent expiration

Multiple requests can fail at the same time after the access token expires.

The client uses a shared in-progress refresh operation so concurrent failures wait for the same refresh request instead of starting several refreshes.

```text
request A ─┐
request B ─┼─→ one refresh request
request C ─┘
                ↓
           new access token
           /      |      \
          ↓       ↓       ↓
       retry A retry B retry C
```

This is especially important when the backend rotates refresh tokens.

### Retry-loop protection

A retried request is not allowed to start another refresh cycle for the same failure. This prevents infinite refresh/retry loops.

## Terminal Session Expiration

A failed refresh is not always equivalent to a dead session.

The client distinguishes between terminal authentication failure and transient infrastructure failure.

```text
refresh returns 401
→ refresh credential/session is no longer usable
→ clear access token
→ notify application session expired
→ AuthProvider clears current user
→ protected routes return to login
```

By contrast:

```text
refresh network failure or server error
→ session status is uncertain
→ do not falsely log the user out
→ surface the request error
→ later requests may attempt recovery again
```

A small shared session-event module keeps this boundary decoupled:

```text
apiClient
   │
   │ notifySessionExpired()
   ▼
shared session event
   ▲
   │ subscribe
   │
AuthProvider
```

The shared Axios infrastructure does not depend directly on React.

## Refresh and CSRF

Refresh and logout use the backend-managed refresh-token cookie.

```text
withCredentials
→ browser sends refresh-token cookie

X-CSRF-TOKEN
→ frontend reads the CSRF cookie
→ sends its value explicitly
```

The refresh token itself remains inaccessible to JavaScript when stored as HttpOnly.

## Step-Up Reauthentication

Sensitive account operations use an explicit fresh access token obtained through password reauthentication.

```text
normal authenticated session
        ↓
POST /auth/reauthenticate
        ↓
fresh access token
        ↓
sensitive operation
```

Sensitive operations include:

- change password
- change email
- logout from all sessions

The normal access token used to call `/auth/reauthenticate` is attached centrally by `apiClient`.

The fresh step-up token returned by the backend is then passed explicitly to the sensitive request.

Explicit step-up tokens do not participate in transparent normal-token refresh.

## Route Protection

The application separates authentication from authorization with three route guards:

- `ProtectedRoute` — requires an authenticated user.
- `GuestOnlyRoute` — keeps authenticated users out of guest-only pages.
- `PermissionRoute` — requires one or more named permissions.

Administrative sections are protected with permissions such as:

```text
dashboard.read
user.read
user.create
user.update
role.read
role.create
role.update
role.delete
role.assign_permission
permission.read
```

The same permission model is used to hide navigation items and actions the current user cannot perform.

Frontend checks improve UX only. The backend remains the authoritative security boundary.

## Role Hierarchy

The UI mirrors the backend role hierarchy so users are not offered management actions that the server will reject.

```text
Admin → level 100
User  → level 10
```

For non-top-level actors, management is allowed only over lower-level users or roles.

The shared authorization helpers provide checks such as:

```text
canManageUser(actor, target)
canAssignRole(actor, role)
canManageRole(actor, role)
```

Level `100` represents the top authority used by the matching backend contract.

## Protected Built-In Roles

`Admin` and `User` are treated as protected system roles.

In the UI:

- delete actions are hidden;
- role name is read-only;
- hierarchy level is read-only;
- description remains editable.

When a protected role is edited, the frontend sends only the changed description in the PATCH request instead of resubmitting protected fields.

This mirrors backend invariants while keeping the server authoritative.

## Permission Model

Permission definitions are read-only from the frontend.

The client supports:

```text
GET /permissions/
GET /permissions/<permission_id>
```

There is no runtime permission create/edit/delete UI.

Roles can still be composed dynamically by assigning or removing existing permissions through the role API.

This separates **developer-defined capabilities** from **runtime role composition**.

## User Management

The administrative user area supports:

- server-side pagination;
- debounced search;
- role filtering;
- active/inactive filtering;
- sorting;
- user creation;
- profile editing;
- activation/deactivation;
- hierarchy-aware role changes;
- user deletion where allowed by the backend.

The UI responds to the current user's permissions and role level before exposing management actions.

## API Layer

All ordinary HTTP requests use a shared Axios client configured with:

```text
baseURL = VITE_API_URL
withCredentials = true
```

The API layer is responsible for:

- attaching the centrally managed normal access token;
- preserving explicit authorization headers for special-token flows;
- normalizing backend/network failures into `AppError`;
- detecting recoverable access-token expiration;
- coordinating transparent refresh;
- retrying the original request with the new token;
- preventing refresh loops;
- coordinating concurrent refresh attempts;
- notifying the application when session recovery becomes terminally impossible.

A separate bare Axios instance is used for low-level refresh so the refresh request itself does not recursively enter the normal refresh/retry interceptor.

## Error Handling

General backend errors use their `message` value.

Structured validation errors retain the full field-error object and surface the first validation message for immediate UI feedback.

Expected Axios failures are normalized into `AppError`.

Unexpected non-Axios errors are preserved rather than being disguised as transport failures.

## Backend Contract

The frontend expects a compatible API with these main areas.

### Authentication

```text
POST  /auth/register
POST  /auth/login
POST  /auth/refresh
POST  /auth/logout
GET   /auth/me
PATCH /auth/me
POST  /auth/reauthenticate
POST  /auth/change-password
POST  /auth/change-email
POST  /auth/logout-all
POST  /auth/forgot-password
POST  /auth/reset-password
```

### Users

```text
GET    /users/
GET    /users/<user_id>
POST   /users/
PATCH  /users/<user_id>
PATCH  /users/<user_id>/status
PATCH  /users/<user_id>/role
DELETE /users/<user_id>
```

### Roles

```text
GET    /roles/
GET    /roles/<role_id>
POST   /roles/
PATCH  /roles/<role_id>
DELETE /roles/<role_id>
POST   /roles/<role_id>/permissions
DELETE /roles/<role_id>/permissions/<permission_id>
```

### Permissions

```text
GET /permissions/
GET /permissions/<permission_id>
```

The included `.env.example` assumes an API mounted under `/api`.

## Testing

The frontend uses Vitest and React Testing Library.

Existing coverage includes:

- authentication session restoration;
- login and logout behavior;
- protected routes;
- permission-aware routes;
- transparent access-token refresh;
- request replay with the refreshed token;
- explicit-token bypass;
- refresh failure normalization;
- unavailable refresh handling;
- single-flight concurrent refresh behavior;
- retry-loop prevention;
- refresh lifecycle cleanup;
- transient refresh failure without false logout;
- terminal session-expiration notification.

## Getting Started

### Prerequisites

- Node.js compatible with the included Vite version
- npm
- A compatible backend API

### Install dependencies

```bash
npm ci
```

### Configure the API URL

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start development mode

```bash
npm run dev
```

### Run tests

```bash
npm test -- --run
```

### Production build

```bash
npm run build
```

## Quality Checks

Run the project quality checks with:

```bash
npm test -- --run
npm run lint
npm run format:check
npm run build
```

## Design Goals

This starter deliberately favors:

- readable feature boundaries;
- centralized normal access-token ownership;
- backend-authoritative authorization;
- permission-aware UX;
- small reusable authorization helpers;
- production-style refresh/retry behavior;
- explicit handling of terminal vs transient session failures;
- realistic user and access-management flows;
- testable infrastructure boundaries;
- minimal abstraction until repeated application pressure justifies more.

It is intended as a foundation for real applications rather than a demo containing unrelated features.

## Current Scope

The starter currently includes:

- authentication and session restoration;
- transparent access-token refresh and retry;
- refresh-token rotation support;
- concurrent refresh coordination;
- session-expiration propagation into React;
- step-up reauthentication for sensitive operations;
- protected and permission-aware routing;
- RBAC-aware navigation and actions;
- hierarchy-aware user and role management;
- protected system-role UX;
- read-only permission definitions with runtime role composition;
- centralized API and error handling;
- responsive administrative UI;
- automated frontend tests;
- production-oriented lint, format, and build tooling.

The project intentionally stops short of adding product-specific dashboard data, speculative global-state libraries, or infrastructure unrelated to the starter's authentication and access-control goals.

## Summary

This project demonstrates a reusable React frontend foundation with:

- centralized in-memory access-token handling;
- session restoration;
- transparent refresh and request retry;
- concurrency-safe refresh coordination;
- terminal session-expiration handling;
- step-up authentication for sensitive operations;
- protected and permission-aware routing;
- RBAC-aware navigation and actions;
- hierarchy-aware user and role management;
- centralized API and error handling;
- automated auth and routing tests;
- responsive administrative UI;
- production-oriented quality checks.

It is designed to pair cleanly with a backend that owns authentication, authorization, refresh-token rotation, and role hierarchy while the frontend provides a consistent permission-aware user experience.
