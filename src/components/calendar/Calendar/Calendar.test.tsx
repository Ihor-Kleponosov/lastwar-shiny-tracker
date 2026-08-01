import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Calendar } from '.'

describe('Calendar', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
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
})
