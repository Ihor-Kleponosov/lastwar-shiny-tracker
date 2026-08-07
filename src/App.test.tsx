import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays, format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { getServerDate } from '@/utils/serverTime'
import App from './App'

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }))

vi.mock('sonner', () => ({ toast: { error: toastError, success: vi.fn() } }))

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
    toastError.mockClear()
  })

  it('shows the selected date and closes the calendar after selecting a day', async () => {
    const serverDate = getServerDate(new Date(), shinyTasksConfiguration.serverTimeZone)
    const nextDate = addDays(serverDate, 1)

    render(<App />)

    expect(screen.getByText(format(serverDate, 'P'))).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Calendar' })).not.toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: 'Show calendar' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Hide calendar' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Calendar' }).closest('div')).toHaveClass(
      'absolute',
      'z-20',
    )

    fireEvent.click(screen.getByRole('button', { name: format(nextDate, 'PPPP') }))

    expect(screen.getByText(format(nextDate, 'P'))).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Calendar' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Show calendar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Today' }))

    expect(screen.getByText(format(serverDate, 'P'))).toBeInTheDocument()
  })

  it('navigates between the main page and the presets page', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit Presets' }))

    expect(screen.getByRole('heading', { name: 'Edit Presets' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to main page' }))

    expect(screen.getByRole('heading', { name: 'Presets' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Edit Presets' })).not.toBeInTheDocument()
  })

  it('creates and selects a nearby-server preset after first-load confirmation', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByRole('dialog', { name: 'Create your first preset' })).toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: 'Your server number' })
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).toHaveAttribute('maxLength', '5')
    await user.type(input, '1687abc123')
    expect(input).toHaveValue('16871')

    await user.click(screen.getByRole('button', { name: 'Create preset' }))

    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toContain('Preset for 16871')
    const selectedPresetIds = JSON.parse(
      localStorage.getItem('last-war-shiny-tracker-selected-preset-ids') ?? '[]',
    ) as string[]
    expect(selectedPresetIds).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Presets' }))

    expect(screen.getByRole('option', { name: 'Preset for 16871' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('does not create or save a preset when first-load setup is canceled', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toBeNull()
    expect(localStorage.getItem('last-war-shiny-tracker-selected-preset-ids')).toBe(
      JSON.stringify([]),
    )
  })

  it('preserves an explicitly stored empty preset list without showing first-load setup', async () => {
    localStorage.setItem('last-war-shiny-tracker-presets', JSON.stringify([]))

    render(<App />)

    expect(
      screen.queryByRole('dialog', { name: 'Create your first preset' }),
    ).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Presets' }))
    expect(screen.queryByRole('option', { name: 'Preset for 1687' })).not.toBeInTheDocument()
  })

  it('reports invalid storage without overwriting it', async () => {
    const storedPresets = '{invalid JSON'
    localStorage.setItem('last-war-shiny-tracker-presets', storedPresets)

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Presets' })).toBeInTheDocument()
    expect(toastError).toHaveBeenCalledWith('Saved presets could not be loaded')
    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toBe(storedPresets)
  })
})
