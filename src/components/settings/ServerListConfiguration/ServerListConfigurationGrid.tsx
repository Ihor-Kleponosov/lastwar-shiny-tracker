import type { ServerId } from '@/types'
import { ServerListConfigurationItem } from './ServerListConfigurationItem'

type ServerListConfigurationGridProps = {
  accessibleName: string
  enabledServerIds: ReadonlySet<ServerId>
  onToggleServer: (serverId: ServerId) => void
  serverIds: readonly ServerId[]
}

export function ServerListConfigurationGrid({
  accessibleName,
  enabledServerIds,
  onToggleServer,
  serverIds,
}: ServerListConfigurationGridProps) {
  return (
    <ul
      className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2"
      aria-label={accessibleName}
    >
      {serverIds.map((serverId) => (
        <ServerListConfigurationItem
          key={serverId}
          serverId={serverId}
          isSelected={enabledServerIds.has(serverId)}
          onToggle={onToggleServer}
        />
      ))}
    </ul>
  )
}
