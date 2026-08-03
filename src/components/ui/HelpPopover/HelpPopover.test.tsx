import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { HelpPopover } from '.'

describe('HelpPopover', () => {
  it('opens and closes with its controls, Escape, and outside clicks', async () => {
    const user = userEvent.setup()

    render(
      <>
        <button type="button">Outside</button>
        <HelpPopover label="About servers" closeLabel="Close server help">
          <p>Server help text</p>
        </HelpPopover>
      </>,
    )

    const trigger = screen.getByRole('button', { name: 'About servers' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'About servers' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close server help' }))
    expect(screen.queryByRole('dialog', { name: 'About servers' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'About servers' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog', { name: 'About servers' })).not.toBeInTheDocument()
  })
})
