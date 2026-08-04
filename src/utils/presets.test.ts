import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPresets, PRESETS_STORAGE_KEY, savePresets } from './presets'

vi.mock('@/config', () => ({
  shinyTasksConfiguration: {
    anchorDate: '2026-07-15',
    serverGroups: [Array.from({ length: 100 }, (_, index) => 1637 + index)],
  },
}))

describe('presets storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when presets are absent', () => {
    expect(getPresets()).toEqual([])
  })

  it('saves and reads presets', () => {
    const presets = [{ id: 'preset-1', name: 'Weekly', enabledServerIds: [1638, 1640] }]

    savePresets(presets)

    expect(getPresets()).toEqual(presets)
    expect(localStorage.getItem(PRESETS_STORAGE_KEY)).toBe(JSON.stringify(presets))
  })

  it('normalizes unknown, duplicate, and over-limit server IDs', () => {
    localStorage.setItem(
      PRESETS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'preset-1',
          name: 'Weekly',
          enabledServerIds: [1700, 1638, 1638, 9999, 1640],
        },
      ]),
    )

    expect(getPresets()).toEqual([
      { id: 'preset-1', name: 'Weekly', enabledServerIds: [1638, 1640, 1700] },
    ])
  })

  it('recovers from malformed presets', () => {
    localStorage.setItem(PRESETS_STORAGE_KEY, '{invalid JSON')

    expect(getPresets()).toEqual([])
  })

  it('keeps saving usable when storage is unavailable', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    expect(() => savePresets([])).not.toThrow()

    setItemSpy.mockRestore()
  })
})
