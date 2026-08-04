import type { RefObject } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/shared/ui/Button'
import type { Preset } from '@/types'

type ExportMonthPickerDialogProps = {
  dialogRef: RefObject<HTMLDivElement | null>
  monthValue: string
  presets: readonly Preset[]
  presetValue: string
  onClose: () => void
  onMonthChange: (monthValue: string) => void
  onPresetChange: (presetId: string) => void
  onProceed: () => void
}

export function ExportMonthPickerDialog({
  dialogRef,
  monthValue,
  presets,
  presetValue,
  onClose,
  onMonthChange,
  onPresetChange,
  onProceed,
}: ExportMonthPickerDialogProps) {
  const { t } = useTranslation('common')
  const titleId = useId()

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {t('export.title')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          {t('export.description')}
        </p>
        <label className="mt-5 flex flex-col gap-2 text-sm font-medium" htmlFor="export-month">
          {t('export.monthLabel')}
          <input
            id="export-month"
            type="month"
            value={monthValue}
            onChange={(event) => onMonthChange(event.target.value)}
            className="min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-base text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          />
        </label>
        <label className="mt-5 flex flex-col gap-2 text-sm font-medium" htmlFor="export-preset">
          {t('export.presetLabel')}
          <select
            id="export-preset"
            value={presetValue}
            onChange={(event) => onPresetChange(event.target.value)}
            className="min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-base text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <option value="">{t('export.noPreset')}</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t('export.close')}
          </Button>
          <Button onClick={onProceed} disabled={!monthValue}>
            {t('export.proceed')}
          </Button>
        </div>
      </div>
    </div>
  )
}
