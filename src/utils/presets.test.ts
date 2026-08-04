import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPresets, loadPresets, MAX_PRESETS, PRESETS_STORAGE_KEY, savePresets } from './presets'

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

  it('does not overwrite malformed presets when loading the page', () => {
    const storedPresets = '{invalid JSON'
    localStorage.setItem(PRESETS_STORAGE_KEY, storedPresets)

    expect(loadPresets({ id: 'default', name: 'Default', enabledServerIds: [] })).toEqual({
      presets: [],
      hasInvalidStoredData: true,
      wasDefaultPresetApplied: false,
    })
    expect(localStorage.getItem(PRESETS_STORAGE_KEY)).toBe(storedPresets)
  })

  it('keeps saving usable when storage is unavailable', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    expect(() => savePresets([])).not.toThrow()

    setItemSpy.mockRestore()
  })

  it('truncates stored and saved preset collections to the maximum', () => {
    const presets = Array.from({ length: MAX_PRESETS + 1 }, (_, index) => ({
      id: `preset-${index}`,
      name: `Preset ${index}`,
      enabledServerIds: [],
    }))

    savePresets(presets)

    expect(getPresets()).toEqual(presets.slice(0, MAX_PRESETS))
  })

  it('reports when it applies the default preset for missing storage', () => {
    expect(loadPresets({ id: 'default', name: 'Default', enabledServerIds: [] })).toEqual({
      presets: [{ id: 'default', name: 'Default', enabledServerIds: [] }],
      hasInvalidStoredData: false,
      wasDefaultPresetApplied: true,
    })
  })
})
