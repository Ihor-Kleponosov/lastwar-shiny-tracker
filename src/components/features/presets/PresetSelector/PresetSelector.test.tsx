import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { PresetSelector } from '.'

describe('PresetSelector', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the UI-only preset controls', () => {
    render(
      <PresetSelector
        serverGroups={[[1638, 1643], [1639], [1637, 1641]]}
        onEditPresets={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Presets' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Presets' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Edit Presets' })).toBeEnabled()
  })

  it('opens and closes the options without changing application state', async () => {
    const user = userEvent.setup()

    render(<PresetSelector serverGroups={[[1638], [1639], [1640]]} onEditPresets={vi.fn()} />)

    const trigger = screen.getByRole('button', { name: 'Presets' })
    await user.click(trigger)

    expect(screen.getByRole('option', { name: 'Group A' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await user.click(screen.getByRole('option', { name: 'Group A' }))
    expect(screen.getByRole('option', { name: 'Group A' })).toHaveAttribute(
      'aria-selected',
      'false',
    )

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens the presets page when edit is clicked', async () => {
    const user = userEvent.setup()
    const onEditPresets = vi.fn()

    render(<PresetSelector serverGroups={[[1638]]} onEditPresets={onEditPresets} />)

    await user.click(screen.getByRole('button', { name: 'Edit Presets' }))

    expect(onEditPresets).toHaveBeenCalledOnce()
  })
})
