import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import PermissionRoute from '../features/auth/guards/PermissionRoute'
import { AuthContext } from '../features/auth/context/AuthContext'

function createUser(permissions = []) {
  return {
    id: 'user-1',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: null,
    is_active: true,
    role: {
      id: 'role-1',
      name: 'User',
      description: 'Test role',
      level: 1,
      permissions,
    },
  }
}

function renderWithAuth(user) {
  const authValue = {
    user,
    accessToken: user ? 'test-token' : null,
    isAuthLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    clearSession: vi.fn(),
    updateProfile: vi.fn(),
  }

  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route
            path="/users"
            element={
              <PermissionRoute permissions={['user.read']}>
                <h1>Users page</h1>
              </PermissionRoute>
            }
          />

          <Route path="/login" element={<h1>Login page</h1>} />
          <Route path="/" element={<h1>Home page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('PermissionRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithAuth(null)

    expect(
      screen.getByRole('heading', { name: 'Login page' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Users page' }),
    ).not.toBeInTheDocument()
  })

  it('renders protected content when user has required permission', () => {
    const user = createUser([
      {
        id: 'permission-1',
        name: 'user.read',
        description: 'Read users',
      },
    ])

    renderWithAuth(user)

    expect(
      screen.getByRole('heading', { name: 'Users page' }),
    ).toBeInTheDocument()
  })

  it('redirects authenticated users without permission to home', () => {
    const user = createUser([])

    renderWithAuth(user)

    expect(
      screen.getByRole('heading', { name: 'Home page' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Users page' }),
    ).not.toBeInTheDocument()
  })
})
