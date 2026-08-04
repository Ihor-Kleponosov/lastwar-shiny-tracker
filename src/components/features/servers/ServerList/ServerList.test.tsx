import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import i18n from '@/i18n'
import { ServerList } from '.'

describe('ServerList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('displays the active server group for the selected date in numerical order', () => {
    render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        enabledServerIds={new Set(getConfiguredServerIds())}
        onOpenSettings={vi.fn()}
        settingsButtonRef={{ current: null }}
      />,
    )

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
    const enabledServerIds = new Set(getConfiguredServerIds())
    const { rerender } = render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        enabledServerIds={enabledServerIds}
        onOpenSettings={vi.fn()}
        settingsButtonRef={{ current: null }}
      />,
    )

    rerender(
      <ServerList
        selectedDate={new Date(2026, 6, 16)}
        enabledServerIds={enabledServerIds}
        onOpenSettings={vi.fn()}
        settingsButtonRef={{ current: null }}
      />,
    )

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
        enabledServerIds={new Set([1691, 1638, 1698])}
        onOpenSettings={vi.fn()}
        settingsButtonRef={{ current: null }}
      />,
    )

    expect(screen.getByText('3 servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1638',
      '1691',
      '1698',
    ])
  })

  it('opens settings from the list header', async () => {
    const user = userEvent.setup()
    const onOpenSettings = vi.fn()

    render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        enabledServerIds={new Set(getConfiguredServerIds())}
        onOpenSettings={onOpenSettings}
        settingsButtonRef={{ current: null }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    expect(onOpenSettings).toHaveBeenCalledOnce()
  })

  it('shows an empty state and opens settings when no active servers are enabled', async () => {
    const user = userEvent.setup()
    const onOpenSettings = vi.fn()

    render(
      <ServerList
        selectedDate={new Date(2026, 6, 15)}
        enabledServerIds={new Set()}
        onOpenSettings={onOpenSettings}
        settingsButtonRef={{ current: null }}
      />,
    )

    expect(screen.getByText('No enabled servers for this date.')).toBeInTheDocument()
    const settingsButtons = screen.getAllByRole('button', { name: 'Open settings' })
    expect(settingsButtons).toHaveLength(2)

    await user.click(settingsButtons[1])
    expect(onOpenSettings).toHaveBeenCalledOnce()
  })
})
