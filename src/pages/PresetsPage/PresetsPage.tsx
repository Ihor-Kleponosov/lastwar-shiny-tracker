import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Header } from '@/components/app-shell/Header'
import { PresetList } from '@/components/features/presets/PresetList'
import { PresetConfigurationModal } from '@/components/features/settings/PresetConfigurationModal'
import { ActionFooter } from '@/components/shared/ui/ActionFooter'
import { Button } from '@/components/shared/ui/Button'
import type { Preset } from '@/types'
import { defaultPreset } from '@/config'
import { generateUniqueId } from '@/utils'
import { loadPresets, savePresets } from '@/utils/presets'
import { getConfiguredServerIds } from '@/utils/serverPreferences'

type PresetsPageProps = {
  onBack: () => void
  onNavigateHome: () => void
}

export function PresetsPage({ onBack, onNavigateHome }: PresetsPageProps) {
  const { t } = useTranslation('common')
  const [presets, setPresets] = useState<readonly Preset[] | null>(null)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
  const presetTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const result = loadPresets(defaultPreset)

    if (result.hasInvalidStoredData) {
      toast.error(t('presets.invalidStorage'))
    }

    setPresets(result.presets)
  }, [t])

  function handleAddPreset(trigger: HTMLButtonElement) {
    presetTriggerRef.current = trigger
    setIsPresetModalOpen(true)
  }

  function handleModalClose() {
    setEditingPreset(null)
    setIsPresetModalOpen(false)
  }

  function handleEditPreset(preset: Preset, trigger: HTMLButtonElement) {
    presetTriggerRef.current = trigger
    setEditingPreset(preset)
    setIsPresetModalOpen(true)
  }

  function handleDeletePreset(preset: Preset) {
    setPresets((currentPresets) => {
      if (currentPresets === null) {
        return currentPresets
      }

      const nextPresets = currentPresets.filter((currentPreset) => currentPreset.id !== preset.id)
      savePresets(nextPresets)
      return nextPresets
    })
  }

  function handleSavePreset(nextPreset: Preset) {
    setPresets((currentPresets) => {
      if (currentPresets === null) {
        return currentPresets
      }

      const nextPresets =
        editingPreset !== null
          ? currentPresets.map((preset) =>
              preset.id === editingPreset.id ? { ...nextPreset, id: editingPreset.id } : preset,
            )
          : [...currentPresets, { ...nextPreset, id: generateUniqueId() }]
      savePresets(nextPresets)
      return nextPresets
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] min-h-0 flex-1 flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <section
          className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:gap-4 sm:p-5"
          aria-labelledby="presets-page-title"
        >
          <h1
            id="presets-page-title"
            className="text-xl font-semibold text-[var(--color-text-primary)]"
          >
            {t('presets.pageTitle')}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t('presets.pageDescription')}
          </p>
          {presets === null ? null : (
            <PresetList
              presets={presets}
              onAdd={handleAddPreset}
              onDelete={handleDeletePreset}
              onEdit={handleEditPreset}
            />
          )}
        </section>
        <ActionFooter className="mt-auto">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={onBack}>
            {t('presets.back')}
          </Button>
        </ActionFooter>
      </div>
      <AnimatePresence>
        {isPresetModalOpen ? (
          <PresetConfigurationModal
            preset={editingPreset}
            onClose={handleModalClose}
            onSave={handleSavePreset}
            returnFocusRef={presetTriggerRef}
            serverIds={getConfiguredServerIds()}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
