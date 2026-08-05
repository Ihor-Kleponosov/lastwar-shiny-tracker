import { useTranslation } from 'react-i18next'
import { ServerListViewSwitcher, type ServerListView } from './ServerListViewSwitcher'
import { MAX_ENABLED_SERVERS } from '@/utils/serverPreferences'

type ServerListConfigurationToolbarProps = {
  enabledServerCount: number
  isFilterActive: boolean
  onResetFilter: () => void
  onViewChange: (view: ServerListView) => void
  view: ServerListView
}

export function ServerListConfigurationToolbar({
  enabledServerCount,
  isFilterActive,
  onResetFilter,
  onViewChange,
  view,
}: ServerListConfigurationToolbarProps) {
  const { t } = useTranslation('common')

  return (
    <div className="mt-3 flex min-h-11 items-end justify-between gap-3">
      <ServerListViewSwitcher value={view} onChange={onViewChange} />
      <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-3">
        <p className="whitespace-nowrap text-right text-sm font-medium tabular-nums text-[var(--color-text-secondary)]">
          {t('settings.serverList.selectedCount', {
            count: enabledServerCount,
            maximum: MAX_ENABLED_SERVERS,
          })}
        </p>
        {isFilterActive ? (
          <button
            type="button"
            onClick={onResetFilter}
            className="w-fit text-sm text-[var(--color-text-secondary)] underline decoration-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-text-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {t('settings.serverList.resetFilter')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
