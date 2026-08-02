import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { ConfigurationModal } from '.'

type ConfigurationModalHarnessProps = {
  onClose: () => void
}

function ConfigurationModalHarness({ onClose }: ConfigurationModalHarnessProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AnimatePresence>
      {isOpen ? (
        <ConfigurationModal
          onClose={() => {
            onClose()
            setIsOpen(false)
          }}
          returnFocusRef={{ current: null }}
        />
      ) : null}
    </AnimatePresence>
  )
}

describe('ConfigurationModal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders a labelled dialog with a close action', () => {
    render(<ConfigurationModal onClose={vi.fn()} returnFocusRef={{ current: null }} />)

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close settings' })).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<ConfigurationModal onClose={onClose} returnFocusRef={{ current: null }} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('remains accessible until its close animation completes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<ConfigurationModalHarness onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Close settings' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
    })
  })

  it('renders and closes when reduced motion is preferred', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )

    render(<ConfigurationModal onClose={onClose} returnFocusRef={{ current: null }} />)

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })
})
