import { describe, expect, it } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import { getServerGroupIndexForDate } from '@/utils'
import { formatServerDateTime, getServerDate } from './serverTime'

const { serverTimeZone: timeZone } = shinyTasksConfiguration

describe('server time', () => {
  it('converts a device instant to the configured server timezone', () => {
    const deviceTime = new Date('2026-08-05T11:00:00.000Z')

    expect(formatServerDateTime(deviceTime, timeZone, 'yyyy-MM-dd HH:mm:ss')).toBe(
      '2026-08-05 09:00:00',
    )
  })

  it('uses the server date when crossing midnight', () => {
    const beforeMidnight = getServerDate(new Date('2026-07-16T01:59:59.000Z'), timeZone)
    const afterMidnight = getServerDate(new Date('2026-07-16T02:00:00.000Z'), timeZone)

    expect(getServerGroupIndexForDate(beforeMidnight, shinyTasksConfiguration)).toBe(0)
    expect(getServerGroupIndexForDate(afterMidnight, shinyTasksConfiguration)).toBe(1)
  })

  it('keeps the configured fixed server offset through daylight-saving dates', () => {
    expect(formatServerDateTime(new Date('2026-03-29T00:30:00.000Z'), timeZone, 'HH:mm')).toBe(
      '22:30',
    )
    expect(formatServerDateTime(new Date('2026-03-29T02:30:00.000Z'), timeZone, 'HH:mm')).toBe(
      '00:30',
    )
  })
})
