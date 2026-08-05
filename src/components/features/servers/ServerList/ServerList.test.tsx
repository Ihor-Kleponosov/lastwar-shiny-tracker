import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { ServerList } from '.'

const allServersPreset: Preset = {
  id: 'all-servers',
  name: 'All servers',
  enabledServerIds: getConfiguredServerIds(),
}

function getSortedServerGroup(groupIndex: number): string[] {
  return [...(shinyTasksConfiguration.serverGroups[groupIndex] ?? [])]
    .sort((first, second) => first - second)
    .map(String)
}

describe('ServerList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('displays the active server group for the selected date in numerical order', () => {
    render(<ServerList selectedDate={new Date(2026, 6, 15)} preset={allServersPreset} />)

    const expectedServers = getSortedServerGroup(0)

    expect(screen.getByText(`${expectedServers.length} servers`)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual(
      expectedServers,
    )
  })

  it('updates the active servers when the selected date changes', () => {
    const { rerender } = render(
      <ServerList selectedDate={new Date(2026, 6, 15)} preset={allServersPreset} />,
    )

    rerender(<ServerList selectedDate={new Date(2026, 6, 16)} preset={allServersPreset} />)

    const expectedServers = getSortedServerGroup(1)

    expect(screen.getByText(`${expectedServers.length} servers`)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual(
      expectedServers,
    )
  })

  it('displays only enabled active servers', () => {
    render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        preset={{
          id: 'custom',
          name: 'Custom servers',
          enabledServerIds: [1691, 1638, 1698],
        }}
      />,
    )

    expect(screen.getByText('3 servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1638',
      '1691',
      '1698',
    ])
  })

  it('uses the preset name as its title and shows an empty state without settings controls', () => {
    render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        preset={{ id: 'empty', name: 'Empty preset', enabledServerIds: [] }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Empty preset' })).toBeInTheDocument()
    expect(screen.getByText('No enabled servers for this date')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open settings' })).not.toBeInTheDocument()
  })

  it('opens export with this preset selected and locked', async () => {
    const user = userEvent.setup()
    render(<ServerList selectedDate={new Date(2026, 6, 15)} preset={allServersPreset} />)

    await user.click(screen.getByRole('button', { name: 'Download image for All servers' }))

    expect(screen.getByRole('dialog', { name: 'Save server list' })).toBeInTheDocument()
    expect(screen.getByLabelText('Preset')).toHaveValue('all-servers')
    expect(screen.getByLabelText('Preset')).toBeDisabled()
  })
})
