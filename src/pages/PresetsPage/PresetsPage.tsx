import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Header } from '@/components/app-shell/Header'
import { DeletePresetDialog } from '@/components/features/presets/DeletePresetDialog'
import { PresetList } from '@/components/features/presets/PresetList'
import { PresetConfigurationModal } from '@/components/features/settings/PresetConfigurationModal'
import { StorageNoticeContent } from '@/components/features/settings/StorageNoticeContent'
import { ActionFooter } from '@/components/shared/ui/ActionFooter'
import { Button } from '@/components/shared/ui/Button'
import { HelpPopover } from '@/components/shared/ui/HelpPopover'
import { Notification } from '@/components/shared/ui/Notification'
import type { Preset } from '@/types'
import { markStorageNoticeShown, MAX_PRESETS, wasStorageNoticeShown } from '@/utils/presets'
import { getConfiguredServerIds } from '@/utils/serverPreferences'

type PresetsPageProps = {
  onBack: () => void
  onNavigateHome: () => void
  presets: readonly Preset[]
  onDeletePreset: (preset: Preset) => void
  onSavePreset: (preset: Preset, editingPreset: Preset | null) => boolean
}

export function PresetsPage({
  onBack,
  onNavigateHome,
  presets,
  onDeletePreset,
  onSavePreset,
}: PresetsPageProps) {
  const { t } = useTranslation('common')
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [presetPendingDeletion, setPresetPendingDeletion] = useState<Preset | null>(null)
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
  const [isStorageNoticeOpen, setIsStorageNoticeOpen] = useState(false)
  const deleteTriggerRef = useRef<HTMLButtonElement>(null)
  const presetTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (wasStorageNoticeShown()) return

    markStorageNoticeShown()
    setIsStorageNoticeOpen(true)
  }, [])

  function handleAddPreset(trigger: HTMLButtonElement) {
    if (presets.length >= MAX_PRESETS) {
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

  function handleDeletePreset(preset: Preset, trigger: HTMLButtonElement) {
    deleteTriggerRef.current = trigger
    setPresetPendingDeletion(preset)
  }

  function handleDeleteConfirmation() {
    if (presetPendingDeletion === null) return

    onDeletePreset(presetPendingDeletion)
    setPresetPendingDeletion(null)
  }

  function handleSavePreset(nextPreset: Preset): boolean {
    return onSavePreset(nextPreset, editingPreset)
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)] px-4 py-6 text-[var(--color-text-primary)] sm:px-6">
      <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col gap-4 sm:gap-5">
        <Header onNavigateHome={onNavigateHome} />
        <section
          className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:gap-4 sm:p-5"
          aria-labelledby="presets-page-title"
        >
          <div className="flex items-start justify-between gap-3">
            <h1
              id="presets-page-title"
              className="text-xl font-semibold text-[var(--color-text-primary)]"
            >
              {t('presets.pageTitle')}
            </h1>
            <HelpPopover
              label={t('settings.serverList.showDescription')}
              closeLabel={t('settings.serverList.closeDescription')}
            >
              <StorageNoticeContent />
            </HelpPopover>
          </div>
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
        {presetPendingDeletion ? (
          <DeletePresetDialog
            preset={presetPendingDeletion}
            onCancel={() => setPresetPendingDeletion(null)}
            onConfirm={handleDeleteConfirmation}
            returnFocusRef={deleteTriggerRef}
          />
        ) : null}
        {isPresetModalOpen ? (
          <PresetConfigurationModal
            preset={editingPreset}
            presets={presets}
            onClose={handleModalClose}
            onSave={handleSavePreset}
            returnFocusRef={presetTriggerRef}
            serverIds={getConfiguredServerIds()}
          />
        ) : null}
      </AnimatePresence>
      <Notification
        closeLabel={t('settings.serverList.closeStorageNotice')}
        label={t('settings.serverList.storageNotice.title')}
        onClose={() => setIsStorageNoticeOpen(false)}
        open={isStorageNoticeOpen}
      >
        <StorageNoticeContent />
      </Notification>
    </main>
  )
}
