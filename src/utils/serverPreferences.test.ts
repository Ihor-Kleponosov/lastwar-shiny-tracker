import { describe, expect, it, vi } from 'vitest'
import { getConfiguredServerIds, MAX_ENABLED_SERVERS } from './serverPreferences'

vi.mock('@/config', () => ({
  shinyTasksConfiguration: {
    anchorDate: '2026-07-15',
    serverGroups: [Array.from({ length: 100 }, (_, index) => 1637 + index)],
  },
}))

describe('server configuration', () => {
  it('returns configured server IDs in numerical order', () => {
    expect(getConfiguredServerIds()).toEqual(
      Array.from({ length: 100 }, (_, index) => 1637 + index),
    )
  })

  it('defines a 75-server selection limit', () => {
    expect(MAX_ENABLED_SERVERS).toBe(75)
  })
})
