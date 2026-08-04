import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { SELECTED_PRESET_IDS_STORAGE_KEY } from '@/utils/presets'
import { MainPage } from '.'

const presets: readonly Preset[] = [
  { id: 'first', name: 'First preset', enabledServerIds: [1638] },
  { id: 'second', name: 'Second preset', enabledServerIds: [1639] },
]

describe('MainPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
  })

  it('restores and persists the selected preset IDs', async () => {
    localStorage.setItem(SELECTED_PRESET_IDS_STORAGE_KEY, JSON.stringify(['second']))
    const user = userEvent.setup()

    render(<MainPage onNavigateHome={vi.fn()} onOpenPresets={vi.fn()} presets={presets} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Presets' })).toHaveTextContent('Second preset')
      expect(screen.getByRole('heading', { name: 'Second preset' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Presets' }))
    await user.click(screen.getByRole('checkbox', { name: 'First preset' }))

    expect(localStorage.getItem(SELECTED_PRESET_IDS_STORAGE_KEY)).toBe(
      JSON.stringify(['second', 'first']),
    )
  })

  it('removes unavailable selected presets from state and storage', async () => {
    localStorage.setItem(SELECTED_PRESET_IDS_STORAGE_KEY, JSON.stringify(['first', 'second']))
    const { rerender } = render(
      <MainPage onNavigateHome={vi.fn()} onOpenPresets={vi.fn()} presets={presets} />,
    )

    rerender(<MainPage onNavigateHome={vi.fn()} onOpenPresets={vi.fn()} presets={[presets[0]]} />)

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Second preset' })).not.toBeInTheDocument()
      expect(localStorage.getItem(SELECTED_PRESET_IDS_STORAGE_KEY)).toBe(JSON.stringify(['first']))
    })
  })

  it('renders selected presets and exports the first rendered preset', async () => {
    const user = userEvent.setup()
    render(<MainPage onNavigateHome={vi.fn()} onOpenPresets={vi.fn()} presets={presets} />)

    await user.click(screen.getByRole('button', { name: 'Presets' }))
    await user.click(screen.getByRole('checkbox', { name: 'Second preset' }))
    await user.click(screen.getByRole('checkbox', { name: 'First preset' }))

    expect(
      screen.getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent),
    ).toEqual(['Presets', 'First preset', 'Second preset'])

    await user.click(screen.getByRole('button', { name: 'Download image' }))
    await user.click(screen.getByRole('button', { name: 'Proceed' }))

    const exportView = screen.getByTestId('export-view')
    expect(within(exportView).getByText('1638')).toBeInTheDocument()
    expect(within(exportView).queryByText('1639')).not.toBeInTheDocument()
  })

  it('passes an empty server set to export when no presets are selected', async () => {
    const user = userEvent.setup()
    render(<MainPage onNavigateHome={vi.fn()} onOpenPresets={vi.fn()} presets={presets} />)

    await user.click(screen.getByRole('button', { name: 'Download image' }))
    await user.click(screen.getByRole('button', { name: 'Proceed' }))

    expect(within(screen.getByTestId('export-view')).queryByRole('list')).not.toBeInTheDocument()
  })
})
