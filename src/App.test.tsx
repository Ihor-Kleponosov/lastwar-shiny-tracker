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

  it('updates the active server list only after saving settings changes', async () => {
    const user = userEvent.setup()
    const selectedDate = new Date()
    const serverId = getServersForIndex(
      getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration),
      shinyTasksConfiguration,
    )[0]

    render(<App />)

    const settingsButton = screen.getAllByRole('button', { name: 'Open settings' })[0]
    const serverList = settingsButton.closest('section')
    expect(serverList).not.toBeNull()
    expect(within(serverList!).queryByText(String(serverId))).not.toBeInTheDocument()

    await user.click(settingsButton)
    await user.click(screen.getByRole('checkbox', { name: String(serverId) }))

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    expect(within(serverList!).queryByText(String(serverId))).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
    })
    expect(within(serverList!).getByText(String(serverId))).toBeInTheDocument()
    expect(settingsButton).toHaveFocus()
  })
})
