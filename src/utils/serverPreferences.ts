import { shinyTasksConfiguration } from '@/config'
import type { ServerId } from '@/types'

export const MAX_ENABLED_SERVERS = 100

const configuredServerIds = [...new Set(shinyTasksConfiguration.serverGroups.flat())].sort(
  (first, second) => first - second,
)

export function getConfiguredServerIds(): ServerId[] {
  return [...configuredServerIds]
}
