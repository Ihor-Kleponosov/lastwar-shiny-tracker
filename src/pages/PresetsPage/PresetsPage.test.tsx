import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
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
    expect(screen.getByText('Manage your saved server lists.')).toBeInTheDocument()
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

    expect(toastError).toHaveBeenCalledWith("You can't create more than 30 presets.")
    expect(screen.queryByRole('dialog', { name: 'Add preset' })).not.toBeInTheDocument()
  })

  it('uses stored presets and persists changes', async () => {
    const user = userEvent.setup()
    const onDeletePreset = vi.fn()
    renderPage({
      presets: [{ id: 'stored', name: 'Stored servers', enabledServerIds: [1638] }],
      onDeletePreset,
    })

    expect(screen.getByText('Stored servers')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete preset Stored servers' }))
    expect(onDeletePreset).toHaveBeenCalledWith({
      id: 'stored',
      name: 'Stored servers',
      enabledServerIds: [1638],
    })
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
})
