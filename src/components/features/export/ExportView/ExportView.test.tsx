import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { ExportView } from '.'

describe('ExportView', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders a static month calendar and only enabled servers in each group', () => {
    const [groupA, , groupC] = shinyTasksConfiguration.serverGroups
    const enabledServerIds = new Set([groupA[0], groupA[2], groupC[0]])
    const { container } = render(
      <ExportView selectedDate={new Date(2026, 6, 20)} enabledServerIds={enabledServerIds} />,
    )

    expect(screen.getByRole('heading', { name: 'July 2026' })).toBeInTheDocument()
    expect(container.querySelector('.rdp-weekday')).toHaveTextContent('Mo')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Servers:' })).toBeInTheDocument()

    const serversSection = screen.getByRole('heading', { name: 'Servers:' }).closest('section')
    const groupRows = within(serversSection!).getAllByRole('row')
    const [groupARow, groupBRow, groupCRow] = groupRows

    expect(groupRows).toHaveLength(3)
    expect(screen.queryByText('A:')).not.toBeInTheDocument()
    expect(screen.queryByText('B:')).not.toBeInTheDocument()
    expect(screen.queryByText('C:')).not.toBeInTheDocument()
    expect(within(groupARow).getAllByRole('cell')).toHaveLength(1)
    expect(within(groupBRow).getAllByRole('cell')).toHaveLength(1)
    expect(within(groupCRow).getAllByRole('cell')).toHaveLength(1)
    expect(within(groupARow!).getByRole('list')).toHaveTextContent(`${groupA[0]}${groupA[2]}`)
    expect(within(groupARow!).getAllByRole('listitem')).toHaveLength(2)
    expect(within(groupARow!).getByRole('list')).toHaveClass(
      'grid',
      'grid-cols-[repeat(auto-fill,minmax(46px,1fr))]',
    )
    expect(within(groupARow!).queryByText(String(groupA[1]))).not.toBeInTheDocument()
    expect(within(groupBRow!).getByRole('cell')).toHaveTextContent('—')
    expect(within(groupCRow!).getByRole('cell')).toHaveTextContent(String(groupC[0]))

    expect(container.querySelector('[data-day="2026-07-15"]')).toHaveClass('export-group-a')
    expect(container.querySelector('[data-day="2026-07-16"]')).toHaveClass('export-group-b')
    expect(container.querySelector('[data-day="2026-07-17"]')).toHaveClass('export-group-c')
    expect(container.querySelector('[data-day="2026-07-20"]')).toHaveTextContent('20')
  })

  it('localizes the export headings and calendar', async () => {
    await i18n.changeLanguage('de')

    render(
      <ExportView
        selectedDate={new Date(2026, 6, 20)}
        enabledServerIds={new Set(shinyTasksConfiguration.serverGroups.flat())}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Juli 2026' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
