import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { isSameDay } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Calendar } from '@/components/features/calendar/Calendar'
import { DateSummary } from '@/components/features/date/DateSummary'
import { Header } from '@/components/app-shell/Header'
import { PresetsList } from '@/components/features/presets/PresetsList'
import { PresetSelector } from '@/components/features/presets/PresetSelector'
import type { Preset } from '@/types'
import { shinyTasksConfiguration } from '@/config'
import { getSelectedPresetIds, saveSelectedPresetIds } from '@/utils/presets'
import { getServerDate } from '@/utils/serverTime'

type MainPageProps = {
  initialPresetId?: string
  onOpenPresets: () => void
  onNavigateHome: () => void
  presets: readonly Preset[]
}

export function MainPage({
  initialPresetId,
  onOpenPresets,
  onNavigateHome,
  presets,
}: MainPageProps) {
  const [serverNow, setServerNow] = useState(() => new Date())
  const serverDate = getServerDate(serverNow, shinyTasksConfiguration.serverTimeZone)
  const [selectedDate, setSelectedDate] = useState(() =>
    getServerDate(new Date(), shinyTasksConfiguration.serverTimeZone),
  )
  const previousServerDateRef = useRef(serverDate)
  const calendarOverlayRef = useRef<HTMLDivElement>(null)
  const calendarToggleRef = useRef<HTMLButtonElement>(null)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedPresetIds, setSelectedPresetIds] = useState<ReadonlySet<string>>(() => new Set())
  const [hasLoadedSelectedPresetIds, setHasLoadedSelectedPresetIds] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const presetsById = new Map(presets.map((preset) => [preset.id, preset]))
  const selectedPresets = [...selectedPresetIds].flatMap((presetId) => {
    const preset = presetsById.get(presetId)
    return preset ? [preset] : []
  })

  useEffect(() => {
    const intervalId = window.setInterval(() => setServerNow(new Date()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const previousServerDate = previousServerDateRef.current
    if (isSameDay(previousServerDate, serverDate)) {
      return
    }

    previousServerDateRef.current = serverDate
    setSelectedDate((currentSelectedDate) =>
      isSameDay(currentSelectedDate, previousServerDate) ? serverDate : currentSelectedDate,
    )
  }, [serverDate])

  useEffect(() => {
    const availablePresetIds = new Set(presets.map((preset) => preset.id))

    if (!hasLoadedSelectedPresetIds) {
      setSelectedPresetIds(
        new Set(
          getSelectedPresetIds(presets).filter((presetId) => availablePresetIds.has(presetId)),
        ),
      )
      setHasLoadedSelectedPresetIds(true)
      return
    }

    setSelectedPresetIds((currentPresetIds) => {
      const nextPresetIds = new Set(
        [...currentPresetIds].filter((presetId) => availablePresetIds.has(presetId)),
      )

      if (
        nextPresetIds.size === currentPresetIds.size &&
        [...nextPresetIds].every((presetId) => currentPresetIds.has(presetId))
      ) {
        return currentPresetIds
      }

      return nextPresetIds
    })
  }, [hasLoadedSelectedPresetIds, presets])

  useEffect(() => {
    if (!initialPresetId) {
      return
    }

    setSelectedPresetIds((currentPresetIds) => new Set([...currentPresetIds, initialPresetId]))
  }, [initialPresetId])

  useEffect(() => {
    if (!hasLoadedSelectedPresetIds) {
      return
    }

    saveSelectedPresetIds(selectedPresetIds)
  }, [hasLoadedSelectedPresetIds, selectedPresetIds])

  useEffect(() => {
    if (!isCalendarVisible) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      const isCalendarInteraction =
        calendarOverlayRef.current?.contains(target) || calendarToggleRef.current?.contains(target)

      if (!isCalendarInteraction) {
        setIsCalendarVisible(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isCalendarVisible])

  if (!hasLoadedSelectedPresetIds) {
    return null
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <div className="relative">
          <DateSummary
            calendarToggleRef={calendarToggleRef}
            presets={presets}
            selectedDate={selectedDate}
            serverDate={serverDate}
            serverNow={serverNow}
            isCalendarVisible={isCalendarVisible}
            onSelectToday={() => setSelectedDate(serverDate)}
            onToggleCalendar={() => setIsCalendarVisible((isVisible) => !isVisible)}
          />
          <AnimatePresence initial={false}>
            {isCalendarVisible ? (
              <motion.div
                ref={calendarOverlayRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                className="absolute top-[calc(100%+1rem)] right-0 left-0 z-20 overflow-hidden"
              >
                <Calendar
                  selectedDate={selectedDate}
                  serverDate={serverDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date)
                    setIsCalendarVisible(false)
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <PresetSelector
          checkedPresetIds={selectedPresetIds}
          onEditPresets={onOpenPresets}
          onSelectedPresetIdsChange={setSelectedPresetIds}
          presets={presets}
        />
        <PresetsList presets={selectedPresets} selectedDate={selectedDate} />
      </div>
    </main>
  )
}
