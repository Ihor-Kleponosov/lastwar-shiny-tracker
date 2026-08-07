import { format } from 'date-fns'
import type { Preset } from '@/types'
import { MAX_PRESET_SERVERS } from './presets'

export const PRESET_TRANSFER_VERSION = 1

export type PresetTransfer = {
  readonly version: typeof PRESET_TRANSFER_VERSION
  readonly presets: readonly Preset[]
}

export type PresetImportSelection = {
  readonly selectedPresetIds: ReadonlySet<string>
  readonly limitReached: boolean
}

function isPreset(value: unknown): value is Preset {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    value.name.length <= 20 &&
    'enabledServerIds' in value &&
    Array.isArray(value.enabledServerIds) &&
    value.enabledServerIds.length <= MAX_PRESET_SERVERS &&
    value.enabledServerIds.every((serverId) => Number.isSafeInteger(serverId))
  )
}

export function parsePresetTransfer(serializedTransfer: string): PresetTransfer {
  const parsedTransfer: unknown = JSON.parse(serializedTransfer)

  if (
    typeof parsedTransfer !== 'object' ||
    parsedTransfer === null ||
    !('version' in parsedTransfer) ||
    parsedTransfer.version !== PRESET_TRANSFER_VERSION ||
    !('presets' in parsedTransfer) ||
    !Array.isArray(parsedTransfer.presets) ||
    !parsedTransfer.presets.every(isPreset) ||
    new Set(parsedTransfer.presets.map((preset) => preset.id)).size !==
      parsedTransfer.presets.length
  ) {
    throw new Error('Invalid preset transfer')
  }

  return parsedTransfer as PresetTransfer
}

export function selectPresetsForImport(
  currentPresetIds: ReadonlySet<string>,
  presetIds: readonly string[],
  availableSlots: number,
): PresetImportSelection {
  const selectedPresetIds = new Set(currentPresetIds)
  let limitReached = false

  for (const presetId of presetIds) {
    if (selectedPresetIds.has(presetId)) {
      continue
    }

    if (selectedPresetIds.size >= availableSlots) {
      limitReached = true
      break
    }

    selectedPresetIds.add(presetId)
  }

  return { selectedPresetIds, limitReached }
}

export function createImportedPresets(
  existingPresets: readonly Preset[],
  importedPresets: readonly Preset[],
  generateId: () => string,
): Preset[] {
  const usedNames = new Set(existingPresets.map((preset) => preset.name.trim().toLowerCase()))
  const usedIds = new Set(existingPresets.map((preset) => preset.id))

  return importedPresets.map((preset) => {
    const baseName = preset.name.trim()
    let name = baseName
    let copyNumber = 1

    while (usedNames.has(name.toLowerCase())) {
      copyNumber += 1
      const suffix = copyNumber === 2 ? ' Copy' : ` Copy ${copyNumber - 1}`
      name = `${baseName.slice(0, 20 - suffix.length)}${suffix}`
    }

    usedNames.add(name.toLowerCase())
    let id = generateId()
    while (usedIds.has(id)) {
      id = generateId()
    }
    usedIds.add(id)

    return { id, name, enabledServerIds: [...preset.enabledServerIds] }
  })
}

export function createPresetTransfer(presets: readonly Preset[]): PresetTransfer {
  return { version: PRESET_TRANSFER_VERSION, presets }
}

export function serializePresetsForTransfer(presets: readonly Preset[]): string {
  return JSON.stringify(createPresetTransfer(presets))
}

export function getPresetTransferFilename(date: Date): string {
  return `last-war-shiny-tracker-presets-${format(date, 'yyyy-MM-dd')}.json`
}

export function downloadPresetTransfer(presets: readonly Preset[], date = new Date()): void {
  const blob = new Blob([serializePresetsForTransfer(presets)], { type: 'application/json' })
  const objectUrl = URL.createObjectURL(blob)

  try {
    const downloadLink = document.createElement('a')
    downloadLink.href = objectUrl
    downloadLink.download = getPresetTransferFilename(date)
    downloadLink.click()
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
