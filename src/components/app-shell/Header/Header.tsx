import { useTranslation } from 'react-i18next'
import shinyTrackerLogo from '@/assets/shiny-tracker-logo.png'
import { LanguageSwitcher } from '@/components/app-shell/LanguageSwitcher'

type HeaderProps = {
  onNavigateHome: () => void
}

export function Header({ onNavigateHome }: HeaderProps) {
  const { t } = useTranslation('common')

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:px-4">
      <div className="grid grid-cols-[88px_minmax(0,1fr)_88px] items-center">
        <button
          type="button"
          className="w-fit rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          aria-label={t('app.goHome')}
          onClick={onNavigateHome}
        >
          <img
            className="size-[72px] rounded-xl"
            src={shinyTrackerLogo}
            width="72"
            height="72"
            alt={t('app.logoAlt')}
          />
        </button>
        <h1 className="min-w-0 px-2 text-left text-base font-bold leading-normal tracking-normal text-[var(--color-text-primary)] sm:text-center">
          Last War Shiny Tracker
        </h1>
        <div className="flex items-center justify-end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
