import { describe, expect, it } from 'vitest'
import type { Preset } from '@/types'
import {
  createImportedPresets,
  parsePresetTransfer,
  selectPresetsForImport,
  serializePresetsForTransfer,
} from './presetTransfer'

const transferredPresets: readonly Preset[] = [
  { id: 'first', name: 'First preset', enabledServerIds: [1638] },
  { id: 'second', name: 'Second preset', enabledServerIds: [] },
]

describe('preset import utilities', () => {
  it('parses valid exported files and rejects invalid JSON or preset structures', () => {
    expect(parsePresetTransfer(serializePresetsForTransfer(transferredPresets))).toEqual({
      version: 1,
      presets: transferredPresets,
    })
    expect(() => parsePresetTransfer('{')).toThrow()
    expect(() =>
      parsePresetTransfer(
        JSON.stringify({ version: 1, presets: [{ id: '', name: 'Bad', enabledServerIds: [] }] }),
      ),
    ).toThrow()
  })

  it('selects only available import slots and clears through an empty selection', () => {
    expect(selectPresetsForImport(new Set(), ['first', 'second'], 1)).toEqual({
      selectedPresetIds: new Set(['first']),
      limitReached: true,
    })
    expect(selectPresetsForImport(new Set(), [], 1).selectedPresetIds).toEqual(new Set())
  })

  it('imports duplicates as uniquely identified, conflict-free copies', () => {
    const imported = createImportedPresets(
      [{ id: 'existing', name: 'First preset', enabledServerIds: [] }],
      transferredPresets,
      (() => {
        const ids = ['existing', 'new-1', 'new-2']
        return () => ids.shift() ?? 'new-3'
      })(),
    )

    expect(imported).toEqual([
      { id: 'new-1', name: 'First preset Copy', enabledServerIds: [1638] },
      { id: 'new-2', name: 'Second preset', enabledServerIds: [] },
    ])
  })
})
