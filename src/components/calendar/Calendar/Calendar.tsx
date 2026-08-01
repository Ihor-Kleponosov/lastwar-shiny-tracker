import { de, enUS, fr, uk } from 'date-fns/locale'
import { startOfMonth } from 'date-fns'
import { useEffect, useState } from 'react'
import { DayPicker, type OnSelectHandler } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useTranslation } from 'react-i18next'
import type { LanguageCode } from '@/i18n/languages'

const calendarLocales = { en: enUS, fr, de, uk } as const

type CalendarProps = {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

function getCalendarLocale(language: string) {
  const languageCode = language.split('-')[0] as LanguageCode

  return calendarLocales[languageCode] ?? calendarLocales.en
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const { i18n, t } = useTranslation('common')
  const [month, setMonth] = useState(() => startOfMonth(selectedDate))

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
      <DayPicker
        className="calendar mx-auto w-fit"
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selectedDate}
        onSelect={handleSelect}
        locale={getCalendarLocale(i18n.resolvedLanguage ?? i18n.language)}
        weekStartsOn={1}
        showOutsideDays
        navLayout="around"
      />
    </section>
  )
}
