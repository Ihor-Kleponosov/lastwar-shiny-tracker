import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { shinyTasksConfiguration } from '@/config'
import type { ServerId } from '@/types'
import { ServerListConfigurationGroupedGrid } from './ServerListConfigurationGroupedGrid'

type ServerListConfigurationGroupedViewProps = {
  displayedServerIds: readonly ServerId[]
  enabledServerIds: ReadonlySet<ServerId>
  onToggleServer: (serverId: ServerId) => void
}

const groupLabels = ['A', 'B', 'C'] as const

export function ServerListConfigurationGroupedView({
  displayedServerIds,
  enabledServerIds,
  onToggleServer,
}: ServerListConfigurationGroupedViewProps) {
  const { t } = useTranslation('common')
  const displayedServerIdSet = new Set(displayedServerIds)

  return (
    <div className="mt-4">
      {groupLabels.map((label, groupIndex) => {
        const serverGroup = shinyTasksConfiguration.serverGroups[groupIndex] ?? []
        const groupLabel = t('settings.serverList.groupLabel', {
          label,
        })
        const displayedGroupServerIds = serverGroup.filter((serverId) =>
          displayedServerIdSet.has(serverId),
        )

        return (
          <Fragment key={label}>
            <section aria-labelledby={`server-group-${label}-heading`}>
              <h3
                id={`server-group-${label}-heading`}
                className="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                {groupLabel}
              </h3>
              {displayedGroupServerIds.length > 0 ? (
                <ServerListConfigurationGroupedGrid
                  accessibleName={groupLabel}
                  enabledServerIds={enabledServerIds}
                  onToggleServer={onToggleServer}
                  serverIds={displayedGroupServerIds}
                />
              ) : (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {t('settings.serverList.noGroupResults')}
                </p>
              )}
            </section>
            <hr className="my-4 border-[var(--color-border)]" />
          </Fragment>
        )
      })}
    </div>
  )
}
