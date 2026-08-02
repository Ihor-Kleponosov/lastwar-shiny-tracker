import { format, isToday } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { ImageExport } from '@/components/export/ImageExport'
import type { ServerId } from '@/types'
import { getDateLocale } from '@/utils/date'

type DateSummaryProps = {
  enabledServerIds: ReadonlySet<ServerId>
  isCalendarVisible: boolean
  onToggleCalendar: () => void
  selectedDate: Date
}

export function DateSummary({
  enabledServerIds,
  isCalendarVisible,
  onToggleCalendar,
  selectedDate,
}: DateSummaryProps) {
  const { i18n, t } = useTranslation('common')
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)
  const selectedDateLabel = isToday(selectedDate)
    ? t('calendar.today')
    : format(selectedDate, 'd MMM yyyy', { locale })

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="text-lg font-semibold" aria-live="polite">
        {t('calendar.selectedDate', { date: selectedDateLabel })}
      </p>
      <div className="flex items-center gap-1 self-end sm:self-auto">
        <ImageExport enabledServerIds={enabledServerIds} selectedDate={selectedDate} />
        <button
          type="button"
          aria-expanded={isCalendarVisible}
          onClick={onToggleCalendar}
          className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none ${
            isCalendarVisible
              ? 'translate-y-px border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[inset_0_2px_4px_rgb(0_0_0_/_30%),inset_0_-1px_0_rgb(255_255_255_/_4%)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)] hover:bg-[var(--color-surface)]'
          }`}
        >
          {t(isCalendarVisible ? 'calendar.hide' : 'calendar.show')}
        </button>
      </div>
    </section>
  )
}
