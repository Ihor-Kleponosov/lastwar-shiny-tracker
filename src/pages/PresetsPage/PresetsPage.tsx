import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Header } from '@/components/app-shell/Header'
import { PresetList } from '@/components/features/presets/PresetList'
import { PresetConfigurationModal } from '@/components/features/settings/PresetConfigurationModal'
import { ActionFooter } from '@/components/shared/ui/ActionFooter'
import { Button } from '@/components/shared/ui/Button'
import { Notification } from '@/components/shared/ui/Notification'
import type { Preset } from '@/types'
import { defaultPreset } from '@/config'
import { generateUniqueId } from '@/utils'
import { loadPresets, MAX_PRESETS, savePresets } from '@/utils/presets'
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
  const [isDefaultPresetNoticeOpen, setIsDefaultPresetNoticeOpen] = useState(false)
  const presetTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const result = loadPresets(defaultPreset)

    if (result.hasInvalidStoredData) {
      toast.error(t('presets.invalidStorage'))
    }

    setPresets(result.presets)
    setIsDefaultPresetNoticeOpen(result.wasDefaultPresetApplied)
  }, [t])

  function handleAddPreset(trigger: HTMLButtonElement) {
    if (presets !== null && presets.length >= MAX_PRESETS) {
      toast.error(t('presets.limitReached', { count: MAX_PRESETS }))
      return
    }

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

  function handleSavePreset(nextPreset: Preset): boolean {
    if (presets === null) return false

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

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col gap-4 sm:gap-5">
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
            presets={presets ?? []}
            onClose={handleModalClose}
            onSave={handleSavePreset}
            returnFocusRef={presetTriggerRef}
            serverIds={getConfiguredServerIds()}
          />
        ) : null}
      </AnimatePresence>
      <Notification
        closeLabel={t('presets.defaultNotice.close')}
        label={t('presets.defaultNotice.label')}
        onClose={() => setIsDefaultPresetNoticeOpen(false)}
        open={isDefaultPresetNoticeOpen}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('presets.defaultNotice.message')}
        </p>
      </Notification>
    </main>
  )
}
