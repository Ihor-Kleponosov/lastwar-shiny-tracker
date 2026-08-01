import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { shinyTasksConfiguration } from '@/config'
import type { ServerId } from '@/types'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import { ServerChip } from './ServerChip'

type ServerListProps = {
  selectedDate: Date
}

function getActiveServers(selectedDate: Date): ServerId[] {
  const groupIndex = getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration)

  return getServersForIndex(groupIndex, shinyTasksConfiguration).sort(
    (first, second) => first - second,
  )
}

export function ServerList({ selectedDate }: ServerListProps) {
  const { t } = useTranslation('common')
  const activeServers = useMemo(() => getActiveServers(selectedDate), [selectedDate])

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-4"
      aria-labelledby="server-list-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="server-list-heading"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          {t('servers.title')}
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)]" aria-live="polite">
          {t('servers.active', { count: activeServers.length })}
        </p>
      </div>
      <ul
        className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(88px,1fr))] gap-2"
        aria-label={t('servers.title')}
      >
        {activeServers.map((serverId) => (
          <ServerChip key={serverId} serverId={serverId} />
        ))}
      </ul>
    </section>
  )
}
