import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { ImageExport } from '.'

const html2canvas = vi.hoisted(() => vi.fn())

vi.mock('html2canvas', () => ({ default: html2canvas }))

describe('ImageExport', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    html2canvas.mockReset()
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
  })

  it('opens a month picker defaulted to the current month and restores focus when closed', async () => {
    const user = userEvent.setup()
    render(<ImageExport enabledServerIds={new Set(shinyTasksConfiguration.serverGroups.flat())} />)

    const trigger = screen.getByRole('button', { name: 'Download image' })
    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: 'Save server list' })).toBeInTheDocument()
    expect(
      screen.getByText('Choose the month for which you want to save the server list.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Month')).toHaveValue(format(new Date(), 'yyyy-MM'))
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
    expect(trigger).toHaveFocus()
  })

  it('previews the chosen month and captures only the export view', async () => {
    const user = userEvent.setup()
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

    render(<ImageExport enabledServerIds={new Set(shinyTasksConfiguration.serverGroups.flat())} />)

    await user.click(screen.getByRole('button', { name: 'Download image' }))
    fireEvent.change(screen.getByLabelText('Month'), { target: { value: '2026-07' } })
    await user.click(screen.getByRole('button', { name: 'Proceed' }))

    const preview = screen.getByRole('dialog', { name: 'Server list preview' })
    expect(within(preview).getByRole('heading', { name: 'July 2026' })).toBeInTheDocument()
    const exportView = screen.getByTestId('export-view')
    expect(exportView).toHaveClass('export-view--dark')

    await user.click(within(preview).getByRole('button', { name: 'Use light export theme' }))

    expect(exportView).toHaveClass('export-view--light')
    expect(
      within(preview).getByRole('button', { name: 'Use dark export theme' }),
    ).toBeInTheDocument()

    await user.click(within(preview).getByRole('button', { name: 'Download image' }))

    expect(screen.getByRole('status', { name: 'Exporting image' })).toBeInTheDocument()
    resolveCapture(canvas)

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalledWith(exportView, { scale: 2 })
      expect(createObjectURL).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:export')
      expect(screen.queryByRole('status', { name: 'Exporting image' })).not.toBeInTheDocument()
    })

    expect(click).toHaveBeenCalled()
    expect(preview).toBeInTheDocument()

    await user.click(within(preview).getByRole('button', { name: 'Close export preview' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the preview open when image capture fails', async () => {
    const user = userEvent.setup()
    const exportError = new Error('Capture failed')
    html2canvas.mockRejectedValue(exportError)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(<ImageExport enabledServerIds={new Set(shinyTasksConfiguration.serverGroups.flat())} />)

    await user.click(screen.getByRole('button', { name: 'Download image' }))
    await user.click(screen.getByRole('button', { name: 'Proceed' }))
    await user.click(
      within(screen.getByRole('dialog', { name: 'Server list preview' })).getByRole('button', {
        name: 'Download image',
      }),
    )

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Image export failed.', exportError)
      expect(screen.queryByRole('status', { name: 'Exporting image' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('dialog', { name: 'Server list preview' })).toBeInTheDocument()
  })
})
