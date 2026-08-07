import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/shared/ui/Button'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'

type InitialPresetDialogProps = {
  onCancel: () => void
  onConfirm: (serverNumber: number) => void
}

export function InitialPresetDialog({ onCancel, onConfirm }: InitialPresetDialogProps) {
  const { t } = useTranslation('common')
  const [serverNumber, setServerNumber] = useState('')
  const dialogRef = useRef<HTMLFormElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useModalAccessibility({ dialogRef, isOpen: true, onClose: onCancel })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!serverNumber) {
      return
    }

    onConfirm(Number(serverNumber))
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
        onSubmit={handleSubmit}
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {t('presets.initialSetup.title')}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('presets.initialSetup.description')}
        </p>
        <label
          className="mt-5 flex flex-col gap-2 text-sm font-medium"
          htmlFor="initial-server-number"
        >
          {t('presets.initialSetup.serverNumberLabel')}
          <input
            id="initial-server-number"
            value={serverNumber}
            onChange={(event) => setServerNumber(event.target.value.replace(/\D/g, '').slice(0, 5))}
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]*"
            placeholder={t('presets.initialSetup.serverNumberPlaceholder')}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          />
        </label>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            {t('presets.initialSetup.cancel')}
          </Button>
          <Button type="submit" disabled={!serverNumber}>
            {t('presets.initialSetup.confirm')}
          </Button>
        </div>
      </form>
    </div>
  )
}
