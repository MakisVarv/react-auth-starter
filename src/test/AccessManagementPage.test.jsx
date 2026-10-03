import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AccessManagementPage from '../features/access-control/pages/AccessManagementPage'
import { getRoles } from '../features/access-control/services/roleService'
import { getPermissions } from '../features/access-control/services/permissionService'
import { useAuth } from '../features/auth/hooks/useAuth'
import { AppError } from '../shared/api/errors'

vi.mock('../features/access-control/services/roleService', () => ({
  getRoles: vi.fn(),
  createRole: vi.fn(),
  editRole: vi.fn(),
  deleteRole: vi.fn(),
  addPermissionToRole: vi.fn(),
  removePermissionFromRole: vi.fn(),
}))

vi.mock('../features/access-control/services/permissionService', () => ({
  getPermissions: vi.fn(),
}))

vi.mock('../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('AccessManagementPage', () => {
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
    })
  })

  it('recovers when loading access data fails and retry succeeds', async () => {
    vi.mocked(getRoles)
      .mockRejectedValueOnce(
        new AppError('Could not load access data.', 500, null),
      )
      .mockResolvedValueOnce([
        {
          id: 'role-1',
          name: 'User',
          description: 'Standard user',
          level: 10,
          permissions: [],
        },
      ])

    vi.mocked(getPermissions)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])

    render(<AccessManagementPage />)

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('Could not load access data.')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Try again',
      }),
    )

    await waitFor(() => {
      expect(getRoles).toHaveBeenCalledTimes(2)
      expect(getPermissions).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Access Management',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('User')).toBeInTheDocument()
  })
})
