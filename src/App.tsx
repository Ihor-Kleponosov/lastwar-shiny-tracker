import { useState } from 'react'
import { Calendar } from '@/components/calendar/Calendar'
import { Header } from '@/components/layout/Header'

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header />
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
    </main>
  )
}
