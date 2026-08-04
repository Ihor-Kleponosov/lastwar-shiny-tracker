import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { PresetList } from '.'

describe('PresetList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders an empty state and add button when there are no presets', () => {
    render(<PresetList presets={[]} onAdd={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Created presets' })).toBeInTheDocument()
    expect(screen.getByText('No presets created yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add new preset' })).toBeEnabled()
  })

  it('renders preset names and icon actions', () => {
    const presets: readonly Preset[] = [
      { id: 'preset-1', name: 'Weekly servers', enabledServerIds: [] },
    ]

    render(<PresetList presets={presets} onAdd={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText('Weekly servers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit preset Weekly servers' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete preset Weekly servers' })).toBeEnabled()
  })

  it('calls onDelete with the selected preset', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const preset: Preset = { id: 'preset-1', name: 'Weekly servers', enabledServerIds: [] }

    render(<PresetList presets={[preset]} onAdd={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Delete preset Weekly servers' }))

    expect(onDelete).toHaveBeenCalledWith(preset)
  })
})
