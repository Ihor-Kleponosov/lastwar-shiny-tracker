import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import App from './App'

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('updates the active server list immediately when preferences change', async () => {
    const user = userEvent.setup()
    const selectedDate = new Date()
    const serverId = getServersForIndex(
      getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration),
      shinyTasksConfiguration,
    )[0]

    render(<App />)

    const serverList = screen.getByRole('heading', { name: 'Active servers' }).closest('section')
    expect(serverList).not.toBeNull()
    expect(within(serverList!).getByText(String(serverId))).toBeInTheDocument()

    const settingsButton = screen.getByRole('button', { name: 'Open settings' })
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
