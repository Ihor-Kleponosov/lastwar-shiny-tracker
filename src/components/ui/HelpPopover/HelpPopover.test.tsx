import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HelpPopover } from '.'

function createRect({
  bottom,
  height,
  left,
  right,
  top,
}: {
  bottom: number
  height: number
  left: number
  right: number
  top: number
}): DOMRect {
  return { bottom, height, left, right, top } as DOMRect
}

afterEach(() => {
  vi.restoreAllMocks()
})

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

  it('measures and updates its viewport-clamped position on resize and scroll', async () => {
    let containerRect = createRect({ bottom: 80, height: 44, left: 300, right: 344, top: 36 })
    let triggerRect = createRect({ bottom: 80, height: 44, left: 300, right: 344, top: 36 })
    const popoverRect = createRect({ bottom: 196, height: 160, left: 0, right: 0, top: 0 })

    Object.defineProperties(document.documentElement, {
      clientHeight: { configurable: true, value: 640 },
      clientWidth: { configurable: true, value: 360 },
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.getAttribute('aria-label') === 'About servers') return triggerRect
      if (this.getAttribute('role') === 'dialog') return popoverRect
      return containerRect
    })

    const user = userEvent.setup()
    render(
      <HelpPopover label="About servers" closeLabel="Close server help">
        <p>Server help text</p>
      </HelpPopover>,
    )

    await user.click(screen.getByRole('button', { name: 'About servers' }))
    const popover = screen.getByRole('dialog', { name: 'About servers' })
    expect(popover).toHaveStyle({ left: '-284px', maxHeight: '536px', top: '52px', width: '328px' })

    Object.defineProperties(document.documentElement, {
      clientHeight: { configurable: true, value: 800 },
      clientWidth: { configurable: true, value: 1280 },
    })
    triggerRect = createRect({ bottom: 80, height: 44, left: 956, right: 1000, top: 36 })
    window.dispatchEvent(new Event('resize'))

    await waitFor(() => expect(popover).toHaveStyle({ left: '252px', width: '448px' }))

    containerRect = createRect({ bottom: 44, height: 44, left: 300, right: 344, top: 0 })
    triggerRect = createRect({ bottom: 104, height: 44, left: 956, right: 1000, top: 60 })
    window.dispatchEvent(new Event('scroll'))

    await waitFor(() => expect(popover).toHaveStyle({ top: '112px' }))
  })
})
