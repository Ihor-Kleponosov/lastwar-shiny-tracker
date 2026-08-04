import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { PresetSelector } from '.'

const presets: readonly Preset[] = [
  { id: 'weekly', name: 'Weekly servers', enabledServerIds: [1638] },
  { id: 'weekend', name: 'Weekend servers', enabledServerIds: [1639] },
]

function PresetSelectorHarness({ onEditPresets = vi.fn() }: { onEditPresets?: () => void }) {
  const [checkedPresetIds, setCheckedPresetIds] = useState<ReadonlySet<string>>(() => new Set())

  return (
    <PresetSelector
      checkedPresetIds={checkedPresetIds}
      onEditPresets={onEditPresets}
      onSelectedPresetIdsChange={setCheckedPresetIds}
      presets={presets}
    />
  )
}

describe('PresetSelector', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders preset names as selector options', async () => {
    render(<PresetSelectorHarness />)

    expect(screen.getByRole('heading', { name: 'Presets' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Presets' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Edit Presets' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Presets' }))
    expect(screen.getByRole('option', { name: 'Weekly servers' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    expect(screen.getByRole('option', { name: 'Weekend servers' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('opens and closes the options without changing application state', async () => {
    const user = userEvent.setup()

    render(<PresetSelectorHarness />)

    const trigger = screen.getByRole('button', { name: 'Presets' })
    await user.click(trigger)

    expect(screen.getByRole('option', { name: 'Weekly servers' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await user.click(screen.getByRole('checkbox', { name: 'Weekly servers' }))
    expect(screen.getByRole('option', { name: 'Weekly servers' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Presets' })).toHaveTextContent('Weekly servers')
    await user.click(screen.getByRole('checkbox', { name: 'Weekend servers' }))
    expect(screen.getByRole('button', { name: 'Presets' })).toHaveTextContent(
      'Weekly servers, Weekend servers',
    )
    await user.click(screen.getByRole('checkbox', { name: 'Weekly servers' }))
    expect(screen.getByRole('option', { name: 'Weekly servers' })).toHaveAttribute(
      'aria-selected',
      'false',
    )

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows guidance when no presets are available', async () => {
    const user = userEvent.setup()

    render(
      <PresetSelector
        checkedPresetIds={new Set()}
        onEditPresets={vi.fn()}
        onSelectedPresetIdsChange={vi.fn()}
        presets={[]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Presets' }))

    expect(screen.getByText('No presets available. Create one to see it here')).toBeInTheDocument()
  })

  it('opens the presets page when edit is clicked', async () => {
    const user = userEvent.setup()
    const onEditPresets = vi.fn()

    render(<PresetSelectorHarness onEditPresets={onEditPresets} />)

    await user.click(screen.getByRole('button', { name: 'Edit Presets' }))

    expect(onEditPresets).toHaveBeenCalledOnce()
  })
})
