import { Search, X } from 'lucide-react'
import classNames from 'class-names'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ServerId } from '@/types'

type ServerListConfigurationControlsProps = {
  displayedServerIds: readonly ServerId[]
  enabledServerIds: ReadonlySet<ServerId>
  filter: string
  onFilterChange: (filter: string) => void
  onToggleServers: (serverIds: readonly ServerId[]) => void
  serverIds: readonly ServerId[]
}

export function ServerListConfigurationControls({
  displayedServerIds,
  enabledServerIds,
  filter,
  onFilterChange,
  onToggleServers,
  serverIds,
}: ServerListConfigurationControlsProps) {
  const { t } = useTranslation('common')
  const areAllServersSelected = serverIds.every((serverId) => enabledServerIds.has(serverId))
  const areDisplayedServersSelected =
    displayedServerIds.length > 0 &&
    displayedServerIds.every((serverId) => enabledServerIds.has(serverId))
  const isFiltered = serverIds.length !== displayedServerIds.length
  const selectAllLabel = t(
    areAllServersSelected ? 'settings.serverList.deselectAll' : 'settings.serverList.selectAll',
  )
  const selectDisplayedLabel = t(
    areDisplayedServersSelected
      ? 'settings.serverList.deselectDisplayed'
      : 'settings.serverList.selectDisplayed',
  )

  function handleFilterChange(event: ChangeEvent<HTMLInputElement>) {
    onFilterChange(event.target.value)
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <label htmlFor="server-filter" className="sr-only">
          {t('settings.serverList.searchLabel')}
        </label>
        <input
          id="server-filter"
          type="search"
          value={filter}
          onChange={handleFilterChange}
          placeholder={t('settings.serverList.searchPlaceholder')}
          className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pr-11 pl-10 text-sm text-[var(--color-text-primary)] outline-none appearance-none placeholder:text-[var(--color-text-muted)] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
        />
        {filter && (
          <button
            type="button"
            aria-label={t('settings.serverList.clearSearch')}
            onClick={() => onFilterChange('')}
            className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-r-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
          >
            <X aria-hidden="true" size={18} />
          </button>
        )}
      </div>
      <div className="grid w-full grid-cols-2 gap-2 text-sm">
        <button
          type="button"
          onClick={() => onToggleServers(serverIds)}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-center font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none"
        >
          {selectAllLabel}
        </button>
        {isFiltered ? (
          <button
            type="button"
            disabled={displayedServerIds.length === 0}
            onClick={() => onToggleServers(displayedServerIds)}
            className={classNames(
              'inline-flex min-h-11 w-full items-center justify-center rounded-lg border px-3 text-center font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none',
              displayedServerIds.length === 0
                ? 'cursor-not-allowed border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                : 'cursor-pointer border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {selectDisplayedLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
