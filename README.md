# React Auth Starter

A reusable React frontend starter for applications that need **authentication, role-based access control, user administration, and hierarchy-aware access management**.

Built with React, React Router, Axios, Tailwind CSS, and Vite. The frontend is designed to work with a backend that provides JWT access tokens, an HttpOnly refresh-token cookie, CSRF-protected refresh/logout endpoints, and role/permission data.

## Highlights

- Feature-based React structure
- Login, registration, logout, and profile management
- In-memory access-token handling
- Session restoration through refresh-token rotation
- CSRF support for cookie-based refresh and logout
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
- ESLint, Prettier, and production build checks

## Tech Stack

| Area          | Technology     |
| ------------- | -------------- |
| UI            | React 19       |
| Routing       | React Router   |
| HTTP Client   | Axios          |
| Styling       | Tailwind CSS 4 |
| Notifications | Sonner         |
| Icons         | Lucide React   |
| Build Tool    | Vite           |
| Linting       | ESLint         |
| Formatting    | Prettier       |

## Architecture

The project uses a feature-oriented structure instead of grouping the entire application by file type.

```text
src/
├── features/
│   ├── access-control/
│   ├── account/
│   ├── auth/
│   ├── dashboard/
│   ├── permissions/
│   ├── roles/
│   └── users/
├── layouts/
├── pages/
└── shared/
    ├── api/
    ├── components/
    └── utils/
```

Each feature owns its pages, components, API service functions, and lightweight JSDoc types where appropriate.

Shared infrastructure such as the Axios client, application errors, navigation components, and cookie helpers lives under `shared/`.

## Authentication Flow

The frontend keeps the short-lived access token in React state rather than browser storage.

```text
Login
  ↓
access token returned in JSON
  ↓
stored in AuthProvider memory

refresh token
  ↓
managed by the backend in an HttpOnly cookie
```

On application startup, `AuthProvider` attempts to restore the session through the refresh endpoint. If refresh succeeds, it retrieves the current user and repopulates the in-memory authentication state.

Refresh and logout requests read the CSRF cookie and send its value through the `X-CSRF-TOKEN` header.

This starter intentionally does not persist the access token in `localStorage` or `sessionStorage`.

## Route Protection

The application separates authentication from authorization with three route guards:

- `ProtectedRoute` — requires an authenticated user.
- `GuestOnlyRoute` — keeps authenticated users out of login/register pages.
- `PermissionRoute` — requires one or more named permissions.

For example, administrative sections are protected with permissions such as:

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

The same permission model is also used to hide navigation items and actions the current user cannot perform.

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

There is no runtime Permission create/edit/delete UI.

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

All HTTP requests use a shared Axios client configured with:

```text
baseURL = VITE_API_URL
withCredentials = true
```

API failures are normalized into a shared `AppError` type.

General backend errors use their `message` value, while structured validation errors retain the full field-error object and surface the first validation message for immediate UI feedback.

This keeps individual pages and components focused on application behavior instead of repeating transport-level error parsing.

## Backend Contract

The frontend expects a compatible API with these main areas:

### Authentication

```text
POST  /auth/register
POST  /auth/login
POST  /auth/refresh
POST  /auth/logout
GET   /auth/me
PATCH /auth/me
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

### Production build

```bash
npm run build
```

## Quality Checks

Run the project quality checks with:

```bash
npm run lint
npm run format:check
npm run build
```

The repository is configured with ESLint and Prettier and uses Vite's production build as the final compile/bundle check.

## Design Goals

This starter deliberately favors:

- readable feature boundaries;
- explicit authentication state;
- backend-authoritative authorization;
- permission-aware UX;
- small reusable authorization helpers;
- centralized API contracts and error handling;
- realistic user and access-management flows;
- minimal abstraction until repeated application pressure justifies more.

It is intended as a foundation for real applications rather than a demo containing unrelated features.

## Current Scope

The starter intentionally stops short of adding product-specific dashboard data, complex global state libraries, or speculative infrastructure.

One possible future enhancement is transparent access-token refresh and request retry when a token expires during an active session. Session restoration after a page reload is already implemented.

## Summary

This project demonstrates a reusable React frontend foundation with:

- authentication and session restoration;
- protected and permission-aware routing;
- RBAC-aware navigation and actions;
- hierarchy-aware user and role management;
- protected system-role UX;
- read-only permission definitions with runtime role composition;
- centralized API and error handling;
- responsive administrative UI;
- production-oriented lint, format, and build tooling.

It is designed to pair cleanly with a backend that owns authentication, authorization, and role hierarchy while the frontend provides a consistent permission-aware user experience.
