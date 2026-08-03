import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import { ConfigurationModal } from '.'

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: toastError, success: toastSuccess } }))

const configurationModalProps = {
  enabledServerIds: new Set(getConfiguredServerIds()),
  serverIds: getConfiguredServerIds(),
  onSave: vi.fn(),
}

function ConfigurationModalHarness({
  onSave = vi.fn(),
}: {
  onSave?: (serverIds: ReadonlySet<number>) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [enabledServerIds, setEnabledServerIds] = useState(configurationModalProps.enabledServerIds)
  const returnFocusRef = createRef<HTMLButtonElement>()

  function handleSave(serverIds: ReadonlySet<number>) {
    setEnabledServerIds(new Set(serverIds))
    onSave(serverIds)
  }

  return (
    <>
      <button ref={returnFocusRef} type="button">
        Open settings
      </button>
      {isOpen ? (
        <ConfigurationModal
          {...configurationModalProps}
          enabledServerIds={enabledServerIds}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
          returnFocusRef={returnFocusRef}
        />
      ) : null}
    </>
  )
}

describe('ConfigurationModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    toastError.mockClear()
    toastSuccess.mockClear()
  })

  it('renders a labelled dialog with a close action', () => {
    render(
      <ConfigurationModal
        {...configurationModalProps}
        onClose={vi.fn()}
        returnFocusRef={{ current: null }}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('opens and closes the server-list description popover', async () => {
    const user = userEvent.setup()

    render(
      <ConfigurationModal
        {...configurationModalProps}
        onClose={vi.fn()}
        returnFocusRef={{ current: null }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'About the server list' }))

    expect(screen.getByRole('dialog', { name: 'About the server list' })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'About the server list' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'About the server list' }))

    await user.click(screen.getByRole('button', { name: 'Close server-list description' }))

    expect(screen.queryByRole('dialog', { name: 'About the server list' })).not.toBeInTheDocument()
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

  it('saves only draft changes and closes the modal', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<ConfigurationModalHarness onSave={onSave} />)

    const serverCheckbox = screen.getByRole('checkbox', { name: '1638' })
    await user.click(serverCheckbox)

    expect(serverCheckbox).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(onSave).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave.mock.calls[0][0].has(1638)).toBe(false)
    expect(toastSuccess).toHaveBeenCalledWith('Preferences saved')
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('prevents selecting more than 75 servers and reports the limit', async () => {
    const user = userEvent.setup()
    const serverIds = Array.from({ length: 76 }, (_, index) => index + 1)

    render(
      <ConfigurationModal
        enabledServerIds={new Set(serverIds.slice(0, 75))}
        serverIds={serverIds}
        onClose={vi.fn()}
        onSave={vi.fn()}
        returnFocusRef={{ current: null }}
      />,
    )

    expect(screen.getByText('Selected: 75 / 75')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: '76' }))

    expect(screen.getByRole('checkbox', { name: '76' })).not.toBeChecked()
    expect(toastError).toHaveBeenCalledWith('You can select up to 75 servers.')
  })

  it('adds only the available servers during a bulk selection and reports the limit', async () => {
    const user = userEvent.setup()
    const serverIds = Array.from({ length: 76 }, (_, index) => index + 1)

    render(
      <ConfigurationModal
        enabledServerIds={new Set(serverIds.slice(0, 74))}
        serverIds={serverIds}
        onClose={vi.fn()}
        onSave={vi.fn()}
        returnFocusRef={{ current: null }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Select all' }))

    expect(screen.getByRole('checkbox', { name: '75' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '76' })).not.toBeChecked()
    expect(screen.getByText('Selected: 75 / 75')).toBeInTheDocument()
    expect(toastError).toHaveBeenCalledWith('You can select up to 75 servers.')
  })

  it('requires confirmation before closing dirty settings and preserves the draft on return', async () => {
    const user = userEvent.setup()

    render(<ConfigurationModalHarness />)

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(screen.getByRole('alertdialog', { name: 'Unsaved changes' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Return' }))

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(cancelButton).toHaveFocus()
    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('discards dirty settings after confirmation', async () => {
    const user = userEvent.setup()

    render(<ConfigurationModalHarness />)

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    await user.click(screen.getByRole('button', { name: 'Close settings' }))
    await user.click(screen.getByRole('button', { name: 'Discard changes' }))

    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('returns to dirty settings when the confirmation is dismissed with Escape', async () => {
    const user = userEvent.setup()

    render(<ConfigurationModalHarness />)

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    const closeButton = screen.getByRole('button', { name: 'Close settings' })
    await user.click(closeButton)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('alertdialog', { name: 'Unsaved changes' })).not.toBeInTheDocument()
    expect(closeButton).toHaveFocus()
    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
  })

  it('returns to dirty settings when the confirmation backdrop is clicked', async () => {
    const user = userEvent.setup()

    render(<ConfigurationModalHarness />)

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    const closeButton = screen.getByRole('button', { name: 'Close settings' })
    await user.click(closeButton)
    await user.click(screen.getByRole('alertdialog', { name: 'Unsaved changes' }).parentElement!)

    expect(screen.queryByRole('alertdialog', { name: 'Unsaved changes' })).not.toBeInTheDocument()
    expect(closeButton).toHaveFocus()
    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
  })
})
