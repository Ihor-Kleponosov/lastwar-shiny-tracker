import { Search, X } from 'lucide-react'
import classNames from 'class-names'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import type { ServerId } from '@/types'

type ServerListConfigurationControlsProps = {
  displayedServerIds: readonly ServerId[]
  enabledServerIds: ReadonlySet<ServerId>
  filterMode: 'range' | 'search'
  isFilterActive: boolean
  isRangeApplyDisabled: boolean
  onApplyRange: () => void
  onFilterModeChange: (mode: 'range' | 'search') => void
  onRangeFromChange: (value: string) => void
  onRangeToChange: (value: string) => void
  onResetFilter: () => void
  onSearchFilterChange: (filter: string) => void
  onToggleServers: (serverIds: readonly ServerId[]) => void
  rangeFrom: string
  rangeTo: string
  searchFilter: string
  serverIds: readonly ServerId[]
}

export function ServerListConfigurationControls({
  displayedServerIds,
  enabledServerIds,
  filterMode,
  isFilterActive,
  isRangeApplyDisabled,
  onApplyRange,
  onFilterModeChange,
  onRangeFromChange,
  onRangeToChange,
  onResetFilter,
  onSearchFilterChange,
  onToggleServers,
  rangeFrom,
  rangeTo,
  searchFilter,
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
    onSearchFilterChange(event.target.value)
  }

  function handleRangeChange(
    onChange: (value: string) => void,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onChange(event.target.value.replace(/\D/g, ''))
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div
        className="grid grid-cols-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
        role="tablist"
      >
        {(['range', 'search'] as const).map((mode) => (
          <button
            key={mode}
            id={`server-filter-tab-${mode}`}
            type="button"
            role="tab"
            aria-selected={filterMode === mode}
            aria-controls={`server-filter-panel-${mode}`}
            tabIndex={filterMode === mode ? 0 : -1}
            onClick={() => onFilterModeChange(mode)}
            className={classNames(
              'min-h-9 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
              filterMode === mode
                ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {t(`settings.serverList.filter${mode === 'range' ? 'ByRange' : 'Search'}`)}
          </button>
        ))}
      </div>
      {filterMode === 'range' ? (
        <div
          id="server-filter-panel-range"
          role="tabpanel"
          aria-labelledby="server-filter-tab-range"
          className="grid grid-cols-[1fr_1fr_auto] gap-2"
        >
          <div className="min-w-0">
            <label htmlFor="server-range-from" className="sr-only">
              {t('settings.serverList.rangeFrom')}
            </label>
            <input
              id="server-range-from"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={rangeFrom}
              onChange={(event) => handleRangeChange(onRangeFromChange, event)}
              placeholder={t('settings.serverList.rangeFrom')}
              className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="server-range-to" className="sr-only">
              {t('settings.serverList.rangeTo')}
            </label>
            <input
              id="server-range-to"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={rangeTo}
              onChange={(event) => handleRangeChange(onRangeToChange, event)}
              placeholder={t('settings.serverList.rangeTo')}
              className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            />
          </div>
          <Button disabled={isRangeApplyDisabled} onClick={onApplyRange}>
            {t('settings.serverList.applyRange')}
          </Button>
        </div>
      ) : (
        <div
          id="server-filter-panel-search"
          role="tabpanel"
          aria-labelledby="server-filter-tab-search"
          className="relative min-w-0 flex-1"
        >
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
            value={searchFilter}
            onChange={handleFilterChange}
            placeholder={t('settings.serverList.searchPlaceholder')}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pr-11 pl-10 text-sm text-[var(--color-text-primary)] outline-none appearance-none placeholder:text-[var(--color-text-muted)] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          />
          {searchFilter && (
            <button
              type="button"
              aria-label={t('settings.serverList.clearSearch')}
              onClick={() => onSearchFilterChange('')}
              className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-r-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
            >
              <X aria-hidden="true" size={18} />
            </button>
          )}
        </div>
      )}
      <div className="grid w-full grid-cols-2 gap-2 text-sm">
        <Button className="w-full" onClick={() => onToggleServers(serverIds)}>
          {selectAllLabel}
        </Button>
        {isFiltered ? (
          <Button
            className="w-full"
            disabled={displayedServerIds.length === 0}
            onClick={() => onToggleServers(displayedServerIds)}
          >
            {selectDisplayedLabel}
          </Button>
        ) : null}
      </div>
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
