import { format, startOfMonth } from 'date-fns'
import { forwardRef } from 'react'
import { Day, DayPicker, type DayProps } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useTranslation } from 'react-i18next'
import { shinyTasksConfiguration } from '@/config'
import type { ServerId } from '@/types'
import { getDateLocale } from '@/utils/date'
import { getServerGroupIndexForDate } from '@/utils'

type ExportViewProps = {
  enabledServerIds: ReadonlySet<ServerId>
  selectedDate: Date
  theme?: ExportTheme
}

export type ExportTheme = 'dark' | 'light'

const groupClassNames = ['export-group-a', 'export-group-b', 'export-group-c'] as const

const groupModifiers = {
  groupA: (date: Date) => getServerGroupIndexForDate(date, shinyTasksConfiguration) === 0,
  groupB: (date: Date) => getServerGroupIndexForDate(date, shinyTasksConfiguration) === 1,
  groupC: (date: Date) => getServerGroupIndexForDate(date, shinyTasksConfiguration) === 2,
}

const groupModifierClassNames = {
  groupA: groupClassNames[0],
  groupB: groupClassNames[1],
  groupC: groupClassNames[2],
}

function HiddenMonthCaption() {
  return <></>
}

function ExportDay(props: DayProps) {
  return (
    <Day {...props}>
      <span className="export-calendar-day-number">{props.day.date.getDate()}</span>
    </Day>
  )
}

export const ExportView = forwardRef<HTMLDivElement, ExportViewProps>(function ExportView(
  { enabledServerIds, selectedDate, theme = 'dark' },
  ref,
) {
  const { i18n, t } = useTranslation('common')
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)
  const month = startOfMonth(selectedDate)
  const monthLabel = format(month, 'LLLL', { locale })

  return (
    <div
      ref={ref}
      data-testid="export-view"
      className={`export-view export-view--${theme} w-[390px] border-b-[var(--color-export-border)] bg-[var(--color-export-background)] p-5 font-[Arial,sans-serif] text-[var(--color-export-text)] [letter-spacing:normal] [line-height:normal] [word-spacing:normal]`}
    >
      <section aria-labelledby="export-calendar-heading">
        <h1 id="export-calendar-heading" className="text-center text-2xl font-normal">
          {monthLabel}
        </h1>
        <DayPicker
          aria-label={monthLabel}
          className="export-calendar mx-auto mt-4 flex justify-center"
          month={month}
          locale={locale}
          weekStartsOn={1}
          showOutsideDays
          fixedWeeks
          hideNavigation
          modifiers={groupModifiers}
          modifiersClassNames={groupModifierClassNames}
          components={{ Day: ExportDay, MonthCaption: HiddenMonthCaption }}
        />
      </section>

      <section className="mt-5" aria-labelledby="export-servers-heading">
        <h2 id="export-servers-heading" className="text-xl font-normal">
          {t('export.serversTitle')}
        </h2>
        <table className="mt-2 w-full border-separate border-spacing-y-1.5 text-left text-sm">
          <tbody>
            {shinyTasksConfiguration.serverGroups.slice(0, 3).map((serverGroup, groupIndex) => {
              const groupLabel = String.fromCharCode(65 + groupIndex)
              const enabledServers = serverGroup.filter((serverId) =>
                enabledServerIds.has(serverId),
              )
              const groupClassName = groupClassNames[groupIndex] ?? groupClassNames[0]

              return (
                <tr key={groupLabel} className={groupClassName}>
                  <th
                    scope="row"
                    className="w-20 rounded-l-xl px-3 py-2.5 text-center align-middle font-normal whitespace-nowrap"
                  >
                    {t('export.groupLabel', { label: groupLabel })}
                  </th>
                  <td className="rounded-r-xl py-2.5 pr-3 pl-1.5 font-normal tabular-nums">
                    {enabledServers.length > 0 ? (
                      <ul
                        className="flex flex-wrap gap-1"
                        aria-label={t('export.groupLabel', { label: groupLabel })}
                      >
                        {enabledServers.map((serverId) => (
                          <li
                            key={serverId}
                            className="rounded-md border border-[var(--color-export-chip-border)] bg-[var(--color-export-chip-background)] pl-[2px] pr-[3px] pt-[2px] pb-[3px] text-[var(--color-export-chip-text)]"
                          >
                            {serverId}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
})
