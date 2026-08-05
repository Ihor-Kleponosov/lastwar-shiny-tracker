import { type RefObject } from 'react'
import type { ServerId } from '@/types'
import { ServerListConfigurationItem } from './ServerListConfigurationItem'
import { MIN_ITEM_WIDTH, useVirtualizedServerGrid } from './useVirtualizedServerGrid'

type ServerListConfigurationGridProps = {
  accessibleName: string
  className?: string
  enabledServerIds: ReadonlySet<ServerId>
  onToggleServer: (serverId: ServerId) => void
  scrollContainerRef: RefObject<HTMLElement | null>
  serverIds: readonly ServerId[]
}

export function ServerListConfigurationGrid({
  accessibleName,
  className = 'mt-2',
  enabledServerIds,
  onToggleServer,
  scrollContainerRef,
  serverIds,
}: ServerListConfigurationGridProps) {
  const { columnCount, gridRef, scrollMargin, totalSize, virtualRows } = useVirtualizedServerGrid({
    scrollContainerRef,
    serverCount: serverIds.length,
  })

  return (
    <ul
      ref={gridRef}
      className={`relative ${className}`}
      aria-label={accessibleName}
      style={{ height: totalSize }}
    >
      {virtualRows.map((virtualRow) => {
        const rowStart = virtualRow.index * columnCount
        const rowServerIds = serverIds.slice(rowStart, rowStart + columnCount)

        return (
          <li
            key={virtualRow.key}
            className="absolute top-0 left-0 w-full"
            style={{
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start - scrollMargin}px)`,
            }}
          >
            <ul
              className="grid h-full gap-2"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(${MIN_ITEM_WIDTH}px, 1fr))`,
              }}
            >
              {rowServerIds.map((serverId) => (
                <ServerListConfigurationItem
                  key={serverId}
                  serverId={serverId}
                  isSelected={enabledServerIds.has(serverId)}
                  onToggle={onToggleServer}
                />
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
