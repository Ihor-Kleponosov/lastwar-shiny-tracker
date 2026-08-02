import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { ConfigurationModal } from '.'

function ConfigurationModalHarness() {
  const [isOpen, setIsOpen] = useState(true)
  const returnFocusRef = createRef<HTMLButtonElement>()

  return (
    <>
      <button ref={returnFocusRef} type="button">
        Open settings
      </button>
      {isOpen ? (
        <ConfigurationModal onClose={() => setIsOpen(false)} returnFocusRef={returnFocusRef} />
      ) : null}
    </>
  )
}

describe('ConfigurationModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders a labelled dialog with a close action', () => {
    render(<ConfigurationModal onClose={vi.fn()} returnFocusRef={{ current: null }} />)

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close settings' })).toBeInTheDocument()
  })

  it('locks scroll, traps focus, and restores focus after closing', async () => {
    const user = userEvent.setup()

    render(<ConfigurationModalHarness />)

    const closeButton = screen.getByRole('button', { name: 'Close settings' })
    expect(document.body).toHaveStyle({ overflow: 'hidden' })
    expect(closeButton).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveFocus()
  })
})
