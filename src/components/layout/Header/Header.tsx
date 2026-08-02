import { Settings } from 'lucide-react'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import shinyTrackerLogo from '@/assets/shiny-tracker-logo.png'
import { IconButton } from '@/components/ui/IconButton'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

type HeaderProps = {
  onOpenSettings: () => void
  settingsButtonRef: RefObject<HTMLButtonElement | null>
}

export function Header({ onOpenSettings, settingsButtonRef }: HeaderProps) {
  const { t } = useTranslation('common')

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:px-4">
      <div className="grid grid-cols-[100px_minmax(0,1fr)_88px] items-center">
        <img
          className="size-[80px] rounded-xl"
          src={shinyTrackerLogo}
          width="90"
          height="90"
          alt={t('app.logoAlt')}
        />
        <h1 className="min-w-0 px-2 text-left text-xl font-bold leading-normal tracking-normal text-[var(--color-text-primary)] sm:text-center">
          Last War <br className="sm:hidden" />
          Shiny Tracker
        </h1>
        <div className="flex items-center justify-end">
          <LanguageSwitcher />
          <IconButton
            ref={settingsButtonRef}
            aria-label={t('settings.open')}
            onClick={onOpenSettings}
          >
            <Settings aria-hidden="true" size={20} />
          </IconButton>
        </div>
      </div>
    </header>
  )
}
