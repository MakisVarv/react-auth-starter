import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LogoutAllPage } from '../features/auth/pages/LogoutAllPage'
import { logoutAll, reauthenticate } from '../features/auth/authService'
import { useAuth } from '../features/auth/hooks/useAuth'

vi.mock('../features/auth/authService', () => ({
  reauthenticate: vi.fn(),
  logoutAll: vi.fn(),
}))

vi.mock('../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('LogoutAllPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuth).mockReturnValue({
      clearSession: vi.fn(),
    })
  })

  it('aborts reauthentication on unmount and does not continue to logout-all', async () => {
    /** @type {AbortSignal | undefined} */
    let requestSignal

    vi.mocked(reauthenticate).mockImplementation((_, signal) => {
      requestSignal = signal

      return new Promise((_, reject) => {
        signal?.addEventListener(
          'abort',
          () => {
            reject(new DOMException('Request aborted', 'AbortError'))
          },
          { once: true },
        )
      })
    })

    const { unmount } = render(
      <MemoryRouter>
        <LogoutAllPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Log out from all sessions',
      }),
    )

    await waitFor(() => {
      expect(reauthenticate).toHaveBeenCalledTimes(1)
    })

    expect(requestSignal).toBeDefined()
    expect(requestSignal?.aborted).toBe(false)

    await act(async () => {
      unmount()
    })

    expect(requestSignal?.aborted).toBe(true)
    expect(logoutAll).not.toHaveBeenCalled()
  })
})
