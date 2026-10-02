import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreateUserPage from '../features/users/pages/CreateUserPage'
import { getRoles } from '../features/access-control/services/roleService'
import { useAuth } from '../features/auth/hooks/useAuth'
import { createUser } from '../features/users/userService'
import { AppError } from '../shared/api/errors'

vi.mock('../features/access-control/services/roleService', () => ({
  getRoles: vi.fn(),
}))

vi.mock('../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../features/users/userService', () => ({
  createUser: vi.fn(),
}))

describe('CreateUserPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 'actor-id',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        phone: null,
        is_active: true,
        role: {
          id: 'admin-role-id',
          name: 'Admin',
          description: 'Administrator',
          level: 100,
          permissions: [],
        },
      },
      isAuthLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      clearSession: vi.fn(),
      updateProfile: vi.fn(),
    })
  })

  it('recovers when loading roles fails and retry succeeds', async () => {
    vi.mocked(getRoles)
      .mockRejectedValueOnce(new AppError('Could not load roles.', 500, null))
      .mockResolvedValueOnce([
        {
          id: 'user-role-id',
          name: 'User',
          description: 'Standard user',
          level: 10,
          permissions: [],
        },
      ])

    render(
      <MemoryRouter>
        <CreateUserPage />
      </MemoryRouter>,
    )

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('Could not load roles.')

    expect(
      screen.queryByRole('heading', { name: 'Create new User' }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Try again',
      }),
    )

    await waitFor(() => {
      expect(getRoles).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('heading', { name: 'Create new User' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('option', { name: 'User' })).toBeInTheDocument()
  })
})
