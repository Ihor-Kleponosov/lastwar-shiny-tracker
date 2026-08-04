import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { PresetsPage } from '.'

describe('PresetsPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the shared header and hardcoded presets', () => {
    render(<PresetsPage onBack={vi.fn()} onNavigateHome={vi.fn()} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Presets' })).toBeInTheDocument()
    expect(screen.getByText('Manage your saved server lists.')).toBeInTheDocument()
    expect(screen.getByText('Main servers')).toBeInTheDocument()
    expect(screen.getByText('Event servers')).toBeInTheDocument()
    expect(screen.getByText('Backup servers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled()
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
