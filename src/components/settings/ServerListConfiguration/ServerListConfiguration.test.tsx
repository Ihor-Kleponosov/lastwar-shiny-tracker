import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { getConfiguredServerIds, SERVER_PREFERENCES_STORAGE_KEY } from '@/utils/serverPreferences'
import { ServerListConfiguration } from '.'

const configuredServerIds = getConfiguredServerIds()

describe('ServerListConfiguration', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('displays every configured server in numerical order with all servers selected by default', () => {
    render(<ServerListConfiguration />)

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes.map(({ id }) => Number(id.replace('server-', '')))).toEqual(
      configuredServerIds,
    )
    expect(checkboxes.every((checkbox) => (checkbox as HTMLInputElement).checked)).toBe(true)
  })

  it('uses the saved server preferences', () => {
    localStorage.setItem(
      SERVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ enabledServerIds: [1639] }),
    )

    render(<ServerListConfiguration />)

    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '1640' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '1639' })).toBeChecked()
  })

  it('toggles a server with pointer and keyboard interaction', async () => {
    const user = userEvent.setup()

    render(<ServerListConfiguration />)

    const serverCheckbox = screen.getByRole('checkbox', { name: '1638' })
    await user.click(serverCheckbox)
    expect(serverCheckbox).not.toBeChecked()

    serverCheckbox.focus()
    await user.keyboard(' ')
    expect(serverCheckbox).toBeChecked()
  })
})
