import { format, isSameDay } from 'date-fns'
import { CalendarDays, Info, LocateFixed } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageExport } from '@/components/features/export/ImageExport'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { Preset } from '@/types'
import { shinyTasksConfiguration } from '@/config'
import { getDateLocale } from '@/utils/date'
import { formatServerDateTime } from '@/utils/serverTime'

type DateSummaryProps = {
  presets: readonly Preset[]
  isCalendarVisible: boolean
  onSelectToday: () => void
  onToggleCalendar: () => void
  selectedDate: Date
  serverNow: Date
}

export function DateSummary({
  presets,
  isCalendarVisible,
  onSelectToday,
  onToggleCalendar,
  selectedDate,
  serverNow,
}: DateSummaryProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const infoContainerRef = useRef<HTMLSpanElement>(null)
  const infoTooltipId = useId()
  const { i18n, t } = useTranslation('common')
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)
  const selectedDateLabel = format(selectedDate, 'P', { locale })
  const serverTimeLabel = formatServerDateTime(
    serverNow,
    shinyTasksConfiguration.serverTimeZone,
    'HH:mm:ss',
  )

  useEffect(() => {
    if (!isInfoOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!infoContainerRef.current?.contains(event.target as Node)) setIsInfoOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isInfoOpen])

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {t('serverTime.label')}
      </p>
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="flex h-11 min-w-0 flex-col justify-center gap-1">
          <p className="text-base leading-5 font-semibold" aria-live="polite">
            {selectedDateLabel}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-base leading-5 font-medium tabular-nums text-[var(--color-text-secondary)]">
              {serverTimeLabel}
            </p>
            <span ref={infoContainerRef} className="group relative inline-flex">
              <button
                type="button"
                aria-label={t('serverTime.infoLabel')}
                aria-describedby={infoTooltipId}
                aria-expanded={isInfoOpen}
                onClick={() => setIsInfoOpen((isOpen) => !isOpen)}
                className="inline-flex cursor-pointer items-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] motion-reduce:transition-none"
              >
                <Info aria-hidden="true" size={18} />
              </button>
              <span
                id={infoTooltipId}
                role="tooltip"
                className={`pointer-events-none absolute top-full left-1/2 z-30 mt-2 w-64 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-sm font-normal leading-6 text-[var(--color-text-primary)] shadow-[0_8px_24px_rgb(0_0_0_/_24%)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none ${
                  isInfoOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {t('serverTime.info')}
              </span>
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ImageExport presets={presets} />
          <span aria-hidden="true" className="mx-1 h-8 w-px bg-[var(--color-border)]" />
          <IconButton
            aria-label={t('calendar.today')}
            isActive={isSameDay(selectedDate, serverNow)}
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
      </div>
    </section>
  )
}
