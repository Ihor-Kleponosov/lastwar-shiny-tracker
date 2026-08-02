import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { ServerList } from '.'

describe('ServerList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('displays the active server group for the selected date in numerical order', () => {
    render(<ServerList selectedDate={new Date(2026, 6, 15)} />)

    expect(screen.getByText('29 active servers')).toBeInTheDocument()
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
    const { rerender } = render(<ServerList selectedDate={new Date(2026, 6, 15)} />)

    rerender(<ServerList selectedDate={new Date(2026, 6, 16)} />)

    expect(screen.getByText('15 active servers')).toBeInTheDocument()
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
})
