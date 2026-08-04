import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { PresetsPage } from '.'

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }))

vi.mock('sonner', () => ({ toast: { error: toastError, success: vi.fn() } }))

describe('PresetsPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    toastError.mockClear()
  })

  it('renders the shared header and the default preset', async () => {
    localStorage.clear()
    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Presets' })).toBeInTheDocument()
    expect(screen.getByText('Manage your saved server lists.')).toBeInTheDocument()
    expect(await screen.findByText('Default preset')).toBeInTheDocument()
    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toContain('Default preset')
    expect(screen.getByRole('status', { name: 'Default preset applied' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled()
  })

  it('does not show the default notice for an explicitly stored empty list', async () => {
    localStorage.setItem('last-war-shiny-tracker-presets', JSON.stringify([]))

    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    expect(await screen.findByText('No presets created yet.')).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Default preset applied' })).not.toBeInTheDocument()
  })

  it('closes the default preset notice manually', async () => {
    const user = userEvent.setup()
    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Close default preset notification' }))
    expect(screen.queryByRole('status', { name: 'Default preset applied' })).not.toBeInTheDocument()
  })

  it('shows a limit toast instead of opening the add modal at five presets', async () => {
    localStorage.setItem(
      'last-war-shiny-tracker-presets',
      JSON.stringify(
        Array.from({ length: 5 }, (_, index) => ({
          id: `preset-${index}`,
          name: `Preset ${index}`,
          enabledServerIds: [],
        })),
      ),
    )
    const user = userEvent.setup()
    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    await user.click(await screen.findByRole('button', { name: 'Add new preset' }))

    expect(toastError).toHaveBeenCalledWith("You can't create more than 5 presets.")
    expect(screen.queryByRole('dialog', { name: 'Add preset' })).not.toBeInTheDocument()
  })

  it('uses stored presets and persists changes', async () => {
    localStorage.setItem(
      'last-war-shiny-tracker-presets',
      JSON.stringify([{ id: 'stored', name: 'Stored servers', enabledServerIds: [1638] }]),
    )

    const user = userEvent.setup()
    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    expect(screen.getByText('Stored servers')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete preset Stored servers' }))
    expect(JSON.parse(localStorage.getItem('last-war-shiny-tracker-presets') ?? '')).toEqual([])
  })

  it('shows an error and preserves invalid stored data', async () => {
    const storedPresets = '{invalid JSON'
    localStorage.setItem('last-war-shiny-tracker-presets', storedPresets)

    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    expect(await screen.findByText('No presets created yet.')).toBeInTheDocument()
    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('Saved presets could not be loaded.'),
    )
    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toBe(storedPresets)
  })

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(<PresetsPage onBack={onBack} onNavigateHome={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('opens the preset configuration modal for a new preset', async () => {
    const user = userEvent.setup()

    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Add new preset' }))

    expect(screen.getByRole('dialog', { name: 'Add preset' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Preset name' })).toHaveValue('')
  })
})
