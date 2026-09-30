import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from '../features/auth/context/AuthProvider'
import { useAuth } from '../features/auth/hooks/useAuth'
import userEvent from '@testing-library/user-event'

import {
  login as loginRequest,
  logout as logoutRequest,
  refresh,
  getCurrentUser,
} from '../features/auth/authService'

vi.mock('../features/auth/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  refresh: vi.fn(),
  getCurrentUser: vi.fn(),
}))

const testUser = {
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
    permissions: [],
  },
}

function AuthStateProbe() {
  const { user, accessToken, isAuthLoading, login, logout } = useAuth()

  if (isAuthLoading) {
    return <p>Loading</p>
  }

  return (
    <div>
      <p>{user ? user.email : 'Anonymous'}</p>
      <p>{accessToken ?? 'No token'}</p>

      <button
        type="button"
        onClick={() =>
          login({
            email: 'test@example.com',
            password: 'Password123!',
          })
        }
      >
        Login
      </button>

      <button type="button" onClick={() => logout()}>
        Logout
      </button>
    </div>
  )
}

function renderProvider() {
  render(
    <AuthProvider>
      <AuthStateProbe />
    </AuthProvider>,
  )
}

describe('AuthProvider session restoration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores the authenticated session when refresh succeeds', async () => {
    vi.mocked(refresh).mockResolvedValue('restored-token')
    vi.mocked(getCurrentUser).mockResolvedValue(testUser)

    renderProvider()

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(await screen.findByText('test@example.com')).toBeInTheDocument()

    expect(screen.getByText('restored-token')).toBeInTheDocument()

    expect(refresh).toHaveBeenCalledOnce()
    expect(getCurrentUser).toHaveBeenCalledWith('restored-token')
  })

  it('remains unauthenticated when no refresh token is available', async () => {
    vi.mocked(refresh).mockResolvedValue(null)

    renderProvider()

    await waitFor(() => {
      expect(screen.getByText('Anonymous')).toBeInTheDocument()
    })

    expect(screen.getByText('No token')).toBeInTheDocument()
    expect(getCurrentUser).not.toHaveBeenCalled()
  })

  it('clears the session when restoration fails', async () => {
    vi.mocked(refresh).mockRejectedValue(new Error('Refresh failed'))

    renderProvider()

    await waitFor(() => {
      expect(screen.getByText('Anonymous')).toBeInTheDocument()
    })

    expect(screen.getByText('No token')).toBeInTheDocument()
  })
})
it('updates the session after login succeeds', async () => {
  vi.mocked(refresh).mockResolvedValue(null)

  vi.mocked(loginRequest).mockResolvedValue({
    access_token: 'login-token',
    user: testUser,
  })

  const user = userEvent.setup()

  renderProvider()

  expect(await screen.findByText('Anonymous')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Login' }))

  expect(await screen.findByText('test@example.com')).toBeInTheDocument()

  expect(screen.getByText('login-token')).toBeInTheDocument()

  expect(loginRequest).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'Password123!',
  })
})

it('clears the session after logout', async () => {
  vi.mocked(refresh).mockResolvedValue('restored-token')
  vi.mocked(getCurrentUser).mockResolvedValue(testUser)
  vi.mocked(logoutRequest).mockResolvedValue(undefined)

  const user = userEvent.setup()

  renderProvider()

  expect(await screen.findByText('test@example.com')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Logout' }))

  expect(await screen.findByText('Anonymous')).toBeInTheDocument()
  expect(screen.getByText('No token')).toBeInTheDocument()

  expect(logoutRequest).toHaveBeenCalledOnce()
})
