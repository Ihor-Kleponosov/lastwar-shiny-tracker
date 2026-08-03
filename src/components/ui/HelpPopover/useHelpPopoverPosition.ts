import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'
import {
  calculateHelpPopoverPosition,
  type HelpPopoverPosition,
} from './calculateHelpPopoverPosition'

type UseHelpPopoverPositionOptions = {
  containerRef: RefObject<HTMLDivElement | null>
  isOpen: boolean
  popoverRef: RefObject<HTMLDivElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
}

function arePositionsEqual(
  current: HelpPopoverPosition | null,
  next: HelpPopoverPosition,
): boolean {
  return (
    current?.left === next.left &&
    current.maxHeight === next.maxHeight &&
    current.placement === next.placement &&
    current.top === next.top &&
    current.width === next.width
  )
}

export function useHelpPopoverPosition({
  containerRef,
  isOpen,
  popoverRef,
  triggerRef,
}: UseHelpPopoverPositionOptions): CSSProperties | null {
  const [position, setPosition] = useState<HelpPopoverPosition | null>(null)

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null)
      return
    }

    const observedContainer = containerRef.current
    const observedPopover = popoverRef.current
    const observedTrigger = triggerRef.current
    if (!observedContainer || !observedPopover || !observedTrigger) return

    function updatePosition() {
      const container = containerRef.current
      const popover = popoverRef.current
      const trigger = triggerRef.current
      if (!container || !popover || !trigger) return

      const nextPosition = calculateHelpPopoverPosition({
        containerRect: container.getBoundingClientRect(),
        popoverRect: popover.getBoundingClientRect(),
        triggerRect: trigger.getBoundingClientRect(),
        viewportHeight: document.documentElement.clientHeight || window.innerHeight,
        viewportWidth: document.documentElement.clientWidth || window.innerWidth,
      })

      setPosition((current) => (arePositionsEqual(current, nextPosition) ? current : nextPosition))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }

    const resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(observedContainer)
    resizeObserver.observe(observedPopover)
    resizeObserver.observe(observedTrigger)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [containerRef, isOpen, popoverRef, triggerRef])

  if (!position) return null

  return {
    left: position.left,
    maxHeight: position.maxHeight,
    top: position.top,
    width: position.width,
  }
}
