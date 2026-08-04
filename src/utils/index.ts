import { differenceInCalendarDays, parseISO } from 'date-fns'

import type { ServerId, ShinyTasksConfiguration } from '@/types'

export function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

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
