import { useId, useRef, useState, type ChangeEvent, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import { Button } from '@/components/shared/ui/Button'
import { Checkbox } from '@/components/shared/ui/Checkbox'
import { Loader } from '@/components/shared/ui/Loader'
import type { Preset } from '@/types'
import { parsePresetTransfer, selectPresetsForImport } from '@/utils/presetTransfer'
import { MAX_PRESETS } from '@/utils/presets'

type PresetImportDialogProps = {
  presets: readonly Preset[]
  onClose: () => void
  onImport: (presets: readonly Preset[]) => boolean
  onLimitReached: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function PresetImportDialog({
  presets,
  onClose,
  onImport,
  onLimitReached,
  returnFocusRef,
}: PresetImportDialogProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [importedPresets, setImportedPresets] = useState<readonly Preset[] | null>(null)
  const [selectedPresetIds, setSelectedPresetIds] = useState<ReadonlySet<string>>(() => new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const availableSlots = Math.max(0, MAX_PRESETS - presets.length)

  useModalAccessibility({ dialogRef, isOpen: true, onClose, returnFocusRef })

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsProcessing(true)
    setError(null)
    setImportedPresets(null)
    setSelectedPresetIds(new Set())

    try {
      const transfer = parsePresetTransfer(await file.text())
      setImportedPresets(transfer.presets)
    } catch {
      setError(t('presets.importDialog.invalidFile'))
    } finally {
      setIsProcessing(false)
      event.target.value = ''
    }
  }

  function handleTogglePreset(presetId: string) {
    if (selectedPresetIds.has(presetId)) {
      const nextPresetIds = new Set(selectedPresetIds)
      nextPresetIds.delete(presetId)
      setSelectedPresetIds(nextPresetIds)
      return
    }

    const result = selectPresetsForImport(selectedPresetIds, [presetId], availableSlots)
    setSelectedPresetIds(result.selectedPresetIds)
    if (result.limitReached) {
      onLimitReached()
    }
  }

  function handleSelectAll() {
    if (!importedPresets) {
      return
    }

    const result = selectPresetsForImport(
      new Set(),
      importedPresets.map(({ id }) => id),
      availableSlots,
    )
    setSelectedPresetIds(result.selectedPresetIds)
    if (result.limitReached) {
      onLimitReached()
    }
  }

  function handleImport() {
    if (!importedPresets || selectedPresetIds.size === 0) {
      return
    }

    onImport(importedPresets.filter((preset) => selectedPresetIds.has(preset.id)))
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {t('presets.importDialog.title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('presets.importDialog.description')}
        </p>
        <label className="mt-5 block text-sm font-medium" htmlFor="preset-import-file">
          {t('presets.importDialog.fileLabel')}
        </label>
        <input
          id="preset-import-file"
          type="file"
          accept="application/json,.json"
          className="mt-2 block w-full text-sm text-[var(--color-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-surface)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--color-text-primary)]"
          onChange={handleFileChange}
        />
        {isProcessing ? (
          <div
            className="mt-5 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]"
            role="status"
          >
            <Loader className="size-6 border-2" />
            {t('presets.importDialog.loading')}
          </div>
        ) : null}
        {error ? (
          <p
            className="mt-4 rounded-lg border border-[var(--color-danger)] px-3 py-2 text-sm text-[var(--color-danger-text)]"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {importedPresets ? (
          <>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleSelectAll} disabled={availableSlots === 0}>
                {t('presets.export.selectAll')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedPresetIds(new Set())}
                disabled={selectedPresetIds.size === 0}
              >
                {t('presets.export.clearAll')}
              </Button>
            </div>
            <ul
              className="mt-4 max-h-72 overflow-y-auto"
              aria-label={t('presets.importDialog.listLabel')}
            >
              {importedPresets.map((preset) => (
                <li key={preset.id}>
                  <Checkbox
                    checked={selectedPresetIds.has(preset.id)}
                    disabled={!selectedPresetIds.has(preset.id) && availableSlots === 0}
                    label={preset.name}
                    onChange={() => handleTogglePreset(preset.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t('presets.export.close')}
          </Button>
          <Button disabled={selectedPresetIds.size === 0 || isProcessing} onClick={handleImport}>
            {t('presets.importDialog.action')}
          </Button>
        </div>
      </div>
    </div>
  )
}
