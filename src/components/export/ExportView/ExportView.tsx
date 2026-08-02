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
}

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
  { enabledServerIds, selectedDate },
  ref,
) {
  const { i18n, t } = useTranslation('common')
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)
  const month = startOfMonth(selectedDate)
  const monthLabel = format(month, 'LLLL yyyy', { locale })

  return (
    <div
      ref={ref}
      data-testid="export-view"
      className="w-[390px] bg-[var(--color-export-background)] p-5 text-[var(--color-export-text)] [color-scheme:light]"
    >
      <section aria-labelledby="export-calendar-heading">
        <h1 id="export-calendar-heading" className="text-center text-2xl font-bold">
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
        <h2 id="export-servers-heading" className="text-xl font-bold">
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
                    className="w-20 rounded-l-xl py-2.5 pr-1.5 pl-3 align-top font-bold whitespace-nowrap"
                  >
                    {t('export.groupLabel', { label: groupLabel })}
                  </th>
                  <td className="rounded-r-xl py-2.5 pr-3 pl-1.5 font-medium leading-5 tabular-nums">
                    {enabledServers.length > 0 ? enabledServers.join(', ') : '—'}
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
