import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual'
import { useLayoutEffect, useState, type RefObject } from 'react'

export const MIN_ITEM_WIDTH = 88
export const ITEM_HEIGHT = 44
export const GRID_GAP = 8

const ROW_OVERSCAN = 4

type UseVirtualizedServerGridOptions = {
  scrollContainerRef: RefObject<HTMLElement | null>
  serverCount: number
}

type VirtualizedServerGrid = {
  columnCount: number
  gridRef: (element: HTMLUListElement | null) => void
  scrollMargin: number
  totalSize: number
  virtualRows: readonly VirtualItem[]
}

export function calculateColumnCount(containerWidth: number): number {
  return Math.max(1, Math.floor((containerWidth + GRID_GAP) / (MIN_ITEM_WIDTH + GRID_GAP)))
}

export function calculateRowCount(serverCount: number, columnCount: number): number {
  return Math.ceil(serverCount / columnCount)
}

export function useVirtualizedServerGrid({
  scrollContainerRef,
  serverCount,
}: UseVirtualizedServerGridOptions): VirtualizedServerGrid {
  const [gridElement, setGridElement] = useState<HTMLUListElement | null>(null)
  const [columnCount, setColumnCount] = useState(1)
  const [scrollMargin, setScrollMargin] = useState(0)
  const rowCount = calculateRowCount(serverCount, columnCount)
  const virtualizer = useVirtualizer({
    count: rowCount,
    estimateSize: () => ITEM_HEIGHT,
    gap: GRID_GAP,
    getScrollElement: () => scrollContainerRef.current,
    overscan: ROW_OVERSCAN,
    scrollMargin,
  })

  useLayoutEffect(() => {
    if (!gridElement) {
      return
    }
    const observedGrid = gridElement

    function updateLayout() {
      const scrollContainer = scrollContainerRef.current
      const width = observedGrid.getBoundingClientRect().width
      const nextColumnCount = calculateColumnCount(width)

      setColumnCount((currentColumnCount) =>
        currentColumnCount === nextColumnCount ? currentColumnCount : nextColumnCount,
      )

      if (!scrollContainer) {
        return
      }

      const gridTop = observedGrid.getBoundingClientRect().top
      const scrollContainerTop = scrollContainer.getBoundingClientRect().top
      const nextScrollMargin = gridTop - scrollContainerTop + scrollContainer.scrollTop
      setScrollMargin((currentScrollMargin) =>
        currentScrollMargin === nextScrollMargin ? currentScrollMargin : nextScrollMargin,
      )
    }

    updateLayout()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(observedGrid)
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [gridElement, scrollContainerRef])

  useLayoutEffect(() => {
    virtualizer.measure()
  }, [columnCount, rowCount, virtualizer])

  return {
    columnCount,
    gridRef: setGridElement,
    scrollMargin,
    totalSize: virtualizer.getTotalSize(),
    virtualRows: virtualizer.getVirtualItems(),
  }
}
