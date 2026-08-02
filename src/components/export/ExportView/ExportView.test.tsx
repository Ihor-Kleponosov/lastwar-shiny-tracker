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

    const groupARow = screen.getByText('Group A:').closest('tr')
    const groupBRow = screen.getByText('Group B:').closest('tr')
    const groupCRow = screen.getByText('Group C:').closest('tr')

    expect(groupARow).not.toBeNull()
    expect(groupBRow).not.toBeNull()
    expect(groupCRow).not.toBeNull()
    expect(within(groupARow!).getByRole('cell')).toHaveTextContent(`${groupA[0]}, ${groupA[2]}`)
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
    expect(screen.getByText('Gruppe A:')).toBeInTheDocument()
  })
})
