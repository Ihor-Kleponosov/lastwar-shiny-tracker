import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays, format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import App from './App'

const html2canvas = vi.hoisted(() => vi.fn())

vi.mock('html2canvas', () => ({ default: html2canvas }))

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
    html2canvas.mockReset()
  })

  it('shows the selected date and toggles the calendar', () => {
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

    fireEvent.click(screen.getByRole('button', { name: format(nextDate, 'PPPP') }))

    expect(screen.getByText(format(nextDate, 'P'))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hide calendar' }))

    expect(screen.getByRole('button', { name: 'Show calendar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('updates the active server list immediately when preferences change', async () => {
    const user = userEvent.setup()
    const selectedDate = new Date()
    const serverId = getServersForIndex(
      getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration),
      shinyTasksConfiguration,
    )[0]

    render(<App />)

    const settingsButton = screen.getByRole('button', { name: 'Open settings' })
    const serverList = settingsButton.closest('section')
    expect(serverList).not.toBeNull()
    expect(within(serverList!).getByText(String(serverId))).toBeInTheDocument()

    await user.click(settingsButton)
    await user.click(screen.getByRole('checkbox', { name: String(serverId) }))

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(within(serverList!).queryByText(String(serverId))).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close settings' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
    })
    expect(settingsButton).toHaveFocus()
  })

  it('exports the selected calendar view as a PNG and cleans up the object URL', async () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['image'], { type: 'image/png' }))
    })
    let resolveCapture!: (canvas: HTMLCanvasElement) => void
    html2canvas.mockReturnValue(
      new Promise<HTMLCanvasElement>((resolve) => {
        resolveCapture = resolve
      }),
    )
    Object.defineProperties(URL, {
      createObjectURL: { configurable: true, value: vi.fn() },
      revokeObjectURL: { configurable: true, value: vi.fn() },
    })
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:export')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    render(<App />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Download image' }))

    expect(screen.getByRole('status', { name: 'Exporting image' })).toBeInTheDocument()
    const exportView = screen.getByTestId('export-view')

    resolveCapture(canvas)

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalledWith(exportView, { scale: 2 })
    })

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:export')
      expect(screen.queryByRole('status', { name: 'Exporting image' })).not.toBeInTheDocument()
    })

    expect(click).toHaveBeenCalled()
  })

  it('removes the loader and export view when image capture fails', async () => {
    const exportError = new Error('Capture failed')
    html2canvas.mockRejectedValue(exportError)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(<App />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Download image' }))

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Image export failed.', exportError)
      expect(screen.queryByRole('status', { name: 'Exporting image' })).not.toBeInTheDocument()
      expect(screen.queryByTestId('export-view')).not.toBeInTheDocument()
    })
  })
})
