import { Header } from '@/components/layout/Header'

export default function App() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <Header />
      </div>
    </main>
  )
}
