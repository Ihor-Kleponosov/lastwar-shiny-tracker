import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/ui/IconButton'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export function Header() {
  const { t } = useTranslation('common')

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:px-4">
      <div className="grid grid-cols-[100px_minmax(0,1fr)_88px] items-center">
        <img
          className="size-[100px] rounded-xl"
          src="/shiny-tracker-logo.png"
          width="100"
          height="100"
          alt={t('app.logoAlt')}
        />
        <h1 className="min-w-0 px-2 text-center text-sm font-bold tracking-tight text-[var(--color-text-primary)] sm:text-xl">
          Last War Shiny Tracker
        </h1>
        <div className="flex items-center justify-end">
          <LanguageSwitcher />
          <IconButton aria-label={t('settings.open')}>
            <Settings aria-hidden="true" size={20} />
          </IconButton>
        </div>
      </div>
    </header>
  )
}
