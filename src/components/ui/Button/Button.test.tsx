import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '.'

describe('Button', () => {
  it('uses the secondary style and forwards button props', () => {
    render(
      <Button className="w-full" disabled variant="secondary">
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'min-h-11',
      'rounded-xl',
      'border-[var(--color-border)]',
      'bg-[var(--color-surface-elevated)]',
      'w-full',
    )
  })

  it('uses the primary style by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'bg-[var(--color-accent)]',
      'text-[var(--color-accent-contrast)]',
    )
  })

  it('uses the danger style when requested', () => {
    render(<Button variant="danger">Delete</Button>)

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'bg-[var(--color-danger)]',
      'text-white',
    )
  })
})
