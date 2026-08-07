import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { STORAGE_NOTICE_SHOWN_KEY } from '@/utils/presets'
import { PresetsPage } from '.'

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))
const { downloadPresetTransfer } = vi.hoisted(() => ({ downloadPresetTransfer: vi.fn() }))

vi.mock('sonner', () => ({ toast: { error: toastError, success: toastSuccess } }))
vi.mock('@/utils/presetTransfer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/presetTransfer')>()),
  downloadPresetTransfer,
}))

describe('PresetsPage', () => {
  const defaultProps = {
    onBack: vi.fn(),
    onNavigateHome: vi.fn(),
    presets: [] as readonly Preset[],
    onDeletePreset: vi.fn(),
    onSavePreset: vi.fn(() => true),
    onImportPresets: vi.fn(() => true),
  }

  function renderPage(overrides: Partial<typeof defaultProps> = {}) {
    return render(<PresetsPage {...defaultProps} {...overrides} />)
  }

  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    toastError.mockClear()
    toastSuccess.mockClear()
    downloadPresetTransfer.mockClear()
  })

  it('renders the shared header and provided presets', () => {
    renderPage({
      presets: [{ id: 'default', name: 'Default preset', enabledServerIds: [] }],
    })

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Presets' })).toBeInTheDocument()
    expect(screen.getByText('Manage your saved server lists')).toBeInTheDocument()
    expect(screen.getByText('Default preset')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled()
  })

  it('shows a limit toast instead of opening the add modal at thirty presets', async () => {
    localStorage.setItem(
      'last-war-shiny-tracker-presets',
      JSON.stringify(
        Array.from({ length: 30 }, (_, index) => ({
          id: `preset-${index}`,
          name: `Preset ${index}`,
          enabledServerIds: [],
        })),
      ),
    )
    const user = userEvent.setup()
    renderPage({
      presets: Array.from({ length: 30 }, (_, index) => ({
        id: `preset-${index}`,
        name: `Preset ${index}`,
        enabledServerIds: [],
      })),
    })

    await user.click(await screen.findByRole('button', { name: 'Add new preset' }))

    expect(toastError).toHaveBeenCalledWith("You can't create more than 30 presets")
    expect(screen.queryByRole('dialog', { name: 'Add preset' })).not.toBeInTheDocument()
  })

  it('confirms before deleting a preset and returns focus to its delete button', async () => {
    const user = userEvent.setup()
    const onDeletePreset = vi.fn()
    const preset = { id: 'stored', name: 'Stored servers', enabledServerIds: [1638] }
    renderPage({
      presets: [preset],
      onDeletePreset,
    })

    expect(screen.getByText('Stored servers')).toBeInTheDocument()
    const deleteButton = screen.getByRole('button', { name: 'Delete preset Stored servers' })
    await user.click(deleteButton)

    expect(screen.getByRole('alertdialog', { name: 'Delete preset?' })).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete “Stored servers”?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    expect(onDeletePreset).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Delete preset' }))

    expect(onDeletePreset).toHaveBeenCalledWith(preset)
    expect(deleteButton).toHaveFocus()
  })

  it('cancels preset deletion with Cancel, Escape, or a backdrop click', async () => {
    const user = userEvent.setup()
    const onDeletePreset = vi.fn()
    renderPage({
      presets: [{ id: 'stored', name: 'Stored servers', enabledServerIds: [1638] }],
      onDeletePreset,
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete preset Stored servers' })
    await user.click(deleteButton)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(deleteButton).toHaveFocus()

    await user.click(deleteButton)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(deleteButton).toHaveFocus()

    await user.click(deleteButton)
    const dialog = screen.getByRole('alertdialog')
    fireEvent.mouseDown(dialog.parentElement as HTMLElement)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(onDeletePreset).not.toHaveBeenCalled()
    expect(deleteButton).toHaveFocus()
  })

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    renderPage({ onBack })
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('opens the preset configuration modal for a new preset', async () => {
    const user = userEvent.setup()

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Add new preset' }))

    expect(screen.getByRole('dialog', { name: 'Add preset' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Preset name' })).toHaveValue('')
  })

  it('exports selected presets in their existing order and restores focus on dismissal', async () => {
    const user = userEvent.setup()
    const presets = [
      { id: 'first', name: 'First preset', enabledServerIds: [1638] },
      { id: 'second', name: 'Second preset', enabledServerIds: [1639] },
    ]
    renderPage({ presets })

    const trigger = screen.getByRole('button', { name: 'Export presets' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Export presets' })
    expect(within(dialog).getByRole('button', { name: 'Export presets' })).toBeDisabled()
    await user.click(screen.getByRole('checkbox', { name: 'Second preset' }))
    await user.click(screen.getByRole('checkbox', { name: 'First preset' }))
    await user.click(within(dialog).getByRole('button', { name: 'Export presets' }))

    expect(downloadPresetTransfer).toHaveBeenCalledWith(presets)
    expect(dialog).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Export presets' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('selects and clears all presets in the export dialog', async () => {
    const user = userEvent.setup()
    renderPage({
      presets: [
        { id: 'first', name: 'First preset', enabledServerIds: [1638] },
        { id: 'second', name: 'Second preset', enabledServerIds: [1639] },
      ],
    })

    await user.click(screen.getByRole('button', { name: 'Export presets' }))
    await user.click(screen.getByRole('button', { name: 'Select all' }))
    expect(screen.getByRole('checkbox', { name: 'First preset' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Second preset' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('checkbox', { name: 'First preset' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Second preset' })).not.toBeChecked()
    expect(
      within(screen.getByRole('dialog', { name: 'Export presets' })).getByRole('button', {
        name: 'Export presets',
      }),
    ).toBeDisabled()
  })

  it('imports only selected presets from a valid export and reports success', async () => {
    const user = userEvent.setup()
    const onImportPresets = vi.fn(() => true)
    renderPage({ onImportPresets })

    await user.click(screen.getByRole('button', { name: 'Import presets' }))
    const serializedTransfer = JSON.stringify({
      version: 1,
      presets: [
        { id: 'first', name: 'First preset', enabledServerIds: [1638] },
        { id: 'second', name: 'Second preset', enabledServerIds: [] },
      ],
    })
    const file = new File([serializedTransfer], 'presets.lwst', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: () => Promise.resolve(serializedTransfer) })
    const importFileInput = screen.getByLabelText('Preset backup file (.lwst)')
    expect(importFileInput).toHaveAttribute('accept', '.lwst')
    await user.upload(importFileInput, file)

    expect(await screen.findByRole('checkbox', { name: 'First preset' })).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Select all' }))
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    await user.click(screen.getByRole('checkbox', { name: 'Second preset' }))
    await user.click(
      within(screen.getByRole('dialog', { name: 'Import presets' })).getByRole('button', {
        name: 'Import presets',
      }),
    )

    expect(onImportPresets).toHaveBeenCalledWith([
      { id: 'second', name: 'Second preset', enabledServerIds: [] },
    ])
    expect(toastSuccess).toHaveBeenCalledWith('Imported 1 preset')
  })

  it('keeps the import dialog open and reports an error when persistence fails', async () => {
    const user = userEvent.setup()
    renderPage({ onImportPresets: vi.fn(() => false) })
    await user.click(screen.getByRole('button', { name: 'Import presets' }))
    const serializedTransfer = JSON.stringify({
      version: 1,
      presets: [{ id: 'first', name: 'First preset', enabledServerIds: [] }],
    })
    const file = new File([serializedTransfer], 'presets.lwst', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: () => Promise.resolve(serializedTransfer) })
    await user.upload(screen.getByLabelText('Preset backup file (.lwst)'), file)
    await user.click(await screen.findByRole('checkbox', { name: 'First preset' }))
    await user.click(
      within(screen.getByRole('dialog', { name: 'Import presets' })).getByRole('button', {
        name: 'Import presets',
      }),
    )

    expect(toastError).toHaveBeenCalledWith('Presets could not be imported')
    expect(screen.getByRole('dialog', { name: 'Import presets' })).toBeInTheDocument()
  })

  it('shows the storage notice once when the page is first opened', async () => {
    const user = userEvent.setup()

    const { unmount } = renderPage()

    expect(
      await screen.findByRole('status', { name: 'Your data stays on your device.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'This app stores all presets locally instead of uploading them to a server. Your settings are available only in this browser on this device.',
      ),
    ).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_NOTICE_SHOWN_KEY)).toBe('true')

    await user.click(screen.getByRole('button', { name: 'Close storage information' }))
    await user.click(screen.getByRole('button', { name: 'About the server list' }))
    expect(screen.getByText('Your data stays on your device.')).toBeInTheDocument()

    unmount()
    renderPage()

    expect(
      screen.queryByRole('status', { name: 'Your data stays on your device.' }),
    ).not.toBeInTheDocument()
  })
})
