import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar } from '@/components/features/calendar/Calendar'
import { DateSummary } from '@/components/features/date/DateSummary'
import { Header } from '@/components/app-shell/Header'
import { PresetSelector } from '@/components/features/presets/PresetSelector'
import { ConfigurationModal } from '@/components/features/settings/ConfigurationModal'
import { ServerList } from '@/components/features/servers/ServerList'
import { shinyTasksConfiguration } from '@/config'
import { useServerPreferences } from '@/hooks/useServerPreferences'

type MainPageProps = {
  onOpenPresets: () => void
  onNavigateHome: () => void
}

export function MainPage({ onOpenPresets, onNavigateHome }: MainPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const { enabledServerIds, serverIds, saveEnabledServers } = useServerPreferences()
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <div className="relative">
          <DateSummary
            enabledServerIds={enabledServerIds}
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
          serverGroups={shinyTasksConfiguration.serverGroups}
          onEditPresets={onOpenPresets}
        />
        <ServerList
          selectedDate={selectedDate}
          enabledServerIds={enabledServerIds}
          onOpenSettings={() => setIsConfigurationOpen(true)}
          settingsButtonRef={settingsButtonRef}
        />
      </div>
      <AnimatePresence>
        {isConfigurationOpen ? (
          <ConfigurationModal
            onClose={() => setIsConfigurationOpen(false)}
            returnFocusRef={settingsButtonRef}
            enabledServerIds={enabledServerIds}
            serverIds={serverIds}
            onSave={saveEnabledServers}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
