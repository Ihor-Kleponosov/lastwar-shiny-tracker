import { shinyTasksConfiguration } from '@/config'
import type { Preset, ServerId } from '@/types'

export const PRESETS_STORAGE_KEY = 'last-war-shiny-tracker-presets'
export const MAX_PRESET_SERVERS = 75

const configuredServerIds = [...new Set(shinyTasksConfiguration.serverGroups.flat())].sort(
  (first, second) => first - second,
)

function isPreset(value: unknown): value is Preset {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'enabledServerIds' in value &&
    Array.isArray(value.enabledServerIds) &&
    value.enabledServerIds.every((serverId) => typeof serverId === 'number')
  )
}

function normalizeEnabledServerIds(enabledServerIds: Iterable<ServerId>): ServerId[] {
  const selectedServerIds = new Set(enabledServerIds)

  return configuredServerIds
    .filter((serverId) => selectedServerIds.has(serverId))
    .slice(0, MAX_PRESET_SERVERS)
}

function normalizePresets(presets: readonly Preset[]): Preset[] {
  return presets.map((preset) => ({
    ...preset,
    enabledServerIds: normalizeEnabledServerIds(preset.enabledServerIds),
  }))
}

export function savePresets(presets: readonly Preset[]): void {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(normalizePresets(presets)))
  } catch {
    // Storage is optional; the in-memory presets state remains usable.
  }
}

export function getPresets(): Preset[] {
  try {
    const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY)

    if (storedPresets === null) {
      return []
    }

    const parsedPresets: unknown = JSON.parse(storedPresets)

    if (!Array.isArray(parsedPresets) || !parsedPresets.every(isPreset)) {
      return []
    }

    const presets = normalizePresets(parsedPresets)
    const serializedPresets = JSON.stringify(presets)

    if (serializedPresets !== storedPresets) {
      savePresets(presets)
    }

    return presets
  } catch {
    return []
  }
}
