import { describe, expect, it, vi } from 'vitest'
import type { Preset } from '@/types'
import {
  createPresetTransfer,
  downloadPresetTransfer,
  getPresetTransferFilename,
  PRESET_TRANSFER_VERSION,
  serializePresetsForTransfer,
} from './presetTransfer'

const presets: readonly Preset[] = [
  { id: 'first', name: 'First preset', enabledServerIds: [1638, 1639] },
  { id: 'second', name: 'Second preset', enabledServerIds: [] },
]

describe('preset transfer', () => {
  it('serializes the supplied presets in a versioned envelope without changing their structure or order', () => {
    expect(serializePresetsForTransfer([presets[1], presets[0]])).toBe(
      JSON.stringify({ version: PRESET_TRANSFER_VERSION, presets: [presets[1], presets[0]] }),
    )
  })

  it('creates a v1 transfer envelope for future import migrations', () => {
    expect(createPresetTransfer(presets)).toEqual({ version: 1, presets })
  })

  it('uses a clear, date-based LWST filename', () => {
    expect(getPresetTransferFilename(new Date(2026, 7, 20))).toBe(
      'last-war-shiny-tracker-presets-2026-08-20.lwst',
    )
  })

  it('downloads the JSON transfer through a Blob URL with an LWST filename', () => {
    Object.defineProperties(URL, {
      createObjectURL: { configurable: true, value: vi.fn() },
      revokeObjectURL: { configurable: true, value: vi.fn() },
    })
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:presets')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe('last-war-shiny-tracker-presets-2026-08-20.lwst')
    })
    const createElement = vi.spyOn(document, 'createElement')

    downloadPresetTransfer([presets[1]], new Date(2026, 7, 20))

    expect(createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'application/json' }),
    )
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(click).toHaveBeenCalledOnce()
    expect(createElement).toHaveBeenCalledWith('a')
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:presets')
  })
})
