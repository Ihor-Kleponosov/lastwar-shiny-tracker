import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { shinyTasksConfiguration } from '@/config'
import type { Preset, ServerId } from '@/types'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import { ServerChip } from './ServerChip'

type ServerListProps = {
  preset: Preset
  selectedDate: Date
}

function getActiveServers(selectedDate: Date, enabledServerIds: readonly ServerId[]): ServerId[] {
  const groupIndex = getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration)
  const enabledServerIdSet = new Set(enabledServerIds)

  return getServersForIndex(groupIndex, shinyTasksConfiguration)
    .filter((serverId) => enabledServerIdSet.has(serverId))
    .sort((first, second) => first - second)
}

export function ServerList({ preset, selectedDate }: ServerListProps) {
  const { t } = useTranslation('common')
  const activeServers = useMemo(
    () => getActiveServers(selectedDate, preset.enabledServerIds),
    [preset.enabledServerIds, selectedDate],
  )

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-4"
      aria-label={t('servers.count', { count: activeServers.length })}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{preset.name}</h2>
        <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
          {t('servers.count', { count: activeServers.length })}
        </p>
      </div>
      {activeServers.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">{t('servers.empty')}</p>
        </div>
      ) : (
        <ul
          className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2"
          aria-label={t('servers.count', { count: activeServers.length })}
        >
          {activeServers.map((serverId) => (
            <ServerChip key={serverId} serverId={serverId} />
          ))}
        </ul>
      )}
    </section>
  )
}
