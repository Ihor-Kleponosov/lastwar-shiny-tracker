import { useId, useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/shared/ui/Button'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import type { Preset } from '@/types'

type DeletePresetDialogProps = {
  preset: Preset
  onCancel: () => void
  onConfirm: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function DeletePresetDialog({
  preset,
  onCancel,
  onConfirm,
  returnFocusRef,
}: DeletePresetDialogProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useModalAccessibility({
    dialogRef,
    isOpen: true,
    onClose: onCancel,
    returnFocusRef,
  })

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {t('presets.deleteConfirmation.title')}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('presets.deleteConfirmation.description', { name: preset.name })}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            {t('presets.deleteConfirmation.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {t('presets.deleteConfirmation.confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
