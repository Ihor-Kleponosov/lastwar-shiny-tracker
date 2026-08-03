import { describe, expect, it } from 'vitest'
import { calculateHelpPopoverPosition } from './calculateHelpPopoverPosition'

function createRect({
  bottom,
  height,
  left,
  right,
  top,
}: {
  bottom: number
  height: number
  left: number
  right: number
  top: number
}): DOMRect {
  return { bottom, height, left, right, top } as DOMRect
}

describe('calculateHelpPopoverPosition', () => {
  const containerRect = createRect({ bottom: 80, height: 44, left: 300, right: 344, top: 36 })
  const popoverRect = createRect({ bottom: 180, height: 160, left: 0, right: 0, top: 0 })

  it('uses the available width and keeps a right-aligned popover within a narrow viewport', () => {
    expect(
      calculateHelpPopoverPosition({
        containerRect,
        popoverRect,
        triggerRect: createRect({ bottom: 80, height: 44, left: 300, right: 344, top: 36 }),
        viewportHeight: 640,
        viewportWidth: 360,
      }),
    ).toMatchObject({ left: -284, maxHeight: 536, placement: 'bottom', top: 52, width: 328 })
  })

  it('clamps a left-edge trigger without reducing the maximum desktop width', () => {
    expect(
      calculateHelpPopoverPosition({
        containerRect: createRect({ bottom: 80, height: 44, left: 16, right: 60, top: 36 }),
        popoverRect,
        triggerRect: createRect({ bottom: 80, height: 44, left: 16, right: 60, top: 36 }),
        viewportHeight: 800,
        viewportWidth: 1280,
      }),
    ).toMatchObject({ left: 0, maxHeight: 696, placement: 'bottom', top: 52, width: 448 })
  })

  it('flips above the trigger and limits height when there is not enough room below', () => {
    expect(
      calculateHelpPopoverPosition({
        containerRect,
        popoverRect: createRect({ bottom: 300, height: 240, left: 0, right: 0, top: 0 }),
        triggerRect: createRect({ bottom: 620, height: 44, left: 300, right: 344, top: 576 }),
        viewportHeight: 640,
        viewportWidth: 360,
      }),
    ).toMatchObject({ left: -284, maxHeight: 552, placement: 'top', top: 292, width: 328 })
  })
})
