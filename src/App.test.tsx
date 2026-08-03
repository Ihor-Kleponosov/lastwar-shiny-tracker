import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays, format } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import App from './App'

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
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
})
