import { Settings } from 'lucide-react'
import { useMemo, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { shinyTasksConfiguration } from '@/config'
import { IconButton } from '@/components/ui/IconButton'
import type { ServerId } from '@/types'
import { getServerGroupIndexForDate, getServersForIndex } from '@/utils'
import { ServerChip } from './ServerChip'

type ServerListProps = {
  enabledServerIds: ReadonlySet<ServerId>
  onOpenSettings: () => void
  selectedDate: Date
  settingsButtonRef: RefObject<HTMLButtonElement | null>
}

function getActiveServers(selectedDate: Date, enabledServerIds: ReadonlySet<ServerId>): ServerId[] {
  const groupIndex = getServerGroupIndexForDate(selectedDate, shinyTasksConfiguration)

  return getServersForIndex(groupIndex, shinyTasksConfiguration)
    .filter((serverId) => enabledServerIds.has(serverId))
    .sort((first, second) => first - second)
}

export function ServerList({
  enabledServerIds,
  onOpenSettings,
  selectedDate,
  settingsButtonRef,
}: ServerListProps) {
  const { t } = useTranslation('common')
  const activeServers = useMemo(
    () => getActiveServers(selectedDate, enabledServerIds),
    [enabledServerIds, selectedDate],
  )

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-4"
      aria-labelledby="server-list-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2
          id="server-list-heading"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          {t('servers.title')}
        </h2>
        <div className="flex items-center gap-1">
          <p className="text-xs text-[var(--color-text-secondary)]" aria-live="polite">
            {t('servers.active', { count: activeServers.length })}
          </p>
          <IconButton
            ref={settingsButtonRef}
            aria-label={t('settings.open')}
            onClick={onOpenSettings}
          >
            <Settings aria-hidden="true" size={20} />
          </IconButton>
        </div>
      </div>
      {activeServers.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">{t('servers.empty')}</p>
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none"
          >
            {t('settings.open')}
          </button>
        </div>
      ) : (
        <ul
          className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(88px,1fr))] gap-2"
          aria-label={t('servers.title')}
        >
          {activeServers.map((serverId) => (
            <ServerChip key={serverId} serverId={serverId} />
          ))}
        </ul>
      )}
    </section>
  )
}
