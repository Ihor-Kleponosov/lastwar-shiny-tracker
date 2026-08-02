import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ServerId } from '@/types'
import { ServerListConfigurationControls } from './ServerListConfigurationControls'
import { ServerListConfigurationItem } from './ServerListConfigurationItem'

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
  const [filter, setFilter] = useState('')
  const filteredServerIds = serverIds.filter((serverId) => String(serverId).includes(filter))

  return (
    <section aria-labelledby="server-list-configuration-heading">
      <h3
        id="server-list-configuration-heading"
        className="text-lg font-semibold text-[var(--color-text-primary)]"
      >
        {t('settings.serverList.title')}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        {t('settings.serverList.description')}
      </p>
      <ServerListConfigurationControls
        enabledServerIds={enabledServerIds}
        filter={filter}
        onFilterChange={setFilter}
        onToggleServers={onToggleServers}
        serverIds={serverIds}
        displayedServerIds={filteredServerIds}
      />
      {filteredServerIds.length === 0 ? (
        <p className="mt-4 text-sm text-center text-[var(--color-text-secondary)]" role="status">
          {t('settings.serverList.noResults')}
        </p>
      ) : null}
      <ul
        className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2"
        aria-label={t('settings.serverList.title')}
      >
        {filteredServerIds.map((serverId) => (
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
