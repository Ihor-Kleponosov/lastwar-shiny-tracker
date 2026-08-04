import { format, isToday } from 'date-fns'
import { CalendarDays, LocateFixed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ImageExport } from '@/components/features/export/ImageExport'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { Preset } from '@/types'
import { getDateLocale } from '@/utils/date'

type DateSummaryProps = {
  presets: readonly Preset[]
  isCalendarVisible: boolean
  onSelectToday: () => void
  onToggleCalendar: () => void
  selectedDate: Date
}

export function DateSummary({
  presets,
  isCalendarVisible,
  onSelectToday,
  onToggleCalendar,
  selectedDate,
}: DateSummaryProps) {
  const { i18n, t } = useTranslation('common')
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)
  const selectedDateLabel = format(selectedDate, 'P', { locale })

  return (
    <section className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-5">
      <p className="min-w-0 text-lg font-semibold" aria-live="polite">
        {selectedDateLabel}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <ImageExport presets={presets} />
        <span aria-hidden="true" className="mx-1 h-8 w-px bg-[var(--color-border)]" />
        <IconButton
          aria-label={t('calendar.today')}
          isActive={isToday(selectedDate)}
          onClick={onSelectToday}
        >
          <LocateFixed aria-hidden="true" size={20} />
        </IconButton>
        <IconButton
          aria-label={t(isCalendarVisible ? 'calendar.hide' : 'calendar.show')}
          aria-expanded={isCalendarVisible}
          isActive={isCalendarVisible}
          onClick={onToggleCalendar}
        >
          <CalendarDays aria-hidden="true" size={20} />
        </IconButton>
      </div>
    </section>
  )
}
