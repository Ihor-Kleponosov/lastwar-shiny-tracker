import { AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar } from '@/components/calendar/Calendar'
import { Header } from '@/components/layout/Header'
import { ConfigurationModal } from '@/components/settings/ConfigurationModal'
import { ServerList } from '@/components/servers/ServerList'

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header
          onOpenSettings={() => setIsConfigurationOpen(true)}
          settingsButtonRef={settingsButtonRef}
        />
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <ServerList selectedDate={selectedDate} />
      </div>
      <AnimatePresence>
        {isConfigurationOpen ? (
          <ConfigurationModal
            onClose={() => setIsConfigurationOpen(false)}
            returnFocusRef={settingsButtonRef}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
