import { differenceInCalendarDays, parseISO } from 'date-fns'

import type { ServerId, ShinyTasksConfiguration } from '@/types'

export function getServerGroupIndexForDate(
  date: Date,
  configuration: ShinyTasksConfiguration,
): number {
  const cycleLength = configuration.serverGroups.length
  const anchorDate = parseISO(configuration.anchorDate)
  const dayOffset = differenceInCalendarDays(date, anchorDate)

  return ((dayOffset % cycleLength) + cycleLength) % cycleLength
}

export function getServersForIndex(
  index: number,
  configuration: ShinyTasksConfiguration,
): ServerId[] {
  return [...configuration.serverGroups[index]]
}
