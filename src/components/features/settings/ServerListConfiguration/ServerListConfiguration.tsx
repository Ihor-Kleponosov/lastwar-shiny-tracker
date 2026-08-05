import { useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { ServerId } from '@/types'
import { ServerListConfigurationControls } from './ServerListConfigurationControls'
import { ServerListConfigurationGrid } from './ServerListConfigurationGrid'
import { ServerListConfigurationGroupedView } from './ServerListConfigurationGroupedView'
import { ServerListConfigurationToolbar } from './ServerListConfigurationToolbar'
import type { ServerListView } from './ServerListViewSwitcher'

type AppliedRange = {
  from: number
  to: number
}

type ServerListConfigurationProps = {
  enabledServerIds: ReadonlySet<ServerId>
  onClearServers: (serverIds: readonly ServerId[]) => void
  onToggleServer: (serverId: ServerId) => void
  onToggleServers: (serverIds: readonly ServerId[]) => void
  scrollContainerRef: RefObject<HTMLElement | null>
  serverIds: readonly ServerId[]
}

export function ServerListConfiguration({
  enabledServerIds,
  onClearServers,
  onToggleServer,
  onToggleServers,
  scrollContainerRef,
  serverIds,
}: ServerListConfigurationProps) {
  const { t } = useTranslation('common')
  const [filterMode, setFilterMode] = useState<'range' | 'search'>('range')
  const [searchFilter, setSearchFilter] = useState('')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [appliedRange, setAppliedRange] = useState<AppliedRange | null>(null)
  const [view, setView] = useState<ServerListView>('all')
  const isFilterActive = searchFilter.length > 0 || appliedRange !== null
  const displayedServerIds = serverIds.filter((serverId) => {
    if (filterMode === 'search') return String(serverId).includes(searchFilter)
    if (!appliedRange) return true

    return serverId >= appliedRange.from && serverId <= appliedRange.to
  })

  function handleFilterModeChange(mode: 'range' | 'search') {
    setFilterMode(mode)
    setSearchFilter('')
    setRangeFrom('')
    setRangeTo('')
    setAppliedRange(null)
  }

  function handleApplyRange() {
    const firstValue = Number(rangeFrom)
    const secondValue = Number(rangeTo)
    const range =
      firstValue <= secondValue
        ? { from: firstValue, to: secondValue }
        : { from: secondValue, to: firstValue }

    setRangeFrom(String(range.from))
    setRangeTo(String(range.to))
    setAppliedRange(range)
  }

  function handleResetFilter() {
    setSearchFilter('')
    setRangeFrom('')
    setRangeTo('')
    setAppliedRange(null)
  }

  return (
    <section aria-label={t('settings.serverList.title')}>
      <ServerListConfigurationControls
        enabledServerIds={enabledServerIds}
        filterMode={filterMode}
        searchFilter={searchFilter}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        isRangeApplyDisabled={!rangeFrom || !rangeTo}
        onFilterModeChange={handleFilterModeChange}
        onSearchFilterChange={setSearchFilter}
        onRangeFromChange={setRangeFrom}
        onRangeToChange={setRangeTo}
        onApplyRange={handleApplyRange}
        onClearSelection={() => onClearServers(displayedServerIds)}
        onToggleServers={onToggleServers}
        displayedServerIds={displayedServerIds}
      />
      <ServerListConfigurationToolbar
        enabledServerCount={enabledServerIds.size}
        isFilterActive={isFilterActive}
        onResetFilter={handleResetFilter}
        onViewChange={setView}
        view={view}
      />
      {view === 'all' ? (
        displayedServerIds.length > 0 ? (
          <ServerListConfigurationGrid
            accessibleName={t('settings.serverList.title')}
            enabledServerIds={enabledServerIds}
            onToggleServer={onToggleServer}
            scrollContainerRef={scrollContainerRef}
            serverIds={displayedServerIds}
          />
        ) : (
          <p className="mt-4 text-sm text-center text-[var(--color-text-secondary)]" role="status">
            {t('settings.serverList.noResults')}
          </p>
        )
      ) : (
        <ServerListConfigurationGroupedView
          displayedServerIds={displayedServerIds}
          enabledServerIds={enabledServerIds}
          onToggleServer={onToggleServer}
        />
      )}
    </section>
  )
}
