import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar } from '@/components/calendar/Calendar'
import { DateSummary } from '@/components/date/DateSummary'
import { Header } from '@/components/layout/Header'
import { ConfigurationModal } from '@/components/settings/ConfigurationModal'
import { ServerList } from '@/components/servers/ServerList'
import { useServerPreferences } from '@/hooks/useServerPreferences'

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const { enabledServerIds, serverIds, toggleServer, toggleServers } = useServerPreferences()
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header />
        <DateSummary
          enabledServerIds={enabledServerIds}
          selectedDate={selectedDate}
          isCalendarVisible={isCalendarVisible}
          onToggleCalendar={() => setIsCalendarVisible((isVisible) => !isVisible)}
        />
        <AnimatePresence initial={false}>
          {isCalendarVisible ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </motion.div>
          ) : null}
        </AnimatePresence>
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
            onToggleServer={toggleServer}
            onToggleServers={toggleServers}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
