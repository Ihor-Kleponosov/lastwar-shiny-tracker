import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { ServerList } from '.'

const allServersPreset: Preset = {
  id: 'all-servers',
  name: 'All servers',
  enabledServerIds: getConfiguredServerIds(),
}

describe('ServerList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('displays the active server group for the selected date in numerical order', () => {
    render(<ServerList selectedDate={new Date(2026, 6, 15)} preset={allServersPreset} />)

    expect(screen.getByText('29 servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1638',
      '1643',
      '1650',
      '1651',
      '1656',
      '1657',
      '1658',
      '1662',
      '1663',
      '1664',
      '1669',
      '1670',
      '1673',
      '1674',
      '1675',
      '1676',
      '1679',
      '1680',
      '1681',
      '1685',
      '1686',
      '1687',
      '1690',
      '1691',
      '1692',
      '1693',
      '1696',
      '1697',
      '1698',
    ])
  })

  it('updates the active servers when the selected date changes', () => {
    const { rerender } = render(
      <ServerList selectedDate={new Date(2026, 6, 15)} preset={allServersPreset} />,
    )

    rerender(<ServerList selectedDate={new Date(2026, 6, 16)} preset={allServersPreset} />)

    expect(screen.getByText('15 servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1639',
      '1640',
      '1644',
      '1645',
      '1646',
      '1647',
      '1648',
      '1652',
      '1653',
      '1659',
      '1665',
      '1677',
      '1688',
      '1689',
      '1699',
    ])
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
