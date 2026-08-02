import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Calendar } from '.'

describe('Calendar', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses Monday as the first day of the week and selects a date', async () => {
    const user = userEvent.setup()
    const onSelectDate = vi.fn()

    render(<Calendar selectedDate={new Date(2026, 0, 15)} onSelectDate={onSelectDate} />)

    expect(screen.getAllByText('Mo')[0]).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /January 20th, 2026/i }))

    expect(onSelectDate).toHaveBeenCalledWith(new Date(2026, 0, 20))
  })

  it('updates calendar labels for the active application language', async () => {
    await i18n.changeLanguage('de')

    render(<Calendar selectedDate={new Date(2026, 0, 15)} onSelectDate={vi.fn()} />)

    expect(screen.getByText('Januar 2026')).toBeInTheDocument()
    expect(screen.getAllByText('Mo')[0]).toBeInTheDocument()
  })

  it('navigates visible months without changing the selected date', async () => {
    const user = userEvent.setup()
    const onSelectDate = vi.fn()

    const { container } = render(
      <Calendar selectedDate={new Date(2026, 0, 15)} onSelectDate={onSelectDate} />,
    )

    expect(container.querySelectorAll('.rdp-week')).toHaveLength(6)

    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(screen.getByText('February 2026')).toBeInTheDocument()
    expect(container.querySelectorAll('.rdp-week')).toHaveLength(6)
    expect(onSelectDate).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Previous month' }))

    expect(screen.getByText('January 2026')).toBeInTheDocument()
    expect(onSelectDate).not.toHaveBeenCalled()
  })

  it('selects today and displays its month', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 10))
    const onSelectDate = vi.fn()

    render(<Calendar selectedDate={new Date(2026, 0, 15)} onSelectDate={onSelectDate} />)

    fireEvent.click(screen.getByRole('button', { name: 'Today' }))

    expect(screen.getByText('July 2026')).toBeInTheDocument()
    expect(onSelectDate).toHaveBeenCalledWith(new Date(2026, 6, 10))
  })
})
