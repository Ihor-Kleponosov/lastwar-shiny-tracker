import { shinyTasksConfiguration } from '@/config'
import type { PersistedServerPreferences, ServerId } from '@/types'

export const SERVER_PREFERENCES_STORAGE_KEY = 'last-war-shiny-tracker-server-preferences'

const configuredServerIds = [...new Set(shinyTasksConfiguration.serverGroups.flat())].sort(
  (first, second) => first - second,
)

function isPersistedServerPreferences(value: unknown): value is PersistedServerPreferences {
  return (
    typeof value === 'object' &&
    value !== null &&
    'enabledServerIds' in value &&
    Array.isArray(value.enabledServerIds) &&
    value.enabledServerIds.every((serverId) => typeof serverId === 'number')
  )
}

function getDefaultEnabledServerIds(): Set<ServerId> {
  return new Set()
}

export function getConfiguredServerIds(): ServerId[] {
  return [...configuredServerIds]
}

export function saveEnabledServerIds(enabledServerIds: Set<ServerId>) {
  const preferences: PersistedServerPreferences = {
    enabledServerIds: configuredServerIds.filter((serverId) => enabledServerIds.has(serverId)),
  }

  try {
    localStorage.setItem(SERVER_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Storage is optional; the in-memory settings state remains usable.
  }
}

export function getEnabledServerIds(): Set<ServerId> {
  const defaultEnabledServerIds = getDefaultEnabledServerIds()

  try {
    const storedPreferences = localStorage.getItem(SERVER_PREFERENCES_STORAGE_KEY)

    if (storedPreferences === null) {
      return defaultEnabledServerIds
    }

    const preferences: unknown = JSON.parse(storedPreferences)

    if (isPersistedServerPreferences(preferences)) {
      const enabledServerIds = new Set(
        preferences.enabledServerIds.filter((serverId) => configuredServerIds.includes(serverId)),
      )

      if (enabledServerIds.size !== preferences.enabledServerIds.length) {
        saveEnabledServerIds(enabledServerIds)
      }

      return enabledServerIds
    }

    return defaultEnabledServerIds
  } catch {
    return defaultEnabledServerIds
  }
}
