import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { DateSummary } from './DateSummary'

function createRect({
  bottom,
  height,
  left,
  right,
  top,
}: {
  bottom: number
  height: number
  left: number
  right: number
  top: number
}): DOMRect {
  return { bottom, height, left, right, top } as DOMRect
}

describe('DateSummary', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows the server-time explanation when tapped and closes it on an outside tap', async () => {
    const user = userEvent.setup()

    render(
      <DateSummary
        presets={[]}
        selectedDate={new Date(2026, 7, 5)}
        serverNow={new Date('2026-08-05T11:00:00.000Z')}
        isCalendarVisible={false}
        onSelectToday={vi.fn()}
        onToggleCalendar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'About server time' }))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows the server-time explanation on hover', async () => {
    const user = userEvent.setup()

    render(
      <DateSummary
        presets={[]}
        selectedDate={new Date(2026, 7, 5)}
        serverNow={new Date('2026-08-05T11:00:00.000Z')}
        isCalendarVisible={false}
        onSelectToday={vi.fn()}
        onToggleCalendar={vi.fn()}
      />,
    )

    await user.hover(screen.getByRole('button', { name: 'About server time' }))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    await user.unhover(screen.getByRole('button', { name: 'About server time' }))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('positions the server-time tooltip inside the viewport', async () => {
    Object.defineProperties(document.documentElement, {
      clientHeight: { configurable: true, value: 640 },
      clientWidth: { configurable: true, value: 360 },
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.getAttribute('aria-label') === 'About server time') {
        return createRect({ bottom: 80, height: 18, left: 300, right: 318, top: 62 })
      }
      if (this.getAttribute('role') === 'tooltip') {
        return createRect({ bottom: 260, height: 180, left: 0, right: 0, top: 0 })
      }
      return createRect({ bottom: 80, height: 18, left: 300, right: 318, top: 62 })
    })
    const user = userEvent.setup()

    render(
      <DateSummary
        presets={[]}
        selectedDate={new Date(2026, 7, 5)}
        serverNow={new Date('2026-08-05T11:00:00.000Z')}
        isCalendarVisible={false}
        onSelectToday={vi.fn()}
        onToggleCalendar={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'About server time' }))

    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveStyle({
        left: '-238px',
        maxHeight: '536px',
        top: '26px',
        width: '256px',
      }),
    )
  })

  it('renders the standalone server-time title above the date-time and action row', () => {
    render(
      <DateSummary
        presets={[]}
        selectedDate={new Date(2026, 7, 5)}
        serverNow={new Date('2026-08-05T11:00:00.000Z')}
        isCalendarVisible={false}
        onSelectToday={vi.fn()}
        onToggleCalendar={vi.fn()}
      />,
    )

    const title = screen.getByText('Server time')
    const contentRow = title.nextElementSibling
    const time = screen.getByText('09:00:00')
    const infoButton = screen.getByRole('button', { name: 'About server time' })

    expect(contentRow).toHaveClass('min-h-11')
    expect(contentRow).toContainElement(time)
    expect(contentRow).toContainElement(infoButton)
    expect(time.nextElementSibling).toBe(infoButton.parentElement)
    expect(screen.getByRole('button', { name: 'Download image' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show calendar' })).toBeInTheDocument()
  })
})
