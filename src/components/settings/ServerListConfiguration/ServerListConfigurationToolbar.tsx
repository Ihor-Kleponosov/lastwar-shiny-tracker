import { useTranslation } from 'react-i18next'
import { ServerListViewSwitcher, type ServerListView } from './ServerListViewSwitcher'

type ServerListConfigurationToolbarProps = {
  isFilterActive: boolean
  onResetFilter: () => void
  onViewChange: (view: ServerListView) => void
  view: ServerListView
}

export function ServerListConfigurationToolbar({
  isFilterActive,
  onResetFilter,
  onViewChange,
  view,
}: ServerListConfigurationToolbarProps) {
  const { t } = useTranslation('common')

  return (
    <div className="mt-3 flex min-h-11 items-center justify-between gap-3">
      <ServerListViewSwitcher value={view} onChange={onViewChange} />
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
  )
}
