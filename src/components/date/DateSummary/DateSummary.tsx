import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ImageExport } from '@/components/export/ImageExport'
import { IconButton } from '@/components/ui/IconButton'
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
  const selectedDateLabel = format(selectedDate, 'P', { locale })

  return (
    <section className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-5">
      <p className="min-w-0 text-lg font-semibold" aria-live="polite">
        {selectedDateLabel}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <ImageExport enabledServerIds={enabledServerIds} selectedDate={selectedDate} />
        <IconButton
          aria-label={t(isCalendarVisible ? 'calendar.hide' : 'calendar.show')}
          aria-expanded={isCalendarVisible}
          onClick={onToggleCalendar}
          className={`border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none ${
            isCalendarVisible
              ? 'translate-y-px border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[inset_0_2px_4px_rgb(0_0_0_/_30%),inset_0_-1px_0_rgb(255_255_255_/_4%)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)] hover:bg-[var(--color-surface)]'
          }`}
        >
          <CalendarDays aria-hidden="true" size={20} />
        </IconButton>
      </div>
    </section>
  )
}
