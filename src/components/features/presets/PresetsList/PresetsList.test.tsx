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
  })

  it('renders nothing without selected presets', () => {
    const { container } = render(<PresetsList presets={[]} selectedDate={new Date(2026, 6, 15)} />)

    expect(container).toBeEmptyDOMElement()
  })
})
