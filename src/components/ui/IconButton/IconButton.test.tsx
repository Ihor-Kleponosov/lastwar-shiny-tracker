import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconButton } from '.'

describe('IconButton', () => {
  it('uses a button default and forwards accessible props, content, and classes', () => {
    render(
      <IconButton aria-label="Open settings" className="w-auto" disabled>
        Settings
      </IconButton>,
    )

    const button = screen.getByRole('button', { name: 'Open settings' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Settings')
    expect(button).toHaveClass(
      'size-11',
      'w-auto',
      'border',
      'bg-[var(--color-surface-elevated)]',
      'px-3',
      'py-2',
    )
  })
})
