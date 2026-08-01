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

    expect(screen.getByText('11 active servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1638',
      '1658',
      '1673',
      '1685',
      '1686',
      '1687',
      '1690',
      '1691',
      '1693',
      '1697',
      '1698',
    ])
  })

  it('updates the active servers when the selected date changes', () => {
    const { rerender } = render(<ServerList selectedDate={new Date(2026, 6, 15)} />)

    rerender(<ServerList selectedDate={new Date(2026, 6, 16)} />)

    expect(screen.getByText('4 active servers')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map(({ textContent }) => textContent)).toEqual([
      '1652',
      '1688',
      '1689',
      '1699',
    ])
  })
})
