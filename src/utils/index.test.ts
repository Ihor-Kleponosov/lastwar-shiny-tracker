import { describe, expect, it } from 'vitest'

import type { ShinyTasksConfiguration } from '@/types'
import { getServerGroupIndexForDate, getServersForIndex } from '.'

const configuration: ShinyTasksConfiguration = {
  anchorDate: '2026-07-15',
  serverGroups: [
    [30, 10, 20],
    [60, 40, 50],
    [90, 70, 80],
  ],
}

const julyDate = (day: number) => new Date(2026, 6, day)

describe('getServerGroupIndexForDate', () => {
  it.each([
    { description: 'the anchor date', day: 15, expectedIndex: 0 },
    { description: 'the next date', day: 16, expectedIndex: 1 },
    { description: 'two dates after the anchor', day: 17, expectedIndex: 2 },
    { description: 'a complete cycle after the anchor', day: 18, expectedIndex: 0 },
    { description: 'the previous date', day: 14, expectedIndex: 2 },
    { description: 'two dates before the anchor', day: 13, expectedIndex: 1 },
    { description: 'five dates before the anchor', day: 10, expectedIndex: 1 },
  ])('returns index $expectedIndex for $description', ({ day, expectedIndex }) => {
    expect(getServerGroupIndexForDate(julyDate(day), configuration)).toBe(expectedIndex)
  })
})

describe('getServersForIndex', () => {
  it('returns a copy of the requested group without mutating configuration', () => {
    const servers = getServersForIndex(1, configuration)

    expect(servers).toEqual([60, 40, 50])

    servers.push(100)

    expect(configuration.serverGroups[1]).toEqual([60, 40, 50])
  })
})
