import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getConfiguredServerIds,
  getEnabledServerIds,
  saveEnabledServerIds,
  SERVER_PREFERENCES_STORAGE_KEY,
} from './serverPreferences'

describe('server preferences', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates the all-enabled default when preferences are absent', () => {
    expect(getEnabledServerIds()).toEqual(new Set(getConfiguredServerIds()))
    expect(localStorage.getItem(SERVER_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({ enabledServerIds: getConfiguredServerIds() }),
    )
  })

  it('removes stale and duplicate server IDs from saved preferences', () => {
    localStorage.setItem(
      SERVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ enabledServerIds: [1638, 1638, 9999] }),
    )

    expect(getEnabledServerIds()).toEqual(new Set([1638]))
    expect(localStorage.getItem(SERVER_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({ enabledServerIds: [1638] }),
    )
  })

  it('persists only configured server IDs', () => {
    saveEnabledServerIds(new Set([1638, 9999]))

    expect(localStorage.getItem(SERVER_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({ enabledServerIds: [1638] }),
    )
  })

  it('recovers from malformed preferences with the all-enabled default', () => {
    localStorage.setItem(SERVER_PREFERENCES_STORAGE_KEY, '{invalid JSON')

    expect(getEnabledServerIds()).toEqual(new Set(getConfiguredServerIds()))
    expect(localStorage.getItem(SERVER_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({ enabledServerIds: getConfiguredServerIds() }),
    )
  })

  it('keeps preferences usable when storage is unavailable', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    expect(() => saveEnabledServerIds(new Set())).not.toThrow()

    setItemSpy.mockRestore()
  })
})
