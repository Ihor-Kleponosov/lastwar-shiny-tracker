import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Calendar } from '@/components/features/calendar/Calendar'
import { DateSummary } from '@/components/features/date/DateSummary'
import { Header } from '@/components/app-shell/Header'
import { PresetsList } from '@/components/features/presets/PresetsList'
import { PresetSelector } from '@/components/features/presets/PresetSelector'
import type { Preset } from '@/types'
import { getSelectedPresetIds, saveSelectedPresetIds } from '@/utils/presets'

type MainPageProps = {
  onOpenPresets: () => void
  onNavigateHome: () => void
  presets: readonly Preset[]
}

export function MainPage({ onOpenPresets, onNavigateHome, presets }: MainPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedPresetIds, setSelectedPresetIds] = useState<ReadonlySet<string>>(() => new Set())
  const [hasLoadedSelectedPresetIds, setHasLoadedSelectedPresetIds] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const selectedPresets = presets.filter((preset) => selectedPresetIds.has(preset.id))

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
    if (!hasLoadedSelectedPresetIds) return

    saveSelectedPresetIds(selectedPresetIds)
  }, [hasLoadedSelectedPresetIds, selectedPresetIds])

  if (!hasLoadedSelectedPresetIds) {
    return null
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <div className="relative">
          <DateSummary
            presets={presets}
            selectedDate={selectedDate}
            isCalendarVisible={isCalendarVisible}
            onSelectToday={() => setSelectedDate(new Date())}
            onToggleCalendar={() => setIsCalendarVisible((isVisible) => !isVisible)}
          />
          <AnimatePresence initial={false}>
            {isCalendarVisible ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                className="absolute top-[calc(100%+1rem)] right-0 left-0 z-20 overflow-hidden"
              >
                <Calendar
                  selectedDate={selectedDate}
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
