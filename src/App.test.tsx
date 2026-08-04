import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays, format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
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
    const nextDate = addDays(new Date(), 1)

    render(<App />)

    expect(screen.getByText(format(new Date(), 'P'))).toBeInTheDocument()
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

    expect(screen.getByText(format(new Date(), 'P'))).toBeInTheDocument()
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

  it('creates the default preset and shows its notice on the main page on first visit', () => {
    render(<App />)

    expect(screen.getByRole('status', { name: 'Default preset applied' })).toBeInTheDocument()
    expect(localStorage.getItem('last-war-shiny-tracker-presets')).toContain('Default preset')
  })

  it('preserves an explicitly stored empty preset list without showing the default notice', async () => {
    localStorage.setItem('last-war-shiny-tracker-presets', JSON.stringify([]))

    render(<App />)

    expect(screen.queryByRole('status', { name: 'Default preset applied' })).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Presets' }))
    expect(screen.queryByRole('option', { name: 'Default preset' })).not.toBeInTheDocument()
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
