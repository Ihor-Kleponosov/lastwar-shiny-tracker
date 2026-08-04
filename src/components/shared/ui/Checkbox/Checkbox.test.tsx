import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '.'

describe('Checkbox', () => {
  it('uses a native checkbox and calls its change handler', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Checkbox checked={false} label="Select items" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Select items' })
    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('shows the accent-colored mark when checked', () => {
    const { container } = render(<Checkbox checked label="Deselect items" readOnly />)

    expect(screen.getByRole('checkbox', { name: 'Deselect items' })).toBeChecked()
    expect(container.querySelector('svg')).toHaveClass('text-[var(--color-accent)]', 'opacity-100')
  })
})
