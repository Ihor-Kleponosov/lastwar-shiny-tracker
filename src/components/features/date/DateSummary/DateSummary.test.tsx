import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { DateSummary } from './DateSummary'

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

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveClass('opacity-0')

    await user.click(screen.getByRole('button', { name: 'About server time' }))
    expect(tooltip).toHaveClass('opacity-100')

    fireEvent.mouseDown(document.body)
    expect(tooltip).toHaveClass('opacity-0')
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
