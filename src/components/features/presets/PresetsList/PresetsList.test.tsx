import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { PresetsList } from '.'

const presets: readonly Preset[] = [
  { id: 'first', name: 'First preset', enabledServerIds: [1638] },
  { id: 'second', name: 'Second preset', enabledServerIds: [1639] },
]

describe('PresetsList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders one server list for every selected preset in order', () => {
    render(<PresetsList presets={presets} selectedDate={new Date(2026, 6, 15)} />)

    expect(
      screen.getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent),
    ).toEqual(['First preset', 'Second preset'])
    expect(screen.getByText('1638')).toBeInTheDocument()
    expect(screen.queryByText('1639')).not.toBeInTheDocument()
    expect(screen.queryByText('Select one or more presets to display')).not.toBeInTheDocument()
  })

  it('explains selection ordering without selected presets', () => {
    render(<PresetsList presets={[]} selectedDate={new Date(2026, 6, 15)} />)

    expect(
      screen.getByText(
        'Select one or more presets to display. Preset blocks appear in the order you select them.',
      ),
    ).toBeInTheDocument()
  })
})
