import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/app-shell/Header'
import { PresetList } from '@/components/features/presets/PresetList'
import { Button } from '@/components/shared/ui/Button'
import type { Preset } from '@/types'
import { generateUniqueId } from '@/utils'

type PresetsPageProps = {
  onBack: () => void
  onNavigateHome: () => void
}

export function PresetsPage({ onBack, onNavigateHome }: PresetsPageProps) {
  const { t } = useTranslation('common')
  const [presets] = useState<readonly Preset[]>(() => [
    { id: generateUniqueId(), name: 'Main servers' },
    { id: generateUniqueId(), name: 'Event servers' },
    { id: generateUniqueId(), name: 'Backup servers' },
  ])

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <section
          className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:gap-4 sm:p-5"
          aria-labelledby="presets-page-title"
        >
          <h1
            id="presets-page-title"
            className="text-xl font-semibold text-[var(--color-text-primary)]"
          >
            {t('presets.pageTitle')}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t('presets.pageDescription')}
          </p>
          <PresetList presets={presets} />
          <div className="pt-1">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={onBack}>
              {t('presets.back')}
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
