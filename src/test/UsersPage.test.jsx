import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UsersPage from '../features/users/pages/UsersPage'
import { getUsers } from '../features/users/userService'
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
