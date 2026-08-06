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
    render(
      <PresetList
        presets={[]}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onExport={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Created presets' })).toBeInTheDocument()
    expect(screen.getByText('No presets created yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add new preset' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Export presets' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Import presets' })).toBeEnabled()
  })

  it('renders preset names and icon actions', () => {
    const presets: readonly Preset[] = [
      { id: 'preset-1', name: 'Weekly servers', enabledServerIds: [] },
    ]

    render(
      <PresetList
        presets={presets}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onExport={vi.fn()}
      />,
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText('Weekly servers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit preset Weekly servers' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete preset Weekly servers' })).toBeEnabled()
  })

  it('calls onDelete with the selected preset and delete trigger', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const preset: Preset = { id: 'preset-1', name: 'Weekly servers', enabledServerIds: [] }

    render(
      <PresetList
        presets={[preset]}
        onAdd={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
        onExport={vi.fn()}
      />,
    )
    const deleteButton = screen.getByRole('button', { name: 'Delete preset Weekly servers' })
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(preset, deleteButton)
  })

  it('opens preset export while leaving import as a placeholder', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()
    render(
      <PresetList
        presets={[]}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onExport={onExport}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Export presets' }))
    await user.click(screen.getByRole('button', { name: 'Import presets' }))

    expect(onExport).toHaveBeenCalledOnce()
  })
})
