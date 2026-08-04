import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Notification } from '.'

describe('Notification', () => {
  it('renders a labelled status and calls onClose from its close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Notification
        closeLabel="Close notification"
        label="Default preset applied"
        onClose={onClose}
        open
      >
        <p>The default preset was applied.</p>
      </Notification>,
    )

    expect(
      screen.getByRole('status', { name: 'Default preset applied' }).parentElement,
    ).toHaveClass('fixed')
    await user.click(screen.getByRole('button', { name: 'Close notification' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render while closed', () => {
    render(
      <Notification
        closeLabel="Close notification"
        label="Default preset applied"
        onClose={vi.fn()}
        open={false}
      >
        <p>The default preset was applied.</p>
      </Notification>,
    )

    expect(screen.queryByRole('status', { name: 'Default preset applied' })).not.toBeInTheDocument()
  })
})
