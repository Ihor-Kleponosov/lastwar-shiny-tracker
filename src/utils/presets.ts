import { shinyTasksConfiguration } from '@/config'
import type { Preset, ServerId } from '@/types'

export const PRESETS_STORAGE_KEY = 'last-war-shiny-tracker-presets'
export const SELECTED_PRESET_IDS_STORAGE_KEY = 'last-war-shiny-tracker-selected-preset-ids'
export const STORAGE_NOTICE_SHOWN_KEY = 'last-war-shiny-tracker-storage-notice-shown'
export const MAX_PRESET_SERVERS = 100
export const MAX_PRESETS = 30

export type PresetsLoadResult = {
  readonly presets: Preset[]
  readonly hasInvalidStoredData: boolean
  readonly wasDefaultPresetApplied: boolean
}

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

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function normalizeEnabledServerIds(enabledServerIds: Iterable<ServerId>): ServerId[] {
  const selectedServerIds = new Set(enabledServerIds)

  return configuredServerIds
    .filter((serverId) => selectedServerIds.has(serverId))
    .slice(0, MAX_PRESET_SERVERS)
}

function normalizePresets(presets: readonly Preset[]): Preset[] {
  return presets.slice(0, MAX_PRESETS).map((preset) => ({
    ...preset,
    enabledServerIds: normalizeEnabledServerIds(preset.enabledServerIds),
  }))
}

export function savePresets(presets: readonly Preset[]): boolean {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(normalizePresets(presets)))
    return true
  } catch {
    // Storage is optional; the in-memory presets state remains usable.
    return false
  }
}

export function saveSelectedPresetIds(selectedPresetIds: Iterable<string>): void {
  try {
    localStorage.setItem(
      SELECTED_PRESET_IDS_STORAGE_KEY,
      JSON.stringify([...new Set(selectedPresetIds)]),
    )
  } catch {
    // Storage is optional; the in-memory selection state remains usable.
  }
}

export function wasStorageNoticeShown(): boolean {
  try {
    return localStorage.getItem(STORAGE_NOTICE_SHOWN_KEY) === 'true'
  } catch {
    return false
  }
}

export function markStorageNoticeShown(): void {
  try {
    localStorage.setItem(STORAGE_NOTICE_SHOWN_KEY, 'true')
  } catch {
    // Storage is optional; the notice can be shown again on a later visit.
  }
}

export function getSelectedPresetIds(presets: readonly Preset[]): string[] {
  try {
    const storedSelectedPresetIds = localStorage.getItem(SELECTED_PRESET_IDS_STORAGE_KEY)

    if (storedSelectedPresetIds === null) {
      return []
    }

    const parsedSelectedPresetIds: unknown = JSON.parse(storedSelectedPresetIds)

    if (!Array.isArray(parsedSelectedPresetIds) || !parsedSelectedPresetIds.every(isString)) {
      return []
    }

    const availablePresetIds = new Set(presets.map((preset) => preset.id))
    return [...new Set(parsedSelectedPresetIds)].filter((presetId) =>
      availablePresetIds.has(presetId),
    )
  } catch {
    return []
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

export function loadPresets(defaultPreset: Preset): PresetsLoadResult {
  try {
    const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY)

    if (storedPresets === null) {
      const presets = [defaultPreset]
      savePresets(presets)
      return { presets, hasInvalidStoredData: false, wasDefaultPresetApplied: true }
    }

    const parsedPresets: unknown = JSON.parse(storedPresets)

    if (!Array.isArray(parsedPresets) || !parsedPresets.every(isPreset)) {
      return { presets: [], hasInvalidStoredData: true, wasDefaultPresetApplied: false }
    }

    const presets = normalizePresets(parsedPresets)
    savePresets(presets)
    return { presets, hasInvalidStoredData: false, wasDefaultPresetApplied: false }
  } catch {
    return { presets: [], hasInvalidStoredData: true, wasDefaultPresetApplied: false }
  }
}
