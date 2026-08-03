import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

type UnsavedChangesDialogProps = {
  onDiscard: () => void
  onReturn: () => void
}

export function UnsavedChangesDialog({ onDiscard, onReturn }: UnsavedChangesDialogProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    returnButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        onReturn()
        return
      }

      if (event.key !== 'Tab') return

      const buttons = Array.from(dialogRef.current?.querySelectorAll('button') ?? [])
      const firstButton = buttons[0]
      const lastButton = buttons.at(-1)

      if (!firstButton || !lastButton) return

      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault()
        lastButton.focus()
      } else if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault()
        firstButton.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [onReturn])

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onReturn()
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
        <h3 id={titleId} className="text-lg font-semibold">
          {t('settings.unsavedChanges.title')}
        </h3>
        <p id={descriptionId} className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('settings.unsavedChanges.description')}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={returnButtonRef} variant="secondary" onClick={onReturn}>
            {t('settings.unsavedChanges.return')}
          </Button>
          <Button variant="danger" onClick={onDiscard}>
            {t('settings.unsavedChanges.discard')}
          </Button>
        </div>
      </div>
    </div>
  )
}
