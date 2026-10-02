import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UsersPage from '../features/users/pages/UsersPage'
import { changeUserStatus, getUsers } from '../features/users/userService'
import { getRoles } from '../features/access-control/services/roleService'
import { useAuth } from '../features/auth/hooks/useAuth'
import { AppError } from '../shared/api/errors'
vi.mock('../features/users/userService', () => ({
  getUsers: vi.fn(),
  changeUserStatus: vi.fn(),
}))

vi.mock('../features/access-control/services/roleService', () => ({
  getRoles: vi.fn(),
}))

vi.mock('../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(getRoles).mockResolvedValue([])

    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 1,
        role: {
          permissions: [],
        },
      },
    })
  })
  it('shows an error state when fetching users fails', async () => {
    vi.mocked(getUsers).mockRejectedValue(
      new AppError('Could not load users.', 500, null),
    )

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('Could not load users.')
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
  })
  it('retries fetching users when Try again is clicked', async () => {
    vi.mocked(getUsers)
      .mockRejectedValueOnce(new AppError('Could not load users.', 500, null))
      .mockResolvedValueOnce({
        items: [],
        pagination: {
          page: 1,
          page_size: 10,
          total: 0,
          total_pages: 0,
        },
      })

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const retryButton = await screen.findByRole('button', {
      name: 'Try again',
    })

    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(getUsers).toHaveBeenCalledTimes(2)
    })

    expect(await screen.findByText('No users yet.')).toBeInTheDocument()
  })
  it('shows the empty state when there are no users', async () => {
    vi.mocked(getUsers).mockResolvedValue({
      items: [],
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
        total_pages: 0,
      },
    })

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('No users yet.')).toBeInTheDocument()

    expect(
      screen.getByText('Users will appear here once accounts are created.'),
    ).toBeInTheDocument()
  })
  it('shows a no-results state when filters return no users', async () => {
    vi.mocked(getRoles).mockResolvedValue([
      {
        id: 1,
        name: 'Admin',
      },
    ])

    vi.mocked(getUsers).mockResolvedValue({
      items: [],
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
        total_pages: 0,
      },
    })

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const roleFilter = await screen.findByLabelText('Filter by role')

    fireEvent.change(roleFilter, {
      target: { value: 'Admin' },
    })

    expect(await screen.findByText('No users found.')).toBeInTheDocument()

    expect(
      screen.getByText('Try adjusting your search or filters.'),
    ).toBeInTheDocument()
  })
  it('renders users when fetching succeeds', async () => {
    vi.mocked(getUsers).mockResolvedValue({
      items: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          is_active: true,
          role: {
            name: 'Admin',
            permissions: [],
          },
        },
      ],
      pagination: {
        page: 1,
        page_size: 10,
        total: 1,
        total_pages: 1,
      },
    })

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('John')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    const userRow = screen.getByText('john@example.com').closest('tr')

    expect(userRow).not.toBeNull()
    expect(within(userRow).getByText('Active')).toBeInTheDocument()
    expect(screen.getByText(/Showing 1–1 of 1/)).toBeInTheDocument()
  })
  it('shows a generic error state for unexpected failures', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('Unexpected failure'))

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('Something went wrong. Please try again.')

    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
  })
  it('disables only the user being updated and shows a pending label', async () => {
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
          level: 100,
          permissions: [{ name: 'user.update' }],
        },
      },
    })

    vi.mocked(getUsers).mockResolvedValue({
      items: [
        {
          id: 'user-1',
          email: 'john@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: null,
          is_active: true,
          role: {
            id: 'user-role-id',
            name: 'User',
            level: 10,
            permissions: [],
          },
        },
        {
          id: 'user-2',
          email: 'jane@example.com',
          first_name: 'Jane',
          last_name: 'Doe',
          phone: null,
          is_active: false,
          role: {
            id: 'user-role-id',
            name: 'User',
            level: 10,
            permissions: [],
          },
        },
      ],
      pagination: {
        page: 1,
        page_size: 10,
        total: 2,
        total_pages: 1,
      },
    })

    vi.mocked(changeUserStatus).mockReturnValue(new Promise(() => {}))

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const johnRow = (await screen.findByText('john@example.com')).closest('tr')
    const janeRow = screen.getByText('jane@example.com').closest('tr')

    expect(johnRow).not.toBeNull()
    expect(janeRow).not.toBeNull()

    const johnButton = within(johnRow).getByRole('button', {
      name: 'Deactivate',
    })

    const janeButton = within(janeRow).getByRole('button', {
      name: 'Activate',
    })

    fireEvent.click(johnButton)

    expect(
      within(johnRow).getByRole('button', { name: 'Updating...' }),
    ).toBeDisabled()

    expect(janeButton).toBeEnabled()

    expect(changeUserStatus).toHaveBeenCalledWith('user-1', false)
  })
  it('re-enables the status button when the update fails', async () => {
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
          level: 100,
          permissions: [{ name: 'user.update' }],
        },
      },
    })

    vi.mocked(getUsers).mockResolvedValue({
      items: [
        {
          id: 'user-1',
          email: 'john@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: null,
          is_active: true,
          role: {
            id: 'user-role-id',
            name: 'User',
            level: 10,
            permissions: [],
          },
        },
      ],
      pagination: {
        page: 1,
        page_size: 10,
        total: 1,
        total_pages: 1,
      },
    })

    /** @type {(reason?: unknown) => void} */
    let rejectUpdate

    const pendingUpdate = new Promise((_, reject) => {
      rejectUpdate = reject
    })

    vi.mocked(changeUserStatus).mockReturnValue(pendingUpdate)

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const row = (await screen.findByText('john@example.com')).closest('tr')

    expect(row).not.toBeNull()

    fireEvent.click(
      within(row).getByRole('button', {
        name: 'Deactivate',
      }),
    )

    expect(
      within(row).getByRole('button', {
        name: 'Updating...',
      }),
    ).toBeDisabled()

    await act(async () => {
      rejectUpdate(new Error('Update failed'))
    })

    expect(
      await within(row).findByRole('button', {
        name: 'Deactivate',
      }),
    ).toBeEnabled()
  })
  it('shows a loading status while users are being fetched', async () => {
    vi.mocked(getUsers).mockReturnValue(new Promise(() => {}))

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
    )

    const loadingStatus = await screen.findByRole('status')

    expect(loadingStatus).toHaveTextContent('Loading users...')
  })
})
