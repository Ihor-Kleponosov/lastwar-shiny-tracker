import { format } from 'date-fns'
import type { Preset } from '@/types'

export const PRESET_TRANSFER_VERSION = 1

export type PresetTransfer = {
  readonly version: typeof PRESET_TRANSFER_VERSION
  readonly presets: readonly Preset[]
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
