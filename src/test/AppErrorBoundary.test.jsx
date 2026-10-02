import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppErrorBoundary } from '../shared/components/errors/AppErrorBoundary'

/** @returns {import('react').JSX.Element} */
function BrokenComponent() {
  throw new Error('Boom')
}
describe('AppErrorBoundary', () => {
  it('renders fallback UI when a descendant throws during render', () => {
    render(
      <AppErrorBoundary>
        <BrokenComponent />
      </AppErrorBoundary>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Reload page' }),
    ).toBeInTheDocument()
  })
})
