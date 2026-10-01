import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from '../features/auth/context/AuthProvider'
import { useAuth } from '../features/auth/hooks/useAuth'
import userEvent from '@testing-library/user-event'
import {
  clearAccessToken,
  getAccessToken,
} from '../shared/api/accessTokenStore'
import {
  login as loginRequest,
  logout as logoutRequest,
  refresh,
  getCurrentUser,
} from '../features/auth/authService'
import { notifySessionExpired } from '../shared/auth/sessionEvents'
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
  const { user, isAuthLoading, login, logout } = useAuth()

  if (isAuthLoading) {
    return <p>Loading</p>
  }

  return (
    <div>
      <p>{user ? user.email : 'Anonymous'}</p>

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
    clearAccessToken()
  })

  it('clears the authenticated session when session expiration is notified', async () => {
    vi.mocked(refresh).mockResolvedValue('restored-token')
    vi.mocked(getCurrentUser).mockResolvedValue(testUser)

    renderProvider()

    expect(await screen.findByText('test@example.com')).toBeInTheDocument()
    expect(getAccessToken()).toBe('restored-token')

    notifySessionExpired()

    await waitFor(() => {
      expect(screen.getByText('Anonymous')).toBeInTheDocument()
    })

    expect(getAccessToken()).toBeNull()
  })
  it('restores the authenticated session when refresh succeeds', async () => {
    vi.mocked(refresh).mockResolvedValue('restored-token')
    vi.mocked(getCurrentUser).mockResolvedValue(testUser)

    renderProvider()

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(await screen.findByText('test@example.com')).toBeInTheDocument()

    expect(getAccessToken()).toBe('restored-token')

    expect(refresh).toHaveBeenCalledOnce()
    expect(getCurrentUser).toHaveBeenCalledOnce()
  })

  it('remains unauthenticated when no refresh token is available', async () => {
    vi.mocked(refresh).mockResolvedValue(null)

    renderProvider()

    await waitFor(() => {
      expect(screen.getByText('Anonymous')).toBeInTheDocument()
    })

    expect(getAccessToken()).toBeNull()
    expect(getCurrentUser).not.toHaveBeenCalled()
  })

  it('clears the session when restoration fails', async () => {
    vi.mocked(refresh).mockRejectedValue(new Error('Refresh failed'))

    renderProvider()

    await waitFor(() => {
      expect(screen.getByText('Anonymous')).toBeInTheDocument()
    })

    expect(getAccessToken()).toBeNull()
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

    expect(getAccessToken()).toBe('login-token')

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
    expect(getAccessToken()).toBeNull()

    expect(logoutRequest).toHaveBeenCalledOnce()
  })
})
