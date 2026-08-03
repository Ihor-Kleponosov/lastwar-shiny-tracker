const VIEWPORT_GUTTER = 16
const POPOVER_MAX_WIDTH = 448
const POPOVER_OFFSET = 8

type PopoverRect = Pick<DOMRect, 'bottom' | 'height' | 'left' | 'right' | 'top'>

type CalculateHelpPopoverPositionOptions = {
  containerRect: PopoverRect
  popoverRect: PopoverRect
  triggerRect: PopoverRect
  viewportHeight: number
  viewportWidth: number
}

export type HelpPopoverPosition = {
  left: number
  maxHeight: number
  placement: 'bottom' | 'top'
  top: number
  width: number
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function calculateHelpPopoverPosition({
  containerRect,
  popoverRect,
  triggerRect,
  viewportHeight,
  viewportWidth,
}: CalculateHelpPopoverPositionOptions): HelpPopoverPosition {
  const horizontalGutter = Math.min(VIEWPORT_GUTTER, viewportWidth / 2)
  const width = Math.min(POPOVER_MAX_WIDTH, Math.max(viewportWidth - horizontalGutter * 2, 0))
  const preferredLeft = triggerRect.right - width
  const absoluteLeft = clamp(
    preferredLeft,
    horizontalGutter,
    viewportWidth - horizontalGutter - width,
  )

  const verticalGutter = Math.min(VIEWPORT_GUTTER, viewportHeight / 2)
  const availableHeightBelow = Math.max(
    viewportHeight - verticalGutter - triggerRect.bottom - POPOVER_OFFSET,
    0,
  )
  const availableHeightAbove = Math.max(triggerRect.top - POPOVER_OFFSET - verticalGutter, 0)
  const placement = popoverRect.height <= availableHeightBelow ? 'bottom' : 'top'
  const maxHeight = placement === 'bottom' ? availableHeightBelow : availableHeightAbove
  const absoluteTop =
    placement === 'bottom'
      ? triggerRect.bottom + POPOVER_OFFSET
      : triggerRect.top - POPOVER_OFFSET - Math.min(popoverRect.height, maxHeight)

  return {
    left: absoluteLeft - containerRect.left,
    maxHeight,
    placement,
    top: absoluteTop - containerRect.top,
    width,
  }
}
