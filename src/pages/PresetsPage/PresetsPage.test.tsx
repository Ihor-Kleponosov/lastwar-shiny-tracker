import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { STORAGE_NOTICE_SHOWN_KEY } from '@/utils/presets'
import { PresetsPage } from '.'

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }))

vi.mock('sonner', () => ({ toast: { error: toastError, success: vi.fn() } }))

describe('PresetsPage', () => {
  const defaultProps = {
    onBack: vi.fn(),
    onNavigateHome: vi.fn(),
    presets: [] as readonly Preset[],
    onDeletePreset: vi.fn(),
    onSavePreset: vi.fn(() => true),
  }

  function renderPage(overrides: Partial<typeof defaultProps> = {}) {
    return render(<PresetsPage {...defaultProps} {...overrides} />)
  }

  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    toastError.mockClear()
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
