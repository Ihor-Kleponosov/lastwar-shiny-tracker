import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { MainPage } from '@/pages/MainPage'
import { PresetsPage } from '@/pages/PresetsPage'
import { InitialPresetDialog } from '@/components/features/presets/InitialPresetDialog/InitialPresetDialog'
import type { Preset } from '@/types'
import { generateUniqueId } from '@/utils'
import {
  getServerIdsAround,
  loadPresets,
  MAX_PRESETS,
  savePresets,
  saveSelectedPresetIds,
} from '@/utils/presets'
import { createImportedPresets } from '@/utils/presetTransfer'

type AppRoute = 'main' | 'presets'

export default function App() {
  const { t } = useTranslation('common')
  const [route, setRoute] = useState<AppRoute>('main')
  const [presets, setPresets] = useState<readonly Preset[]>([])
  const [isPresetsLoaded, setIsPresetsLoaded] = useState(false)
  const [isInitialPresetDialogOpen, setIsInitialPresetDialogOpen] = useState(false)
  const [initialPresetId, setInitialPresetId] = useState<string>()
  const navigateToMain = () => setRoute('main')

  useEffect(() => {
    const result = loadPresets()

    setPresets(result.presets)
    setIsInitialPresetDialogOpen(result.needsInitialPresetSetup)
    setIsPresetsLoaded(true)

    if (result.hasInvalidStoredData) {
      toast.error(t('presets.invalidStorage'))
    }
  }, [t])

  function handleDeletePreset(preset: Preset) {
    setPresets((currentPresets) => {
      const nextPresets = currentPresets.filter((currentPreset) => currentPreset.id !== preset.id)
      savePresets(nextPresets)
      return nextPresets
    })
  }

  function handleSavePreset(nextPreset: Preset, editingPreset: Preset | null): boolean {
    const nextPresets =
      editingPreset !== null
        ? presets.map((preset) =>
            preset.id === editingPreset.id ? { ...nextPreset, id: editingPreset.id } : preset,
          )
        : [...presets, { ...nextPreset, id: generateUniqueId() }]
    const limitedPresets = nextPresets.slice(0, MAX_PRESETS)
    savePresets(limitedPresets)
    setPresets(limitedPresets)
    return true
  }

  function handleConfirmInitialPreset(serverNumber: number) {
    const preset: Preset = {
      id: generateUniqueId(),
      name: `Preset for ${serverNumber}`,
      enabledServerIds: getServerIdsAround(serverNumber),
    }

    savePresets([preset])
    saveSelectedPresetIds([preset.id])
    setPresets([preset])
    setInitialPresetId(preset.id)
    setIsInitialPresetDialogOpen(false)
  }

  function handleImportPresets(importedPresets: readonly Preset[]): boolean {
    if (presets.length + importedPresets.length > MAX_PRESETS) {
      return false
    }

    const nextPresets = [
      ...presets,
      ...createImportedPresets(presets, importedPresets, generateUniqueId),
    ]
    if (!savePresets(nextPresets)) {
      return false
    }

    setPresets(nextPresets)
    return true
  }

  if (!isPresetsLoaded) {
    return null
  }

  const page =
    route === 'presets' ? (
      <PresetsPage
        onBack={navigateToMain}
        onNavigateHome={navigateToMain}
        presets={presets}
        onDeletePreset={handleDeletePreset}
        onSavePreset={handleSavePreset}
        onImportPresets={handleImportPresets}
      />
    ) : (
      <MainPage
        onOpenPresets={() => setRoute('presets')}
        onNavigateHome={navigateToMain}
        initialPresetId={initialPresetId}
        presets={presets}
      />
    )

  return (
    <>
      {page}
      {isInitialPresetDialogOpen ? (
        <InitialPresetDialog
          onCancel={() => setIsInitialPresetDialogOpen(false)}
          onConfirm={handleConfirmInitialPreset}
        />
      ) : null}
    </>
  )
}
