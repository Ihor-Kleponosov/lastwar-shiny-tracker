import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function App() {
  const { t } = useTranslation('common')

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-100">
      <section className="text-center">
        <LoaderCircle className="mx-auto mb-4 size-8 animate-spin text-amber-400" aria-hidden />
        <h1 className="text-3xl font-semibold tracking-tight">{t('app.title')}</h1>
        <p className="mt-2 text-slate-400">{t('app.loading')}</p>
      </section>
    </main>
  )
}
