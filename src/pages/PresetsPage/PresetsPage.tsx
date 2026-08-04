import { AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/app-shell/Header'
import { PresetList } from '@/components/features/presets/PresetList'
import { PresetConfigurationModal } from '@/components/features/settings/PresetConfigurationModal'
import { ActionFooter } from '@/components/shared/ui/ActionFooter'
import { Button } from '@/components/shared/ui/Button'
import type { Preset } from '@/types'
import { generateUniqueId } from '@/utils'
import { getConfiguredServerIds } from '@/utils/serverPreferences'

type PresetsPageProps = {
  onBack: () => void
  onNavigateHome: () => void
}

export function PresetsPage({ onBack, onNavigateHome }: PresetsPageProps) {
  const { t } = useTranslation('common')
  const [presets, setPresets] = useState<readonly Preset[]>(() => [
    { id: generateUniqueId(), name: 'Main servers', enabledServerIds: [] },
    { id: generateUniqueId(), name: 'Event servers', enabledServerIds: [1692] },
    { id: generateUniqueId(), name: 'Backup servers', enabledServerIds: [] },
  ])
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
  const presetTriggerRef = useRef<HTMLButtonElement>(null)

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
    setPresets((currentPresets) =>
      currentPresets.filter((currentPreset) => currentPreset.id !== preset.id),
    )
  }

  function handleSavePreset(nextPreset: Preset) {
    setPresets((currentPresets) => {
      const nextPresets =
        editingPreset !== null
          ? currentPresets.map((preset) =>
              preset.id === editingPreset.id ? { ...nextPreset, id: editingPreset.id } : preset,
            )
          : [...currentPresets, { ...nextPreset, id: generateUniqueId() }]
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
          <PresetList
            presets={presets}
            onAdd={handleAddPreset}
            onDelete={handleDeletePreset}
            onEdit={handleEditPreset}
          />
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
