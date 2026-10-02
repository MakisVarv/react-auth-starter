import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import DeleteUserModal from '../features/users/components/DeleteUserModal'
import { deleteUser } from '../features/users/userService'

vi.mock('../features/users/userService', () => ({
  deleteUser: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('DeleteUserModal', () => {
  it('prevents closing while deletion is pending and unlocks after failure', async () => {
    const onClose = vi.fn()
    const onDeleted = vi.fn()

    /** @type {(reason?: unknown) => void} */
    let rejectDelete

    const pendingDelete = new Promise((_, reject) => {
      rejectDelete = reject
    })

    vi.mocked(deleteUser).mockReturnValue(pendingDelete)

    render(
      <DeleteUserModal
        user={{
          id: 'user-1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: null,
          is_active: false,
          role: {
            id: 'role-1',
            name: 'User',
            description: 'Standard user',
            level: 10,
            permissions: [],
          },
        }}
        onClose={onClose}
        onDeleted={onDeleted}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Delete User',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: 'Deleting User...',
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    ).toBeDisabled()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()

    await act(async () => {
      rejectDelete(new Error('Delete failed'))
    })

    expect(
      screen.getByRole('button', {
        name: 'Delete User',
      }),
    ).toBeEnabled()

    expect(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    ).toBeEnabled()
  })
})
