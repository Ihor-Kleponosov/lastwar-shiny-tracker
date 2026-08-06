import { useId, useRef, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import { Button } from '@/components/shared/ui/Button'
import { Checkbox } from '@/components/shared/ui/Checkbox'
import type { Preset } from '@/types'

type PresetExportDialogProps = {
  presets: readonly Preset[]
  onClose: () => void
  onExport: (selectedPresetIds: ReadonlySet<string>) => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function PresetExportDialog({
  presets,
  onClose,
  onExport,
  returnFocusRef,
}: PresetExportDialogProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [selectedPresetIds, setSelectedPresetIds] = useState<ReadonlySet<string>>(() => new Set())

  useModalAccessibility({ dialogRef, isOpen: true, onClose, returnFocusRef })

  function handleTogglePreset(presetId: string) {
    setSelectedPresetIds((currentPresetIds) => {
      const nextPresetIds = new Set(currentPresetIds)
      const isPresetSelected = nextPresetIds.has(presetId)

      if (isPresetSelected) {
        nextPresetIds.delete(presetId)
      } else {
        nextPresetIds.add(presetId)
      }

      return nextPresetIds
    })
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
          {t('presets.export.title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('presets.export.description')}
        </p>
        {presets.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
            {t('presets.empty')}
          </p>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedPresetIds(new Set(presets.map(({ id }) => id)))}
              >
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
              aria-label={t('presets.export.listLabel')}
            >
              {presets.map((preset) => (
                <li key={preset.id}>
                  <Checkbox
                    checked={selectedPresetIds.has(preset.id)}
                    label={preset.name}
                    onChange={() => handleTogglePreset(preset.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t('presets.export.close')}
          </Button>
          <Button
            disabled={selectedPresetIds.size === 0}
            onClick={() => onExport(selectedPresetIds)}
          >
            {t('presets.export.action')}
          </Button>
        </div>
      </div>
    </div>
  )
}
