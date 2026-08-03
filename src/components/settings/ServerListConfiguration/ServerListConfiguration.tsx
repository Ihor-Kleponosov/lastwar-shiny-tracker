import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ServerId } from '@/types'
import { ServerListConfigurationControls } from './ServerListConfigurationControls'
import { ServerListConfigurationItem } from './ServerListConfigurationItem'

type AppliedRange = {
  from: number
  to: number
}

type ServerListConfigurationProps = {
  enabledServerIds: ReadonlySet<ServerId>
  onToggleServer: (serverId: ServerId) => void
  onToggleServers: (serverIds: readonly ServerId[]) => void
  serverIds: readonly ServerId[]
}

export function ServerListConfiguration({
  enabledServerIds,
  onToggleServer,
  onToggleServers,
  serverIds,
}: ServerListConfigurationProps) {
  const { t } = useTranslation('common')
  const [filterMode, setFilterMode] = useState<'range' | 'search'>('range')
  const [searchFilter, setSearchFilter] = useState('')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [appliedRange, setAppliedRange] = useState<AppliedRange | null>(null)
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
        isFilterActive={searchFilter.length > 0 || appliedRange !== null}
        onFilterModeChange={handleFilterModeChange}
        onSearchFilterChange={setSearchFilter}
        onRangeFromChange={setRangeFrom}
        onRangeToChange={setRangeTo}
        onApplyRange={handleApplyRange}
        onResetFilter={handleResetFilter}
        onToggleServers={onToggleServers}
        serverIds={serverIds}
        displayedServerIds={displayedServerIds}
      />
      {displayedServerIds.length === 0 ? (
        <p className="mt-4 text-sm text-center text-[var(--color-text-secondary)]" role="status">
          {t('settings.serverList.noResults')}
        </p>
      ) : null}
      <ul
        className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2"
        aria-label={t('settings.serverList.title')}
      >
        {displayedServerIds.map((serverId) => (
          <ServerListConfigurationItem
            key={serverId}
            serverId={serverId}
            isSelected={enabledServerIds.has(serverId)}
            onToggle={onToggleServer}
          />
        ))}
      </ul>
    </section>
  )
}
