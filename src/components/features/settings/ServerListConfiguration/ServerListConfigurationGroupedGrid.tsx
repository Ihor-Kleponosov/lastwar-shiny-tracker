import { useRef } from 'react'
import type { ServerId } from '@/types'
import { ServerListConfigurationGrid } from './ServerListConfigurationGrid'

type ServerListConfigurationGroupedGridProps = {
  accessibleName: string
  enabledServerIds: ReadonlySet<ServerId>
  onToggleServer: (serverId: ServerId) => void
  serverIds: readonly ServerId[]
}

export function ServerListConfigurationGroupedGrid({
  accessibleName,
  enabledServerIds,
  onToggleServer,
  serverIds,
}: ServerListConfigurationGroupedGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={scrollContainerRef} className="mt-2 max-h-[300px] overflow-y-auto">
      <ServerListConfigurationGrid
        accessibleName={accessibleName}
        className=""
        enabledServerIds={enabledServerIds}
        onToggleServer={onToggleServer}
        scrollContainerRef={scrollContainerRef}
        serverIds={serverIds}
      />
    </div>
  )
}
