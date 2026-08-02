import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useServerPreferences } from '@/hooks/useServerPreferences'
import i18n from '@/i18n'
import { getConfiguredServerIds, SERVER_PREFERENCES_STORAGE_KEY } from '@/utils/serverPreferences'
import { ServerListConfiguration } from '.'

const configuredServerIds = getConfiguredServerIds()

function ServerListConfigurationHarness() {
  const { enabledServerIds, serverIds, toggleServer, toggleServers } = useServerPreferences()

  return (
    <ServerListConfiguration
      enabledServerIds={enabledServerIds}
      serverIds={serverIds}
      onToggleServer={toggleServer}
      onToggleServers={toggleServers}
    />
  )
}

function renderConfiguration() {
  return render(<ServerListConfigurationHarness />)
}

function getServerCheckboxes() {
  return screen
    .getAllByRole('checkbox')
    .filter((checkbox) => checkbox.id.startsWith('server-')) as HTMLInputElement[]
}

describe('ServerListConfiguration', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('displays every configured server in numerical order with all servers selected by default', () => {
    renderConfiguration()

    const serverCheckboxes = getServerCheckboxes()

    expect(serverCheckboxes.map(({ id }) => Number(id.replace('server-', '')))).toEqual(
      configuredServerIds,
    )
    expect(serverCheckboxes.every((checkbox) => (checkbox as HTMLInputElement).checked)).toBe(true)
    expect(screen.getByRole('button', { name: 'Deselect all' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Deselect displayed' })).not.toBeInTheDocument()
  })

  it('uses the saved server preferences', () => {
    localStorage.setItem(
      SERVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ enabledServerIds: [1639] }),
    )

    renderConfiguration()

    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '1640' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '1639' })).toBeChecked()
  })

  it('toggles a server with pointer and keyboard interaction', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    const serverCheckbox = screen.getByRole('checkbox', { name: '1638' })
    await user.click(serverCheckbox)
    expect(serverCheckbox).not.toBeChecked()

    serverCheckbox.focus()
    await user.keyboard(' ')
    expect(serverCheckbox).toBeChecked()
  })

  it('filters servers by text and restores the list when cleared', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    const filter = screen.getByRole('searchbox', { name: 'Search servers' })
    await user.type(filter, '1638')

    expect(screen.getByRole('checkbox', { name: '1638' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '1639' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))

    expect(getServerCheckboxes()).toHaveLength(configuredServerIds.length)
  })

  it('shows the displayed-selection control only when filtering changes the list', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1')

    expect(screen.queryByRole('button', { name: 'Deselect displayed' })).not.toBeInTheDocument()
  })

  it('shows no-results feedback for a filter without matching servers', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '9999')

    expect(screen.getByText('No servers found.')).toBeInTheDocument()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Select displayed' })).toBeDisabled()
  })

  it('selects and deselects every server with the select-all checkbox', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      SERVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ enabledServerIds: [1639] }),
    )

    renderConfiguration()

    const selectAll = screen.getByRole('button', { name: 'Select all' })

    expect(screen.queryByRole('button', { name: 'Select displayed' })).not.toBeInTheDocument()

    await user.click(selectAll)

    expect(getServerCheckboxes().every((checkbox) => checkbox.checked)).toBe(true)
    expect(screen.getByRole('button', { name: 'Deselect all' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Deselect displayed' })).not.toBeInTheDocument()

    await user.click(selectAll)

    expect(getServerCheckboxes().every((checkbox) => !checkbox.checked)).toBe(true)
    expect(screen.getByRole('button', { name: 'Select all' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Select displayed' })).not.toBeInTheDocument()
  })

  it('toggles only displayed servers and updates its checked state', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      SERVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ enabledServerIds: [1638, 1639] }),
    )

    renderConfiguration()

    const filter = screen.getByRole('searchbox', { name: 'Search servers' })
    await user.type(filter, '1638')

    const selectDisplayed = screen.getByRole('button', { name: 'Deselect displayed' })

    await user.click(selectDisplayed)
    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Select displayed' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))
    expect(screen.getByRole('checkbox', { name: '1639' })).toBeChecked()

    await user.type(filter, '1638')
    const selectDisplayedAfterRefilter = screen.getByRole('button', {
      name: 'Select displayed',
    })

    await user.click(selectDisplayedAfterRefilter)
    expect(screen.getByRole('checkbox', { name: '1638' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Deselect displayed' })).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    expect(screen.getByRole('button', { name: 'Select displayed' })).toBeInTheDocument()
  })
})
