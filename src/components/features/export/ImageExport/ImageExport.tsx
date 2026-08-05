import { Image } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import { IconButton } from '@/components/shared/ui/IconButton'
import { Loader } from '@/components/shared/ui/Loader'
import type { ExportTheme } from '@/components/features/export/ExportView'
import type { Preset, ServerId } from '@/types'
import { downloadElementAsPng } from '@/utils/downloadElementAsPng'
import { getExportFilename } from '@/utils/exportFilename'
import { getCurrentMonthValue, getDateFromMonthValue } from '@/utils/month'
import { shinyTasksConfiguration } from '@/config'
import { ExportMonthPickerDialog } from './ExportMonthPickerDialog'
import { ExportPreviewDialog } from './ExportPreviewDialog'

type ImageExportProps = {
  presets: readonly Preset[]
  presetId?: string
  triggerLabel?: string
}

type ExportDialogStep = 'closed' | 'month-picker' | 'preview'

export function ImageExport({ presets, presetId, triggerLabel }: ImageExportProps) {
  const { t } = useTranslation('common')
  const [dialogStep, setDialogStep] = useState<ExportDialogStep>('closed')
  const [monthValue, setMonthValue] = useState(() =>
    getCurrentMonthValue(shinyTasksConfiguration.serverTimeZone),
  )
  const [presetValue, setPresetValue] = useState('')
  const [exportDate, setExportDate] = useState(() =>
    getDateFromMonthValue(getCurrentMonthValue(shinyTasksConfiguration.serverTimeZone)),
  )
  const [exportServerIds, setExportServerIds] = useState<ReadonlySet<ServerId>>(() => new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [exportTheme, setExportTheme] = useState<ExportTheme>('dark')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const exportViewRef = useRef<HTMLDivElement>(null)
  const isDialogOpen = dialogStep !== 'closed'

  const handleClose = useCallback(() => {
    setDialogStep('closed')
    setIsExporting(false)
  }, [])

  useModalAccessibility({
    dialogRef,
    focusKey: dialogStep,
    isOpen: isDialogOpen,
    onClose: handleClose,
    returnFocusRef: triggerRef,
  })

  const handleOpen = () => {
    setMonthValue(getCurrentMonthValue(shinyTasksConfiguration.serverTimeZone))
    setPresetValue(presetId ?? '')
    setDialogStep('month-picker')
  }

  const handleProceed = () => {
    const selectedPreset = presets.find((preset) => preset.id === presetValue)
    setExportDate(getDateFromMonthValue(monthValue))
    setExportServerIds(new Set(selectedPreset?.enabledServerIds ?? []))
    setDialogStep('preview')
  }

  const handleDownload = async () => {
    const exportView = exportViewRef.current
    if (!exportView) {
      console.error('Image export failed.', new Error('Export view was not mounted.'))
      return
    }

    setIsExporting(true)

    try {
      await downloadElementAsPng(exportView, getExportFilename(exportDate))
    } catch (error) {
      console.error('Image export failed.', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <IconButton
        ref={triggerRef}
        aria-label={triggerLabel ?? t('export.download')}
        onClick={handleOpen}
      >
        <Image aria-hidden="true" size={20} />
      </IconButton>
      {dialogStep === 'month-picker' ? (
        <ExportMonthPickerDialog
          dialogRef={dialogRef}
          monthValue={monthValue}
          presets={presets}
          presetValue={presetValue}
          isPresetDisabled={presetId !== undefined}
          onClose={handleClose}
          onMonthChange={setMonthValue}
          onPresetChange={setPresetValue}
          onProceed={handleProceed}
        />
      ) : null}
      {dialogStep === 'preview' ? (
        <ExportPreviewDialog
          dialogRef={dialogRef}
          enabledServerIds={exportServerIds}
          exportDate={exportDate}
          exportViewRef={exportViewRef}
          theme={exportTheme}
          isExporting={isExporting}
          onClose={handleClose}
          onDownload={handleDownload}
          onThemeChange={setExportTheme}
        />
      ) : null}
      {isExporting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]"
          role="status"
          aria-live="polite"
          aria-label={t('export.loading')}
        >
          <Loader />
        </div>
      ) : null}
    </>
  )
}
