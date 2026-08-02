import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useServerPreferences } from '@/hooks/useServerPreferences'
import { ServerListConfigurationControls } from './ServerListConfigurationControls'
import { ServerListConfigurationItem } from './ServerListConfigurationItem'

export function ServerListConfiguration() {
  const { t } = useTranslation('common')
  const { enabledServerIds, serverIds, toggleServer, toggleServers } = useServerPreferences()
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
        onToggleServers={toggleServers}
        serverIds={serverIds}
        displayedServerIds={filteredServerIds}
      />
      {filteredServerIds.length === 0 ? (
        <p className="mt-4 text-sm text-center text-[var(--color-text-secondary)]" role="status">
          {t('settings.serverList.noResults')}
        </p>
      ) : null}
      <ul
        className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(88px,1fr))] gap-2"
        aria-label={t('settings.serverList.title')}
      >
        {filteredServerIds.map((serverId) => (
          <ServerListConfigurationItem
            key={serverId}
            serverId={serverId}
            isSelected={enabledServerIds.has(serverId)}
            onToggle={toggleServer}
          />
        ))}
      </ul>
    </section>
  )
}
