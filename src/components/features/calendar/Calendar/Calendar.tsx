import { addMonths, format, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DayPicker, type OnSelectHandler } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/shared/ui/IconButton'
import { getDateLocale } from '@/utils/date'

function HiddenMonthCaption() {
  return <></>
}

type CalendarProps = {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const { i18n, t } = useTranslation('common')
  const [month, setMonth] = useState(() => startOfMonth(selectedDate))
  const locale = getDateLocale(i18n.resolvedLanguage ?? i18n.language)

  useEffect(() => {
    setMonth(startOfMonth(selectedDate))
  }, [selectedDate])

  const handleSelect: OnSelectHandler<Date | undefined> = (date) => {
    if (date) onSelectDate(date)
  }

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-5"
      aria-labelledby="calendar-heading"
    >
      <h2 id="calendar-heading" className="sr-only">
        {t('calendar.title')}
      </h2>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <IconButton
            aria-label={t('calendar.previousMonth')}
            onClick={() => setMonth((currentMonth) => addMonths(currentMonth, -1))}
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </IconButton>
          <IconButton
            aria-label={t('calendar.nextMonth')}
            onClick={() => setMonth((currentMonth) => addMonths(currentMonth, 1))}
          >
            <ChevronRight aria-hidden="true" size={20} />
          </IconButton>
        </div>
        <p className="text-base font-medium" aria-live="polite">
          {format(month, 'LLLL yyyy', { locale })}
        </p>
      </div>
      <DayPicker
        className="calendar mx-auto w-fit"
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selectedDate}
        onSelect={handleSelect}
        locale={locale}
        weekStartsOn={1}
        showOutsideDays
        fixedWeeks
        hideNavigation
        components={{ MonthCaption: HiddenMonthCaption }}
      />
    </section>
  )
}
