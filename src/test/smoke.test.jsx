import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function TestComponent() {
  return <h1>Frontend tests are working</h1>
}

describe('test environment', () => {
  it('renders a React component', () => {
    render(<TestComponent />)

    expect(
      screen.getByRole('heading', {
        name: 'Frontend tests are working',
      }),
    ).toBeInTheDocument()
  })
})
